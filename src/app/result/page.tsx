"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { FreeReport } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";

export default function ResultPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [report, setReport] = useState<FreeReport | null>(null);
  const [loadingTier, setLoadingTier] = useState<"pro" | "coach" | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("ef_free_report") : null;
    if (!raw) {
      router.replace("/quiz");
      return;
    }
    try {
      setReport(JSON.parse(raw));
    } catch {
      router.replace("/quiz");
    }
  }, [router]);

  const unlock = async (tier: "pro" | "coach") => {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, lang }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setLoadingTier(null);
    } catch {
      setLoadingTier(null);
    }
  };

  if (!report) return null;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl mb-8 text-center">
              <span className="gradient-text">{pick(t.result.freeTitle, lang)}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={100}>
            <div className="glass p-8 mb-6">
              <h2 className="h-display text-xl font-bold mb-6 text-amber">⚡ {pick(t.result.leaks, lang)}</h2>
              <div className="space-y-4">
                {report.topIssues.map((leak, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-amber/20 text-amber flex items-center justify-center font-display font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="h-display text-lg font-bold mb-1">{leak.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{leak.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="glass p-8 mb-10">
              <h2 className="h-display text-xl font-bold mb-6 text-violet">✦ {pick(t.result.tips, lang)}</h2>
              <ul className="space-y-3">
                {report.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-amber flex-shrink-0 mt-0.5">→</span>
                    <span className="text-ink">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={300}>
            <div className="relative glass-strong p-8 sm:p-10 overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber/10 via-orange/10 to-violet/10" />
              <div className="relative">
                <h2 className="h-display text-2xl sm:text-3xl mb-3 text-center">
                  <span className="gradient-text">🔒 {pick(t.result.lockedTitle, lang)}</span>
                </h2>
                <p className="text-center text-muted mb-6">{pick(t.result.lockedSub, lang)}</p>

                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <div className="glass p-6 sm:p-8 select-none">
                    <div className="h-display text-lg font-bold text-amber mb-4">
                      {pick(t.result.teaser.heading, lang)}
                    </div>
                    <p className="text-ink leading-relaxed mb-3">
                      {pick(t.result.teaser.line1, lang)}
                    </p>
                    <p className="text-ink leading-relaxed mb-4">
                      {pick(t.result.teaser.line2, lang)}
                    </p>
                    <p
                      className="text-ink leading-relaxed mb-3"
                      style={{ filter: "blur(2px)", WebkitFilter: "blur(2px)" }}
                    >
                      {pick(t.result.teaser.line3, lang)}
                    </p>
                    <p
                      className="text-ink leading-relaxed mb-3"
                      style={{ filter: "blur(4px)", WebkitFilter: "blur(4px)" }}
                    >
                      {pick(t.result.teaser.line4, lang)}
                    </p>
                    <p
                      className="text-ink leading-relaxed mb-3"
                      style={{ filter: "blur(6px)", WebkitFilter: "blur(6px)" }}
                    >
                      {pick(t.result.teaser.line5, lang)}
                    </p>
                    <p
                      className="text-ink leading-relaxed"
                      style={{ filter: "blur(6px)", WebkitFilter: "blur(6px)" }}
                    >
                      {pick(t.result.teaser.line6, lang)}
                    </p>
                  </div>
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, var(--preview-blur-from) 0%, var(--preview-blur-to) 85%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber to-orange shadow-glow">
                      <span className="text-2xl" style={{ color: "var(--btn-text)" }}>🔒</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="h-display text-2xl sm:text-3xl font-bold mb-2">
                    {pick(t.result.choose.title, lang)}
                  </h3>
                  <p className="text-muted text-sm">{pick(t.result.choose.subtitle, lang)}</p>
                </div>

                <div className="pricing-grid-2 items-stretch">
                  <PricingCard
                    accent="amber"
                    badge={pick(t.result.choose.pro.badge, lang)}
                    name={pick(t.result.choose.pro.name, lang)}
                    price={pick(t.result.choose.pro.price, lang)}
                    period={pick(t.result.choose.pro.period, lang)}
                    features={pick(t.result.choose.pro.features, lang)}
                    cta={pick(t.result.choose.pro.cta, lang)}
                    loading={loadingTier === "pro"}
                    disabled={loadingTier !== null}
                    onClick={() => unlock("pro")}
                  />
                  <PricingCard
                    accent="violet"
                    highlighted
                    badge={pick(t.result.choose.coach.badge, lang)}
                    name={pick(t.result.choose.coach.name, lang)}
                    price={pick(t.result.choose.coach.price, lang)}
                    period={pick(t.result.choose.coach.period, lang)}
                    features={pick(t.result.choose.coach.features, lang)}
                    cta={pick(t.result.choose.coach.cta, lang)}
                    loading={loadingTier === "coach"}
                    disabled={loadingTier !== null}
                    onClick={() => unlock("coach")}
                  />
                </div>

                <p className="text-center text-xs text-muted mt-5">
                  {pick(t.result.choose.upgradeNote, lang)}
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PricingCard({
  accent,
  highlighted = false,
  badge,
  name,
  price,
  period,
  features,
  cta,
  loading,
  disabled,
  onClick,
}: {
  accent: "amber" | "violet";
  highlighted?: boolean;
  badge: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const isViolet = accent === "violet";
  const checkColor = isViolet ? "text-violet" : "text-amber";
  const badgeBg = isViolet
    ? "bg-gradient-to-r from-violet to-orange"
    : "bg-gradient-to-r from-amber to-orange";
  const btnClass = isViolet
    ? "w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glowViolet disabled:opacity-60 disabled:hover:translate-y-0"
    : "btn-primary w-full py-3.5 disabled:opacity-60 disabled:hover:translate-y-0";
  const btnStyle = isViolet ? { background: "rgb(var(--violet))" } : undefined;
  const cardStyle = highlighted
    ? {
        borderWidth: "2px",
        borderColor: "rgb(var(--violet))",
        boxShadow: "0 0 50px rgba(123, 97, 255, 0.25)",
      }
    : undefined;

  return (
    <div
      className="relative glass h-full flex flex-col overflow-hidden min-w-0"
      style={{ ...cardStyle, padding: "clamp(12px, 2vw, 28px)" }}
    >
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeBg} font-bold px-3 py-1 rounded-full whitespace-nowrap max-w-[calc(100%-1rem)]`}
        style={{
          color: "var(--btn-text)",
          fontSize: "clamp(10px, 1vw, 12px)",
        }}
      >
        {badge}
      </div>
      <h4
        className="h-display font-bold text-muted mt-2 break-words"
        style={{ fontSize: "clamp(14px, 1.8vw, 20px)" }}
      >
        {name}
      </h4>
      <div className="mt-2 mb-1 flex items-baseline flex-wrap gap-x-2 gap-y-1 min-w-0">
        <span
          className="h-display font-bold text-ink break-words max-w-full"
          style={{ fontSize: "clamp(20px, 3.5vw, 48px)", lineHeight: 1.1 }}
        >
          {price}
        </span>
      </div>
      <p
        className="text-muted mb-5 break-words"
        style={{ fontSize: "clamp(11px, 1.2vw, 14px)" }}
      >
        {period}
      </p>
      <ul
        className="mb-6 flex-1"
        style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 1vw, 12px)" }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            className="flex gap-2 min-w-0"
            style={{ fontSize: "clamp(12px, 1.4vw, 15px)" }}
          >
            <span className={`${checkColor} flex-shrink-0 font-bold`}>✓</span>
            <span className="text-ink leading-snug break-words min-w-0">{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={btnClass}
        style={{ ...btnStyle, fontSize: "clamp(13px, 1.5vw, 16px)" }}
      >
        {loading ? "…" : <>{cta} →</>}
      </button>
    </div>
  );
}
