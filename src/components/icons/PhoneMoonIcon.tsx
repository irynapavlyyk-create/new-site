type Props = { className?: string; stroke?: string };

export default function PhoneMoonIcon({ className, stroke = "url(#ef-grad-phonemoon)" }: Props) {
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
        <linearGradient id="ef-grad-phonemoon" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M11 18h2" />
      <path d="M14.5 10.5a3 3 0 1 1 -2.5 -2a2.2 2.2 0 0 0 2.5 2z" />
    </svg>
  );
}
