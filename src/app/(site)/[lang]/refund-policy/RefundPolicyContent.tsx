"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";
import { Mail } from "@/components/LegalHelpers";
import { COMPANY } from "@/lib/company";

// Chrome (navbar, title, footer) follows the URL language via
// RouteLangProvider in the [lang] layout. The document BODY stays English on
// both variants until the reviewed Czech legal text is ready (native review
// pending) — swap <RefundEN /> for a lang switch here when it lands.
export default function RefundPolicyContent() {
  const { lang } = useI18n();
  return (
    <LegalLayout title={pick(t.legal.refundTitle, lang)} lastUpdated="August 27, 2026">
      <RefundEN />
    </LegalLayout>
  );
}

function RefundEN() {
  return (
    <>
      <h2>1. Overview</h2>
      <p>
        EnergyForge offers two plans:{" "}
        <strong>Starter</strong> (free) and{" "}
        <strong>PRO</strong> (€9.99 one-time). This Refund
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

      <h2>3. How to Request a Refund</h2>
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

      <h2>4. Chargebacks</h2>
      <p>
        Please contact us <strong>before</strong> initiating a chargeback
        with your bank &mdash; we are committed to resolving issues quickly
        and fairly. Fraudulent chargebacks may result in account
        termination.
      </p>

      <h2>5. Contact</h2>
      <p>
        Email: <Mail />
      </p>
      <p>
        Seller: <strong>{COMPANY.name}</strong>, ID No. (IČO) {COMPANY.ico},{" "}
        {COMPANY.addressEn}
      </p>
    </>
  );
}
