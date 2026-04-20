"use client";

import { useI18n } from "@/lib/i18n-context";
import { t, pick } from "@/lib/translations";
import LegalLayout from "@/components/LegalLayout";
import { Mail, Ext } from "@/components/LegalHelpers";

export default function PrivacyPage() {
  const { lang } = useI18n();
  const lastUpdated = lang === "ru" ? "20 апреля 2026" : "April 20, 2026";

  return (
    <LegalLayout
      title={pick(t.legal.privacyTitle, lang)}
      lastUpdated={lastUpdated}
    >
      {lang === "ru" ? <PrivacyRU /> : <PrivacyEN />}
    </LegalLayout>
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
          Answers to our 9-question energy diagnostic questionnaire (sleep
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

function PrivacyRU() {
  return (
    <>
      <h2>1. Введение</h2>
      <p>
        Добро пожаловать в EnergyForge (далее — «мы», «наш»). Мы управляем
        сайтом energyforge.app (далее — «Сервис»). Настоящая Политика
        конфиденциальности объясняет, как мы собираем, используем и защищаем
        ваши персональные данные в соответствии с Общим регламентом по защите
        данных (GDPR) и другими применимыми законами.
      </p>
      <p>
        Используя наш Сервис, вы соглашаетесь со сбором и использованием
        информации в соответствии с настоящей политикой.
      </p>

      <h2>2. Контролёр данных</h2>
      <p>Контролёром ваших персональных данных является:</p>
      <p>
        <strong>EnergyForge</strong>
        <br />
        Email: <Mail />
        <br />
        Сайт: https://energyforge.app
      </p>

      <h2>3. Какие данные мы собираем</h2>
      <h3>а) Данные, которые вы предоставляете напрямую:</h3>
      <ul>
        <li>
          Ответы на 9 вопросов энергетической диагностики (сон, образ жизни,
          питание, стресс и т.д.)
        </li>
        <li>Email (при регистрации или подписке)</li>
        <li>
          Платёжная информация (обрабатывается через Stripe — мы не храним
          данные карт)
        </li>
        <li>Имя и платёжная информация (для тарифов PRO и Coach)</li>
      </ul>
      <h3>б) Данные, собираемые автоматически:</h3>
      <ul>
        <li>IP-адрес, тип браузера, информация об устройстве</li>
        <li>Данные об использовании (посещённые страницы, время, клики)</li>
        <li>Cookies и аналогичные технологии</li>
      </ul>

      <h2>4. Как мы используем ваши данные</h2>
      <p>Мы используем ваши персональные данные для:</p>
      <ul>
        <li>
          Генерации персонализированных 30-дневных планов с помощью ИИ
          (Anthropic Claude API)
        </li>
        <li>Обработки платежей через Stripe</li>
        <li>Отправки вам плана и связанных сообщений</li>
        <li>Улучшения Сервиса</li>
        <li>Соблюдения юридических обязательств</li>
        <li>Предотвращения мошенничества</li>
      </ul>

      <h2>5. Правовая основа обработки (GDPR)</h2>
      <p>Мы обрабатываем ваши данные на основании:</p>
      <ul>
        <li>
          <strong>Согласия</strong> — когда вы отправляете анкету
        </li>
        <li>
          <strong>Исполнения договора</strong> — для предоставления оплаченной
          услуги
        </li>
        <li>
          <strong>Законного интереса</strong> — для улучшения Сервиса
        </li>
        <li>
          <strong>Юридических обязательств</strong> — для бухгалтерии и
          соблюдения законов
        </li>
      </ul>

      <h2>6. ИИ-обработка данных</h2>
      <p>
        Ваши ответы обрабатываются ИИ Anthropic Claude для генерации
        персональных рекомендаций. Anthropic обрабатывает эти данные согласно
        своей политике:{" "}
        <Ext href="https://www.anthropic.com/legal/privacy">
          https://www.anthropic.com/legal/privacy
        </Ext>
      </p>
      <p>Мы не используем ваши данные для обучения ИИ-моделей.</p>

      <h2>7. Передача данных</h2>
      <p>Мы передаём ваши данные только:</p>
      <ul>
        <li>
          <strong>Stripe</strong> — для обработки платежей (
          <Ext href="https://stripe.com/privacy">
            https://stripe.com/privacy
          </Ext>
          )
        </li>
        <li>
          <strong>Anthropic</strong> — для ИИ-рекомендаций
        </li>
        <li>
          <strong>Vercel</strong> — наш хостинг-провайдер (
          <Ext href="https://vercel.com/legal/privacy-policy">
            https://vercel.com/legal/privacy-policy
          </Ext>
          )
        </li>
        <li>
          <strong>Государственным органам</strong> — если требует закон
        </li>
      </ul>
      <p>
        Мы <strong>никогда не продаём</strong> ваши данные.
      </p>

      <h2>8. Срок хранения данных</h2>
      <ul>
        <li>Ответы на анкету и планы: до 2 лет</li>
        <li>
          Платёжные записи: 7 лет (требование налогового законодательства ЕС)
        </li>
        <li>Переписка: до отписки + 2 года</li>
      </ul>

      <h2>9. Ваши права согласно GDPR</h2>
      <p>Вы имеете право:</p>
      <ul>
        <li>
          <strong>Доступа</strong> к вашим данным
        </li>
        <li>
          <strong>Исправления</strong> неточных данных
        </li>
        <li>
          <strong>Удаления</strong> данных («право на забвение»)
        </li>
        <li>
          <strong>Ограничения</strong> обработки
        </li>
        <li>
          <strong>Переносимости данных</strong>
        </li>
        <li>
          <strong>Возражения</strong> против обработки
        </li>
        <li>
          <strong>Отзыва согласия</strong> в любое время
        </li>
        <li>
          <strong>Подачи жалобы</strong> в местный орган по защите данных
        </li>
      </ul>
      <p>
        Чтобы реализовать любое из этих прав, напишите: <Mail />
      </p>

      <h2>10. Cookies</h2>
      <p>
        Мы используем необходимые cookies для работы Сервиса и аналитические
        cookies. Вы можете управлять cookies через настройки браузера.
      </p>

      <h2>11. Безопасность данных</h2>
      <p>
        Мы применяем стандартные меры безопасности: шифрование (HTTPS),
        безопасные платежи (Stripe), ограниченный доступ. Однако ни один
        метод передачи через Интернет не является на 100% безопасным.
      </p>

      <h2>12. Международные передачи</h2>
      <p>
        Ваши данные могут передаваться в страны за пределами ЕС (например,
        США, где работают Anthropic и Stripe). Мы обеспечиваем защиту через
        стандартные договорные положения (SCC).
      </p>

      <h2>13. Конфиденциальность детей</h2>
      <p>Наш Сервис не предназначен для лиц младше 18 лет.</p>

      <h2>14. Изменения в политике</h2>
      <p>
        Мы можем обновлять эту Политику. Актуальная версия всегда находится
        на этой странице.
      </p>

      <h2>15. Связаться с нами</h2>
      <p>
        Email: <Mail />
      </p>
    </>
  );
}
