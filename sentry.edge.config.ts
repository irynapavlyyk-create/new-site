// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4b9997782dfe98ea739ef9ff48971f7a@o4511455841746944.ingest.de.sentry.io/4511455861014608",

  // Sample 10% of traces in production — sufficient for performance insights without burning quota.
  tracesSampleRate: 0.1,

  // Disable log forwarding — we only want errors, not console output.
  enableLogs: false,

  // Do not send IPs/headers/cookies — GDPR-safer. Stack traces and error details still captured.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
