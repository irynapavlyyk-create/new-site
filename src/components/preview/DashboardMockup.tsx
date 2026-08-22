"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

type Phase = "idle" | "typing" | "bullets" | "done";

export default function DashboardMockup() {
  const { lang } = useI18n();
  const m = t.preview.mockup;
  const summary = pick(m.summary, lang);
  const morningBullets = pick(m.morningBullets, lang);
  const sleepBullets = pick(m.sleepBullets, lang);
  const supplements = pick(m.supplements, lang);
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
      setTyped(summary);
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
  }, [reduced, summary]);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTyped(summary.slice(0, i));
      if (i >= summary.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setPhase("bullets"), 280);
      }
    }, 25);
    return () => window.clearInterval(interval);
  }, [phase, summary]);

  useEffect(() => {
    if (phase !== "bullets") return;
    const timer = window.setTimeout(() => setPhase("done"), 1300);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Language switch after the animation finished: swap the fully-typed text.
  useEffect(() => {
    if (phase === "done") setTyped(summary);
  }, [phase, summary]);

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
            <span className="mockup-live-dot" /> {pick(m.live, lang)}
          </div>
        </div>

        <div className="mockup-content">
          <h2 className="h-display text-2xl font-bold mb-3 text-center">
            <span className="gradient-text">{pick(m.welcome, lang)}</span>
          </h2>

          <p className="mockup-summary">
            {typed}
            {phase === "typing" && <span className="mockup-cursor">|</span>}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <div>
              <h3 className="h-display text-sm font-bold mb-2 text-amber">{pick(m.morningTitle, lang)}</h3>
              <ul className={`mockup-bullets ${showBullets ? "active" : ""}`}>
                {morningBullets.map((b, i) => (
                  <li key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                    → {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h-display text-sm font-bold mb-2 text-violet">{pick(m.sleepTitle, lang)}</h3>
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
