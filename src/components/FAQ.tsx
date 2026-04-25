"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

export default function FAQ() {
  const { lang } = useI18n();
  const items = pick(t.faq.items, lang);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-16">
          <span className="gradient-text">{pick(t.faq.title, lang)}</span>
        </h2>
      </FadeUp>
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <FadeUp key={i} delay={i * 50}>
              <div className={`glass overflow-hidden transition-all ${isOpen ? "border-amber/40" : ""}`}>
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="h-display text-lg font-bold">{it.q}</span>
                  <span className={`text-amber text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted text-sm leading-relaxed">{it.a}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
