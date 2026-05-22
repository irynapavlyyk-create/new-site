import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "@/lib/theme-provider";
import AuroraBackground from "@/components/AuroraBackground";
import AuthHashHandler from "@/components/AuthHashHandler";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap", weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://www.energyforge.app"
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "EnergyForge — Discover your energy phenotype",
  description:
    "Six energy types. One is yours. AI-powered diagnostic finds why you're tired and builds your personalized 30-day protocol. Take the 9-question quiz in 3 minutes.",
  openGraph: {
    title: "Discover your energy phenotype",
    description:
      "Six energy types. One is yours. AI builds your personalized 30-day energy protocol from a 3-minute quiz.",
    url: "https://www.energyforge.app",
    siteName: "EnergyForge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EnergyForge — Discover your energy phenotype",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover your energy phenotype",
    description:
      "Six energy types. One is yours. AI builds your personalized 30-day energy protocol from a 3-minute quiz.",
    images: ["/og-image.png"],
  },
};

const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('ef-theme');
  var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.style.colorScheme=t;
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <AuthHashHandler />
        <AuroraBackground />
        <ThemeProvider>
          <I18nProvider>
            {children}
            <CookieBanner />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
