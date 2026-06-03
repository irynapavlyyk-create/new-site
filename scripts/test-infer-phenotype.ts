/**
 * Validation harness for src/lib/inferPhenotype.ts.
 * Run with: npx tsx scripts/test-infer-phenotype.ts
 *
 * Not a real test runner — just a one-shot fixture dump so we can
 * sanity-check the scoring rubric against representative archetypes.
 */
import type { QuizAnswers } from "../src/types";
import { inferPhenotype, explainPhenotypes } from "../src/lib/inferPhenotype";

type Fixture = {
  name: string;
  expected: string;
  answers: QuizAnswers;
};

const fixtures: Fixture[] = [
  {
    name: "1. Obvious wired-but-tired",
    expected: "wired-but-tired",
    answers: {
      chronotype: "irregular",
      age: "25-34",
      energy: "flat-high",
      sleepDuration: "<6h",
      sleepQuality: "interrupted",
      caffeine: "3+-afternoon",
      stressSymptoms: ["racing-thoughts", "wired-cant-relax", "dread-anxiety"],
      nutrition: "irregular",
      activity: ["strength", "cardio-moderate"],
      priority: "stress",
      biologicalSex: "female",
    },
  },
  {
    name: "2. Obvious crashed-circadian (Off-Clock)",
    expected: "crashed-circadian",
    answers: {
      chronotype: "night-owl",
      age: "25-34",
      energy: "evening-peak",
      sleepDuration: ">8h",
      sleepQuality: "tired",
      caffeine: "1-2-morning",
      stressSymptoms: [],
      nutrition: "regular-3",
      activity: ["walking", "strength"],
      priority: "sleep",
      biologicalSex: "male",
    },
  },
  {
    name: "3. Obvious depleted-engine (Empty Tank)",
    expected: "depleted-engine",
    answers: {
      chronotype: "intermediate",
      age: "35-44",
      energy: "flat-low",
      sleepDuration: "7-8h",
      sleepQuality: "tired",
      caffeine: "1-2-morning",
      stressSymptoms: ["none"],
      nutrition: "skip-meals",
      activity: ["sedentary"],
      priority: "energy",
      biologicalSex: "female",
    },
  },
  {
    name: "4. Obvious afternoon-crasher (Adrenal Drift)",
    expected: "afternoon-crasher",
    answers: {
      chronotype: "intermediate",
      age: "25-34",
      energy: "afternoon-crash",
      sleepDuration: "6-7h",
      sleepQuality: "groggy",
      caffeine: "1-2-afternoon",
      stressSymptoms: ["irritable"],
      nutrition: "irregular",
      activity: ["cardio-moderate"],
      priority: "energy",
      biologicalSex: "female",
    },
  },
  {
    name: "5. Obvious brain-fog-dominant (Fog State)",
    expected: "brain-fog-dominant",
    answers: {
      chronotype: "intermediate",
      age: "35-44",
      energy: "morning-peak",
      sleepDuration: "7-8h",
      sleepQuality: "refreshed",
      caffeine: "1-2-morning",
      stressSymptoms: ["racing-thoughts"],
      nutrition: "regular-3",
      activity: ["walking"],
      priority: "focus",
      biologicalSex: "male",
    },
  },
  {
    name: "6. Obvious stress-burnout-transitioning (Burnout Edge)",
    expected: "stress-burnout-transitioning",
    answers: {
      chronotype: "intermediate",
      age: "35-44",
      energy: "flat-low",
      sleepDuration: "6-7h",
      sleepQuality: "interrupted",
      caffeine: "1-2-morning",
      stressSymptoms: [
        "racing-thoughts",
        "dread-anxiety",
        "overwhelmed",
        "tension-headaches",
        "irritable",
      ],
      nutrition: "irregular",
      activity: ["walking", "cardio-moderate"],
      priority: "stress",
      biologicalSex: "female",
    },
  },
  {
    name: "7. Ambiguous: wired-but-tired vs stress-burnout (overlap)",
    expected: "wired-but-tired",
    answers: {
      chronotype: "irregular",
      age: "35-44",
      energy: "flat-high",
      sleepDuration: "6-7h",
      sleepQuality: "interrupted",
      caffeine: "3+-afternoon",
      stressSymptoms: [
        "racing-thoughts",
        "wired-cant-relax",
        "dread-anxiety",
        "overwhelmed",
      ],
      nutrition: "irregular",
      activity: ["strength"],
      priority: "stress",
      biologicalSex: "female",
    },
  },
  {
    name: "8. Ambiguous: depleted-engine vs crashed-circadian",
    expected: "depleted-engine",
    answers: {
      chronotype: "night-owl",
      age: "25-34",
      energy: "flat-low",
      sleepDuration: ">8h",
      sleepQuality: "tired",
      caffeine: "none",
      stressSymptoms: ["overwhelmed"],
      nutrition: "irregular",
      activity: ["sedentary"],
      priority: "energy",
      biologicalSex: "male",
    },
  },
  {
    name: "9. Empty/minimal (fallback test)",
    expected: "depleted-engine",
    answers: {},
  },
  {
    name: "10. Brain-fog with priority NOT set to focus",
    expected: "brain-fog-dominant",
    answers: {
      chronotype: "intermediate",
      age: "25-34",
      energy: "morning-peak",
      sleepDuration: "7-8h",
      sleepQuality: "refreshed",
      caffeine: "1-2-morning",
      stressSymptoms: ["racing-thoughts"],
      nutrition: "regular-3",
      activity: ["walking"],
      priority: "energy",
      biologicalSex: "male",
    },
  },
];

console.log("=".repeat(80));
console.log("inferPhenotype validation harness");
console.log("=".repeat(80));

let passed = 0;
let failed = 0;

for (const fix of fixtures) {
  const result = inferPhenotype(fix.answers);
  const explained = explainPhenotypes(fix.answers);
  const ok = result === fix.expected;
  if (ok) passed++;
  else failed++;

  console.log(`\n${ok ? "PASS" : "FAIL"}  ${fix.name}`);
  console.log(`      expected: ${fix.expected}`);
  console.log(`      got:      ${result}`);

  const sorted = Object.entries(explained).sort(
    (a, b) => b[1].score - a[1].score
  );
  console.log("      scores:");
  for (const [id, info] of sorted) {
    const marker = id === result ? "  <-- picked" : "";
    console.log(`        ${String(info.score).padStart(2)}  ${id}${marker}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(80));

console.log("\n\nDETAILED BREAKDOWN (for weight sanity-check):");

for (const targetName of [
  "1. Obvious wired-but-tired",
  "5. Obvious brain-fog-dominant (Fog State)",
  "10. Brain-fog with priority NOT set to focus",
]) {
  const fix = fixtures.find((f) => f.name === targetName);
  if (!fix) continue;
  const explained = explainPhenotypes(fix.answers);
  console.log(`\n--- ${fix.name} ---`);
  const sorted = Object.entries(explained).sort(
    (a, b) => b[1].score - a[1].score
  );
  for (const [id, info] of sorted) {
    console.log(`  [${info.score}] ${id}`);
    for (const m of info.matched) {
      console.log(`    +${m.weight}  ${m.label}`);
    }
    if (info.matched.length === 0) {
      console.log("    (no rules matched)");
    }
  }
}

// ============================================================================
// DISTRIBUTION SWEEP
// 1,000 random QuizAnswers — confirm all 6 phenotypes are well-represented and
// no single one dominates unreasonably.
// ============================================================================

console.log("\n\n" + "=".repeat(80));
console.log("DISTRIBUTION SWEEP (N=1000 random samples)");
console.log("=".repeat(80));

const CHRONOTYPES = ["early-bird", "intermediate", "night-owl", "irregular"] as const;
const AGES = ["18-24", "25-34", "35-44", "45-54", "55+"] as const;
const ENERGIES = ["morning-peak", "afternoon-crash", "evening-peak", "flat-low", "flat-high"] as const;
const SLEEP_DURATIONS = ["<6h", "6-7h", "7-8h", ">8h"] as const;
const SLEEP_QUALITIES = ["refreshed", "groggy", "tired", "interrupted"] as const;
const CAFFEINES = ["none", "1-2-morning", "3+-morning", "1-2-afternoon", "3+-afternoon", "energy-drinks"] as const;
const STRESS_OPTIONS = ["racing-thoughts", "tension-headaches", "irritable", "wired-cant-relax", "dread-anxiety", "overwhelmed"] as const;
const NUTRITIONS = ["skip-meals", "irregular", "regular-3", "regular-3-snacks", "restricted"] as const;
const ACTIVITY_OPTIONS = ["walking", "cardio-moderate", "strength", "combat", "intense-cardio", "mind-body", "daily-pro"] as const;
const PRIORITIES = ["energy", "sleep", "focus", "stress", "mood"] as const;
const BIO_SEXES = ["female", "male", "prefer-not-say"] as const;

function pickOne<T extends readonly unknown[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSubset<T>(arr: readonly T[], min: number, max: number): T[] {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomAnswers(): QuizAnswers {
  // ~15% of users select "none" alone for stress; otherwise 0-5 random symptoms.
  const stress: QuizAnswers["stressSymptoms"] =
    Math.random() < 0.15
      ? ["none"]
      : (pickSubset(STRESS_OPTIONS, 0, 5) as QuizAnswers["stressSymptoms"]);

  // ~20% of users select sedentary alone; otherwise 1-3 random modalities.
  const activity: QuizAnswers["activity"] =
    Math.random() < 0.2
      ? ["sedentary"]
      : (pickSubset(ACTIVITY_OPTIONS, 1, 3) as QuizAnswers["activity"]);

  return {
    chronotype: pickOne(CHRONOTYPES),
    age: pickOne(AGES),
    energy: pickOne(ENERGIES),
    sleepDuration: pickOne(SLEEP_DURATIONS),
    sleepQuality: pickOne(SLEEP_QUALITIES),
    caffeine: pickOne(CAFFEINES),
    stressSymptoms: stress,
    nutrition: pickOne(NUTRITIONS),
    activity: activity,
    priority: pickOne(PRIORITIES),
    biologicalSex: pickOne(BIO_SEXES),
  };
}

const N = 1000;
const counts: Record<string, number> = {
  "wired-but-tired": 0,
  "crashed-circadian": 0,
  "depleted-engine": 0,
  "afternoon-crasher": 0,
  "brain-fog-dominant": 0,
  "stress-burnout-transitioning": 0,
};

for (let i = 0; i < N; i++) {
  const a = randomAnswers();
  const p = inferPhenotype(a);
  counts[p]++;
}

const sortedDist = Object.entries(counts).sort((a, b) => b[1] - a[1]);
const maxBarLen = 40;
const maxCount = Math.max(...sortedDist.map(([, c]) => c));

console.log();
for (const [id, c] of sortedDist) {
  const pct = ((c / N) * 100).toFixed(1);
  const barLen = Math.round((c / maxCount) * maxBarLen);
  const bar = "#".repeat(barLen);
  console.log(`  ${pct.padStart(5)}%  ${id.padEnd(32)}  ${bar} (${c})`);
}

console.log();
const min = Math.min(...sortedDist.map(([, c]) => c));
const max = Math.max(...sortedDist.map(([, c]) => c));
const minId = sortedDist.find(([, c]) => c === min)![0];
const maxId = sortedDist.find(([, c]) => c === max)![0];
console.log(`  spread: min ${((min / N) * 100).toFixed(1)}% (${minId}) -> max ${((max / N) * 100).toFixed(1)}% (${maxId})`);
console.log(`  all 6 represented: ${sortedDist.every(([, c]) => c > 0) ? "yes" : "NO"}`);
console.log(`  any phenotype above 40%? ${max / N > 0.4 ? "YES (" + maxId + ")" : "no"}`);
console.log(`  any phenotype below 5%?  ${min / N < 0.05 ? "YES (" + minId + ")" : "no"}`);
