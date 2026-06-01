"use client";

import type { WeekProtocol } from "@/types";

type Props = {
  week: WeekProtocol;
  currentDay: number;
};

export default function TodayFocus({ week, currentDay }: Props) {
  return (
    <section className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Hero card — week title + focus paragraph */}
      <div className="glass p-6 sm:p-8 relative overflow-hidden border-amber/20 bg-gradient-to-br from-amber/[0.08] to-orange/[0.04]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
          <span>⚡</span>
          <span>Today&apos;s focus · Day {currentDay}</span>
        </div>
        <h2 className="h-display text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
          {week.title}
        </h2>
        <p className="text-muted text-sm leading-relaxed">
          {week.focus}
        </p>
      </div>

      {/* Key actions card */}
      <div className="glass p-6 sm:p-8 flex flex-col">
        <div className="text-[11px] uppercase tracking-widest text-muted font-bold mb-4">
          Key actions this week
        </div>
        <ul className="space-y-3 flex-1">
          {week.keyActions.map((action, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-amber/15 text-amber text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
