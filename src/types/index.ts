export type Lang = "en" | "ru";

/**
 * Quiz V2 answer shape. All fields optional during in-progress entry —
 * the quiz UI uses useState<QuizAnswers>({}) and fills fields as the user
 * advances. Multi-select fields (stressSymptoms, activity) store arrays;
 * mutex rules ("none" / "sedentary" exclude others) are UI-enforced in
 * Step 4, not encoded at the type level.
 */
export type QuizAnswers = {
  // Q1 — Chronotype (replaces old "goal")
  chronotype?: "early-bird" | "intermediate" | "night-owl" | "irregular";

  // Q2 — Age (resplit, added 55+)
  age?: "18-24" | "25-34" | "35-44" | "45-54" | "55+";

  // Q3 — Energy pattern (refined, added flat-high)
  energy?:
    | "morning-peak"
    | "afternoon-crash"
    | "evening-peak"
    | "flat-low"
    | "flat-high";

  // Q4a — Sleep duration (split from old single sleep field)
  sleepDuration?: "<6h" | "6-7h" | "7-8h" | ">8h";

  // Q4b — Sleep quality (NEW)
  sleepQuality?: "refreshed" | "groggy" | "tired" | "interrupted";

  // Q5 — Caffeine quantity + timing (expanded)
  caffeine?:
    | "none"
    | "1-2-morning"
    | "3+-morning"
    | "1-2-afternoon"
    | "3+-afternoon"
    | "energy-drinks";

  // Q6 — Stress symptoms (NEW: multi-select).
  stressSymptoms?: Array<
    | "racing-thoughts"
    | "tension-headaches"
    | "irritable"
    | "wired-cant-relax"
    | "dread-anxiety"
    | "overwhelmed"
    | "none"
  >;

  // Q7 — Eating regularity (refined, added restricted)
  nutrition?:
    | "skip-meals"
    | "irregular"
    | "regular-3"
    | "regular-3-snacks"
    | "restricted";

  // Q8 — Activity types (NEW: multi-select).
  activity?: Array<
    | "walking"
    | "cardio-moderate"
    | "strength"
    | "combat"
    | "intense-cardio"
    | "mind-body"
    | "daily-pro"
    | "sedentary"
  >;

  // Q9 — Priority (repurposed from old "mainIssue" — explicit pick, not symptom claim)
  priority?: "energy" | "sleep" | "focus" | "stress" | "mood";

  // Q10 — Biological sex (NEW — for hormone-related branches in the system prompt)
  biologicalSex?: "female" | "male" | "prefer-not-say";
};

export type QuizKey = keyof QuizAnswers;

export type FreeReport = {
  topIssues: { title: string; description: string }[];
  tips: string[];
};

export type ProPlan = {
  summary: string;
  morningProtocol: string[];
  sleepProtocol: string[];
  supplements: { name: string; dose: string; note: string }[];
  nutrition: string[];
  stressProtocol: string[];
  thirtyDayPlan: { week: number; focus: string; actions: string[] }[];
};

// ============================================
// V2 TYPES — Dashboard redesign (Phase 1+)
// Used by the new structured plan format with phenotype identity,
// per-week progression, and richer protocol steps.
// Will replace legacy ProPlan after migration.
// ============================================

/** Discriminated union of the 6 supported phenotype IDs */
export type PhenotypeId =
  | "wired-but-tired"
  | "crashed-circadian"
  | "depleted-engine"
  | "afternoon-crasher"
  | "brain-fog-dominant"
  | "stress-burnout-transitioning";

/** Standard EN/RU pair for static localized content */
export type LocalizedString = {
  en: string;
  ru: string;
};

/**
 * Static, illustrative "preview" content for the free /result page.
 * NOT a generated plan — week themes + Week-1 teaser actions are
 * representative samples shown behind a blur to convey what the paid
 * 30-day protocol contains. Looked up by PhenotypeId from
 * src/lib/phenotypePreviews.ts.
 */
export type PhenotypePreview = {
  /** 4 short week-theme lines, one per week (W1–W4). */
  weekThemes: [LocalizedString, LocalizedString, LocalizedString, LocalizedString];
  /** Week-1 detail shown (partly blurred) under the active "Preview" tab. */
  week1Teaser: {
    /** One-line theme for Week 1. */
    theme: LocalizedString;
    /** 2–3 representative timed action lines, e.g. "06:45 — …". */
    actions: LocalizedString[];
  };
};

/** Single insight bullet shown next to the energy chart */
export type PhenotypeInsight = {
  /** When during the day this insight applies */
  kind: "morning" | "afternoon" | "evening";
  /** Short label, e.g. "Morning cortisol low" */
  label: LocalizedString;
  /** 1-sentence elaboration */
  description: LocalizedString;
};

/**
 * Static reference data for a single phenotype.
 * Hardcoded in src/lib/phenotypes.ts — AI only returns the ID,
 * UI hydrates the rest from this lookup table.
 */
export type PhenotypeData = {
  readonly id: PhenotypeId;
  /** 1-based display number (1 of 6) */
  readonly typeNumber: number;
  /** Short identifier e.g. "AC-04" for "Afternoon crasher type 4" */
  readonly shortCode: string;
  readonly name: LocalizedString;
  /** Short tagline — appears under the name in the hero */
  readonly subtitle: LocalizedString;
  /** Exactly 3 insights for the energy chart sidebar */
  readonly insights: readonly PhenotypeInsight[];
  /** Display string, e.g. "10am–12pm" */
  readonly peakHours: string;
  /** Display string, e.g. "2–4pm" */
  readonly crashWindow: string;
  /** Display string, e.g. "8pm" */
  readonly secondWind: string;
  /**
   * SVG path string ("M ... Q ... T ...") describing the user's 24-hour
   * energy curve. Rendered inside a fixed viewBox in EnergyChart component.
   */
  readonly energyCurve: string;
};

/** Single step in a daily protocol (morning or sleep) */
export type ProtocolStep = {
  /** 24-hour time, e.g. "06:30" */
  time: string;
  /** Main instruction, ≤ 60 chars */
  action: string;
  /** Why / how, 1 short line */
  note: string;
};

/** One week's protocol content within the 30-day plan */
export type WeekProtocol = {
  number: 1 | 2 | 3 | 4;
  /** Week title, e.g. "Foundation reset" */
  title: string;
  /** 2-3 sentence description of this week's purpose */
  focus: string;
  /** 3-5 nutrition-focused items specific to this week */
  nutritionFocus: string[];
  /** 3-5 stress practices specific to this week */
  stressPractices: string[];
  /** 2-3 highlighted key actions for the week */
  keyActions: string[];
};

/** Single supplement recommendation */
export type SupplementItem = {
  /** Product name, e.g. "Vitamin D3 + K2" */
  name: string;
  /** Dose, e.g. "2000-4000 IU" */
  dose: string;
  /** When to take, e.g. "AM with breakfast" */
  timing: string;
  /** Short note: why or how (1-2 sentences) */
  note: string;
  /** Which week to introduce this supplement (1-4) */
  startWeek: 1 | 2 | 3 | 4;
};

/**
 * New plan structure — V2.
 * Replaces legacy ProPlan after full migration (Phase 2).
 * AI generates this entire structure (except phenotype static data which
 * is looked up by ID from src/lib/phenotypes.ts).
 */
export type ProPlanV2 = {
  /** AI-selected phenotype — UI hydrates static data from this ID */
  phenotypeId: PhenotypeId;
  /** Personalized 2-3 sentence summary of the user's situation */
  summary: string;
  /** Daily morning protocol — applies all 30 days */
  morningProtocol: ProtocolStep[];
  /** Daily sleep protocol — applies all 30 days */
  sleepProtocol: ProtocolStep[];
  /** Exactly 4 weeks of progressive content */
  weeks: [WeekProtocol, WeekProtocol, WeekProtocol, WeekProtocol];
  /** 4-6 supplement recommendations */
  supplements: SupplementItem[];
};
