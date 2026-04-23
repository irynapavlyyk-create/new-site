"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { ProPlan } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { safeLoad, safeSave } from "@/lib/storage";
import { createClient } from "@/utils/supabase/client";

export default function DashboardClient({
  userEmail,
  initialPlan = null,
  initialPlanTier = null,
}: {
  userEmail?: string | null;
  initialPlan?: ProPlan | null;
  initialPlanTier?: string | null;
}) {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent
        userEmail={userEmail}
        initialPlan={initialPlan}
        initialPlanTier={initialPlanTier}
      />
    </Suspense>
  );
}

function DashboardFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className="w-16 h-16 rounded-full border-4 border-t-amber animate-spin"
        style={{
          borderLeftColor: "var(--border)",
          borderRightColor: "var(--border)",
          borderBottomColor: "var(--border)",
        }}
      />
    </main>
  );
}

type DashState =
  | { kind: "loading-cache" }
  | { kind: "generating" }
  | { kind: "ready"; plan: ProPlan }
  | { kind: "no-plan" }
  | { kind: "error"; detail?: string };

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;

function DashboardContent({
  userEmail,
  initialPlan,
  initialPlanTier,
}: {
  userEmail?: string | null;
  initialPlan: ProPlan | null;
  initialPlanTier: string | null;
}) {
  const { lang } = useI18n();
  void userEmail;
  void initialPlanTier;
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  // Supabase returns auth errors (e.g. expired magic link) via URL hash
  // because it uses the implicit flow. Server code can't see the hash,
  // so we detect it here and bounce to /login with a readable error code.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("error=")) return;
    const hashParams = new URLSearchParams(hash.slice(1));
    const raw =
      hashParams.get("error_code") || hashParams.get("error") || "access_denied";
    const normalized = raw === "otp_expired" ? "link_expired" : raw;
    window.location.replace(`/login?error=${encodeURIComponent(normalized)}`);
  }, []);

  const [state, setState] = useState<DashState>(() => {
    if (initialPlan && initialPlan.summary) {
      return { kind: "ready", plan: initialPlan };
    }
    return { kind: "loading-cache" };
  });

  // Persist server-delivered plan to localStorage for offline fallback.
  useEffect(() => {
    if (initialPlan && initialPlan.summary) {
      safeSave("ef_pro_plan", initialPlan);
    }
  }, [initialPlan]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialPlan && initialPlan.summary) return; // already ready from server

    // Priority 2: poll DB for plan that matches the checkout session (webhook may still be processing).
    if (sessionId) {
      setState({ kind: "generating" });
      const supabase = createClient();
      const started = Date.now();
      let cancelled = false;

      const poll = async () => {
        const { data, error } = await supabase
          .from("plans")
          .select("plan_data, tier")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          console.error("[dashboard] plan poll error:", error);
        }
        const plan = (data?.plan_data as ProPlan | null) ?? null;
        if (plan && plan.summary) {
          safeSave("ef_pro_plan", plan);
          setState({ kind: "ready", plan });
          return;
        }
        if (Date.now() - started > POLL_TIMEOUT_MS) {
          setState({
            kind: "error",
            detail: "Plan generation is taking longer than expected. Please contact support.",
          });
          return;
        }
        timer = window.setTimeout(poll, POLL_INTERVAL_MS);
      };

      let timer: number | undefined = window.setTimeout(poll, 0);
      return () => {
        cancelled = true;
        if (timer !== undefined) window.clearTimeout(timer);
      };
    }

    // Priority 3: localStorage fallback.
    const cached = safeLoad<ProPlan>("ef_pro_plan");
    if (cached && cached.summary) {
      setState({ kind: "ready", plan: cached });
      return;
    }

    setState({ kind: "no-plan" });
  }, [sessionId, initialPlan]);

  if (state.kind === "loading-cache" || state.kind === "generating") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
          <div className="text-center max-w-md">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: "var(--border)" }}
              />
              <div className="absolute inset-0 rounded-full border-4 border-t-amber border-r-orange border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber/30 to-violet/30 blur-2xl" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-spin-slow">
                ⚡
              </div>
            </div>
            {state.kind === "generating" && (
              <>
                <h2 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                  <span className="gradient-text">
                    {pick(t.dashboard.generating, lang)}
                  </span>
                </h2>
                <p className="text-muted text-sm">
                  {pick(t.dashboard.generatingSub, lang)}
                </p>
              </>
            )}
          </div>
        </main>
      </>
    );
  }

  if (state.kind === "no-plan") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
          <div className="text-center max-w-md">
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

  if (state.kind === "error") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <p className="text-muted mb-4">{pick(t.dashboard.genError, lang)}</p>
            {state.detail && (
              <p
                className="text-xs font-mono mb-6 px-3 py-2 rounded break-words"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  color: "rgb(var(--muted))",
                }}
              >
                {state.detail}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              {pick(t.dashboard.retryGen, lang)}
            </button>
          </div>
        </main>
      </>
    );
  }

  const plan = state.plan;

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
              <h2 className="h-display text-xl font-bold mb-4 text-amber">💊 {pick(t.dashboard.sections.supplements, lang)}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {plan.supplements.map((s, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
                    <div className="font-display font-bold text-base">{s.name}</div>
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
              <h2 className="h-display text-xl font-bold mb-6 text-amber">📅 {pick(t.dashboard.sections.plan, lang)}</h2>
              <div className="space-y-4">
                {plan.thirtyDayPlan.map((week) => (
                  <div key={week.week} className="border-l-2 border-amber/40 pl-4">
                    <div className="font-display font-bold text-sm text-amber mb-1">
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
        <h2 className={`h-display text-lg font-bold mb-4 ${color}`}>{title}</h2>
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
