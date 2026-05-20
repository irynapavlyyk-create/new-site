import type { PurchaseConfirmationContext } from "../types";
import { emailStrings } from "./strings";
import {
  SITE_URL,
  escapeAttr,
  escapeHtml,
  renderButton,
  renderFooter,
  renderHeader,
  wrapInLayout,
} from "./shared";

function renderStep(n: number, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 14px 0;">
  <tr>
    <td width="36" style="width:36px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="28" height="28" bgcolor="#F59E0B" style="width:28px;height:28px;background:#F59E0B;border-radius:9999px;text-align:center;vertical-align:middle;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;line-height:28px;">${n}</td>
        </tr>
      </table>
    </td>
    <td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:15px;line-height:1.6;">${escapeHtml(text)}</td>
  </tr>
</table>`;
}

export function renderPurchaseConfirmation(
  ctx: PurchaseConfirmationContext
): { subject: string; html: string; text: string } {
  const s = emailStrings[ctx.locale].purchaseConfirmation;

  const innerHtml = `${renderHeader()}
<p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1A1A1A;margin:0 0 8px 0;">${escapeHtml(s.greeting)}</p>
<h1 style="font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;font-weight:700;font-size:26px;line-height:1.3;margin:0 0 16px 0;">${escapeHtml(s.heading[ctx.tier])}</h1>
<p style="font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:16px;line-height:1.6;margin:0 0 24px 0;">${escapeHtml(s.intro)}</p>
<h2 style="font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;font-weight:700;font-size:18px;line-height:1.3;margin:24px 0 16px 0;">${escapeHtml(s.whatsNext)}</h2>
${renderStep(1, s.step1)}
${renderStep(2, s.step2)}
${renderStep(3, s.step3)}
${renderButton(s.ctaButton, ctx.dashboardUrl)}
<p style="font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:14px;line-height:1.6;margin:16px 0 0 0;">${escapeHtml(s.questions)} <a href="mailto:${escapeAttr(s.supportEmail)}" style="color:#F59E0B;text-decoration:underline;">${escapeHtml(s.supportEmail)}</a></p>
${renderFooter(ctx.locale)}`;

  const html = wrapInLayout(innerHtml, s.preheader);

  const text = [
    s.greeting,
    "",
    s.heading[ctx.tier],
    "",
    s.intro,
    "",
    s.whatsNext,
    `1. ${s.step1}`,
    `2. ${s.step2}`,
    `3. ${s.step3}`,
    "",
    `${s.ctaButton}: ${ctx.dashboardUrl}`,
    "",
    `${s.questions} ${s.supportEmail}`,
    "",
    "—",
    s.footerTagline,
    `${s.footerLinks.refund}: ${SITE_URL}/refund-policy`,
    `${s.footerLinks.terms}: ${SITE_URL}/terms`,
    `${s.footerLinks.privacy}: ${SITE_URL}/privacy`,
    s.footerCopyright,
  ].join("\n");

  return { subject: s.subject[ctx.tier], html, text };
}
