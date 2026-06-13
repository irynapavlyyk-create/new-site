"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { quizSteps } from "@/lib/quiz-data";
import type { QuizAnswers } from "@/types";
import Navbar from "@/components/Navbar";
import { safeSave } from "@/lib/storage";

/**
 * Pure helper. Implements the mutex rule for multi-select questions:
 * if mutexValue is in the array, only it is in the array.
 */
function toggleMultiSelect(
  current: string[],
  value: string,
  mutexValue?: string
): string[] {
  if (mutexValue) {
    if (value === mutexValue) return [mutexValue];
    if (current.includes(mutexValue)) return [value];
  }
  if (current.includes(value)) return current.filter((v) => v !== value);
  return [...current, value];
}

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const current = quizSteps[step];
  const isCompoundSleep = current.key === "sleepDuration";
  const sleepQualityStep = isCompoundSleep ? quizSteps[step + 1] : undefined;
  const isMultiSelect = current.type === "multi-select";

  // Sleep duration + quality render on one screen; collapse for progress display.
  const sleepDurationIndex = quizSteps.findIndex((q) => q.key === "sleepDuration");
  const totalScreens = quizSteps.length - 1; // 11 entries → 10 visible screens
  let visibleStep = step + 1;
  if (step > sleepDurationIndex) visibleStep -= 1;
  const progress = (visibleStep / totalScreens) * 100;

  const advance = isCompoundSleep ? 2 : 1;
  const isLastScreen = step + advance >= quizSteps.length;

  const finishQuiz = (finalAnswers: QuizAnswers) => {
    safeSave("ef_answers", finalAnswers);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ef_lang", lang);
      } catch {}
    }
    router.push("/loading");
  };

  // Single-select: preserve original auto-advance UX exactly.
  const chooseSingle = (value: string) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (isLastScreen) {
      finishQuiz(next);
    } else {
      setTimeout(() => setStep((s) => s + 1), 150);
    }
  };

  // Multi-select: toggle into the array, no advance.
  const toggleMulti = (value: string) => {
    const arr = (answers[current.key] as string[] | undefined) ?? [];
    const nextArr = toggleMultiSelect(arr, value, current.mutexValue);
    setAnswers({ ...answers, [current.key]: nextArr });
  };

  // Compound sleep: each sub-section writes its own key, no advance.
  const setSleepAnswer = (key: "sleepDuration" | "sleepQuality", value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const canContinue = (() => {
    if (isCompoundSleep) {
      return (
        answers.sleepDuration !== undefined && answers.sleepQuality !== undefined
      );
    }
    if (isMultiSelect) {
      const arr = (answers[current.key] as string[] | undefined) ?? [];
      return arr.length > 0;
    }
    return false; // single-select uses auto-advance, no explicit Continue
  })();

  const handleContinue = () => {
    if (!canContinue) return;
    if (isLastScreen) {
      finishQuiz(answers);
    } else {
      setStep((s) => s + advance);
    }
  };

  const back = () => {
    setStep((s) => {
      const prev = s - 1;
      if (prev < 0) return 0;
      // Skip past sleepQuality — it's never a standalone screen
      if (quizSteps[prev]?.key === "sleepQuality") return prev - 1;
      return prev;
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 text-xs text-muted">
            <span>
              {pick(t.quiz.step, lang)} {visibleStep} {pick(t.quiz.of, lang)} {totalScreens}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden mb-12"
            style={{ background: "var(--card-bg)" }}
          >
            <div
              className="h-full bg-gradient-to-r from-amber to-orange transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {isCompoundSleep && sleepQualityStep ? (
            <>
              <h1 className="h-display text-3xl sm:text-4xl mb-8 animate-fade-up">
                <span className="gradient-text">{lang === "ru" ? "Сон" : "Sleep"}</span>
              </h1>
              <div className="mb-8">
                <h2 className="text-base font-semibold text-ink mb-4">
                  {lang === "ru" ? current.qRu : current.qEn}
                </h2>
                <div className="grid gap-3">
                  {current.options.map((opt, i) => {
                    const active = answers.sleepDuration === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSleepAnswer("sleepDuration", opt.value)}
                        className={`glass px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                          active ? "!border-amber bg-amber/10" : ""
                        }`}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <span className="text-base text-ink">
                          {lang === "ru" ? opt.labelRu : opt.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <h2 className="text-base font-semibold text-ink mb-4">
                  {lang === "ru" ? sleepQualityStep.qRu : sleepQualityStep.qEn}
                </h2>
                <div className="grid gap-3">
                  {sleepQualityStep.options.map((opt, i) => {
                    const active = answers.sleepQuality === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSleepAnswer("sleepQuality", opt.value)}
                        className={`glass px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                          active ? "!border-amber bg-amber/10" : ""
                        }`}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <span className="text-base text-ink">
                          {lang === "ru" ? opt.labelRu : opt.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <h1
                key={current.key}
                className={`h-display text-3xl sm:text-4xl ${
                  isMultiSelect ? "mb-3" : "mb-8"
                } animate-fade-up`}
              >
                <span className="text-ink">
                  {lang === "ru" ? current.qRu : current.qEn}
                </span>
              </h1>
              {isMultiSelect && (
                <p className="text-sm text-muted mb-8">
                  {lang === "ru" ? "Отметь всё что подходит" : "Pick all that apply"}
                </p>
              )}
              <div className="grid gap-3">
                {current.options.map((opt, i) => {
                  const active = isMultiSelect
                    ? ((answers[current.key] as string[] | undefined) ?? []).includes(opt.value)
                    : answers[current.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        isMultiSelect ? toggleMulti(opt.value) : chooseSingle(opt.value)
                      }
                      className={`glass px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                        active ? "!border-amber bg-amber/10" : ""
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="text-base text-ink">
                        {lang === "ru" ? opt.labelRu : opt.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {(isMultiSelect || isCompoundSleep) && (
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className={`mt-10 w-full glass px-6 py-4 font-bold text-base transition-all ${
                canContinue
                  ? "bg-gradient-to-r from-amber to-orange text-btn hover:translate-y-[-1px]"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              {pick(isLastScreen ? t.quiz.finish : t.quiz.next, lang)}
            </button>
          )}

          {step > 0 && (
            <button
              onClick={back}
              className="mt-6 text-muted text-sm hover:text-ink transition-colors"
            >
              ← {pick(t.quiz.back, lang)}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
