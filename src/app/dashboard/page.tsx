import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";
import PhenotypeDashboard from "./PhenotypeDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FixedLangProvider } from "@/lib/i18n-context";
import type { Lang, ProPlan, ProPlanV2 } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id ?? null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Preserve session_id through login so the buyer returns to THEIR plan
    // (session-scoped → forging screen until ready), not the most-recent
    // fallback. login → emailRedirectTo → /auth/callback?next=… honors this.
    const target = sessionId
      ? `/dashboard?session_id=${sessionId}`
      : "/dashboard";
    redirect(`/login?redirect=${encodeURIComponent(target)}`);
  }

  // Session-scope when arriving from a fresh purchase so the buyer sees THEIR
  // plan (and the forging screen until it lands), not a prior plan. Without a
  // session_id (returning user via the Dashboard link) fall back to their most
  // recent plan.
  let query = supabase.from("plans").select("*").eq("user_id", user.id);
  if (sessionId) query = query.eq("stripe_session_id", sessionId);

  const { data: plan, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[dashboard/page] plans fetch failed:", error);
  }

  const planData = plan?.plan_data;
  const isObjectShape = planData !== null && typeof planData === "object";
  const isV2Plan =
    isObjectShape && "phenotypeId" in (planData as Record<string, unknown>);
  const isErrorMarker =
    isObjectShape &&
    "error" in (planData as Record<string, unknown>) &&
    !("summary" in (planData as Record<string, unknown>));

  // TODO(phase-2): remove this branch when the new V2 dashboard UI ships.
  if (isV2Plan) {
    // Lock the dashboard to the plan's generation language: the AI content is
    // single-language, so the chrome must match it (legacy rows lack the column
    // → fall back to "en"). The EN/RU toggle is hidden here (it'd be a no-op).
    const planLang = (plan?.language as Lang | null) ?? "en";
    return (
      <FixedLangProvider lang={planLang}>
        <PhenotypeDashboard
          plan={planData as ProPlanV2}
          userEmail={user.email ?? null}
          planTier={(plan?.tier as string | null) ?? null}
          planCreatedAt={plan?.created_at as string}
        />
      </FixedLangProvider>
    );
  }

  // TODO(phase-2): merge into the new dashboard's error state.
  if (isErrorMarker) {
    return <GenerationErrorCard />;
  }

  // Legacy plan (or no plan at all) — fall through to the existing UI.
  // DashboardClient handles the no-plan and fromStripe forging states.
  const initialPlan = (planData as ProPlan | null) ?? null;
  const initialPlanTier = (plan?.tier as string | null) ?? null;

  return (
    <DashboardClient
      userEmail={user.email ?? null}
      initialPlan={initialPlan}
      initialPlanTier={initialPlanTier}
      sessionId={sessionId}
    />
  );
}

// TODO(phase-2.4): delete in cleanup. Kept as rollback fallback for
// PhenotypeDashboard while the new V2 UI stabilizes.
function V2Placeholder() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div className="glass p-10 max-w-lg text-center">
          <div className="text-6xl mb-6">⚡</div>
          <h1 className="h-display text-3xl sm:text-4xl mb-4">
            <span className="gradient-text">Your protocol is being prepared</span>
          </h1>
          <p className="text-muted leading-relaxed">
            We&apos;re launching a redesigned dashboard in the next few days.
            You&apos;ll see your full personalized plan when it&apos;s ready.
            Thank you for your patience.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

// TODO(phase-2): delete or merge with new dashboard error states.
function GenerationErrorCard() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
        <div className="glass p-10 max-w-lg text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="h-display text-2xl sm:text-3xl mb-4">
            <span className="gradient-text">Something went wrong</span>
          </h1>
          <p className="text-muted leading-relaxed mb-6">
            Your plan didn&apos;t generate correctly. Retake the quiz to try again.
          </p>
          <Link href="/quiz" className="btn-primary">
            Retake quiz
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
