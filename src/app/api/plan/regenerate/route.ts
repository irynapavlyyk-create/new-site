import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { createClient } from "@/utils/supabase/server";
import { generateAndSavePlan, type GenerateTier } from "@/lib/generatePlan";
import { classifyPlanData, isPendingStale } from "@/lib/planState";
import type { Lang, QuizAnswers } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Same budget as the webhook: the response returns immediately, generation
// continues under waitUntil() for up to 5 minutes.
export const maxDuration = 300;

/**
 * POST /api/plan/regenerate   body: { session_id?: string }
 *
 * Re-runs generation for a paid plan whose row holds an error marker (or a
 * pending marker orphaned by a dead instance). No new purchase, no new row:
 * the existing row is re-stamped pending and updated in place, exactly the
 * webhook flow. Works only on the caller's own plans (RLS) and never on a
 * row that already holds a real plan — a free re-roll would be a paid feature.
 *
 * Responses:
 *   202 { ok: true, session_id }   generation started; poll /api/plan-status
 *   401                            not signed in
 *   404 { error: "no plan" }       no matching row for this user
 *   409 { error: "in_progress" }   a fresh pending marker exists — still forging
 *   409 { error: "has_plan" }      row already holds a valid plan
 *   422 { error: "no_answers" }    row has no quiz answers to regenerate from
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let sessionId: string | null = null;
  try {
    const body = (await request.json()) as { session_id?: unknown };
    if (typeof body.session_id === "string" && body.session_id) sessionId = body.session_id;
  } catch {
    // no / invalid body → fall back to the user's most recent plan
  }

  // User-context client: RLS restricts this to the caller's own rows.
  let query = supabase
    .from("plans")
    .select("id, user_id, tier, language, answers, plan_data, stripe_session_id")
    .eq("user_id", user.id);
  if (sessionId) query = query.eq("stripe_session_id", sessionId);
  const { data: plan, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[regenerate] plans fetch failed:", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  if (!plan) {
    return NextResponse.json({ error: "no plan" }, { status: 404 });
  }

  const kind = classifyPlanData(plan.plan_data);
  if (kind === "v2" || kind === "v1") {
    return NextResponse.json({ error: "has_plan" }, { status: 409 });
  }
  if (kind === "pending" && !isPendingStale(plan.plan_data)) {
    return NextResponse.json({ error: "in_progress" }, { status: 409 });
  }

  const answers = plan.answers as QuizAnswers | null;
  if (!answers || typeof answers !== "object" || Object.keys(answers).length === 0) {
    return NextResponse.json({ error: "no_answers" }, { status: 422 });
  }

  const tier: GenerateTier = plan.tier === "coach" ? "coach" : "pro";
  const lang: Lang = plan.language === "cs" ? "cs" : "en";
  const rowSessionId = (plan.stripe_session_id as string | null) ?? `regen_${plan.id}`;

  console.log("[regenerate] starting", {
    planId: plan.id,
    userId: user.id,
    sessionId: rowSessionId,
    previousKind: kind,
  });

  // generateAndSavePlan uses the service-key client internally.
  waitUntil(
    generateAndSavePlan({
      userId: user.id,
      sessionId: rowSessionId,
      answers,
      lang,
      tier,
      existingPlanId: plan.id as string,
    })
  );

  return NextResponse.json({ ok: true, session_id: rowSessionId }, { status: 202 });
}
