// Curated supplement catalog: maps each active the AI emits in a plan's
// supplements[] to a "Good" (mainstream) vs "Premium" (practitioner) product
// pair, with affiliate links. Amazon is the live path (tagged search URLs);
// exact ASINs and iHerb are later upgrades.
//
// NOT yet wired into SupplementCard — see resolveSupplement() for the name→entry
// resolver the UI will use.

export const AMAZON_AFFILIATE_TAG = "energyforge-20";

/** Tagged Amazon search URL — the live affiliate path until ASINs are curated. */
export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/** Tagged Amazon product URL — used once a curated ASIN is filled in. */
export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}/?tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * Plain iHerb search URL — NOT affiliate yet (program not approved). Affiliate
 * upgrade lands later via Product.iherbId.
 */
export function iherbSearchUrl(query: string): string {
  return `https://www.iherb.com/search?kw=${encodeURIComponent(query)}`;
}

export type Product = {
  brand: string;
  name: string;
  /** Brand + product + any REQUIRED spec, so the search lands on the right item. */
  searchQuery: string;
  /** Curated ASIN — optional for now; search link is the live path. */
  amazonAsin?: string;
  /** iHerb product id — wired up in the iHerb phase. */
  iherbId?: string;
};

export type SupplementEntry = {
  id: string;
  name: { en: string; ru: string };
  /** Lowercased keywords (EN + RU) the AI's free-text name is matched against. */
  aliases: string[];
  good: Product;
  premium: Product;
  /** Medical/dosing caveat surfaced in the UI when present. */
  caveat?: { en: string; ru: string };
};

export const SUPPLEMENT_CATALOG: Record<string, SupplementEntry> = {
  "l-theanine": {
    id: "l-theanine",
    name: { en: "L-Theanine", ru: "L-Теанин" },
    aliases: ["l-theanine", "theanine", "l-теанин", "теанин"],
    good: {
      brand: "NOW Foods",
      name: "L-Theanine 200 mg",
      searchQuery: "NOW Foods L-Theanine 200 mg",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "L-Theanine",
      searchQuery: "Pure Encapsulations L-Theanine",
    },
  },

  "magnesium-glycinate": {
    id: "magnesium-glycinate",
    name: { en: "Magnesium Glycinate", ru: "Магний глицинат" },
    aliases: [
      "magnesium glycinate",
      "mg glycinate",
      "магний глицинат",
      "глицинат магния",
    ],
    good: {
      brand: "NOW Foods",
      name: "Magnesium Glycinate",
      searchQuery: "NOW Foods Magnesium Glycinate",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "Magnesium (Glycinate)",
      searchQuery: "Pure Encapsulations Magnesium Glycinate",
    },
  },

  "magnesium-l-threonate": {
    id: "magnesium-l-threonate",
    name: { en: "Magnesium L-Threonate", ru: "Магний L-треонат" },
    aliases: [
      "magnesium l-threonate",
      "mg l-threonate",
      "l-threonate",
      "магний l-треонат",
      "л-треонат",
      "треонат",
    ],
    good: {
      brand: "Doctor's Best",
      name: "Brain Magnesium L-Threonate (Magtein)",
      searchQuery: "Doctor's Best Brain Magnesium L-Threonate Magtein",
    },
    premium: {
      brand: "Life Extension",
      name: "Neuro-Mag Magnesium L-Threonate",
      searchQuery: "Life Extension Neuro-Mag Magnesium L-Threonate",
    },
  },

  "ashwagandha-ksm66": {
    id: "ashwagandha-ksm66",
    name: { en: "Ashwagandha (KSM-66)", ru: "Ашваганда (KSM-66)" },
    aliases: ["ashwagandha", "ksm-66", "ksm 66", "ашваганда"],
    good: {
      brand: "Sports Research",
      name: "Ashwagandha KSM-66",
      searchQuery: "Sports Research Ashwagandha KSM-66",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "Ashwagandha (KSM-66)",
      searchQuery: "Pure Encapsulations Ashwagandha KSM-66",
    },
  },

  phosphatidylserine: {
    id: "phosphatidylserine",
    name: { en: "Phosphatidylserine", ru: "Фосфатидилсерин" },
    aliases: ["phosphatidylserine", "phosphatidyl serine", "фосфатидилсерин"],
    good: {
      brand: "NOW Foods",
      name: "Phosphatidyl Serine 100 mg",
      searchQuery: "NOW Foods Phosphatidyl Serine 100 mg",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "PS (Phosphatidylserine)",
      searchQuery: "Pure Encapsulations Phosphatidylserine",
    },
  },

  "active-b-complex": {
    id: "active-b-complex",
    name: { en: "Active B-Complex", ru: "Активный B-комплекс" },
    aliases: [
      "b-complex",
      "b complex",
      "active b",
      "vitamin b complex",
      "b-комплекс",
      "в-комплекс",
      "комплекс b",
    ],
    good: {
      brand: "Jarrow Formulas",
      name: "B-Right (methylated B-complex)",
      searchQuery: "Jarrow Formulas B-Right methylated B-complex methylfolate methylcobalamin",
    },
    premium: {
      brand: "Thorne",
      name: "Basic B Complex",
      searchQuery: "Thorne Basic B Complex methylated",
    },
  },

  "alpha-gpc": {
    id: "alpha-gpc",
    name: { en: "Alpha-GPC", ru: "Альфа-GPC" },
    aliases: ["alpha-gpc", "alpha gpc", "альфа-gpc", "альфа gpc"],
    good: {
      brand: "NOW Foods",
      name: "Alpha GPC 300 mg",
      searchQuery: "NOW Foods Alpha GPC 300 mg",
    },
    premium: {
      brand: "Designs for Health",
      name: "Alpha-GPC",
      searchQuery: "Designs for Health Alpha-GPC",
    },
  },

  "omega-3-epa": {
    id: "omega-3-epa",
    name: { en: "Omega-3 (high-EPA)", ru: "Омега-3 (высокий EPA)" },
    aliases: [
      "omega-3",
      "omega 3",
      "fish oil",
      "high-epa",
      "high epa",
      "омега-3",
      "омега 3",
      "рыбий жир",
    ],
    good: {
      brand: "Sports Research",
      name: "Triple Strength Omega-3 Fish Oil (high EPA)",
      searchQuery: "Sports Research Triple Strength Omega-3 Fish Oil high EPA",
    },
    premium: {
      brand: "Nordic Naturals",
      name: "ProOmega 2000 (high EPA)",
      searchQuery: "Nordic Naturals ProOmega 2000 high EPA",
    },
  },

  "melatonin-low-dose": {
    id: "melatonin-low-dose",
    name: { en: "Melatonin (low-dose)", ru: "Мелатонин (низкая доза)" },
    aliases: ["melatonin", "мелатонин"],
    good: {
      brand: "Life Extension",
      name: "Melatonin 300 mcg",
      searchQuery: "Life Extension Melatonin 300 mcg",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "Melatonin 0.5 mg",
      searchQuery: "Pure Encapsulations Melatonin 0.5 mg",
    },
    caveat: {
      en: "Use the low dose (0.3 mg / 300 mcg) — do not increase it.",
      ru: "Используй низкую дозу (0.3 мг / 300 мкг) — не увеличивай её.",
    },
  },

  "creatine-monohydrate": {
    id: "creatine-monohydrate",
    name: { en: "Creatine Monohydrate", ru: "Креатин моногидрат" },
    aliases: ["creatine", "creatine monohydrate", "креатин", "креатин моногидрат"],
    good: {
      brand: "Optimum Nutrition",
      name: "Micronized Creatine Monohydrate",
      searchQuery: "Optimum Nutrition Micronized Creatine Monohydrate",
    },
    premium: {
      brand: "Thorne",
      name: "Creatine (Creapure)",
      searchQuery: "Thorne Creatine Creapure",
    },
  },

  berberine: {
    id: "berberine",
    name: { en: "Berberine", ru: "Берберин" },
    aliases: ["berberine", "берберин"],
    good: {
      brand: "NOW Foods",
      name: "Berberine Glucose Support",
      searchQuery: "NOW Foods Berberine Glucose Support",
    },
    premium: {
      brand: "Thorne",
      name: "Berberine",
      searchQuery: "Thorne Berberine",
    },
  },

  "iron-bisglycinate": {
    id: "iron-bisglycinate",
    name: { en: "Iron (ferrous bisglycinate)", ru: "Железо (бисглицинат)" },
    aliases: [
      "iron",
      "ferrous bisglycinate",
      "iron bisglycinate",
      "gentle iron",
      "железо",
    ],
    good: {
      brand: "Solgar",
      name: "Gentle Iron 25 mg (bisglycinate)",
      searchQuery: "Solgar Gentle Iron 25 mg ferrous bisglycinate",
    },
    premium: {
      brand: "Thorne",
      name: "Iron Bisglycinate 25 mg",
      searchQuery: "Thorne Iron Bisglycinate 25 mg",
    },
    caveat: {
      en: "Confirm low ferritin with bloodwork before supplementing iron.",
      ru: "Подтверди низкий ферритин анализом крови перед приёмом железа.",
    },
  },

  "lions-mane": {
    id: "lions-mane",
    name: { en: "Lion's Mane (standardized extract)", ru: "Ежовик гребенчатый (экстракт)" },
    aliases: [
      "lion's mane",
      "lions mane",
      "hericium",
      "ежовик",
      "ежовик гребенчатый",
    ],
    good: {
      brand: "Host Defense",
      name: "Lion's Mane",
      searchQuery: "Host Defense Lion's Mane extract",
    },
    premium: {
      brand: "Real Mushrooms",
      name: "Lion's Mane Extract",
      searchQuery: "Real Mushrooms Lion's Mane Extract standardized",
    },
  },

  apigenin: {
    id: "apigenin",
    name: { en: "Apigenin", ru: "Апигенин" },
    aliases: ["apigenin", "апигенин"],
    good: {
      brand: "Nutricost",
      name: "Apigenin 50 mg",
      searchQuery: "Nutricost Apigenin 50 mg",
    },
    premium: {
      brand: "Double Wood Supplements",
      name: "Apigenin 50 mg",
      searchQuery: "Double Wood Supplements Apigenin 50 mg",
    },
  },

  "coq10-ubiquinol": {
    id: "coq10-ubiquinol",
    name: { en: "CoQ10 (Ubiquinol)", ru: "CoQ10 (Убихинол)" },
    aliases: ["coq10", "co q10", "ubiquinol", "убихинол", "коэнзим q10"],
    good: {
      brand: "Qunol",
      name: "Ubiquinol CoQ10 100 mg",
      searchQuery: "Qunol Ubiquinol CoQ10 100 mg",
    },
    premium: {
      brand: "Jarrow Formulas",
      name: "Ubiquinol QH-Absorb 100 mg",
      searchQuery: "Jarrow Formulas Ubiquinol QH-Absorb 100 mg",
    },
  },

  "vitamin-d3-k2": {
    id: "vitamin-d3-k2",
    name: { en: "Vitamin D3 + K2", ru: "Витамин D3 + K2" },
    aliases: [
      "vitamin d3 + k2",
      "vitamin d3 k2",
      "d3 + k2",
      "d3+k2",
      "d3 k2",
      "витамин d3",
      "d3 + k2 (mk-7)",
    ],
    good: {
      brand: "Sports Research",
      name: "Vitamin D3 + K2 (MK-7)",
      searchQuery: "Sports Research Vitamin D3 K2 MK-7",
    },
    premium: {
      brand: "Thorne",
      name: "Vitamin D + K2",
      searchQuery: "Thorne Vitamin D K2 MK-7",
    },
    caveat: {
      en: "Adjust the dose to your bloodwork (vitamin D level).",
      ru: "Подбирай дозу по анализам крови (уровень витамина D).",
    },
  },
};

/**
 * Resolve an AI-emitted supplement name to a catalog entry.
 * Tolerant: lowercases, strips parentheticals, collapses whitespace, then
 * matches against each entry's aliases by substring. Returns null when no
 * confident match (caller should render the card without buy links).
 */
export function resolveSupplement(name: string): SupplementEntry | null {
  if (!name) return null;
  const normalized = name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop parentheticals, e.g. "(KSM-66)"
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;

  for (const entry of Object.values(SUPPLEMENT_CATALOG)) {
    if (entry.aliases.some((alias) => normalized.includes(alias))) {
      return entry;
    }
  }
  return null;
}
