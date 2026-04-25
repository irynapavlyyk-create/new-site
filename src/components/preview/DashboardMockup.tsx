"use client";

import { useEffect, useRef, useState } from "react";

const SUMMARY =
  "Your protocol is built around your specific stress, sleep, and morning patterns. Each habit stacks on the previous one to compound energy gains over 30 days. Every recommendation is shaped by your answers — no generic templates.";

const morningBullets = [
  "Wake 6:30 AM consistently",
  "10 min direct sunlight on waking",
  "500 ml water + electrolytes",
  "25g+ protein within 60 minutes",
];
const sleepBullets = [
  "Lights out by 10:30 PM",
  "No screens after 9:30",
  "Magnesium glycinate, 400mg",
  "Bedroom 18°C / 65°F",
];
const supplements = ["Vitamin D3", "Omega-3", "Magnesium", "Ashwagandha"];

type Phase = "idle" | "typing" | "bullets" | "done";

export default function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [reduced, setReduced] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = () => setReduced(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) {
      setTyped(SUMMARY);
      setPhase("done");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase((p) => (p === "idle" ? "typing" : p));
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTyped(SUMMARY.slice(0, i));
      if (i >= SUMMARY.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setPhase("bullets"), 280);
      }
    }, 25);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "bullets") return;
    const t = window.setTimeout(() => setPhase("done"), 1300);
    return () => window.clearTimeout(t);
  }, [phase]);

  const showBullets = phase === "bullets" || phase === "done";

  const isHoverDevice = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const onMouseEnter = () => {
    if (reduced || !isHoverDevice()) return;
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    setInteracting(true);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !isHoverDevice()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: -dy * 6, y: dx * 6 });
  };
  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      setInteracting(false);
      resumeTimer.current = null;
    }, 500);
  };

  return (
    <div className="mockup-perspective" ref={ref}>
      <div className={`mockup-idle-float ${interacting ? "is-interacting" : ""}`}>
      <div
        className="mockup-frame glass-strong"
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 250ms ease-out",
        }}
      >
        <div className="mockup-topbar">
          <span className="mockup-dot" style={{ background: "#FF5F57" }} />
          <span className="mockup-dot" style={{ background: "#FEBC2E" }} />
          <span className="mockup-dot" style={{ background: "#28C840" }} />
          <div className="mockup-url">energyforge.app/dashboard</div>
          <div className="mockup-live">
            <span className="mockup-live-dot" /> Live
          </div>
        </div>

        <div className="mockup-content">
          <h2 className="h-display text-2xl font-bold mb-3 text-center">
            <span className="gradient-text">Welcome to your plan</span>
          </h2>

          <p className="mockup-summary">
            {typed}
            {phase === "typing" && <span className="mockup-cursor">|</span>}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <div>
              <h3 className="h-display text-sm font-bold mb-2 text-amber">Morning Protocol</h3>
              <ul className={`mockup-bullets ${showBullets ? "active" : ""}`}>
                {morningBullets.map((b, i) => (
                  <li key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                    → {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h-display text-sm font-bold mb-2 text-violet">Sleep Protocol</h3>
              <ul className={`mockup-bullets ${showBullets ? "active" : ""}`}>
                {sleepBullets.map((b, i) => (
                  <li key={i} style={{ transitionDelay: `${(i + 4) * 100}ms` }}>
                    → {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mockup-pills">
            {supplements.map((s, i) => (
              <span key={i} className="mockup-pill" style={{ animationDelay: `-${i * 1.1}s` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
