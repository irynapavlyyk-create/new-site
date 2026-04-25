type Props = { className?: string; stroke?: string };

export default function LifetimeIcon({ className, stroke = "url(#ef-grad-lifetime)" }: Props) {
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
        <linearGradient id="ef-grad-lifetime" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M12 12c2.5 -4 7 -4 9 0s-2.5 4 -9 0c-2.5 -4 -7 -4 -9 0s2.5 4 9 0z" />
    </svg>
  );
}
