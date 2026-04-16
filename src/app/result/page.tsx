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
  const [loadingPay, setLoadingPay] = useState(false);

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

  const unlock = async () => {
    setLoadingPay(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "pro", lang }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoadingPay(false);
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
              <h2 className="h-display text-xl mb-6 text-amber">⚡ {pick(t.result.leaks, lang)}</h2>
              <div className="space-y-4">
                {report.topIssues.map((leak, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-amber/20 text-amber flex items-center justify-center font-display font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1">{leak.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{leak.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="glass p-8 mb-10">
              <h2 className="h-display text-xl mb-6 text-violet">✦ {pick(t.result.tips, lang)}</h2>
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

                <div className="relative mb-6">
                  <div className="glass p-6 filter blur-sm select-none pointer-events-none">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-white/5 rounded w-full mb-2" />
                    <div className="h-3 bg-white/5 rounded w-5/6 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-4/6 mb-4" />
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-white/5 rounded w-full mb-2" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl">🔒</div>
                  </div>
                </div>

                <button
                  onClick={unlock}
                  disabled={loadingPay}
                  className="btn-primary w-full text-lg py-4 animate-pulse-glow disabled:opacity-60"
                >
                  {loadingPay ? "…" : pick(t.result.unlock, lang)} →
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
