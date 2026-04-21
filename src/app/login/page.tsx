"use client";

import { Suspense, useState } from "react";
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

function LoginForm() {
  const { lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

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
      {error && <div className="auth-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          className="btn-primary w-full justify-center disabled:opacity-60"
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
