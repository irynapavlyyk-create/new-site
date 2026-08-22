"use client";

import { FixedLangProvider } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";
import { Mail, Ext } from "@/components/LegalHelpers";

// Legal pages are English-only until reviewed Czech versions are ready —
// the whole page (chrome included) is pinned to EN via FixedLangProvider.
export default function PrivacyPage() {
  return (
    <FixedLangProvider lang="en">
      <LegalLayout
        title={pick(t.legal.privacyTitle, "en")}
        lastUpdated="April 20, 2026"
        showLanguageSwitcher={false}
      >
        <PrivacyEN />
      </LegalLayout>
    </FixedLangProvider>
  );
}

function PrivacyEN() {
  return (
    <>
      <h2>1. Introduction</h2>
      <p>
        Welcome to EnergyForge (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
        &ldquo;us&rdquo;). We operate the website energyforge.app (the
        &ldquo;Service&rdquo;). This Privacy Policy explains how we collect,
        use, and protect your personal data in accordance with the General
        Data Protection Regulation (GDPR) and other applicable laws.
      </p>
      <p>
        By using our Service, you agree to the collection and use of
        information in accordance with this policy.
      </p>

      <h2>2. Data Controller</h2>
      <p>The data controller responsible for your personal data is:</p>
      <p>
        <strong>EnergyForge</strong>
        <br />
        Email: <Mail />
        <br />
        Website: https://energyforge.app
      </p>

      <h2>3. Information We Collect</h2>
      <p>We collect the following types of personal data:</p>
      <h3>a) Information you provide directly:</h3>
      <ul>
        <li>
          Answers to our 10-question energy diagnostic questionnaire (sleep
          patterns, lifestyle, nutrition, stress levels, etc.)
        </li>
        <li>Email address (if you register or subscribe)</li>
        <li>
          Payment information (processed securely via Stripe — we never store
          your card details)
        </li>
        <li>Name and billing information (for PRO and Coach plans)</li>
      </ul>
      <h3>b) Information collected automatically:</h3>
      <ul>
        <li>IP address, browser type, device information</li>
        <li>Usage data (pages visited, time spent, clicks)</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2>4. How We Use Your Data</h2>
      <p>We use your personal data to:</p>
      <ul>
        <li>
          Generate personalized 30-day energy plans using AI (Anthropic Claude
          API)
        </li>
        <li>Process payments via Stripe</li>
        <li>Send you your personalized plan and related communications</li>
        <li>Improve our Service and user experience</li>
        <li>Comply with legal obligations</li>
        <li>Prevent fraud and ensure security</li>
      </ul>

      <h2>5. Legal Basis for Processing (GDPR)</h2>
      <p>We process your data based on:</p>
      <ul>
        <li>
          <strong>Consent</strong> — when you submit the diagnostic
          questionnaire
        </li>
        <li>
          <strong>Contract performance</strong> — to deliver the service you
          purchased
        </li>
        <li>
          <strong>Legitimate interest</strong> — to improve our Service and
          prevent fraud
        </li>
        <li>
          <strong>Legal obligation</strong> — for accounting, tax, and legal
          compliance
        </li>
      </ul>

      <h2>6. AI Processing</h2>
      <p>
        Your questionnaire answers are processed by Anthropic&apos;s Claude
        AI to generate personalized recommendations. Anthropic processes this
        data according to their own privacy policy:{" "}
        <Ext href="https://www.anthropic.com/legal/privacy">
          https://www.anthropic.com/legal/privacy
        </Ext>
      </p>
      <p>We do not use your data to train AI models.</p>

      <h2>7. Data Sharing</h2>
      <p>We share your data only with:</p>
      <ul>
        <li>
          <strong>Stripe</strong> — for payment processing (
          <Ext href="https://stripe.com/privacy">https://stripe.com/privacy</Ext>
          )
        </li>
        <li>
          <strong>Anthropic</strong> — for AI-generated recommendations
        </li>
        <li>
          <strong>Vercel</strong> — our hosting provider (
          <Ext href="https://vercel.com/legal/privacy-policy">
            https://vercel.com/legal/privacy-policy
          </Ext>
          )
        </li>
        <li>
          <strong>Legal authorities</strong> — when required by law
        </li>
      </ul>
      <p>We never sell your personal data.</p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your data for as long as necessary to provide our Service
        and comply with legal obligations:
      </p>
      <ul>
        <li>Questionnaire responses and generated plans: up to 2 years</li>
        <li>Payment records: 7 years (required by EU tax law)</li>
        <li>Email communications: until you unsubscribe + 2 years</li>
      </ul>

      <h2>9. Your Rights Under GDPR</h2>
      <p>You have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> your personal data
        </li>
        <li>
          <strong>Rectify</strong> inaccurate data
        </li>
        <li>
          <strong>Erase</strong> your data (&ldquo;right to be forgotten&rdquo;)
        </li>
        <li>
          <strong>Restrict</strong> processing of your data
        </li>
        <li>
          <strong>Data portability</strong> — receive your data in a
          structured format
        </li>
        <li>
          <strong>Object</strong> to processing
        </li>
        <li>
          <strong>Withdraw consent</strong> at any time
        </li>
        <li>
          <strong>Lodge a complaint</strong> with your local data protection
          authority
        </li>
      </ul>
      <p>
        To exercise any of these rights, contact us at: <Mail />
      </p>

      <h2>10. Cookies</h2>
      <p>
        We use essential cookies to operate the Service and analytics cookies
        to understand usage. You can control cookies through your browser
        settings.
      </p>

      <h2>11. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data,
        including encryption (HTTPS), secure payment processing (Stripe), and
        limited access controls. However, no method of transmission over the
        Internet is 100% secure.
      </p>

      <h2>12. International Transfers</h2>
      <p>
        Your data may be transferred to and processed in countries outside the
        EU (e.g., United States, where Anthropic and Stripe operate). We
        ensure appropriate safeguards through Standard Contractual Clauses
        (SCCs) and data processing agreements.
      </p>

      <h2>13. Children&apos;s Privacy</h2>
      <p>
        Our Service is not intended for anyone under 18 years of age. We do
        not knowingly collect data from minors.
      </p>

      <h2>14. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy. The latest version will always be
        posted on this page with an updated date.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        For any questions about this Privacy Policy, contact: <Mail />
      </p>
    </>
  );
}
