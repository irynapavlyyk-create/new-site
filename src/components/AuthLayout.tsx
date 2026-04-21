"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { lang } = useI18n();
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted hover:text-ink transition-colors mb-8"
          >
            {pick(t.legal.back, lang)}
          </Link>
          <div className="glass p-6 sm:p-8">
            <h1 className="h-display text-3xl sm:text-4xl mb-2">
              <span className="gradient-text">{title}</span>
            </h1>
            {subtitle && (
              <p className="text-muted text-sm mb-6">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
