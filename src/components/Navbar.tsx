"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { lang } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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

  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const links = [
    { href: "#how", label: pick(t.nav.how, lang) },
    { href: "#pricing", label: pick(t.nav.pricing, lang) },
    { href: "#faq", label: pick(t.nav.faq, lang) },
  ];

  const signInLabel = pick(t.nav.signIn, lang);
  const dashboardLabel = pick(t.nav.dashboard, lang);
  const settingsLabel = pick(t.nav.settings, lang);
  const signOutLabel = pick(t.nav.signOut, lang);

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

              {/* Desktop auth area */}
              <div className="hidden lg:flex items-center gap-3">
                {isLoading ? (
                  <div
                    className="w-9 h-9 rounded-full"
                    style={{ background: "var(--card-bg)" }}
                    aria-hidden="true"
                  />
                ) : user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((v) => !v)}
                      aria-label={pick(t.nav.profile, lang)}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="menu"
                      className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber/60"
                    >
                      <UserAvatar user={user} size={36} />
                    </button>

                    {dropdownOpen && (
                      <ProfileDropdown
                        user={user}
                        dashboardLabel={dashboardLabel}
                        settingsLabel={settingsLabel}
                        signOutLabel={signOutLabel}
                        onItemClick={() => setDropdownOpen(false)}
                        onSignOut={handleSignOut}
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm text-muted hover:text-ink hover:underline underline-offset-4 transition-colors whitespace-nowrap"
                  >
                    {signInLabel}
                  </Link>
                )}

                {user ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary text-sm !px-4 !py-2 whitespace-nowrap"
                  >
                    {dashboardLabel} →
                  </Link>
                ) : (
                  <Link
                    href="/quiz"
                    className="btn-primary text-sm !px-4 !py-2 whitespace-nowrap"
                  >
                    {pick(t.nav.cta, lang)}
                  </Link>
                )}
              </div>

              {/* Medium screens: compact CTA only */}
              {!isLoading && (
                <Link
                  href={user ? "/dashboard" : "/quiz"}
                  className="btn-primary text-sm !px-3 !py-2 hidden md:inline-flex lg:hidden whitespace-nowrap"
                >
                  {user ? dashboardLabel : pick(t.nav.ctaShort, lang)} →
                </Link>
              )}

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
          signInLabel={signInLabel}
          dashboardLabel={dashboardLabel}
          settingsLabel={settingsLabel}
          signOutLabel={signOutLabel}
          profileLabel={pick(t.nav.profile, lang)}
          user={user}
          isLoading={isLoading}
          onClose={() => setOpen(false)}
          onSignOut={handleSignOut}
        />
      )}
    </>
  );
}

function ProfileDropdown({
  user,
  dashboardLabel,
  settingsLabel,
  signOutLabel,
  onItemClick,
  onSignOut,
}: {
  user: User;
  dashboardLabel: string;
  settingsLabel: string;
  signOutLabel: string;
  onItemClick: () => void;
  onSignOut: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl overflow-hidden profile-dropdown origin-top-right"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <p className="text-xs text-muted truncate" title={user.email ?? ""}>
          {user.email}
        </p>
      </div>

      <div className="py-1">
        <Link
          href="/dashboard"
          onClick={onItemClick}
          role="menuitem"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-amber/10 transition-colors"
        >
          <span aria-hidden="true">⚡</span>
          <span>{dashboardLabel}</span>
        </Link>
        <Link
          href="/settings"
          onClick={onItemClick}
          role="menuitem"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-amber/10 transition-colors"
        >
          <span aria-hidden="true">⚙️</span>
          <span>{settingsLabel}</span>
        </Link>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          type="button"
          onClick={onSignOut}
          role="menuitem"
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
          style={{ color: "rgb(var(--orange))" }}
        >
          <span aria-hidden="true">🚪</span>
          <span>{signOutLabel}</span>
        </button>
      </div>
    </div>
  );
}

function MobileMenu({
  links,
  cta,
  closeLabel,
  signInLabel,
  dashboardLabel,
  settingsLabel,
  signOutLabel,
  profileLabel,
  user,
  isLoading,
  onClose,
  onSignOut,
}: {
  links: { href: string; label: string }[];
  cta: string;
  closeLabel: string;
  signInLabel: string;
  dashboardLabel: string;
  settingsLabel: string;
  signOutLabel: string;
  profileLabel: string;
  user: User | null;
  isLoading: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 mobile-bg flex flex-col lg:hidden animate-fade-up overflow-y-auto">
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

      {user && !isLoading && (
        <div className="px-6 pt-5">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
            }}
          >
            <UserAvatar user={user} size={48} />
            <div className="min-w-0">
              <p className="text-xs text-muted mb-0.5">{profileLabel}</p>
              <p className="text-sm font-medium text-ink truncate" title={user.email ?? ""}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-8">
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
        {!isLoading && !user && (
          <Link
            href="/login"
            onClick={onClose}
            className="w-full max-w-sm text-base py-3 rounded-full text-center font-medium transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "rgb(var(--text))",
            }}
          >
            {signInLabel}
          </Link>
        )}

        {!isLoading && user && (
          <>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="btn-primary w-full max-w-sm text-base py-3.5 justify-center"
            >
              {dashboardLabel} →
            </Link>
            <Link
              href="/settings"
              onClick={onClose}
              className="w-full max-w-sm text-base py-3 rounded-full text-center font-medium transition-colors"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                color: "rgb(var(--text))",
              }}
            >
              {settingsLabel}
            </Link>
          </>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {!isLoading && !user && (
          <Link
            href="/quiz"
            onClick={onClose}
            className="btn-primary w-full max-w-sm text-base py-3.5 justify-center"
          >
            {cta} →
          </Link>
        )}

        {!isLoading && user && (
          <>
            <div
              className="w-full max-w-sm"
              style={{ borderTop: "1px solid var(--border)" }}
            />
            <button
              type="button"
              onClick={onSignOut}
              className="w-full max-w-sm text-base py-3 rounded-full font-medium transition-colors"
              style={{
                border: "1px solid rgba(255, 107, 53, 0.3)",
                background: "rgba(255, 107, 53, 0.08)",
                color: "rgb(var(--orange))",
              }}
            >
              🚪 {signOutLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
