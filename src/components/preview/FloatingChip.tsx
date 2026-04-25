import type { CSSProperties } from "react";

type Props = {
  emoji: string;
  text: string;
  className?: string;
  delay?: number;
};

export default function FloatingChip({ emoji, text, className = "", delay = 0 }: Props) {
  const style = { animationDelay: `-${delay}s` } as CSSProperties;
  return (
    <div className={`floating-chip ${className}`} style={style}>
      <span className="floating-chip-emoji" aria-hidden="true">{emoji}</span>
      <span>{text}</span>
    </div>
  );
}
