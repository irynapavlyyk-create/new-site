"use client";

import type { ProtocolStep } from "@/types";

type Props = {
  variant: "morning" | "sleep";
  title: string;
  steps: ProtocolStep[];
};

export default function ProtocolCard({ variant, title, steps }: Props) {
  const isMorning = variant === "morning";
  return (
    <div className="glass overflow-hidden flex flex-col">
      {/* Gradient hero */}
      <div
        className={`h-32 relative overflow-hidden ${
          isMorning
            ? "bg-gradient-to-br from-amber via-orange to-amber/40"
            : "bg-gradient-to-br from-[#6d28d9] via-indigo-900 to-slate-900"
        }`}
      >
        {!isMorning && (
          <>
            <span className="absolute top-4 right-12 w-1 h-1 bg-white/60 rounded-full" />
            <span className="absolute top-10 right-6 w-0.5 h-0.5 bg-white/50 rounded-full" />
            <span className="absolute top-16 left-20 w-1 h-1 bg-white/40 rounded-full" />
            <span className="absolute top-6 left-10 w-0.5 h-0.5 bg-white/50 rounded-full" />
          </>
        )}
        <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
          <div className="w-9 h-9 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
            {isMorning ? <SunIcon /> : <MoonIcon />}
          </div>
          <h3 className="text-base font-bold">{title}</h3>
        </div>
      </div>

      {/* Timed steps */}
      <ul className="p-5 sm:p-6 flex-1">
        {steps.map((step, i) => (
          <li
            key={i}
            className="grid grid-cols-[64px_1fr] gap-3 py-3 border-t border-white/5 first:border-0 first:pt-0 last:pb-0"
          >
            <div className="text-amber font-mono text-xs font-bold pt-0.5">
              {step.time}
            </div>
            <div className="min-w-0">
              <div className="text-sm leading-snug">{step.action}</div>
              {step.note && (
                <div className="text-xs text-muted mt-1 leading-snug">
                  {step.note}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
