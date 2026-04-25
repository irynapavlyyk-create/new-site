"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import FadeUp from "./FadeUp";

type AvatarTheme = {
  background: string;
  boxShadow: string;
};

const AVATAR_THEMES: AvatarTheme[] = [
  {
    background: "linear-gradient(135deg, #F5A623 0%, #FF6B35 100%)",
    boxShadow:
      "inset 0 -2px 4px rgba(0,0,0,0.15), 0 4px 16px rgba(245, 166, 35, 0.25)",
  },
  {
    background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
    boxShadow:
      "inset 0 -2px 4px rgba(0,0,0,0.15), 0 4px 16px rgba(139, 92, 246, 0.25)",
  },
  {
    background: "linear-gradient(45deg, #FF6B35 0%, #F5A623 100%)",
    boxShadow:
      "inset 0 -2px 4px rgba(0,0,0,0.15), 0 4px 16px rgba(255, 107, 53, 0.25)",
  },
];

function TestimonialCard({
  name,
  text,
  index,
}: {
  name: string;
  text: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const cardDelay = index * 100;

  useEffect(() => {
    if (!ref.current) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const theme = AVATAR_THEMES[index % AVATAR_THEMES.length];
  const initial = name.trim().charAt(0).toUpperCase();
  const avatarStyle: CSSProperties = {
    background: theme.background,
    boxShadow: theme.boxShadow,
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${cardDelay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="glass p-8 h-full flex flex-col items-center text-center">
        <div className="testimonial-avatar mb-4" style={avatarStyle} aria-hidden="true">
          {initial}
        </div>
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, j) => (
            <span
              key={j}
              className="text-amber transition-opacity duration-300 ease-out"
              style={{
                opacity: shown ? 1 : 0,
                transitionDelay: `${cardDelay + 250 + j * 50}ms`,
              }}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-ink text-base leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
        <div className="text-sm text-muted mt-auto">— {name}</div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { lang } = useI18n();
  const items = pick(t.testimonials.items, lang);
  return (
    <section className="section">
      <FadeUp>
        <h2 className="h-display text-4xl sm:text-5xl text-center mb-16">
          <span className="gradient-text">{pick(t.testimonials.title, lang)}</span>
        </h2>
      </FadeUp>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <TestimonialCard key={i} index={i} name={it.name} text={it.text} />
        ))}
      </div>
    </section>
  );
}
