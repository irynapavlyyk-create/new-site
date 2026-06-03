"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { safeLoad } from "@/lib/storage";
import type { QuizAnswers } from "@/types";

// Animation cadence: 4 steps × 400ms cycle = 1.6s, then ~200ms breathing
// room before redirect. Total /loading dwell ~1.8s — keeps perceived
// "we did analysis" value without an AI call. The actual phenotype +
// signals are computed deterministically on /result from ef_answers.
const STEP_INTERVAL_MS = 400;
const REDIRECT_MS = 1800;

export default function LoadingPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const steps = pick(t.loading.steps, lang);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const answers = safeLoad<QuizAnswers>("ef_answers");
    if (!answers) {
      router.replace("/quiz");
      return;
    }
    void answers;

    const stepTimer = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, STEP_INTERVAL_MS);
    const redirectTimer = setTimeout(() => {
      router.replace("/result");
    }, REDIRECT_MS);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(redirectTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "var(--border)" }} />
          <div className="absolute inset-0 rounded-full border-4 border-t-amber border-r-orange border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber/30 to-violet/30 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl animate-spin-slow">⚡</div>
        </div>

        <h1 className="h-display text-3xl sm:text-4xl mb-8">
          <span className="gradient-text">{pick(t.loading.title, lang)}</span>
        </h1>

        <ul className="space-y-3 text-left">
          {steps.map((s, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 transition-all ${
                i < currentStep ? "opacity-40" : i === currentStep ? "opacity-100" : "opacity-30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  i < currentStep ? "bg-amber/20 text-amber" : i === currentStep ? "bg-amber" : "text-muted"
                }`}
                style={
                  i === currentStep
                    ? { color: "var(--btn-text)" }
                    : i < currentStep
                      ? undefined
                      : { background: "var(--card-bg)" }
                }
              >
                {i < currentStep ? "✓" : i + 1}
              </span>
              <span className="text-sm">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
