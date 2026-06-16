// Server-side PostHog capture (posthog-node) for events that must fire from
// trusted code — e.g. purchase_completed from the Stripe webhook. Guarded on
// NEXT_PUBLIC_POSTHOG_KEY: a no-op when the key is absent, so it never breaks
// the webhook in dev/preview without analytics configured.
//
// Uses the same project API key as the browser SDK (that key is for ingestion;
// it is intentionally public). A fresh client per call with flushAt:1 +
// awaited shutdown() guarantees the single event is flushed before the
// serverless function freezes — important under waitUntil().
import { PostHog } from "posthog-node";

export async function captureServerEvent(params: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || !params.distinctId) return;

  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

  const client = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  try {
    client.capture({
      distinctId: params.distinctId,
      event: params.event,
      properties: params.properties,
    });
    await client.shutdown();
  } catch (err) {
    console.error("[posthog-server] capture failed:", err);
  }
}
