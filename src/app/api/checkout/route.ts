import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { tier, lang } = (await req.json()) as {
      tier: "pro" | "coach";
      lang: "en" | "ru";
    };

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

    const session = await stripe.checkout.sessions.create({
      mode: tier === "coach" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/result`,
      locale: lang === "ru" ? "ru" : "en",
      allow_promotion_codes: true,
      metadata: { tier, lang },
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
