import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  anthropic,
  MODEL,
  FREE_SYSTEM,
  PRO_SYSTEM,
  FREE_SCHEMA,
} from "@/lib/claude";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendPlanReady } from "@/lib/emails/send";
import type { PhenotypeId, QuizAnswers } from "@/types";
import { describe, detectPatterns, type ProfileLine } from "@/lib/signals";
import { inferPhenotype } from "@/lib/inferPhenotype";
import { getPhenotypePreview } from "@/lib/phenotypePreviews";

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

// ============================================
// V2 SCHEMAS — Dashboard redesign (Phase 1.3.b)
// Paid path validates against these. Legacy ProPlanSchema is kept
// intentionally above for rollback safety — it is currently unreferenced.
// ============================================

const ProtocolStepSchema = z.object({
  time: z.string(),
  action: z.string(),
  note: z.string(),
});

const WeekProtocolSchema = z.object({
  number: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  title: z.string(),
  focus: z.string(),
  nutritionFocus: z.array(z.string()).min(3).max(5),
  stressPractices: z.array(z.string()).min(3).max(5),
  keyActions: z.array(z.string()).min(2).max(3),
});

const SupplementItemSchema = z.object({
  name: z.string(),
  dose: z.string(),
  timing: z.string(),
  note: z.string(),
  startWeek: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const PhenotypeIdSchema = z.enum([
  "wired-but-tired",
  "crashed-circadian",
  "depleted-engine",
  "afternoon-crasher",
  "brain-fog-dominant",
  "stress-burnout-transitioning",
]);

const ProPlanV2Schema = z.object({
  phenotypeId: PhenotypeIdSchema,
  summary: z.string(),
  morningProtocol: z.array(ProtocolStepSchema).min(3).max(6),
  sleepProtocol: z.array(ProtocolStepSchema).min(3).max(6),
  weeks: z.tuple([
    WeekProtocolSchema,
    WeekProtocolSchema,
    WeekProtocolSchema,
    WeekProtocolSchema,
  ]),
  supplements: z.array(SupplementItemSchema).min(3).max(6),
});

/** JSON shape description sent to the model in the paid-tier user prompt. */
const PRO_SCHEMA_V2 = `{
  "phenotypeId": "wired-but-tired" | "crashed-circadian" | "depleted-engine" | "afternoon-crasher" | "brain-fog-dominant" | "stress-burnout-transitioning",
  "summary": "2-3 sentences personalized to this user's situation, in the user's language",
  "morningProtocol": [
    { "time": "06:30", "action": "≤60 chars action", "note": "1 short why/how line" }
  ],
  "sleepProtocol": [
    { "time": "21:00", "action": "≤60 chars action", "note": "1 short why/how line" }
  ],
  "weeks": [
    {
      "number": 1,
      "title": "Short title for the week, e.g. 'Foundation reset'",
      "focus": "2-3 sentence description of what this week accomplishes",
      "nutritionFocus": ["3 to 5 nutrition items specific to this week"],
      "stressPractices": ["3 to 5 stress practices specific to this week"],
      "keyActions": ["2 to 3 highlighted key actions for the week"]
    }
    // exactly 4 week objects, numbered 1, 2, 3, 4 in order
  ],
  "supplements": [
    {
      "name": "Vitamin D3 + K2",
      "dose": "2000-4000 IU",
      "timing": "AM with breakfast",
      "note": "Why or how, 1-2 sentences",
      "startWeek": 1
    }
    // 3 to 6 supplements total
  ]
}`;

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

function buildUserProfile(answers: QuizAnswers, lang: GenerateLang): string {
  const keys: (keyof QuizAnswers)[] = [
    "chronotype",
    "age",
    "energy",
    "sleepDuration",
    "sleepQuality",
    "caffeine",
    "stressSymptoms",
    "nutrition",
    "activity",
    "priority",
    "biologicalSex",
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
    for (const s of signals) parts.push(`- ${lang === "ru" ? s.ru : s.en}`);
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

// ============================================
// ANTHROPIC RETRY WRAPPER
// Survives transient 408/409/429/5xx (including 529 overloaded_error) by
// re-attempting with exponential backoff + jitter. Per-tier configs keep
// total wall-clock under each route's maxDuration. SDK's own retries are
// disabled per-call to keep the attempt count under our control.
// ============================================

type RetryConfig = {
  maxAttempts: number;
  /** Length must be maxAttempts - 1. Indexes 0..n-2 used between attempts. */
  backoffMs: number[];
  /** Hard stop: refuse to start a new attempt if elapsed exceeds this. */
  budgetMs: number;
  /** Used in log lines: "free" / "pro". */
  label: string;
};

const RETRY_CONFIG_FREE: RetryConfig = {
  maxAttempts: 5,
  backoffMs: [2000, 4000, 8000, 15000],
  budgetMs: 45_000,
  label: "free",
};

const RETRY_CONFIG_PRO: RetryConfig = {
  maxAttempts: 5,
  backoffMs: [3000, 8000, 15000, 25000],
  budgetMs: 240_000,
  label: "pro",
};

function isRetryableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const status = (err as { status?: unknown }).status;
  if (typeof status === "number") {
    return (
      status === 408 ||
      status === 409 ||
      status === 429 ||
      (status >= 500 && status < 600)
    );
  }
  // Network-level errors (no HTTP response): retry.
  const name = (err as { name?: unknown }).name;
  return (
    name === "APIConnectionError" ||
    name === "APIConnectionTimeoutError" ||
    name === "AbortError"
  );
}

async function callAnthropicWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
  config: RetryConfig
): Promise<Anthropic.Message> {
  const start = Date.now();
  let lastErr: unknown;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    const elapsed = Date.now() - start;
    if (elapsed > config.budgetMs) {
      console.warn(
        `[generatePlan:${config.label}] retry budget ${config.budgetMs}ms exhausted at ${elapsed}ms — giving up`
      );
      break;
    }

    try {
      // maxRetries: 0 disables the SDK's built-in retries so our wrapper
      // is the single source of retry truth.
      return await anthropic.messages.create(params, { maxRetries: 0 });
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: unknown })?.status;
      const isLast = attempt === config.maxAttempts - 1;

      if (!isRetryableError(err)) {
        console.warn(
          `[generatePlan:${config.label}] non-retryable error status=${String(status)} attempt=${attempt + 1}/${config.maxAttempts}`
        );
        throw err;
      }
      if (isLast) {
        console.warn(
          `[generatePlan:${config.label}] retryable status=${String(status)} attempt=${attempt + 1}/${config.maxAttempts} — final attempt failed`
        );
        throw err;
      }

      const baseDelay = config.backoffMs[attempt];
      const jitter = Math.floor(Math.random() * 300);
      const delay = baseDelay + jitter;

      const elapsedAfter = Date.now() - start;
      if (elapsedAfter + delay > config.budgetMs) {
        console.warn(
          `[generatePlan:${config.label}] backoff ${delay}ms after attempt ${attempt + 1} would exceed budget (elapsed=${elapsedAfter}ms) — giving up`
        );
        throw err;
      }

      console.warn(
        `[generatePlan:${config.label}] retryable status=${String(status)} attempt=${attempt + 1}/${config.maxAttempts} — waiting ${delay}ms before retry`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastErr;
}

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
  const schema = isPaid ? PRO_SCHEMA_V2 : FREE_SCHEMA;
  const validator = isPaid ? ProPlanV2Schema : FreeReportSchema;
  const retryConfig = isPaid ? RETRY_CONFIG_PRO : RETRY_CONFIG_FREE;

  // 5a + 5b (paid only): pin the phenotype + week skeleton deterministically so
  // the paid plan can never show a different phenotype or week themes than the
  // free preview (which uses the same inferPhenotype + getPhenotypePreview). The
  // model writes the plan FOR this phenotype; the values are also force-written
  // back after validation below as a guarantee. Free path is unaffected.
  const phenotypeId: PhenotypeId | null = isPaid ? inferPhenotype(answers) : null;
  const weekTitles: string[] | null = phenotypeId
    ? getPhenotypePreview(phenotypeId).weekThemes.map((th) => th[lang])
    : null;

  const pinnedPhenotypeBlock =
    phenotypeId && weekTitles
      ? `
PRE-DETERMINED PHENOTYPE: "${phenotypeId}"
This phenotype was computed deterministically from the answers above. Build the entire plan for it using the matching PHENOTYPE FRAMEWORK entry, and set the JSON "phenotypeId" field to exactly "${phenotypeId}". Do not choose a different phenotype.

REQUIRED WEEK TITLES — structure the plan as exactly these 4 weeks, in order, and use these titles verbatim:
- W1: ${weekTitles[0]}
- W2: ${weekTitles[1]}
- W3: ${weekTitles[2]}
- W4: ${weekTitles[3]}
Write focus, nutritionFocus, stressPractices, and keyActions for each week, personalized to the user and progressing across the 4 weeks — but keep these exact week titles.
`
      : "";

  const userPrompt = `${buildUserProfile(answers, lang)}
${pinnedPhenotypeBlock}
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
    response = await callAnthropicWithRetry(
      {
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
      },
      retryConfig
    );
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

  // Defense-in-depth (paid only): force the phenotype id + the 4 week titles to
  // the deterministic values, regardless of what the model echoed. This makes
  // the paid dashboard's identity (hero/chart/name) and week themes provably
  // equal to the free preview. The prompt aligns the CONTENT; this guarantees
  // the IDENTITY.
  if (phenotypeId && weekTitles) {
    const plan = validation.data as {
      phenotypeId: PhenotypeId;
      weeks: { title: string }[];
    };
    plan.phenotypeId = phenotypeId;
    plan.weeks.forEach((week, i) => {
      if (weekTitles[i]) week.title = weekTitles[i];
    });
  }

  return { ok: true, data: validation.data };
}

function extractSummary(planData: unknown, lang: GenerateLang): string {
  const raw =
    planData && typeof planData === "object" && "summary" in planData
      ? String((planData as { summary: unknown }).summary ?? "")
      : "";

  const cleaned = raw
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return lang === "ru"
      ? "Ваш персональный 30-дневный энергетический протокол готов."
      : "Your personalized 30-day energy protocol is ready.";
  }

  if (cleaned.length <= 200) return cleaned;
  return cleaned.slice(0, 200).trimEnd() + "…";
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

  const { data: insertedPlan, error: insertErr } = await admin
    .from("plans")
    .insert(planRow)
    .select("id")
    .single();
  if (insertErr) {
    console.error("[generateAndSavePlan] plans insert failed:", insertErr);
    return;
  }

  if (result.ok) {
    console.log("[generateAndSavePlan] saved plan for session", sessionId);
  } else {
    console.log("[generateAndSavePlan] saved error marker for session", sessionId);
  }

  // Plan-ready email — only when generation succeeded for a paid tier.
  // Best-effort: never blocks; logs success/failure.
  if (!result.ok || tier === "free") return;

  const planId = insertedPlan?.id as string | undefined;
  if (!planId) {
    console.warn("[generateAndSavePlan] missing plan id after insert — skipping plan-ready email");
    return;
  }

  let userEmail: string | null = null;
  try {
    const { data: userData, error: userErr } = await admin.auth.admin.getUserById(userId);
    if (userErr) {
      console.warn("[generateAndSavePlan] getUserById failed for plan-ready email:", userErr);
    } else {
      userEmail = userData?.user?.email ?? null;
    }
  } catch (err) {
    console.warn("[generateAndSavePlan] getUserById threw for plan-ready email:", err);
  }

  if (!userEmail) {
    console.warn(`[generateAndSavePlan] no email for userId=${userId} — skipping plan-ready email`);
    return;
  }

  const summary = extractSummary(result.data, lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.energyforge.app";

  const emailResult = await sendPlanReady(
    {
      to: userEmail,
      locale: lang,
      dashboardUrl: `${siteUrl}/dashboard`,
      planPreview: summary,
    },
    `plan-ready:${planId}`
  );

  if (emailResult.success) {
    console.log(`[generateAndSavePlan] Plan-ready email sent: id=${emailResult.id} to=${userEmail} planId=${planId}`);
  } else {
    console.error(`[generateAndSavePlan] Plan-ready email failed: ${emailResult.error} to=${userEmail} planId=${planId}`);
  }
}
