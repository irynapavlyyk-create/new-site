"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { lang } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email)) {
      setError(pick(t.auth.invalidEmail, lang));
      return;
    }
    if (password.length < 8) {
      setError(pick(t.auth.passwordTooShort, lang));
      return;
    }
    if (password !== confirm) {
      setError(pick(t.auth.passwordsDoNotMatch, lang));
      return;
    }
    if (!agree) {
      setError(pick(t.auth.mustAgree, lang));
      return;
    }

    setLoading("email");
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(null);
      return;
    }
    setSuccess(true);
    setLoading(null);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading("google");
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(null);
    }
  };

  if (success) {
    return (
      <AuthLayout title={pick(t.auth.signupTitle, lang)}>
        <div className="auth-success text-center">
          <div className="text-4xl mb-3">📬</div>
          <p>{pick(t.auth.checkEmailSignup, lang)}</p>
        </div>
        <p className="text-sm text-muted text-center mt-6">
          <Link href="/login" className="text-amber hover:text-orange transition-colors font-semibold">
            {pick(t.auth.signIn, lang)}
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={pick(t.auth.signupTitle, lang)}
      subtitle={pick(t.auth.signupSubtitle, lang)}
    >
      {error && <div className="auth-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="auth-label">
            {pick(t.auth.name, lang)}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading !== null}
          />
        </div>

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
          <label htmlFor="password" className="auth-label">
            {pick(t.auth.password, lang)}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading !== null}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="auth-label">
            {pick(t.auth.confirmPassword, lang)}
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="auth-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading !== null}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading !== null}
            className="mt-1 w-4 h-4 accent-amber cursor-pointer flex-shrink-0"
          />
          <span>
            {pick(t.auth.agreeToTerms, lang)}{" "}
            <Link href="/terms" className="text-amber hover:text-orange transition-colors">
              {pick(t.auth.termsLink, lang)}
            </Link>{" "}
            {pick(t.auth.and, lang)}{" "}
            <Link href="/privacy" className="text-amber hover:text-orange transition-colors">
              {pick(t.auth.privacyLink, lang)}
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading !== null}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading === "email" ? pick(t.auth.working, lang) : pick(t.auth.createAccount, lang)}
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
        <span>{pick(t.auth.signUpWithGoogle, lang)}</span>
      </button>

      <p className="text-sm text-muted text-center mt-6">
        {pick(t.auth.haveAccount, lang)}{" "}
        <Link href="/login" className="text-amber hover:text-orange transition-colors font-semibold">
          {pick(t.auth.signIn, lang)}
        </Link>
      </p>
    </AuthLayout>
  );
}
