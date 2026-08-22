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
  name: { en: string; cs: string };
  /** Bottle photo served from /public/supplements, keyed by id (the slug). */
  image: string;
  /** Lowercased keywords (EN + CS) the AI's free-text name is matched against. */
  aliases: string[];
  good: Product;
  premium: Product;
  /** Medical/dosing caveat surfaced in the UI when present. */
  caveat?: { en: string; cs: string };
};

export const SUPPLEMENT_CATALOG: Record<string, SupplementEntry> = {
  "l-theanine": {
    id: "l-theanine",
    image: "/supplements/l-theanine.png",
    name: { en: "L-Theanine", cs: "L-theanin" },
    aliases: ["l-theanine", "theanine", "l-theanin", "theanin"],
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
    image: "/supplements/magnesium-glycinate.png",
    name: { en: "Magnesium Glycinate", cs: "Hořčík bisglycinát" },
    aliases: [
      "magnesium glycinate",
      "mg glycinate",
      "hořčík bisglycinát",
      "bisglycinát hořčíku",
      "magnesium bisglycinát",
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
    image: "/supplements/magnesium-l-threonate.png",
    name: { en: "Magnesium L-Threonate", cs: "Hořčík L-threonát" },
    aliases: [
      "magnesium l-threonate",
      "mg l-threonate",
      "l-threonate",
      "hořčík l-threonát",
      "l-threonát",
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
    image: "/supplements/ashwagandha-ksm66.png",
    name: { en: "Ashwagandha (KSM-66)", cs: "Ashwagandha (KSM-66)" },
    aliases: ["ashwagandha", "ksm-66", "ksm 66"],
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
    image: "/supplements/phosphatidylserine.png",
    name: { en: "Phosphatidylserine", cs: "Fosfatidylserin" },
    aliases: ["phosphatidylserine", "phosphatidyl serine", "fosfatidylserin"],
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
    image: "/supplements/active-b-complex.png",
    name: { en: "Active B-Complex", cs: "Aktivní B-komplex" },
    aliases: [
      "b-complex",
      "b complex",
      "active b",
      "vitamin b complex",
      "b-komplex",
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
    image: "/supplements/alpha-gpc.png",
    name: { en: "Alpha-GPC", cs: "Alfa-GPC" },
    aliases: ["alpha-gpc", "alpha gpc", "alfa-gpc", "alfa gpc"],
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
    image: "/supplements/omega-3-epa.png",
    name: { en: "Omega-3 (high-EPA)", cs: "Omega-3 (vysoký podíl EPA)" },
    aliases: [
      "omega-3",
      "omega 3",
      "fish oil",
      "high-epa",
      "high epa",
      "rybí olej",
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
    image: "/supplements/melatonin-low-dose.png",
    name: { en: "Melatonin (low-dose)", cs: "Melatonin (nízká dávka)" },
    aliases: ["melatonin"],
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
      cs: "Užívej nízkou dávku (0,3 mg / 300 µg) — nezvyšuj ji.",
    },
  },

  "creatine-monohydrate": {
    id: "creatine-monohydrate",
    image: "/supplements/creatine-monohydrate.png",
    name: { en: "Creatine Monohydrate", cs: "Kreatin monohydrát" },
    aliases: ["creatine", "creatine monohydrate", "kreatin", "kreatin monohydrát"],
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
    image: "/supplements/berberine.png",
    name: { en: "Berberine", cs: "Berberin" },
    aliases: ["berberine", "berberin"],
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
    image: "/supplements/iron-bisglycinate.png",
    name: { en: "Iron (ferrous bisglycinate)", cs: "Železo (bisglycinát)" },
    aliases: [
      "iron",
      "ferrous bisglycinate",
      "iron bisglycinate",
      "gentle iron",
      "železo",
      "bisglycinát železa",
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
      cs: "Před suplementací železa si nech krevními testy potvrdit nízký feritin.",
    },
  },

  "lions-mane": {
    id: "lions-mane",
    image: "/supplements/lions-mane.png",
    name: { en: "Lion's Mane (standardized extract)", cs: "Hericium — lví hříva (extrakt)" },
    aliases: [
      "lion's mane",
      "lions mane",
      "hericium",
      "lví hříva",
      "korálovec",
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
    image: "/supplements/apigenin.png",
    name: { en: "Apigenin", cs: "Apigenin" },
    aliases: ["apigenin"],
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
    image: "/supplements/coq10-ubiquinol.png",
    name: { en: "CoQ10 (Ubiquinol)", cs: "CoQ10 (ubichinol)" },
    aliases: ["coq10", "co q10", "ubiquinol", "ubichinol", "koenzym q10"],
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
    image: "/supplements/vitamin-d3-k2.png",
    name: { en: "Vitamin D3 + K2", cs: "Vitamin D3 + K2" },
    aliases: [
      "vitamin d3 + k2",
      "vitamin d3 k2",
      "d3 + k2",
      "d3+k2",
      "d3 k2",
      "vitamín d3",
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
      cs: "Dávku nastav podle krevních testů (hladina vitaminu D).",
    },
  },

  chromium: {
    id: "chromium",
    image: "/supplements/chromium.png",
    name: { en: "Chromium", cs: "Chrom (pikolinát)" },
    aliases: ["chromium", "chromium picolinate", "chrom", "pikolinát chromu"],
    good: {
      brand: "NOW Foods",
      name: "Chromium Picolinate 200 mcg",
      searchQuery: "NOW Foods Chromium Picolinate 200 mcg",
    },
    premium: {
      brand: "Thorne",
      name: "Chromium Picolinate",
      searchQuery: "Thorne Chromium Picolinate",
    },
  },

  "alpha-lipoic-acid": {
    id: "alpha-lipoic-acid",
    image: "/supplements/alpha-lipoic-acid.png",
    name: { en: "Alpha-Lipoic Acid", cs: "Kyselina alfa-lipoová" },
    aliases: [
      "alpha-lipoic acid",
      "alpha lipoic acid",
      "kyselina alfa-lipoová",
      "alfa-lipoová",
    ],
    good: {
      brand: "Doctor's Best",
      name: "Alpha-Lipoic Acid 600 mg",
      searchQuery: "Doctor's Best Alpha-Lipoic Acid 600 mg",
    },
    premium: {
      brand: "Pure Encapsulations",
      name: "Alpha Lipoic Acid",
      searchQuery: "Pure Encapsulations Alpha Lipoic Acid",
    },
  },

  curcumin: {
    id: "curcumin",
    image: "/supplements/curcumin.png",
    name: { en: "Curcumin", cs: "Kurkumin" },
    aliases: ["curcumin", "turmeric", "curcumin piperine", "kurkumin", "kurkuma"],
    good: {
      brand: "NOW Foods",
      name: "Curcumin (Turmeric Extract)",
      searchQuery: "NOW Foods Curcumin Turmeric Extract",
    },
    premium: {
      brand: "Thorne",
      name: "Curcumin Phytosome (Meriva)",
      searchQuery: "Thorne Curcumin Phytosome Meriva",
    },
  },

  rhodiola: {
    id: "rhodiola",
    image: "/supplements/rhodiola.png",
    name: { en: "Rhodiola", cs: "Rhodiola (rozchodnice růžová)" },
    aliases: ["rhodiola", "rhodiola rosea", "rozchodnice"],
    good: {
      brand: "NOW Foods",
      name: "Rhodiola 500 mg",
      searchQuery: "NOW Foods Rhodiola 500 mg",
    },
    premium: {
      brand: "Gaia Herbs",
      name: "Rhodiola Rosea",
      searchQuery: "Gaia Herbs Rhodiola Rosea",
    },
  },

  "magnolia-bark": {
    id: "magnolia-bark",
    image: "/supplements/magnolia-bark.png",
    name: { en: "Magnolia Bark", cs: "Kůra magnólie" },
    aliases: [
      "magnolia bark",
      "magnolia",
      "honokiol",
      "relora",
      "kůra magnólie",
      "magnólie",
    ],
    good: {
      brand: "Swanson",
      name: "Magnolia Bark",
      searchQuery: "Swanson Magnolia Bark",
    },
    premium: {
      brand: "Life Extension",
      name: "Magnolia Bark Extract",
      searchQuery: "Life Extension Magnolia Bark honokiol",
    },
  },

  "holy-basil": {
    id: "holy-basil",
    image: "/supplements/holy-basil.png",
    name: { en: "Holy Basil", cs: "Bazalka posvátná (tulsi)" },
    aliases: ["holy basil", "tulsi", "bazalka posvátná"],
    good: {
      brand: "Organic India",
      name: "Tulsi Holy Basil",
      searchQuery: "Organic India Tulsi Holy Basil",
    },
    premium: {
      brand: "Gaia Herbs",
      name: "Holy Basil Leaf",
      searchQuery: "Gaia Herbs Holy Basil Leaf",
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
