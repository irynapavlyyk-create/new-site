import type { Lang } from "@/types";

// The only pages with per-language URLs. English URLs are the bare,
// already-indexed ones and must never change or redirect; Czech versions
// live under /cs. Everything else (quiz, dashboard, auth…) stays on a single
// URL with context-driven language.
export const LOCALIZED_EN_PATHS = ["/", "/terms", "/privacy", "/refund-policy"] as const;

export function csPathFor(enPath: string): string {
  return enPath === "/" ? "/cs" : `/cs${enPath}`;
}

/** EN path for a browser pathname that may or may not carry the /cs prefix. */
export function enPathFor(pathname: string): string {
  return pathname.replace(/^\/cs(?=\/|$)/, "") || "/";
}

/** Language-aware href for nav/footer links: "/terms" → "/cs/terms" when cs. */
export function localizedPath(lang: Lang, enPath: string): string {
  return lang === "cs" ? csPathFor(enPath) : enPath;
}
