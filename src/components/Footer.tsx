"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

export default function Footer() {
  const { lang } = useI18n();
  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center">
            <span className="text-black font-bold text-xs">⚡</span>
          </div>
          <span className="font-display font-bold">EnergyForge</span>
          <span className="text-muted text-xs ml-2">© 2026. {pick(t.footer.rights, lang)}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-ink transition-colors">{pick(t.footer.privacy, lang)}</a>
          <a href="#" className="hover:text-ink transition-colors">{pick(t.footer.terms, lang)}</a>
          <a href="mailto:hi@energyforge.app" className="hover:text-ink transition-colors">{pick(t.footer.contact, lang)}</a>
        </div>
      </div>
    </footer>
  );
}
