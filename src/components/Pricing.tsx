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
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i) => {
          const isPro = p.name === "PRO";
          return (
            <FadeUp key={p.name} delay={i * 120}>
              <div
                className={`relative glass p-8 h-full flex flex-col ${
                  isPro ? "!border-amber/50 shadow-glow scale-105" : ""
                }`}
              >
                {p.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber to-orange text-black text-xs font-bold px-3 py-1 rounded-full">
                    {p.tag}
                  </div>
                )}
                <h3 className="h-display text-lg text-muted">{p.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="h-display text-4xl sm:text-5xl">{p.price}</span>
                  {p.period && <span className="text-muted ml-1 text-sm">{p.period}</span>}
                </div>
                <p className="text-sm text-muted mb-6">{p.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm">
                      <span className="text-amber flex-shrink-0">✓</span>
                      <span className="text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ctaHref(p.name)}
                  className={isPro ? "btn-primary w-full" : "btn-ghost w-full"}
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
