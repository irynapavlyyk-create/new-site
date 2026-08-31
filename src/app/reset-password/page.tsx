"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/AuthLayout";

// Landing page of the password-recovery flow: the email link goes through
// /auth/callback?next=/reset-password, which exchanges the code for a session
// server-side, so by the time this renders the user is signed in with a
// recovery session and updateUser({ password }) works. Without a session
// (expired/used link, direct visit) we show "link expired" + a way to request
// a fresh email instead of a form that would silently fail.
export default function ResetPasswordPage() {
  const { lang } = useI18n();
  const router = useRouter();

  const [sessionState, setSessionState] = useState<"checking" | "ready" | "expired">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setSessionState(data.user ? "ready" : "expired"))
      .catch(() => setSessionState("expired"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(pick(t.signup.passwordTooShort, lang));
      return;
    }
    if (password !== confirm) {
      setError(pick(t.signup.passwordMismatch, lang));
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      const msg = (updateError.message || "").toLowerCase();
      if (msg.includes("different from the old")) {
        setError(pick(t.auth.samePassword, lang));
      } else if (msg.includes("session") || msg.includes("not logged in")) {
        // Session evaporated between the mount check and submit.
        setSessionState("expired");
      } else {
        setError(updateError.message || pick(t.auth.authErrorGeneric, lang));
      }
      setSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  };

  if (sessionState === "checking") {
    return (
      <AuthLayout title={pick(t.auth.resetTitle, lang)}>
        <p className="text-center text-muted">{pick(t.auth.working, lang)}</p>
      </AuthLayout>
    );
  }

  if (sessionState === "expired") {
    return (
      <AuthLayout title={pick(t.auth.resetTitle, lang)}>
        <div className="auth-error mb-4">{pick(t.auth.resetLinkExpired, lang)}</div>
        <Link href="/forgot-password" className="btn-primary w-full justify-center">
          {pick(t.auth.requestNewLink, lang)}
        </Link>
        <p className="text-sm text-muted text-center mt-6">
          <Link
            href="/login"
            className="text-amber hover:text-orange transition-colors font-semibold"
          >
            ← {pick(t.auth.signIn, lang)}
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={pick(t.auth.resetTitle, lang)}
      subtitle={pick(t.auth.resetSubtitle, lang)}
    >
      {error && <div className="auth-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="auth-label">
            {pick(t.auth.newPasswordLabel, lang)}
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
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="auth-label">
            {pick(t.signup.confirmPasswordLabel, lang)}
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
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !password || !confirm}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {submitting
            ? pick(t.auth.working, lang)
            : pick(t.auth.setNewPassword, lang)}
        </button>
      </form>
    </AuthLayout>
  );
}
