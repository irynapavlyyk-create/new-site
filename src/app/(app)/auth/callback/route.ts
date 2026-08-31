import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

function normalizeErrorCode(raw: string): string {
  // Supabase uses "otp_expired" for expired magic links — map to a
  // user-friendly code that /login understands.
  if (raw === "otp_expired") return "link_expired";
  return raw;
}

// Defeats open redirect (same approach as click-to-login's isSafeNext):
// `next.startsWith("/")` let protocol-relative "//evil.com" through, and
// new URL("//evil.com", origin) resolves to an EXTERNAL address — a link on
// our domain becoming a phishing redirect. Resolve against origin and accept
// only a same-origin result; anything else falls back to /dashboard.
function resolveNext(raw: string | null, origin: string): URL {
  const fallback = new URL("/dashboard", origin);
  if (!raw) return fallback;
  let resolved: URL;
  try {
    resolved = new URL(raw, origin);
  } catch {
    return fallback;
  }
  return resolved.origin === origin ? resolved : fallback;
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

  // No code at all: nothing to exchange, so the visitor has no business being
  // forwarded along `next` — send them to sign in instead of bouncing an
  // unauthenticated request around the app.
  if (!code) {
    console.warn("[auth/callback] request without code — redirecting to /login");
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
    const redirect = new URL("/login", url.origin);
    const msg = (error.message || "").toLowerCase();
    const errCode = msg.includes("expired") ? "link_expired" : "oauth_failed";
    redirect.searchParams.set("error", errCode);
    return NextResponse.redirect(redirect);
  }

  return NextResponse.redirect(resolveNext(next, url.origin));
}
