"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

export default function Marquee() {
  const { lang } = useI18n();
  const items = pick(t.marquee.items, lang);
  const doubled = [...items, ...items];
  return (
    <div className="relative py-6 overflow-hidden surface-soft" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {doubled.map((it, i) => (
          <span key={i} className="text-xl md:text-2xl font-display text-muted">
            {it} <span className="text-amber/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
