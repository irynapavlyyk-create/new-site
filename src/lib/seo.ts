import type { Metadata } from "next";
import { pick } from "@/lib/translations";
import { csPathFor } from "@/lib/locale-paths";
import type { Lang } from "@/types";

type Translated = { en: string; cs: string };

/**
 * Site-wide metadata shared by both root layouts ((app) and (site)/[lang]).
 * Page-level generateMetadata overrides title/description/openGraph per page;
 * everything else (metadataBase, twitter, verification) inherits from here.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://www.energyforge.app"
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "EnergyForge — Discover your energy phenotype",
  description:
    "Six energy types. One is yours. AI-powered diagnostic finds why you're tired and builds your personalized 30-day protocol. Take the 10-question quiz in 3 minutes.",
  openGraph: {
    title: "Discover your energy phenotype",
    description:
      "Six energy types. One is yours. AI builds your personalized 30-day energy protocol. Free 3-minute quiz — no signup to see your result.",
    url: "https://www.energyforge.app",
    siteName: "EnergyForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover your energy phenotype",
    description:
      "Six energy types. One is yours. AI builds your personalized 30-day energy protocol. Free 3-minute quiz — no signup to see your result.",
  },
  other: {
    "p:domain_verify": "bcb0cfaa679c655a6b45b83e6f7c901b",
  },
  verification: {
    other: {
      "facebook-domain-verification": "gcfjer4nfqbe5oy3xnhio40owv4216",
    },
  },
};

/**
 * Metadata for a page that exists at an EN URL (bare, indexed, immutable) and
 * a CS URL (/cs-prefixed). Canonical points at the URL actually being served;
 * hreflang lists both variants and x-default points at English. Relative URLs
 * resolve against metadataBase from the root layout.
 */
export function localizedPageMetadata(params: {
  lang: Lang;
  enPath: string;
  title: Translated;
  description: Translated;
}): Metadata {
  const { lang, enPath, title, description } = params;
  const csPath = csPathFor(enPath);
  const canonical = lang === "cs" ? csPath : enPath;
  return {
    title: pick(title, lang),
    description: pick(description, lang),
    alternates: {
      canonical,
      languages: {
        en: enPath,
        cs: csPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      title: pick(title, lang),
      description: pick(description, lang),
      url: canonical,
      siteName: "EnergyForge",
      locale: lang === "cs" ? "cs_CZ" : "en_US",
      type: "website",
    },
  };
}
