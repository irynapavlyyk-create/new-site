type Props = { className?: string; stroke?: string };

export default function NutritionIcon({ className, stroke = "url(#ef-grad-nutrition)" }: Props) {
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
        <linearGradient id="ef-grad-nutrition" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M4 13h16" />
      <path d="M5 13a7 5 0 0 0 14 0" />
      <path d="M11 10c-1 -3 1 -5 3 -5c1 2 -1 5 -3 5z" />
      <path d="M12.5 9l-1 1" />
    </svg>
  );
}
