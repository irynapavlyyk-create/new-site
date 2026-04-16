import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { tier, lang } = (await req.json()) as { tier: "pro" | "coach"; lang: "en" | "ru" };
    const priceId = tier === "coach" ? process.env.STRIPE_PRICE_COACH : process.env.STRIPE_PRICE_PRO;
    if (!priceId) {
      return NextResponse.json({ error: "price not configured" }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    console.error("[checkout] error", err);
    return NextResponse.json({ error: "checkout failed" }, { status: 500 });
  }
}
