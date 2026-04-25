import {
  MorningIcon,
  SleepIcon,
  SupplementIcon,
  PlanIcon,
} from "@/components/icons";
import type { CSSProperties } from "react";

type CardData = {
  id: string;
  title: string;
  accent: string;
  accentBg: string;
  accentGlow: string;
  iconStroke?: string;
  Icon: React.FC<{ className?: string; stroke?: string }>;
  bullets: string[];
  pos: { left: number; top: number };
  size: { w: number; h: number };
  rot: number;
};

const cards: CardData[] = [
  {
    id: "morning",
    title: "Morning Protocol",
    accent: "amber",
    accentBg: "#F5A623",
    accentGlow: "rgba(245, 166, 35, 0.45)",
    iconStroke: "#F5A623",
    Icon: MorningIcon,
    bullets: [
      "6:30 AM — wake at fixed time",
      "→ 10 min direct sunlight",
      "→ 500 ml water + electrolytes",
      "→ 25g+ protein in first hour",
    ],
    pos: { left: 20, top: 40 },
    size: { w: 300, h: 210 },
    rot: -3,
  },
  {
    id: "sleep",
    title: "Sleep Protocol",
    accent: "violet",
    accentBg: "#8B5CF6",
    accentGlow: "rgba(139, 92, 246, 0.45)",
    iconStroke: "#8B5CF6",
    Icon: SleepIcon,
    bullets: [
      "→ Lights out by 10:30 PM",
      "→ No screens after 9:30",
      "→ Magnesium glycinate, 400mg",
      "→ Bedroom 18°C / 65°F",
    ],
    pos: { left: 480, top: 120 },
    size: { w: 280, h: 210 },
    rot: 4,
  },
  {
    id: "supplements",
    title: "Supplements",
    accent: "orange",
    accentBg: "#FF6B35",
    accentGlow: "rgba(255, 107, 53, 0.45)",
    iconStroke: "#FF6B35",
    Icon: SupplementIcon,
    bullets: [
      "→ Vitamin D3 — 4000 IU",
      "→ Omega-3 — 2g daily",
      "→ Magnesium glycinate",
      "→ Ashwagandha — 600mg",
    ],
    pos: { left: 80, top: 380 },
    size: { w: 300, h: 210 },
    rot: 2,
  },
  {
    id: "thirty-day",
    title: "30-Day Plan",
    accent: "gradient",
    accentBg: "linear-gradient(90deg, #F5A623, #FF6B35)",
    accentGlow: "rgba(255, 107, 53, 0.5)",
    Icon: PlanIcon,
    bullets: [
      "Week 1 — Foundation",
      "Week 2 — Optimize sleep",
      "Week 3 — Stress reset",
      "Week 4 — Maintain & build",
    ],
    pos: { left: 460, top: 420 },
    size: { w: 340, h: 240 },
    rot: -2,
  },
];

const centers = cards.map((c) => ({
  cx: c.pos.left + c.size.w / 2,
  cy: c.pos.top + c.size.h / 2,
}));

const linePairs: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const stars = [
  { cx: 380, cy: 270, delay: 0 },
  { cx: 410, cy: 380, delay: 1.2 },
  { cx: 280, cy: 320, delay: 2.4 },
  { cx: 540, cy: 350, delay: 3.6 },
  { cx: 350, cy: 480, delay: 4.8 },
];

export default function Constellation() {
  return (
    <div className="constellation-canvas">
      <svg
        className="constellation-lines"
        viewBox="0 0 800 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="constellation-line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {linePairs.map(([a, b], i) => (
          <line
            key={i}
            x1={centers[a].cx}
            y1={centers[a].cy}
            x2={centers[b].cx}
            y2={centers[b].cy}
            stroke="url(#constellation-line-grad)"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.45"
            className="constellation-line"
          />
        ))}
      </svg>

      {stars.map((s, i) => (
        <span
          key={i}
          className="constellation-star"
          style={{ left: s.cx, top: s.cy, animationDelay: `-${s.delay}s` }}
          aria-hidden="true"
        />
      ))}

      {cards.map((c, i) => {
        const style = {
          left: c.pos.left,
          top: c.pos.top,
          width: c.size.w,
          minHeight: c.size.h,
          "--rot": `${c.rot}deg`,
          "--accent-bg": c.accentBg,
          "--accent-glow": c.accentGlow,
          animationDelay: `-${i * 1.4}s`,
        } as CSSProperties;
        return (
          <div key={c.id} className="constellation-card glass" style={style}>
            <div className="constellation-accent-bar" />
            <div className="constellation-card-head">
              <c.Icon className="w-7 h-7" stroke={c.iconStroke} />
              <h3 className="h-display text-lg font-bold">{c.title}</h3>
            </div>
            <ul className="constellation-card-bullets">
              {c.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
