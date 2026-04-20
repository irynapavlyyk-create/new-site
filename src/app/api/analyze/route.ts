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
  const t0 = Date.now();
  try {
    const body = (await req.json()) as {
      answers: QuizAnswers;
      lang: "en" | "ru";
      tier: "free" | "pro" | "coach";
      sessionId?: string;
    };
    const { answers, lang, tier, sessionId } = body;

    console.log("[analyze] incoming", {
      tier,
      lang,
      hasSessionId: Boolean(sessionId),
      sessionIdPrefix: sessionId?.slice(0, 12),
      answerKeys: answers ? Object.keys(answers) : null,
      answerCount: answers ? Object.keys(answers).length : 0,
      anthropicKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
      stripeKeySet: Boolean(process.env.STRIPE_SECRET_KEY),
      model: MODEL,
    });

    if (!answers || typeof answers !== "object") {
      console.warn("[analyze] rejected: invalid answers");
      return NextResponse.json({ error: "invalid answers" }, { status: 400 });
    }

    const isPaid = tier === "pro" || tier === "coach";
    const isDev = process.env.NODE_ENV !== "production";
    const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

    if (isPaid) {
      let bypass = false;

      if (!stripeConfigured) {
        if (!isDev) {
          console.error("[analyze] STRIPE_SECRET_KEY is not set (production)");
          return NextResponse.json(
            { error: "stripe not configured", detail: "STRIPE_SECRET_KEY env var missing on server" },
            { status: 500 }
          );
        }
        console.warn(
          "[analyze] DEV BYPASS: STRIPE_SECRET_KEY missing — skipping Stripe verification. Do NOT rely on this in production."
        );
        bypass = true;
      } else if (!sessionId) {
        console.warn("[analyze] rejected: paid tier without sessionId");
        return NextResponse.json({ error: "missing session" }, { status: 401 });
      } else if (sessionId.startsWith("dev_bypass_")) {
        if (!isDev) {
          return NextResponse.json({ error: "invalid session" }, { status: 401 });
        }
        console.warn("[analyze] DEV BYPASS: accepting dev_bypass_ session id without Stripe check");
        bypass = true;
      }

      if (!bypass && sessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          console.log("[analyze] stripe session", {
            id: session.id,
            status: session.status,
            payment_status: session.payment_status,
            mode: session.mode,
          });
          const paid =
            session.payment_status === "paid" ||
            session.payment_status === "no_payment_required" ||
            session.status === "complete";
          if (!paid) {
            console.warn("[analyze] rejected: session not paid", {
              status: session.status,
              payment_status: session.payment_status,
            });
            return NextResponse.json(
              { error: "unpaid", status: session.status, payment_status: session.payment_status },
              { status: 402 }
            );
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("[analyze] stripe.checkout.sessions.retrieve failed:", msg);
          return NextResponse.json(
            { error: "invalid session", detail: msg },
            { status: 401 }
          );
        }
      }
    }

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

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[analyze] ANTHROPIC_API_KEY is not set");
      return NextResponse.json({ error: "anthropic not configured" }, { status: 500 });
    }

    console.log("[analyze] calling anthropic", {
      model: MODEL,
      maxTokens: isPaid ? 4000 : 1200,
      promptLength: userPrompt.length,
    });

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
      console.error("[analyze] anthropic call failed:", msg, err);
      return NextResponse.json({ error: "anthropic failed", detail: msg }, { status: 502 });
    }

    console.log("[analyze] anthropic ok", {
      stopReason: response.stop_reason,
      usage: response.usage,
    });

    const textBlock = response.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      console.error("[analyze] empty response — no text block");
      return NextResponse.json({ error: "empty response" }, { status: 500 });
    }

    let data;
    try {
      data = extractJson(textBlock.text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[analyze] JSON parse failed:", msg, "\n--- RAW ---\n", textBlock.text);
      return NextResponse.json({ error: "invalid model output", detail: msg }, { status: 502 });
    }

    console.log("[analyze] success", { ms: Date.now() - t0 });
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[analyze] unhandled error:", msg, "\nstack:", stack);
    return NextResponse.json({ error: "generation failed", detail: msg }, { status: 500 });
  }
}
