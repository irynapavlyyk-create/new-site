type Props = { className?: string; stroke?: string };

export default function MorningIcon({ className, stroke = "url(#ef-grad-morning)" }: Props) {
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
        <linearGradient id="ef-grad-morning" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 4v2" />
      <path d="M5.5 7l1.5 1.5" />
      <path d="M18.5 7l-1.5 1.5" />
      <path d="M2 13h2" />
      <path d="M20 13h2" />
    </svg>
  );
}
