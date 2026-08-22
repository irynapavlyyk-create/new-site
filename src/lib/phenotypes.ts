import type { PhenotypeData, PhenotypeId } from "@/types";

/**
 * Static reference data for the 6 supported phenotypes.
 *
 * AI returns only `phenotypeId`; the UI hydrates display data from this
 * lookup table. Energy curves use SVG viewBox 800x220:
 *   x-axis: 0=6am, 200=10am, 400=2pm, 600=6pm, 800=10pm (24h span)
 *   y-axis: 0=high energy (top), 220=low energy (bottom)
 *
 * All localized strings have EN and CS variants. The user-facing
 * language is determined by the `lang` value from useI18n() at render
 * time (NOT the language the plan was generated in — see Phase 2 design
 * notes).
 */
export const PHENOTYPES: Record<PhenotypeId, PhenotypeData> = {
  "wired-but-tired": {
    id: "wired-but-tired",
    typeNumber: 1,
    shortCode: "WT-01",
    name: {
      en: "Wired but tired",
      cs: "Wired but tired",
    },
    subtitle: {
      en: "Cortisol stays high when it shouldn't. Body wants rest, mind won't allow it. Sleep feels light and unfinished.",
      cs: "Kortizol zůstává vysoko, i když nemá. Tělo chce odpočívat, hlava to nedovolí. Spánek je mělký a nedobije tě.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Wake feels alert", cs: "Ráno ve střehu" },
        description: {
          en: "Cortisol spikes too early. You're up but not rested.",
          cs: "Kortizol vystřelí moc brzy. Jsi na nohou, ale tělo si neodpočinulo.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "No real crash", cs: "Žádný skutečný útlum" },
        description: {
          en: "Body keeps pushing. Underneath it you're exhausted.",
          cs: "Tělo jede dál. Pod povrchem je ale vyčerpání.",
        },
      },
      {
        kind: "evening",
        label: { en: "Can't wind down", cs: "Večer nejde zpomalit" },
        description: {
          en: "Mind races at bedtime. Body too wired for sleep.",
          cs: "V posteli se ti honí hlavou myšlenky. Tělo je na spánek moc nabuzené.",
        },
      },
    ],
    peakHours: { en: "8am–11pm", cs: "08:00–23:00" },
    crashWindow: { en: "—", cs: "—" },
    secondWind: { en: "—", cs: "—" },
    energyCurve: "M 0,90 Q 100,60 200,60 T 400,70 T 600,80 T 800,150",
  },

  "crashed-circadian": {
    id: "crashed-circadian",
    typeNumber: 2,
    shortCode: "OC-02",
    name: {
      en: "Off-Clock",
      cs: "Off-Clock",
    },
    subtitle: {
      en: "Hard to wake up. Hard to fall asleep. Your circadian rhythm runs on a different timezone than your life.",
      cs: "Těžko vstáváš. Těžko usínáš. Tvůj cirkadiánní rytmus běží v jiném časovém pásmu než tvůj život.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Snooze cycles", cs: "Budík na několikrát" },
        description: {
          en: "Cortisol curve fires hours late. Mornings feel impossible.",
          cs: "Kortizolová křivka startuje o hodiny později. Rána jsou skoro nemožná.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Slow start, late peak", cs: "Pomalý start, pozdní vrchol" },
        description: {
          en: "You finally feel awake when others wind down.",
          cs: "Probouzíš se ve chvíli, kdy ostatní končí.",
        },
      },
      {
        kind: "evening",
        label: { en: "Wide awake at midnight", cs: "O půlnoci úplně vzhůru" },
        description: {
          en: "Your peak hits when you should be asleep.",
          cs: "Tvůj vrchol přichází, když už máš dávno spát.",
        },
      },
    ],
    peakHours: { en: "6pm–11pm", cs: "18:00–23:00" },
    crashWindow: { en: "8am–11am", cs: "08:00–11:00" },
    secondWind: { en: "—", cs: "—" },
    energyCurve: "M 0,170 Q 100,170 200,150 T 400,120 Q 500,70 600,60 T 800,90",
  },

  "depleted-engine": {
    id: "depleted-engine",
    typeNumber: 3,
    shortCode: "ET-03",
    name: {
      en: "Empty Tank",
      cs: "Empty Tank",
    },
    subtitle: {
      en: "Baseline energy is low—all day, every day. Caffeine barely registers. Recovery takes longer than it used to.",
      cs: "Základní hladina energie je nízko — celý den, každý den. Kofein skoro nezabírá. Regenerace trvá déle než dřív.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Tired on waking", cs: "Únava hned po probuzení" },
        description: {
          en: "Sleep didn't recharge you. Energy starts low.",
          cs: "Spánek tě nedobil. Energie startuje na minimu.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Flat all day", cs: "Celý den bez výkyvu" },
        description: {
          en: "No real peaks. Caffeine barely shifts the line.",
          cs: "Žádné skutečné vrcholy. Kofein s křivkou skoro nehne.",
        },
      },
      {
        kind: "evening",
        label: { en: "Crash by 8pm", cs: "Kolem osmé padneš" },
        description: {
          en: "Reserves run out. Sleep comes from exhaustion, not rhythm.",
          cs: "Rezervy dojdou. Spánek přichází z vyčerpání, ne z rytmu.",
        },
      },
    ],
    peakHours: { en: "—", cs: "—" },
    crashWindow: { en: "All day", cs: "Celý den" },
    secondWind: { en: "—", cs: "—" },
    energyCurve: "M 0,160 Q 100,150 200,155 T 400,160 T 600,165 T 800,180",
  },

  "afternoon-crasher": {
    id: "afternoon-crasher",
    typeNumber: 4,
    shortCode: "AD-04",
    name: {
      en: "Adrenal Drift",
      cs: "Adrenal Drift",
    },
    subtitle: {
      en: "Mornings start slow. Cortisol peaks late. The 2 PM crash is steep but predictable—and the 8 PM second wind is real.",
      cs: "Rána se rozjíždějí pomalu. Kortizol vrcholí pozdě. Propad ve dvě odpoledne je strmý, ale předvídatelný — a druhý dech v osm večer je skutečný.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Slow start", cs: "Pomalý rozjezd" },
        description: {
          en: "Cortisol peaks late. Don't force coffee before 9am.",
          cs: "Kortizol vrcholí pozdě. Nenuť si kávu před devátou.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Steep 2–4pm crash", cs: "Strmý propad ve 14–16" },
        description: {
          en: "Predictable drop. Plan light tasks here.",
          cs: "Předvídatelný sešup. Naplánuj si sem lehké úkoly.",
        },
      },
      {
        kind: "evening",
        label: { en: "8pm second wind", cs: "Druhý dech v osm večer" },
        description: {
          en: "Use it. But cut sharp at 10pm.",
          cs: "Využij ho. Ale v deset večer utni.",
        },
      },
    ],
    peakHours: { en: "10am–12pm", cs: "10:00–12:00" },
    crashWindow: { en: "2–4pm", cs: "14:00–16:00" },
    secondWind: { en: "8pm", cs: "20:00" },
    energyCurve:
      "M 0,180 Q 100,170 200,110 T 350,70 Q 400,65 450,170 T 600,90 T 800,180",
  },

  "brain-fog-dominant": {
    id: "brain-fog-dominant",
    typeNumber: 5,
    shortCode: "FS-05",
    name: {
      en: "Fog State",
      cs: "Fog State",
    },
    subtitle: {
      en: "Body has energy. Brain doesn't. Focus is short, decisions feel heavy, words don't come fast.",
      cs: "Tělo energii má. Mozek ne. Soustředění je krátké, rozhodování těžké a slova nechtějí naskakovat.",
    },
    insights: [
      {
        kind: "morning",
        label: {
          en: "Energy ok, brain offline",
          cs: "Energie jede, mozek offline",
        },
        description: {
          en: "Body wakes faster than mind. Words come slow.",
          cs: "Tělo se probouzí rychleji než hlava. Slova naskakují pomalu.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Foggy under stress", cs: "Mlha pod tlakem" },
        description: {
          en: "Concentration breaks under load. Decisions feel heavy.",
          cs: "Soustředění se pod zátěží láme. Rozhodování je těžké.",
        },
      },
      {
        kind: "evening",
        label: { en: "Clearer at night", cs: "Večer jasněji" },
        description: {
          en: "Cognition returns when pressure drops.",
          cs: "Myšlení se vrací, když tlak povolí.",
        },
      },
    ],
    peakHours: { en: "10pm–midnight", cs: "22:00–00:00" },
    crashWindow: { en: "2–5pm", cs: "14:00–17:00" },
    secondWind: { en: "—", cs: "—" },
    energyCurve:
      "M 0,140 Q 100,100 200,80 T 350,90 Q 400,100 450,150 T 600,140 T 800,130",
  },

  "stress-burnout-transitioning": {
    id: "stress-burnout-transitioning",
    typeNumber: 6,
    shortCode: "BE-06",
    name: {
      en: "Burnout Edge",
      cs: "Burnout Edge",
    },
    subtitle: {
      en: "Still functioning, but barely. Stress feels louder than rest. Small things take more than they should.",
      cs: "Ještě funguješ, ale sotva. Stres je hlasitější než odpočinek. Maličkosti stojí víc, než by měly.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Dread before tasks", cs: "Úzkost před úkoly" },
        description: {
          en: "Anticipation of effort feels louder than the effort itself.",
          cs: "Očekávání námahy je hlasitější než námaha samotná.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Stress amplifies", cs: "Stres se zesiluje" },
        description: {
          en: "Small things take more than they should.",
          cs: "Maličkosti stojí víc, než by měly.",
        },
      },
      {
        kind: "evening",
        label: { en: "Can't switch off", cs: "Nejde vypnout" },
        description: {
          en: "Mind keeps working long after body wants rest.",
          cs: "Hlava pracuje dál, i když tělo už dávno chce odpočívat.",
        },
      },
    ],
    peakHours: { en: "11am–1pm", cs: "11:00–13:00" },
    crashWindow: { en: "3–6pm", cs: "15:00–18:00" },
    secondWind: { en: "—", cs: "—" },
    energyCurve:
      "M 0,150 Q 100,110 200,80 T 350,90 Q 400,100 500,160 T 700,170 T 800,170",
  },
};

/**
 * Type-safe lookup helper.
 * Always returns a value because PhenotypeId is a closed union.
 */
export function getPhenotype(id: PhenotypeId): PhenotypeData {
  return PHENOTYPES[id];
}

/**
 * All phenotype IDs in display order (1 through 6).
 * Useful for iteration in admin UIs, type guards, etc.
 */
export const ALL_PHENOTYPE_IDS: readonly PhenotypeId[] = [
  "wired-but-tired",
  "crashed-circadian",
  "depleted-engine",
  "afternoon-crasher",
  "brain-fog-dominant",
  "stress-burnout-transitioning",
] as const;
