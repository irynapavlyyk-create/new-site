import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generatePlan } from "@/lib/generatePlan";
import { createAdminClient } from "@/utils/supabase/admin";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = (await req.json()) as {
      answers: QuizAnswers;
      lang: "en" | "ru";
      tier: "free" | "pro" | "coach";
      sessionId?: string;
      userId?: string | null;
    };
    const { answers, lang, tier, sessionId, userId } = body;

    console.log("[analyze] incoming", {
      tier,
      lang,
      hasSessionId: Boolean(sessionId),
      sessionIdPrefix: sessionId?.slice(0, 12),
      hasUserId: Boolean(userId),
      answerKeys: answers ? Object.keys(answers) : null,
      answerCount: answers ? Object.keys(answers).length : 0,
      anthropicKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
      stripeKeySet: Boolean(process.env.STRIPE_SECRET_KEY),
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

    const result = await generatePlan({ answers, lang, tier });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, detail: result.detail },
        { status: result.status }
      );
    }

    // Optionally persist to DB for logged-in paid users. Starter tier never saves.
    if (userId && tier !== "free") {
      try {
        const admin = createAdminClient();
        const { error: planErr } = await admin.from("plans").insert({
          user_id: userId,
          tier,
          answers,
          plan_data: result.data,
          language: lang,
          ...(sessionId ? { stripe_session_id: sessionId } : {}),
        });
        if (planErr) {
          console.error("[analyze] plans insert failed:", planErr);
        }
      } catch (err) {
        console.error("[analyze] plans insert threw:", err);
      }
    }

    console.log("[analyze] success", { ms: Date.now() - t0 });
    return NextResponse.json(result.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[analyze] unhandled error:", msg, "\nstack:", stack);
    return NextResponse.json({ error: "generation failed", detail: msg }, { status: 500 });
  }
}
