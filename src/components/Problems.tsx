"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function Problems() {
  const { lang } = useI18n();
  const items = pick(t.problems.items, lang);
  return (
    <section className="section" id="problems">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-4">
          <span className="gradient-text">{pick(t.problems.title, lang)}</span>
        </h2>
        <p className="text-center text-muted mb-14 max-w-xl mx-auto">{pick(t.problems.subtitle, lang)}</p>
      </FadeUp>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <FadeUp key={i} delay={i * 80}>
            <div className="glass p-6 h-full hover:border-amber/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-amber/10 text-amber flex items-center justify-center font-display font-bold">
                  {i + 1}
                </div>
                <p className="text-ink pt-1.5">{it}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
