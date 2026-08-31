"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { localizedPath } from "@/lib/locale-paths";

export default function MedicalDisclaimer() {
  const { lang } = useI18n();
  return (
    <div
      role="note"
      className="glass mt-5 px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-3 rounded-xl"
      style={{ borderColor: "rgba(245, 158, 11, 0.35)" }}
    >
      <span className="text-xl flex-shrink-0 leading-none mt-0.5">⚠️</span>
      <p className="text-xs sm:text-sm text-muted leading-relaxed">
        {pick(t.dashboard.medicalDisclaimer.text, lang)}{" "}
        <Link
          href={`${localizedPath(lang, "/terms")}#medical-disclaimer`}
          className="text-amber hover:text-orange transition-colors font-semibold underline underline-offset-2"
        >
          {pick(t.dashboard.medicalDisclaimer.learnMore, lang)}
        </Link>
      </p>
    </div>
  );
}
