import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return <DashboardClient userEmail={user.email ?? null} />;
}
