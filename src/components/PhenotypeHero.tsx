"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { PhenotypeData } from "@/types";

type Props = {
  phenotype: PhenotypeData;
};

export default function PhenotypeHero({ phenotype }: Props) {
  const { lang } = useI18n();
  return (
    <div className="glass p-8 relative overflow-hidden">
      <div className="text-xs tracking-widest text-amber/70 font-mono mb-3">
        TYPE {String(phenotype.typeNumber).padStart(2, "0")} OF 06 · ID {phenotype.shortCode}
      </div>
      <h1 className="h-display text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
        {phenotype.name[lang]}
      </h1>
      <p className="text-muted text-sm leading-relaxed mb-6">
        {phenotype.subtitle[lang]}
      </p>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div>
          <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
            {phenotype.crashWindow}
          </div>
          <div className="text-xs text-muted mt-1">{pick(t.dashboard.heroStats.crashWindow, lang)}</div>
        </div>
        <div>
          <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
            {phenotype.peakHours}
          </div>
          <div className="text-xs text-muted mt-1">{pick(t.dashboard.heroStats.peakHours, lang)}</div>
        </div>
        <div>
          <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
            {phenotype.secondWind}
          </div>
          <div className="text-xs text-muted mt-1">{pick(t.dashboard.heroStats.secondWind, lang)}</div>
        </div>
      </div>
    </div>
  );
}
