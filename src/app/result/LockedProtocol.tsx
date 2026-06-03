"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { PhenotypeData, PhenotypePreview } from "@/types";

type Props = {
  phenotype: PhenotypeData;
  preview: PhenotypePreview;
  /** Opens the upsell modal (locked weeks, Week-1 detail, and the CTA all call this). */
  onUnlock: () => void;
};

/** Icons for the "What's inside" grid — not language-specific, paired by index. */
const INSIDE_ICONS = ["📈", "🌙", "💊", "✅"];

/**
 * Progressive-blur overlay: a few stacked backdrop-filter layers, each masked
 * to a progressively lower band with an increasing blur radius. The result is
 * a gradual ramp (clear at top → heavily blurred at bottom) rather than one
 * hard blur edge. Uses -webkit- prefixes so it also works on iOS Safari.
 */
const BLUR_LAYERS = [
  { blur: 1.5, from: 42 },
  { blur: 3, from: 58 },
  { blur: 6, from: 74 },
  { blur: 10, from: 88 },
];

export default function LockedProtocol({ phenotype, preview, onUnlock }: Props) {
  const { lang } = useI18n();
  const insideItems = pick(t.result.locked.whatsInside.items, lang);

  return (
    <div className="relative glass-strong p-6 sm:p-10">
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-amber/10 via-orange/10 to-violet/10" />

      {/* 1 — Lock badge + title + subline */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber/15 text-amber mb-4">
          {pick(t.result.locked.badge, lang)}
        </span>
        <h2 className="h-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
          {pick(t.result.locked.titleBefore, lang)}
          <span className="text-amber">{pick(phenotype.name, lang)}</span>
          {pick(t.result.locked.titleAfter, lang)}
        </h2>
        <p className="text-muted text-sm">{pick(t.result.locked.subline, lang)}</p>
      </div>

      {/* 2 — "What's inside" grid */}
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-widest text-amber/80 font-bold mb-4 text-center">
          {pick(t.result.locked.whatsInside.heading, lang)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {insideItems.map((item, i) => (
            <div
              key={i}
              className="glass flex items-center gap-3 p-3 sm:p-4"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0 leading-none">
                {INSIDE_ICONS[i]}
              </span>
              <span className="text-xs sm:text-sm text-ink leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 — 4-week progression tabs (2 cols mobile, 4 cols desktop) */}
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-widest text-amber/80 font-bold mb-4">
          {pick(t.result.locked.progression.heading, lang)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {preview.weekThemes.map((theme, i) => {
            const num = i + 1;
            const isPreview = num === 1;
            return (
              <button
                key={num}
                type="button"
                onClick={onUnlock}
                aria-disabled={isPreview ? undefined : true}
                className={`glass p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isPreview
                    ? "ring-1 ring-amber/40 bg-gradient-to-br from-amber/[0.12] to-orange/[0.04]"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`text-[10px] font-mono tracking-widest mb-2 ${
                    isPreview ? "text-amber" : "text-muted"
                  }`}
                >
                  {pick(t.result.locked.progression.weekLabel, lang).toUpperCase()}{" "}
                  {String(num).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm font-bold mb-3 leading-tight min-h-[2.5rem]">
                  {pick(theme, lang)}
                </div>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    isPreview ? "bg-amber/20 text-amber" : "bg-white/5 text-muted"
                  }`}
                >
                  {isPreview
                    ? pick(t.result.locked.progression.previewBadge, lang)
                    : pick(t.result.locked.progression.lockedBadge, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 — Week-1 detail panel with progressive blur */}
      <button
        type="button"
        onClick={onUnlock}
        className="relative block w-full text-left glass overflow-hidden rounded-2xl"
      >
        <div className="p-5 sm:p-7 select-none">
          <div className="text-[11px] font-mono tracking-widest text-amber/70 mb-1">
            {pick(t.result.locked.progression.weekLabel, lang).toUpperCase()} 01
          </div>
          <div className="h-display text-base sm:text-lg font-bold text-ink mb-4 leading-snug">
            {pick(preview.week1Teaser.theme, lang)}
          </div>
          <ul className="space-y-3">
            {preview.week1Teaser.actions.map((action, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="text-amber flex-shrink-0">›</span>
                <span className="text-ink">{pick(action, lang)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progressive blur — stacked masked backdrop-filter layers */}
        {BLUR_LAYERS.map((layer, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: `linear-gradient(to bottom, transparent ${layer.from}%, black 100%)`,
              WebkitMaskImage: `linear-gradient(to bottom, transparent ${layer.from}%, black 100%)`,
            }}
          />
        ))}

        {/* Bottom fade + hint */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--preview-blur-from) 0%, var(--preview-blur-to) 90%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 pointer-events-none px-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-amber to-orange shadow-glow">
            <span className="text-xl" style={{ color: "var(--btn-text)" }}>
              🔒
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-ink text-center">
            {pick(t.result.locked.week1.hint, lang)}
          </span>
        </div>
      </button>
    </div>
  );
}
