"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
  const { lang } = useI18n();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${origin}/login` }
    );
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout
      title={pick(t.auth.forgotTitle, lang)}
      subtitle={pick(t.auth.forgotSubtitle, lang)}
    >
      {sent ? (
        <div className="auth-success text-center">
          <div className="text-4xl mb-3">📬</div>
          <p>{pick(t.auth.checkEmailReset, lang)}</p>
        </div>
      ) : (
        <>
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
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? pick(t.auth.working, lang) : pick(t.auth.sendResetLink, lang)}
            </button>
          </form>
        </>
      )}
      <p className="text-sm text-muted text-center mt-6">
        <Link href="/login" className="text-amber hover:text-orange transition-colors font-semibold">
          ← {pick(t.auth.signIn, lang)}
        </Link>
      </p>
    </AuthLayout>
  );
}
