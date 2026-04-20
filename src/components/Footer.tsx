"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

const SUPPORT_EMAIL = "support@energyforge.app";

export default function Footer() {
  const { lang } = useI18n();
  return (
    <footer className="mt-12" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-xs" style={{ color: "var(--btn-text)" }}>⚡</span>
          </div>
          <span className="font-display font-bold">EnergyForge</span>
          <span className="text-muted text-xs ml-2">
            © 2026 EnergyForge. {pick(t.footer.rights, lang)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/privacy" className="hover:text-ink transition-colors">
            {pick(t.footer.privacy, lang)}
          </Link>
          <Link href="/terms" className="hover:text-ink transition-colors">
            {pick(t.footer.terms, lang)}
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="hover:text-ink transition-colors"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
