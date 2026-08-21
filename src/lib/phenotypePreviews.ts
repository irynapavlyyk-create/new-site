import type { PhenotypeId, PhenotypePreview } from "@/types";

/**
 * Static per-phenotype "preview" content for the FREE /result page.
 *
 * IMPORTANT: this is NOT a generated plan. The free path makes no AI call,
 * so week themes and the Week-1 teaser actions here are fixed, illustrative
 * samples — representative of what the paid 30-day protocol contains. They
 * sit behind a progressive blur to convey value without giving away a real
 * personalized plan.
 *
 * Content is derived from each phenotype's subtitle + insights in
 * src/lib/phenotypes.ts so the themes fit the type. Bilingual (en/cs); the
 * user-facing language is chosen at render time via useI18n().
 */
export const PHENOTYPE_PREVIEWS: Record<PhenotypeId, PhenotypePreview> = {
  "wired-but-tired": {
    weekThemes: [
      {
        en: "Caffeine cutoff + nervous-system reset",
        cs: "Stopka kofeinu + reset nervové soustavy",
      },
      {
        en: "Sleep architecture repair",
        cs: "Oprava architektury spánku",
      },
      {
        en: "Re-anchoring the cortisol rhythm",
        cs: "Ukotvení kortizolového rytmu",
      },
      {
        en: "Sustained calm + consolidation",
        cs: "Trvalý klid + upevnění",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Take your foot off the gas — cap caffeine and teach your nervous system to downshift.",
        cs: "Sundej nohu z plynu — omez kofein a nauč nervovou soustavu podřadit.",
      },
      actions: [
        {
          en: "06:45 — Daylight for 10 min before any screen — anchors your cortisol peak where it belongs",
          cs: "06:45 — 10 minut denního světla před první obrazovkou — ukotví kortizolový vrchol tam, kam patří",
        },
        {
          en: "14:00 — Hard caffeine cutoff; switch to L-theanine if you need focus",
          cs: "14:00 — Tvrdá stopka kofeinu; potřebuješ soustředění? Přejdi na L-theanin",
        },
        {
          en: "21:30 — 4-7-8 breathing + lights to amber — drops you out of “wired” mode",
          cs: "21:30 — Dýchání 4-7-8 + teplé tlumené světlo — dostane tě z módu „nabuzeno“",
        },
      ],
    },
  },

  "crashed-circadian": {
    weekThemes: [
      {
        en: "Morning-light anchor + fixed wake time",
        cs: "Kotva ranního světla + pevný čas vstávání",
      },
      {
        en: "Evening light control + melatonin timing",
        cs: "Kontrola večerního světla + načasování melatoninu",
      },
      {
        en: "Shifting the peak earlier",
        cs: "Posun vrcholu na dřív",
      },
      {
        en: "Locking the new rhythm",
        cs: "Zafixování nového rytmu",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Drag your body clock back into your timezone — light is the lever.",
        cs: "Přetáhni vnitřní hodiny zpátky do svého pásma — pákou je světlo.",
      },
      actions: [
        {
          en: "07:00 — Fixed wake time, 7 days a week, 10 min bright light immediately",
          cs: "07:00 — Pevný čas vstávání 7 dní v týdnu + hned 10 minut ostrého světla",
        },
        {
          en: "20:30 — Block blue light to let melatonin onset start on time",
          cs: "20:30 — Odstřihni modré světlo, ať melatonin naskočí včas",
        },
        {
          en: "22:30 — Wind-down stack timed to your shifted curve",
          cs: "22:30 — Zklidňovací rutina načasovaná na tvou posunutou křivku",
        },
      ],
    },
  },

  "depleted-engine": {
    weekThemes: [
      {
        en: "Rebuild the foundation: sleep + minerals",
        cs: "Znovu postavit základy: spánek + minerály",
      },
      {
        en: "Stabilize blood sugar + fuel",
        cs: "Stabilizace krevního cukru + palivo",
      },
      {
        en: "Gentle capacity building",
        cs: "Šetrné budování kapacity",
      },
      {
        en: "Restoring reserves",
        cs: "Obnova rezerv",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Stop running on fumes — refill the tank before you ask it to perform.",
        cs: "Přestaň jet na výpary — nejdřív dotankuj, pak chtěj výkon.",
      },
      actions: [
        {
          en: "07:30 — Protein + minerals within 30 min of waking — no coffee on empty",
          cs: "07:30 — Bílkoviny + minerály do 30 minut po probuzení — žádná káva nalačno",
        },
        {
          en: "12:30 — Balanced midday meal to flatten the afternoon dip",
          cs: "12:30 — Vyvážený oběd, který srovná odpolední propad",
        },
        {
          en: "20:00 — Pre-emptive wind-down before the 8pm crash drags you under",
          cs: "20:00 — Zklidnění s předstihem, než tě večerní dojezd stáhne dolů",
        },
      ],
    },
  },

  "afternoon-crasher": {
    weekThemes: [
      {
        en: "Time your caffeine to your curve",
        cs: "Načasuj kofein podle své křivky",
      },
      {
        en: "Defuse the 2pm crash",
        cs: "Zneškodni propad ve dvě",
      },
      {
        en: "Harness the evening second wind",
        cs: "Využij večerní druhý dech",
      },
      {
        en: "Smoothing the whole curve",
        cs: "Vyhlazení celé křivky",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Work with your late-rising cortisol — don't fight the curve, time it.",
        cs: "Pracuj se svým pozdním kortizolem — s křivkou nebojuj, trefuj se do ní.",
      },
      actions: [
        {
          en: "09:15 — First caffeine only after cortisol peaks — earlier just blunts it",
          cs: "09:15 — První kofein až po vrcholu kortizolu — dřív ho jen otupí",
        },
        {
          en: "13:30 — Pre-crash protein + 10 min walk to soften the 2–4pm dip",
          cs: "13:30 — Bílkoviny před propadem + 10 minut chůze, ať je sešup 14–16 h mírnější",
        },
        {
          en: "20:00 — Use the second wind for focused work — hard stop at 22:00",
          cs: "20:00 — Druhý dech využij na soustředěnou práci — ve 22:00 tvrdý konec",
        },
      ],
    },
  },

  "brain-fog-dominant": {
    weekThemes: [
      {
        en: "Clear the fog: hydration, protein, light",
        cs: "Rozehnat mlhu: voda, bílkoviny, světlo",
      },
      {
        en: "Protect your focus windows",
        cs: "Chraň svá okna soustředění",
      },
      {
        en: "Cognitive load management",
        cs: "Řízení kognitivní zátěže",
      },
      {
        en: "Sustained mental clarity",
        cs: "Trvalá mentální jasnost",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Your body's online before your brain is — close the gap.",
        cs: "Tělo je online dřív než mozek — zavři tu mezeru.",
      },
      actions: [
        {
          en: "07:00 — Water + protein + daylight before any demanding thinking",
          cs: "07:00 — Voda + bílkoviny + denní světlo, než začneš cokoli náročného řešit",
        },
        {
          en: "11:00 — Single-task your hardest cognitive work into the clear window",
          cs: "11:00 — Nejtěžší přemýšlení do jasného okna — jedna věc, žádný multitasking",
        },
        {
          en: "15:00 — Movement break to break the afternoon fog",
          cs: "15:00 — Pauza s pohybem, která protrhne odpolední mlhu",
        },
      ],
    },
  },

  "stress-burnout-transitioning": {
    weekThemes: [
      {
        en: "Lower the baseline: stress offload",
        cs: "Snížit základ: odlehčit stres",
      },
      {
        en: "Rebuild recovery capacity",
        cs: "Obnovit schopnost regenerace",
      },
      {
        en: "Reintroduce demand gently",
        cs: "Šetrně vracet zátěž",
      },
      {
        en: "Protecting the rebound",
        cs: "Uhlídat si zotavení",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Turn the volume down on stress before rebuilding — recovery first.",
        cs: "Nejdřív ztlum stres, pak stavěj — regenerace má přednost.",
      },
      actions: [
        {
          en: "07:30 — Slow start, no urgent inputs for the first 30 min — lowers the dread spike",
          cs: "07:30 — Pomalý rozjezd, prvních 30 minut žádné urgentní podněty — srazí ranní úzkost",
        },
        {
          en: "13:00 — Midday decompression: 10 min off-grid to stop stress stacking",
          cs: "13:00 — Polední dekomprese: 10 minut offline, ať se stres nevrství",
        },
        {
          en: "21:00 — Hard shutdown ritual so the mind stops after the body quits",
          cs: "21:00 — Tvrdý vypínací rituál, ať se hlava zastaví spolu s tělem",
        },
      ],
    },
  },
};

/**
 * Type-safe lookup helper.
 * Always returns a value because PhenotypeId is a closed union.
 */
export function getPhenotypePreview(id: PhenotypeId): PhenotypePreview {
  return PHENOTYPE_PREVIEWS[id];
}
