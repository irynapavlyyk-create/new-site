// Launch discount — single source of truth.
//
// A real, time-boxed 50% price cut on both paid tiers that AUTO-REVERTS after
// PROMO_END with no redeploy: isPromoActive() simply returns false, so the UI
// drops the badge and checkout falls back to the original Stripe price.
//
// EU compliance: the `original` strings below are the REAL regular prices (the
// same €9.99 / €24.99 shown when the promo is off and kept as the real Stripe
// prices). The deadline is real. Keep `original` in sync with the regular
// prices in translations.ts.

/** End of the launch window: 2026-07-06 23:59:59 Europe/Prague (UTC+2) = 21:59:59Z. */
export const PROMO_END = new Date("2026-07-06T21:59:59Z");

/** True while the launch discount is live. Compared against a real instant. */
export function isPromoActive(now: Date = new Date()): boolean {
  return now.getTime() < PROMO_END.getTime();
}

/** Per-tier display prices for the UI. `original` = regular price (struck
 *  through during the promo); `discounted` = launch price. */
export const PROMO_PRICES = {
  pro: { original: "€9.99", discounted: "€4.99" },
  coach: { original: "€24.99", discounted: "€12.49" },
} as const;

/** Short, honest launch label shown next to the discounted price. */
export const PROMO_LABEL = {
  en: "Launch price · 50% off · ends July 6",
  cs: "Startovní cena · −50 % · do 6. července",
} as const;
