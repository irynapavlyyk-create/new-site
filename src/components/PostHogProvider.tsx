"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

// Initialize once, client-side only, and ONLY when a key is present. Without a
// key this is a no-op, so dev/preview without PostHog configured never crashes.
if (typeof window !== "undefined" && KEY && !(posthog as unknown as { __loaded?: boolean }).__loaded) {
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // captured manually on App Router route changes
    capture_pageleave: true,
  });
}

// Manual pageview tracking for the App Router. Wrapped in <Suspense> by the
// provider because useSearchParams() would otherwise opt every page into
// dynamic rendering and break static generation.
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !(posthog as unknown as { __loaded?: boolean }).__loaded) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
