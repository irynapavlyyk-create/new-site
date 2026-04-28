"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import AuthLayout from "@/components/AuthLayout";

export default function ClickToLoginPage() {
  return (
    <Suspense fallback={null}>
      <ClickToLogin />
    </Suspense>
  );
}

function isSafeNext(raw: string): boolean {
  // Defeats open-redirect: only allow same-origin destinations or the
  // configured Supabase verify host. Anything else (including //evil.com
  // and relative protocol tricks) is rejected.
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (typeof window !== "undefined" && parsed.origin === window.location.origin) {
    return true;
  }
  if (supabaseUrl) {
    try {
      const allowed = new URL(supabaseUrl);
      if (parsed.host === allowed.host) return true;
    } catch {
      // ignore — fall through to reject
    }
  }
  return false;
}

function ClickToLogin() {
  const { lang } = useI18n();
  const params = useSearchParams();
  const next = params.get("next") || "";

  const target = useMemo(() => {
    if (!next) return null;
    let decoded: string;
    try {
      decoded = decodeURIComponent(next);
    } catch {
      return null;
    }
    return isSafeNext(decoded) ? decoded : null;
  }, [next]);

  if (!target) {
    return (
      <AuthLayout title={pick(t.auth.clickToLoginTitle, lang)}>
        <div className="auth-error mb-4">
          {pick(t.auth.clickToLoginInvalid, lang)}
        </div>
        <Link href="/login" className="btn-primary w-full justify-center">
          {pick(t.auth.signIn, lang)}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={pick(t.auth.clickToLoginTitle, lang)}
      subtitle={pick(t.auth.clickToLoginSubtitle, lang)}
    >
      <button
        type="button"
        onClick={() => {
          window.location.href = target;
        }}
        className="btn-primary w-full justify-center"
      >
        {pick(t.auth.clickToLoginButton, lang)}
      </button>
    </AuthLayout>
  );
}
