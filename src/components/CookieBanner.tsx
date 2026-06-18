"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

const STORAGE_KEY = "energyforge_cookie_consent";

export default function CookieBanner() {
  const { lang } = useI18n();
  // Start hidden so SSR markup matches the first client render; the effect
  // below flips it to visible only when no consent is stored.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted") setVisible(true);
    } catch {
      // localStorage may be unavailable (private mode); fall back to showing
      // the banner — better to over-inform than to silently hide it.
      setVisible(true);
    }
  }, []);

  const accept = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, "accepted");
      } catch {
        // ignore: user will see the banner again next session
      }
      // Broadcast acceptance so consent-gated tags (e.g. PinterestTag) can
      // load immediately this session, without waiting for a reload.
      window.dispatchEvent(new Event("ef-cookie-consent"));
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={pick(t.cookieBanner.title, lang)}
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      <div
        className="glass mx-auto max-w-2xl px-5 py-4 sm:px-6 sm:py-5 pointer-events-auto"
        style={{ borderColor: "rgba(245, 158, 11, 0.35)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl flex-shrink-0 leading-none">🍪</span>
            <p className="text-sm text-ink leading-relaxed">
              {pick(t.cookieBanner.messageBeforeLink, lang)}
              <Link
                href="/privacy"
                className="text-amber hover:text-orange transition-colors font-semibold underline underline-offset-2"
              >
                {pick(t.cookieBanner.privacyLinkText, lang)}
              </Link>
              {pick(t.cookieBanner.messageAfterLink, lang)}
            </p>
          </div>
          <button
            type="button"
            onClick={accept}
            className="btn-primary text-sm py-2 px-5 flex-shrink-0 self-stretch sm:self-auto justify-center"
          >
            {pick(t.cookieBanner.dismiss, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
