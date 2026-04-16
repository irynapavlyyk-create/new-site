import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const body = await req.text();
  try {
    const event = stripe.webhooks.constructEvent(body, sig, secret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("[webhook] checkout completed", {
          id: session.id,
          tier: session.metadata?.tier,
          amount: session.amount_total,
        });
        break;
      }
      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        console.log("[webhook] subscription event", event.type);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }
}
