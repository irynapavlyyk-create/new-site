"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick, format, plural } from "@/lib/translations";
import { getPhenotype } from "@/lib/phenotypes";
import type { ProPlanV2 } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergyChart from "./EnergyChart";
import TodayFocus from "./TodayFocus";
import WeeklyProgram from "./WeeklyProgram";
import ProtocolCard from "./ProtocolCard";
import SupplementCard from "./SupplementCard";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import PhenotypeHero from "@/components/PhenotypeHero";
import { PdfIcon } from "@/components/icons";

type Props = {
  plan: ProPlanV2;
  userEmail: string | null;
  planTier: string | null;
  planCreatedAt: string;
  sessionId?: string | null;
};

export default function PhenotypeDashboard({
  plan,
  userEmail,
  planTier,
  planCreatedAt,
  sessionId = null,
}: Props) {
  const { lang } = useI18n();
  const phenotype = getPhenotype(plan.phenotypeId);

  // Suppress unused-var lint until Phase 2.2-2.4 consume these.
  void userEmail;
  void planTier;

  // Day counter — clamped 1..30
  const startMs = new Date(planCreatedAt).getTime();
  const elapsedDays = Math.floor((Date.now() - startMs) / 86_400_000);
  const currentDay = Math.min(Math.max(elapsedDays + 1, 1), 30);
  const currentWeek = Math.min(Math.ceil(currentDay / 7), 4);
  const progressPct = (currentDay / 30) * 100;

  return (
    <>
      <Navbar showLanguageSwitcher={false} />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* TOPBAR — Phenotype card + Progress card */}
          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <PhenotypeHero phenotype={phenotype} />

            {/* Progress card */}
            <div className="glass p-8 flex flex-col">
              <div className="text-sm text-muted mb-5">{pick(t.dashboard.protocolTitle, lang)}</div>
              <div className="text-6xl font-extrabold leading-none mb-2">
                {String(currentDay).padStart(2, "0")}
                <span className="text-3xl text-muted/50 font-medium">/30</span>
              </div>
              <div className="text-sm text-muted mb-6">
                {format(pick(t.dashboard.dayProgress, lang), { d: currentDay, w: currentWeek })}
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber to-orange rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted font-mono mt-3">
                <span className={currentWeek >= 1 ? "text-amber" : ""}>{pick(t.dashboard.week, lang)} 1</span>
                <span className={currentWeek >= 2 ? "text-amber" : ""}>{pick(t.dashboard.week, lang)} 2</span>
                <span className={currentWeek >= 3 ? "text-amber" : ""}>{pick(t.dashboard.week, lang)} 3</span>
                <span className={currentWeek >= 4 ? "text-amber" : ""}>{pick(t.dashboard.week, lang)} 4</span>
              </div>
            </div>
          </section>

          <EnergyChart phenotype={phenotype} />

          <TodayFocus week={plan.weeks[currentWeek - 1]} currentDay={currentDay} />

          <WeeklyProgram weeks={plan.weeks} currentWeek={currentWeek} />

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <ProtocolCard
              variant="morning"
              title={pick(t.dashboard.sections.morning, lang)}
              steps={plan.morningProtocol}
            />
            <ProtocolCard
              variant="sleep"
              title={pick(t.dashboard.sections.sleep, lang)}
              steps={plan.sleepProtocol}
            />
          </section>

          <section className="mb-8">
            <div className="flex flex-wrap gap-3 justify-between items-baseline mb-5">
              <h2 className="h-display text-xl sm:text-2xl font-bold">
                {pick(t.dashboard.supplementStack, lang)}
              </h2>
              <span className="text-xs text-muted">
                {format(pick(t.dashboard.supplementMeta, lang), {
                  n: plan.supplements.length,
                  items: plural(plan.supplements.length, pick(t.dashboard.supplementNoun, lang)),
                })}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {plan.supplements.map((supp, i) => (
                <SupplementCard key={i} supplement={supp} index={i} />
              ))}
            </div>
            <MedicalDisclaimer />
            <AffiliateDisclosure />
          </section>

          <div className="flex justify-center">
            <a
              href={`/api/plan/pdf${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""}`}
              download
              className="btn-ghost inline-flex items-center gap-2"
            >
              <PdfIcon className="w-4 h-4" />
              {pick(t.dashboard.downloadPdf, lang)}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
