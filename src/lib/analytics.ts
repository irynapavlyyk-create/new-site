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

/**
 * Fire a Meta Pixel standard event. No-ops when the pixel isn't loaded
 * (NEXT_PUBLIC_FACEBOOK_PIXEL_ID unset, script blocked, SSR).
 */
export function fbqTrack(
  event: "ViewContent" | "Lead" | "InitiateCheckout" | "Purchase",
  params?: Record<string, unknown>,
  options?: { eventID?: string },
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("track", event, params, options);
  } catch {
    // Never let analytics break a user flow.
  }
}

/**
 * Fire Purchase at most once per Stripe session (dashboard can be reloaded
 * many times; Stripe Checkout also lands the buyer here after every visit
 * to the same success_url).
 */
export function fbqPurchaseOnce(sessionId: string, value: number, currency: string): void {
  const key = `ef_fb_purchase_${sessionId}`;
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
  } catch {
    // storage unavailable — fire anyway, dedupe is best-effort
  }
  fbqTrack("Purchase", { value, currency, content_name: "PRO plan" }, { eventID: sessionId });
}
