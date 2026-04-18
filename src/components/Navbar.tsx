"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: "#how", label: pick(t.nav.how, lang) },
    { href: "#pricing", label: pick(t.nav.pricing, lang) },
    { href: "#faq", label: pick(t.nav.faq, lang) },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mt-4">
          <nav
            className="nav-bg rounded-2xl flex items-center justify-between gap-3 px-3 sm:px-5 py-3 flex-nowrap"
            style={{ border: "1px solid var(--border)" }}
          >
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center shadow-glow flex-shrink-0">
                <span
                  className="font-display font-bold text-sm"
                  style={{ color: "var(--btn-text)" }}
                >
                  ⚡
                </span>
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight truncate">
                EnergyForge
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6 text-sm text-muted flex-1 justify-center">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="hover:text-ink transition-colors whitespace-nowrap"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <LanguageSwitcher />

              <Link
                href="/quiz"
                className="btn-primary text-sm !px-4 !py-2 hidden lg:inline-flex whitespace-nowrap"
              >
                {pick(t.nav.cta, lang)}
              </Link>
              <Link
                href="/quiz"
                className="btn-primary text-sm !px-3 !py-2 hidden md:inline-flex lg:hidden whitespace-nowrap"
              >
                {pick(t.nav.ctaShort, lang)} →
              </Link>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={pick(t.nav.menu, lang)}
                aria-expanded={open}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {open && (
        <MobileMenu
          links={links}
          cta={pick(t.nav.cta, lang)}
          closeLabel={pick(t.nav.close, lang)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function MobileMenu({
  links,
  cta,
  closeLabel,
  onClose,
}: {
  links: { href: string; label: string }[];
  cta: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 mobile-bg flex flex-col lg:hidden animate-fade-up">
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link href="/" onClick={onClose} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber to-orange flex items-center justify-center shadow-glow">
            <span
              className="font-display font-bold text-sm"
              style={{ color: "var(--btn-text)" }}
            >
              ⚡
            </span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            EnergyForge
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="h-display text-3xl sm:text-4xl font-bold py-3 text-ink hover:text-amber transition-colors animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div
        className="px-6 pb-8 pt-4 flex flex-col items-center gap-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <Link
          href="/quiz"
          onClick={onClose}
          className="btn-primary w-full max-w-sm text-base py-3.5 justify-center"
        >
          {cta} →
        </Link>
      </div>
    </div>
  );
}
