type Props = { className?: string; stroke?: string };

// "3pm brain-off" — clock face with hands showing 3:00.
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5h5" />
    </svg>
  );
}
