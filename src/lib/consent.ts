"use client";

import { useEffect, useState } from "react";

// Single source of truth for cookie consent. CookieBanner writes it; every
// consent-gated tag (MetaPixel, PostHogProvider, PinterestTag) reads it
// through useCookieConsent() and mounts nothing until it is "accepted".
export const CONSENT_KEY = "energyforge_cookie_consent";
export const CONSENT_EVENT = "ef-cookie-consent";

/** null = no decision yet (banner visible). */
export type Consent = "accepted" | "declined" | null;

export function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Exclude<Consent, null>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // ignore: user will see the banner again next session
  }
  // Same-session broadcast so gated tags react without a reload.
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

/**
 * Current consent, kept in sync with a prior-session value (on mount), a
 * same-session decision (CONSENT_EVENT) and a decision in another tab
 * (`storage`). Always null during SSR and the first client render.
 */
export function useCookieConsent(): Consent {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return consent;
}
