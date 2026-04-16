import type { QuizKey } from "@/types";

export type QuizOption = { value: string; labelEn: string; labelRu: string };
export type QuizStep = {
  key: QuizKey;
  qEn: string;
  qRu: string;
  options: QuizOption[];
};

export const quizSteps: QuizStep[] = [
  {
    key: "goal",
    qEn: "What's your main goal?",
    qRu: "Какая у тебя главная цель?",
    options: [
      { value: "energy", labelEn: "More energy", labelRu: "Больше энергии" },
      { value: "sleep", labelEn: "Better sleep", labelRu: "Лучший сон" },
      { value: "stress", labelEn: "Less stress", labelRu: "Меньше стресса" },
      { value: "focus", labelEn: "Focus & concentration", labelRu: "Фокус и концентрация" },
      { value: "all", labelEn: "All of the above", labelRu: "Всё сразу" },
    ],
  },
  {
    key: "age",
    qEn: "Your age",
    qRu: "Твой возраст",
    options: [
      { value: "18-24", labelEn: "18–24", labelRu: "18–24" },
      { value: "25-34", labelEn: "25–34", labelRu: "25–34" },
      { value: "35-44", labelEn: "35–44", labelRu: "35–44" },
      { value: "45+", labelEn: "45+", labelRu: "45+" },
    ],
  },
  {
    key: "energy",
    qEn: "Energy through the day",
    qRu: "Энергия в течение дня",
    options: [
      { value: "always-tired", labelEn: "Always tired", labelRu: "Постоянно устаю" },
      { value: "afternoon-crash", labelEn: "Afternoon crashes", labelRu: "Спады после обеда" },
      { value: "ok-morning", labelEn: "OK in the morning, bad at night", labelRu: "Нормально утром, плохо вечером" },
      { value: "enough", labelEn: "Enough energy", labelRu: "Энергии хватает" },
    ],
  },
  {
    key: "sleep",
    qEn: "How much sleep?",
    qRu: "Сколько спишь?",
    options: [
      { value: "<6h", labelEn: "Less than 6h", labelRu: "Меньше 6 ч" },
      { value: "6-7h", labelEn: "6–7h", labelRu: "6–7 ч" },
      { value: "7-8h", labelEn: "7–8h", labelRu: "7–8 ч" },
      { value: ">8h-unrested", labelEn: "More than 8h but unrested", labelRu: "Больше 8 ч но не высыпаюсь" },
    ],
  },
  {
    key: "caffeine",
    qEn: "Caffeine intake",
    qRu: "Кофе / кофеин",
    options: [
      { value: "none", labelEn: "None", labelRu: "Не пью" },
      { value: "1cup", labelEn: "1 cup", labelRu: "1 чашка" },
      { value: "2-3cups", labelEn: "2–3 cups", labelRu: "2–3 чашки" },
      { value: "3+-energy", labelEn: "3+ or energy drinks", labelRu: "Больше 3 или энергетики" },
    ],
  },
  {
    key: "stress",
    qEn: "Stress level",
    qRu: "Уровень стресса",
    options: [
      { value: "high-chronic", labelEn: "Chronic high", labelRu: "Хронический высокий" },
      { value: "periodic", labelEn: "Periodic", labelRu: "Периодический" },
      { value: "moderate", labelEn: "Moderate", labelRu: "Умеренный" },
      { value: "low", labelEn: "Low", labelRu: "Низкий" },
    ],
  },
  {
    key: "nutrition",
    qEn: "Nutrition",
    qRu: "Питание",
    options: [
      { value: "skip-meals", labelEn: "Skip meals", labelRu: "Пропускаю приёмы" },
      { value: "irregular", labelEn: "Irregular", labelRu: "Ем нерегулярно" },
      { value: "ok", labelEn: "Mostly fine", labelRu: "В целом нормально" },
      { value: "tracked", labelEn: "I track it carefully", labelRu: "Слежу за питанием" },
    ],
  },
  {
    key: "activity",
    qEn: "Physical activity",
    qRu: "Физическая активность",
    options: [
      { value: "almost-none", labelEn: "Almost none", labelRu: "Почти нет" },
      { value: "1-2x", labelEn: "1–2x per week", labelRu: "1–2 раза в неделю" },
      { value: "3-4x", labelEn: "3–4x per week", labelRu: "3–4 раза" },
      { value: "daily", labelEn: "Daily", labelRu: "Каждый день" },
    ],
  },
  {
    key: "mainIssue",
    qEn: "Main problem",
    qRu: "Главная проблема",
    options: [
      { value: "brain-fog", labelEn: "Brain fog", labelRu: "Туман в голове" },
      { value: "no-motivation", labelEn: "No motivation", labelRu: "Нет мотивации" },
      { value: "anxiety", labelEn: "Anxiety & stress", labelRu: "Тревога и стресс" },
      { value: "bad-sleep", labelEn: "Bad sleep", labelRu: "Плохой сон" },
      { value: "morning-fatigue", labelEn: "Morning fatigue", labelRu: "Усталость с утра" },
    ],
  },
];
