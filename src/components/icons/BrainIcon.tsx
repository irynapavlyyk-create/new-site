type Props = { className?: string; stroke?: string };

// "3pm brain-off": brain silhouette with a Z above-right for sleep/shutdown.
export default function BrainIcon({ className, stroke = "url(#ef-grad-brain)" }: Props) {
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
        <linearGradient id="ef-grad-brain" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M5 13c0 -2 2 -4 4 -4c0 -2 2 -3 4 -3c2 0 4 1 4 3c2 0 4 2 4 4c0 2 -1 4 -3 4c0 2 -2 4 -4 4h-2c-2 0 -4 -2 -4 -4c-2 0 -3 -2 -3 -4z" />
      <path d="M13 6v15" />
      <path d="M16 3h3.5l-3.5 3h3.5" />
    </svg>
  );
}
