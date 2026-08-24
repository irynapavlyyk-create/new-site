"use client";

import { useState } from "react";
import { t, pick } from "@/lib/translations";
import type { Lang } from "@/types";

/**
 * Retry CTA for the generation-error card. Calls POST /api/plan/regenerate
 * for the (session-scoped) plan; on 202 sends the user to the session-scoped
 * dashboard, where the pending row shows the forging screen and plan-status
 * polling picks up the result.
 */
export default function RegenerateButton({
  lang,
  sessionId,
}: {
  lang: Lang;
  sessionId: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onClick() {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/plan/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionId ? { session_id: sessionId } : {}),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        session_id?: string;
        error?: string;
      };
      // 202 started, or 409 in_progress — either way the forging screen is
      // the right place to land.
      if (res.status === 202 || data.error === "in_progress") {
        const sid = data.session_id ?? sessionId;
        window.location.assign(sid ? `/dashboard?session_id=${encodeURIComponent(sid)}` : "/dashboard");
        return;
      }
      setFailed(true);
      setBusy(false);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={onClick} disabled={busy} className="btn-primary disabled:opacity-60">
        {busy ? pick(t.dashboard.forging, lang) : pick(t.dashboard.retryGen, lang)}
      </button>
      {failed ? (
        <p className="text-sm text-muted">{pick(t.dashboard.regenFailed, lang)}</p>
      ) : null}
    </div>
  );
}
