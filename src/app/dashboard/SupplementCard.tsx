"use client";

import type { SupplementItem } from "@/types";

type Props = {
  supplement: SupplementItem;
  index: number;
};

const COLOR_CYCLE = [
  {
    bgSoft: "bg-amber/[0.08]",
    bgIcon: "bg-amber/20",
    text: "text-amber",
    btnBg: "bg-amber/15",
    btnHover: "hover:bg-amber/25",
  },
  {
    bgSoft: "bg-emerald-500/[0.08]",
    bgIcon: "bg-emerald-500/20",
    text: "text-emerald-400",
    btnBg: "bg-emerald-500/15",
    btnHover: "hover:bg-emerald-500/25",
  },
  {
    bgSoft: "bg-violet/[0.08]",
    bgIcon: "bg-violet/20",
    text: "text-violet",
    btnBg: "bg-violet/15",
    btnHover: "hover:bg-violet/25",
  },
  {
    bgSoft: "bg-orange/[0.08]",
    bgIcon: "bg-orange/20",
    text: "text-orange",
    btnBg: "bg-orange/15",
    btnHover: "hover:bg-orange/25",
  },
];

export default function SupplementCard({ supplement, index }: Props) {
  const c = COLOR_CYCLE[index % COLOR_CYCLE.length];

  // Search URLs — live retailer search, not affiliate yet (Phase 3 task).
  const query = encodeURIComponent(supplement.name);
  const iherbUrl = `https://www.iherb.com/search?kw=${query}`;
  const amazonUrl = `https://www.amazon.com/s?k=${query}`;

  return (
    <article className="glass p-5 grid grid-cols-[80px_1fr] gap-5 items-start">
      {/* Visual marker — placeholder for AI-generated images in Phase 3 */}
      <div className={`aspect-square rounded-xl flex items-center justify-center ${c.bgSoft}`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${c.bgIcon}`}>
          <PillIcon className={c.text} />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0">
        <h3 className="font-bold text-base mb-2 leading-tight">{supplement.name}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${c.bgIcon} ${c.text} font-mono text-[11px] font-bold`}>
            {supplement.dose}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-muted text-[11px]">
            {supplement.timing}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-muted text-[11px]">
            Start week {supplement.startWeek}
          </span>
        </div>

        <p className="text-xs text-muted leading-relaxed mb-3.5 line-clamp-3">
          {supplement.note}
        </p>

        <div className="flex gap-2">
          <a
            href={iherbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center px-3 py-1.5 rounded-lg ${c.btnBg} ${c.text} ${c.btnHover} transition text-[11px] font-bold`}
          >
            iHerb →
          </a>
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:bg-white/10 hover:text-white transition text-[11px] font-bold"
          >
            Amazon →
          </a>
        </div>
      </div>
    </article>
  );
}

function PillIcon({ className }: { className: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}
