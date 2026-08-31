"use client";

import type { PhenotypeData } from "@/types";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

type Props = {
  phenotype: PhenotypeData;
};

// Shared baseline reference curve — same for all phenotypes,
// represents an idealized circadian energy pattern.
const NORMAL_CURVE = "M 0,150 Q 100,55 200,45 T 400,75 T 600,95 T 800,160";

export default function EnergyChart({ phenotype }: Props) {
  const { lang } = useI18n();
  const axis = pick(t.chart.axis, lang);

  // Closed path for the area fill — extend the open curve down to the
  // x-axis baseline (y=220) and close.
  const areaPath = `${phenotype.energyCurve} L 800,220 L 0,220 Z`;

  return (
    <section className="glass p-6 sm:p-8 mb-8">
      <div className="flex flex-wrap gap-3 justify-between items-baseline mb-6">
        <h2 className="h-display text-lg sm:text-xl font-bold">
          {pick(t.chart.title, lang)}
        </h2>
        <div className="flex gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber" aria-hidden="true" />
            {pick(t.chart.you, lang)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/30" aria-hidden="true" />
            {pick(t.chart.normal, lang)}
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        className="w-full h-44 sm:h-56 block"
        aria-label={pick(t.chart.aria, lang)}
      >
        <defs>
          <linearGradient id="ef-energy-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Subtle grid lines */}
        <line x1="0" y1="55" x2="800" y2="55" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="110" x2="800" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="165" x2="800" y2="165" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Area fill under user's curve */}
        <path d={areaPath} fill="url(#ef-energy-area)" />

        {/* Normal reference (dashed white) */}
        <path
          d={NORMAL_CURVE}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeDasharray="3,4"
        />

        {/* User's curve (solid amber) */}
        <path
          d={phenotype.energyCurve}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* X-axis time labels */}
        <text x="4" y="215" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{axis[0]}</text>
        <text x="200" y="215" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{axis[1]}</text>
        <text x="400" y="215" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{axis[2]}</text>
        <text x="600" y="215" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{axis[3]}</text>
        <text x="755" y="215" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{axis[4]}</text>
      </svg>

      {/* 3 insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {phenotype.insights.map((insight, i) => (
          <div key={i} className="bg-white/[0.03] rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber/15 text-amber flex items-center justify-center flex-shrink-0">
              <InsightIcon kind={insight.kind} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold mb-1">
                {insight.label[lang]}
              </div>
              <div className="text-xs text-muted leading-relaxed">
                {insight.description[lang]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightIcon({ kind }: { kind: "morning" | "afternoon" | "evening" }) {
  const stroke = "currentColor";
  if (kind === "morning") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (kind === "afternoon") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16M5 12l7 7 7-7" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
