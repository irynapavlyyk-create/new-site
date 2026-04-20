"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  const { lang } = useI18n();
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted hover:text-ink transition-colors mb-10"
          >
            {pick(t.legal.back, lang)}
          </Link>

          <h1 className="h-display text-4xl sm:text-5xl mb-4">
            <span className="gradient-text">{title}</span>
          </h1>

          {lastUpdated && (
            <p className="text-xs text-muted mb-10 uppercase tracking-wide">
              {pick(t.legal.lastUpdated, lang)}: {lastUpdated}
            </p>
          )}

          <article className="legal-prose">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
