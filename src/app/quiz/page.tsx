"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { quizSteps } from "@/lib/quiz-data";
import type { QuizAnswers } from "@/types";
import Navbar from "@/components/Navbar";
import { safeSave } from "@/lib/storage";

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const current = quizSteps[step];
  const selected = answers[current.key];
  const isLast = step === quizSteps.length - 1;

  const choose = (value: string) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (isLast) {
      safeSave("ef_answers", next);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ef_lang", lang);
        } catch {}
      }
      router.push("/loading");
    } else {
      setTimeout(() => setStep((s) => s + 1), 150);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const progress = ((step + 1) / quizSteps.length) * 100;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 text-xs text-muted">
            <span>{pick(t.quiz.step, lang)} {step + 1} {pick(t.quiz.of, lang)} {quizSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden mb-12" style={{ background: "var(--card-bg)" }}>
            <div
              className="h-full bg-gradient-to-r from-amber to-orange transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h1 key={current.key} className="h-display text-3xl sm:text-4xl mb-8 animate-fade-up">
            <span className="gradient-text">{lang === "ru" ? current.qRu : current.qEn}</span>
          </h1>

          <div className="grid gap-3">
            {current.options.map((opt, i) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => choose(opt.value)}
                  className={`glass px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                    active ? "!border-amber bg-amber/10" : ""
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-base text-ink">{lang === "ru" ? opt.labelRu : opt.labelEn}</span>
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button onClick={back} className="mt-10 text-muted text-sm hover:text-ink transition-colors">
              ← {pick(t.quiz.back, lang)}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
