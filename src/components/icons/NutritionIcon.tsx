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
      <path d="M3 13h18" />
      <path d="M4 13c0 4 3 7 8 7s8 -3 8 -7" />
      <path d="M11 13c0 -3 1 -6 4 -7c1 3 0 7 -4 7z" />
      <path d="M14 7l-2 5" />
    </svg>
  );
}
