import { getEmailFrom, getResendClient } from "@/lib/emails/client";

export const ALERT_TO = process.env.ALERT_EMAIL_TO ?? "support@energyforge.app";

export type PaidPathStage =
  | "generation_failed"
  | "plan_insert_failed"
  | "plan_update_failed"
  | "profile_upsert_failed";

export type PaidPathAlert = {
  stage: PaidPathStage;
  sessionId: string | null;
  userId: string | null;
  error: string;
  detail?: unknown;
};

function stringifyDetail(detail: unknown): string {
  if (detail == null) return "";
  if (typeof detail === "string") return detail;
  if (detail instanceof Error) return `${detail.name}: ${detail.message}\n${detail.stack ?? ""}`;
  try {
    return JSON.stringify(detail, null, 2);
  } catch {
    return String(detail);
  }
}

/**
 * Email support about a failure in the paid path (payment confirmed, plan
 * not delivered). Fire-and-forget: this NEVER throws and never rejects — a
 * broken alert channel must not be able to break the webhook handler.
 */
export async function alertPaidPathFailure(alert: PaidPathAlert): Promise<void> {
  const subject = `[EnergyForge] paid path failure: ${alert.stage} (${alert.sessionId ?? "no session"})`;
  const detail = stringifyDetail(alert.detail).slice(0, 8000);
  const text = [
    `Stage:      ${alert.stage}`,
    `Session id: ${alert.sessionId ?? "-"}`,
    `User id:    ${alert.userId ?? "-"}`,
    `Error:      ${alert.error}`,
    `Time:       ${new Date().toISOString()}`,
    `Env:        ${process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown"}`,
    "",
    "Detail:",
    detail || "(none)",
  ].join("\n");

  console.error("[alert] paid path failure", {
    stage: alert.stage,
    sessionId: alert.sessionId,
    userId: alert.userId,
    error: alert.error,
  });

  try {
    const resend = getResendClient(); // throws if RESEND_API_KEY missing — caught below
    const result = await resend.emails.send(
      {
        from: getEmailFrom(),
        to: ALERT_TO,
        subject,
        text,
      },
      // One alert per (session, stage) even if the handler is replayed.
      alert.sessionId
        ? { idempotencyKey: `alert:${alert.stage}:${alert.sessionId}` }
        : undefined
    );
    if (result.error) {
      console.error("[alert] Resend error:", result.error.message);
    } else {
      console.log("[alert] sent", { id: result.data?.id, stage: alert.stage });
    }
  } catch (err) {
    console.error("[alert] failed to send:", err instanceof Error ? err.message : String(err));
  }
}
