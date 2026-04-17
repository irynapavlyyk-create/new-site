"use client";

import { useI18n } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div
      className="inline-flex items-center rounded-full p-1 backdrop-blur"
      style={{ border: "1px solid var(--border)", background: "var(--card-bg)" }}
    >
      {(["en", "ru"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
            lang === l ? "bg-gradient-to-r from-amber to-orange" : "text-muted hover:text-ink"
          }`}
          style={lang === l ? { color: "var(--btn-text)" } : undefined}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
