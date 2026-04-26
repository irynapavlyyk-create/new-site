"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function authErrorMessage(
  code: string | null,
  lang: "en" | "ru"
): string | null {
  if (!code) return null;
  if (code === "link_expired" || code === "otp_expired") {
    return pick(t.auth.linkExpired, lang);
  }
  if (code === "access_denied") {
    return pick(t.auth.accessDenied, lang);
  }
  return pick(t.auth.authErrorGeneric, lang);
}

function LoginForm() {
  const { lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/dashboard";
  const linkError = authErrorMessage(params.get("error"), lang);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSentTo, setMagicSentTo] = useState<string | null>(null);
  const [magicError, setMagicError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | "magic" | null>(null);

  // If a server-side redirect preserved Supabase's hash error (e.g.
  // #error=access_denied&error_code=otp_expired), lift it into the query
  // string so the banner renders and the URL is reload-safe.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("error=")) return;
    const hashParams = new URLSearchParams(hash.slice(1));
    const raw =
      hashParams.get("error_code") || hashParams.get("error") || "access_denied";
    const normalized = raw === "otp_expired" ? "link_expired" : raw;
    const url = new URL(window.location.href);
    url.searchParams.set("error", normalized);
    url.hash = "";
    router.replace(url.pathname + url.search);
  }, [router]);

  useEffect(() => {
    // Don't auto-redirect away from /login if we're showing an auth error —
    // the user landed here because something went wrong and needs to see why.
    if (linkError) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(redirectTo);
    });
  }, [router, redirectTo, linkError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading("email");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(null);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMagicError(null);
    setMagicSentTo(null);
    setLoading("magic");
    const supabase = createClient();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    // Supabase returns success even when the email is not in the DB (security
    // best practice — does not leak which emails exist). Showing the success
    // state in both cases is intentional and correct.
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (otpError) {
      setMagicError(otpError.message || pick(t.auth.magicLinkError, lang));
      setLoading(null);
      return;
    }
    setMagicSentTo(magicEmail);
    setLoading(null);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading("google");
    const supabase = createClient();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(null);
    }
  };

  return (
    <AuthLayout
      title={pick(t.auth.loginTitle, lang)}
      subtitle={pick(t.auth.loginSubtitle, lang)}
    >
      {linkError && <div className="auth-error mb-4">{linkError}</div>}

      <section aria-labelledby="magic-link-heading" className="mb-6">
        <h2
          id="magic-link-heading"
          className="h-display text-lg font-bold mb-1"
        >
          {pick(t.auth.magicLinkTitle, lang)}
        </h2>
        <p className="text-xs text-muted mb-4">
          {pick(t.auth.magicLinkSubtitle, lang)}
        </p>
        {magicError && <div className="auth-error mb-3">{magicError}</div>}
        {magicSentTo ? (
          <div
            className="text-sm rounded-lg px-4 py-3"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            ✨ {pick(t.auth.magicLinkSent, lang)}{" "}
            <span className="text-amber font-semibold break-all">
              {magicSentTo}
            </span>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-3" noValidate>
            <div>
              <label htmlFor="magic-email" className="auth-label">
                {pick(t.auth.email, lang)}
              </label>
              <input
                id="magic-email"
                type="email"
                autoComplete="email"
                required
                className="auth-input"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                disabled={loading !== null}
              />
            </div>
            <button
              type="submit"
              disabled={loading !== null || !magicEmail}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading === "magic"
                ? pick(t.auth.working, lang)
                : pick(t.auth.magicLinkButton, lang)}
            </button>
          </form>
        )}
      </section>

      <div className="auth-divider">{pick(t.auth.orPassword, lang)}</div>

      {error && <div className="auth-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <label htmlFor="email" className="auth-label">
            {pick(t.auth.email, lang)}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading !== null}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="password" className="auth-label mb-0">
              {pick(t.auth.password, lang)}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted hover:text-amber transition-colors"
            >
              {pick(t.auth.forgotPassword, lang)}
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading !== null}
          />
        </div>

        <button
          type="submit"
          disabled={loading !== null}
          className="btn-ghost w-full justify-center disabled:opacity-60"
        >
          {loading === "email" ? pick(t.auth.working, lang) : pick(t.auth.signIn, lang)}
        </button>
      </form>

      <div className="auth-divider">{pick(t.auth.orContinueWith, lang)}</div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== null}
        className="auth-google-btn"
      >
        <GoogleIcon />
        <span>{pick(t.auth.signInWithGoogle, lang)}</span>
      </button>

      <p className="text-sm text-muted text-center mt-6">
        {pick(t.auth.noAccount, lang)}{" "}
        <Link href="/signup" className="text-amber hover:text-orange transition-colors font-semibold">
          {pick(t.auth.signUp, lang)}
        </Link>
      </p>
    </AuthLayout>
  );
}
