type Props = { className?: string; stroke?: string };

// Arrow hitting a wall — "know what to do but can't start".
export default function WallIcon({ className, stroke = "url(#ef-grad-wall)" }: Props) {
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
        <linearGradient id="ef-grad-wall" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M3 12h12" />
      <path d="M12 9l3 3 -3 3" />
      <path d="M18 3v18" />
      <path d="M18 6l3 -1" />
      <path d="M18 11l3 -1" />
      <path d="M18 16l3 -1" />
    </svg>
  );
}
