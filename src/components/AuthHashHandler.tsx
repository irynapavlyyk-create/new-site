"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    const supabase = createClient();
    supabase.auth
      .setSession({
        access_token,
        refresh_token,
      })
      .then(({ error }) => {
        if (error) {
          console.error("[AuthHashHandler] setSession error:", error);
          window.history.replaceState(null, "", window.location.pathname);
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        router.push("/dashboard");
      });
  }, [router]);

  return null;
}
