type Props = { className?: string; stroke?: string };

export default function QuestionIcon({ className, stroke = "url(#ef-grad-question)" }: Props) {
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
        <linearGradient id="ef-grad-question" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <path d="M20 15a3 3 0 0 1 -3 3h-7l-4 3v-3H5a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3z" />
      <path d="M9 10a3 3 0 1 1 5.5 1.7c-1 0.7 -2.5 1 -2.5 2.3" />
      <path d="M12 16.5v0.01" />
    </svg>
  );
}
