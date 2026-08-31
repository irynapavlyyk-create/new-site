"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";

export default function NotFound() {
  const { lang } = useI18n();

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div className="text-center max-w-lg">
          <FadeUp>
            <div className="text-6xl mb-6">⚡</div>
            <h1 className="h-display text-7xl sm:text-8xl mb-4 font-bold">
              <span className="gradient-text">404</span>
            </h1>
            <h2 className="h-display text-2xl sm:text-3xl mb-4">
              {pick(t.errors.notFound.heading, lang)}
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              {pick(t.errors.notFound.message, lang)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary">
                {pick(t.errors.notFound.backHome, lang)}
              </Link>
              <Link href="/quiz" className="btn-ghost">
                {pick(t.errors.notFound.takeQuiz, lang)}
              </Link>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
