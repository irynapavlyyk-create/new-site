import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
      const redirect = new URL("/login", url.origin);
      redirect.searchParams.set("error", "oauth_failed");
      return NextResponse.redirect(redirect);
    }
  }

  const redirect = new URL(next.startsWith("/") ? next : "/dashboard", url.origin);
  return NextResponse.redirect(redirect);
}
