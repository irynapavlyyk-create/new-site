// Renders the four bilingual email templates to .email-previews/*.html for
// visual inspection in a browser. Re-run after copy or template changes.
//   npm run render:emails

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderPurchaseConfirmation } from "../src/lib/emails/templates/purchase-confirmation";
import { renderPlanReady } from "../src/lib/emails/templates/plan-ready";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", ".email-previews");

const SAMPLE_PLAN_PREVIEW =
  "Your afternoon crashes are driven primarily by irregular eating patterns and likely omega-3 deficits. The plan anchors circadian rhythm with morning light.";

const dashboardUrl = "https://www.energyforge.app/dashboard";

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });

  const purchaseProEn = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "en",
    tier: "pro",
    dashboardUrl,
  });
  const purchaseProCs = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "cs",
    tier: "pro",
    dashboardUrl,
  });
  const purchaseCoachEn = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "en",
    tier: "coach",
    dashboardUrl,
  });
  const purchaseCoachCs = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "cs",
    tier: "coach",
    dashboardUrl,
  });
  const planReadyEn = renderPlanReady({
    to: "test@example.com",
    locale: "en",
    dashboardUrl,
    planPreview: SAMPLE_PLAN_PREVIEW,
  });
  const planReadyCs = renderPlanReady({
    to: "test@example.com",
    locale: "cs",
    dashboardUrl,
    planPreview: SAMPLE_PLAN_PREVIEW,
  });

  const files: Array<[string, string]> = [
    ["purchase-pro-en.html", purchaseProEn.html],
    ["purchase-pro-cs.html", purchaseProCs.html],
    ["purchase-coach-en.html", purchaseCoachEn.html],
    ["purchase-coach-cs.html", purchaseCoachCs.html],
    ["plan-ready-en.html", planReadyEn.html],
    ["plan-ready-cs.html", planReadyCs.html],
  ];

  await Promise.all(
    files.map(([name, html]) => writeFile(join(outDir, name), html, "utf8"))
  );

  console.log(`Wrote ${files.length} preview files to:`, outDir);
  for (const [name] of files) {
    console.log("  ", join(outDir, name));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
