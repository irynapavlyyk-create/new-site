// Single source of truth for interpreting plans.plan_data. Every reader
// (dashboard SSR, plan-status poll, PDF route) must go through this so a new
// marker shape can't be mis-rendered as a legacy v1 plan by one of them.
//
// plan_data is NOT NULL jsonb, so lifecycle markers live inside it:
//   { pending: true, started_at }  — row reserved before the Anthropic call
//   { error, detail }              — generation failed after retry
//   { phenotypeId, ... }           — ProPlanV2 (current)
//   { summary, ... }               — legacy ProPlan (v1)

export type PlanDataKind = "none" | "pending" | "v2" | "v1" | "error";

export const PENDING_MARKER_KEY = "pending" as const;

/** Pending rows older than this are considered orphaned by a dead instance
 *  and may be re-claimed by a Stripe retry or the dashboard retry button.
 *  generatePlan resolves within 270 s and the function is killed at 300 s, so
 *  anything still pending after 330 s is definitely dead. Keep in sync with
 *  SAFETY_CAP_MS in DashboardClient.tsx so the timeout screen's retry works. */
export const PENDING_STALE_MS = 330_000;

export function makePendingMarker(startedAt = new Date()): Record<string, unknown> {
  return { [PENDING_MARKER_KEY]: true, started_at: startedAt.toISOString() };
}

export function classifyPlanData(planData: unknown): PlanDataKind {
  if (planData === null || typeof planData !== "object") return "none";
  const obj = planData as Record<string, unknown>;
  if (obj[PENDING_MARKER_KEY] === true && !("summary" in obj)) return "pending";
  if ("phenotypeId" in obj) return "v2";
  if ("error" in obj && !("summary" in obj)) return "error";
  return "v1";
}

export function isPendingStale(planData: unknown, now = Date.now()): boolean {
  if (classifyPlanData(planData) !== "pending") return false;
  const started = (planData as Record<string, unknown>).started_at;
  const ts = typeof started === "string" ? Date.parse(started) : NaN;
  // Unparseable timestamp → treat as stale rather than pending forever.
  if (Number.isNaN(ts)) return true;
  return now - ts > PENDING_STALE_MS;
}
