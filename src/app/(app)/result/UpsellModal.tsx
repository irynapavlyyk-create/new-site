"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";

type Props = {
  open: boolean;
  /** Phenotype name (accent-colored inside the title). */
  phenotypeName: string;
  /** True while the checkout request is in flight. */
  loading: boolean;
  onClose: () => void;
  /** Triggers the existing Stripe checkout (same handler as the pricing cards). */
  onUnlock: () => void;
};

export default function UpsellModal({
  open,
  phenotypeName,
  loading,
  onClose,
  onUnlock,
}: Props) {
  const { lang } = useI18n();

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop — click to dismiss */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative glass-strong w-full max-w-md p-6 sm:p-8 text-center">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-amber/10 via-orange/10 to-violet/10" />

        <button
          type="button"
          onClick={onClose}
          aria-label={pick(t.result.locked.modal.close, lang)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-white/5 transition"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber to-orange shadow-glow">
          <span className="text-2xl" style={{ color: "var(--btn-text)" }}>
            🔒
          </span>
        </div>

        <h2 className="h-display text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          {pick(t.result.locked.modal.titleBefore, lang)}
          <span className="text-amber">{phenotypeName}</span>
          {pick(t.result.locked.modal.titleAfter, lang)}
        </h2>

        <p className="text-muted text-sm leading-relaxed mb-7">
          {pick(t.result.locked.modal.sub, lang)}
        </p>

        <button
          type="button"
          onClick={onUnlock}
          disabled={loading}
          className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "…" : <>{pick(t.result.locked.modal.unlockCta, lang)} →</>}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2 text-sm text-muted hover:text-ink transition"
        >
          {pick(t.result.locked.modal.dismiss, lang)}
        </button>
      </div>
    </div>
  );
}
