"use client";

import Script from "next/script";
import { useCookieConsent } from "@/lib/consent";

const PINTEREST_TAG_ID = "2613601962341";

/**
 * Pinterest base tag, gated behind cookie consent (see lib/consent.ts).
 * Renders nothing — and so loads no Pinterest script — until consent is
 * "accepted". No Enhanced Match (no email/em), and no <noscript> pixel (that
 * would fire without consent) — JS-injected tag only.
 */
export default function PinterestTag() {
  const consent = useCookieConsent();
  if (consent !== "accepted") return null;

  // Standard Pinterest base snippet: defines pintrk + queue, injects core.js
  // (the `if(!window.pintrk)` guard makes re-execution a no-op), then load+page.
  return (
    <Script id="pinterest-tag" strategy="afterInteractive">
      {`!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '${PINTEREST_TAG_ID}');
pintrk('page');`}
    </Script>
  );
}
