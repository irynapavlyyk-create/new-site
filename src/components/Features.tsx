"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";
import {
  PlanIcon,
  MorningIcon,
  SleepIcon,
  SupplementIcon,
  NutritionIcon,
  StressIcon,
  PdfIcon,
  LifetimeIcon,
} from "./icons";

const icons = [
  PlanIcon,
  MorningIcon,
  SleepIcon,
  SupplementIcon,
  NutritionIcon,
  StressIcon,
  PdfIcon,
  LifetimeIcon,
];

export default function Features() {
  const { lang } = useI18n();
  const items = pick(t.features.items, lang);
  return (
    <section className="section" id="features">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-16">
          <span className="gradient-text">{pick(t.features.title, lang)}</span>
        </h2>
      </FadeUp>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => {
          const Icon = icons[i];
          return (
            <FadeUp key={i} delay={i * 60}>
              <div className="icon-card glass p-6 h-full hover:border-violet/40 transition-all hover:-translate-y-1">
                <Icon className="icon-hover w-10 h-10 mb-4" />
                <h3 className="h-display text-lg font-bold mb-2">{it.t}</h3>
                <p className="text-sm text-muted leading-relaxed">{it.d}</p>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
