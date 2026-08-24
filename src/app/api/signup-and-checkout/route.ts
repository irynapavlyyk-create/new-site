import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { isPromoActive } from "@/lib/promo";
import { COACH_ENABLED } from "@/lib/flags";
import type { Lang, QuizAnswers } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email: string;
  password: string;
  tier: "pro" | "coach";
  lang: Lang;
  answers?: QuizAnswers | null;
  posthogDistinctId?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    const { email, password, tier, lang } = body;
    const answers = body.answers ?? null;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }
    // Coach is off sale: refuse BEFORE creating the auth user, and never
    // downgrade silently (that would charge PRO for a Coach request).
    if (tier === "coach" && !COACH_ENABLED) {
      console.warn("[signup-and-checkout] rejected coach checkout — COACH_ENABLED is off", {
        email,
        lang,
      });
      return NextResponse.json({ error: "Coach is not available" }, { status: 400 });
    }
    const resolvedTier: "pro" | "coach" = tier === "coach" ? "coach" : "pro";
    const resolvedLang: Lang = lang === "cs" ? "cs" : "en";

    const supabase = await createClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      const msg = signUpError.message || "";
      if (msg.toLowerCase().includes("already")) {
        return NextResponse.json(
          { error: "Email already in use. Please sign in instead." },
          { status: 400 }
        );
      }
      console.error("[signup-and-checkout] signUp failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!authData.user) {
      console.error("[signup-and-checkout] signUp returned no user (email confirmation may be enabled)");
      return NextResponse.json(
        { error: "Could not create user" },
        { status: 500 }
      );
    }

    // Launch promo: discounted price id during the window; defensive fallback to
    // the original if the PROMO env var is missing/empty (never break checkout).
    const originalPriceId =
      resolvedTier === "coach"
        ? process.env.STRIPE_PRICE_COACH
        : process.env.STRIPE_PRICE_PRO;
    const promoPriceId =
      resolvedTier === "coach"
        ? process.env.STRIPE_PRICE_COACH_PROMO
        : process.env.STRIPE_PRICE_PRO_PROMO;
    const priceId =
      isPromoActive() && promoPriceId ? promoPriceId : originalPriceId;
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      console.error("[signup-and-checkout] Stripe not configured", {
        hasSecret: Boolean(process.env.STRIPE_SECRET_KEY),
        hasPriceId: Boolean(priceId),
        tier: resolvedTier,
      });
      return NextResponse.json(
        { error: "stripe not configured" },
        { status: 500 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.energyforge.app";

    // Webhook reads metadata.user_id and skips the magic link when it's a real
    // UUID (i.e. not "anonymous"), so the user lands on /dashboard already
    // signed in. Mirror existing checkout/route.ts answer-chunking exactly so
    // the webhook's parser keeps working unchanged.
    const metadata: Record<string, string> = {
      tier: resolvedTier,
      lang: resolvedLang,
      language: resolvedLang,
      user_id: authData.user.id,
    };
    // Carried to the webhook so the server-side purchase_completed event ties
    // to the same PostHog person who clicked buy.
    if (body.posthogDistinctId)
      metadata.posthog_distinct_id = body.posthogDistinctId;
    if (answers) {
      const answersJson = JSON.stringify(answers);
      if (answersJson.length <= 500) {
        metadata.answers = answersJson;
      } else {
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

    const session = await stripe.checkout.sessions.create({
      mode: resolvedTier === "coach" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/result?canceled=true`,
      locale: resolvedLang === "cs" ? "cs" : "en",
      allow_promotion_codes: true,
      customer_email: email,
      client_reference_id: authData.user.id,
      metadata,
    });

    console.log("[signup-and-checkout] created Stripe session", {
      tier: resolvedTier,
      lang: resolvedLang,
      userId: authData.user.id,
      hasAnswers: Boolean(answers),
      sessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[signup-and-checkout] error:", msg);
    return NextResponse.json(
      { error: "Server error", detail: msg },
      { status: 500 }
    );
  }
}
