"use client";

import { useI18n } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 p-1 bg-white/5 backdrop-blur">
      {(["en", "ru"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
            lang === l ? "bg-gradient-to-r from-amber to-orange text-black" : "text-muted hover:text-ink"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
