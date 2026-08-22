"use client";

import { FixedLangProvider } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";
import { Mail } from "@/components/LegalHelpers";

// Legal pages are English-only until reviewed Czech versions are ready —
// the whole page (chrome included) is pinned to EN via FixedLangProvider.
export default function RefundPolicyPage() {
  return (
    <FixedLangProvider lang="en">
      <LegalLayout
        title={pick(t.legal.refundTitle, "en")}
        lastUpdated="May 13, 2026"
        showLanguageSwitcher={false}
      >
        <RefundEN />
      </LegalLayout>
    </FixedLangProvider>
  );
}

function RefundEN() {
  return (
    <>
      <h2>1. Overview</h2>
      <p>
        EnergyForge offers three plans:{" "}
        <strong>Starter</strong> (free),{" "}
        <strong>PRO</strong> (€9.99 one-time), and{" "}
        <strong>Coach</strong> (€24.99/month subscription). This Refund
        Policy explains your refund rights under the EU Consumer Rights
        Directive and how to request a refund.
      </p>

      <h2>2. PRO Plan (€9.99 one-time)</h2>
      <p>
        Under EU law, you have a <strong>14-day right of withdrawal</strong>{" "}
        for digital content. However, this right is forfeited once the
        digital service has been fully performed — in our case, once your
        personalized plan has been generated and delivered to your
        dashboard.
      </p>
      <p>
        <strong>
          You are eligible for a full refund within 14 days of purchase IF
          your personalized plan has not yet been generated
        </strong>{" "}
        (e.g., due to a technical issue).
      </p>
      <p>
        Once your plan is generated and visible in your dashboard, the
        service is considered delivered and refunds are not available under
        standard policy.
      </p>
      <p>
        <strong>Exceptional circumstances:</strong> If you experienced a
        genuine technical problem, an accidental duplicate purchase, or
        another bona fide issue, please contact <Mail /> within 14 days and
        we will review your case individually.
      </p>

      <h2>3. Coach Plan (€24.99/month)</h2>
      <ul>
        <li>
          You can cancel your subscription at any time from your dashboard
          or by contacting support.
        </li>
        <li>
          Cancellation takes effect at the end of the current billing
          period — you retain access until then.
        </li>
        <li>We do not provide refunds for the current billing month.</li>
        <li>
          You will not be charged for any subsequent months after
          cancellation.
        </li>
        <li>No refunds for partial months of service.</li>
      </ul>

      <h2>4. How to Request a Refund</h2>
      <ul>
        <li>
          Email <Mail /> with your account email and order details.
        </li>
        <li>We will respond within 3 business days.</li>
        <li>
          Approved refunds are processed via Stripe to the original payment
          method within 5&ndash;10 business days.
        </li>
      </ul>

      <h2>5. Chargebacks</h2>
      <p>
        Please contact us <strong>before</strong> initiating a chargeback
        with your bank &mdash; we are committed to resolving issues quickly
        and fairly. Fraudulent chargebacks may result in account
        termination.
      </p>

      <h2>6. Contact</h2>
      <p>
        Email: <Mail />
      </p>
    </>
  );
}
