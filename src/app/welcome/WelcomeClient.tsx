"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Stage =
  | { kind: "invalid" }
  | { kind: "stage1" }
  | { kind: "stage2" }
  | { kind: "stage3" }
  | { kind: "error"; detail?: string | null }
  | { kind: "timeout" };

const POLL_INTERVAL_MS = 2000;
const MAX_TIMEOUT_MS = 5 * 60 * 1000;

export default function WelcomeClient() {
  const { lang } = useI18n();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [stage, setStage] = useState<Stage>(() =>
    sessionId ? { kind: "stage1" } : { kind: "invalid" }
  );

  // Polling pattern mirrors src/app/dashboard/DashboardClient.tsx — same query
  // shape (plans by stripe_session_id), same plan_data discrimination
  // (success | error marker), distinct stage transitions and timeout.
  useEffect(() => {
    if (!sessionId) return;
    if (typeof window === "undefined") return;

    const supabase = createClient();
    const started = Date.now();
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("plan_data")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[welcome] plan poll error:", error);
      }

      const planData = data?.plan_data as
        | { summary?: string; error?: never }
        | { error: string; detail?: string | null }
        | Record<string, never>
        | null
        | undefined;

      // Terminal: full plan written by generateAndSavePlan on success.
      if (planData && "summary" in planData && planData.summary) {
        setStage({ kind: "stage3" });
        return;
      }
      // Terminal: error marker written by generateAndSavePlan on failure.
      if (planData && "error" in planData && planData.error) {
        setStage({ kind: "error", detail: planData.detail ?? planData.error });
        return;
      }
      // Row exists with empty plan_data → webhook progressed past insert but
      // generation hasn't finished (or no answers were available to generate).
      if (data) {
        setStage({ kind: "stage2" });
      } else {
        setStage({ kind: "stage1" });
      }

      if (Date.now() - started > MAX_TIMEOUT_MS) {
        setStage({ kind: "timeout" });
        return;
      }
      timer = window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = window.setTimeout(poll, 0);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [sessionId]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div
          key={stage.kind}
          className="text-center max-w-md w-full transition-opacity duration-500 animate-[fadeIn_0.5s_ease-out]"
        >
          {stage.kind === "invalid" && (
            <>
              <div className="text-6xl mb-6">⚠️</div>
              <h1 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                <span className="gradient-text">
                  {pick(t.welcome.invalidTitle, lang)}
                </span>
              </h1>
              <p className="text-muted text-sm mb-6">
                {pick(t.welcome.invalidSub, lang)}
              </p>
              <Link href="/" className="btn-primary">
                {pick(t.welcome.goHome, lang)}
              </Link>
            </>
          )}

          {(stage.kind === "stage1" || stage.kind === "stage2") && (
            <>
              <SpinnerOrb />
              <h1 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                <span className="gradient-text">
                  {stage.kind === "stage1"
                    ? pick(t.welcome.stage1Title, lang)
                    : pick(t.welcome.stage2Title, lang)}
                </span>
              </h1>
              <p className="text-muted text-sm">
                {stage.kind === "stage1"
                  ? pick(t.welcome.stage1Sub, lang)
                  : pick(t.welcome.stage2Sub, lang)}
              </p>
            </>
          )}

          {stage.kind === "stage3" && (
            <>
              <SuccessOrb />
              <h1 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                <span className="gradient-text">
                  {pick(t.welcome.stage3Title, lang)}
                </span>
              </h1>
              <p className="text-muted text-sm mb-8">
                {pick(t.welcome.stage3Sub, lang)}
              </p>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                {pick(t.welcome.openGmail, lang)} →
              </a>
            </>
          )}

          {stage.kind === "error" && (
            <>
              <div className="text-6xl mb-6">⚠️</div>
              <h1 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                <span className="gradient-text">
                  {pick(t.welcome.errorTitle, lang)}
                </span>
              </h1>
              <p className="text-muted text-sm mb-4">
                {pick(t.welcome.errorSub, lang)}
              </p>
              {stage.detail && (
                <p
                  className="text-xs font-mono mb-4 px-3 py-2 rounded break-words"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    color: "rgb(var(--muted))",
                  }}
                >
                  {stage.detail}
                </p>
              )}
            </>
          )}

          {stage.kind === "timeout" && (
            <>
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="h-display text-2xl sm:text-3xl font-bold mb-3">
                <span className="gradient-text">
                  {pick(t.welcome.timeoutTitle, lang)}
                </span>
              </h1>
              <p className="text-muted text-sm mb-6">
                {pick(t.welcome.timeoutSub, lang)}
              </p>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                {pick(t.welcome.openGmail, lang)} →
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

function SpinnerOrb() {
  return (
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
  );
}

function SuccessOrb() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--amber)), rgb(var(--orange)))",
          boxShadow: "0 8px 32px rgba(245, 166, 35, 0.4)",
        }}
      />
      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber/30 to-violet/30 blur-2xl" />
      <div
        className="absolute inset-0 flex items-center justify-center text-4xl"
        style={{ color: "var(--btn-text)" }}
      >
        ✓
      </div>
    </div>
  );
}
