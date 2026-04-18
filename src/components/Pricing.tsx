"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function Pricing() {
  const { lang } = useI18n();
  const plans = pick(t.pricing.plans, lang);
  const ctaHref = (name: string) =>
    name === "Starter" ? "/quiz" : name === "PRO" ? "/quiz?goto=pro" : "/quiz?goto=coach";

  return (
    <section className="section" id="pricing">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-4">
          <span className="gradient-text">{pick(t.pricing.title, lang)}</span>
        </h2>
        <p className="text-center text-muted mb-14">{pick(t.pricing.subtitle, lang)}</p>
      </FadeUp>
      <div className="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-5 sm:gap-6">
        {plans.map((p, i) => {
          const isPro = p.name === "PRO";
          return (
            <FadeUp key={p.name} delay={i * 120}>
              <div
                className={`relative glass p-5 sm:p-6 md:p-8 h-full flex flex-col overflow-hidden min-w-0 ${
                  isPro
                    ? "!border-amber/50 shadow-glow min-[1200px]:scale-105"
                    : ""
                }`}
              >
                {p.tag && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber to-orange text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap max-w-[calc(100%-1rem)]"
                    style={{ color: "var(--btn-text)" }}
                  >
                    {p.tag}
                  </div>
                )}
                <h3 className="h-display text-lg font-bold text-muted break-words">
                  {p.name}
                </h3>
                <div className="mt-3 mb-2 flex items-baseline flex-wrap gap-x-2 gap-y-1 min-w-0">
                  <span className="h-display text-3xl sm:text-4xl md:text-5xl font-bold break-words max-w-full">
                    {p.price}
                  </span>
                  {p.period && (
                    <span className="text-muted text-sm break-words">{p.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted mb-6 break-words">{p.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm min-w-0">
                      <span className="text-amber flex-shrink-0">✓</span>
                      <span className="text-ink break-words min-w-0">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ctaHref(p.name)}
                  className={
                    isPro ? "btn-primary w-full justify-center" : "btn-ghost w-full justify-center"
                  }
                >
                  {p.cta}
                </Link>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
