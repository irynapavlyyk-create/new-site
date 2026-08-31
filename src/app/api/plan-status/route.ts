import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { classifyPlanData } from "@/lib/planState";

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
 *  - summary field            → v1 (legacy)
 *  - anything else (incl. {}) → none (still generating / never generated)
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

  // A pending row (reserved before the Anthropic call) reads as "none" so the
  // forging screen keeps polling; only a real plan or error marker is ready.
  const kind = classifyPlanData(plan?.plan_data);
  const body: PlanStatus =
    kind === "none" || kind === "pending"
      ? { ready: false, kind: "none" }
      : { ready: true, kind };
  return NextResponse.json(body);
}
