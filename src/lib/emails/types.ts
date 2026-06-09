export type Locale = "en" | "ru";

export type BaseEmailContext = {
  to: string;
  locale: Locale;
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
