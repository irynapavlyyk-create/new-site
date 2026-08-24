import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { anthropic, MODEL, PRO_SYSTEM } from "@/lib/claude";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendPlanReady } from "@/lib/emails/send";
import type { Lang, PhenotypeId, QuizAnswers } from "@/types";
import { describe, detectPatterns, type ProfileLine } from "@/lib/signals";
import { inferPhenotype } from "@/lib/inferPhenotype";
import { getPhenotypePreview } from "@/lib/phenotypePreviews";
import { getPhenotype, PHENOTYPES } from "@/lib/phenotypes";
import { SUPPLEMENT_CATALOG, resolveSupplement } from "@/lib/supplement-recommendations";

export type GenerateTier = "pro" | "coach";

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

// .describe() hints flow into the structured-outputs JSON Schema the model
// sees — they replace the old inline PRO_SCHEMA_V2 examples.
const ProtocolStepSchema = z.object({
  time: z.string().describe('24-hour clock time like "06:30" — always HH:MM, never a phrase'),
  action: z.string().describe("main instruction, at most 60 characters"),
  note: z.string().describe("one short why/how line"),
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

// ============================================
// STRUCTURED-OUTPUTS GENERATION SCHEMA
// The API constrains decoding to this shape — invalid JSON is impossible.
// Differs from ProPlanV2Schema in three deliberate ways:
//  - leading "reasoning" field: the model's forced pre-plan analysis
//    (replaces the old <thinking> text block; stripped before storage)
//  - weeks is an ARRAY, not a tuple (tuples don't map onto the
//    constrained-decoding JSON Schema subset)
//  - NO maximum counts: the decoding grammar enforces structure and types but
//    not array maximums, and the SDK validates this schema INSIDE parse() —
//    a max here would throw away a paid run the model overshot. Overshoot is
//    coerced (truncated, logged) before ProPlanV2Schema, which still enforces
//    the real maximums as the storage contract. Minimums stay: too few items
//    is a genuine quality failure and must fail into the content retry.
// ============================================

const WeekGenSchema = WeekProtocolSchema.extend({
  number: z.number().int().min(1),
  nutritionFocus: z.array(z.string()).min(3),
  stressPractices: z.array(z.string()).min(3),
  keyActions: z.array(z.string()).min(2),
});

const GenerationSchema = z.object({
  reasoning: z
    .string()
    .describe("concise pre-plan analysis, max 250 words, English is fine — stripped before storage"),
  phenotypeId: PhenotypeIdSchema,
  summary: z.string().describe("2-3 sentences personalized to this user, in the user's language"),
  morningProtocol: z.array(ProtocolStepSchema).min(3),
  sleepProtocol: z.array(ProtocolStepSchema).min(3),
  weeks: z.array(WeekGenSchema).min(4).describe("exactly 4 weeks, numbered 1-4 in order"),
  supplements: z
    .array(SupplementItemSchema.extend({ startWeek: z.number().int().min(1) }))
    .min(3)
    .describe("3 to 6 supplements"),
});

/** Truncate an over-generated array to its storage maximum, logging the miss. */
function truncateTo<T>(arr: T[], max: number, field: string): T[] {
  if (arr.length <= max) return arr;
  console.warn("[generatePlan] coerced over-generation", {
    field,
    original: arr.length,
    max,
  });
  return arr.slice(0, max);
}

// Profile language follows langName so the prompt stays monolingual.
function buildUserProfile(answers: QuizAnswers, lang: Lang): string {
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
    .map((p) => (lang === "cs" ? p.cs : p.en));

  const signals = detectPatterns(answers);

  const header = lang === "cs" ? "PROFIL UŽIVATELE" : "USER PROFILE";
  const signalsHeader = lang === "cs" ? "Signály vzorců:" : "Pattern signals:";
  const closing =
    lang === "cs"
      ? "Vygeneruj protokol přesně na základě tohoto profilu."
      : "Generate the protocol based on this specific profile.";

  const parts: string[] = [header, "", ...lines];
  if (signals.length > 0) {
    parts.push("", signalsHeader);
    for (const s of signals) parts.push(`- ${lang === "cs" ? s.cs : s.en}`);
  }
  parts.push("", closing);
  return parts.join("\n");
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
  /** Used in log lines, e.g. "pro". */
  label: string;
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

async function callAnthropicWithRetry<T>(
  makeCall: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
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
      return await makeCall();
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
  lang: Lang;
  tier: GenerateTier;
}): Promise<GenerateResult> {
  const { answers, lang, tier } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[generatePlan] ANTHROPIC_API_KEY is not set");
    return { ok: false, status: 500, error: "anthropic not configured" };
  }

  const langName = lang === "cs" ? "Czech (čeština)" : "English";
  const system = PRO_SYSTEM;
  const validator = ProPlanV2Schema;
  const retryConfig = RETRY_CONFIG_PRO;

  // 5a + 5b: pin the phenotype + week skeleton deterministically so the paid
  // plan can never show a different phenotype or week themes than the free
  // preview (which uses the same inferPhenotype + getPhenotypePreview). The
  // model writes the plan FOR this phenotype; the values are also force-written
  // back after validation below as a guarantee.
  const phenotypeId: PhenotypeId | null = inferPhenotype(answers);
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

  // Constrained supplement vocabulary (cs only): the UI matches the model's
  // free-text supplement names against catalog aliases to attach product cards
  // and buy links. Pinning the exact Czech names prevents near-miss spellings
  // ("hořčík glycinát") from silently dropping the cards.
  const supplementVocabBlock =
    lang === "cs"
      ? `
ALLOWED SUPPLEMENT NAMES — when recommending any supplement from this catalog, use its name EXACTLY as written below (these names drive product-card matching in the UI). A supplement outside this list may be included under its standard Czech name.
${Object.values(SUPPLEMENT_CATALOG)
  .map((e) => `- ${e.name.cs}`)
  .join("\n")}
`
      : "";

  const userPrompt = `${buildUserProfile(answers, lang)}
${pinnedPhenotypeBlock}${supplementVocabBlock}
Write your final output in ${langName}.${
    lang === "cs"
      ? ' Address the user informally using tykání (Czech informal "ty" forms throughout — never vykání), consistent with the rest of the product.'
      : ""
  }

Fill the "reasoning" field first — a concise analysis of this user's phenotype, root causes, and supplement selection (English is fine, max 250 words). Every field after it is user-facing plan content.

Rules for the plan content:
- Be specific to this profile, not generic. Reference the user's actual answers and pattern signals.
- Use concrete numbers, times, and dosages (e.g., "magnesium glycinate 300mg, 1 hour before bed").
- Voice: direct, warm, never preachy. No empty wellness platitudes.`;

  const runAttempt = async (prompt: string, attempt: 1 | 2): Promise<GenerateResult> => {
    let response;
    try {
      response = await callAnthropicWithRetry(
        () =>
          // maxRetries: 0 disables the SDK's built-in retries so our wrapper
          // is the single source of retry truth. output_config.format makes
          // structurally invalid JSON impossible (constrained decoding).
          anthropic.messages.parse(
            {
              model: MODEL,
              max_tokens: 8000,
              temperature: 1.0,
              system: [
                {
                  type: "text",
                  text: system,
                  cache_control: { type: "ephemeral" },
                },
              ],
              messages: [{ role: "user", content: prompt }],
              output_config: { format: zodOutputFormat(GenerationSchema) },
            },
            { maxRetries: 0 }
          ),
        retryConfig
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // The SDK helper validates GenerationSchema INSIDE messages.parse() and
      // throws on violation. That's a content failure (schema minimums, wrong
      // shapes), not a transport failure — surface it as "schema validation
      // failed" so CONTENT_RETRYABLE fires the retry instead of giving up.
      if (msg.includes("Failed to parse structured output")) {
        console.error("[generatePlan] structured-output validation failed inside SDK", {
          attempt,
          detail: msg.slice(0, 400),
        });
        return { ok: false, status: 502, error: "schema validation failed", detail: msg };
      }
      console.error("[generatePlan] anthropic call failed:", msg, { attempt }, err);
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
      attempt,
      input_tokens: usage?.input_tokens,
      output_tokens: usage?.output_tokens,
      cache_creation_input_tokens: usage?.cache_creation_input_tokens,
      cache_read_input_tokens: usage?.cache_read_input_tokens,
      stop_reason: response.stop_reason,
    });

    if (response.stop_reason === "max_tokens") {
      console.warn("[generatePlan] response truncated by max_tokens cap", {
        tier,
        attempt,
        max_tokens: 8000,
        output_tokens: usage?.output_tokens,
      });
      return {
        ok: false,
        status: 500,
        error: "generation_truncated",
        detail: "Plan generation exceeded token budget",
      };
    }

    const parsedOutput = response.parsed_output;
    if (!parsedOutput) {
      console.error("[generatePlan] parse failed — parsed_output is null", {
        attempt,
        stopReason: response.stop_reason,
      });
      return {
        ok: false,
        status: 502,
        error: "invalid model output",
        detail: "structured output missing (parsed_output null)",
      };
    }

    // "reasoning" is the model's forced pre-plan analysis — never stored,
    // never user-facing. Log its size for observability.
    const { reasoning, ...planCandidate } = parsedOutput;
    console.log("[generatePlan] reasoning captured", {
      attempt,
      reasoningChars: reasoning.length,
    });

    // Coerce over-generation instead of failing a paid ~2-minute run: truncate
    // every array to its storage maximum and clamp week numbers / startWeek
    // into 1-4. Every coercion is logged so overshoot frequency is visible.
    // Under-generation is NOT coerced — schema minimums fail into the retry.
    const coerced = {
      ...planCandidate,
      morningProtocol: truncateTo(planCandidate.morningProtocol, 6, "morningProtocol"),
      sleepProtocol: truncateTo(planCandidate.sleepProtocol, 6, "sleepProtocol"),
      supplements: truncateTo(planCandidate.supplements, 6, "supplements").map((s, i) => {
        if (s.startWeek <= 4) return s;
        console.warn("[generatePlan] coerced supplement startWeek", {
          index: i,
          original: s.startWeek,
        });
        return { ...s, startWeek: 4 };
      }),
      weeks: truncateTo(planCandidate.weeks, 4, "weeks").map((w, i) => {
        const patched = { ...w };
        if (w.number !== i + 1) {
          console.warn("[generatePlan] coerced week number", {
            index: i,
            original: w.number,
          });
          patched.number = i + 1;
        }
        patched.nutritionFocus = truncateTo(w.nutritionFocus, 5, `weeks[${i + 1}].nutritionFocus`);
        patched.stressPractices = truncateTo(w.stressPractices, 5, `weeks[${i + 1}].stressPractices`);
        patched.keyActions = truncateTo(w.keyActions, 3, `weeks[${i + 1}].keyActions`);
        return patched;
      }),
    };

    const validation = validator.safeParse(coerced);
    if (!validation.success) {
      const detail = validation.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      console.error(
        "[generatePlan] schema validation failed:",
        { attempt },
        detail,
        "\n--- PARSED ---\n",
        JSON.stringify(coerced, null, 2)
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

    // Server-side visibility for supplement matching: resolveSupplement warns on
    // unmatched names, and running it here (Node) lands those warnings in Vercel
    // logs — the UI-side resolution only logs to the visitor's browser console.
    for (const s of validation.data.supplements) resolveSupplement(s.name);

    return { ok: true, data: validation.data };
  };

  // Content-level retry: one bad character (unescaped quote, malformed field)
  // used to destroy a paid ~2-minute generation. Transport errors are retried
  // inside callAnthropicWithRetry; here we retry ONCE on content errors —
  // JSON parse failure or Zod validation failure — with an added instruction
  // targeting the observed failure mode. Doubles Anthropic spend when it fires.
  const CONTENT_RETRYABLE = new Set(["invalid model output", "schema validation failed"]);
  let result = await runAttempt(userPrompt, 1);
  if (!result.ok && CONTENT_RETRYABLE.has(result.error)) {
    console.warn("[generatePlan] content error on attempt 1 — retrying once", {
      tier,
      error: result.error,
      detail: result.detail?.slice(0, 300),
    });
    const retryPrompt = `${userPrompt}

RETRY NOTE: your previous attempt violated the required output schema and was rejected. Violations:
${String(result.detail ?? result.error).slice(0, 600)}

Fix these exactly: respect every required field and every minimum count. Weeks must be exactly the 4 given, in order, numbered 1-4.`;
    result = await runAttempt(retryPrompt, 2);
    if (result.ok) {
      console.log("[generatePlan] content retry succeeded", { tier });
    }
  }
  return result;
}

function extractSummary(planData: unknown, lang: Lang): string {
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
    return lang === "cs"
      ? "Tvůj osobní 30denní energetický protokol je hotový."
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
  lang: Lang;
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

  // Plan-ready email — only when generation succeeded.
  // Best-effort: never blocks; logs success/failure.
  if (!result.ok) return;

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

  // Personalize with the plan's phenotype display name (localized). result.data
  // is validated ProPlanV2, but typed unknown here — guard before lookup and
  // skip the personalization gracefully if the id is missing/unknown.
  const rawPhenotypeId =
    result.data && typeof result.data === "object" && "phenotypeId" in result.data
      ? (result.data as Record<string, unknown>).phenotypeId
      : null;
  const phenotypeName =
    typeof rawPhenotypeId === "string" && rawPhenotypeId in PHENOTYPES
      ? getPhenotype(rawPhenotypeId as PhenotypeId).name[lang]
      : undefined;

  const emailResult = await sendPlanReady(
    {
      to: userEmail,
      locale: lang,
      dashboardUrl: `${siteUrl}/dashboard`,
      planPreview: summary,
      phenotypeName,
    },
    `plan-ready:${planId}`
  );

  if (emailResult.success) {
    console.log(`[generateAndSavePlan] Plan-ready email sent: id=${emailResult.id} to=${userEmail} planId=${planId}`);
  } else {
    console.error(`[generateAndSavePlan] Plan-ready email failed: ${emailResult.error} to=${userEmail} planId=${planId}`);
  }
}
