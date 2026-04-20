"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { safeLoad, safeSave } from "@/lib/storage";
import type { QuizAnswers } from "@/types";

export default function LoadingPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const steps = pick(t.loading.steps, lang);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const answers = safeLoad<QuizAnswers>("ef_answers");
    if (!answers) {
      router.replace("/quiz");
      return;
    }

    const stepTimer = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1200);

    (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, lang, tier: "free" }),
        });
        if (!res.ok) throw new Error("api");
        const data = await res.json();
        safeSave("ef_free_report", data);
        clearInterval(stepTimer);
        router.replace("/result");
      } catch (e) {
        clearInterval(stepTimer);
        setError("error");
      }
    })();

    return () => clearInterval(stepTimer);
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

        {error && (
          <div className="mt-8">
            <p className="text-red-400 text-sm mb-4">{pick(t.result.error, lang)}</p>
            <button className="btn-ghost" onClick={() => router.replace("/quiz")}>
              {pick(t.result.tryAgain, lang)}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
