import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

function normalizeErrorCode(raw: string): string {
  // Supabase uses "otp_expired" for expired magic links — map to a
  // user-friendly code that /login understands.
  if (raw === "otp_expired") return "link_expired";
  return raw;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");
  const errorCodeParam = url.searchParams.get("error_code");
  const next = url.searchParams.get("next") || "/dashboard";

  // Supabase sometimes returns auth errors as query params (e.g. PKCE flow).
  // Catch them here before we try to exchange the (non-existent) code.
  if (errorParam || errorCodeParam) {
    const raw = errorCodeParam || errorParam || "access_denied";
    console.error(
      "[auth/callback] provider returned error:",
      { errorParam, errorCodeParam }
    );
    const redirect = new URL("/login", url.origin);
    redirect.searchParams.set("error", normalizeErrorCode(raw));
    return NextResponse.redirect(redirect);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
      const redirect = new URL("/login", url.origin);
      const msg = (error.message || "").toLowerCase();
      const code = msg.includes("expired") ? "link_expired" : "oauth_failed";
      redirect.searchParams.set("error", code);
      return NextResponse.redirect(redirect);
    }
  }

  const redirect = new URL(next.startsWith("/") ? next : "/dashboard", url.origin);
  return NextResponse.redirect(redirect);
}
