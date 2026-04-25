type Props = { className?: string; stroke?: string };

// Calm breath waves expanding upward from a center source.
export default function StressIcon({ className, stroke = "url(#ef-grad-stress)" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ef-grad-stress" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M12 17v.01" />
      <path d="M8 17a4 4 0 0 1 8 0" />
      <path d="M5 17a7 7 0 0 1 14 0" />
      <path d="M2 17a10 10 0 0 1 20 0" />
    </svg>
  );
}
