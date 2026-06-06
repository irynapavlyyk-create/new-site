"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

export default function AffiliateDisclosure() {
  const { lang } = useI18n();
  return (
    <div
      role="note"
      className="glass mt-3 px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-3 rounded-xl"
    >
      <span className="text-xl flex-shrink-0 leading-none mt-0.5">🛒</span>
      <p className="text-xs sm:text-sm text-muted leading-relaxed">
        {pick(t.dashboard.affiliateDisclosure, lang)}
      </p>
    </div>
  );
}
