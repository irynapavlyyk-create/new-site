"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useI18n();

  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div className="text-center max-w-lg">
          <FadeUp>
            <div className="text-6xl mb-6">⚡</div>
            <h1 className="h-display text-3xl sm:text-4xl mb-4">
              <span className="gradient-text">
                {pick(t.errors.serverError.heading, lang)}
              </span>
            </h1>
            <p className="text-muted mb-8 leading-relaxed">
              {pick(t.errors.serverError.message, lang)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={() => reset()} className="btn-primary">
                {pick(t.errors.serverError.tryAgain, lang)}
              </button>
              <a href="mailto:support@energyforge.app" className="btn-ghost">
                {pick(t.errors.serverError.contactSupport, lang)}
              </a>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
