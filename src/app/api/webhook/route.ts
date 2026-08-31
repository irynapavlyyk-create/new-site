import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { waitUntil } from "@vercel/functions";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateAndSavePlan } from "@/lib/generatePlan";
import { classifyPlanData, isPendingStale } from "@/lib/planState";
import { alertPaidPathFailure } from "@/lib/alerts";
import { sendPurchaseConfirmation } from "@/lib/emails/send";
import { captureServerEvent } from "@/lib/posthog-server";
import type { Lang, QuizAnswers } from "@/types";

export const runtime = "nodejs";
// Webhook itself returns 200 in <5s. The remainder runs under waitUntil()
// for up to 5 minutes, which covers the slow generatePlan path (50-80s)
// plus margin. The 60s default was killing background work mid-generation.
export const maxDuration = 300;

type Tier = "pro" | "coach";

function tierFromAmount(amount: number | null | undefined): Tier | null {
  if (amount == null) return null;
  // Exact known prices first — regular AND launch-promo amounts (in cents).
  // 499/1249 are historical promo amounts (June–July 2026 launch), kept for
  // webhook replays: Stripe can resend old events, and without the 1249 match
  // the `<= 1500` heuristic below would misclassify a replayed Coach promo
  // session as "pro".
  if (amount === 999 || amount === 499) return "pro"; // €9.99 / €4.99
  if (amount === 2499 || amount === 1249) return "coach"; // €24.99 / €12.49
  if (amount <= 1500) return "pro";
  // Unknown amount above the PRO band: do NOT guess "coach". Coach is off
  // sale and a wrong guess would write a subscription-tier plan for a
  // one-off payment. null → caller logs, alerts support, and stops.
  return null;
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

type ResolvedUser = { userId: string | null; isNewUser: boolean };

// Emails are case-insensitive in practice and GoTrue stores them lowercased.
// Normalize once so every comparison and write (profiles, auth, Resend) agrees.
function normalizeEmail(raw: string | null | undefined): string | null {
  const email = (raw ?? "").trim().toLowerCase();
  return email || null;
}

// Escape LIKE wildcards so an address like "a_b@x.com" can't match
// "aXb@x.com" through .ilike().
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

// Find an existing auth user by email. GoTrue paginates listUsers (50 per
// page by default) — the old unpaginated call went blind past the first page,
// so an existing customer buying anonymously got a duplicate createUser that
// died on "already registered". supabase-js v2 admin API has no direct
// email lookup, so page explicitly. Throws on API error so POST() answers
// 500 and Stripe redelivers.
//
// TEMPORARY: this runs synchronously in POST() before the ack, and Stripe
// treats a delivery as failed after ~10 s without a response. A full scan at
// 1000/page is fast today, but as the user base grows it will eat that budget.
// Replace it then with a direct email lookup against auth.users via the
// service-role client (e.g. an RPC / view over auth.users filtered by
// lower(email)) instead of paging the admin API.
async function findUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  const perPage = 1000;
  // Hard cap so a misbehaving API can't loop forever (200 pages = 200k users).
  for (let page = 1; page <= 200; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`listUsers page ${page} failed: ${error.message}`);
    const users = data?.users ?? [];
    const found = users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (found) return found.id;
    if (users.length < perPage) return null;
  }
  return null;
}

// Runs synchronously in POST(), BEFORE the 200 ack: any throw here becomes a
// 500 and Stripe redelivers the event. Previously this lived inside the
// waitUntil handler, where a lookup/create failure silently dropped a paid
// session — no plan, no magic link, no alert.
async function resolveUser(
  session: Stripe.Checkout.Session,
  existingUserId: string | null
): Promise<ResolvedUser> {
  if (existingUserId) return { userId: existingUserId, isNewUser: false };

  const metadataUserId = session.metadata?.user_id;
  if (metadataUserId && metadataUserId !== "anonymous") {
    return { userId: metadataUserId, isNewUser: false };
  }

  const email = normalizeEmail(
    session.customer_details?.email || session.customer_email
  );
  // No email at all → nothing to resolve against; the handler alerts support.
  if (!email) return { userId: null, isNewUser: false };

  const admin = createAdminClient();

  // profiles first (one indexed query). ilike is case-insensitive on both
  // sides — .eq was case-sensitive and missed rows stored with different case.
  const { data: profileRow, error: profileErr } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", escapeLikePattern(email))
    .limit(1)
    .maybeSingle();
  if (profileErr) throw new Error(`profiles lookup failed: ${profileErr.message}`);
  if (profileRow?.id) return { userId: profileRow.id as string, isNewUser: false };

  const foundId = await findUserIdByEmail(admin, email);
  if (foundId) return { userId: foundId, isNewUser: false };

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr || !created?.user) {
    throw new Error(`createUser failed: ${createErr?.message ?? "no user returned"}`);
  }
  return { userId: created.user.id, isNewUser: true };
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  resolved: ResolvedUser
) {
  const email = normalizeEmail(
    session.customer_details?.email || session.customer_email
  );
  const metadata = session.metadata || {};
  const metadataUserId = metadata.user_id || "anonymous";
  // Normalize whitespace/case before comparing — defensive against any
  // upstream serialization that might mangle "cs" into " cs\n" or "CS".
  // Prefer canonical `language` key; `lang` is a legacy fallback from older
  // checkout sessions that only set the short key.
  const langRaw = (metadata.language ?? metadata.lang ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const language: Lang = langRaw === "cs" ? "cs" : "en";
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
    paymentStatus: session.payment_status,
  });

  // POST() only forwards paid sessions, but keep the invariant local too:
  // nothing is ever delivered for a session whose money hasn't arrived.
  if (session.payment_status !== "paid") {
    console.warn(
      "[webhook] session not paid — skipping delivery",
      sessionId,
      session.payment_status
    );
    return;
  }

  if (!tier) {
    // Payment succeeded but we can't tell what was bought — no plan will be
    // generated, so support must hear about it.
    console.error("[webhook] could not determine tier", sessionId, {
      amount: session.amount_total,
      metadataTier: metadata.tier ?? null,
    });
    await alertPaidPathFailure({
      stage: "tier_unresolved",
      sessionId,
      userId: metadataUserId !== "anonymous" ? metadataUserId : null,
      error: "could not determine tier",
      detail: { amount: session.amount_total, currency: session.currency, metadata },
    });
    return;
  }
  if (!email) {
    // Paid session we cannot deliver to — support must hear about it instead
    // of the old silent return.
    console.error("[webhook] no email in session", sessionId);
    await alertPaidPathFailure({
      stage: "user_resolve_failed",
      sessionId,
      userId: metadataUserId !== "anonymous" ? metadataUserId : null,
      error: "no email in checkout session",
      detail: { metadata },
    });
    return;
  }

  const admin = createAdminClient();

  // Idempotency: reuse user_id from prior insert if we already processed this session.
  // Since the row is reserved (pending marker) BEFORE generation, a duplicate
  // Stripe event arriving mid-generation finds it and skips — no double spend.
  // A pending row older than PENDING_STALE_MS means the instance died; a retry
  // re-claims that row and regenerates into it rather than inserting a second.
  const { data: existingPlan, error: existingErr } = await admin
    .from("plans")
    .select("id, user_id, plan_data")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (existingErr) {
    // Without this answer we cannot tell whether the session was already
    // processed; continuing would risk a second paid generation. POST() has
    // already refused the event with 500 in this case so Stripe retries —
    // this branch only guards the race where the DB failed between the two
    // lookups. Bail out and let the retry handle it.
    console.error("[webhook] existing-plan lookup failed — aborting, Stripe will retry:", existingErr);
    return;
  }
  const stalePending = !!existingPlan && isPendingStale(existingPlan.plan_data);
  console.log("[webhook] plan exists for session?", !!existingPlan, {
    kind: existingPlan ? classifyPlanData(existingPlan.plan_data) : null,
    stalePending,
  });

  // User was resolved synchronously in POST() (existing row → metadata →
  // profiles → paged listUsers → createUser); a failure there already
  // answered 500, so Stripe retries instead of this handler dropping the sale.
  const userId: string | null =
    (existingPlan?.user_id as string | null) ?? resolved.userId;
  const isNewUser = resolved.isNewUser;

  if (!userId) {
    console.error("[webhook] could not resolve userId for", email);
    await alertPaidPathFailure({
      stage: "user_resolve_failed",
      sessionId,
      userId: null,
      error: "no user could be resolved for a paid session",
      detail: { email, metadataUserId },
    });
    return;
  }

  console.log("[webhook] user resolved", { userId, isNewUser });

  // Funnel (server-side): attribute the successful purchase to the PostHog
  // person who clicked buy. distinct_id comes from Stripe metadata (set at
  // checkout); fall back to the resolved user id, then email. Gated on
  // !existingPlan so Stripe webhook retries don't double-count purchases.
  if (!existingPlan) {
    await captureServerEvent({
      distinctId: metadata.posthog_distinct_id || userId || email,
      event: "purchase_completed",
      properties: {
        plan: tier === "coach" ? "Coach" : "PRO",
        amount: session.amount_total,
        currency: session.currency,
        tier,
      },
    });
  }

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
        await alertPaidPathFailure({
          stage: "profile_upsert_failed",
          sessionId,
          userId,
          error: upsertErr.message,
          detail: { upsertErr, profileUpdate },
        });
      }
    } catch (err) {
      console.error("[webhook] profile upsert threw:", err);
      await alertPaidPathFailure({
        stage: "profile_upsert_failed",
        sessionId,
        userId,
        error: err instanceof Error ? err.message : String(err),
        detail: err,
      });
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

  // Send branded purchase confirmation email (best-effort, never blocks webhook)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.energyforge.app";
  const purchaseEmailResult = await sendPurchaseConfirmation(
    {
      to: email,
      locale: language,
      tier,
      // Land the buyer on THEIR plan (session-scoped → forging screen until it
      // lands), not the most-recent-by-user fallback. Bare /dashboard if absent.
      dashboardUrl: sessionId
        ? `${siteUrl}/dashboard?session_id=${sessionId}`
        : `${siteUrl}/dashboard`,
    },
    `purchase-confirmation:${sessionId}`
  );
  if (purchaseEmailResult.success) {
    console.log(`[webhook] Purchase confirmation email sent: id=${purchaseEmailResult.id} to=${email}`);
  } else {
    console.error(`[webhook] Purchase confirmation email failed: ${purchaseEmailResult.error} to=${email}`);
  }

  // Plan generation: 50-80s. Runs after the magic link is queued so the user
  // already has the email by the time their plan finishes generating.
  if (!existingPlan || stalePending) {
    const answers = parseAnswersFromMetadata(metadata);
    if (answers) {
      await generateAndSavePlan({
        userId,
        sessionId,
        answers,
        lang: language,
        tier,
        existingPlanId: stalePending ? (existingPlan?.id as string) : null,
      });
    } else {
      // Paid session with no quiz answers anywhere — generation is impossible.
      // Write an explicit error marker, never {}: an empty object used to
      // classify as a ready v1 plan, trapping the buyer in a reload loop
      // while regenerate answered 409 has_plan. The error marker renders the
      // error screen and regenerate accepts the row (it will answer 422
      // no_answers, which is the truth — support has to resolve this one).
      const marker = {
        error: "answers_missing",
        detail: "no quiz answers in Stripe metadata",
        failed_at: new Date().toISOString(),
      };
      if (existingPlan) {
        console.error(
          "[webhook] stale pending row but no answers in metadata — marking as error",
          sessionId
        );
        const { error: updErr } = await admin
          .from("plans")
          .update({ plan_data: marker })
          .eq("id", existingPlan.id);
        if (updErr) {
          console.error("[webhook] error-marker update failed:", updErr);
        }
      } else {
        console.error(
          "[webhook] no answers in metadata — inserting error-marker row",
          sessionId
        );
        try {
          const { error: planErr } = await admin.from("plans").insert({
            user_id: userId,
            tier,
            answers: {},
            plan_data: marker,
            language,
            stripe_session_id: sessionId,
          });
          if (planErr) {
            if (planErr.code === "23505") {
              // plans_stripe_session_id_key: a concurrent delivery of the
              // same session already inserted the row — benign, nothing lost.
              console.log("[webhook] error-marker row already exists (concurrent delivery)", sessionId);
            } else {
              console.error("[webhook] plans insert failed:", planErr);
            }
          }
        } catch (err) {
          console.error("[webhook] plans insert threw:", err);
        }
      }
      await alertPaidPathFailure({
        stage: "answers_missing",
        sessionId,
        userId,
        error: "paid session has no quiz answers in metadata",
        detail: { metadataKeys: Object.keys(metadata) },
      });
    }
  } else {
    console.log("[webhook] plan already exists — skipping generation");
  }

  console.log("[webhook] done processing session", sessionId);
}

// A delayed-notification payment ultimately failed: the money never arrived.
// Nothing was delivered (the paid gate saw payment_status "unpaid"), so this
// only makes sure any row for the session can't read as pending or ready.
async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  const sessionId = session.id;
  const admin = createAdminClient();

  const { data: row, error } = await admin
    .from("plans")
    .select("id, plan_data")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error) {
    console.error("[webhook] async_payment_failed lookup failed:", error, { sessionId });
    return;
  }
  if (!row) {
    console.log("[webhook] async_payment_failed — no plan row, nothing to mark", sessionId);
    return;
  }

  const kind = classifyPlanData(row.plan_data);
  if (kind === "v1" || kind === "v2") {
    // Should be impossible with the paid gate: a real plan was delivered for
    // money that never arrived. Support needs to see this one.
    console.error("[webhook] async_payment_failed but a plan already exists", sessionId);
    await alertPaidPathFailure({
      stage: "payment_failed_after_delivery",
      sessionId,
      userId: null,
      error: "async payment failed but a plan was already delivered",
      detail: { kind },
    });
    return;
  }

  const { error: updErr } = await admin
    .from("plans")
    .update({
      plan_data: {
        error: "payment_failed",
        detail: "checkout.session.async_payment_failed",
        failed_at: new Date().toISOString(),
      },
    })
    .eq("id", row.id);
  if (updErr) {
    console.error("[webhook] payment-failed marker update failed:", updErr, { sessionId });
  } else {
    console.log("[webhook] marked session as unpaid", sessionId);
  }
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

async function processEventAsync(event: Stripe.Event, resolved?: ResolvedUser) {
  console.log("[webhook] processing event:", event.type, event.id);
  try {
    switch (event.type) {
      // Both deliver the plan: `completed` for instant methods (cards),
      // `async_payment_succeeded` for delayed ones (bank transfer & co) whose
      // `completed` arrived earlier with payment_status "unpaid" and was
      // acknowledged without processing.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
          resolved ?? { userId: null, isNewUser: false }
        );
        break;
      case "checkout.session.async_payment_failed":
        await handleAsyncPaymentFailed(
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

  const isCheckoutDelivery =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded";

  let resolvedUser: ResolvedUser | undefined;
  if (isCheckoutDelivery) {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    // Deliver only once the money has actually arrived. Delayed-notification
    // methods fire `completed` with payment_status "unpaid" — acknowledge and
    // drop it; the plan work happens when (if) async_payment_succeeded lands,
    // and async_payment_failed marks the row instead.
    if (session.payment_status !== "paid") {
      console.log(
        "[webhook] checkout event ignored — payment_status:",
        session.payment_status,
        sessionId
      );
      return NextResponse.json({ received: true });
    }

    // Idempotency gate must be answered BEFORE we acknowledge: once we return
    // 200 Stripe never retries, and the handler runs under waitUntil where a
    // failed existing-plan lookup would otherwise fall through to a second
    // paid generation. A 500 here makes Stripe redeliver the event.
    let existingUserId: string | null = null;
    try {
      const { data: existing, error } = await createAdminClient()
        .from("plans")
        .select("id, user_id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (error) {
        console.error("[webhook] pre-check plans lookup failed — returning 500 for Stripe retry:", error, { sessionId });
        return NextResponse.json({ error: "db unavailable" }, { status: 500 });
      }
      existingUserId = (existing?.user_id as string | null) ?? null;
    } catch (err) {
      console.error("[webhook] pre-check threw — returning 500 for Stripe retry:", err, { sessionId });
      return NextResponse.json({ error: "db unavailable" }, { status: 500 });
    }

    // User resolution also runs before the ack, for the same reason: a
    // failure here (listUsers down, a createUser "already registered" race)
    // must 500 → Stripe redelivers — not silently drop a paid session.
    try {
      resolvedUser = await resolveUser(session, existingUserId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[webhook] user resolution failed — returning 500 for Stripe retry:", err, { sessionId });
      await alertPaidPathFailure({
        stage: "user_resolve_failed",
        sessionId,
        userId: null,
        error: msg,
        detail: err,
      });
      return NextResponse.json({ error: "user resolution failed" }, { status: 500 });
    }
  }

  waitUntil(processEventAsync(event, resolvedUser));

  return NextResponse.json({ received: true });
}
