"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { csPathFor, enPathFor } from "@/lib/locale-paths";
import type { Lang } from "@/types";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("ef_lang") as Lang | null) : null;
    if (stored === "en" || stored === "cs") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("cs")) {
      setLangState("cs");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ef_lang", l);
  };

  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/**
 * i18n context for pages whose language lives in the URL (/ ↔ /cs, /terms ↔
 * /cs/terms, …). `lang` comes from the route segment — server-rendered, so
 * there is no flash of English before Czech. `setLang` (what the existing
 * LanguageSwitcher calls) navigates to the counterpart URL instead of just
 * flipping context, and still records the choice in localStorage so
 * context-driven pages (quiz, dashboard) and the next visit follow it.
 */
export function RouteLangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Returning visitor lands on their language: on the EN variant, a stored
  // "cs" choice — or a Czech browser with no stored choice, mirroring the old
  // localStorage/navigator behavior — moves to the /cs URL client-side.
  // Crawlers have neither, so / keeps serving EN with a plain 200 (no 3xx).
  useEffect(() => {
    if (lang !== "en") return;
    try {
      const stored = localStorage.getItem("ef_lang");
      const wantsCs =
        stored === "cs" ||
        (!stored && navigator.language.toLowerCase().startsWith("cs"));
      if (wantsCs) router.replace(csPathFor(enPathFor(pathname)));
    } catch {
      // localStorage unavailable → stay on EN
    }
  }, [lang, pathname, router]);

  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("ef_lang", l);
    } catch {
      // choice just won't persist
    }
    if (l === lang) return;
    const enPath = enPathFor(pathname);
    router.push(l === "cs" ? csPathFor(enPath) : enPath);
  };

  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
}

/**
 * Pins the i18n context to a fixed language for a subtree, with a no-op setLang.
 * Used to lock the paid V2 dashboard to the plan's generation language so the
 * single-language AI content and chrome never disagree.
 */
export function FixedLangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, setLang: () => {} }}>{children}</I18nContext.Provider>;
}
