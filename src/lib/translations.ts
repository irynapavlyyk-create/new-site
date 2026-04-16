import type { Lang } from "@/types";

export const t = {
  nav: {
    how: { en: "How it works", ru: "Как это работает" },
    pricing: { en: "Pricing", ru: "Тарифы" },
    faq: { en: "FAQ", ru: "FAQ" },
    cta: { en: "Start free", ru: "Начать бесплатно" },
  },
  hero: {
    tag: { en: "Personal AI Energy Diagnostic", ru: "Персональный ИИ-диагност энергии" },
    title: {
      en: "Forge your energy. Reclaim your days.",
      ru: "Кузница твоей энергии. Верни свои дни.",
    },
    subtitle: {
      en: "Answer 9 questions — AI builds a personal 30-day protocol that works while you sleep.",
      ru: "Ответь на 9 вопросов — ИИ соберёт персональный 30-дневный протокол, который работает пока ты спишь.",
    },
    cta: { en: "Start diagnostic — free", ru: "Начать диагностику — бесплатно" },
    sub: { en: "No credit card. Takes 2 minutes.", ru: "Без карты. Занимает 2 минуты." },
    stats: {
      users: { en: "people diagnosed", ru: "человек прошли диагностику" },
      plans: { en: "plans generated", ru: "планов создано" },
      rating: { en: "average rating", ru: "средняя оценка" },
    },
  },
  marquee: {
    items: {
      en: [
        "Brain fog",
        "Afternoon crashes",
        "3-cup mornings",
        "Can't fall asleep",
        "Wake up tired",
        "No motivation",
        "Scrolling at 2am",
        "Stress eating",
        "Sunday anxiety",
      ],
      ru: [
        "Туман в голове",
        "Спады после обеда",
        "3 чашки по утрам",
        "Не могу уснуть",
        "Встаю уставшим",
        "Нет мотивации",
        "Листаю в 2 ночи",
        "Заедаю стресс",
        "Тревога в воскресенье",
      ],
    },
  },
  problems: {
    title: { en: "This is you?", ru: "Это про тебя?" },
    subtitle: {
      en: "If at least 3 feel familiar — you're leaking energy every day.",
      ru: "Если узнаёшь хотя бы 3 — ты теряешь энергию каждый день.",
    },
    items: {
      en: [
        "You open your eyes and already feel tired",
        "Coffee stopped working",
        "By 3pm your brain turns off",
        "You scroll instead of sleeping — every night",
        "You know what to do but can't start",
        "Stress leaks into weekends",
      ],
      ru: [
        "Открываешь глаза — и уже устал",
        "Кофе больше не работает",
        "К 3 дня мозг выключается",
        "Листаешь телефон вместо сна — каждый вечер",
        "Знаешь что делать, но не можешь начать",
        "Стресс протекает и в выходные",
      ],
    },
  },
  how: {
    title: { en: "How it works", ru: "Как это работает" },
    steps: {
      en: [
        { t: "Answer 9 questions", d: "Sleep, stress, nutrition, energy — the whole picture." },
        { t: "AI analyzes", d: "Claude finds your top energy leaks and root causes." },
        { t: "Get your protocol", d: "Morning, sleep, supplements, 30-day plan — on screen in 40 seconds." },
      ],
      ru: [
        { t: "Отвечаешь на 9 вопросов", d: "Сон, стресс, питание, энергия — вся картина." },
        { t: "ИИ анализирует", d: "Claude находит главные утечки и корни проблемы." },
        { t: "Получаешь протокол", d: "Утро, сон, добавки, 30-дневный план — на экране за 40 секунд." },
      ],
    },
  },
  preview: {
    title: { en: "A glimpse of your plan", ru: "Превью твоего плана" },
    subtitle: { en: "Here's what PRO looks like.", ru: "Так выглядит PRO-план." },
    items: {
      en: [
        { t: "Morning Protocol", d: "Cold water → light → protein → no phone 30 min." },
        { t: "Sleep Protocol", d: "Last caffeine 2pm. Magnesium glycinate 400mg at 21:00." },
        { t: "Supplements", d: "Vit D3 4000 IU, Omega-3 2g, B-complex with breakfast." },
        { t: "Nutrition", d: "Carbs in the evening. Protein 1.6g/kg. Water 2.5L." },
      ],
      ru: [
        { t: "Утренний протокол", d: "Холодная вода → свет → белок → без телефона 30 мин." },
        { t: "Протокол сна", d: "Последний кофеин до 14:00. Магний глицинат 400мг в 21:00." },
        { t: "Добавки", d: "Vit D3 4000 МЕ, Омега-3 2г, B-комплекс с завтраком." },
        { t: "Питание", d: "Углеводы вечером. Белок 1.6г/кг. Вода 2.5 л." },
      ],
    },
  },
  features: {
    title: { en: "What PRO includes", ru: "Что включает PRO" },
    items: {
      en: [
        { t: "Personal 30-day plan", d: "Week by week — what to do and when." },
        { t: "Morning protocol", d: "First 60 minutes — engineered for energy." },
        { t: "Sleep protocol", d: "Fall asleep in 15 min. Wake up rested." },
        { t: "Supplement stack", d: "Exactly what, when, how much — with dosages." },
        { t: "Nutrition blueprint", d: "Meal timing, macros, what to cut." },
        { t: "Stress protocol", d: "Breathing, breaks, boundaries — field-tested." },
        { t: "PDF download", d: "Take it anywhere. Print. Pin to the fridge." },
        { t: "Lifetime access", d: "Once. Forever. No subscription nag." },
      ],
      ru: [
        { t: "Персональный 30-дневный план", d: "Неделя за неделей — что делать и когда." },
        { t: "Утренний протокол", d: "Первые 60 минут — спроектированы под энергию." },
        { t: "Протокол сна", d: "Засыпать за 15 минут. Просыпаться отдохнувшим." },
        { t: "Стек добавок", d: "Точно что, когда, сколько — с дозировками." },
        { t: "Питание-блюпринт", d: "Тайминг приёмов, макросы, что убрать." },
        { t: "Протокол стресса", d: "Дыхание, паузы, границы — из практики." },
        { t: "PDF-скачивание", d: "Забери с собой. Распечатай. На холодильник." },
        { t: "Пожизненный доступ", d: "Один раз. Навсегда. Без подписочного зуда." },
      ],
    },
  },
  pricing: {
    title: { en: "Pick your path", ru: "Выбери свой путь" },
    subtitle: { en: "Start free. Upgrade only if it's worth it.", ru: "Начни бесплатно. Апгрейдь если стоит." },
    plans: {
      en: [
        {
          name: "Starter",
          price: "Free",
          period: "",
          desc: "Basic analysis",
          features: ["Basic diagnostic", "Top-3 energy leaks", "5 targeted tips"],
          cta: "Start free",
          tag: "",
        },
        {
          name: "PRO",
          price: "€9.99",
          period: "one-time",
          desc: "Full 30-day plan",
          features: [
            "Everything in Starter",
            "Full 30-day plan",
            "Supplement stack",
            "All protocols",
            "PDF download",
            "Lifetime access",
          ],
          cta: "Get PRO",
          tag: "Most popular",
        },
        {
          name: "Coach",
          price: "€24.99",
          period: "/month",
          desc: "Weekly AI adjustments",
          features: [
            "Everything in PRO",
            "Weekly AI reviews",
            "Plan auto-tuning",
            "Priority support",
          ],
          cta: "Become Coach",
          tag: "",
        },
      ],
      ru: [
        {
          name: "Starter",
          price: "Бесплатно",
          period: "",
          desc: "Базовый анализ",
          features: ["Базовая диагностика", "Топ-3 утечки энергии", "5 точечных советов"],
          cta: "Начать бесплатно",
          tag: "",
        },
        {
          name: "PRO",
          price: "€9.99",
          period: "разово",
          desc: "Полный план на 30 дней",
          features: [
            "Всё из Starter",
            "Полный 30-дневный план",
            "Стек добавок",
            "Все протоколы",
            "PDF-скачивание",
            "Пожизненный доступ",
          ],
          cta: "Взять PRO",
          tag: "Популярный",
        },
        {
          name: "Coach",
          price: "€24.99",
          period: "/мес",
          desc: "Еженедельные корректировки ИИ",
          features: [
            "Всё из PRO",
            "Еженедельные ревью ИИ",
            "Автоподстройка плана",
            "Приоритетная поддержка",
          ],
          cta: "Стать Coach",
          tag: "",
        },
      ],
    },
  },
  testimonials: {
    title: { en: "Real results", ru: "Реальные результаты" },
    items: {
      en: [
        { name: "Marco, 32", text: "Fell asleep in 10 min on day 3. Haven't touched the phone in bed since." },
        { name: "Elena, 28", text: "The afternoon crash is gone. I don't even recognise this version of me." },
        { name: "Dmitri, 41", text: "Paid 9€ expecting nothing. Used the plan for 3 weeks. Worth 10x." },
      ],
      ru: [
        { name: "Марко, 32", text: "На 3-й день засыпал за 10 минут. Телефон в кровать не беру." },
        { name: "Елена, 28", text: "Послеобеденные спады исчезли. Я сама себя не узнаю." },
        { name: "Дмитрий, 41", text: "Заплатил 9€ ни на что не рассчитывая. Работал 3 недели. Стоит в 10 раз больше." },
      ],
    },
  },
  faq: {
    title: { en: "FAQ", ru: "Частые вопросы" },
    items: {
      en: [
        { q: "Is this medical advice?", a: "No. EnergyForge is a lifestyle diagnostic. For medical issues see a doctor." },
        { q: "How fast will I feel it?", a: "Most users report changes in 3–7 days. The 30-day plan is designed for compound gains." },
        { q: "What if it doesn't work?", a: "14-day money-back on PRO. No questions, no forms." },
        { q: "Do I need to buy supplements?", a: "No. The plan works without them — supplements are a boost, not a must." },
        { q: "My data is safe?", a: "Answers are never shared. No email required for Starter." },
      ],
      ru: [
        { q: "Это медицинская консультация?", a: "Нет. EnergyForge — lifestyle-диагностика. С медицинскими вопросами — к врачу." },
        { q: "Как быстро почувствую?", a: "Большинство — за 3–7 дней. 30-дневный план спроектирован на накопительный эффект." },
        { q: "А если не сработает?", a: "14 дней на возврат PRO. Без вопросов, без анкет." },
        { q: "Надо покупать добавки?", a: "Нет. План работает и без них — добавки это буст, не обязательное." },
        { q: "Мои данные в безопасности?", a: "Ответы не передаются третьим лицам. Для Starter даже email не нужен." },
      ],
    },
  },
  finalCta: {
    title: { en: "Your next 30 days can look different.", ru: "Твои следующие 30 дней могут быть другими." },
    sub: { en: "Start with the free diagnostic.", ru: "Начни с бесплатной диагностики." },
    btn: { en: "Start diagnostic", ru: "Начать диагностику" },
  },
  footer: {
    rights: { en: "All rights reserved.", ru: "Все права защищены." },
    privacy: { en: "Privacy", ru: "Конфиденциальность" },
    terms: { en: "Terms", ru: "Условия" },
    contact: { en: "Contact", ru: "Контакты" },
  },
  quiz: {
    next: { en: "Next", ru: "Дальше" },
    back: { en: "Back", ru: "Назад" },
    finish: { en: "Get my plan", ru: "Получить план" },
    step: { en: "Step", ru: "Шаг" },
    of: { en: "of", ru: "из" },
  },
  loading: {
    title: { en: "AI is forging your plan…", ru: "ИИ кузнечит твой план…" },
    steps: {
      en: ["Analyzing your energy profile", "Finding root causes", "Matching protocols", "Personalizing the 30-day plan"],
      ru: ["Анализирую твой энергетический профиль", "Нахожу корневые причины", "Подбираю протоколы", "Персонализирую 30-дневный план"],
    },
  },
  result: {
    freeTitle: { en: "Your free diagnostic", ru: "Твоя бесплатная диагностика" },
    leaks: { en: "Top energy leaks", ru: "Главные утечки энергии" },
    tips: { en: "Your 5 targeted tips", ru: "5 точечных советов" },
    lockedTitle: { en: "The full plan is ready", ru: "Полный план готов" },
    lockedSub: {
      en: "Unlock PRO and get the 30-day protocol — one-time €9.99.",
      ru: "Открой PRO и получи 30-дневный протокол — разово €9.99.",
    },
    unlock: { en: "Unlock PRO — €9.99", ru: "Открыть PRO — €9.99" },
    tryAgain: { en: "Retake quiz", ru: "Пройти анкету заново" },
    error: { en: "Something went wrong. Please try again.", ru: "Что-то пошло не так. Попробуй ещё раз." },
  },
  dashboard: {
    welcome: { en: "Welcome to your plan", ru: "Добро пожаловать в твой план" },
    sub: { en: "Your personal 30-day energy protocol.", ru: "Твой персональный 30-дневный протокол." },
    sections: {
      morning: { en: "Morning Protocol", ru: "Утренний протокол" },
      sleep: { en: "Sleep Protocol", ru: "Протокол сна" },
      supplements: { en: "Supplements", ru: "Добавки" },
      nutrition: { en: "Nutrition", ru: "Питание" },
      stress: { en: "Stress Protocol", ru: "Протокол стресса" },
      plan: { en: "30-day plan", ru: "30-дневный план" },
    },
    noPlan: {
      en: "No plan found. Take the quiz first.",
      ru: "Плана ещё нет. Сначала пройди анкету.",
    },
    startQuiz: { en: "Start quiz", ru: "Пройти анкету" },
    downloadPdf: { en: "Download PDF", ru: "Скачать PDF" },
    week: { en: "Week", ru: "Неделя" },
  },
} as const;

export function pick<T>(node: { en: T; ru: T }, lang: Lang): T {
  return node[lang];
}
