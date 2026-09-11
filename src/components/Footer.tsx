"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { localizedPath } from "@/lib/locale-paths";
import { COMPANY } from "@/lib/company";

const SUPPORT_EMAIL = "support@energyforge.app";
const INSTAGRAM_URL = "https://www.instagram.com/energyforge.app/";

export default function Footer() {
  const { lang } = useI18n();
  return (
    <footer className="mt-12" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-xs" style={{ color: "#0A0A0F" }}>{"⚡︎"}</span>
          </div>
          <span className="font-display font-bold">EnergyForge</span>
          <span className="text-muted text-xs ml-2">
            © 2026 EnergyForge. {pick(t.footer.rights, lang)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <Link href={localizedPath(lang, "/privacy")} className="hover:text-ink transition-colors">
            {pick(t.footer.privacy, lang)}
          </Link>
          <Link href={localizedPath(lang, "/terms")} className="hover:text-ink transition-colors">
            {pick(t.footer.terms, lang)}
          </Link>
          <Link href={localizedPath(lang, "/refund-policy")} className="hover:text-ink transition-colors">
            {pick(t.footer.refund, lang)}
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="hover:text-ink transition-colors"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex items-center justify-between gap-4 text-xs text-muted">
        <div>
          {COMPANY.name} · IČO: {COMPANY.ico} · DIČ: {COMPANY.dic}
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          {COMPANY.addressEn}
        </div>
        {/* Icon-only social link. Padding gives a 44x44 hit area; negative margin keeps the row height unchanged. */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="inline-flex items-center justify-center p-3 -m-3 flex-shrink-0 rounded-lg hover:text-[#F59E0B] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
