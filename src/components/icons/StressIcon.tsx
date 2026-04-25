type Props = { className?: string; stroke?: string };

// Heart outline with a horizontal EKG pulse line passing through —
// universal "heart-rate / stress regulation" mark.
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
      <path d="M12 16c-1.5 -1 -6 -3 -6 -8c0 -2.5 2 -4 3.5 -4c1.5 0 2 .5 2.5 1.5c.5 -1 1 -1.5 2.5 -1.5c1.5 0 3.5 1.5 3.5 4c0 5 -4.5 7 -6 8z" />
      <path d="M2 10H8L9.5 7L11 13L12.5 10H20" />
    </svg>
  );
}
