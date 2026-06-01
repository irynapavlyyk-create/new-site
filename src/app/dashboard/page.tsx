import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";
import PhenotypeDashboard from "./PhenotypeDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ProPlan, ProPlanV2 } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const fromStripe = Boolean(params.session_id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
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
    return (
      <PhenotypeDashboard
        plan={planData as ProPlanV2}
        userEmail={user.email ?? null}
        planTier={(plan?.tier as string | null) ?? null}
        planCreatedAt={plan?.created_at as string}
      />
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
      fromStripe={fromStripe}
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
