// Ambient backdrop: three large, soft, drifting blobs that layer on top of
// the body gradient. Purely decorative — aria-hidden and pointer-events:none.
// Animation pauses under prefers-reduced-motion (handled in globals.css).
export default function AuroraBackground() {
  return (
    <div className="aurora-root" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}
