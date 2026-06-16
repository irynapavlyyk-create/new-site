"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { track } from "@/lib/analytics";
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

/**
 * Purely presentational selection marker for an answer option.
 * round = radio (single-select), square = checkbox (multi-select).
 * Theme-aware: brand amber accent (var(--amber)) when selected, a muted
 * theme-aware outline (var(--text) at low alpha) when not. The check uses
 * var(--btn-text) — the design system's on-amber contrast color — so it stays
 * legible on the amber fill in both light and dark themes.
 */
function OptionMarker({
  shape,
  selected,
}: {
  shape: "round" | "square";
  selected: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex-shrink-0 grid place-items-center w-5 h-5 border transition-all duration-150 ${
        shape === "round" ? "rounded-full" : "rounded-md"
      }`}
      style={{
        borderColor: selected ? "rgb(var(--amber))" : "rgb(var(--text) / 0.3)",
        backgroundColor: selected ? "rgb(var(--amber))" : "transparent",
      }}
    >
      {selected && shape === "square" && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--btn-text)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  // Funnel: user begins the quiz. Fires once on mount.
  useEffect(() => {
    track("quiz_started");
  }, []);

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
                        className={`glass flex items-center gap-4 px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                          active ? "!border-amber bg-amber/10" : ""
                        }`}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <OptionMarker shape="round" selected={active} />
                        <span className={`text-base ${active ? "text-ink" : "text-ink/80"}`}>
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
                        className={`glass flex items-center gap-4 px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                          active ? "!border-amber bg-amber/10" : ""
                        }`}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <OptionMarker shape="round" selected={active} />
                        <span className={`text-base ${active ? "text-ink" : "text-ink/80"}`}>
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
                      className={`glass flex items-center gap-4 px-6 py-5 text-left transition-all hover:border-amber/50 hover:translate-x-1 ${
                        active ? "!border-amber bg-amber/10" : ""
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <OptionMarker shape={isMultiSelect ? "square" : "round"} selected={active} />
                      <span className={`text-base ${active ? "text-ink" : "text-ink/80"}`}>
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
