import type { PlanReadyContext } from "../types";
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

const PREVIEW_MAX_LEN = 200;

function truncatePreview(s: string): string {
  if (s.length <= PREVIEW_MAX_LEN) return s;
  return s.slice(0, PREVIEW_MAX_LEN).trimEnd() + "…";
}

function renderBullet(text: string): string {
  return `<p style="font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;font-size:15px;line-height:1.6;margin:0 0 10px 0;">${escapeHtml(text)}</p>`;
}

export function renderPlanReady(
  ctx: PlanReadyContext
): { subject: string; html: string; text: string } {
  const s = emailStrings[ctx.locale].planReady;
  const preview = truncatePreview(ctx.planPreview);

  const innerHtml = `${renderHeader()}
<p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1A1A1A;margin:0 0 8px 0;">${escapeHtml(s.greeting)}</p>
<h1 style="font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;font-weight:700;font-size:26px;line-height:1.3;margin:0 0 16px 0;">${escapeHtml(s.heading)}</h1>
<p style="font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:16px;line-height:1.6;margin:0 0 20px 0;">${escapeHtml(s.intro)}</p>
<div style="margin:0 0 24px 0;padding:20px;background:#F8F8F5;border:1px solid #E5E5E0;border-radius:8px;">
  <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#999999;letter-spacing:0.05em;text-transform:uppercase;margin:0 0 8px 0;">${escapeHtml(s.previewLabel)}</p>
  <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#555555;font-size:15px;line-height:1.6;margin:0;">&ldquo;${escapeHtml(preview)}&rdquo;</p>
</div>
<h2 style="font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;font-weight:700;font-size:18px;line-height:1.3;margin:24px 0 16px 0;">${escapeHtml(s.whatsInside)}</h2>
${renderBullet(s.bullet1)}
${renderBullet(s.bullet2)}
${renderBullet(s.bullet3)}
${renderBullet(s.bullet4)}
${renderButton(s.ctaButton, ctx.dashboardUrl)}
<p style="font-family:Arial,Helvetica,sans-serif;color:#999999;font-size:13px;line-height:1.6;margin:8px 0 0 0;">${escapeHtml(s.saveTip)}</p>
<p style="font-family:Arial,Helvetica,sans-serif;color:#555555;font-size:14px;line-height:1.6;margin:16px 0 0 0;">${escapeHtml(s.questions)} <a href="mailto:${escapeAttr(s.supportEmail)}" style="color:#F59E0B;text-decoration:underline;">${escapeHtml(s.supportEmail)}</a></p>
${renderFooter(ctx.locale)}`;

  const html = wrapInLayout(innerHtml, s.preheader);

  const text = [
    s.greeting,
    "",
    s.heading,
    "",
    s.intro,
    "",
    `${s.previewLabel}`,
    `"${preview}"`,
    "",
    s.whatsInside,
    `- ${s.bullet1}`,
    `- ${s.bullet2}`,
    `- ${s.bullet3}`,
    `- ${s.bullet4}`,
    "",
    `${s.ctaButton}: ${ctx.dashboardUrl}`,
    "",
    s.saveTip,
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

  return { subject: s.subject, html, text };
}
