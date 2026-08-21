// Relative import (not "@/types") so tsx-run scripts (render-email-previews)
// resolve it without tsconfig path aliases.
import type { Lang } from "../../types";

export type { Lang };

export type BaseEmailContext = {
  to: string;
  locale: Lang;
  userName?: string;
};

export type PurchaseConfirmationContext = BaseEmailContext & {
  tier: "pro" | "coach";
  dashboardUrl: string;
};

export type PlanReadyContext = BaseEmailContext & {
  dashboardUrl: string;
  planPreview: string;
  /** Localized phenotype display name; omit to skip the personalization line. */
  phenotypeName?: string;
};

export type EmailSendResult = {
  success: boolean;
  id?: string;
  error?: string;
};
