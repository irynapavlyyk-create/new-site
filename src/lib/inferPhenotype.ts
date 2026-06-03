import type { QuizAnswers, PhenotypeId } from "@/types";

// ============================================
// Deterministic phenotype inference from quiz answers.
//
// Mirrors the rubric in PRO_SYSTEM (claude.ts) as an explicit weighted-signal
// scoring system. Used by the FREE preview so we can render phenotype identity
// without an Anthropic call (instant + free + no overload-failure risk).
//
// Approach: each phenotype has a list of (weight, predicate) rules. Sum the
// weights of rules that match. Highest total wins. Soft tiebreak via the
// user's stated priority. Fallback to depleted-engine when no phenotype
// scores meaningfully (the "low energy, no clear pattern" baseline).
// ============================================

const HIGH_OR_LATE_CAFFEINE = [
  "3+-morning",
  "1-2-afternoon",
  "3+-afternoon",
  "energy-drinks",
] as const;

const HIGH_CAFFEINE_ANY_TIME = [
  "3+-morning",
  "3+-afternoon",
  "energy-drinks",
] as const;

const MODERATE_CAFFEINE = ["1-2-morning", "1-2-afternoon"] as const;

function isInArray<T extends readonly string[]>(
  value: string | undefined,
  arr: T
): value is T[number] {
  return value !== undefined && (arr as readonly string[]).includes(value);
}

type StressSymptom = NonNullable<QuizAnswers["stressSymptoms"]>[number];
type ActivityModality = NonNullable<QuizAnswers["activity"]>[number];

function stressIncludes(a: QuizAnswers, sym: StressSymptom): boolean {
  return (a.stressSymptoms ?? []).includes(sym);
}

function stressIncludesAny(a: QuizAnswers, syms: StressSymptom[]): boolean {
  const s = a.stressSymptoms ?? [];
  return syms.some((sym) => s.includes(sym));
}

function activityIncludes(a: QuizAnswers, m: ActivityModality): boolean {
  return (a.activity ?? []).includes(m);
}

function effectiveStressCount(a: QuizAnswers): number {
  return (a.stressSymptoms ?? []).filter((s) => s !== "none").length;
}

type Rule = {
  weight: number;
  /** Human-readable label, used by explainPhenotypes for debugging. */
  label: string;
  matches: (a: QuizAnswers) => boolean;
};

const RULES: Record<PhenotypeId, Rule[]> = {
  "wired-but-tired": [
    {
      weight: 3,
      label: "energy = flat-high (continuous arousal)",
      matches: (a) => a.energy === "flat-high",
    },
    {
      weight: 3,
      label: "late/high caffeine + wired-cant-relax (sympathetic overdrive)",
      matches: (a) =>
        isInArray(a.caffeine, HIGH_OR_LATE_CAFFEINE) &&
        stressIncludes(a, "wired-cant-relax"),
    },
    {
      weight: 2,
      label: "wired-cant-relax symptom (somatic sympathetic)",
      matches: (a) => stressIncludes(a, "wired-cant-relax"),
    },
    {
      weight: 2,
      label: "racing-thoughts + interrupted sleep",
      matches: (a) =>
        stressIncludes(a, "racing-thoughts") && a.sleepQuality === "interrupted",
    },
    {
      weight: 1,
      label: "high caffeine load (any time)",
      matches: (a) => isInArray(a.caffeine, HIGH_CAFFEINE_ANY_TIME),
    },
    {
      weight: 1,
      label: "priority = stress",
      matches: (a) => a.priority === "stress",
    },
  ],

  "crashed-circadian": [
    {
      weight: 3,
      label: ">8h sleep + impaired quality (architecture issue)",
      matches: (a) =>
        a.sleepDuration === ">8h" &&
        (a.sleepQuality === "tired" ||
          a.sleepQuality === "groggy" ||
          a.sleepQuality === "interrupted"),
    },
    {
      weight: 3,
      label: "night-owl + interrupted (social jet lag)",
      matches: (a) =>
        a.chronotype === "night-owl" && a.sleepQuality === "interrupted",
    },
    {
      weight: 2,
      label: "irregular chronotype",
      matches: (a) => a.chronotype === "irregular",
    },
    {
      weight: 2,
      label: "evening-peak energy (owl pattern)",
      matches: (a) => a.energy === "evening-peak",
    },
    {
      weight: 1,
      label: "night-owl chronotype",
      matches: (a) => a.chronotype === "night-owl",
    },
    {
      weight: 1,
      label: "priority = sleep",
      matches: (a) => a.priority === "sleep",
    },
  ],

  "depleted-engine": [
    {
      weight: 3,
      label: "flat-low energy",
      matches: (a) => a.energy === "flat-low",
    },
    {
      weight: 2,
      label: "sedentary",
      matches: (a) => activityIncludes(a, "sedentary"),
    },
    {
      weight: 2,
      label: "tired sleep quality (tired despite adequate duration)",
      matches: (a) => a.sleepQuality === "tired",
    },
    {
      weight: 1,
      label: "skip-meals or irregular nutrition",
      matches: (a) => a.nutrition === "skip-meals" || a.nutrition === "irregular",
    },
    {
      weight: 1,
      label: "priority = energy",
      matches: (a) => a.priority === "energy",
    },
  ],

  "afternoon-crasher": [
    {
      weight: 3,
      label: "afternoon-crash energy (direct hit)",
      matches: (a) => a.energy === "afternoon-crash",
    },
    {
      weight: 2,
      label: "afternoon-crash + irregular/skip nutrition (blood sugar)",
      matches: (a) =>
        a.energy === "afternoon-crash" &&
        (a.nutrition === "skip-meals" || a.nutrition === "irregular"),
    },
    {
      weight: 1,
      label: "moderate caffeine intake",
      matches: (a) => isInArray(a.caffeine, MODERATE_CAFFEINE),
    },
    {
      weight: 1,
      label: "priority = energy",
      matches: (a) => a.priority === "energy",
    },
  ],

  "brain-fog-dominant": [
    {
      weight: 3,
      label: "cognitive-only signature: racing-thoughts + physically fine baseline",
      matches: (a) =>
        stressIncludes(a, "racing-thoughts") &&
        !stressIncludes(a, "wired-cant-relax") &&
        (a.sleepQuality === "refreshed" || a.sleepQuality === "groggy") &&
        a.energy !== "flat-low" &&
        a.energy !== "flat-high" &&
        effectiveStressCount(a) <= 2,
    },
    {
      weight: 2,
      label: "racing-thoughts without somatic wired (mental marker only)",
      matches: (a) =>
        stressIncludes(a, "racing-thoughts") &&
        !stressIncludes(a, "wired-cant-relax"),
    },
    {
      weight: 2,
      label: "clean physical baseline + cognitive priority",
      matches: (a) =>
        a.priority === "focus" &&
        (a.sleepQuality === "refreshed" || a.sleepQuality === "groggy") &&
        a.energy !== "flat-low",
    },
    {
      weight: 1,
      label: "priority = focus",
      matches: (a) => a.priority === "focus",
    },
    {
      weight: 1,
      label: "moderate caffeine intake",
      matches: (a) => isInArray(a.caffeine, MODERATE_CAFFEINE),
    },
    {
      weight: 1,
      label: "sleep is not the problem (refreshed/groggy)",
      matches: (a) =>
        a.sleepQuality === "refreshed" || a.sleepQuality === "groggy",
    },
  ],

  "stress-burnout-transitioning": [
    {
      weight: 3,
      label: "4+ stress symptoms (multi-system HPA dysregulation)",
      matches: (a) => effectiveStressCount(a) >= 4,
    },
    {
      weight: 2,
      label: "dread-anxiety + overwhelmed",
      matches: (a) =>
        stressIncludes(a, "dread-anxiety") && stressIncludes(a, "overwhelmed"),
    },
    {
      weight: 2,
      label: "dread-anxiety + interrupted sleep",
      matches: (a) =>
        stressIncludes(a, "dread-anxiety") && a.sleepQuality === "interrupted",
    },
    {
      weight: 1,
      label: "priority = stress",
      matches: (a) => a.priority === "stress",
    },
    {
      weight: 1,
      label: "priority = mood",
      matches: (a) => a.priority === "mood",
    },
    {
      weight: 1,
      label: "flat-low energy + 3+ stress symptoms",
      matches: (a) => a.energy === "flat-low" && effectiveStressCount(a) >= 3,
    },
  ],
};

/**
 * Soft-tiebreak preference: if scores tie at the top, prefer the phenotype
 * that aligns with the user's stated priority.
 */
const PRIORITY_PREFERENCE: Record<
  NonNullable<QuizAnswers["priority"]>,
  PhenotypeId
> = {
  energy: "depleted-engine",
  sleep: "crashed-circadian",
  focus: "brain-fog-dominant",
  stress: "stress-burnout-transitioning",
  mood: "stress-burnout-transitioning",
};

const FALLBACK: PhenotypeId = "depleted-engine";
const MIN_SCORE_THRESHOLD = 2;

/** Score every phenotype against the answers. Exported for testing. */
export function scorePhenotypes(
  answers: QuizAnswers
): Record<PhenotypeId, number> {
  const out = {} as Record<PhenotypeId, number>;
  for (const id of Object.keys(RULES) as PhenotypeId[]) {
    let total = 0;
    for (const rule of RULES[id]) {
      if (rule.matches(answers)) total += rule.weight;
    }
    out[id] = total;
  }
  return out;
}

export type PhenotypeExplanation = Record<
  PhenotypeId,
  { score: number; matched: Array<{ weight: number; label: string }> }
>;

/** Per-rule match info for debugging / sanity-checking weights. */
export function explainPhenotypes(answers: QuizAnswers): PhenotypeExplanation {
  const out = {} as PhenotypeExplanation;
  for (const id of Object.keys(RULES) as PhenotypeId[]) {
    const matched: Array<{ weight: number; label: string }> = [];
    let total = 0;
    for (const rule of RULES[id]) {
      if (rule.matches(answers)) {
        total += rule.weight;
        matched.push({ weight: rule.weight, label: rule.label });
      }
    }
    out[id] = { score: total, matched };
  }
  return out;
}

/**
 * Deterministically infer a single phenotype from quiz answers.
 *
 * 1. Score each of the 6 phenotypes against weighted predicates.
 * 2. If the top score is below MIN_SCORE_THRESHOLD, fall back to depleted-engine.
 * 3. If there's a tie at the top, use the user's stated priority as a soft
 *    tiebreaker (e.g. priority=focus prefers brain-fog-dominant).
 * 4. Otherwise return the highest-scoring phenotype.
 */
export function inferPhenotype(answers: QuizAnswers): PhenotypeId {
  const scores = scorePhenotypes(answers);
  const ids = Object.keys(scores) as PhenotypeId[];

  let maxScore = -Infinity;
  for (const id of ids) {
    if (scores[id] > maxScore) maxScore = scores[id];
  }

  if (maxScore < MIN_SCORE_THRESHOLD) {
    return FALLBACK;
  }

  const winners = ids.filter((id) => scores[id] === maxScore);
  if (winners.length === 1) return winners[0];

  // Tie-break: priority preference, if it's among the winners
  if (answers.priority) {
    const preferred = PRIORITY_PREFERENCE[answers.priority];
    if (winners.includes(preferred)) return preferred;
  }

  // Final tie-break: first in RULES iteration order
  return winners[0];
}
