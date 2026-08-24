"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { track } from "@/lib/analytics";
import { isPromoActive, PROMO_PRICES, PROMO_LABEL } from "@/lib/promo";
import { COACH_ENABLED } from "@/lib/flags";
import FadeUp from "./FadeUp";

export default function Pricing() {
  const { lang } = useI18n();
  // Coach is off sale unless the flag is on; the checkout routes refuse it too.
  const plans = pick(t.pricing.plans, lang).filter((p) => COACH_ENABLED || p.name !== "Coach");
  const ctaHref = (name: string) =>
    name === "Starter" ? "/quiz" : name === "PRO" ? "/quiz?goto=pro" : "/quiz?goto=coach";

  // Launch promo (auto-reverts after PROMO_END). Map the landing plan names to
  // the promo tiers; Starter (free) never has a promo.
  const promo = isPromoActive();
  const promoTier = (name: string): "pro" | "coach" | null =>
    name === "PRO" ? "pro" : name === "Coach" ? "coach" : null;

  // Funnel: fire pricing_viewed only once the section actually scrolls into
  // view (not on every homepage load) so the metric reflects real views.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fired) {
          fired = true;
          track("pricing_viewed", { location: "landing" });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="pricing" ref={sectionRef}>
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-4">
          <span className="gradient-text">{pick(t.pricing.title, lang)}</span>
        </h2>
        <p className="text-center text-muted mb-14">{pick(t.pricing.subtitle, lang)}</p>
      </FadeUp>
      <div className={plans.length === 3 ? "pricing-grid-3" : "pricing-grid-2"}>
        {plans.map((p, i) => {
          const isPro = p.name === "PRO";
          const pt = promo ? promoTier(p.name) : null;
          return (
            <FadeUp key={p.name} delay={i * 100}>
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
                  {pt && (
                    <span
                      className="h-display font-bold text-muted line-through break-words"
                      style={{ fontSize: "clamp(16px, 2.6vw, 34px)", lineHeight: 1.1 }}
                    >
                      {PROMO_PRICES[pt].original}
                    </span>
                  )}
                  <span
                    className="h-display font-bold break-words max-w-full"
                    style={{ fontSize: "clamp(20px, 3.5vw, 48px)", lineHeight: 1.1 }}
                  >
                    {pt ? PROMO_PRICES[pt].discounted : p.price}
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
                {pt && (
                  <p
                    className="font-semibold text-amber mb-2 break-words"
                    style={{ fontSize: "clamp(10px, 1.1vw, 13px)" }}
                  >
                    {pick(PROMO_LABEL, lang)}
                  </p>
                )}
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
