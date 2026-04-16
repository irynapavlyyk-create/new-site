"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Counter from "./Counter";

export default function Hero() {
  const { lang } = useI18n();
  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber/20 blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 text-xs text-muted mb-6 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          {pick(t.hero.tag, lang)}
        </div>
        <h1 className="h-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6 animate-fade-up">
          <span className="gradient-text">{pick(t.hero.title, lang)}</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {pick(t.hero.subtitle, lang)}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <Link href="/quiz" className="btn-primary text-base px-8 py-4 animate-pulse-glow">
            {pick(t.hero.cta, lang)} →
          </Link>
          <span className="text-sm text-muted">{pick(t.hero.sub, lang)}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-20 animate-fade-up" style={{ animationDelay: "360ms" }}>
          {[
            { n: 12843, suf: "", label: pick(t.hero.stats.users, lang) },
            { n: 12184, suf: "", label: pick(t.hero.stats.plans, lang) },
            { n: 49, suf: "/5", label: pick(t.hero.stats.rating, lang) },
          ].map((s, i) => (
            <div key={i} className="glass p-5 sm:p-6">
              <div className="h-display text-3xl sm:text-4xl gradient-text">
                {i === 2 ? <><Counter to={4} />{"."}<Counter to={9} />/5</> : <Counter to={s.n} />}
                {i !== 2 && s.suf}
              </div>
              <div className="text-xs sm:text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
