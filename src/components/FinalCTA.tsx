"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function FinalCTA() {
  const { lang } = useI18n();
  return (
    <section className="section">
      <FadeUp>
        <div className="relative glass-strong p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber/10 via-orange/10 to-violet/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber/20 blur-[100px]" />
          <h2 className="h-display text-4xl sm:text-5xl mb-4 relative">
            <span className="gradient-text">{pick(t.finalCta.title, lang)}</span>
          </h2>
          <p className="text-muted mb-8 relative">{pick(t.finalCta.sub, lang)}</p>
          <Link href="/quiz" className="btn-primary text-base px-8 py-4 animate-pulse-glow relative">
            {pick(t.finalCta.btn, lang)} →
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}
