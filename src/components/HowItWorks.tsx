"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

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
        {steps.map((s, i) => (
          <FadeUp key={i} delay={i * 120}>
            <div className="relative glass p-8 h-full text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber to-orange flex items-center justify-center font-display font-bold text-black text-2xl shadow-glow mb-6">
                {i + 1}
              </div>
              <h3 className="h-display text-xl mb-3">{s.t}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.d}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
