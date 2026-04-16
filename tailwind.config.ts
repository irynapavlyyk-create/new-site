import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#12121A",
        surface2: "#1A1A26",
        amber: "#F5A623",
        orange: "#FF6B35",
        violet: "#7B61FF",
        ink: "#E8E8F0",
        muted: "#9494A8",
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(245, 166, 35, 0.35)",
        glowOrange: "0 0 60px rgba(255, 107, 53, 0.35)",
        glowViolet: "0 0 60px rgba(123, 97, 255, 0.35)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(ellipse at top, rgba(245,166,35,0.15), transparent 60%)",
        "gradient-primary": "linear-gradient(135deg, #F5A623 0%, #FF6B35 100%)",
        "gradient-violet": "linear-gradient(135deg, #7B61FF 0%, #FF6B35 100%)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
