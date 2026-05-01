import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email: string;
  password: string;
  tier: "pro" | "coach";
  lang: "en" | "ru";
  answers?: QuizAnswers | null;
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
    const resolvedTier: "pro" | "coach" = tier === "coach" ? "coach" : "pro";
    const resolvedLang: "en" | "ru" = lang === "ru" ? "ru" : "en";

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

    const priceId =
      resolvedTier === "coach"
        ? process.env.STRIPE_PRICE_COACH
        : process.env.STRIPE_PRICE_PRO;
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
      cancel_url: `${siteUrl}/result`,
      locale: resolvedLang === "ru" ? "ru" : "en",
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
