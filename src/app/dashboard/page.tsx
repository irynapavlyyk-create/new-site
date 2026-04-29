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

  const initialPlan = (plan?.plan_data as ProPlan | null) ?? null;
  const initialPlanTier = (plan?.tier as string | null) ?? null;

  return (
    <DashboardClient
      userEmail={user.email ?? null}
      initialPlan={initialPlan}
      initialPlanTier={initialPlanTier}
    />
  );
}
