"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PhenotypeHero from "@/components/PhenotypeHero";
import EnergyChart from "@/app/dashboard/EnergyChart";
import { safeLoad } from "@/lib/storage";
import { createClient } from "@/utils/supabase/client";
import type { QuizAnswers } from "@/types";
import { inferPhenotype } from "@/lib/inferPhenotype";
import { getPhenotype } from "@/lib/phenotypes";
import { getPhenotypePreview } from "@/lib/phenotypePreviews";
import { detectPatterns } from "@/lib/signals";
import { track, getDistinctId } from "@/lib/analytics";
import { isPromoActive, PROMO_PRICES, PROMO_LABEL } from "@/lib/promo";
import LockedProtocol from "./LockedProtocol";
import UpsellModal from "./UpsellModal";

export default function ResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultPageInner />
    </Suspense>
  );
}

function ResultPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useI18n();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [loadingTier, setLoadingTier] = useState<"pro" | "coach" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCanceled, setShowCanceled] = useState(
    searchParams.get("canceled") === "true",
  );

  useEffect(() => {
    const a = safeLoad<QuizAnswers>("ef_answers");
    if (!a) {
      router.replace("/quiz");
      return;
    }
    setAnswers(a);
  }, [router]);

  // Funnel: the quiz result + paywall are now shown. Fires once when answers
  // load (phenotype is known here, so attach it to quiz_completed).
  useEffect(() => {
    if (!answers) return;
    track("quiz_completed", { phenotype: inferPhenotype(answers) });
    track("pricing_viewed", { location: "result" });
  }, [answers]);

  const unlock = async (tier: "pro" | "coach") => {
    setLoadingTier(tier);

    // Funnel: user clicked buy. Capture the PostHog distinct_id so the
    // server-side purchase_completed event (fired from the Stripe webhook) can
    // be attributed to the same person.
    track("checkout_started", { plan: tier === "coach" ? "Coach" : "PRO" });
    const posthogDistinctId = getDistinctId();

    try {
      let answers: QuizAnswers | null = null;
      if (typeof window !== "undefined") {
        answers = safeLoad<QuizAnswers>("ef_answers");
        if (!answers) {
          setLoadingTier(null);
          router.replace("/quiz");
          return;
        }
        try {
          localStorage.setItem("ef_paid_tier", tier);
          localStorage.setItem("ef_lang", lang);
          localStorage.removeItem("ef_pro_plan");
        } catch (e) {
          console.error("[result] localStorage write failed:", e);
        }
      }

      let userId: string | null = null;
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id ?? null;
      } catch (e) {
        console.warn("[result] supabase.auth.getUser failed:", e);
      }

      // New flow: logged-out users go through /signup first (account + Stripe
      // in one step). Logged-in users skip signup and hit checkout directly.
      if (!userId) {
        if (typeof window !== "undefined" && answers) {
          try {
            sessionStorage.setItem("quiz_answers", JSON.stringify(answers));
            sessionStorage.setItem("quiz_lang", lang);
            sessionStorage.setItem("quiz_tier", tier);
            if (posthogDistinctId)
              sessionStorage.setItem("ph_distinct_id", posthogDistinctId);
          } catch (e) {
            console.error("[result] sessionStorage write failed:", e);
          }
        }
        router.push("/signup?from=quiz");
        return;
      }

      console.log("[result] starting checkout (returning user)", { tier, lang, hasAnswers: Boolean(answers) });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, lang, userId, answers, posthogDistinctId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setLoadingTier(null);
    } catch {
      setLoadingTier(null);
    }
  };

  if (!answers) return null;

  const phenotype = getPhenotype(inferPhenotype(answers));
  const preview = getPhenotypePreview(phenotype.id);
  const insightSignals = detectPatterns(answers)
    .filter((s) => !s.en.startsWith("USER PRIORITY:"))
    .slice(0, 3);
  const promo = isPromoActive();

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {showCanceled && (
            <FadeUp>
              <div
                className="glass relative mb-8 px-5 py-4 sm:px-6 sm:py-5"
                style={{ borderColor: "rgba(245, 158, 11, 0.35)" }}
              >
                <div className="flex items-start gap-3 pr-8">
                  <span className="text-2xl flex-shrink-0 leading-none">💭</span>
                  <p className="text-sm sm:text-base text-ink leading-relaxed">
                    {pick(t.pricing.canceledBanner.message, lang)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCanceled(false)}
                  aria-label={pick(t.pricing.canceledBanner.dismiss, lang)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-white/5 transition"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            </FadeUp>
          )}
          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl mb-8 text-center">
              <span className="gradient-text">{pick(t.result.freeTitle, lang)}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={50}>
            <div className="mb-6">
              <PhenotypeHero phenotype={phenotype} />
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <EnergyChart phenotype={phenotype} />
          </FadeUp>

          {insightSignals.length > 0 && (
            <FadeUp delay={150}>
              <div className="glass p-8 mb-10">
                <h2 className="h-display text-xl font-bold mb-6 text-amber">
                  ⚡ {pick(t.result.whatWeNoticed, lang)}
                </h2>
                <ul className="space-y-3">
                  {insightSignals.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-amber flex-shrink-0 mt-0.5">→</span>
                      <span className="text-ink leading-relaxed">{pick(s, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          )}

          <FadeUp delay={300}>
            <LockedProtocol
              phenotype={phenotype}
              preview={preview}
              onUnlock={() => setModalOpen(true)}
            />
          </FadeUp>

          <FadeUp delay={400}>
            <div className="mt-10">
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
                  price={promo ? PROMO_PRICES.pro.discounted : pick(t.result.choose.pro.price, lang)}
                  originalPrice={promo ? PROMO_PRICES.pro.original : undefined}
                  promoLabel={promo ? pick(PROMO_LABEL, lang) : undefined}
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
                  price={promo ? PROMO_PRICES.coach.discounted : pick(t.result.choose.coach.price, lang)}
                  originalPrice={promo ? PROMO_PRICES.coach.original : undefined}
                  promoLabel={promo ? pick(PROMO_LABEL, lang) : undefined}
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
          </FadeUp>
        </div>
      </main>
      <UpsellModal
        open={modalOpen}
        phenotypeName={pick(phenotype.name, lang)}
        loading={loadingTier === "pro"}
        onClose={() => setModalOpen(false)}
        onUnlock={() => unlock("pro")}
      />
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
  originalPrice,
  promoLabel,
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
  originalPrice?: string;
  promoLabel?: string;
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
      className="relative glass h-full flex flex-col min-w-0"
      style={{
        ...cardStyle,
        paddingTop: "clamp(32px, 3vw, 40px)",
        paddingLeft: "clamp(12px, 2vw, 28px)",
        paddingRight: "clamp(12px, 2vw, 28px)",
        paddingBottom: "clamp(12px, 2vw, 28px)",
      }}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${badgeBg} font-bold px-3 py-1 rounded-full whitespace-nowrap max-w-[calc(100%-1rem)] z-10`}
        style={{
          top: "-14px",
          color: "var(--btn-text)",
          fontSize: "clamp(10px, 1vw, 12px)",
        }}
      >
        {badge}
      </div>
      <h4
        className="h-display font-bold text-muted break-words"
        style={{ fontSize: "clamp(14px, 1.8vw, 20px)" }}
      >
        {name}
      </h4>
      <div className="mt-2 mb-1 flex items-baseline flex-wrap gap-x-2 gap-y-1 min-w-0">
        {originalPrice && (
          <span
            className="h-display font-bold text-muted line-through break-words"
            style={{ fontSize: "clamp(16px, 2.6vw, 34px)", lineHeight: 1.1 }}
          >
            {originalPrice}
          </span>
        )}
        <span
          className="h-display font-bold text-ink break-words max-w-full"
          style={{ fontSize: "clamp(20px, 3.5vw, 48px)", lineHeight: 1.1 }}
        >
          {price}
        </span>
      </div>
      {promoLabel && (
        <p
          className="font-semibold text-amber mb-1 break-words"
          style={{ fontSize: "clamp(10px, 1.1vw, 13px)" }}
        >
          {promoLabel}
        </p>
      )}
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
