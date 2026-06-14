"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProtocolStep } from "@/types";

type Props = {
  variant: "morning" | "sleep";
  title: string;
  steps: ProtocolStep[];
};

// Background photo per variant (served from /public/protocols).
const PHOTO: Record<Props["variant"], string> = {
  morning: "/protocols/morning.png",
  sleep: "/protocols/sleep.png",
};

// Warm-dark base gradient — ALWAYS painted as the card bg, under the photo, so
// the card stays a legible dark band with white text even when the image is
// missing/404s (the graceful fallback). Morning skews warm amber-brown; sleep
// skews indigo. Both are dark enough for white text in either theme.
const BASE: Record<Props["variant"], string> = {
  morning: "linear-gradient(160deg, #3a2511 0%, #1d1209 55%, #140d06 100%)",
  sleep: "linear-gradient(160deg, #241a3d 0%, #14112b 55%, #0c0a18 100%)",
};

// Warm scrim over the photo: light at top so the sunrise/lamp focal can glow,
// heavier toward the bottom where the title + steps sit. Tuned for white text;
// theme-independent (the band is always dark regardless of light/dark mode).
const SCRIM =
  "linear-gradient(to bottom, rgba(10,6,2,0.12) 0%, rgba(10,6,2,0.45) 24%, rgba(9,7,11,0.68) 48%, rgba(8,6,10,0.9) 100%)";

export default function ProtocolCard({ variant, title, steps }: Props) {
  const isMorning = variant === "morning";
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className="glass overflow-hidden flex flex-col relative isolate text-white"
      style={{ background: BASE[variant] }}
    >
      {/* Full-bleed photo + warm scrim. The base gradient (card bg) shows
          through if the photo is missing/404s — no broken image, text legible. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {!imgError && (
          <Image
            src={PHOTO[variant]}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            onError={() => setImgError(true)}
            className="object-cover object-top"
          />
        )}
        <div className="absolute inset-0" style={{ background: SCRIM }} />
      </div>

      {/* Header — focal area sits up top; icon + title at the bottom-left */}
      <div className="h-32 relative">
        <div
          className="absolute bottom-4 left-5 flex items-center gap-3"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}
        >
          <div className="w-9 h-9 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
            {isMorning ? <SunIcon /> : <MoonIcon />}
          </div>
          <h3 className="text-base font-bold">{title}</h3>
        </div>
      </div>

      {/* Timed steps */}
      <ul
        className="p-5 sm:p-6 flex-1"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {steps.map((step, i) => (
          <li
            key={i}
            className="grid grid-cols-[64px_1fr] gap-3 py-3 border-t border-white/10 first:border-0 first:pt-0 last:pb-0"
          >
            <div className="text-amber-400 font-mono text-xs font-bold pt-0.5">
              {step.time}
            </div>
            <div className="min-w-0">
              <div className="text-sm leading-snug">{step.action}</div>
              {step.note && (
                <div className="text-xs text-white/70 mt-1 leading-snug">
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
