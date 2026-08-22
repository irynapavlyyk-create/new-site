"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";
import DashboardMockup from "./preview/DashboardMockup";
import FloatingChip from "./preview/FloatingChip";

export default function PlanPreview() {
  const { lang } = useI18n();
  return (
    <section className="section">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-3">
          <span className="gradient-text">{pick(t.preview.title, lang)}</span>
        </h2>
        <p className="text-muted text-center mb-12 max-w-xl mx-auto">
          {pick(t.preview.subtitle, lang)}
        </p>
      </FadeUp>
      <div className="mockup-stage">
        <FloatingChip emoji="✨" text={pick(t.preview.mockup.badges.ai, lang)} className="chip-tl" delay={0} />
        <FloatingChip emoji="⏱" text={pick(t.preview.mockup.badges.days, lang)} className="chip-tr" delay={1} />
        <FloatingChip emoji="🧬" text={pick(t.preview.mockup.badges.science, lang)} className="chip-bl" delay={2} />
        <FloatingChip emoji="🎯" text={pick(t.preview.mockup.badges.forYou, lang)} className="chip-br" delay={3} />
        <DashboardMockup />
      </div>
    </section>
  );
}
