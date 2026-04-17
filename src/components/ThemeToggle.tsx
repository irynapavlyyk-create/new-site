"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const options = [
  { value: "light", icon: "☀️", label: "Light theme" },
  { value: "dark", icon: "🌙", label: "Dark theme" },
] as const;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme : "dark";

  return (
    <div
      className="inline-flex items-center rounded-full p-1 backdrop-blur"
      style={{ border: "1px solid var(--border)", background: "var(--card-bg)" }}
    >
      {options.map((o) => {
        const active = current === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            aria-label={o.label}
            aria-pressed={active}
            className={`relative px-3 py-1 text-sm leading-none rounded-full transition-colors ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span aria-hidden="true">{o.icon}</span>
            {active && (
              <span
                aria-hidden="true"
                className="absolute left-2 right-2 bottom-0 h-0.5 rounded-full bg-amber"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
