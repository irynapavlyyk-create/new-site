import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { waitUntil } from "@vercel/functions";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateAndSavePlan } from "@/lib/generatePlan";
import type { QuizAnswers } from "@/types";

export const runtime = "nodejs";
// Webhook itself returns 200 in <5s. The remainder runs under waitUntil()
// for up to 5 minutes, which covers the slow generatePlan path (50-80s)
// plus margin. The 60s default was killing background work mid-generation.
export const maxDuration = 300;

type Tier = "pro" | "coach";

function tierFromAmount(amount: number | null | undefined): Tier | null {
  if (amount == null) return null;
  if (amount === 999) return "pro";
  if (amount === 2499) return "coach";
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

// Real email delivery: signInWithOtp uses the configured SMTP (Resend).
// admin.auth.admin.generateLink only produces a link — it does NOT send mail.
async function sendMagicLinkEmail(email: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.energyforge.app";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    console.error("[webhook] magic link: missing Supabase env vars");
    return;
  }

  const supabase = createClient(url, anonKey);
  console.log("[webhook] sending magic link via signInWithOtp to", email);
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      console.error("[webhook] signInWithOtp failed:", error);
    } else {
      console.log("[webhook] signInWithOtp ok — email queued to", email);
    }
  } catch (err) {
    console.error("[webhook] signInWithOtp threw:", err);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email || null;
  const metadata = session.metadata || {};
  const metadataUserId = metadata.user_id || "anonymous";
  // Normalize whitespace/case before comparing — defensive against any
  // upstream serialization that might mangle "ru" into " ru\n" or "RU".
  // Prefer canonical `language` key; `lang` is a legacy fallback from older
  // checkout sessions that only set the short key.
  const langRaw = (metadata.language ?? metadata.lang ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const language: "en" | "ru" = langRaw === "ru" ? "ru" : "en";
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;
  const sessionId = session.id;
  const tier =
    (metadata.tier as Tier | undefined) || tierFromAmount(session.amount_total);

  console.log("[webhook] checkout session started", {
    sessionId,
    email,
    tier,
    metadataUserId,
    amount: session.amount_total,
    mode: session.mode,
    metadataLanguage: metadata.language ?? null,
    metadataLang: metadata.lang ?? null,
    resolvedLanguage: language,
  });

  if (!tier) {
    console.error("[webhook] could not determine tier", sessionId);
    return;
  }
  if (!email) {
    console.error("[webhook] no email in session", sessionId);
    return;
  }

  const admin = createAdminClient();

  // Idempotency: reuse user_id from prior insert if we already processed this session.
  const { data: existingPlan } = await admin
    .from("plans")
    .select("id, user_id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  console.log("[webhook] plan exists for session?", !!existingPlan);

  // Always resolve user — needed both for plan work and for magic link on retry.
  let userId: string | null = (existingPlan?.user_id as string | null) ?? null;
  let isNewUser = false;

  if (!userId) {
    if (metadataUserId && metadataUserId !== "anonymous") {
      userId = metadataUserId;
    } else {
      const { data: profileRow } = await admin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (profileRow?.id) {
        userId = profileRow.id as string;
      } else {
        try {
          const { data: listed } = await admin.auth.admin.listUsers();
          const found = listed?.users?.find(
            (u) => (u.email || "").toLowerCase() === email.toLowerCase()
          );
          if (found) userId = found.id;
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
  }

  if (!userId) {
    console.error("[webhook] could not resolve userId for", email);
    return;
  }

  console.log("[webhook] user resolved", { userId, isNewUser });

  // Profile upsert is fast (<200ms) and idempotent — run it before the magic
  // link so the user has a profile row by the time they click through.
  if (!existingPlan) {
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
  }

  // Magic link goes out BEFORE the slow plan generation path. Sits outside the
  // existingPlan gate so a retry still triggers a send. Supabase rate-limits
  // duplicates per email, so a healthy retry is a no-op rather than a dupe.
  const shouldSendMagicLink = isNewUser || metadataUserId === "anonymous";
  console.log("[webhook] should send magic link?", shouldSendMagicLink);
  if (shouldSendMagicLink) {
    await sendMagicLinkEmail(email);
  }

  // Plan generation: 50-80s. Runs after the magic link is queued so the user
  // already has the email by the time their plan finishes generating.
  if (!existingPlan) {
    const answers = parseAnswersFromMetadata(metadata);
    if (answers) {
      await generateAndSavePlan({
        userId,
        sessionId,
        answers,
        lang: language,
        tier,
      });
    } else {
      console.warn(
        "[webhook] no answers in metadata — inserting empty plan row for idempotency",
        sessionId
      );
      try {
        const { error: planErr } = await admin.from("plans").insert({
          user_id: userId,
          tier,
          answers: {},
          plan_data: {},
          language,
          stripe_session_id: sessionId,
        });
        if (planErr) {
          console.error("[webhook] plans insert failed:", planErr);
        }
      } catch (err) {
        console.error("[webhook] plans insert threw:", err);
      }
    }
  } else {
    console.log("[webhook] plan already exists — skipping generation");
  }

  console.log("[webhook] done processing session", sessionId);
}

async function handleSubscriptionEvent(sub: Stripe.Subscription) {
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const admin = createAdminClient();

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

async function processEventAsync(event: Stripe.Event) {
  console.log("[webhook] processing event:", event.type, event.id);
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] handler threw for", event.type, event.id, err);
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

  waitUntil(processEventAsync(event));

  return NextResponse.json({ received: true });
}
