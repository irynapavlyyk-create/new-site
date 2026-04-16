import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, FREE_SYSTEM, PRO_SYSTEM, FREE_SCHEMA, PRO_SCHEMA } from "@/lib/claude";
import { stripe } from "@/lib/stripe";
import { quizSteps } from "@/lib/quiz-data";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function buildUserSummary(answers: QuizAnswers, lang: "en" | "ru"): string {
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

export async function POST(req: NextRequest) {
  try {
    const { answers, lang, tier, sessionId } = (await req.json()) as {
      answers: QuizAnswers;
      lang: "en" | "ru";
      tier: "free" | "pro";
      sessionId?: string;
    };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "invalid answers" }, { status: 400 });
    }

    if (tier === "pro") {
      if (!sessionId) {
        return NextResponse.json({ error: "missing session" }, { status: 401 });
      }
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
          return NextResponse.json({ error: "unpaid" }, { status: 402 });
        }
      } catch {
        return NextResponse.json({ error: "invalid session" }, { status: 401 });
      }
    }

    const langName = lang === "ru" ? "Russian (русский)" : "English";
    const system = tier === "pro" ? PRO_SYSTEM : FREE_SYSTEM;
    const schema = tier === "pro" ? PRO_SCHEMA : FREE_SCHEMA;

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

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: tier === "pro" ? 4000 : 1200,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "empty response" }, { status: 500 });
    }

    const data = extractJson(textBlock.text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[analyze] error", err);
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  }
}
