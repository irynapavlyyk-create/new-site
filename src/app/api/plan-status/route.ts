import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
// Plan-status reads live DB on every poll — never cache.
export const dynamic = "force-dynamic";

type PlanStatus =
  | { ready: false; kind: "none" }
  | { ready: true; kind: "v2" | "v1" | "error" };

/**
 * GET /api/plan-status[?session_id=…]
 *
 * Returns the readiness of a plan. With session_id, scopes to THAT purchase's
 * plan (so the forging poll waits for the fresh plan, not a prior one); without
 * it, returns the user's most-recent plan. Mirrors the query + discriminator in
 * src/app/dashboard/page.tsx exactly:
 *  - phenotypeId field        → v2
 *  - error field, no summary  → error
 *  - object but neither above → v1 (legacy)
 *  - null / missing row       → none (still generating)
 */
export async function GET(request: Request): Promise<NextResponse> {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let query = supabase.from("plans").select("plan_data").eq("user_id", user.id);
  if (sessionId) query = query.eq("stripe_session_id", sessionId);

  const { data: plan, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[plan-status] plans fetch failed:", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  const planData = plan?.plan_data;
  const isObjectShape = planData !== null && typeof planData === "object";

  if (!isObjectShape) {
    const body: PlanStatus = { ready: false, kind: "none" };
    return NextResponse.json(body);
  }

  const obj = planData as Record<string, unknown>;
  if ("phenotypeId" in obj) {
    const body: PlanStatus = { ready: true, kind: "v2" };
    return NextResponse.json(body);
  }
  if ("error" in obj && !("summary" in obj)) {
    const body: PlanStatus = { ready: true, kind: "error" };
    return NextResponse.json(body);
  }
  const body: PlanStatus = { ready: true, kind: "v1" };
  return NextResponse.json(body);
}
