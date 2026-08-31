import type { MetadataRoute } from "next";
import { LOCALIZED_EN_PATHS, csPathFor } from "@/lib/locale-paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.energyforge.app";
  const lastModified = new Date();

  // Both language variants of every localized page, each carrying hreflang
  // alternates pointing at the pair.
  return LOCALIZED_EN_PATHS.flatMap((enPath) => {
    const csPath = csPathFor(enPath);
    const isHome = enPath === "/";
    const alternates = {
      languages: {
        en: `${baseUrl}${enPath}`,
        cs: `${baseUrl}${csPath}`,
        "x-default": `${baseUrl}${enPath}`,
      },
    };
    return [
      {
        url: `${baseUrl}${enPath}`,
        lastModified,
        changeFrequency: isHome ? ("weekly" as const) : ("yearly" as const),
        priority: isHome ? 1.0 : 0.3,
        alternates,
      },
      {
        url: `${baseUrl}${csPath}`,
        lastModified,
        changeFrequency: isHome ? ("weekly" as const) : ("yearly" as const),
        priority: isHome ? 0.9 : 0.3,
        alternates,
      },
    ];
  });
}
