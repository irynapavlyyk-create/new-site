"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { lang } = useI18n();
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <nav className="nav-bg rounded-2xl flex items-center justify-between px-5 py-3" style={{ border: "1px solid var(--border)" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center shadow-glow">
              <span className="font-display font-bold text-sm" style={{ color: "var(--btn-text)" }}>⚡</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">EnergyForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#how" className="hover:text-ink transition-colors">{pick(t.nav.how, lang)}</a>
            <a href="#pricing" className="hover:text-ink transition-colors">{pick(t.nav.pricing, lang)}</a>
            <a href="#faq" className="hover:text-ink transition-colors">{pick(t.nav.faq, lang)}</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/quiz" className="btn-primary text-sm !px-4 !py-2 hidden sm:inline-flex">
              {pick(t.nav.cta, lang)}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
