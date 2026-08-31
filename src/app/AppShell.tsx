import { Inter, Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "@/lib/theme-provider";
import AuroraBackground from "@/components/AuroraBackground";
import AuthHashHandler from "@/components/AuthHashHandler";
import CookieBanner from "@/components/CookieBanner";
import MetaPixel from "@/components/MetaPixel";
import PinterestTag from "@/components/PinterestTag";
import PostHogProvider from "@/components/PostHogProvider";
import { Analytics } from "@vercel/analytics/react";
import type { Lang } from "@/types";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap", weight: ["500", "600", "700", "800"] });

const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('ef-theme');
  var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.style.colorScheme=t;
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

/**
 * The <html>/<body> shell shared by BOTH root layouts. The app has two route
 * groups with their own root layouts so that <html lang> can come from the
 * URL for the localized pages without headers() (which would force the whole
 * app dynamic):
 *   (site)/[lang]/layout.tsx — /, /cs, legal pages; lang from the segment,
 *                              statically prerendered per language
 *   (app)/layout.tsx         — everything else; lang="en", context-driven text
 * Navigating between the groups is a full document load (Next behavior with
 * multiple root layouts) — acceptable at the marketing → app boundary.
 */
export default function AppShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <AuthHashHandler />
        <AuroraBackground />
        <PostHogProvider>
          <ThemeProvider>
            <I18nProvider>
              {children}
              <CookieBanner />
            </I18nProvider>
          </ThemeProvider>
        </PostHogProvider>
        <Analytics />
        <PinterestTag />
        <MetaPixel />
      </body>
    </html>
  );
}
