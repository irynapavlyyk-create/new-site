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
      <path d="M18.178 8a5 5 0 1 0 0 8l-6.357 -8a5 5 0 1 1 0 8z" />
    </svg>
  );
}
