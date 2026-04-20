"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  const { lang } = useI18n();
  return (
    <LegalLayout title={pick(t.legal.privacyTitle, lang)}>
      <div className="glass p-6 sm:p-8 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="h-display text-2xl font-bold mb-3">
          <span className="gradient-text">{pick(t.legal.comingSoon, lang)}</span>
        </h2>
        <p className="text-muted leading-relaxed">
          {pick(t.legal.placeholderBody, lang)}
        </p>
      </div>
    </LegalLayout>
  );
}
