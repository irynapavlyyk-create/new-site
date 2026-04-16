"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function PlanPreview() {
  const { lang } = useI18n();
  const items = pick(t.preview.items, lang);
  return (
    <section className="section">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-4">
          <span className="gradient-text">{pick(t.preview.title, lang)}</span>
        </h2>
        <p className="text-center text-muted mb-14">{pick(t.preview.subtitle, lang)}</p>
      </FadeUp>
      <div className="relative glass-strong p-2 sm:p-4">
        <div className="absolute -top-4 left-4 right-4 h-12 bg-gradient-to-b from-bg to-transparent rounded-t-xl -z-10" />
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((it, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div className="glass p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                  <h3 className="h-display text-base">{it.t}</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">{it.d}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
