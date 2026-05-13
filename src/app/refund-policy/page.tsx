"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";
import { Mail } from "@/components/LegalHelpers";

export default function RefundPolicyPage() {
  const { lang } = useI18n();
  const lastUpdated = lang === "ru" ? "13 мая 2026" : "May 13, 2026";

  return (
    <LegalLayout
      title={pick(t.legal.refundTitle, lang)}
      lastUpdated={lastUpdated}
    >
      {lang === "ru" ? <RefundRU /> : <RefundEN />}
    </LegalLayout>
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

function RefundRU() {
  return (
    <>
      <h2>1. Общие положения</h2>
      <p>
        EnergyForge предлагает три тарифа:{" "}
        <strong>Starter</strong> (бесплатный),{" "}
        <strong>PRO</strong> (€9.99 разово) и{" "}
        <strong>Coach</strong> (€24.99/месяц по подписке). Эта Политика
        возврата средств описывает ваши права на возврат согласно
        Директиве ЕС о правах потребителей и порядок подачи запроса.
      </p>

      <h2>2. PRO план (€9.99 разово)</h2>
      <p>
        По законодательству ЕС у вас есть{" "}
        <strong>14 дней на отказ</strong> от цифрового контента. Однако
        это право утрачивается после того, как цифровая услуга была
        полностью оказана &mdash; в нашем случае, после того как ваш
        персональный план сгенерирован и доступен в личном кабинете.
      </p>
      <p>
        <strong>
          Вы имеете право на полный возврат в течение 14 дней с момента
          покупки, ЕСЛИ ваш персональный план ещё не был сгенерирован
        </strong>{" "}
        (например, из-за технической проблемы).
      </p>
      <p>
        Как только план сгенерирован и виден в вашем личном кабинете,
        услуга считается оказанной и возврат по стандартной политике не
        предоставляется.
      </p>
      <p>
        <strong>Исключительные обстоятельства:</strong> Если вы
        столкнулись с настоящей технической проблемой, случайной повторной
        оплатой или другой добросовестной ситуацией &mdash; напишите на{" "}
        <Mail /> в течение 14 дней, и мы рассмотрим ваш случай
        индивидуально.
      </p>

      <h2>3. Coach план (€24.99/месяц)</h2>
      <ul>
        <li>
          Вы можете отменить подписку в любой момент в личном кабинете или
          через поддержку.
        </li>
        <li>
          Отмена вступает в силу в конце текущего расчётного периода
          &mdash; доступ сохраняется до этого момента.
        </li>
        <li>Возврат за текущий расчётный месяц не предоставляется.</li>
        <li>
          После отмены вы не будете списаны за последующие месяцы.
        </li>
        <li>
          Возвраты за неполные месяцы обслуживания не предоставляются.
        </li>
      </ul>

      <h2>4. Как запросить возврат</h2>
      <ul>
        <li>
          Напишите на <Mail />, указав email вашего аккаунта и детали
          заказа.
        </li>
        <li>Мы ответим в течение 3 рабочих дней.</li>
        <li>
          Одобренные возвраты обрабатываются через Stripe на оригинальный
          способ оплаты в течение 5&ndash;10 рабочих дней.
        </li>
      </ul>

      <h2>5. Chargeback&apos;и</h2>
      <p>
        Пожалуйста, свяжитесь с нами <strong>до</strong> инициирования
        chargeback в банке &mdash; мы готовы быстро и справедливо решать
        проблемы. Мошеннические chargeback&apos;и могут привести к
        блокировке аккаунта.
      </p>

      <h2>6. Контакты</h2>
      <p>
        Email: <Mail />
      </p>
    </>
  );
}
