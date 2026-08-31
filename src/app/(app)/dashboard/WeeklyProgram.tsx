"use client";

import { useState } from "react";
import type { ProPlanV2 } from "@/types";
import { useI18n } from "@/lib/i18n-context";
import { t, pick, format } from "@/lib/translations";

type Props = {
  weeks: ProPlanV2["weeks"];
  currentWeek: number;
};

export default function WeeklyProgram({ weeks, currentWeek }: Props) {
  const { lang } = useI18n();
  const [selected, setSelected] = useState<number>(currentWeek);
  const selectedWeek = weeks[selected - 1];
  const weekWord = pick(t.dashboard.week, lang).toUpperCase();

  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-3 justify-between items-baseline mb-5">
        <h2 className="h-display text-xl sm:text-2xl font-bold">
          {pick(t.dashboard.protocolTitle, lang)}
        </h2>
        <span className="text-xs text-muted">{pick(t.dashboard.tapWeek, lang)}</span>
      </div>

      {/* Week tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {weeks.map((week, i) => {
          const num = i + 1;
          const isActive = num === selected;
          const isCurrent = num === currentWeek;
          const isPast = num < currentWeek;
          const dayStart = (num - 1) * 7 + 1;
          const dayEnd = num === 4 ? 30 : num * 7;
          return (
            <button
              key={num}
              type="button"
              onClick={() => setSelected(num)}
              className={`glass p-5 text-left transition-all hover:-translate-y-0.5 ${
                isActive
                  ? "ring-1 ring-amber/40 bg-gradient-to-br from-amber/[0.1] to-orange/[0.04]"
                  : ""
              }`}
            >
              <div
                className={`text-[10px] font-mono tracking-widest mb-2 ${
                  isActive ? "text-amber" : "text-muted"
                }`}
              >
                {format(pick(t.dashboard.weekDaysMeta, lang), {
                  n: String(num).padStart(2, "0"),
                  a: dayStart,
                  b: dayEnd,
                })}
              </div>
              <div className="text-sm font-bold mb-2 leading-tight">
                {week.title}
              </div>
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  isCurrent
                    ? "bg-amber/15 text-amber"
                    : isPast
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/5 text-muted"
                }`}
              >
                {isCurrent
                  ? pick(t.dashboard.weekStatus.active, lang)
                  : isPast
                  ? pick(t.dashboard.weekStatus.done, lang)
                  : pick(t.dashboard.weekStatus.upcoming, lang)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected week detail */}
      <div className="glass p-6 sm:p-8">
        <div className="mb-6 pb-5 border-b border-white/5">
          <div className="text-[11px] font-mono tracking-widest text-amber/70 mb-1">
            {weekWord} {String(selected).padStart(2, "0")}
          </div>
          <h3 className="h-display text-xl sm:text-2xl font-bold mb-2">
            {selectedWeek.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {selectedWeek.focus}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-amber/80 font-bold mb-3">
              {pick(t.dashboard.weekDetail.nutrition, lang)}
            </div>
            <ul className="space-y-2.5">
              {selectedWeek.nutritionFocus.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="text-amber flex-shrink-0">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-amber/80 font-bold mb-3">
              {pick(t.dashboard.weekDetail.stress, lang)}
            </div>
            <ul className="space-y-2.5">
              {selectedWeek.stressPractices.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="text-amber flex-shrink-0">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
