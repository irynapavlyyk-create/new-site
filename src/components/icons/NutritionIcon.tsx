type Props = { className?: string; stroke?: string };

// Apple silhouette with stem and angled leaf. Lucide-style.
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
      <path d="M12 7c-1.5 -1.5 -4.5 -2.5 -6.5 -1c-1.5 1 -2.5 3.5 -2.5 5.5c0 4 3 8.5 6.5 8.5c1 0 1.5 -.5 2.5 -.5s1.5 .5 2.5 .5c3.5 0 6.5 -4.5 6.5 -8.5c0 -2 -1 -4.5 -2.5 -5.5c-2 -1.5 -5 -.5 -6.5 1z" />
      <path d="M12 4v3" />
      <path d="M12 5c1.5 -2 4 -2 5 0c-1 1 -3 2 -5 0z" />
    </svg>
  );
}
