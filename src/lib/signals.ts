import type { QuizAnswers } from "@/types";

// ============================================
// Pure signal-derivation helpers shared between server (generatePlan)
// and client (free preview). No Anthropic SDK, no Supabase, no env vars —
// safe to import from any "use client" component.
// ============================================

export type ProfileLine = { en: string; cs: string };

export function describe(
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
          cs: "Хронотип: жаворонок — естественное пробуждение до 7 утра, пик активности в первой половине дня.",
        },
        intermediate: {
          en: "Chronotype: intermediate — natural wake 7-9am, peak in late morning to early afternoon.",
          cs: "Хронотип: промежуточный — естественное пробуждение в 7-9 утра, пик с позднего утра до раннего дня.",
        },
        "night-owl": {
          en: "Chronotype: night person (owl) — natural wake after 9am, peak alertness in late evening.",
          cs: "Хронотип: сова — естественное пробуждение после 9 утра, пик активности поздним вечером.",
        },
        irregular: {
          en: "Chronotype: irregular — no consistent natural sleep/wake pattern, suggesting circadian dysregulation.",
          cs: "Хронотип: нерегулярный — нет устойчивого естественного цикла сон/бодрствование, признак дисрегуляции циркадного ритма.",
        },
      };
      return map[value] ?? null;
    }
    case "age": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "18-24": { en: "Demographics: 18-24 years old.", cs: "Возраст: 18-24 года." },
        "25-34": { en: "Demographics: 25-34 years old.", cs: "Возраст: 25-34 года." },
        "35-44": {
          en: "Demographics: 35-44 years old (mitochondrial decline window begins in this bracket).",
          cs: "Возраст: 35-44 года (в этом диапазоне начинается окно митохондриального спада).",
        },
        "45-54": {
          en: "Demographics: 45-54 years old (perimenopause window for females; testosterone decline window for males).",
          cs: "Возраст: 45-54 года (окно перименопаузы у женщин; окно снижения тестостерона у мужчин).",
        },
        "55+": {
          en: "Demographics: 55+ years old (consider bloodwork before lifestyle interventions for unexplained fatigue).",
          cs: "Возраст: 55+ лет (при необъяснимой усталости — сначала анализы, потом коррекция образа жизни).",
        },
      };
      return map[value] ?? null;
    }
    case "energy": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "morning-peak": {
          en: "Energy pattern: strong morning, fades by afternoon — typical lark/cortisol-aligned pattern.",
          cs: "Паттерн энергии: сильное утро, угасает к обеду — типичный жаворонок, кривая выровнена с кортизолом.",
        },
        "afternoon-crash": {
          en: "Energy pattern: OK until 2pm then hard crash — typical post-lunch insulin/cortisol dip with glycemic instability overlay likely.",
          cs: "Паттерн энергии: норм до 2 дня, потом резкий спад — типичный послеобеденный инсулиновый/кортизоловый провал, вероятна нестабильность гликемии.",
        },
        "evening-peak": {
          en: "Energy pattern: slow morning, energy peaks by evening — typical owl pattern; may indicate phase-delayed circadian if forced into early schedule.",
          cs: "Паттерн энергии: медленное утро, пик к вечеру — типичный паттерн совы; может указывать на отставание фазы циркадного ритма при навязанном раннем графике.",
        },
        "flat-low": {
          en: "Energy pattern: low all day, no real peaks — chronic baseline fatigue without diurnal variation, suggests systemic issue not just timing.",
          cs: "Паттерн энергии: низкая весь день, без пиков — хроническая базовая усталость без суточной вариации, признак системной проблемы, а не только тайминга.",
        },
        "flat-high": {
          en: "Energy pattern: high all day, cannot switch off even when needed — classic Wired-but-tired/sympathetic-dominance pattern. Body operating in continuous arousal mode.",
          cs: "Паттерн энергии: высокая весь день, невозможно выключиться даже когда надо — классический паттерн «на взводе, но в нуле» / симпатическое доминирование. Тело в непрерывном режиме возбуждения.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepDuration": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "<6h": {
          en: "Sleep duration: less than 6 hours per night (deficit territory for nearly all adults).",
          cs: "Длительность сна: меньше 6 часов за ночь (зона дефицита для подавляющего большинства взрослых).",
        },
        "6-7h": {
          en: "Sleep duration: 6-7 hours per night (below optimal for most adults but not severe deficit).",
          cs: "Длительность сна: 6-7 часов за ночь (ниже оптимума для большинства взрослых, но не острый дефицит).",
        },
        "7-8h": {
          en: "Sleep duration: 7-8 hours per night (within recommended range).",
          cs: "Длительность сна: 7-8 часов за ночь (в рекомендуемом диапазоне).",
        },
        ">8h": {
          en: "Sleep duration: more than 8 hours per night.",
          cs: "Длительность сна: больше 8 часов за ночь.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepQuality": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        refreshed: {
          en: "Sleep quality: wakes refreshed and ready — sleep architecture intact.",
          cs: "Качество сна: просыпается бодрым и готовым — архитектура сна сохранна.",
        },
        groggy: {
          en: "Sleep quality: wakes groggy, needs 30+ minutes to alert — sleep inertia pattern, possible deeper-than-needed N3 sleep or interrupted REM at wake time.",
          cs: "Качество сна: просыпается заторможенным, нужно 30+ минут для включения — паттерн инерции сна, возможен слишком глубокий N3-сон или прерванная REM-фаза в момент пробуждения.",
        },
        tired: {
          en: "Sleep quality: wakes tired even after adequate duration — sleep ARCHITECTURE problem, not duration deficit. Suspect fragmented deep sleep, possible airway/cortisol/alcohol involvement.",
          cs: "Качество сна: просыпается уставшим даже после достаточной длительности — проблема АРХИТЕКТУРЫ сна, а не дефицита времени. Подозрение на фрагментированный глубокий сон, возможна роль дыхательных путей / кортизола / алкоголя.",
        },
        interrupted: {
          en: "Sleep quality: wakes 1-2+ times during the night — sleep maintenance insomnia. Suspect cortisol elevation, blood sugar instability, or stimulus (caffeine half-life, alcohol, fluid timing).",
          cs: "Качество сна: просыпается 1-2+ раза за ночь — инсомния поддержания сна. Подозрение на повышенный кортизол, нестабильность сахара крови или стимулы (период полувыведения кофеина, алкоголь, тайминг жидкости).",
        },
      };
      return map[value] ?? null;
    }
    case "caffeine": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        none: { en: "Caffeine intake: none.", cs: "Кофеин: не употребляет." },
        "1-2-morning": {
          en: "Caffeine intake: 1-2 cups daily, all before noon (well-timed for cortisol/sleep architecture).",
          cs: "Кофеин: 1-2 чашки в день, все до полудня (тайминг хорош для кортизола и архитектуры сна).",
        },
        "3+-morning": {
          en: "Caffeine intake: 3+ cups daily, all before noon (high amount but timing protects sleep — adrenal load on the high side).",
          cs: "Кофеин: 3+ чашек в день, все до полудня (количество высокое, но тайминг защищает сон — нагрузка на надпочечники выше нормы).",
        },
        "1-2-afternoon": {
          en: "Caffeine intake: 1-2 cups daily including at least one after 2pm (5-6h half-life means measurable amount in system at bedtime — likely fragmenting sleep architecture).",
          cs: "Кофеин: 1-2 чашки в день, минимум одна после 2 дня (период полувыведения 5-6 часов — к моменту отхода ко сну в системе остаётся измеримое количество, скорее всего фрагментирует архитектуру сна).",
        },
        "3+-afternoon": {
          en: "Caffeine intake: 3+ cups daily including afternoon/evening (substantial sleep-disrupting load, almost certainly contributing to interrupted/unrefreshing sleep).",
          cs: "Кофеин: 3+ чашек в день, включая день и вечер (существенная нарушающая сон нагрузка, почти наверняка вклад в прерывистый/не восстанавливающий сон).",
        },
        "energy-drinks": {
          en: "Caffeine source: mostly energy drinks or pre-workout formulas (high caffeine + frequent additional stimulants like taurine, beta-alanine, and added sugars; sugar crashes confound the energy picture).",
          cs: "Источник кофеина: в основном энергетики или pre-workout формулы (высокий кофеин + частые дополнительные стимуляторы — таурин, бета-аланин, добавленные сахара; сахарные спады искажают картину энергии).",
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
          cs: "Симптомы стресса: регулярно не наблюдаются.",
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
        cs: `Симптомы стресса (${severityRu}): ${joinedRu}.`,
      };
    }
    case "nutrition": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "skip-meals": {
          en: "Eating pattern: frequently skips breakfast or lunch (creates extended fasts that destabilize blood sugar, especially during cortisol-elevated morning hours).",
          cs: "Паттерн питания: часто пропускает завтрак или обед (создаёт удлинённые периоды голодания, дестабилизирующие сахар крови, особенно на фоне утренне-повышенного кортизола).",
        },
        irregular: {
          en: "Eating pattern: meals happen but timing varies significantly (disrupts circadian metabolic signaling).",
          cs: "Паттерн питания: приёмы пищи происходят, но время сильно варьируется (нарушает циркадную метаболическую сигнализацию).",
        },
        "regular-3": {
          en: "Eating pattern: 3 meals at consistent times (good baseline timing structure).",
          cs: "Паттерн питания: 3 приёма пищи в стабильное время (хорошая базовая временна́я структура).",
        },
        "regular-3-snacks": {
          en: "Eating pattern: 3 meals + planned snacks (consistent grazing pattern, good glycemic management).",
          cs: "Паттерн питания: 3 приёма + запланированные перекусы (стабильный паттерн дробного питания, хорошее управление гликемией).",
        },
        restricted: {
          en: "Eating pattern: follows a specific restrictive protocol (intermittent fasting, OMAD, ketogenic, or similar). Verify protocol fit with training load and chronotype before recommending changes.",
          cs: "Паттерн питания: соблюдает специфический ограничительный протокол (интервальное голодание, OMAD, кетогенный или подобный). Проверить совместимость протокола с тренировочной нагрузкой и хронотипом перед рекомендацией изменений.",
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
          cs: "Уровень активности: сидячий, меньше 5k шагов в день, нет регулярных тренировок.",
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
          cs: `Активность: ${labelsRu[m] ?? m}.`,
        };
      }
      const joinedEn = value.map((m) => labelsEn[m] ?? m).join(", ");
      const joinedRu = value.map((m) => labelsRu[m] ?? m).join(", ");
      return {
        en: `Activity mix: combines ${joinedEn}. Cumulative training load is significant — recovery infrastructure must match.`,
        cs: `Микс активности: сочетает ${joinedRu}. Суммарная тренировочная нагрузка существенная — инфраструктура восстановления должна соответствовать.`,
      };
    }
    case "priority": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        energy: {
          en: "User's stated priority — fix FIRST: energy stability. Weight protocol toward consistent, reliable daily energy.",
          cs: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: стабильность энергии. Сместить акцент протокола на устойчивую надёжную ежедневную энергию.",
        },
        sleep: {
          en: "User's stated priority — fix FIRST: sleep quality (not just duration). Weight protocol toward sleep architecture interventions.",
          cs: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: качество сна (не просто длительность). Сместить акцент протокола на вмешательства по архитектуре сна.",
        },
        focus: {
          en: "User's stated priority — fix FIRST: cognitive clarity / focus. Weight protocol toward cognition-supporting interventions.",
          cs: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: когнитивная ясность / фокус. Сместить акцент протокола на вмешательства, поддерживающие когницию.",
        },
        stress: {
          en: "User's stated priority — fix FIRST: stress regulation. Weight protocol toward HPA axis interventions.",
          cs: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: регуляция стресса. Сместить акцент протокола на вмешательства по оси ГГН.",
        },
        mood: {
          en: "User's stated priority — fix FIRST: mood / feeling like themselves. Weight protocol toward mood-supporting nutrition + lifestyle.",
          cs: "Заявленный приоритет пользователя — исправить В ПЕРВУЮ ОЧЕРЕДЬ: настроение / возвращение к себе. Сместить акцент протокола на питание и образ жизни, поддерживающие настроение.",
        },
      };
      return map[value] ?? null;
    }
    case "biologicalSex": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        female: {
          en: "Biological sex: female. Consider iron status (ferritin), cycle-related symptom variation if reproductive age, perimenopause window if 35+, lower protein dose ceiling (~1.4-1.8 g/kg lean mass), calcium/magnesium ratio differs from male baseline.",
          cs: "Биологический пол: женский. Учитывать статус железа (ферритин), вариативность симптомов по фазам цикла в репродуктивном возрасте, окно перименопаузы при 35+, более низкий потолок белка (~1.4-1.8 г/кг сухой массы), соотношение кальция/магния отличается от мужского базиса.",
        },
        male: {
          en: "Biological sex: male. Iron deficiency is rare absent obvious cause; consider testosterone status if 35+ with low energy, higher protein dose ceiling (~1.6-2.2 g/kg lean mass).",
          cs: "Биологический пол: мужской. Дефицит железа редок без явной причины; при 35+ с низкой энергией учитывать статус тестостерона, более высокий потолок белка (~1.6-2.2 г/кг сухой массы).",
        },
        "prefer-not-say": {
          en: "Biological sex: not specified. Use gender-neutral nutritional baseline; flag sex-specific levers (iron, hormones, dose ranges) as clinician consultation points rather than recommendations.",
          cs: "Биологический пол: не указан. Использовать гендерно-нейтральный базис питания; пол-специфичные рычаги (железо, гормоны, дозировки) обозначить как точки консультации с клиницистом, а не как рекомендации.",
        },
      };
      return map[value] ?? null;
    }
  }
  return null;
}

export function detectPatterns(a: QuizAnswers): ProfileLine[] {
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
      cs: "Послеобеденный кофеин + сниженное качество сна: период полувыведения 5-6 часов означает, что к моменту сна в системе остаётся измеримое количество, напрямую фрагментирующее архитектуру сна. Рычаг — время отсечки, а не количество.",
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
      cs: "Поздний + высокий кофеин + петля усиления тревоги: кофеин стоит выше нескольких симптомов в цепочке. Убрав сначала послеобеденный кофеин, часто получаешь улучшение по 2-3 нижестоящим жалобам одновременно.",
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
      cs: "Спит 8+ часов, но просыпается невыспавшимся — это проблема АРХИТЕКТУРЫ сна, а не дефицита времени. Здесь важнее качество, а не количество: подозрение на фрагментированный глубокий сон, возможна роль дыхательных путей / кортизола / алкоголя.",
    });
  }
  // H4: short sleep + sedentary
  if (a.sleepDuration === "<6h" && activity.includes("sedentary")) {
    signals.push({
      en: "Short sleep + sedentary lifestyle compounds recovery debt. Sleep extension and gentle daily movement together produce more energy than either alone.",
      cs: "Короткий сон + сидячий образ жизни накладываются друг на друга по дефициту восстановления. Удлинение сна и мягкое ежедневное движение вместе дают больше энергии, чем каждое по отдельности.",
    });
  }

  // ===== CHRONOTYPE =====
  // H5: night-owl + interrupted sleep → social jet lag
  if (a.chronotype === "night-owl" && a.sleepQuality === "interrupted") {
    signals.push({
      en: "Social jet lag pattern — owl chronotype forced into early-bird schedule. Light exposure timing + cortisol curve are misaligned with the body's preferred phase. Morning bright light and consistent (not necessarily early) bedtime are the highest-yield levers.",
      cs: "Паттерн социального джетлага — хронотип совы, втиснутый в график жаворонка. Тайминг освещения и кортизоловая кривая рассинхронизированы с предпочтительной фазой тела. Самые сильные рычаги — утренний яркий свет и стабильное (не обязательно раннее) время отхода ко сну.",
    });
  }
  // H6: chronotype-energy mismatch
  if (
    (a.chronotype === "night-owl" && a.energy === "morning-peak") ||
    (a.chronotype === "early-bird" && a.energy === "evening-peak")
  ) {
    signals.push({
      en: "Chronotype-energy mismatch — user's natural pattern contradicts their stated energy peak. May indicate forced schedule, misreporting, or stimulant use masking the true pattern. Treat as ambiguous signal; weight other inputs more heavily.",
      cs: "Несоответствие хронотипа и энергии — естественный паттерн пользователя противоречит заявленному пику энергии. Может указывать на навязанный график, неточный самоотчёт или маскировку стимуляторами. Рассматривать как неоднозначный сигнал; больше веса другим вводам.",
    });
  }

  // ===== STRESS CLUSTERS =====
  // H7: multi-system stress overload
  if (effectiveStress.length >= 4) {
    signals.push({
      en: "Multi-system stress overload, classic HPA dysregulation candidate. Foundation interventions (magnesium, sleep, caffeine reduction) before adaptogens.",
      cs: "Многосистемная перегрузка стрессом, классический кандидат на дисрегуляцию оси ГГН. Базовые вмешательства (магний, сон, снижение кофеина) до адаптогенов.",
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
      cs: "Индикаторы фенотипа «на взводе, но в нуле»: симпатическое доминирование + фрагментация сна. Магний глицинат (300-400 мг вечером) + L-теанин (200 мг в паре с кофеином) — базовая пара с наиболее сильной доказательной базой.",
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
      cs: "Кортизол-управляемый кластер раздражительности — магний (любая хорошо усваиваемая форма) + активный B-комплекс имеют наиболее сильную доказательную базу. Сжатие челюсти — удобный маркер для отслеживания прогресса.",
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
      cs: "Женский репродуктивный возраст + хроническая низкая энергия: ферритин и насыщение трансферрина — самые продуктивные анализы. Низкое железо — драйвер усталости №1, который чаще всего пропускают в этой демографии, включая вегетарианок/веганок и женщин с обильными циклами.",
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
      cs: "Индикаторы окна перименопаузы: отслеживать симптомы по фазам цикла. B6 (форма P-5-P) + магний глицинат + ашваганда имеют доказательную базу. Перед расширенным приёмом добавок — консультация клинициста с полной гормональной панелью (эстрадиол, прогестерон, ФСГ, щитовидка).",
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
      cs: "Мужчина среднего возраста + низкая ровная энергия + сниженное качество сна: тестостерон и анализы щитовидки — самые продуктивные диагностики. Оптимизация образа жизни имеет пределы, когда присутствуют гормональные/метаболические факторы.",
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
      cs: "Высокостимульные тренировки + многосимптомный стресс: накапливается дефицит восстановления. Магний выше (350-450 мг), отслеживать маркеры перетренированности (повышенный ЧСС покоя, падающие показатели, частые болезни, нарушения настроения). Добавить настоящий день отдыха.",
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
      cs: "Возможна перетренированность или недоедание. До любых добавок и наращивания тренировочного стимула проверить: потребление белка (1.6-2.2 г/кг сухой массы), суммарную калорийность (RMR × коэффициент активности), и рассмотреть разгрузочную неделю как диагностический инструмент.",
    });
  }

  // ===== NUTRITION =====
  // H15: restricted + flat-low
  if (a.nutrition === "restricted" && a.energy === "flat-low") {
    signals.push({
      en: "Restrictive protocol (IF/keto/OMAD) + low energy: verify the protocol fits training load and chronotype. The protocol may be the issue, not a missing supplement. Re-feeding window adjustment is the first lever.",
      cs: "Ограничительный протокол (интервальное голодание/кето/OMAD) + низкая энергия: проверить совместимость протокола с тренировочной нагрузкой и хронотипом. Возможно, проблема в самом протоколе, а не в нехватающей добавке. Первый рычаг — коррекция окна питания.",
    });
  }
  // H16: skip-meals + afternoon-crash
  if (a.nutrition === "skip-meals" && a.energy === "afternoon-crash") {
    signals.push({
      en: "Reactive hypoglycemia / glycemic instability pattern. Protein-anchored breakfast within 60 minutes of waking is the single highest-impact intervention, with magnitude that exceeds most supplement effects.",
      cs: "Паттерн реактивной гипогликемии / нестабильности гликемии. Завтрак, заякоренный белком, в течение 60 минут после пробуждения — единственное вмешательство с наивысшим эффектом, превосходящим большинство добавок.",
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
      cs: "В этом возрастном диапазоне начинается митохондриальный спад — CoQ10 в форме убихинола становится существенно ценнее. Сочетать с базовыми анализами (щитовидка, витамин D, B12, ферритин) до того, как считать причиной питание.",
    });
  }
  // H18: 55+ + persistent fatigue → bloodwork first
  if (a.age === "55+" && (a.energy === "flat-low" || a.sleepQuality === "tired")) {
    signals.push({
      en: "55+ with persistent fatigue: bloodwork BEFORE supplements (thyroid panel, B12 / methylmalonic acid, ferritin, vitamin D, fasting glucose, lipids). Lifestyle optimization has clear limits when underlying causes may be clinical (hypothyroidism, B12 deficiency, sleep apnea).",
      cs: "55+ с постоянной усталостью: анализы ДО добавок (панель щитовидки, B12 / метилмалоновая кислота, ферритин, витамин D, глюкоза натощак, липиды). Оптимизация образа жизни имеет чёткие пределы, когда причины могут быть клиническими (гипотиреоз, дефицит B12, апноэ сна).",
    });
  }

  // ===== PRIORITY SIGNAL (always last, only if priority chosen) =====
  if (a.priority) {
    signals.push({
      en: `USER PRIORITY: this user explicitly chose '${a.priority}' as the first thing to fix. Weight the Today's Focus, Week 1 protocol, and supplement startWeek scheduling toward this priority. Do not let other signals dilute the priority weighting — it's the user's explicit value statement.`,
      cs: `ПРИОРИТЕТ ПОЛЬЗОВАТЕЛЯ: пользователь явно выбрал «${a.priority}» как первое, что нужно исправить. Сместить вес Today's Focus, протокола Недели 1 и расписания startWeek для добавок к этому приоритету. Не позволяй другим сигналам размывать приоритет — это явное ценностное утверждение пользователя.`,
    });
  }

  return signals;
}
