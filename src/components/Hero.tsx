"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Counter from "./Counter";

export default function Hero() {
  const { lang } = useI18n();
  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      {/* Background photo + overlays — an always-dark hero band, independent of
          the global light/dark theme so the white headline stays readable. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/hero-morning.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        {/* Darken the LEFT (where the text sits); keep the RIGHT sunrise glowing. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/90 via-[#0A0A0F]/55 to-transparent" />
        {/* Bottom fade dissolves into the PAGE background per theme via var(--bg)
            — near-black in dark (seamless as before), white in light (no hard
            dark→white edge). Bottom-anchored band stays in the lower padding,
            below the stat cards, so they keep reading against the darker photo. */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />
        {/* Subtle brand glow over the lit side. */}
        <div className="absolute top-1/4 right-10 w-[440px] h-[440px] rounded-full bg-amber/15 blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-4 py-1.5 text-xs text-white/80 mb-6 animate-fade-up">
          <span className="badge-dot w-1.5 h-1.5 rounded-full bg-amber" />
          {pick(t.hero.tag, lang)}
        </div>
        <h1
          className="font-display text-[36px] sm:text-[52px] leading-[1.1] mb-6 animate-fade-up"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="text-white block" style={{ fontWeight: 700 }}>
            {pick(t.hero.titleLead, lang)}
          </span>
          <span className="block" style={{ fontWeight: 900 }}>
            {pick(t.hero.titleMid, lang) && (
              <>
                <span className="text-white">{pick(t.hero.titleMid, lang)}</span>{" "}
              </>
            )}
            <span className="gradient-text-2">
              {pick(t.hero.titleAccent, lang)}
            </span>
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/75 max-w-xl mb-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {pick(t.hero.subtitle, lang)}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <Link href="/quiz" className="btn-primary cta-nudge text-base px-8 py-4">
            {pick(t.hero.cta, lang)} →
          </Link>
          <span className="text-sm text-white/60">{pick(t.hero.sub, lang)}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-xl mt-20 animate-fade-up" style={{ animationDelay: "360ms" }}>
          {[
            { n: 4821, suf: "", label: pick(t.hero.stats.users, lang) },
            { n: 4396, suf: "", label: pick(t.hero.stats.plans, lang) },
            { n: 0, suf: "/5", label: pick(t.hero.stats.rating, lang) },
          ].map((s, i) => (
            <div key={i} className="glass p-5 sm:p-6">
              <div className="h-display text-3xl sm:text-4xl gradient-text">
                {i === 2 ? <><Counter to={4} />{"."}<Counter to={87} />/5</> : <Counter to={s.n} />}
                {i !== 2 && s.suf}
              </div>
              <div className="text-xs sm:text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
