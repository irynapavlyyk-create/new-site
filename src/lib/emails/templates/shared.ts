import type { Lang } from "../types";

export const SITE_URL = "https://www.energyforge.app";

// VS-15 (U+FE0E) after the bolt forces text presentation so the CSS `color`
// actually paints it white instead of falling back to the platform emoji glyph.
const BOLT_TEXT = "⚡︎";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function renderPreheader(text: string): string {
  return `<div style="display:none;font-size:1px;color:#FAFAF8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}</div>`;
}

export function renderHeader(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
  <tr>
    <td style="vertical-align:middle;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40" height="40" bgcolor="#F59E0B" style="width:40px;height:40px;background:#F59E0B;border-radius:8px;text-align:center;vertical-align:middle;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:20px;line-height:40px;">${BOLT_TEXT}</td>
          <td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:20px;color:#1A1A1A;vertical-align:middle;">EnergyForge</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function renderButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td bgcolor="#F59E0B" style="background:#F59E0B;border-radius:8px;">
      <a href="${escapeAttr(url)}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;background:#F59E0B;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-weight:600;font-size:16px;text-decoration:none;border-radius:8px;mso-padding-alt:0;">${escapeHtml(text)}</a>
    </td>
  </tr>
</table>`;
}

export function renderFooter(locale: Lang): string {
  const refundLabel = locale === "cs" ? "Podmínky vrácení peněz" : "Refund Policy";
  const termsLabel = locale === "cs" ? "Obchodní podmínky" : "Terms";
  const privacyLabel = locale === "cs" ? "Ochrana soukromí" : "Privacy";
  const tagline =
    locale === "cs"
      ? "Osobní energetická diagnostika poháněná AI"
      : "AI-powered personal energy diagnostics";
  const copyright =
    locale === "cs"
      ? "© 2026 EnergyForge · Praha, Česká republika"
      : "© 2026 EnergyForge · Prague, Czech Republic";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;border-top:1px solid #E5E5E0;">
  <tr>
    <td style="padding-top:24px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#999999;">
      <div style="margin-bottom:8px;">${escapeHtml(tagline)}</div>
      <div style="margin-bottom:8px;">
        <a href="${SITE_URL}/refund-policy" target="_blank" rel="noopener" style="color:#999999;text-decoration:underline;">${escapeHtml(refundLabel)}</a>
        &nbsp;·&nbsp;
        <a href="${SITE_URL}/terms" target="_blank" rel="noopener" style="color:#999999;text-decoration:underline;">${escapeHtml(termsLabel)}</a>
        &nbsp;·&nbsp;
        <a href="${SITE_URL}/privacy" target="_blank" rel="noopener" style="color:#999999;text-decoration:underline;">${escapeHtml(privacyLabel)}</a>
      </div>
      <div>${escapeHtml(copyright)}</div>
    </td>
  </tr>
</table>`;
}

export function wrapInLayout(innerHtml: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>EnergyForge</title>
</head>
<body bgcolor="#FAFAF8" style="margin:0;padding:0;background:#FAFAF8;font-family:Arial,Helvetica,sans-serif;">
${renderPreheader(preheader)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FAFAF8" style="background:#FAFAF8;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E5E5E0;border-radius:12px;">
        <tr>
          <td style="padding:40px 32px;">
${innerHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
