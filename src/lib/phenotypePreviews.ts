import type { PhenotypeId, PhenotypePreview } from "@/types";

/**
 * Static per-phenotype "preview" content for the FREE /result page.
 *
 * IMPORTANT: this is NOT a generated plan. The free path makes no AI call,
 * so week themes and the Week-1 teaser actions here are fixed, illustrative
 * samples — representative of what the paid 30-day protocol contains. They
 * sit behind a progressive blur to convey value without giving away a real
 * personalized plan.
 *
 * Content is derived from each phenotype's subtitle + insights in
 * src/lib/phenotypes.ts so the themes fit the type. Bilingual (en/cs); the
 * user-facing language is chosen at render time via useI18n().
 */
export const PHENOTYPE_PREVIEWS: Record<PhenotypeId, PhenotypePreview> = {
  "wired-but-tired": {
    weekThemes: [
      {
        en: "Caffeine cutoff + nervous-system reset",
        cs: "Стоп-кофеин + перезагрузка нервной системы",
      },
      {
        en: "Sleep architecture repair",
        cs: "Восстановление структуры сна",
      },
      {
        en: "Re-anchoring the cortisol rhythm",
        cs: "Возврат кортизолового ритма",
      },
      {
        en: "Sustained calm + consolidation",
        cs: "Устойчивое спокойствие и закрепление",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Take your foot off the gas — cap caffeine and teach your nervous system to downshift.",
        cs: "Сними ногу с газа — ограничь кофеин и научи нервную систему сбрасывать обороты.",
      },
      actions: [
        {
          en: "06:45 — Daylight for 10 min before any screen — anchors your cortisol peak where it belongs",
          cs: "06:45 — 10 минут дневного света до экранов — фиксирует пик кортизола там, где нужно",
        },
        {
          en: "14:00 — Hard caffeine cutoff; switch to L-theanine if you need focus",
          cs: "14:00 — Жёсткий стоп-кофеин; нужен фокус — L-теанин",
        },
        {
          en: "21:30 — 4-7-8 breathing + lights to amber — drops you out of “wired” mode",
          cs: "21:30 — Дыхание 4-7-8 + тёплый свет — выводит из режима «на взводе»",
        },
      ],
    },
  },

  "crashed-circadian": {
    weekThemes: [
      {
        en: "Morning-light anchor + fixed wake time",
        cs: "Якорь утреннего света + фиксированный подъём",
      },
      {
        en: "Evening light control + melatonin timing",
        cs: "Контроль вечернего света + тайминг мелатонина",
      },
      {
        en: "Shifting the peak earlier",
        cs: "Сдвигаем пик раньше",
      },
      {
        en: "Locking the new rhythm",
        cs: "Закрепляем новый ритм",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Drag your body clock back into your timezone — light is the lever.",
        cs: "Верни внутренние часы в свой часовой пояс — рычаг это свет.",
      },
      actions: [
        {
          en: "07:00 — Fixed wake time, 7 days a week, 10 min bright light immediately",
          cs: "07:00 — Фиксированный подъём 7 дней в неделю + 10 минут яркого света сразу",
        },
        {
          en: "20:30 — Block blue light to let melatonin onset start on time",
          cs: "20:30 — Блокируй синий свет — чтобы мелатонин включался вовремя",
        },
        {
          en: "22:30 — Wind-down stack timed to your shifted curve",
          cs: "22:30 — Ритуал отбоя под твою смещённую кривую",
        },
      ],
    },
  },

  "depleted-engine": {
    weekThemes: [
      {
        en: "Rebuild the foundation: sleep + minerals",
        cs: "Фундамент заново: сон + минералы",
      },
      {
        en: "Stabilize blood sugar + fuel",
        cs: "Стабилизация сахара + питание",
      },
      {
        en: "Gentle capacity building",
        cs: "Мягкое наращивание выносливости",
      },
      {
        en: "Restoring reserves",
        cs: "Восстановление резервов",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Stop running on fumes — refill the tank before you ask it to perform.",
        cs: "Хватит ехать на парах — сначала наполни бак, потом требуй отдачи.",
      },
      actions: [
        {
          en: "07:30 — Protein + minerals within 30 min of waking — no coffee on empty",
          cs: "07:30 — Белок + минералы в первые 30 минут — никакого кофе натощак",
        },
        {
          en: "12:30 — Balanced midday meal to flatten the afternoon dip",
          cs: "12:30 — Сбалансированный обед, чтобы сгладить дневной провал",
        },
        {
          en: "20:00 — Pre-emptive wind-down before the 8pm crash drags you under",
          cs: "20:00 — Ранний отбой — до того как спад в 8 вечера утянет вниз",
        },
      ],
    },
  },

  "afternoon-crasher": {
    weekThemes: [
      {
        en: "Time your caffeine to your curve",
        cs: "Подстрой кофеин под свою кривую",
      },
      {
        en: "Defuse the 2pm crash",
        cs: "Обезвредь спад в 2 дня",
      },
      {
        en: "Harness the evening second wind",
        cs: "Используй вечернее второе дыхание",
      },
      {
        en: "Smoothing the whole curve",
        cs: "Выравниваем всю кривую",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Work with your late-rising cortisol — don't fight the curve, time it.",
        cs: "Работай с поздним кортизолом — не борись с кривой, а попадай в неё.",
      },
      actions: [
        {
          en: "09:15 — First caffeine only after cortisol peaks — earlier just blunts it",
          cs: "09:15 — Первый кофе только после пика кортизола — раньше он лишь притупляет",
        },
        {
          en: "13:30 — Pre-crash protein + 10 min walk to soften the 2–4pm dip",
          cs: "13:30 — Белок до спада + 10 минут ходьбы, чтобы смягчить провал 2–4 дня",
        },
        {
          en: "20:00 — Use the second wind for focused work — hard stop at 22:00",
          cs: "20:00 — Используй второе дыхание для фокуса — жёсткий стоп в 22:00",
        },
      ],
    },
  },

  "brain-fog-dominant": {
    weekThemes: [
      {
        en: "Clear the fog: hydration, protein, light",
        cs: "Разгоняем туман: вода, белок, свет",
      },
      {
        en: "Protect your focus windows",
        cs: "Защищаем окна концентрации",
      },
      {
        en: "Cognitive load management",
        cs: "Управление когнитивной нагрузкой",
      },
      {
        en: "Sustained mental clarity",
        cs: "Устойчивая ясность ума",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Your body's online before your brain is — close the gap.",
        cs: "Тело включается раньше мозга — сократи этот разрыв.",
      },
      actions: [
        {
          en: "07:00 — Water + protein + daylight before any demanding thinking",
          cs: "07:00 — Вода + белок + дневной свет до любой сложной задачи",
        },
        {
          en: "11:00 — Single-task your hardest cognitive work into the clear window",
          cs: "11:00 — Самую тяжёлую умственную работу — в одно ясное окно, без многозадачности",
        },
        {
          en: "15:00 — Movement break to break the afternoon fog",
          cs: "15:00 — Движение в перерыв, чтобы разбить дневной туман",
        },
      ],
    },
  },

  "stress-burnout-transitioning": {
    weekThemes: [
      {
        en: "Lower the baseline: stress offload",
        cs: "Снижаем фон: разгрузка стресса",
      },
      {
        en: "Rebuild recovery capacity",
        cs: "Восстанавливаем ресурс восстановления",
      },
      {
        en: "Reintroduce demand gently",
        cs: "Мягко возвращаем нагрузку",
      },
      {
        en: "Protecting the rebound",
        cs: "Защищаем восстановление",
      },
    ],
    week1Teaser: {
      theme: {
        en: "Turn the volume down on stress before rebuilding — recovery first.",
        cs: "Сначала убавь громкость стресса, потом восстанавливай — отдых первичен.",
      },
      actions: [
        {
          en: "07:30 — Slow start, no urgent inputs for the first 30 min — lowers the dread spike",
          cs: "07:30 — Медленный старт, никаких срочных входящих первые 30 минут — снижает утреннюю тревогу",
        },
        {
          en: "13:00 — Midday decompression: 10 min off-grid to stop stress stacking",
          cs: "13:00 — Дневная разгрузка: 10 минут офлайн, чтобы стресс не копился",
        },
        {
          en: "21:00 — Hard shutdown ritual so the mind stops after the body quits",
          cs: "21:00 — Жёсткий ритуал отключения — чтобы ум замолкал, когда тело уже сдалось",
        },
      ],
    },
  },
};

/**
 * Type-safe lookup helper.
 * Always returns a value because PhenotypeId is a closed union.
 */
export function getPhenotypePreview(id: PhenotypeId): PhenotypePreview {
  return PHENOTYPE_PREVIEWS[id];
}
