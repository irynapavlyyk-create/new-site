import type {
  EmailSendResult,
  PlanReadyContext,
  PurchaseConfirmationContext,
} from "./types";
import { getEmailFrom, getEmailReplyTo, getResendClient } from "./client";
import { renderPlanReady } from "./templates/plan-ready";
import { renderPurchaseConfirmation } from "./templates/purchase-confirmation";

// Best-effort transactional email send. Never throws — webhook and plan
// generation must continue even if Resend is down, rate-limited, or the API
// key is missing. Caller inspects { success, id, error } if needed.
async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<EmailSendResult> {
  console.log(`[email] Sending: to=${input.to} subject="${input.subject}"`);

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: getEmailFrom(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: getEmailReplyTo(),
    });

    if (result.error) {
      console.error(`[email] Resend error: ${result.error.message}`);
      return { success: false, error: result.error.message };
    }

    const id = result.data?.id;
    console.log(`[email] Sent: id=${id} to=${input.to}`);
    return { success: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[email] Exception: ${msg}`);
    return { success: false, error: msg };
  }
}

export async function sendPurchaseConfirmation(
  ctx: PurchaseConfirmationContext
): Promise<EmailSendResult> {
  const rendered = renderPurchaseConfirmation(ctx);
  return sendEmail({
    to: ctx.to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

export async function sendPlanReady(
  ctx: PlanReadyContext
): Promise<EmailSendResult> {
  const rendered = renderPlanReady(ctx);
  return sendEmail({
    to: ctx.to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
