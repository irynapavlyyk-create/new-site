"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const { lang } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
      style={{
        border: "1px solid rgba(255, 107, 53, 0.3)",
        background: "rgba(255, 107, 53, 0.08)",
        color: "rgb(var(--orange))",
      }}
    >
      <span aria-hidden="true">🚪</span>
      <span>{pick(t.nav.signOut, lang)}</span>
    </button>
  );
}
