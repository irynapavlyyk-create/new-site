import type { QuizKey } from "@/types";

export type QuizOption = { value: string; labelEn: string; labelRu: string };
export type QuizStep = {
  key: QuizKey;
  qEn: string;
  qRu: string;
  /** Defaults to "single-select" when omitted. */
  type?: "single-select" | "multi-select";
  /**
   * Multi-select only. If this value is in the array, the array must be
   * exactly [mutexValue] — clicking it deselects others; clicking another
   * option while it's present removes it first.
   */
  mutexValue?: string;
  options: QuizOption[];
};

export const quizSteps: QuizStep[] = [
  {
    key: "chronotype",
    qEn: "Would you call yourself a morning person or a night person?",
    qRu: "Ты «жаворонок» или «сова»?",
    options: [
      { value: "early-bird",   labelEn: "Morning person — I wake up easily before 7am", labelRu: "Жаворонок — легко встаю до 7 утра" },
      { value: "intermediate", labelEn: "Somewhere in the middle — wake by 8-9am",      labelRu: "Между — встаю 8-9 утра" },
      { value: "night-owl",    labelEn: "Night person — most energetic after 9pm",      labelRu: "Сова — пик энергии после 9 вечера" },
      { value: "irregular",    labelEn: "Depends on the day, no real pattern",          labelRu: "Зависит от дня, без паттерна" },
    ],
  },
  {
    key: "age",
    qEn: "Your age",
    qRu: "Твой возраст",
    options: [
      { value: "18-24", labelEn: "18-24", labelRu: "18-24" },
      { value: "25-34", labelEn: "25-34", labelRu: "25-34" },
      { value: "35-44", labelEn: "35-44", labelRu: "35-44" },
      { value: "45-54", labelEn: "45-54", labelRu: "45-54" },
      { value: "55+",   labelEn: "55+",   labelRu: "55+" },
    ],
  },
  {
    key: "energy",
    qEn: "How does your energy move through the day?",
    qRu: "Как меняется твоя энергия в течение дня?",
    options: [
      { value: "morning-peak",    labelEn: "Strong morning, fades by afternoon",                  labelRu: "Сильное утро, к обеду угасает" },
      { value: "afternoon-crash", labelEn: "OK until 2pm, then crash hits hard",                  labelRu: "Норм до 2 дня, потом резкий спад" },
      { value: "evening-peak",    labelEn: "Slow morning, energy comes by evening",               labelRu: "Утром медленно, энергия к вечеру" },
      { value: "flat-low",        labelEn: "Low all day, no real peaks",                          labelRu: "Низкая весь день, без пиков" },
      { value: "flat-high",       labelEn: "High all day, can't switch off even when I should",   labelRu: "Высокая весь день, не могу выключиться даже когда надо" },
    ],
  },
  {
    key: "sleepDuration",
    qEn: "How many hours of sleep do you usually get?",
    qRu: "Сколько часов сна у тебя обычно?",
    options: [
      { value: "<6h",   labelEn: "Less than 6 hours", labelRu: "Меньше 6 часов" },
      { value: "6-7h",  labelEn: "6-7 hours",         labelRu: "6-7 часов" },
      { value: "7-8h",  labelEn: "7-8 hours",         labelRu: "7-8 часов" },
      { value: ">8h",   labelEn: "More than 8 hours", labelRu: "Больше 8 часов" },
    ],
  },
  {
    key: "sleepQuality",
    qEn: "How do you feel when you wake up?",
    qRu: "Как ты чувствуешь себя когда просыпаешься?",
    options: [
      { value: "refreshed",   labelEn: "Refreshed and ready",                  labelRu: "Бодрое пробуждение, готовность к старту" },
      { value: "groggy",      labelEn: "Groggy, need 30+ min to wake up",      labelRu: "Заторможенность, нужно 30+ минут чтобы проснуться" },
      { value: "tired",       labelEn: "Tired even after enough sleep",        labelRu: "Усталость даже после долгого сна" },
      { value: "interrupted", labelEn: "Wake up 1-2+ times during the night",  labelRu: "Просыпаюсь 1-2+ раз за ночь" },
    ],
  },
  {
    key: "caffeine",
    qEn: "How much caffeine — and how late?",
    qRu: "Сколько кофеина — и до какого времени?",
    options: [
      { value: "none",           labelEn: "I don't drink caffeine",                  labelRu: "Не пью кофеин" },
      { value: "1-2-morning",    labelEn: "1-2 cups, all before noon",               labelRu: "1-2 чашки, все до полудня" },
      { value: "3+-morning",     labelEn: "3+ cups, all before noon",                labelRu: "3+ чашек, все до полудня" },
      { value: "1-2-afternoon",  labelEn: "1-2 cups, at least one after 2pm",        labelRu: "1-2 чашки, минимум одна после 2 дня" },
      { value: "3+-afternoon",   labelEn: "3+ cups, including afternoon/evening",    labelRu: "3+ чашек, включая день/вечер" },
      { value: "energy-drinks",  labelEn: "Mostly energy drinks or pre-workout",     labelRu: "В основном энергетики или pre-workout" },
    ],
  },
  {
    key: "stressSymptoms",
    type: "multi-select",
    mutexValue: "none",
    qEn: "Which of these happen to you regularly? (Pick all that apply — or 'None')",
    qRu: "Что из этого с тобой происходит регулярно? (Отметь всё что подходит — или «Ничего»)",
    options: [
      { value: "racing-thoughts",   labelEn: "Mind races, hard to switch off",                labelRu: "Мысли несутся, трудно выключиться" },
      { value: "tension-headaches", labelEn: "Tension headaches or jaw clenching",            labelRu: "Головные боли напряжения или сжимаю челюсть" },
      { value: "irritable",         labelEn: "Snap easily, lose patience over small things",  labelRu: "Срываюсь легко, теряю терпение по мелочам" },
      { value: "wired-cant-relax",  labelEn: "Body feels tense, can't physically relax",      labelRu: "Тело напряжено, не могу физически расслабиться" },
      { value: "dread-anxiety",     labelEn: "Dread or anxiety about upcoming things",        labelRu: "Тревога или страх о предстоящих делах" },
      { value: "overwhelmed",       labelEn: "Feel overwhelmed by daily tasks",               labelRu: "Ощущение перегрузки повседневными делами" },
      { value: "none",              labelEn: "None of these regularly",                       labelRu: "Ничего из этого регулярно" },
    ],
  },
  {
    key: "nutrition",
    qEn: "How do you eat in a typical day?",
    qRu: "Как ты ешь в обычный день?",
    options: [
      { value: "skip-meals",       labelEn: "Often skip breakfast or lunch",                            labelRu: "Часто пропускаю завтрак или обед" },
      { value: "irregular",        labelEn: "Meals happen but timing varies a lot",                     labelRu: "Ем, но время сильно гуляет" },
      { value: "regular-3",        labelEn: "3 meals at roughly the same times",                        labelRu: "3 приёма пищи примерно в одно время" },
      { value: "regular-3-snacks", labelEn: "3 meals + planned snacks",                                 labelRu: "3 приёма + запланированные перекусы" },
      { value: "restricted",       labelEn: "I follow a specific protocol (IF, OMAD, keto, etc.)",      labelRu: "Соблюдаю специфический протокол (интервальное голодание, OMAD, кето и т.д.)" },
    ],
  },
  {
    key: "activity",
    type: "multi-select",
    mutexValue: "sedentary",
    qEn: "What kind of activity do you do? (Pick all that apply)",
    qRu: "Какой активностью ты занимаешься? (Отметь всё что подходит)",
    options: [
      { value: "walking",          labelEn: "Walking — daily or most days",                        labelRu: "Ходьба — каждый день или почти" },
      { value: "cardio-moderate",  labelEn: "Moderate cardio (jogging, cycling, swimming) 2-3×",   labelRu: "Умеренное кардио (бег, велик, плавание) 2-3 раза" },
      { value: "strength",         labelEn: "Strength training (gym, lifting) 1-3×",               labelRu: "Силовые (зал, штанга) 1-3 раза" },
      { value: "combat",           labelEn: "Combat sports (boxing, BJJ, MMA) 1-3×",               labelRu: "Боевые (бокс, BJJ, MMA) 1-3 раза" },
      { value: "intense-cardio",   labelEn: "Intense cardio (HIIT, CrossFit, running) 3+×",        labelRu: "Интенсивное кардио (HIIT, CrossFit, бег) 3+ раз" },
      { value: "mind-body",        labelEn: "Yoga, Pilates, stretching",                           labelRu: "Йога, пилатес, растяжка" },
      { value: "daily-pro",        labelEn: "Train daily — multiple disciplines or competitive",   labelRu: "Тренируюсь каждый день — несколько дисциплин или соревновательно" },
      { value: "sedentary",        labelEn: "None right now / mostly sitting",                     labelRu: "Ничего сейчас / в основном сижу" },
    ],
  },
  {
    key: "priority",
    qEn: "Which one would you fix first if you could only pick one?",
    qRu: "Что бы ты исправила в первую очередь, если бы пришлось выбрать одно?",
    options: [
      { value: "energy", labelEn: "Energy — I want consistent, reliable energy",   labelRu: "Энергия — хочу стабильную надёжную энергию" },
      { value: "sleep",  labelEn: "Sleep — quality, not just quantity",            labelRu: "Сон — качество, не просто количество" },
      { value: "focus",  labelEn: "Focus — clear, sharp thinking",                 labelRu: "Фокус — ясное острое мышление" },
      { value: "stress", labelEn: "Stress — calm down the chronic activation",    labelRu: "Стресс — успокоить хроническую активацию" },
      { value: "mood",   labelEn: "Mood — feeling more like myself",               labelRu: "Настроение — чувствовать себя собой" },
    ],
  },
  {
    key: "biologicalSex",
    qEn: "Biological sex (for hormone-related recommendations)",
    qRu: "Биологический пол (для рекомендаций связанных с гормонами)",
    options: [
      { value: "female",          labelEn: "Female",             labelRu: "Женский" },
      { value: "male",            labelEn: "Male",               labelRu: "Мужской" },
      { value: "prefer-not-say",  labelEn: "Prefer not to say",  labelRu: "Предпочитаю не указывать" },
    ],
  },
];
