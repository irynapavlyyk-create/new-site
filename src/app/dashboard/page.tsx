"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { ProPlan } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";

export default function DashboardPage() {
  const { lang } = useI18n();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [plan, setPlan] = useState<ProPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem("ef_pro_plan") : null;
    if (cached) {
      try {
        setPlan(JSON.parse(cached));
        return;
      } catch {}
    }

    const answersRaw = typeof window !== "undefined" ? localStorage.getItem("ef_answers") : null;
    if (!answersRaw || !sessionId) return;

    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: JSON.parse(answersRaw), lang, tier: "pro", sessionId }),
        });
        const data = await res.json();
        localStorage.setItem("ef_pro_plan", JSON.stringify(data));
        setPlan(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, lang]);

  if (!plan && !loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-28">
          <div className="text-center max-w-md px-6">
            <div className="text-6xl mb-6">⚡</div>
            <p className="text-muted mb-6">{pick(t.dashboard.noPlan, lang)}</p>
            <Link href="/quiz" className="btn-primary">
              {pick(t.dashboard.startQuiz, lang)}
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (loading || !plan) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-amber animate-spin" />
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl mb-3">
              <span className="gradient-text">{pick(t.dashboard.welcome, lang)}</span>
            </h1>
            <p className="text-muted mb-10">{pick(t.dashboard.sub, lang)}</p>
          </FadeUp>

          <FadeUp delay={100}>
            <div className="glass p-8 mb-6">
              <p className="text-ink leading-relaxed">{plan.summary}</p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ListCard title={pick(t.dashboard.sections.morning, lang)} items={plan.morningProtocol} accent="amber" />
            <ListCard title={pick(t.dashboard.sections.sleep, lang)} items={plan.sleepProtocol} accent="violet" />
          </div>

          <FadeUp delay={200}>
            <div className="glass p-8 mb-6">
              <h2 className="h-display text-xl mb-4 text-amber">💊 {pick(t.dashboard.sections.supplements, lang)}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {plan.supplements.map((s, i) => (
                  <div key={i} className="border border-white/10 rounded-xl p-4">
                    <div className="font-display font-semibold">{s.name}</div>
                    <div className="text-amber text-sm mt-1">{s.dose}</div>
                    <div className="text-muted text-xs mt-2">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ListCard title={pick(t.dashboard.sections.nutrition, lang)} items={plan.nutrition} accent="orange" />
            <ListCard title={pick(t.dashboard.sections.stress, lang)} items={plan.stressProtocol} accent="violet" />
          </div>

          <FadeUp delay={300}>
            <div className="glass p-8 mb-6">
              <h2 className="h-display text-xl mb-6 text-amber">📅 {pick(t.dashboard.sections.plan, lang)}</h2>
              <div className="space-y-4">
                {plan.thirtyDayPlan.map((week) => (
                  <div key={week.week} className="border-l-2 border-amber/40 pl-4">
                    <div className="font-display font-semibold text-sm text-amber mb-1">
                      {pick(t.dashboard.week, lang)} {week.week}: {week.focus}
                    </div>
                    <ul className="text-sm text-muted space-y-1">
                      {week.actions.map((a, j) => (
                        <li key={j}>→ {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <div className="flex justify-center">
            <button
              className="btn-ghost"
              onClick={() => window.print()}
            >
              🖨 {pick(t.dashboard.downloadPdf, lang)}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ListCard({ title, items, accent }: { title: string; items: string[]; accent: "amber" | "violet" | "orange" }) {
  const color = accent === "amber" ? "text-amber" : accent === "violet" ? "text-violet" : "text-orange";
  return (
    <FadeUp>
      <div className="glass p-6 h-full">
        <h2 className={`h-display text-lg mb-4 ${color}`}>{title}</h2>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className={`${color} flex-shrink-0`}>→</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  );
}
