import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  anthropic,
  MODEL,
  FREE_SYSTEM,
  PRO_SYSTEM,
  FREE_SCHEMA,
} from "@/lib/claude";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendPlanReady } from "@/lib/emails/send";
import type { QuizAnswers } from "@/types";

export type GenerateTier = "free" | "pro" | "coach";
export type GenerateLang = "en" | "ru";

const ProPlanSchema = z.object({
  summary: z.string().min(1),
  morningProtocol: z.array(z.string().min(1)).min(1),
  sleepProtocol: z.array(z.string().min(1)).min(1),
  supplements: z
    .array(
      z.object({
        name: z.string().min(1),
        dose: z.string().min(1),
        note: z.string().min(1),
      })
    )
    .min(1),
  nutrition: z.array(z.string().min(1)).min(1),
  stressProtocol: z.array(z.string().min(1)).min(1),
  thirtyDayPlan: z
    .array(
      z.object({
        week: z.number(),
        focus: z.string().min(1),
        actions: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
});

// ============================================
// V2 SCHEMAS — Dashboard redesign (Phase 1.3.b)
// Paid path validates against these. Legacy ProPlanSchema is kept
// intentionally above for rollback safety — it is currently unreferenced.
// ============================================

const ProtocolStepSchema = z.object({
  time: z.string(),
  action: z.string(),
  note: z.string(),
});

const WeekProtocolSchema = z.object({
  number: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  title: z.string(),
  focus: z.string(),
  nutritionFocus: z.array(z.string()).min(3).max(5),
  stressPractices: z.array(z.string()).min(3).max(5),
  keyActions: z.array(z.string()).min(2).max(3),
});

const SupplementItemSchema = z.object({
  name: z.string(),
  dose: z.string(),
  timing: z.string(),
  note: z.string(),
  startWeek: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

const PhenotypeIdSchema = z.enum([
  "wired-but-tired",
  "crashed-circadian",
  "depleted-engine",
  "afternoon-crasher",
  "brain-fog-dominant",
  "stress-burnout-transitioning",
]);

const ProPlanV2Schema = z.object({
  phenotypeId: PhenotypeIdSchema,
  summary: z.string(),
  morningProtocol: z.array(ProtocolStepSchema).min(3).max(6),
  sleepProtocol: z.array(ProtocolStepSchema).min(3).max(6),
  weeks: z.tuple([
    WeekProtocolSchema,
    WeekProtocolSchema,
    WeekProtocolSchema,
    WeekProtocolSchema,
  ]),
  supplements: z.array(SupplementItemSchema).min(3).max(6),
});

/** JSON shape description sent to the model in the paid-tier user prompt. */
const PRO_SCHEMA_V2 = `{
  "phenotypeId": "wired-but-tired" | "crashed-circadian" | "depleted-engine" | "afternoon-crasher" | "brain-fog-dominant" | "stress-burnout-transitioning",
  "summary": "2-3 sentences personalized to this user's situation, in the user's language",
  "morningProtocol": [
    { "time": "06:30", "action": "≤60 chars action", "note": "1 short why/how line" }
  ],
  "sleepProtocol": [
    { "time": "21:00", "action": "≤60 chars action", "note": "1 short why/how line" }
  ],
  "weeks": [
    {
      "number": 1,
      "title": "Short title for the week, e.g. 'Foundation reset'",
      "focus": "2-3 sentence description of what this week accomplishes",
      "nutritionFocus": ["3 to 5 nutrition items specific to this week"],
      "stressPractices": ["3 to 5 stress practices specific to this week"],
      "keyActions": ["2 to 3 highlighted key actions for the week"]
    }
    // exactly 4 week objects, numbered 1, 2, 3, 4 in order
  ],
  "supplements": [
    {
      "name": "Vitamin D3 + K2",
      "dose": "2000-4000 IU",
      "timing": "AM with breakfast",
      "note": "Why or how, 1-2 sentences",
      "startWeek": 1
    }
    // 3 to 6 supplements total
  ]
}`;

const FreeReportSchema = z.object({
  topIssues: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  tips: z.array(z.string().min(1)).min(1),
});

type ProfileLine = { en: string; ru: string };

function describe(
  key: keyof QuizAnswers,
  value: string | string[] | undefined
): ProfileLine | null {
  if (value === undefined) return null;
  if (typeof value === "string" && value.length === 0) return null;

  switch (key) {
    case "chronotype": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "early-bird": {
          en: "Chronotype: morning person (lark) — natural wake before 7am, peak alertness early in the day.",
          ru: "Хронотип: жаворонок — естественное пробуждение до 7 утра, пик активности в первой половине дня.",
        },
        intermediate: {
          en: "Chronotype: intermediate — natural wake 7-9am, peak in late morning to early afternoon.",
          ru: "Хронотип: промежуточный — естественное пробуждение в 7-9 утра, пик с позднего утра до раннего дня.",
        },
        "night-owl": {
          en: "Chronotype: night person (owl) — natural wake after 9am, peak alertness in late evening.",
          ru: "Хронотип: сова — естественное пробуждение после 9 утра, пик активности поздним вечером.",
        },
        irregular: {
          en: "Chronotype: irregular — no consistent natural sleep/wake pattern, suggesting circadian dysregulation.",
          ru: "Хронотип: нерегулярный — нет устойчивого естественного цикла сон/бодрствование, признак дисрегуляции циркадного ритма.",
        },
      };
      return map[value] ?? null;
    }
    case "age": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "18-24": { en: "Demographics: 18-24 years old.", ru: "Возраст: 18-24 года." },
        "25-34": { en: "Demographics: 25-34 years old.", ru: "Возраст: 25-34 года." },
        "35-44": {
          en: "Demographics: 35-44 years old (mitochondrial decline window begins in this bracket).",
          ru: "Возраст: 35-44 года (в этом диапазоне начинается окно митохондриального спада).",
        },
        "45-54": {
          en: "Demographics: 45-54 years old (perimenopause window for females; testosterone decline window for males).",
          ru: "Возраст: 45-54 года (окно перименопаузы у женщин; окно снижения тестостерона у мужчин).",
        },
        "55+": {
          en: "Demographics: 55+ years old (consider bloodwork before lifestyle interventions for unexplained fatigue).",
          ru: "Возраст: 55+ лет (при необъяснимой усталости — сначала анализы, потом коррекция образа жизни).",
        },
      };
      return map[value] ?? null;
    }
    case "energy": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "morning-peak": {
          en: "Energy pattern: strong morning, fades by afternoon — typical lark/cortisol-aligned pattern.",
          ru: "Паттерн энергии: сильное утро, угасает к обеду — типичный жаворонок, кривая выровнена с кортизолом.",
        },
        "afternoon-crash": {
          en: "Energy pattern: OK until 2pm then hard crash — typical post-lunch insulin/cortisol dip with glycemic instability overlay likely.",
          ru: "Паттерн энергии: норм до 2 дня, потом резкий спад — типичный послеобеденный инсулиновый/кортизоловый провал, вероятна нестабильность гликемии.",
        },
        "evening-peak": {
          en: "Energy pattern: slow morning, energy peaks by evening — typical owl pattern; may indicate phase-delayed circadian if forced into early schedule.",
          ru: "Паттерн энергии: медленное утро, пик к вечеру — типичный паттерн совы; может указывать на отставание фазы циркадного ритма при навязанном раннем графике.",
        },
        "flat-low": {
          en: "Energy pattern: low all day, no real peaks — chronic baseline fatigue without diurnal variation, suggests systemic issue not just timing.",
          ru: "Паттерн энергии: низкая весь день, без пиков — хроническая базовая усталость без суточной вариации, признак системной проблемы, а не только тайминга.",
        },
        "flat-high": {
          en: "Energy pattern: high all day, cannot switch off even when needed — classic Wired-but-tired/sympathetic-dominance pattern. Body operating in continuous arousal mode.",
          ru: "Паттерн энергии: высокая весь день, невозможно выключиться даже когда надо — классический паттерн «на взводе, но в нуле» / симпатическое доминирование. Тело в непрерывном режиме возбуждения.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepDuration": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "<6h": {
          en: "Sleep duration: less than 6 hours per night (deficit territory for nearly all adults).",
          ru: "Длительность сна: меньше 6 часов за ночь (зона дефицита для подавляющего большинства взрослых).",
        },
        "6-7h": {
          en: "Sleep duration: 6-7 hours per night (below optimal for most adults but not severe deficit).",
          ru: "Длительность сна: 6-7 часов за ночь (ниже оптимума для большинства взрослых, но не острый дефицит).",
        },
        "7-8h": {
          en: "Sleep duration: 7-8 hours per night (within recommended range).",
          ru: "Длительность сна: 7-8 часов за ночь (в рекомендуемом диапазоне).",
        },
        ">8h": {
          en: "Sleep duration: more than 8 hours per night.",
          ru: "Длительность сна: больше 8 часов за ночь.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepQuality": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        refreshed: {
          en: "Sleep quality: wakes refreshed and ready — sleep architecture intact.",
          ru: "Качество сна: просыпается бодрым и готовым — архитектура сна сохранна.",
        },
        groggy: {
          en: "Sleep quality: wakes groggy, needs 30+ minutes to alert — sleep inertia pattern, possible deeper-than-needed N3 sleep or interrupted REM at wake time.",
          ru: "Качество сна: просыпается заторможенным, нужно 30+ минут для включения — паттерн инерции сна, возможен слишком глубокий N3-сон или прерванная REM-фаза в момент пробуждения.",
        },
        tired: {
          en: "Sleep quality: wakes tired even after adequate duration — sleep ARCHITECTURE problem, not duration deficit. Suspect fragmented deep sleep, possible airway/cortisol/alcohol involvement.",
          ru: "Качество сна: просыпается уставшим даже после достаточной длительности — проблема АРХИТЕКТУРЫ сна, а не дефицита времени. Подозрение на фрагментированный глубокий сон, возможна роль дыхательных путей / кортизола / алкоголя.",
        },
        interrupted: {
          en: "Sleep quality: wakes 1-2+ times during the night — sleep maintenance insomnia. Suspect cortisol elevation, blood sugar instability, or stimulus (caffeine half-life, alcohol, fluid timing).",
          ru: "Качество сна: просыпается 1-2+ раза за ночь — инсомния поддержания сна. Подозрение на повышенный кортизол, нестабильность сахара крови или стимулы (период полувыведения кофеина, алкоголь, тайминг жидкости).",
        },
      };
      return map[value] ?? null;
    }
    case "caffeine": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        none: { en: "Caffeine intake: none.", ru: "Кофеин: не употребляет." },
        "1-2-morning": {
          en: "Caffeine intake: 1-2 cups daily, all before noon (well-timed for cortisol/sleep architecture).",
          ru: "Кофеин: 1-2 чашки в день, все до полудня (тайминг хорош для кортизола и архитектуры сна).",
        },
        "3+-morning": {
          en: "Caffeine intake: 3+ cups daily, all before noon (high amount but timing protects sleep — adrenal load on the high side).",
          ru: "Кофеин: 3+ чашек в день, все до полудня (количество высокое, но тайминг защищает сон — нагрузка на надпочечники выше нормы).",
        },
        "1-2-afternoon": {
          en: "Caffeine intake: 1-2 cups daily including at least one after 2pm (5-6h half-life means measurable amount in system at bedtime — likely fragmenting sleep architecture).",
          ru: "Кофеин: 1-2 чашки в день, минимум одна после 2 дня (период полувыведения 5-6 часов — к моменту отхода ко сну в системе остаётся измеримое количество, скорее всего фрагментирует архитектуру сна).",
        },
        "3+-afternoon": {
          en: "Caffeine intake: 3+ cups daily including afternoon/evening (substantial sleep-disrupting load, almost certainly contributing to interrupted/unrefreshing sleep).",
          ru: "Кофеин: 3+ чашек в день, включая день и вечер (существенная нарушающая сон нагрузка, почти наверняка вклад в прерывистый/не восстанавливающий сон).",
        },
        "energy-drinks": {
          en: "Caffeine source: mostly energy drinks or pre-workout formulas (high caffeine + frequent additional stimulants like taurine, beta-alanine, and added sugars; sugar crashes confound the energy picture).",
          ru: "Источник кофеина: в основном энергетики или pre-workout формулы (высокий кофеин + частые дополнительные стимуляторы — таурин, бета-аланин, добавленные сахара; сахарные спады искажают картину энергии).",
        },
      };
      return map[value] ?? null;
    }
    case "stressSymptoms": {
      if (!Array.isArray(value)) return null;
      // Filter the "none" sentinel — if it's present (alone or with others),
      // anything else in the array is treated as the real signal.
      const symptoms = value.filter((s) => s !== "none");
      if (symptoms.length === 0) {
        return {
          en: "Stress symptoms: none reported regularly.",
          ru: "Симптомы стресса: регулярно не наблюдаются.",
        };
      }
      const labelsEn: Record<string, string> = {
        "racing-thoughts": "racing thoughts / mental hyperarousal",
        "tension-headaches": "tension headaches / jaw clenching (somatic stress markers)",
        irritable: "low irritation threshold / patience deficit",
        "wired-cant-relax": "physical inability to relax (sympathetic dominance)",
        "dread-anxiety": "anticipatory anxiety / dread of upcoming events",
        overwhelmed: "feeling of being overwhelmed by daily load",
      };
      const labelsRu: Record<string, string> = {
        "racing-thoughts": "несущиеся мысли / ментальная гиперактивация",
        "tension-headaches": "головные боли напряжения / сжатие челюсти (соматические маркеры стресса)",
        irritable: "низкий порог раздражения / дефицит терпения",
        "wired-cant-relax": "физическая невозможность расслабиться (симпатическое доминирование)",
        "dread-anxiety": "предвосхищающая тревога / страх перед предстоящими событиями",
        overwhelmed: "ощущение перегрузки повседневными задачами",
      };
      const joinedEn = symptoms.map((s) => labelsEn[s] ?? s).join("; ");
      const joinedRu = symptoms.map((s) => labelsRu[s] ?? s).join("; ");

      let severityEn: string;
      let severityRu: string;
      if (symptoms.length <= 2) {
        severityEn = "mild";
        severityRu = "лёгкие";
      } else if (symptoms.length <= 4) {
        severityEn = "moderate-to-high, multi-system manifestation";
        severityRu = "умеренные-высокие, многосистемное проявление";
      } else {
        severityEn = "severe overload, classic HPA dysregulation candidate";
        severityRu = "тяжёлая перегрузка, классический кандидат на дисрегуляцию оси ГГН";
      }
      return {
        en: `Stress symptoms (${severityEn}): ${joinedEn}.`,
        ru: `Симптомы стресса (${severityRu}): ${joinedRu}.`,
      };
    }
    case "nutrition": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "skip-meals": {
          en: "Eating pattern: frequently skips breakfast or lunch (creates extended fasts that destabilize blood sugar, especially during cortisol-elevated morning hours).",
          ru: "Паттерн питания: часто пропускает завтрак или обед (создаёт удлинённые периоды голодания, дестабилизирующие сахар крови, особенно на фоне утренне-повышенного кортизола).",
        },
        irregular: {
          en: "Eating pattern: meals happen but timing varies significantly (disrupts circadian metabolic signaling).",
          ru: "Паттерн питания: приёмы пищи происходят, но время сильно варьируется (нарушает циркадную метаболическую сигнализацию).",
        },
        "regular-3": {
          en: "Eating pattern: 3 meals at consistent times (good baseline timing structure).",
          ru: "Паттерн питания: 3 приёма пищи в стабильное время (хорошая базовая временна́я структура).",
        },
        "regular-3-snacks": {
          en: "Eating pattern: 3 meals + planned snacks (consistent grazing pattern, good glycemic management).",
          ru: "Паттерн питания: 3 приёма + запланированные перекусы (стабильный паттерн дробного питания, хорошее управление гликемией).",
        },
        restricted: {
          en: "Eating pattern: follows a specific restrictive protocol (intermittent fasting, OMAD, ketogenic, or similar). Verify protocol fit with training load and chronotype before recommending changes.",
          ru: "Паттерн питания: соблюдает специфический ограничительный протокол (интервальное голодание, OMAD, кетогенный или подобный). Проверить совместимость протокола с тренировочной нагрузкой и хронотипом перед рекомендацией изменений.",
        },
      };
      return map[value] ?? null;
    }
    case "activity": {
      if (!Array.isArray(value)) return null;
      // Sedentary mutex (defensive): if "sedentary" is present alongside
      // other entries, render the sedentary framing and ignore the rest.
      // UI enforces the real mutex in Step 4 — this is a second line of defense.
      if (value.includes("sedentary")) {
        return {
          en: "Activity level: sedentary, less than 5k steps daily, no regular training.",
          ru: "Уровень активности: сидячий, меньше 5k шагов в день, нет регулярных тренировок.",
        };
      }
      if (value.length === 0) return null;
      const labelsEn: Record<string, string> = {
        walking: "regular walking / Zone 2 baseline movement",
        "cardio-moderate": "moderate cardio 2-3× per week (jogging, cycling, swimming)",
        strength: "strength training 1-3× per week (resistance/lifting)",
        combat: "combat sports 1-3× per week (boxing/BJJ/MMA — high cortisol stimulus + recovery demand)",
        "intense-cardio": "intense cardio 3+× per week (HIIT/CrossFit/distance running)",
        "mind-body": "yoga, Pilates, stretching practice",
        "daily-pro": "daily training, multiple disciplines or competitive level (recovery margin is thin)",
      };
      const labelsRu: Record<string, string> = {
        walking: "регулярная ходьба / базовое движение в Зоне 2",
        "cardio-moderate": "умеренное кардио 2-3× в неделю (бег, велосипед, плавание)",
        strength: "силовые тренировки 1-3× в неделю (резистенс/штанга)",
        combat: "боевые единоборства 1-3× в неделю (бокс/BJJ/MMA — высокий кортизоловый стимул и требования к восстановлению)",
        "intense-cardio": "интенсивное кардио 3+× в неделю (HIIT/CrossFit/бег на дистанции)",
        "mind-body": "йога, пилатес, практика растяжки",
        "daily-pro": "ежедневные тренировки, несколько дисциплин или соревновательный уровень (запас восстановления тонкий)",
      };
      if (value.length === 1) {
        const m = value[0];
        return {
          en: `Activity: ${labelsEn[m] ?? m}.`,
          ru: `Активность: ${labelsRu[m] ?? m}.`,
        };
      }
      const joinedEn = value.map((m) => labelsEn[m] ?? m).join(", ");
      const joinedRu = value.map((m) => labelsRu[m] ?? m).join(", ");
      return {
        en: `Activity mix: combines ${joinedEn}. Cumulative training load is significant — recovery infrastructure must match.`,
        ru: `Микс активности: сочетает ${joinedRu}. Суммарная тренировочная нагрузка существенная — инфраструктура восстановления должна соответствовать.`,
      };
    }
    case "priority": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        energy: {
          en: "User's stated priority — fix FIRST: energy stability. Weight protocol toward consistent, reliable daily energy.",
          ru: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: стабильность энергии. Сместить акцент протокола на устойчивую надёжную ежедневную энергию.",
        },
        sleep: {
          en: "User's stated priority — fix FIRST: sleep quality (not just duration). Weight protocol toward sleep architecture interventions.",
          ru: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: качество сна (не просто длительность). Сместить акцент протокола на вмешательства по архитектуре сна.",
        },
        focus: {
          en: "User's stated priority — fix FIRST: cognitive clarity / focus. Weight protocol toward cognition-supporting interventions.",
          ru: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: когнитивная ясность / фокус. Сместить акцент протокола на вмешательства, поддерживающие когницию.",
        },
        stress: {
          en: "User's stated priority — fix FIRST: stress regulation. Weight protocol toward HPA axis interventions.",
          ru: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: регуляция стресса. Сместить акцент протокола на вмешательства по оси ГГН.",
        },
        mood: {
          en: "User's stated priority — fix FIRST: mood / feeling like themselves. Weight protocol toward mood-supporting nutrition + lifestyle.",
          ru: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: настроение / возвращение к себе. Сместить акцент протокола на питание и образ жизни, поддерживающие настроение.",
        },
      };
      return map[value] ?? null;
    }
    case "biologicalSex": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        female: {
          en: "Biological sex: female. Consider iron status (ferritin), cycle-related symptom variation if reproductive age, perimenopause window if 35+, lower protein dose ceiling (~1.4-1.8 g/kg lean mass), calcium/magnesium ratio differs from male baseline.",
          ru: "Биологический пол: женский. Учитывать статус железа (ферритин), вариативность симптомов по фазам цикла в репродуктивном возрасте, окно перименопаузы при 35+, более низкий потолок белка (~1.4-1.8 г/кг сухой массы), соотношение кальция/магния отличается от мужского базиса.",
        },
        male: {
          en: "Biological sex: male. Iron deficiency is rare absent obvious cause; consider testosterone status if 35+ with low energy, higher protein dose ceiling (~1.6-2.2 g/kg lean mass).",
          ru: "Биологический пол: мужской. Дефицит железа редок без явной причины; при 35+ с низкой энергией учитывать статус тестостерона, более высокий потолок белка (~1.6-2.2 г/кг сухой массы).",
        },
        "prefer-not-say": {
          en: "Biological sex: not specified. Use gender-neutral nutritional baseline; flag sex-specific levers (iron, hormones, dose ranges) as clinician consultation points rather than recommendations.",
          ru: "Биологический пол: не указан. Использовать гендерно-нейтральный базис питания; пол-специфичные рычаги (железо, гормоны, дозировки) обозначить как точки консультации с клиницистом, а не как рекомендации.",
        },
      };
      return map[value] ?? null;
    }
  }
  return null;
}

function detectPatterns(a: QuizAnswers): ProfileLine[] {
  const signals: ProfileLine[] = [];
  const stressSymptoms = a.stressSymptoms ?? [];
  const activity = a.activity ?? [];
  const effectiveStress = stressSymptoms.filter((s) => s !== "none");

  // ===== CAFFEINE =====
  // H1: afternoon caffeine + impaired sleep quality
  if (
    (a.caffeine === "1-2-afternoon" || a.caffeine === "3+-afternoon") &&
    (a.sleepQuality === "interrupted" ||
      a.sleepQuality === "tired" ||
      a.sleepQuality === "groggy")
  ) {
    signals.push({
      en: "Afternoon caffeine + impaired sleep quality: 5-6 hour half-life means measurable amount in system at bedtime, directly fragmenting sleep architecture. The cutoff timing is the leverage point, not the amount.",
      ru: "Послеобеденный кофеин + сниженное качество сна: период полувыведения 5-6 часов означает, что к моменту сна в системе остаётся измеримое количество, напрямую фрагментирующее архитектуру сна. Рычаг — время отсечки, а не количество.",
    });
  }
  // H2: late + high caffeine + anxiety amplification
  if (
    a.caffeine === "3+-afternoon" &&
    effectiveStress.some(
      (s) => s === "wired-cant-relax" || s === "dread-anxiety" || s === "racing-thoughts"
    )
  ) {
    signals.push({
      en: "Late + high caffeine + anxiety amplification loop: caffeine sits upstream of multiple symptoms. Cutting afternoon caffeine first will often improve 2-3 downstream complaints simultaneously.",
      ru: "Поздний + высокий кофеин + петля усиления тревоги: кофеин стоит выше нескольких симптомов в цепочке. Убрав сначала послеобеденный кофеин, часто получаешь улучшение по 2-3 нижестоящим жалобам одновременно.",
    });
  }

  // ===== SLEEP =====
  // H3: >8h + impaired quality
  if (
    a.sleepDuration === ">8h" &&
    (a.sleepQuality === "tired" ||
      a.sleepQuality === "groggy" ||
      a.sleepQuality === "interrupted")
  ) {
    signals.push({
      en: "Sleeps 8+ hours but wakes unrested — this is a sleep ARCHITECTURE problem, not a duration deficit. Quality over quantity here: suspect fragmented deep sleep, possible airway/cortisol/alcohol involvement.",
      ru: "Спит 8+ часов, но просыпается невыспавшимся — это проблема АРХИТЕКТУРЫ сна, а не дефицита времени. Здесь важнее качество, а не количество: подозрение на фрагментированный глубокий сон, возможна роль дыхательных путей / кортизола / алкоголя.",
    });
  }
  // H4: short sleep + sedentary
  if (a.sleepDuration === "<6h" && activity.includes("sedentary")) {
    signals.push({
      en: "Short sleep + sedentary lifestyle compounds recovery debt. Sleep extension and gentle daily movement together produce more energy than either alone.",
      ru: "Короткий сон + сидячий образ жизни накладываются друг на друга по дефициту восстановления. Удлинение сна и мягкое ежедневное движение вместе дают больше энергии, чем каждое по отдельности.",
    });
  }

  // ===== CHRONOTYPE =====
  // H5: night-owl + interrupted sleep → social jet lag
  if (a.chronotype === "night-owl" && a.sleepQuality === "interrupted") {
    signals.push({
      en: "Social jet lag pattern — owl chronotype forced into early-bird schedule. Light exposure timing + cortisol curve are misaligned with the body's preferred phase. Morning bright light and consistent (not necessarily early) bedtime are the highest-yield levers.",
      ru: "Паттерн социального джетлага — хронотип совы, втиснутый в график жаворонка. Тайминг освещения и кортизоловая кривая рассинхронизированы с предпочтительной фазой тела. Самые сильные рычаги — утренний яркий свет и стабильное (не обязательно раннее) время отхода ко сну.",
    });
  }
  // H6: chronotype-energy mismatch
  if (
    (a.chronotype === "night-owl" && a.energy === "morning-peak") ||
    (a.chronotype === "early-bird" && a.energy === "evening-peak")
  ) {
    signals.push({
      en: "Chronotype-energy mismatch — user's natural pattern contradicts their stated energy peak. May indicate forced schedule, misreporting, or stimulant use masking the true pattern. Treat as ambiguous signal; weight other inputs more heavily.",
      ru: "Несоответствие хронотипа и энергии — естественный паттерн пользователя противоречит заявленному пику энергии. Может указывать на навязанный график, неточный самоотчёт или маскировку стимуляторами. Рассматривать как неоднозначный сигнал; больше веса другим вводам.",
    });
  }

  // ===== STRESS CLUSTERS =====
  // H7: multi-system stress overload
  if (effectiveStress.length >= 4) {
    signals.push({
      en: "Multi-system stress overload, classic HPA dysregulation candidate. Foundation interventions (magnesium, sleep, caffeine reduction) before adaptogens.",
      ru: "Многосистемная перегрузка стрессом, классический кандидат на дисрегуляцию оси ГГН. Базовые вмешательства (магний, сон, снижение кофеина) до адаптогенов.",
    });
  }
  // H8: wired-but-tired indicators
  if (
    effectiveStress.includes("racing-thoughts") &&
    effectiveStress.includes("wired-cant-relax") &&
    a.sleepQuality === "interrupted"
  ) {
    signals.push({
      en: "Wired-but-tired phenotype indicators: sympathetic dominance + sleep fragmentation. Magnesium glycinate (300-400mg evening) + L-theanine (200mg paired with caffeine) are the foundational pair with strongest evidence.",
      ru: "Индикаторы фенотипа «на взводе, но в нуле»: симпатическое доминирование + фрагментация сна. Магний глицинат (300-400 мг вечером) + L-теанин (200 мг в паре с кофеином) — базовая пара с наиболее сильной доказательной базой.",
    });
  }
  // H9: cortisol-driven irritability cluster
  if (
    effectiveStress.includes("tension-headaches") &&
    effectiveStress.includes("irritable") &&
    effectiveStress.includes("overwhelmed")
  ) {
    signals.push({
      en: "Cortisol-driven irritability cluster — magnesium (any well-absorbed form) + active B-complex have strongest evidence. Watch for jaw clenching as a marker to track improvement.",
      ru: "Кортизол-управляемый кластер раздражительности — магний (любая хорошо усваиваемая форма) + активный B-комплекс имеют наиболее сильную доказательную базу. Сжатие челюсти — удобный маркер для отслеживания прогресса.",
    });
  }

  // ===== SEX-SPECIFIC =====
  // H10: female reproductive age + flat-low → iron
  if (
    a.biologicalSex === "female" &&
    (a.age === "18-24" || a.age === "25-34" || a.age === "35-44") &&
    a.energy === "flat-low"
  ) {
    signals.push({
      en: "Female reproductive age + chronic low energy: ferritin and transferrin saturation are the highest-yield labs. Low iron is the #1 missed fatigue driver in this demographic, including in vegetarians/vegans and those with heavy cycles.",
      ru: "Женский репродуктивный возраст + хроническая низкая энергия: ферритин и насыщение трансферрина — самые продуктивные анализы. Низкое железо — драйвер усталости №1, который чаще всего пропускают в этой демографии, включая вегетарианок/веганок и женщин с обильными циклами.",
    });
  }
  // H11: perimenopause window indicators
  if (
    a.biologicalSex === "female" &&
    (a.age === "35-44" || a.age === "45-54") &&
    a.sleepQuality === "interrupted" &&
    effectiveStress.includes("dread-anxiety")
  ) {
    signals.push({
      en: "Perimenopause window indicators: track symptoms against cycle phase. B6 (P-5-P form) + magnesium glycinate + ashwagandha have evidence. Clinician consultation for full hormone panel (estradiol, progesterone, FSH, thyroid) warranted before extensive supplementation.",
      ru: "Индикаторы окна перименопаузы: отслеживать симптомы по фазам цикла. B6 (форма P-5-P) + магний глицинат + ашваганда имеют доказательную базу. Перед расширенным приёмом добавок — консультация клинициста с полной гормональной панелью (эстрадиол, прогестерон, ФСГ, щитовидка).",
    });
  }
  // H12: mid-life male + flat-low + impaired quality
  if (
    a.biologicalSex === "male" &&
    (a.age === "35-44" || a.age === "45-54" || a.age === "55+") &&
    a.energy === "flat-low" &&
    (a.sleepQuality === "tired" || a.sleepQuality === "groggy" || a.sleepQuality === "interrupted")
  ) {
    signals.push({
      en: "Mid-life male + flat low energy + impaired sleep quality: testosterone and thyroid bloodwork are the highest-yield diagnostics. Lifestyle optimization has limits when underlying hormonal/metabolic factors are present.",
      ru: "Мужчина среднего возраста + низкая ровная энергия + сниженное качество сна: тестостерон и анализы щитовидки — самые продуктивные диагностики. Оптимизация образа жизни имеет пределы, когда присутствуют гормональные/метаболические факторы.",
    });
  }

  // ===== ACTIVITY-RECOVERY =====
  // H13: high-stimulus training + multi-symptom stress
  if (
    (activity.includes("combat") || activity.includes("intense-cardio")) &&
    effectiveStress.length >= 3
  ) {
    signals.push({
      en: "High-stimulus training + multi-symptom stress: recovery debt accumulating. Magnesium higher (350-450mg), watch for overtraining markers (elevated resting HR, declining performance, frequent illness, mood disruption). Add a true rest day.",
      ru: "Высокостимульные тренировки + многосимптомный стресс: накапливается дефицит восстановления. Магний выше (350-450 мг), отслеживать маркеры перетренированности (повышенный ЧСС покоя, падающие показатели, частые болезни, нарушения настроения). Добавить настоящий день отдыха.",
    });
  }
  // H14: daily-pro + flat-low + impaired sleep → overtraining
  if (
    activity.includes("daily-pro") &&
    a.energy === "flat-low" &&
    (a.sleepQuality === "tired" || a.sleepQuality === "interrupted")
  ) {
    signals.push({
      en: "Possible overtraining or undereating. Before adding any supplement or training stimulus, verify: protein intake (1.6-2.2 g/kg lean mass), total caloric intake (RMR × activity factor), and consider a deload week as a diagnostic.",
      ru: "Возможна перетренированность или недоедание. До любых добавок и наращивания тренировочного стимула проверить: потребление белка (1.6-2.2 г/кг сухой массы), суммарную калорийность (RMR × коэффициент активности), и рассмотреть разгрузочную неделю как диагностический инструмент.",
    });
  }

  // ===== NUTRITION =====
  // H15: restricted + flat-low
  if (a.nutrition === "restricted" && a.energy === "flat-low") {
    signals.push({
      en: "Restrictive protocol (IF/keto/OMAD) + low energy: verify the protocol fits training load and chronotype. The protocol may be the issue, not a missing supplement. Re-feeding window adjustment is the first lever.",
      ru: "Ограничительный протокол (интервальное голодание/кето/OMAD) + низкая энергия: проверить совместимость протокола с тренировочной нагрузкой и хронотипом. Возможно, проблема в самом протоколе, а не в нехватающей добавке. Первый рычаг — коррекция окна питания.",
    });
  }
  // H16: skip-meals + afternoon-crash
  if (a.nutrition === "skip-meals" && a.energy === "afternoon-crash") {
    signals.push({
      en: "Reactive hypoglycemia / glycemic instability pattern. Protein-anchored breakfast within 60 minutes of waking is the single highest-impact intervention, with magnitude that exceeds most supplement effects.",
      ru: "Паттерн реактивной гипогликемии / нестабильности гликемии. Завтрак, заякоренный белком, в течение 60 минут после пробуждения — единственное вмешательство с наивысшим эффектом, превосходящим большинство добавок.",
    });
  }

  // ===== AGE / MITOCHONDRIAL =====
  // H17: 35-54 + flat-low or afternoon-crash → mitochondrial
  if (
    (a.age === "35-44" || a.age === "45-54") &&
    (a.energy === "flat-low" || a.energy === "afternoon-crash")
  ) {
    signals.push({
      en: "Mitochondrial decline begins in this bracket — CoQ10 ubiquinol becomes substantively more valuable. Pair with baseline labs (thyroid, vitamin D, B12, ferritin) before assuming the cause is dietary.",
      ru: "В этом возрастном диапазоне начинается митохондриальный спад — CoQ10 в форме убихинола становится существенно ценнее. Сочетать с базовыми анализами (щитовидка, витамин D, B12, ферритин) до того, как считать причиной питание.",
    });
  }
  // H18: 55+ + persistent fatigue → bloodwork first
  if (a.age === "55+" && (a.energy === "flat-low" || a.sleepQuality === "tired")) {
    signals.push({
      en: "55+ with persistent fatigue: bloodwork BEFORE supplements (thyroid panel, B12 / methylmalonic acid, ferritin, vitamin D, fasting glucose, lipids). Lifestyle optimization has clear limits when underlying causes may be clinical (hypothyroidism, B12 deficiency, sleep apnea).",
      ru: "55+ с постоянной усталостью: анализы ДО добавок (панель щитовидки, B12 / метилмалоновая кислота, ферритин, витамин D, глюкоза натощак, липиды). Оптимизация образа жизни имеет чёткие пределы, когда причины могут быть клиническими (гипотиреоз, дефицит B12, апноэ сна).",
    });
  }

  // ===== PRIORITY SIGNAL (always last, only if priority chosen) =====
  if (a.priority) {
    signals.push({
      en: `USER PRIORITY: this user explicitly chose '${a.priority}' as the first thing to fix. Weight the Today's Focus, Week 1 protocol, and supplement startWeek scheduling toward this priority. Do not let other signals dilute the priority weighting — it's the user's explicit value statement.`,
      ru: `ПРИОРИТЕТ ПОЛЬЗОВАТЕЛЯ: пользователь явно выбрал «${a.priority}» как первое, что нужно исправить. Сместить вес Today's Focus, протокола Недели 1 и расписания startWeek для добавок к этому приоритету. Не позволяй другим сигналам размывать приоритет — это явное ценностное утверждение пользователя.`,
    });
  }

  return signals;
}

function buildUserProfile(answers: QuizAnswers, lang: GenerateLang): string {
  const keys: (keyof QuizAnswers)[] = [
    "chronotype",
    "age",
    "energy",
    "sleepDuration",
    "sleepQuality",
    "caffeine",
    "stressSymptoms",
    "nutrition",
    "activity",
    "priority",
    "biologicalSex",
  ];
  const lines = keys
    .map((k) => describe(k, answers[k]))
    .filter((x): x is ProfileLine => x !== null)
    .map((p) => (lang === "ru" ? p.ru : p.en));

  const signals = detectPatterns(answers);

  const header = lang === "ru" ? "ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ" : "USER PROFILE";
  const signalsHeader = lang === "ru" ? "Сигналы паттернов:" : "Pattern signals:";
  const closing =
    lang === "ru"
      ? "Сгенерируй протокол на основе именно этого профиля."
      : "Generate the protocol based on this specific profile.";

  const parts: string[] = [header, "", ...lines];
  if (signals.length > 0) {
    parts.push("", signalsHeader);
    for (const s of signals) parts.push(`- ${lang === "ru" ? s.ru : s.en}`);
  }
  parts.push("", closing);
  return parts.join("\n");
}

function stripThinking(text: string): string {
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
}

function hadThinkingBlock(text: string): boolean {
  return /<thinking>[\s\S]*?<\/thinking>/.test(text);
}

function extractJson(text: string): unknown {
  const stripped = stripThinking(text);
  const fenced = stripped.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const raw = fenced ? fenced[1] : stripped;
  return JSON.parse(raw);
}

export type GenerateResult =
  | { ok: true; data: unknown }
  | { ok: false; status: number; error: string; detail?: string };

export async function generatePlan(params: {
  answers: QuizAnswers;
  lang: GenerateLang;
  tier: GenerateTier;
}): Promise<GenerateResult> {
  const { answers, lang, tier } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[generatePlan] ANTHROPIC_API_KEY is not set");
    return { ok: false, status: 500, error: "anthropic not configured" };
  }

  const isPaid = tier === "pro" || tier === "coach";
  const langName = lang === "ru" ? "Russian (русский)" : "English";
  const system = isPaid ? PRO_SYSTEM : FREE_SYSTEM;
  const schema = isPaid ? PRO_SCHEMA_V2 : FREE_SCHEMA;
  const validator = isPaid ? ProPlanV2Schema : FreeReportSchema;

  const userPrompt = `${buildUserProfile(answers, lang)}

Write your final output in ${langName}.

Begin with a <thinking> block analyzing this user's phenotype, root causes, and supplement selection (in English is fine). Then, on a new line after the closing </thinking> tag, output a JSON object that exactly matches this shape:
${schema}

Rules for the JSON output:
- Be specific to this profile, not generic. Reference the user's actual answers and pattern signals.
- Use concrete numbers, times, and dosages (e.g., "magnesium glycinate 300mg, 1 hour before bed").
- Voice: direct, warm, never preachy. No empty wellness platitudes.

CRITICAL: After </thinking>, output ONLY the JSON object. No explanation, no markdown fences, no preamble. The JSON must be complete and valid — every string must be closed, every array must end with ], every object must end with }.`;

  let response;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: isPaid ? 8000 : 3000,
      temperature: 1.0,
      // cache_control on system text blocks is supported at runtime (prompt caching
      // is GA) but the SDK types in ^0.32.1 omit it on TextBlockParam — cast to
      // unblock typecheck without bumping the SDK.
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ] as unknown as Anthropic.TextBlockParam[],
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generatePlan] anthropic call failed:", msg, err);
    return { ok: false, status: 502, error: "anthropic failed", detail: msg };
  }

  const usage = response.usage as
    | {
        input_tokens?: number;
        output_tokens?: number;
        cache_creation_input_tokens?: number;
        cache_read_input_tokens?: number;
      }
    | undefined;
  console.log("[generatePlan] usage", {
    tier,
    input_tokens: usage?.input_tokens,
    output_tokens: usage?.output_tokens,
    cache_creation_input_tokens: usage?.cache_creation_input_tokens,
    cache_read_input_tokens: usage?.cache_read_input_tokens,
    stop_reason: response.stop_reason,
  });

  if (response.stop_reason === "max_tokens") {
    console.warn("[generatePlan] response truncated by max_tokens cap", {
      tier,
      max_tokens: isPaid ? 8000 : 3000,
      output_tokens: usage?.output_tokens,
    });
    return {
      ok: false,
      status: 500,
      error: "generation_truncated",
      detail: "Plan generation exceeded token budget",
    };
  }

  const textBlock = response.content.find((c) => c.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    console.error("[generatePlan] empty response — no text block");
    return { ok: false, status: 500, error: "empty response" };
  }

  const rawText = textBlock.text;
  const stripped = stripThinking(rawText);
  if (stripped.length === 0 || !stripped.includes("{")) {
    console.error("[generatePlan] No JSON after thinking block — likely truncated mid-thinking", {
      tier,
      totalLength: rawText.length,
      strippedLength: stripped.length,
      hadThinking: hadThinkingBlock(rawText),
      stopReason: response.stop_reason,
      lastChars: rawText.slice(-200),
    });
    return {
      ok: false,
      status: 502,
      error: "no_json_after_thinking",
      detail: "Model emitted thinking but no JSON — likely truncated",
    };
  }

  let parsed: unknown;
  try {
    parsed = extractJson(rawText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generatePlan] parse failed", {
      error: msg,
      lastChars: rawText.slice(-200),
      totalLength: rawText.length,
      stopReason: response.stop_reason,
      hadThinking: hadThinkingBlock(rawText),
    });
    return { ok: false, status: 502, error: "invalid model output", detail: msg };
  }

  const validation = validator.safeParse(parsed);
  if (!validation.success) {
    const detail = validation.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    console.error(
      "[generatePlan] schema validation failed:",
      detail,
      "\n--- PARSED ---\n",
      JSON.stringify(parsed, null, 2)
    );
    return { ok: false, status: 502, error: "schema validation failed", detail };
  }

  return { ok: true, data: validation.data };
}

function extractSummary(planData: unknown, lang: GenerateLang): string {
  const raw =
    planData && typeof planData === "object" && "summary" in planData
      ? String((planData as { summary: unknown }).summary ?? "")
      : "";

  const cleaned = raw
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return lang === "ru"
      ? "Ваш персональный 30-дневный энергетический протокол готов."
      : "Your personalized 30-day energy protocol is ready.";
  }

  if (cleaned.length <= 200) return cleaned;
  return cleaned.slice(0, 200).trimEnd() + "…";
}

// Background-job entry point. Wrapped by waitUntil() in the webhook so plan
// generation runs after the webhook has already returned 200 to Stripe.
// Always writes a row to plans — on success with plan_data, on failure with
// { error, detail } so the dashboard polling can surface a clear error state
// instead of polling forever.
export async function generateAndSavePlan(params: {
  userId: string;
  sessionId: string;
  answers: QuizAnswers;
  lang: GenerateLang;
  tier: GenerateTier;
}): Promise<void> {
  const { userId, sessionId, answers, lang, tier } = params;
  console.log("[generateAndSavePlan] background plan generation started", {
    sessionId,
    userId,
    tier,
  });

  const admin = createAdminClient();
  const result = await generatePlan({ answers, lang, tier });

  const planRow: Record<string, unknown> = {
    user_id: userId,
    tier,
    answers,
    language: lang,
    stripe_session_id: sessionId,
  };

  if (result.ok) {
    planRow.plan_data = result.data;
  } else {
    console.error("[generateAndSavePlan] generation failed — saving error marker", {
      sessionId,
      error: result.error,
      detail: result.detail,
    });
    planRow.plan_data = { error: result.error, detail: result.detail ?? null };
  }

  const { data: insertedPlan, error: insertErr } = await admin
    .from("plans")
    .insert(planRow)
    .select("id")
    .single();
  if (insertErr) {
    console.error("[generateAndSavePlan] plans insert failed:", insertErr);
    return;
  }

  if (result.ok) {
    console.log("[generateAndSavePlan] saved plan for session", sessionId);
  } else {
    console.log("[generateAndSavePlan] saved error marker for session", sessionId);
  }

  // Plan-ready email — only when generation succeeded for a paid tier.
  // Best-effort: never blocks; logs success/failure.
  if (!result.ok || tier === "free") return;

  const planId = insertedPlan?.id as string | undefined;
  if (!planId) {
    console.warn("[generateAndSavePlan] missing plan id after insert — skipping plan-ready email");
    return;
  }

  let userEmail: string | null = null;
  try {
    const { data: userData, error: userErr } = await admin.auth.admin.getUserById(userId);
    if (userErr) {
      console.warn("[generateAndSavePlan] getUserById failed for plan-ready email:", userErr);
    } else {
      userEmail = userData?.user?.email ?? null;
    }
  } catch (err) {
    console.warn("[generateAndSavePlan] getUserById threw for plan-ready email:", err);
  }

  if (!userEmail) {
    console.warn(`[generateAndSavePlan] no email for userId=${userId} — skipping plan-ready email`);
    return;
  }

  const summary = extractSummary(result.data, lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.energyforge.app";

  const emailResult = await sendPlanReady(
    {
      to: userEmail,
      locale: lang,
      dashboardUrl: `${siteUrl}/dashboard`,
      planPreview: summary,
    },
    `plan-ready:${planId}`
  );

  if (emailResult.success) {
    console.log(`[generateAndSavePlan] Plan-ready email sent: id=${emailResult.id} to=${userEmail} planId=${planId}`);
  } else {
    console.error(`[generateAndSavePlan] Plan-ready email failed: ${emailResult.error} to=${userEmail} planId=${planId}`);
  }
}
