import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? "EnergyForge <noreply@energyforge.app>";
}

export function getEmailReplyTo(): string {
  return process.env.EMAIL_REPLY_TO ?? "support@energyforge.app";
}
