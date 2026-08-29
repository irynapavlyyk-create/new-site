"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useCookieConsent } from "@/lib/consent";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

function isLoaded(): boolean {
  return Boolean((posthog as unknown as { __loaded?: boolean }).__loaded);
}

// Manual pageview tracking for the App Router. Wrapped in <Suspense> by the
// provider because useSearchParams() would otherwise opt every page into
// dynamic rendering and break static generation. No-op until PostHog is
// initialized, i.e. until consent is "accepted".
function PostHogPageView({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !pathname || !isLoaded()) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [enabled, pathname, searchParams]);

  return null;
}

/**
 * PostHog, gated behind cookie consent: posthog.init() runs only once consent
 * is "accepted" (prior session on mount, or same-session via the consent
 * event), and ONLY when a key is present — without a key this stays a no-op,
 * so dev/preview without PostHog configured never crashes. Before init every
 * track()/capture() in lib/analytics.ts is a no-op (it checks __loaded).
 */
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const consent = useCookieConsent();
  const enabled = consent === "accepted" && Boolean(KEY);

  useEffect(() => {
    if (!enabled || isLoaded()) return;
    posthog.init(KEY as string, {
      api_host: HOST,
      capture_pageview: false, // captured manually on App Router route changes
      capture_pageleave: true,
    });
  }, [enabled]);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView enabled={enabled} />
      </Suspense>
      {children}
    </PHProvider>
  );
}
