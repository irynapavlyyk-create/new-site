"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({ to, suffix = "", duration = 1500 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      setVal(0);
      const begin = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - begin) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);

    const fallback = window.setTimeout(run, 1200);
    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
