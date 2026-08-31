"use client";

import { useState } from "react";
import Image from "next/image";
import type { SupplementItem } from "@/types";
import { useI18n } from "@/lib/i18n-context";
import { t, pick, format } from "@/lib/translations";
import {
  resolveSupplement,
  amazonSearchUrl,
  iherbSearchUrl,
} from "@/lib/supplement-recommendations";

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
  const { lang } = useI18n();
  const [imgError, setImgError] = useState(false);
  const c = COLOR_CYCLE[index % COLOR_CYCLE.length];

  // Map the AI's free-text name to a curated Good/Premium pair (Amazon-only for
  // now; iHerb returns later via iherbId). Unknown actives fall back to a single
  // tagged Amazon search on the raw name.
  const entry = resolveSupplement(supplement.name);
  const imageSrc = entry?.image;
  const showImage = Boolean(imageSrc) && !imgError;

  return (
    <article className="glass p-5 flex flex-col">
      {/* Top row — image tile on the LEFT, text block on the RIGHT, top-aligned
          so it still reads when the text is taller than the image. */}
      <div className="flex items-start gap-4 mb-4">
        {showImage ? (
          <Image
            src={imageSrc as string}
            alt={supplement.name}
            width={112}
            height={112}
            onError={() => setImgError(true)}
            className="flex-shrink-0 w-28 h-28 object-contain rounded-[14px]"
            style={{ border: "1px solid var(--border)", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
          />
        ) : (
          // Graceful fallback — same tile, pill icon — when there's no image or
          // it fails to load (never a broken-image icon).
          <div
            className={`flex-shrink-0 w-28 h-28 rounded-[14px] flex items-center justify-center ${c.bgSoft}`}
            style={{ border: "1px solid var(--border)", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${c.bgIcon}`}>
              <PillIcon className={c.text} />
            </div>
          </div>
        )}

        {/* Text block */}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base mb-2 leading-tight">{supplement.name}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${c.bgIcon} ${c.text} font-mono text-[11px] font-bold`}>
            {supplement.dose}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-muted text-[11px]">
            {supplement.timing}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-muted text-[11px]">
            {format(pick(t.dashboard.startWeek, lang), { n: supplement.startWeek })}
          </span>
        </div>

        <p className="text-xs text-muted leading-relaxed line-clamp-3">
          {supplement.note}
        </p>
        </div>
      </div>

      {entry?.caveat && (
          <div
            role="note"
            className="flex items-start gap-2 mb-3.5 px-3 py-2 rounded-lg bg-amber/[0.08]"
            style={{ border: "1px solid rgba(245, 158, 11, 0.35)" }}
          >
            <span className="text-sm flex-shrink-0 leading-none mt-0.5">⚠️</span>
            <p className="text-[11px] text-amber leading-relaxed">
              {pick(entry.caveat, lang)}
            </p>
          </div>
        )}

        {entry ? (
          // Retailer × tier matrix: [ store | Good (amber) | Premium (violet) ].
          <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5">
            {/* Header row — empty corner, then tier columns */}
            <div aria-hidden />
            <div className="text-center text-[10px] font-bold uppercase tracking-wide text-amber">
              {pick(t.dashboard.supplement.good, lang)}
            </div>
            <div
              className="text-center text-[10px] font-bold uppercase tracking-wide"
              style={{ color: "#AFA9EC" }}
            >
              {pick(t.dashboard.supplement.premium, lang)}
            </div>

            {/* iHerb row — plain search, not affiliate yet */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <StoreIcon className="flex-shrink-0" />
              iHerb
            </div>
            <a
              href={iherbSearchUrl(entry.good.searchQuery)}
              target="_blank"
              rel="nofollow noopener"
              className="flex items-center justify-center text-center px-2 py-1.5 rounded-lg border border-amber/30 bg-amber/[0.08] text-amber hover:bg-amber/[0.15] transition text-[10px] font-bold leading-tight"
            >
              {entry.good.brand} →
            </a>
            <a
              href={iherbSearchUrl(entry.premium.searchQuery)}
              target="_blank"
              rel="nofollow noopener"
              className="flex items-center justify-center text-center px-2 py-1.5 rounded-lg border border-violet/30 bg-violet/[0.08] hover:bg-violet/[0.15] transition text-[10px] font-bold leading-tight"
              style={{ color: "#AFA9EC" }}
            >
              {entry.premium.brand} →
            </a>

            {/* Amazon row — tagged affiliate search */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <StoreIcon className="flex-shrink-0" />
              Amazon
            </div>
            <a
              href={amazonSearchUrl(entry.good.searchQuery)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="flex items-center justify-center text-center px-2 py-1.5 rounded-lg border border-amber/30 bg-amber/[0.08] text-amber hover:bg-amber/[0.15] transition text-[10px] font-bold leading-tight"
            >
              {entry.good.brand} →
            </a>
            <a
              href={amazonSearchUrl(entry.premium.searchQuery)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="flex items-center justify-center text-center px-2 py-1.5 rounded-lg border border-violet/30 bg-violet/[0.08] hover:bg-violet/[0.15] transition text-[10px] font-bold leading-tight"
              style={{ color: "#AFA9EC" }}
            >
              {entry.premium.brand} →
            </a>
          </div>
        ) : (
          // Uncatalogued active — single tagged Amazon search on the raw name.
          <a
            href={amazonSearchUrl(supplement.name)}
            target="_blank"
            rel="sponsored nofollow noopener"
            className={`block text-center px-3 py-1.5 rounded-lg ${c.btnBg} ${c.text} ${c.btnHover} transition text-[11px] font-bold`}
          >
            {pick(t.dashboard.supplement.findOnAmazon, lang)} →
          </a>
        )}
    </article>
  );
}

function StoreIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
    </svg>
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
