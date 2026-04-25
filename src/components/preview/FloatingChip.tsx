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
    <div className={`floating-chip glass ${className}`} style={style}>
      <span className="text-base leading-none">{emoji}</span>
      <span>{text}</span>
    </div>
  );
}
