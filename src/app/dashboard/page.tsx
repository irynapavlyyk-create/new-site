import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";
import type { ProPlan } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: plans, error } = await supabase
    .from("plans")
    .select("tier, plan_data, language, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[dashboard/page] plans fetch failed:", error);
  }

  const latest = plans?.[0] ?? null;
  const initialPlan = (latest?.plan_data as ProPlan | null) ?? null;
  const initialPlanTier = (latest?.tier as string | null) ?? null;

  return (
    <DashboardClient
      userEmail={user.email ?? null}
      initialPlan={initialPlan}
      initialPlanTier={initialPlanTier}
    />
  );
}
