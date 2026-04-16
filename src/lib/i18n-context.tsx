"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "@/types";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("ef_lang") as Lang | null) : null;
    if (stored === "en" || stored === "ru") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("ru")) {
      setLangState("ru");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ef_lang", l);
  };

  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
