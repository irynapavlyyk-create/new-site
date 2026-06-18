"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Mirrors CookieBanner's storage key + the event it dispatches on accept.
const CONSENT_KEY = "energyforge_cookie_consent";
const CONSENT_EVENT = "ef-cookie-consent";
const PINTEREST_TAG_ID = "2613601962341";

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/**
 * Pinterest base tag, gated behind cookie consent. Renders nothing — and so
 * loads no Pinterest script — until consent is "accepted". Picks up a
 * prior-session acceptance on mount, and a same-session acceptance via the
 * "ef-cookie-consent" event the banner dispatches (plus cross-tab `storage`).
 * No Enhanced Match (no email/em), and no <noscript> pixel (that would fire
 * without consent) — JS-injected tag only.
 */
export default function PinterestTag() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      if (hasConsent()) setConsented(true);
    };
    check(); // prior-session acceptance
    window.addEventListener(CONSENT_EVENT, check); // same-session acceptance
    window.addEventListener("storage", check); // acceptance in another tab
    return () => {
      window.removeEventListener(CONSENT_EVENT, check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!consented) return null;

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
