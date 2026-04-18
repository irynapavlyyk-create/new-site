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
      <div className="pricing-grid-3">
        {plans.map((p, i) => {
          const isPro = p.name === "PRO";
          return (
            <FadeUp key={p.name} delay={i * 120}>
              <div
                className={`relative glass h-full flex flex-col min-w-0 ${
                  isPro ? "!border-amber/50 shadow-glow" : ""
                }`}
                style={{
                  paddingTop: "clamp(32px, 3vw, 40px)",
                  paddingLeft: "clamp(12px, 2vw, 28px)",
                  paddingRight: "clamp(12px, 2vw, 28px)",
                  paddingBottom: "clamp(12px, 2vw, 28px)",
                }}
              >
                {p.tag && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber to-orange font-bold px-3 py-1 rounded-full whitespace-nowrap max-w-[calc(100%-1rem)] z-10"
                    style={{
                      top: "-14px",
                      color: "var(--btn-text)",
                      fontSize: "clamp(10px, 1vw, 12px)",
                    }}
                  >
                    {p.tag}
                  </div>
                )}
                <h3
                  className="h-display font-bold text-muted break-words"
                  style={{ fontSize: "clamp(14px, 1.8vw, 20px)" }}
                >
                  {p.name}
                </h3>
                <div className="mt-3 mb-2 flex items-baseline flex-wrap gap-x-2 gap-y-1 min-w-0">
                  <span
                    className="h-display font-bold break-words max-w-full"
                    style={{ fontSize: "clamp(20px, 3.5vw, 48px)", lineHeight: 1.1 }}
                  >
                    {p.price}
                  </span>
                  {p.period && (
                    <span
                      className="text-muted break-words"
                      style={{ fontSize: "clamp(11px, 1.2vw, 14px)" }}
                    >
                      {p.period}
                    </span>
                  )}
                </div>
                <p
                  className="text-muted mb-6 break-words"
                  style={{ fontSize: "clamp(12px, 1.4vw, 15px)" }}
                >
                  {p.desc}
                </p>
                <ul className="mb-6 flex-1" style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 1vw, 12px)" }}>
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex gap-2 min-w-0"
                      style={{ fontSize: "clamp(12px, 1.4vw, 15px)" }}
                    >
                      <span className="text-amber flex-shrink-0">✓</span>
                      <span className="text-ink break-words min-w-0">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ctaHref(p.name)}
                  className={
                    isPro
                      ? "btn-primary w-full justify-center !px-3 !py-2.5"
                      : "btn-ghost w-full justify-center !px-3 !py-2.5"
                  }
                  style={{ fontSize: "clamp(13px, 1.5vw, 16px)" }}
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
