"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";
import { QuestionIcon, PuzzleIcon, ChecklistIcon } from "./icons";

const icons = [QuestionIcon, PuzzleIcon, ChecklistIcon];

export default function HowItWorks() {
  const { lang } = useI18n();
  const steps = pick(t.how.steps, lang);
  return (
    <section className="section" id="how">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-16">
          <span className="gradient-text">{pick(t.how.title, lang)}</span>
        </h2>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
        {steps.map((s, i) => {
          const Icon = icons[i];
          return (
            <FadeUp key={i} delay={i * 120}>
              <div className="icon-card relative glass p-8 h-full text-center">
                <div
                  className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber to-orange flex items-center justify-center shadow-glow mb-6"
                  style={{ color: "var(--btn-text)" }}
                >
                  <Icon className="icon-hover w-7 h-7" stroke="currentColor" />
                </div>
                <h3 className="h-display text-xl font-bold mb-3">{s.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.d}</p>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
