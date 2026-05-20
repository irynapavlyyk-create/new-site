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
};

export type EmailSendResult = {
  success: boolean;
  id?: string;
  error?: string;
};
