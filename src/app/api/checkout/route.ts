import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tier: "pro" | "coach";
      lang: "en" | "ru";
      userId?: string | null;
      answers?: QuizAnswers;
    };
    const { tier, lang, userId, answers } = body;

    const isDev = process.env.NODE_ENV !== "production";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const priceId =
      tier === "coach" ? process.env.STRIPE_PRICE_COACH : process.env.STRIPE_PRICE_PRO;

    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      if (isDev) {
        const bypassId = `dev_bypass_${tier}_${Date.now()}`;
        console.warn(
          `[checkout] DEV BYPASS: Stripe not configured — returning fake success URL with sessionId=${bypassId}. DO NOT rely on this in production.`
        );
        return NextResponse.json({
          url: `${siteUrl}/dashboard?session_id=${bypassId}`,
        });
      }
      console.error("[checkout] Stripe not configured", {
        hasSecret: Boolean(process.env.STRIPE_SECRET_KEY),
        hasPriceId: Boolean(priceId),
        tier,
      });
      return NextResponse.json(
        {
          error: "stripe not configured",
          detail: !process.env.STRIPE_SECRET_KEY
            ? "STRIPE_SECRET_KEY env var missing"
            : `STRIPE_PRICE_${tier.toUpperCase()} env var missing`,
        },
        { status: 500 }
      );
    }

    let customerEmail: string | undefined;
    if (userId) {
      try {
        const admin = createAdminClient();
        const { data, error } = await admin.auth.admin.getUserById(userId);
        if (!error && data?.user?.email) {
          customerEmail = data.user.email;
        }
      } catch (err) {
        console.warn("[checkout] could not look up user email:", err);
      }
    }

    const metadata: Record<string, string> = {
      tier,
      lang,
      language: lang,
      user_id: userId || "anonymous",
    };
    if (answers) {
      // Stripe metadata values are capped at 500 chars each.
      const answersJson = JSON.stringify(answers);
      if (answersJson.length <= 500) {
        metadata.answers = answersJson;
      } else {
        console.warn(
          "[checkout] answers JSON exceeds 500 chars — splitting across metadata keys",
          answersJson.length
        );
        // Split into chunks of <=500 chars across answers_0, answers_1, ...
        const chunks: string[] = [];
        for (let i = 0; i < answersJson.length; i += 490) {
          chunks.push(answersJson.slice(i, i + 490));
        }
        chunks.forEach((c, i) => {
          metadata[`answers_${i}`] = c;
        });
        metadata.answers_chunks = String(chunks.length);
      }
    }

    console.log("[checkout] creating Stripe session", {
      tier,
      lang,
      metadataLanguage: metadata.language,
      metadataLang: metadata.lang,
      hasAnswers: Boolean(answers),
      userId: userId || null,
    });

    const session = await stripe.checkout.sessions.create({
      mode: tier === "coach" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/quiz`,
      locale: lang === "ru" ? "ru" : "en",
      allow_promotion_codes: true,
      metadata,
      ...(userId ? { client_reference_id: userId } : {}),
      ...(customerEmail ? { customer_email: customerEmail } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[checkout] error:", msg);
    return NextResponse.json(
      { error: "checkout failed", detail: msg },
      { status: 500 }
    );
  }
}
