import {
  anthropic,
  MODEL,
  FREE_SYSTEM,
  PRO_SYSTEM,
  FREE_SCHEMA,
  PRO_SCHEMA,
} from "@/lib/claude";
import { quizSteps } from "@/lib/quiz-data";
import type { QuizAnswers } from "@/types";

export type GenerateTier = "free" | "pro" | "coach";
export type GenerateLang = "en" | "ru";

function buildUserSummary(answers: QuizAnswers, lang: GenerateLang): string {
  const lines: string[] = [];
  for (const step of quizSteps) {
    const value = answers[step.key];
    if (!value) continue;
    const opt = step.options.find((o) => o.value === value);
    const q = lang === "ru" ? step.qRu : step.qEn;
    const a = opt ? (lang === "ru" ? opt.labelRu : opt.labelEn) : value;
    lines.push(`- ${q}: ${a}`);
  }
  return lines.join("\n");
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const raw = fenced ? fenced[1] : trimmed;
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

  const userPrompt = `Here is the quiz. Write your output in ${langName}.

Quiz answers:
${buildUserSummary(answers, lang)}

Produce a JSON object that exactly matches this shape:
${schema}

Rules:
- Be specific to these answers, not generic.
- Use concrete numbers, times, and dosages where applicable.
- Voice: direct, warm, never preachy.
- Output JSON only. No commentary, no markdown fences.`;

  let response;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: isPaid ? 4000 : 1200,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generatePlan] anthropic call failed:", msg, err);
    return { ok: false, status: 502, error: "anthropic failed", detail: msg };
  }

  const textBlock = response.content.find((c) => c.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("[generatePlan] empty response — no text block");
    return { ok: false, status: 500, error: "empty response" };
  }

  try {
    const data = extractJson(textBlock.text);
    return { ok: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(
      "[generatePlan] JSON parse failed:",
      msg,
      "\n--- RAW ---\n",
      textBlock.text
    );
    return { ok: false, status: 502, error: "invalid model output", detail: msg };
  }
}
