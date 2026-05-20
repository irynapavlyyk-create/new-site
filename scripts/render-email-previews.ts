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

  const purchaseEn = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "en",
    tier: "pro",
    dashboardUrl,
  });
  const purchaseRu = renderPurchaseConfirmation({
    to: "test@example.com",
    locale: "ru",
    tier: "pro",
    dashboardUrl,
  });
  const planReadyEn = renderPlanReady({
    to: "test@example.com",
    locale: "en",
    dashboardUrl,
    planPreview: SAMPLE_PLAN_PREVIEW,
  });
  const planReadyRu = renderPlanReady({
    to: "test@example.com",
    locale: "ru",
    dashboardUrl,
    planPreview: SAMPLE_PLAN_PREVIEW,
  });

  const files: Array<[string, string]> = [
    ["purchase-en.html", purchaseEn.html],
    ["purchase-ru.html", purchaseRu.html],
    ["plan-ready-en.html", planReadyEn.html],
    ["plan-ready-ru.html", planReadyRu.html],
  ];

  await Promise.all(
    files.map(([name, html]) => writeFile(join(outDir, name), html, "utf8"))
  );

  console.log("Wrote 4 preview files to:", outDir);
  for (const [name] of files) {
    console.log("  ", join(outDir, name));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
