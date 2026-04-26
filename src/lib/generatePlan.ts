import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  anthropic,
  MODEL,
  FREE_SYSTEM,
  PRO_SYSTEM,
  FREE_SCHEMA,
  PRO_SCHEMA,
} from "@/lib/claude";
import { createAdminClient } from "@/utils/supabase/admin";
import type { QuizAnswers } from "@/types";

export type GenerateTier = "free" | "pro" | "coach";
export type GenerateLang = "en" | "ru";

const ProPlanSchema = z.object({
  summary: z.string().min(1),
  morningProtocol: z.array(z.string().min(1)).min(1),
  sleepProtocol: z.array(z.string().min(1)).min(1),
  supplements: z
    .array(
      z.object({
        name: z.string().min(1),
        dose: z.string().min(1),
        note: z.string().min(1),
      })
    )
    .min(1),
  nutrition: z.array(z.string().min(1)).min(1),
  stressProtocol: z.array(z.string().min(1)).min(1),
  thirtyDayPlan: z
    .array(
      z.object({
        week: z.number(),
        focus: z.string().min(1),
        actions: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
});

const FreeReportSchema = z.object({
  topIssues: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  tips: z.array(z.string().min(1)).min(1),
});

type ProfileLine = { en: string; ru: string };

function describe(key: keyof QuizAnswers, value: string | undefined): ProfileLine | null {
  if (!value) return null;
  switch (key) {
    case "goal": {
      const map: Record<string, ProfileLine> = {
        energy: { en: "more energy", ru: "больше энергии" },
        sleep: { en: "better sleep", ru: "лучший сон" },
        stress: { en: "less stress", ru: "меньше стресса" },
        focus: { en: "focus and concentration", ru: "фокус и концентрация" },
        all: { en: "all of the above (energy, sleep, stress, focus)", ru: "всё сразу (энергия, сон, стресс, фокус)" },
      };
      const v = map[value];
      return v && { en: `Primary goal: ${v.en}.`, ru: `Главная цель: ${v.ru}.` };
    }
    case "age": {
      const map: Record<string, ProfileLine> = {
        "18-24": { en: "18-24 years old", ru: "18-24 года" },
        "25-34": { en: "25-34 years old", ru: "25-34 года" },
        "35-44": { en: "35-44 years old", ru: "35-44 года" },
        "45+": { en: "45+ years old", ru: "45+ лет" },
      };
      const v = map[value];
      return v && { en: `Demographics: ${v.en}.`, ru: `Возраст: ${v.ru}.` };
    }
    case "energy": {
      const map: Record<string, ProfileLine> = {
        "always-tired": {
          en: "tired all the time, regardless of sleep",
          ru: "постоянная усталость независимо от сна",
        },
        "afternoon-crash": {
          en: "OK in the morning but crashes in the afternoon",
          ru: "нормально утром, но спады во второй половине дня",
        },
        "ok-morning": {
          en: "OK in the morning, energy fades by evening",
          ru: "нормально утром, к вечеру энергия падает",
        },
        enough: { en: "energy is generally adequate", ru: "энергии в целом хватает" },
      };
      const v = map[value];
      return v && { en: `Current state: ${v.en}.`, ru: `Текущее состояние: ${v.ru}.` };
    }
    case "sleep": {
      const map: Record<string, ProfileLine> = {
        "<6h": { en: "less than 6 hours per night", ru: "меньше 6 часов за ночь" },
        "6-7h": { en: "6-7 hours per night", ru: "6-7 часов за ночь" },
        "7-8h": { en: "7-8 hours per night", ru: "7-8 часов за ночь" },
        ">8h-unrested": {
          en: "more than 8 hours per night but wakes unrested",
          ru: "больше 8 часов за ночь, но просыпается не отдохнувшим",
        },
      };
      const v = map[value];
      return v && { en: `Sleep: ${v.en}.`, ru: `Сон: ${v.ru}.` };
    }
    case "caffeine": {
      const map: Record<string, ProfileLine> = {
        none: { en: "no caffeine", ru: "не пьёт кофеин" },
        "1cup": { en: "1 cup of coffee per day", ru: "1 чашка кофе в день" },
        "2-3cups": { en: "2-3 cups of coffee per day", ru: "2-3 чашки кофе в день" },
        "3+-energy": {
          en: "3+ cups daily or relies on energy drinks",
          ru: "3+ чашек в день или энергетики",
        },
      };
      const v = map[value];
      return v && { en: `Caffeine intake: ${v.en}.`, ru: `Кофеин: ${v.ru}.` };
    }
    case "stress": {
      const map: Record<string, ProfileLine> = {
        "high-chronic": { en: "chronically high", ru: "хронически высокий" },
        periodic: { en: "periodic peaks", ru: "периодические пики" },
        moderate: { en: "moderate", ru: "умеренный" },
        low: { en: "low", ru: "низкий" },
      };
      const v = map[value];
      return v && { en: `Stress level: ${v.en}.`, ru: `Уровень стресса: ${v.ru}.` };
    }
    case "nutrition": {
      const map: Record<string, ProfileLine> = {
        "skip-meals": { en: "frequently skips meals", ru: "часто пропускает приёмы пищи" },
        irregular: { en: "irregular eating patterns", ru: "ест нерегулярно" },
        ok: { en: "eats reasonably well, mostly balanced", ru: "питается в целом нормально" },
        tracked: { en: "tracks nutrition carefully", ru: "тщательно следит за питанием" },
      };
      const v = map[value];
      return v && { en: `Nutrition: ${v.en}.`, ru: `Питание: ${v.ru}.` };
    }
    case "activity": {
      const map: Record<string, ProfileLine> = {
        "almost-none": { en: "almost no physical activity", ru: "почти нет физической активности" },
        "1-2x": { en: "1-2 workouts per week", ru: "1-2 тренировки в неделю" },
        "3-4x": { en: "3-4 workouts per week", ru: "3-4 тренировки в неделю" },
        daily: { en: "daily training", ru: "тренируется ежедневно" },
      };
      const v = map[value];
      return v && { en: `Physical activity: ${v.en}.`, ru: `Физическая активность: ${v.ru}.` };
    }
    case "mainIssue": {
      const map: Record<string, ProfileLine> = {
        "brain-fog": { en: "brain fog", ru: "туман в голове" },
        "no-motivation": { en: "lack of motivation", ru: "отсутствие мотивации" },
        anxiety: { en: "anxiety and stress", ru: "тревога и стресс" },
        "bad-sleep": { en: "poor sleep quality", ru: "плохой сон" },
        "morning-fatigue": { en: "morning fatigue", ru: "утренняя усталость" },
      };
      const v = map[value];
      return v && { en: `Self-reported main issue: ${v.en}.`, ru: `Главная проблема: ${v.ru}.` };
    }
  }
  return null;
}

function detectPatterns(a: QuizAnswers): string[] {
  const signals: string[] = [];
  const highCaffeine = a.caffeine === "2-3cups" || a.caffeine === "3+-energy";
  const moderateOrHighCaffeine = a.caffeine === "1cup" || highCaffeine;
  const shortSleep = a.sleep === "<6h";
  const longUnrested = a.sleep === ">8h-unrested";
  const chronicStress = a.stress === "high-chronic";

  if (highCaffeine && a.mainIssue === "anxiety") {
    signals.push(
      "High caffeine load + anxiety as main complaint signals adenosine/cortisol dysregulation. Caffeine reduction is the leverage point, not additional adaptogens layered on top."
    );
  }
  if (longUnrested) {
    signals.push(
      "Sleeps 8+ hours but wakes unrested — this is a sleep ARCHITECTURE problem, not a duration deficit. Adding sleep hours will not help; bedroom temperature, magnesium L-threonate, and melatonin TIMING (not dose) are the levers."
    );
  }
  if (a.nutrition === "skip-meals" && a.energy === "always-tired") {
    signals.push(
      "Skipping meals + chronic fatigue suggests reactive hypoglycemia and blood sugar instability. Fix meal timing before adding supplements."
    );
  }
  if (a.activity === "daily" && a.energy === "always-tired") {
    signals.push(
      "Daily training + chronic fatigue may indicate overtraining or undereating. Check protein intake (1.6-2.2g/kg) and total caloric adequacy before adding stimulants."
    );
  }
  if (a.age === "45+" && a.energy === "always-tired") {
    signals.push(
      "45+ with chronic fatigue warrants bloodwork consideration: thyroid panel (TSH, free T3/T4), vitamin D, B12, ferritin, and (for men) testosterone — rule out medical drivers before optimizing lifestyle."
    );
  }
  if (chronicStress && (shortSleep || longUnrested)) {
    signals.push(
      "Chronic high stress + poor sleep means cortisol is the bridge — elevated evening cortisol disrupting sleep onset/architecture. Phosphatidylserine 100mg before bed and magnesium glycinate are direct levers."
    );
  }
  if (a.energy === "afternoon-crash" && (a.nutrition === "irregular" || a.nutrition === "skip-meals")) {
    signals.push(
      "Afternoon crash + irregular eating points to blood sugar dysregulation overlay. Protein-anchored breakfast within 60 min of waking and consistent meal spacing matter more here than caffeine."
    );
  }
  if (a.mainIssue === "brain-fog" && moderateOrHighCaffeine) {
    signals.push(
      "Brain fog with moderate-to-high caffeine intake suggests adenosine cycle disruption and likely omega-3/hydration/methylation deficits. Caffeine masks the issue rather than solving it."
    );
  }
  if (chronicStress && a.mainIssue === "anxiety" && (shortSleep || longUnrested)) {
    signals.push(
      "Chronic stress + anxiety as main issue + disrupted sleep signals HPA axis dysfunction and sympathetic dominance — classic stress-burnout transitioning phenotype."
    );
  }
  if (
    (a.age === "18-24" || a.age === "25-34") &&
    a.energy === "always-tired" &&
    a.nutrition === "skip-meals"
  ) {
    signals.push(
      "Younger user + chronic fatigue + skipping meals likely points to foundational nutritional gaps (B vitamins active forms, iron especially in females) before optimization layers."
    );
  }
  if (shortSleep && a.activity === "almost-none") {
    signals.push(
      "Short sleep + sedentary lifestyle compounds recovery debt. Sleep extension and gentle daily movement together produce more energy than either alone."
    );
  }
  if (a.age === "35-44" && a.energy === "always-tired") {
    signals.push(
      "35-44 with chronic fatigue: mitochondrial decline begins in this bracket — CoQ10 ubiquinol becomes substantively more valuable than at younger ages."
    );
  }

  return signals;
}

function buildUserProfile(answers: QuizAnswers, lang: GenerateLang): string {
  const keys: (keyof QuizAnswers)[] = [
    "age",
    "goal",
    "energy",
    "sleep",
    "caffeine",
    "stress",
    "nutrition",
    "activity",
    "mainIssue",
  ];
  const lines = keys
    .map((k) => describe(k, answers[k]))
    .filter((x): x is ProfileLine => x !== null)
    .map((p) => (lang === "ru" ? p.ru : p.en));

  const signals = detectPatterns(answers);

  const header = lang === "ru" ? "ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ" : "USER PROFILE";
  const signalsHeader = lang === "ru" ? "Сигналы паттернов:" : "Pattern signals:";
  const closing =
    lang === "ru"
      ? "Сгенерируй протокол на основе именно этого профиля."
      : "Generate the protocol based on this specific profile.";

  const parts: string[] = [header, "", ...lines];
  if (signals.length > 0) {
    parts.push("", signalsHeader);
    for (const s of signals) parts.push(`- ${s}`);
  }
  parts.push("", closing);
  return parts.join("\n");
}

function stripThinking(text: string): string {
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
}

function hadThinkingBlock(text: string): boolean {
  return /<thinking>[\s\S]*?<\/thinking>/.test(text);
}

function extractJson(text: string): unknown {
  const stripped = stripThinking(text);
  const fenced = stripped.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const raw = fenced ? fenced[1] : stripped;
  return JSON.parse(raw);
}

export type GenerateResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number; error: string; detail?: string };

export async function generatePlan(params: {
  answers: QuizAnswers;
  lang: GenerateLang;
  tier: GenerateTier;
}): Promise<GenerateResult> {
  const { answers, lang, tier } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[generatePlan] ANTHROPIC_API_KEY is not set");
    return { ok: false, status: 500, error: "anthropic not configured" };
  }

  const isPaid = tier === "pro" || tier === "coach";
  const langName = lang === "ru" ? "Russian (русский)" : "English";
  const system = isPaid ? PRO_SYSTEM : FREE_SYSTEM;
  const schema = isPaid ? PRO_SCHEMA : FREE_SCHEMA;
  const validator = isPaid ? ProPlanSchema : FreeReportSchema;

  const userPrompt = `${buildUserProfile(answers, lang)}

Write your final output in ${langName}.

Begin with a <thinking> block analyzing this user's phenotype, root causes, and supplement selection (in English is fine). Then, on a new line after the closing </thinking> tag, output a JSON object that exactly matches this shape:
${schema}

Rules for the JSON output:
- Be specific to this profile, not generic. Reference the user's actual answers and pattern signals.
- Use concrete numbers, times, and dosages (e.g., "magnesium glycinate 300mg, 1 hour before bed").
- Voice: direct, warm, never preachy. No empty wellness platitudes.

CRITICAL: After </thinking>, output ONLY the JSON object. No explanation, no markdown fences, no preamble. The JSON must be complete and valid — every string must be closed, every array must end with ], every object must end with }.`;

  let response;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: isPaid ? 8000 : 3000,
      temperature: 1.0,
      // cache_control on system text blocks is supported at runtime (prompt caching
      // is GA) but the SDK types in ^0.32.1 omit it on TextBlockParam — cast to
      // unblock typecheck without bumping the SDK.
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ] as unknown as Anthropic.TextBlockParam[],
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generatePlan] anthropic call failed:", msg, err);
    return { ok: false, status: 502, error: "anthropic failed", detail: msg };
  }

  const usage = response.usage as
    | {
        input_tokens?: number;
        output_tokens?: number;
        cache_creation_input_tokens?: number;
        cache_read_input_tokens?: number;
      }
    | undefined;
  console.log("[generatePlan] usage", {
    tier,
    input_tokens: usage?.input_tokens,
    output_tokens: usage?.output_tokens,
    cache_creation_input_tokens: usage?.cache_creation_input_tokens,
    cache_read_input_tokens: usage?.cache_read_input_tokens,
    stop_reason: response.stop_reason,
  });

  if (response.stop_reason === "max_tokens") {
    console.warn("[generatePlan] response truncated by max_tokens cap", {
      tier,
      max_tokens: isPaid ? 8000 : 3000,
      output_tokens: usage?.output_tokens,
    });
    return {
      ok: false,
      status: 500,
      error: "generation_truncated",
      detail: "Plan generation exceeded token budget",
    };
  }

  const textBlock = response.content.find((c) => c.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("[generatePlan] empty response — no text block");
    return { ok: false, status: 500, error: "empty response" };
  }

  const rawText = textBlock.text;
  const stripped = stripThinking(rawText);
  if (stripped.length === 0 || !stripped.includes("{")) {
    console.error("[generatePlan] No JSON after thinking block — likely truncated mid-thinking", {
      tier,
      totalLength: rawText.length,
      strippedLength: stripped.length,
      hadThinking: hadThinkingBlock(rawText),
      stopReason: response.stop_reason,
      lastChars: rawText.slice(-200),
    });
    return {
      ok: false,
      status: 502,
      error: "no_json_after_thinking",
      detail: "Model emitted thinking but no JSON — likely truncated",
    };
  }

  let parsed: unknown;
  try {
    parsed = extractJson(rawText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generatePlan] parse failed", {
      error: msg,
      lastChars: rawText.slice(-200),
      totalLength: rawText.length,
      stopReason: response.stop_reason,
      hadThinking: hadThinkingBlock(rawText),
    });
    return { ok: false, status: 502, error: "invalid model output", detail: msg };
  }

  const validation = validator.safeParse(parsed);
  if (!validation.success) {
    const detail = validation.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    console.error(
      "[generatePlan] schema validation failed:",
      detail,
      "\n--- PARSED ---\n",
      JSON.stringify(parsed, null, 2)
    );
    return { ok: false, status: 502, error: "schema validation failed", detail };
  }

  return { ok: true, data: validation.data };
}

// Background-job entry point. Wrapped by waitUntil() in the webhook so plan
// generation runs after the webhook has already returned 200 to Stripe.
// Always writes a row to plans — on success with plan_data, on failure with
// { error, detail } so the dashboard polling can surface a clear error state
// instead of polling forever.
export async function generateAndSavePlan(params: {
  userId: string;
  sessionId: string;
  answers: QuizAnswers;
  lang: GenerateLang;
  tier: GenerateTier;
}): Promise<void> {
  const { userId, sessionId, answers, lang, tier } = params;
  console.log("[generateAndSavePlan] background plan generation started", {
    sessionId,
    userId,
    tier,
  });

  const admin = createAdminClient();
  const result = await generatePlan({ answers, lang, tier });

  const planRow: Record<string, unknown> = {
    user_id: userId,
    tier,
    answers,
    language: lang,
    stripe_session_id: sessionId,
  };

  if (result.ok) {
    planRow.plan_data = result.data;
  } else {
    console.error("[generateAndSavePlan] generation failed — saving error marker", {
      sessionId,
      error: result.error,
      detail: result.detail,
    });
    planRow.plan_data = { error: result.error, detail: result.detail ?? null };
  }

  const { error: insertErr } = await admin.from("plans").insert(planRow);
  if (insertErr) {
    console.error("[generateAndSavePlan] plans insert failed:", insertErr);
    return;
  }

  if (result.ok) {
    console.log("[generateAndSavePlan] saved plan for session", sessionId);
  } else {
    console.log("[generateAndSavePlan] saved error marker for session", sessionId);
  }
}
