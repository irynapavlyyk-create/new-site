# EnergyForge ⚡

Персональный ИИ-диагност энергии. Отвечаешь на 9 вопросов — получаешь 30-дневный протокол.

**Стек:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Anthropic Claude API · Stripe

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать env-файл и заполнить ключи
cp .env.example .env.local

# 3. Запустить dev-сервер
npm run dev
```

Сайт: http://localhost:3000

## Переменные окружения (.env.local)

| Переменная | Где взять |
| --- | --- |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | там же |
| `STRIPE_WEBHOOK_SECRET` | https://dashboard.stripe.com/webhooks |
| `STRIPE_PRICE_PRO` | Stripe → Products → создать «PRO» за €9.99 one-time |
| `STRIPE_PRICE_COACH` | Stripe → Products → создать «Coach» за €24.99/mo |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` в деве; продакшн-URL на проде |

## Структура

```
src/
├── app/
│   ├── page.tsx              — лендинг
│   ├── quiz/page.tsx         — анкета (9 вопросов)
│   ├── loading/page.tsx      — анимация анализа
│   ├── result/page.tsx       — бесплатный отчёт + блюр PRO
│   ├── dashboard/page.tsx    — личный кабинет
│   └── api/
│       ├── analyze/          — Claude API
│       ├── checkout/         — Stripe Checkout
│       └── webhook/          — Stripe webhook
├── components/               — Navbar, Hero, Pricing, FAQ, etc.
├── lib/
│   ├── claude.ts             — Anthropic SDK client + prompt caching
│   ├── stripe.ts             — Stripe client
│   ├── translations.ts       — EN/RU словари
│   ├── i18n-context.tsx      — React-контекст + localStorage
│   └── quiz-data.ts          — 9 вопросов анкеты
└── types/                    — TypeScript типы
```

## Stripe webhook локально

```bash
# установить stripe CLI → https://docs.stripe.com/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
```

Скопируй webhook-secret из вывода в `.env.local` как `STRIPE_WEBHOOK_SECRET`.

## Деплой на Vercel

1. Подключи репозиторий https://github.com/irynapavlyyk-create/new-site
   (или твой форк)
2. Добавь все переменные из `.env.example` в Vercel → Settings → Environment Variables
3. `NEXT_PUBLIC_SITE_URL` = твой продакшн-домен
4. В Stripe Dashboard → Webhooks добавь endpoint: `https://<your-domain>/api/webhook` (событие `checkout.session.completed`)

## Дизайн-токены

- Фон: `#0A0A0F`
- Акценты: `#F5A623` (янтарь), `#FF6B35` (оранжевый), `#7B61FF` (фиолетовый)
- Шрифты: **Sora** (заголовки) + **Inter** (текст) — загружаются через `next/font/google`
- Эффекты: glassmorphism, свечения, fade-up при скролле
