import type { PhenotypeData, PhenotypeId } from "@/types";

/**
 * Static reference data for the 6 supported phenotypes.
 *
 * AI returns only `phenotypeId`; the UI hydrates display data from this
 * lookup table. Energy curves use SVG viewBox 800x220:
 *   x-axis: 0=6am, 200=10am, 400=2pm, 600=6pm, 800=10pm (24h span)
 *   y-axis: 0=high energy (top), 220=low energy (bottom)
 *
 * All localized strings have EN and RU variants. The user-facing
 * language is determined by the `lang` value from useI18n() at render
 * time (NOT the language the plan was generated in — see Phase 2 design
 * notes).
 */
export const PHENOTYPES: Record<PhenotypeId, PhenotypeData> = {
  "wired-but-tired": {
    id: "wired-but-tired",
    typeNumber: 1,
    shortCode: "WT-01",
    name: {
      en: "Wired but tired",
      ru: "На взводе, но в нуле",
    },
    subtitle: {
      en: "Cortisol stays high when it shouldn't. Body wants rest, mind won't allow it. Sleep feels light and unfinished.",
      ru: "Кортизол высокий когда не должен. Тело просит отдыха, ум не отпускает. Сон лёгкий и не восстанавливает.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Wake feels alert", ru: "Утром в боевой готовности" },
        description: {
          en: "Cortisol spikes too early. You're up but not rested.",
          ru: "Кортизол выходит на пик слишком рано. Ты на ногах, но не отдохнул.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "No real crash", ru: "Без реального спада" },
        description: {
          en: "Body keeps pushing. Underneath it you're exhausted.",
          ru: "Тело продолжает работать. Под этим — истощение.",
        },
      },
      {
        kind: "evening",
        label: { en: "Can't wind down", ru: "Не получается выключиться" },
        description: {
          en: "Mind races at bedtime. Body too wired for sleep.",
          ru: "Ум гонит мысли в постели. Тело слишком взвинчено для сна.",
        },
      },
    ],
    peakHours: { en: "8am–11pm", ru: "08:00–23:00" },
    crashWindow: { en: "—", ru: "—" },
    secondWind: { en: "—", ru: "—" },
    energyCurve: "M 0,90 Q 100,60 200,60 T 400,70 T 600,80 T 800,150",
  },

  "crashed-circadian": {
    id: "crashed-circadian",
    typeNumber: 2,
    shortCode: "OC-02",
    name: {
      en: "Off-Clock",
      ru: "Сбитый ритм",
    },
    subtitle: {
      en: "Hard to wake up. Hard to fall asleep. Your circadian rhythm runs on a different timezone than your life.",
      ru: "Тяжело проснуться. Тяжело уснуть. Твой ритм живёт в другом часовом поясе, чем твоя жизнь.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Snooze cycles", ru: "Циклы будильника" },
        description: {
          en: "Cortisol curve fires hours late. Mornings feel impossible.",
          ru: "Кортизоловая кривая запаздывает на часы. Утро кажется невозможным.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Slow start, late peak", ru: "Медленный старт, поздний пик" },
        description: {
          en: "You finally feel awake when others wind down.",
          ru: "Ты только включаешься, когда все остальные сворачиваются.",
        },
      },
      {
        kind: "evening",
        label: { en: "Wide awake at midnight", ru: "Бодрый в полночь" },
        description: {
          en: "Your peak hits when you should be asleep.",
          ru: "Твой пик приходит, когда нужно спать.",
        },
      },
    ],
    peakHours: { en: "6pm–11pm", ru: "18:00–23:00" },
    crashWindow: { en: "8am–11am", ru: "08:00–11:00" },
    secondWind: { en: "—", ru: "—" },
    energyCurve: "M 0,170 Q 100,170 200,150 T 400,120 Q 500,70 600,60 T 800,90",
  },

  "depleted-engine": {
    id: "depleted-engine",
    typeNumber: 3,
    shortCode: "ET-03",
    name: {
      en: "Empty Tank",
      ru: "Пустой бак",
    },
    subtitle: {
      en: "Baseline energy is low—all day, every day. Caffeine barely registers. Recovery takes longer than it used to.",
      ru: "Базовая энергия низкая — весь день, каждый день. Кофе почти не действует. Восстановление занимает больше времени, чем раньше.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Tired on waking", ru: "Уставший с пробуждения" },
        description: {
          en: "Sleep didn't recharge you. Energy starts low.",
          ru: "Сон не зарядил. Энергия начинается с минимума.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Flat all day", ru: "Ровно низко весь день" },
        description: {
          en: "No real peaks. Caffeine barely shifts the line.",
          ru: "Никаких пиков. Кофе почти не двигает линию.",
        },
      },
      {
        kind: "evening",
        label: { en: "Crash by 8pm", ru: "Падаешь к 8 вечера" },
        description: {
          en: "Reserves run out. Sleep comes from exhaustion, not rhythm.",
          ru: "Резервы кончаются. Сон приходит от усталости, не от ритма.",
        },
      },
    ],
    peakHours: { en: "—", ru: "—" },
    crashWindow: { en: "All day", ru: "Весь день" },
    secondWind: { en: "—", ru: "—" },
    energyCurve: "M 0,160 Q 100,150 200,155 T 400,160 T 600,165 T 800,180",
  },

  "afternoon-crasher": {
    id: "afternoon-crasher",
    typeNumber: 4,
    shortCode: "AD-04",
    name: {
      en: "Adrenal Drift",
      ru: "Адреналовый дрейф",
    },
    subtitle: {
      en: "Mornings start slow. Cortisol peaks late. The 2 PM crash is steep but predictable—and the 8 PM second wind is real.",
      ru: "Утро начинается медленно. Кортизол выходит на пик поздно. Падение в 2 часа дня резкое, но предсказуемое — и второе дыхание в 8 вечера реально.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Slow start", ru: "Медленный старт" },
        description: {
          en: "Cortisol peaks late. Don't force coffee before 9am.",
          ru: "Кортизол выходит на пик поздно. Не форсируй кофе до 9 утра.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Steep 2–4pm crash", ru: "Резкий спад в 2–4 дня" },
        description: {
          en: "Predictable drop. Plan light tasks here.",
          ru: "Падение предсказуемо. Планируй на этот час лёгкие задачи.",
        },
      },
      {
        kind: "evening",
        label: { en: "8pm second wind", ru: "Второе дыхание в 8 вечера" },
        description: {
          en: "Use it. But cut sharp at 10pm.",
          ru: "Используй его. Но обрывай ровно в 10 вечера.",
        },
      },
    ],
    peakHours: { en: "10am–12pm", ru: "10:00–12:00" },
    crashWindow: { en: "2–4pm", ru: "14:00–16:00" },
    secondWind: { en: "8pm", ru: "20:00" },
    energyCurve:
      "M 0,180 Q 100,170 200,110 T 350,70 Q 400,65 450,170 T 600,90 T 800,180",
  },

  "brain-fog-dominant": {
    id: "brain-fog-dominant",
    typeNumber: 5,
    shortCode: "FS-05",
    name: {
      en: "Fog State",
      ru: "В тумане",
    },
    subtitle: {
      en: "Body has energy. Brain doesn't. Focus is short, decisions feel heavy, words don't come fast.",
      ru: "Тело есть. Мозг — нет. Концентрация короткая, решения даются тяжело, слова не приходят быстро.",
    },
    insights: [
      {
        kind: "morning",
        label: {
          en: "Energy ok, brain offline",
          ru: "Тело есть, голова — нет",
        },
        description: {
          en: "Body wakes faster than mind. Words come slow.",
          ru: "Тело просыпается быстрее ума. Слова приходят медленно.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Foggy under stress", ru: "Туман под нагрузкой" },
        description: {
          en: "Concentration breaks under load. Decisions feel heavy.",
          ru: "Концентрация рушится под нагрузкой. Решения даются тяжело.",
        },
      },
      {
        kind: "evening",
        label: { en: "Clearer at night", ru: "Ночью яснее" },
        description: {
          en: "Cognition returns when pressure drops.",
          ru: "Когнитивные функции возвращаются, когда давление спадает.",
        },
      },
    ],
    peakHours: { en: "10pm–midnight", ru: "22:00–00:00" },
    crashWindow: { en: "2–5pm", ru: "14:00–17:00" },
    secondWind: { en: "—", ru: "—" },
    energyCurve:
      "M 0,140 Q 100,100 200,80 T 350,90 Q 400,100 450,150 T 600,140 T 800,130",
  },

  "stress-burnout-transitioning": {
    id: "stress-burnout-transitioning",
    typeNumber: 6,
    shortCode: "BE-06",
    name: {
      en: "Burnout Edge",
      ru: "Грань выгорания",
    },
    subtitle: {
      en: "Still functioning, but barely. Stress feels louder than rest. Small things take more than they should.",
      ru: "Ещё функционируешь, но еле-еле. Стресс громче чем отдых. Мелочи требуют больше, чем должны.",
    },
    insights: [
      {
        kind: "morning",
        label: { en: "Dread before tasks", ru: "Тревога перед задачами" },
        description: {
          en: "Anticipation of effort feels louder than the effort itself.",
          ru: "Ожидание усилия громче самого усилия.",
        },
      },
      {
        kind: "afternoon",
        label: { en: "Stress amplifies", ru: "Стресс усиливается" },
        description: {
          en: "Small things take more than they should.",
          ru: "Мелочи требуют больше, чем должны.",
        },
      },
      {
        kind: "evening",
        label: { en: "Can't switch off", ru: "Не выключаешься" },
        description: {
          en: "Mind keeps working long after body wants rest.",
          ru: "Ум продолжает работать ещё долго после того, как тело хочет отдыха.",
        },
      },
    ],
    peakHours: { en: "11am–1pm", ru: "11:00–13:00" },
    crashWindow: { en: "3–6pm", ru: "15:00–18:00" },
    secondWind: { en: "—", ru: "—" },
    energyCurve:
      "M 0,150 Q 100,110 200,80 T 350,90 Q 400,100 500,160 T 700,170 T 800,170",
  },
};

/**
 * Type-safe lookup helper.
 * Always returns a value because PhenotypeId is a closed union.
 */
export function getPhenotype(id: PhenotypeId): PhenotypeData {
  return PHENOTYPES[id];
}

/**
 * All phenotype IDs in display order (1 through 6).
 * Useful for iteration in admin UIs, type guards, etc.
 */
export const ALL_PHENOTYPE_IDS: readonly PhenotypeId[] = [
  "wired-but-tired",
  "crashed-circadian",
  "depleted-engine",
  "afternoon-crasher",
  "brain-fog-dominant",
  "stress-burnout-transitioning",
] as const;
