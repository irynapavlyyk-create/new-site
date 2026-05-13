"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import type { ProPlan } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 30;
const STORAGE_KEY = "energyforge_plan_forging_attempts";

function readStoredAttempts(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeStoredAttempts(n: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // sessionStorage may be unavailable (private mode); fall through silently
  }
}

function clearStoredAttempts(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage may be unavailable; ignore
  }
}

export default function DashboardClient({
  userEmail,
  initialPlan = null,
  initialPlanTier = null,
  fromStripe = false,
}: {
  userEmail?: string | null;
  initialPlan?: ProPlan | null;
  initialPlanTier?: string | null;
  fromStripe?: boolean;
}) {
  const { lang } = useI18n();
  void userEmail;
  void initialPlanTier;

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

  // Once the plan has loaded, the forging screen is unmounted, so the
  // attempts counter is no longer needed. Clear it so a fresh checkout
  // starts counting from zero.
  useEffect(() => {
    if (initialPlan) clearStoredAttempts();
  }, [initialPlan]);

  const planMissing = !initialPlan || !initialPlan.summary;

  if (planMissing && fromStripe) {
    return <PlanForgingScreen lang={lang} />;
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

function PlanForgingScreen({ lang }: { lang: "en" | "ru" }) {
  const [attempts, setAttempts] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed from sessionStorage on mount so the counter survives reloads.
  // Stays at 0 during SSR / hydration to avoid mismatch; the real value
  // is applied right after.
  useEffect(() => {
    setAttempts(readStoredAttempts());
  }, []);

  useEffect(() => {
    if (attempts >= MAX_POLL_ATTEMPTS) {
      clearStoredAttempts();
      return;
    }
    timeoutRef.current = setTimeout(() => {
      writeStoredAttempts(attempts + 1);
      window.location.reload();
    }, POLL_INTERVAL_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [attempts]);

  const timedOut = attempts >= MAX_POLL_ATTEMPTS;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6">
        <div className="text-center max-w-lg">
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "var(--border)" }} />
            <div className="absolute inset-0 rounded-full border-4 border-t-amber border-r-orange border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber/30 to-violet/30 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-spin-slow">⚡</div>
          </div>

          {timedOut ? (
            <p className="text-muted text-base">{pick(t.dashboard.forgingTimeout, lang)}</p>
          ) : (
            <>
              <h1 className="h-display text-3xl sm:text-4xl mb-4">
                <span className="gradient-text">{pick(t.dashboard.forging, lang)}</span>
              </h1>
              <p className="text-muted">{pick(t.dashboard.forgingSub, lang)}</p>
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
