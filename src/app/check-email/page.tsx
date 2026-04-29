"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckEmailPage() {
  const { lang } = useI18n();
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div className="text-center max-w-md w-full">
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
              ✨
            </div>
          </div>
          <h1 className="h-display text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">
              {pick(t.paymentSuccess.title, lang)}
            </span>
          </h1>
          <p className="text-ink text-base mb-2">
            {pick(t.paymentSuccess.subtitle, lang)}
          </p>
          <p className="text-muted text-sm mb-8">
            {pick(t.paymentSuccess.body, lang)}
          </p>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            {pick(t.paymentSuccess.button, lang)} →
          </a>
          <p className="text-xs text-muted mt-6">
            {pick(t.paymentSuccess.hint, lang)}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
