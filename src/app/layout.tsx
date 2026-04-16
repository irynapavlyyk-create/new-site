import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "EnergyForge — AI energy diagnostic",
  description: "Personal 30-day energy protocol, forged by AI. Answer 9 questions — get a plan that works.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "EnergyForge — Forge your energy",
    description: "Personal 30-day energy protocol, forged by AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
