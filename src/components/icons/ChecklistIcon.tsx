type Props = { className?: string; stroke?: string };

export default function ChecklistIcon({ className, stroke = "url(#ef-grad-checklist)" }: Props) {
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
        <linearGradient id="ef-grad-checklist" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 3h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1V4a1 1 0 0 1 1 -1" />
      <path d="M9 12l2 2 4 -4" />
      <path d="M9 17l2 2 4 -4" />
    </svg>
  );
}
