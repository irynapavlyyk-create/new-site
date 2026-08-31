import type { Metadata } from "next";
import AppShell from "@/app/AppShell";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata;

// Root layout for everything except the localized marketing/legal pages
// (those live under (site)/[lang] with their own root layout). Text language
// on these pages is context-driven (localStorage via I18nProvider); the
// document itself stays lang="en".
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppShell lang="en">{children}</AppShell>;
}
