import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import { generatePlan } from "@/lib/generatePlan";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";

type Tier = "pro" | "coach";

function tierFromAmount(amount: number | null | undefined): Tier | null {
  if (amount == null) return null;
  if (amount === 999) return "pro";
  if (amount === 2499) return "coach";
  // Fallback bands: <$15 ≈ pro, ≥$15 ≈ coach
  if (amount <= 1500) return "pro";
  return "coach";
}

function parseAnswersFromMetadata(
  metadata: Stripe.Metadata | null
): QuizAnswers | null {
  if (!metadata) return null;
  const single = metadata.answers;
  if (single) {
    try {
      return JSON.parse(single) as QuizAnswers;
    } catch (err) {
      console.error("[webhook] failed to parse answers metadata:", err);
    }
  }
  const chunkCount = metadata.answers_chunks ? Number(metadata.answers_chunks) : 0;
  if (chunkCount > 0) {
    let combined = "";
    for (let i = 0; i < chunkCount; i++) {
      const part = metadata[`answers_${i}`];
      if (!part) {
        console.error(`[webhook] missing answers chunk ${i}`);
        return null;
      }
      combined += part;
    }
    try {
      return JSON.parse(combined) as QuizAnswers;
    } catch (err) {
      console.error("[webhook] failed to parse chunked answers metadata:", err);
    }
  }
  return null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email || null;
  const metadata = session.metadata || {};
  const metadataUserId = metadata.user_id || "anonymous";
  const language =
    metadata.language === "ru" || metadata.lang === "ru" ? "ru" : "en";
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;
  const sessionId = session.id;
  const tier =
    (metadata.tier as Tier | undefined) || tierFromAmount(session.amount_total);

  console.log("[webhook] checkout.session.completed", {
    sessionId,
    tier,
    email,
    metadataUserId,
    amount: session.amount_total,
    mode: session.mode,
  });

  if (!tier) {
    console.error("[webhook] could not determine tier for session", sessionId);
    return;
  }
  if (!email) {
    console.error("[webhook] checkout session has no email", sessionId);
    return;
  }

  const admin = createAdminClient();

  // 1. Resolve user: existing (metadata.user_id !== anonymous) or lookup/create by email
  let userId: string | null = null;
  let isNewUser = false;

  if (metadataUserId && metadataUserId !== "anonymous") {
    userId = metadataUserId;
  } else {
    // Try profiles table first (fastest)
    const { data: profileRow } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profileRow?.id) {
      userId = profileRow.id as string;
    } else {
      // Fallback: search auth.users via listUsers
      try {
        const { data: listed } = await admin.auth.admin.listUsers();
        const found = listed?.users?.find(
          (u) => (u.email || "").toLowerCase() === email.toLowerCase()
        );
        if (found) {
          userId = found.id;
        }
      } catch (err) {
        console.warn("[webhook] listUsers failed, will attempt create:", err);
      }
    }

    if (!userId) {
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          email,
          email_confirm: true,
        });
      if (createErr || !created?.user) {
        console.error("[webhook] createUser failed:", createErr);
        return;
      }
      userId = created.user.id;
      isNewUser = true;
    }
  }

  if (!userId) {
    console.error("[webhook] could not resolve or create userId for", email);
    return;
  }

  // 2. Update profile: stripe_customer_id + preferred_language
  try {
    const profileUpdate: Record<string, unknown> = {
      id: userId,
      email,
      ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {}),
      ...(language ? { preferred_language: language } : {}),
    };
    const { error: upsertErr } = await admin
      .from("profiles")
      .upsert(profileUpdate, { onConflict: "id" });
    if (upsertErr) {
      console.error("[webhook] profile upsert failed:", upsertErr);
    }
  } catch (err) {
    console.error("[webhook] profile upsert threw:", err);
  }

  // 3. Generate plan from answers (if we have them)
  const answers = parseAnswersFromMetadata(metadata);
  let planData: unknown = null;
  if (answers) {
    const result = await generatePlan({ answers, lang: language, tier });
    if (result.ok) {
      planData = result.data;
    } else {
      console.error("[webhook] plan generation failed:", result);
    }
  } else {
    console.warn(
      "[webhook] no answers in metadata — skipping plan generation",
      sessionId
    );
  }

  // 4. Insert plan row (even if generation failed, we record the purchase)
  try {
    const { error: planErr } = await admin.from("plans").insert({
      user_id: userId,
      tier,
      answers: answers ?? {},
      plan_data: planData ?? {},
      language,
      stripe_session_id: sessionId,
    });
    if (planErr) {
      console.error("[webhook] plans insert failed:", planErr);
    }
  } catch (err) {
    console.error("[webhook] plans insert threw:", err);
  }

  // 5. Magic link for newly created (anonymous) users
  if (isNewUser) {
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://energyforge.app";
      const { error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
        },
      });
      if (linkErr) {
        console.error("[webhook] generateLink failed:", linkErr);
      } else {
        console.log("[webhook] magic link sent to", email);
      }
    } catch (err) {
      console.error("[webhook] generateLink threw:", err);
    }
  }
}

async function handleSubscriptionEvent(sub: Stripe.Subscription) {
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const admin = createAdminClient();

  // Resolve user via profiles.stripe_customer_id
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  const userId = profile?.id ?? null;
  if (!userId) {
    console.warn(
      "[webhook] no profile for stripe_customer_id — subscription unlinked",
      stripeCustomerId
    );
  }

  const row = {
    stripe_subscription_id: sub.id,
    stripe_customer_id: stripeCustomerId,
    user_id: userId,
    tier: "coach" as const,
    status: sub.status,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
  };

  const { error } = await admin
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) {
    console.error("[webhook] subscriptions upsert failed:", error);
  }
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[webhook] verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Never let an error bubble out: that triggers Stripe retries forever.
    console.error("[webhook] handler threw for", event.type, err);
  }

  return NextResponse.json({ received: true });
}
