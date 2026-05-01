"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import type { QuizAnswers } from "@/types";

export default function SignupForm() {
  const { lang } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const fromQuiz = params.get("from") === "quiz";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Quiz context guard: anyone hitting /signup without `from=quiz` AND
  // sessionStorage answers must take the quiz first. Runs synchronously,
  // beats the async auth-check below.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAnswers = sessionStorage.getItem("quiz_answers");
      if (!fromQuiz || !hasAnswers) {
        router.replace("/quiz");
      }
    }
  }, [fromQuiz, router]);

  // Already-authenticated users skip signup entirely. If they came via quiz,
  // bounce back to /result so the existing logged-in fast path runs.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(fromQuiz ? "/result" : "/dashboard");
    });
  }, [router, fromQuiz]);

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

    // Quiz context lives in sessionStorage when the user arrived from /result.
    let answers: QuizAnswers | null = null;
    let tier: "pro" | "coach" = "pro";
    let quizLang: "en" | "ru" = lang;
    if (fromQuiz && typeof window !== "undefined") {
      try {
        const a = sessionStorage.getItem("quiz_answers");
        if (a) answers = JSON.parse(a) as QuizAnswers;
        const storedTier = sessionStorage.getItem("quiz_tier");
        if (storedTier === "pro" || storedTier === "coach") tier = storedTier;
        const storedLang = sessionStorage.getItem("quiz_lang");
        if (storedLang === "en" || storedLang === "ru") quizLang = storedLang;
      } catch (e) {
        console.warn("[signup] failed to read quiz context from sessionStorage:", e);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup-and-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tier, lang: quizLang, answers }),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        if (body.error?.toLowerCase().includes("already")) {
          setError(pick(t.signup.emailInUse, lang));
        } else {
          setError(body.error || pick(t.signup.genericError, lang));
        }
        setSubmitting(false);
        return;
      }
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      setError(pick(t.signup.genericError, lang));
      setSubmitting(false);
    } catch (e) {
      console.error("[signup] submit failed:", e);
      setError(pick(t.signup.genericError, lang));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={pick(t.signup.title, lang)}
      subtitle={pick(t.signup.subtitle, lang)}
    >
      {error && <div className="auth-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="auth-label">
            {pick(t.signup.emailLabel, lang)}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="password" className="auth-label">
            {pick(t.signup.passwordLabel, lang)}
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
          disabled={submitting || !email || !password || !confirm}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {submitting
            ? pick(t.signup.submitting, lang)
            : `${pick(t.signup.submitButton, lang)} →`}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        {pick(t.signup.alreadyHaveAccount, lang)}{" "}
        <Link
          href="/login"
          className="text-amber hover:text-orange transition-colors font-semibold"
        >
          {pick(t.signup.signInLink, lang)}
        </Link>
      </p>
    </AuthLayout>
  );
}
