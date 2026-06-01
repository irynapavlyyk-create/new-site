"use client";

import { useI18n } from "@/lib/i18n-context";
import { getPhenotype } from "@/lib/phenotypes";
import type { ProPlanV2 } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergyChart from "./EnergyChart";

type Props = {
  plan: ProPlanV2;
  userEmail: string | null;
  planTier: string | null;
  planCreatedAt: string;
};

export default function PhenotypeDashboard({
  plan,
  userEmail,
  planTier,
  planCreatedAt,
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
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* TOPBAR — Phenotype card + Progress card */}
          <section className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Phenotype hero */}
            <div className="glass p-8 relative overflow-hidden">
              <div className="text-xs tracking-widest text-amber/70 font-mono mb-3">
                TYPE {String(phenotype.typeNumber).padStart(2, "0")} OF 06 · ID {phenotype.shortCode}
              </div>
              <h1 className="h-display text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
                {phenotype.name[lang]}
              </h1>
              <p className="text-muted text-sm leading-relaxed mb-6">
                {phenotype.subtitle[lang]}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
                    {phenotype.crashWindow}
                  </div>
                  <div className="text-xs text-muted mt-1">Crash window</div>
                </div>
                <div>
                  <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
                    {phenotype.peakHours}
                  </div>
                  <div className="text-xs text-muted mt-1">Peak hours</div>
                </div>
                <div>
                  <div className="text-amber text-lg sm:text-xl font-bold leading-tight">
                    {phenotype.secondWind}
                  </div>
                  <div className="text-xs text-muted mt-1">Second wind</div>
                </div>
              </div>
            </div>

            {/* Progress card */}
            <div className="glass p-8 flex flex-col">
              <div className="text-sm text-muted mb-5">Your 30-day protocol</div>
              <div className="text-6xl font-extrabold leading-none mb-2">
                {String(currentDay).padStart(2, "0")}
                <span className="text-3xl text-muted/50 font-medium">/30</span>
              </div>
              <div className="text-sm text-muted mb-6">
                Day {currentDay} — Week {currentWeek} of 4
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber to-orange rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted font-mono mt-3">
                <span className={currentWeek >= 1 ? "text-amber" : ""}>Week 1</span>
                <span className={currentWeek >= 2 ? "text-amber" : ""}>Week 2</span>
                <span className={currentWeek >= 3 ? "text-amber" : ""}>Week 3</span>
                <span className={currentWeek >= 4 ? "text-amber" : ""}>Week 4</span>
              </div>
            </div>
          </section>

          <EnergyChart phenotype={phenotype} />

          {/* TODO Phase 2.3 — Week tabs */}
          <section className="glass p-8 mb-8 text-center text-muted text-sm">
            [Phase 2.3 — Week tabs (4 weeks) + Today&apos;s focus + Morning/Sleep protocols come here]
          </section>

          {/* TODO Phase 2.4 — Supplements */}
          <section className="glass p-8 mb-8 text-center text-muted text-sm">
            [Phase 2.4 — Supplements with iHerb/Amazon links come here]
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
