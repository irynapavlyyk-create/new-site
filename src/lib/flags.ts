// Feature flags. NEXT_PUBLIC_* so the same value is visible to server routes
// and client components — the UI hides what the API refuses, never one
// without the other.

/**
 * Coach (monthly subscription) is off sale until the recurring deliverable
 * and a cancellation path exist — see docs/backlog.md. Off by default; set
 * NEXT_PUBLIC_COACH_ENABLED=true to re-enable. Guards the pricing cards AND
 * both checkout routes; the webhook / emails / schema keep handling "coach"
 * regardless (existing rows, Stripe replays).
 */
export const COACH_ENABLED = process.env.NEXT_PUBLIC_COACH_ENABLED === "true";
