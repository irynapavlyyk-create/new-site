"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function Testimonials() {
  const { lang } = useI18n();
  const items = pick(t.testimonials.items, lang);
  return (
    <section className="section">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-16">
          <span className="gradient-text">{pick(t.testimonials.title, lang)}</span>
        </h2>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <FadeUp key={i} delay={i * 120}>
            <div className="glass p-8 h-full">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-amber">★</span>
                ))}
              </div>
              <p className="text-ink text-base leading-relaxed mb-6">&ldquo;{it.text}&rdquo;</p>
              <div className="text-sm text-muted">— {it.name}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
