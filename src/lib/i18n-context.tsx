"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
 * Pins the i18n context to a fixed language for a subtree, with a no-op setLang.
 * Used to lock the paid V2 dashboard to the plan's generation language so the
 * single-language AI content and chrome never disagree.
 */
export function FixedLangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, setLang: () => {} }}>{children}</I18nContext.Provider>;
}
