type Props = { className?: string; stroke?: string };

export default function CoffeeIcon({ className, stroke = "url(#ef-grad-coffee)" }: Props) {
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
        <linearGradient id="ef-grad-coffee" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M4 10h13v6a4 4 0 0 1 -4 4h-5a4 4 0 0 1 -4 -4z" />
      <path d="M17 12h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2" />
      <path d="M8 4c1 1 1 2 0 3" />
      <path d="M12 4c1 1 1 2 0 3" />
    </svg>
  );
}
