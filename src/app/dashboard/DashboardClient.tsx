"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { Lang, ProPlan } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import RegenerateButton from "./RegenerateButton";
import { fbqPurchaseOnce } from "@/lib/analytics";

const POLL_INTERVAL_MS = 3000;
const SAFETY_CAP_MS = 330_000; // hard ceiling on polling — generation deadline is 270 s + function kill at 300 s (see planState.PENDING_STALE_MS)
const READY_HOLD_MS = 400;     // brief 100% hold before reload

export default function DashboardClient({
  userEmail,
  initialPlan = null,
  initialPlanTier = null,
  sessionId = null,
}: {
  userEmail?: string | null;
  initialPlan?: ProPlan | null;
  initialPlanTier?: string | null;
  sessionId?: string | null;
}) {
  const { lang } = useI18n();
  void userEmail;
  void initialPlanTier;

  // Arrived from a fresh purchase (Stripe success_url carries session_id).
  const fromStripe = Boolean(sessionId);

  // Meta Pixel Purchase — payment is complete whenever Stripe sends us here
  // with a session_id; deduped per session in localStorage.
  useEffect(() => {
    if (sessionId) fbqPurchaseOnce(sessionId, 9.99);
  }, [sessionId]);

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

  const planMissing = !initialPlan || !initialPlan.summary;

  if (planMissing && fromStripe) {
    return <PlanForgingScreen lang={lang} sessionId={sessionId} />;
  }

  if (planMissing) {
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

  const plan = initialPlan;

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
              <MedicalDisclaimer />
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

function PlanForgingScreen({
  lang,
  sessionId = null,
}: {
  lang: Lang;
  sessionId?: string | null;
}) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [stopped, setStopped] = useState(false);   // 401: stop silently
  const [timedOut, setTimedOut] = useState(false); // hit SAFETY_CAP_MS
  const startRef = useRef<number>(Date.now());

  // Simulated progress: linear toward 90% ceiling over SAFETY_CAP_MS,
  // then idles. Only hits 100% once `ready` is true.
  useEffect(() => {
    if (timedOut || stopped) return; // freeze where it is
    if (ready) {
      setProgress(100);
      return;
    }
    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(90, (elapsed / SAFETY_CAP_MS) * 90));
    }, 150);
    return () => clearInterval(id);
  }, [ready, stopped, timedOut]);

  // Polling loop — in-page fetch, no reloads.
  // Stops on ready, 401, or safety cap.
  useEffect(() => {
    if (ready || stopped || timedOut) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelled) return;
      try {
        // Scope the poll to this purchase so it waits for THIS plan, not a
        // prior one. The reload on ready preserves ?session_id, so the SSR
        // re-render is scoped to the same session.
        const url = sessionId
          ? `/api/plan-status?session_id=${encodeURIComponent(sessionId)}`
          : "/api/plan-status";
        const res = await fetch(url, { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 401) {
          setStopped(true);
          return;
        }
        if (res.ok) {
          const data = (await res.json()) as { ready?: boolean };
          if (data.ready) {
            setReady(true);
            return;
          }
        }
      } catch {
        // Network glitch — swallow and retry next tick.
      }
      if (!cancelled) {
        timeoutId = setTimeout(tick, POLL_INTERVAL_MS);
      }
    };

    tick();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [ready, stopped, timedOut, sessionId]);

  // Safety cap — flip to timedOut after SAFETY_CAP_MS so the polling
  // loop and the progress ticker both freeze.
  useEffect(() => {
    if (ready || stopped) return;
    const id = setTimeout(() => setTimedOut(true), SAFETY_CAP_MS);
    return () => clearTimeout(id);
  }, [ready, stopped]);

  // After ready, hold at 100% briefly, then reload exactly once so
  // the SSR page renders the real dashboard or the error card.
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => {
      window.location.reload();
    }, READY_HOLD_MS);
    return () => clearTimeout(id);
  }, [ready]);

  const givenUp = stopped || timedOut;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6">
        <div className="text-center max-w-lg w-full">
          {givenUp ? (
            <>
              <div className="text-6xl mb-6">⚡</div>
              <p className="text-muted text-base mb-6">{pick(t.dashboard.forgingTimeout, lang)}</p>
              {timedOut ? (
                // Past SAFETY_CAP_MS the pending row is stale (PENDING_STALE_MS),
                // so /api/plan/regenerate will re-claim it instead of 409.
                <RegenerateButton lang={lang} sessionId={sessionId} />
              ) : null}
            </>
          ) : (
            <>
              <div className="text-6xl mb-8">⚡</div>
              <h1 className="h-display text-3xl sm:text-4xl mb-4">
                <span className="gradient-text">{pick(t.dashboard.forging, lang)}</span>
              </h1>
              <p className="text-muted mb-10">{pick(t.dashboard.forgingSub, lang)}</p>
              <div className="max-w-sm mx-auto">
                <div className="text-2xl font-mono font-bold text-amber mb-3">
                  {Math.round(progress)}%
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber to-orange transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
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
