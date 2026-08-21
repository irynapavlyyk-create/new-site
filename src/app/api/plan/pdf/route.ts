import { createElement, type ReactElement } from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/utils/supabase/server";
import { getPhenotype } from "@/lib/phenotypes";
import { registerFonts } from "@/lib/pdf/fonts";
import { PlanDocument } from "@/lib/pdf/PlanDocument";
import type { Lang, ProPlanV2 } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Mirror the dashboard's query exactly: session-scope a fresh purchase,
  // else fall back to the user's most recent plan.
  let query = supabase.from("plans").select("*").eq("user_id", user.id);
  if (sessionId) query = query.eq("stripe_session_id", sessionId);

  const { data: plan } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const planData = plan?.plan_data;
  const isV2 =
    planData !== null &&
    typeof planData === "object" &&
    "phenotypeId" in (planData as Record<string, unknown>);

  if (!isV2) {
    return NextResponse.json({ error: "no plan" }, { status: 404 });
  }

  const v2 = planData as ProPlanV2;
  const lang = (plan?.language as Lang | null) ?? "en";
  const phenotype = getPhenotype(v2.phenotypeId);

  const generatedAt = new Date().toLocaleDateString(
    lang === "cs" ? "cs-CZ" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  registerFonts();
  // renderToBuffer is typed to want a <Document> element directly; a wrapper
  // component's element needs a cast through the expected DocumentProps shape.
  const element = createElement(PlanDocument, {
    plan: v2,
    phenotype,
    lang,
    generatedAt,
  }) as unknown as ReactElement<DocumentProps>;
  const pdf = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="energyforge-plan.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
