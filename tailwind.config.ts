import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--bg2)",
        card: "var(--card-bg)",
        "card-hover": "var(--card-hover)",
        divider: "var(--border)",
        amber: "rgb(var(--amber) / <alpha-value>)",
        orange: "rgb(var(--orange) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        ink: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        btn: "var(--btn-text)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["42px", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "800" }],
        h3: ["26px", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "700" }],
        body: ["16px", { lineHeight: "1.7" }],
        small: ["13px", { lineHeight: "1.5" }],
      },
      boxShadow: {
        glow: "0 0 60px rgba(245, 166, 35, 0.35)",
        glowOrange: "0 0 60px rgba(255, 107, 53, 0.35)",
        glowViolet: "0 0 60px rgba(123, 97, 255, 0.35)",
        card: "0 0 40px rgba(245, 166, 35, 0.15)",
        soft: "var(--shadow)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(ellipse at top, rgba(245,166,35,0.15), transparent 60%)",
        "gradient-primary": "linear-gradient(135deg, rgb(var(--amber)) 0%, rgb(var(--orange)) 100%)",
        "gradient-hero": "linear-gradient(135deg, rgb(var(--amber)) 0%, rgb(var(--orange)) 50%, rgb(var(--violet)) 100%)",
        "gradient-violet": "linear-gradient(135deg, rgb(var(--violet)) 0%, rgb(var(--orange)) 100%)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "nudge-x": "nudgeX 1.5s ease-in-out infinite",
        spin: "spin 1.5s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 40px rgba(245,166,35,0.3)" },
          "50%": { boxShadow: "0 0 80px rgba(245,166,35,0.6)" },
        },
        nudgeX: {
          "0%,100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
