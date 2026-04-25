type Props = { className?: string; stroke?: string };

// Two mirrored C-shaped hemispheres meeting top and bottom, with internal
// fold lines suggesting cortex wrinkles. Lucide-style.
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
      <path d="M12 5C7 4 3 8 3 12S7 20 12 19" />
      <path d="M12 5C17 4 21 8 21 12S17 20 12 19" />
      <path d="M7 9c.5 1 1.5 1.5 2.5 1.5" />
      <path d="M17 9c-.5 1 -1.5 1.5 -2.5 1.5" />
      <path d="M5 14c1 1 2 1.5 3.5 1.5" />
      <path d="M19 14c-1 1 -2 1.5 -3.5 1.5" />
    </svg>
  );
}
