"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import SignOutButton from "./SignOutButton";

const copy = {
  emailLabel: { en: "Email", ru: "Email" },
  comingSoon: {
    en: "More settings coming soon — account details, subscription management, notification preferences.",
    ru: "Другие настройки появятся скоро — данные аккаунта, управление подпиской, настройки уведомлений.",
  },
  accountSection: { en: "Account", ru: "Аккаунт" },
  back: { en: "← Back to dashboard", ru: "← Назад в личный кабинет" },
};

export default function SettingsClient({ email }: { email: string | null }) {
  const { lang } = useI18n();

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted hover:text-ink transition-colors mb-10"
          >
            {pick(copy.back, lang)}
          </Link>

          <FadeUp>
            <h1 className="h-display text-4xl sm:text-5xl mb-10">
              <span className="gradient-text">{pick(t.nav.settings, lang)}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={80}>
            <section className="glass p-6 sm:p-8 mb-6">
              <h2 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
                {pick(copy.accountSection, lang)}
              </h2>
              <div>
                <p className="text-xs text-muted mb-1">
                  {pick(copy.emailLabel, lang)}
                </p>
                <p className="text-base text-ink break-all">{email}</p>
              </div>
            </section>
          </FadeUp>

          <FadeUp delay={140}>
            <section
              className="rounded-2xl p-6 mb-8"
              style={{
                border: "1px dashed var(--border)",
                background: "var(--card-bg)",
              }}
            >
              <p className="text-sm text-muted">{pick(copy.comingSoon, lang)}</p>
            </section>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="flex justify-start">
              <SignOutButton />
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
