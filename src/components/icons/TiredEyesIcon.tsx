type Props = { className?: string; stroke?: string };

export default function TiredEyesIcon({ className, stroke = "url(#ef-grad-eyes)" }: Props) {
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
        <linearGradient id="ef-grad-eyes" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M3 14c3 -5 6 -7 9 -7s6 2 9 7" />
      <path d="M5 16l-1 2" />
      <path d="M9 17l-0.5 2" />
      <path d="M12 17.5v2" />
      <path d="M15 17l0.5 2" />
      <path d="M19 16l1 2" />
    </svg>
  );
}
