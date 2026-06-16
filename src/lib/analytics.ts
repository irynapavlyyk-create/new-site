// Thin client-side wrapper around posthog-js. Every call is a no-op until
// PostHog is actually initialized (which only happens when
// NEXT_PUBLIC_POSTHOG_KEY is set — see PostHogProvider), so importing/using
// these helpers never crashes dev/preview environments without a key.
import posthog from "posthog-js";

function ready(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean((posthog as unknown as { __loaded?: boolean }).__loaded)
  );
}

/** Capture a product event. No-ops if PostHog isn't initialized. */
export function track(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!ready()) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Never let analytics break a user flow.
  }
}

/**
 * Current PostHog distinct_id, or null if PostHog isn't initialized. Passed
 * through Stripe checkout metadata so the server-side purchase_completed event
 * can be attributed to the same person.
 */
export function getDistinctId(): string | null {
  if (!ready()) return null;
  try {
    return posthog.get_distinct_id() ?? null;
  } catch {
    return null;
  }
}
