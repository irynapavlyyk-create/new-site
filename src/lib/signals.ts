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
          cs: "Chronotyp: ranní typ (skřivan) — přirozené probuzení před 7. hodinou, vrchol bdělosti brzy během dne.",
        },
        intermediate: {
          en: "Chronotype: intermediate — natural wake 7-9am, peak in late morning to early afternoon.",
          cs: "Chronotyp: střední — přirozené probuzení mezi 7. a 9. hodinou, vrchol od pozdního dopoledne do časného odpoledne.",
        },
        "night-owl": {
          en: "Chronotype: night person (owl) — natural wake after 9am, peak alertness in late evening.",
          cs: "Chronotyp: večerní typ (sova) — přirozené probuzení po 9. hodině, vrchol bdělosti pozdě večer.",
        },
        irregular: {
          en: "Chronotype: irregular — no consistent natural sleep/wake pattern, suggesting circadian dysregulation.",
          cs: "Chronotyp: nepravidelný — žádný stálý přirozený rytmus spánku a bdění, ukazuje na cirkadiánní dysregulaci.",
        },
      };
      return map[value] ?? null;
    }
    case "age": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "18-24": { en: "Demographics: 18-24 years old.", cs: "Demografie: 18-24 let." },
        "25-34": { en: "Demographics: 25-34 years old.", cs: "Demografie: 25-34 let." },
        "35-44": {
          en: "Demographics: 35-44 years old (mitochondrial decline window begins in this bracket).",
          cs: "Demografie: 35-44 let (v tomto pásmu začíná okno mitochondriálního poklesu).",
        },
        "45-54": {
          en: "Demographics: 45-54 years old (perimenopause window for females; testosterone decline window for males).",
          cs: "Demografie: 45-54 let (okno perimenopauzy u žen; okno poklesu testosteronu u mužů).",
        },
        "55+": {
          en: "Demographics: 55+ years old (consider bloodwork before lifestyle interventions for unexplained fatigue).",
          cs: "Demografie: 55+ let (při nevysvětlené únavě zvážit krevní testy před zásahy do životního stylu).",
        },
      };
      return map[value] ?? null;
    }
    case "energy": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "morning-peak": {
          en: "Energy pattern: strong morning, fades by afternoon — typical lark/cortisol-aligned pattern.",
          cs: "Vzorec energie: silné ráno, k odpoledni slábne — typický skřivaní vzorec sladěný s kortizolem.",
        },
        "afternoon-crash": {
          en: "Energy pattern: OK until 2pm then hard crash — typical post-lunch insulin/cortisol dip with glycemic instability overlay likely.",
          cs: "Vzorec energie: v pořádku do 14:00, pak tvrdý propad — typický poobědový inzulinový/kortizolový pokles, pravděpodobně s vrstvou glykemické nestability.",
        },
        "evening-peak": {
          en: "Energy pattern: slow morning, energy peaks by evening — typical owl pattern; may indicate phase-delayed circadian if forced into early schedule.",
          cs: "Vzorec energie: pomalé ráno, vrchol k večeru — typický vzorec sovy; při vynuceném časném režimu může značit fázově zpožděný cirkadiánní rytmus.",
        },
        "flat-low": {
          en: "Energy pattern: low all day, no real peaks — chronic baseline fatigue without diurnal variation, suggests systemic issue not just timing.",
          cs: "Vzorec energie: nízká celý den, bez skutečných vrcholů — chronická základní únava bez denní variace, ukazuje na systémový problém, ne jen na načasování.",
        },
        "flat-high": {
          en: "Energy pattern: high all day, cannot switch off even when needed — classic Wired-but-tired/sympathetic-dominance pattern. Body operating in continuous arousal mode.",
          cs: "Vzorec energie: vysoká celý den, nejde vypnout, ani když je potřeba — klasický vzorec Wired-but-tired / sympatické dominance. Tělo běží v režimu nepřetržitého nabuzení.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepDuration": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "<6h": {
          en: "Sleep duration: less than 6 hours per night (deficit territory for nearly all adults).",
          cs: "Délka spánku: méně než 6 hodin za noc (pásmo deficitu pro téměř všechny dospělé).",
        },
        "6-7h": {
          en: "Sleep duration: 6-7 hours per night (below optimal for most adults but not severe deficit).",
          cs: "Délka spánku: 6-7 hodin za noc (pod optimem pro většinu dospělých, ale ne těžký deficit).",
        },
        "7-8h": {
          en: "Sleep duration: 7-8 hours per night (within recommended range).",
          cs: "Délka spánku: 7-8 hodin za noc (v doporučeném rozmezí).",
        },
        ">8h": {
          en: "Sleep duration: more than 8 hours per night.",
          cs: "Délka spánku: více než 8 hodin za noc.",
        },
      };
      return map[value] ?? null;
    }
    case "sleepQuality": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        refreshed: {
          en: "Sleep quality: wakes refreshed and ready — sleep architecture intact.",
          cs: "Kvalita spánku: probouzí se odpočatě a svěží — architektura spánku je neporušená.",
        },
        groggy: {
          en: "Sleep quality: wakes groggy, needs 30+ minutes to alert — sleep inertia pattern, possible deeper-than-needed N3 sleep or interrupted REM at wake time.",
          cs: "Kvalita spánku: probouzí se rozlámaně, potřebuje 30+ minut na probrání — vzorec spánkové setrvačnosti, možný příliš hluboký spánek N3 nebo přerušená REM fáze v okamžiku probuzení.",
        },
        tired: {
          en: "Sleep quality: wakes tired even after adequate duration — sleep ARCHITECTURE problem, not duration deficit. Suspect fragmented deep sleep, possible airway/cortisol/alcohol involvement.",
          cs: "Kvalita spánku: probouzí se unaveně i po dostatečné délce — problém ARCHITEKTURY spánku, ne deficit délky. Podezření na fragmentovaný hluboký spánek, možný podíl dýchacích cest / kortizolu / alkoholu.",
        },
        interrupted: {
          en: "Sleep quality: wakes 1-2+ times during the night — sleep maintenance insomnia. Suspect cortisol elevation, blood sugar instability, or stimulus (caffeine half-life, alcohol, fluid timing).",
          cs: "Kvalita spánku: budí se 1-2+ krát za noc — insomnie udržení spánku. Podezření na zvýšený kortizol, nestabilitu krevního cukru nebo stimuly (poločas kofeinu, alkohol, načasování tekutin).",
        },
      };
      return map[value] ?? null;
    }
    case "caffeine": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        none: { en: "Caffeine intake: none.", cs: "Kofein: žádný." },
        "1-2-morning": {
          en: "Caffeine intake: 1-2 cups daily, all before noon (well-timed for cortisol/sleep architecture).",
          cs: "Kofein: 1-2 šálky denně, vše před polednem (dobré načasování pro kortizol i architekturu spánku).",
        },
        "3+-morning": {
          en: "Caffeine intake: 3+ cups daily, all before noon (high amount but timing protects sleep — adrenal load on the high side).",
          cs: "Kofein: 3+ šálků denně, vše před polednem (množství vysoké, ale načasování chrání spánek — zátěž nadledvin na horní hranici).",
        },
        "1-2-afternoon": {
          en: "Caffeine intake: 1-2 cups daily including at least one after 2pm (5-6h half-life means measurable amount in system at bedtime — likely fragmenting sleep architecture).",
          cs: "Kofein: 1-2 šálky denně, aspoň jeden po 14:00 (poločas 5-6 hodin znamená měřitelné množství v těle při usínání — pravděpodobně fragmentuje architekturu spánku).",
        },
        "3+-afternoon": {
          en: "Caffeine intake: 3+ cups daily including afternoon/evening (substantial sleep-disrupting load, almost certainly contributing to interrupted/unrefreshing sleep).",
          cs: "Kofein: 3+ šálků denně včetně odpoledne/večera (výrazná zátěž narušující spánek, téměř jistě přispívá k přerušovanému / neosvěžujícímu spánku).",
        },
        "energy-drinks": {
          en: "Caffeine source: mostly energy drinks or pre-workout formulas (high caffeine + frequent additional stimulants like taurine, beta-alanine, and added sugars; sugar crashes confound the energy picture).",
          cs: "Zdroj kofeinu: převážně energetické nápoje nebo pre-workout směsi (vysoký kofein + často další stimulanty jako taurin, beta-alanin a přidané cukry; cukrové propady zkreslují obraz energie).",
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
          cs: "Symptomy stresu: pravidelně se žádné neobjevují.",
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
      const labelsCs: Record<string, string> = {
        "racing-thoughts": "překotné myšlenky / mentální hyperaktivace",
        "tension-headaches": "tenzní bolesti hlavy / zatínání čelisti (somatické markery stresu)",
        irritable: "nízký práh podráždění / deficit trpělivosti",
        "wired-cant-relax": "fyzická neschopnost se uvolnit (sympatická dominance)",
        "dread-anxiety": "anticipační úzkost / strach z nadcházejících událostí",
        overwhelmed: "pocit zahlcení denní zátěží",
      };
      const joinedEn = symptoms.map((s) => labelsEn[s] ?? s).join("; ");
      const joinedCs = symptoms.map((s) => labelsCs[s] ?? s).join("; ");

      let severityEn: string;
      let severityCs: string;
      if (symptoms.length <= 2) {
        severityEn = "mild";
        severityCs = "mírné";
      } else if (symptoms.length <= 4) {
        severityEn = "moderate-to-high, multi-system manifestation";
        severityCs = "střední až vysoké, multisystémový projev";
      } else {
        severityEn = "severe overload, classic HPA dysregulation candidate";
        severityCs = "těžké přetížení, klasický kandidát na dysregulaci osy HPA";
      }
      return {
        en: `Stress symptoms (${severityEn}): ${joinedEn}.`,
        cs: `Symptomy stresu (${severityCs}): ${joinedCs}.`,
      };
    }
    case "nutrition": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        "skip-meals": {
          en: "Eating pattern: frequently skips breakfast or lunch (creates extended fasts that destabilize blood sugar, especially during cortisol-elevated morning hours).",
          cs: "Vzorec stravování: často vynechává snídani nebo oběd (vytváří prodloužené hladovění destabilizující krevní cukr, zvlášť v ranních hodinách se zvýšeným kortizolem).",
        },
        irregular: {
          en: "Eating pattern: meals happen but timing varies significantly (disrupts circadian metabolic signaling).",
          cs: "Vzorec stravování: jídla probíhají, ale jejich čas se výrazně mění (narušuje cirkadiánní metabolickou signalizaci).",
        },
        "regular-3": {
          en: "Eating pattern: 3 meals at consistent times (good baseline timing structure).",
          cs: "Vzorec stravování: 3 jídla v konzistentních časech (dobrá základní časová struktura).",
        },
        "regular-3-snacks": {
          en: "Eating pattern: 3 meals + planned snacks (consistent grazing pattern, good glycemic management).",
          cs: "Vzorec stravování: 3 jídla + plánované svačiny (konzistentní vzorec častějšího jídla, dobré řízení glykemie).",
        },
        restricted: {
          en: "Eating pattern: follows a specific restrictive protocol (intermittent fasting, OMAD, ketogenic, or similar). Verify protocol fit with training load and chronotype before recommending changes.",
          cs: "Vzorec stravování: dodržuje specifický restriktivní protokol (přerušovaný půst, OMAD, ketogenní apod.). Před doporučením změn ověřit soulad protokolu s tréninkovou zátěží a chronotypem.",
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
          cs: "Úroveň aktivity: sedavá, méně než 5 000 kroků denně, žádný pravidelný trénink.",
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
      const labelsCs: Record<string, string> = {
        walking: "pravidelná chůze / základní pohyb v zóně 2",
        "cardio-moderate": "mírné kardio 2-3× týdně (běh, kolo, plavání)",
        strength: "silový trénink 1-3× týdně (odporový trénink/činky)",
        combat: "bojové sporty 1-3× týdně (box/BJJ/MMA — vysoký kortizolový stimul + nároky na regeneraci)",
        "intense-cardio": "intenzivní kardio 3+× týdně (HIIT/CrossFit/vytrvalostní běh)",
        "mind-body": "jóga, pilates, strečink",
        "daily-pro": "denní trénink, více disciplín nebo závodní úroveň (rezerva na regeneraci je tenká)",
      };
      if (value.length === 1) {
        const m = value[0];
        return {
          en: `Activity: ${labelsEn[m] ?? m}.`,
          cs: `Aktivita: ${labelsCs[m] ?? m}.`,
        };
      }
      const joinedEn = value.map((m) => labelsEn[m] ?? m).join(", ");
      const joinedCs = value.map((m) => labelsCs[m] ?? m).join(", ");
      return {
        en: `Activity mix: combines ${joinedEn}. Cumulative training load is significant — recovery infrastructure must match.`,
        cs: `Mix aktivit: kombinuje ${joinedCs}. Kumulativní tréninková zátěž je významná — infrastruktura regenerace jí musí odpovídat.`,
      };
    }
    case "priority": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        energy: {
          en: "User's stated priority — fix FIRST: energy stability. Weight protocol toward consistent, reliable daily energy.",
          cs: "Deklarovaná priorita uživatele — řešit NEJDŘÍV: stabilita energie. Vážit protokol směrem ke konzistentní, spolehlivé denní energii.",
        },
        sleep: {
          en: "User's stated priority — fix FIRST: sleep quality (not just duration). Weight protocol toward sleep architecture interventions.",
          cs: "Deklarovaná priorita uživatele — řešit NEJDŘÍV: kvalita spánku (ne jen délka). Vážit protokol směrem k zásahům do architektury spánku.",
        },
        focus: {
          en: "User's stated priority — fix FIRST: cognitive clarity / focus. Weight protocol toward cognition-supporting interventions.",
          cs: "Deklarovaná priorita uživatele — řešit NEJDŘÍV: kognitivní jasnost / soustředění. Vážit protokol směrem k intervencím podporujícím kognici.",
        },
        stress: {
          en: "User's stated priority — fix FIRST: stress regulation. Weight protocol toward HPA axis interventions.",
          cs: "Deklarovaná priorita uživatele — řešit NEJDŘÍV: regulace stresu. Vážit protokol směrem k intervencím na ose HPA.",
        },
        mood: {
          en: "User's stated priority — fix FIRST: mood / feeling like themselves. Weight protocol toward mood-supporting nutrition + lifestyle.",
          cs: "Deklarovaná priorita uživatele — řešit NEJDŘÍV: nálada / cítit se zase ve své kůži. Vážit protokol směrem k výživě a životnímu stylu podporujícím náladu.",
        },
      };
      return map[value] ?? null;
    }
    case "biologicalSex": {
      if (typeof value !== "string") return null;
      const map: Record<string, ProfileLine> = {
        female: {
          en: "Biological sex: female. Consider iron status (ferritin), cycle-related symptom variation if reproductive age, perimenopause window if 35+, lower protein dose ceiling (~1.4-1.8 g/kg lean mass), calcium/magnesium ratio differs from male baseline.",
          cs: "Biologické pohlaví: žena. Zohlednit stav železa (feritin), variabilitu symptomů podle fáze cyklu v reprodukčním věku, okno perimenopauzy při 35+, nižší strop dávky bílkovin (~1.4-1.8 g/kg netukové hmoty), poměr vápník/hořčík se liší od mužské výchozí hodnoty.",
        },
        male: {
          en: "Biological sex: male. Iron deficiency is rare absent obvious cause; consider testosterone status if 35+ with low energy, higher protein dose ceiling (~1.6-2.2 g/kg lean mass).",
          cs: "Biologické pohlaví: muž. Deficit železa je bez zjevné příčiny vzácný; při 35+ s nízkou energií zvážit stav testosteronu, vyšší strop dávky bílkovin (~1.6-2.2 g/kg netukové hmoty).",
        },
        "prefer-not-say": {
          en: "Biological sex: not specified. Use gender-neutral nutritional baseline; flag sex-specific levers (iron, hormones, dose ranges) as clinician consultation points rather than recommendations.",
          cs: "Biologické pohlaví: neuvedeno. Použít genderově neutrální výživový základ; pohlavně specifické páky (železo, hormony, dávkování) označit jako body ke konzultaci s lékařem, ne jako doporučení.",
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
      cs: "Odpolední kofein + zhoršená kvalita spánku: poločas 5-6 hodin znamená měřitelné množství v těle při usínání, které přímo fragmentuje architekturu spánku. Pákou je čas poslední dávky, ne množství.",
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
      cs: "Pozdní + vysoký kofein + smyčka zesilování úzkosti: kofein stojí v řetězci nad několika symptomy. Vyřazení odpoledního kofeinu jako první krok často zlepší 2-3 navazující potíže současně.",
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
      cs: "Spí 8+ hodin, ale probouzí se neodpočatě — to je problém ARCHITEKTURY spánku, ne deficit délky. Tady jde o kvalitu, ne kvantitu: podezření na fragmentovaný hluboký spánek, možný podíl dýchacích cest / kortizolu / alkoholu.",
    });
  }
  // H4: short sleep + sedentary
  if (a.sleepDuration === "<6h" && activity.includes("sedentary")) {
    signals.push({
      en: "Short sleep + sedentary lifestyle compounds recovery debt. Sleep extension and gentle daily movement together produce more energy than either alone.",
      cs: "Krátký spánek + sedavý životní styl sčítají dluh regenerace. Prodloužení spánku a mírný denní pohyb dohromady dají víc energie než každé zvlášť.",
    });
  }

  // ===== CHRONOTYPE =====
  // H5: night-owl + interrupted sleep → social jet lag
  if (a.chronotype === "night-owl" && a.sleepQuality === "interrupted") {
    signals.push({
      en: "Social jet lag pattern — owl chronotype forced into early-bird schedule. Light exposure timing + cortisol curve are misaligned with the body's preferred phase. Morning bright light and consistent (not necessarily early) bedtime are the highest-yield levers.",
      cs: "Vzorec sociálního jetlagu — chronotyp sovy natlačený do skřivaního režimu. Načasování světla a kortizolová křivka jsou rozladěné s preferovanou fází těla. Nejvýnosnější páky: ranní ostré světlo a stabilní (ne nutně časná) doba usínání.",
    });
  }
  // H6: chronotype-energy mismatch
  if (
    (a.chronotype === "night-owl" && a.energy === "morning-peak") ||
    (a.chronotype === "early-bird" && a.energy === "evening-peak")
  ) {
    signals.push({
      en: "Chronotype-energy mismatch — user's natural pattern contradicts their stated energy peak. May indicate forced schedule, misreporting, or stimulant use masking the true pattern. Treat as ambiguous signal; weight other inputs more heavily.",
      cs: "Nesoulad chronotypu a energie — přirozený vzorec uživatele odporuje uvedenému vrcholu energie. Může jít o vynucený režim, nepřesný sebereport nebo maskování stimulanty. Brát jako nejednoznačný signál; dát víc váhy ostatním vstupům.",
    });
  }

  // ===== STRESS CLUSTERS =====
  // H7: multi-system stress overload
  if (effectiveStress.length >= 4) {
    signals.push({
      en: "Multi-system stress overload, classic HPA dysregulation candidate. Foundation interventions (magnesium, sleep, caffeine reduction) before adaptogens.",
      cs: "Multisystémové přetížení stresem, klasický kandidát na dysregulaci osy HPA. Základní intervence (hořčík, spánek, snížení kofeinu) před adaptogeny.",
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
      cs: "Indikátory fenotypu Wired-but-tired: sympatická dominance + fragmentace spánku. Hořčík bisglycinát (300-400 mg večer) + L-theanin (200 mg v páru s kofeinem) jsou základní dvojice s nejsilnější evidencí.",
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
      cs: "Kortizolem řízený cluster podrážděnosti — hořčík (jakákoli dobře vstřebatelná forma) + aktivní B-komplex mají nejsilnější evidenci. Zatínání čelisti sledovat jako marker zlepšení.",
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
      cs: "Žena v reprodukčním věku + chronicky nízká energie: feritin a saturace transferinu jsou nejvýnosnější testy. Nízké železo je nejčastěji přehlížený hnací faktor únavy v této demografii, včetně vegetariánek/veganek a žen se silnou menstruací.",
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
      cs: "Indikátory okna perimenopauzy: sledovat symptomy vůči fázi cyklu. B6 (forma P-5-P) + hořčík bisglycinát + ashwagandha mají evidenci. Před rozsáhlejší suplementací je namístě konzultace s lékařem a kompletní hormonální panel (estradiol, progesteron, FSH, štítná žláza).",
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
      cs: "Muž ve středním věku + plochá nízká energie + zhoršená kvalita spánku: krevní testy testosteronu a štítné žlázy jsou nejvýnosnější diagnostika. Optimalizace životního stylu má limity, když jsou přítomné hormonální/metabolické faktory.",
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
      cs: "Vysoce stimulační trénink + vícesymptomový stres: hromadí se dluh regenerace. Hořčík výš (350-450 mg), sledovat markery přetrénování (zvýšený klidový tep, klesající výkon, časté nemoci, výkyvy nálady). Přidat skutečný den volna.",
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
      cs: "Možné přetrénování nebo nedostatečný energetický příjem. Před přidáním jakéhokoli doplňku nebo tréninkového stimulu ověřit: příjem bílkovin (1.6-2.2 g/kg netukové hmoty), celkový kalorický příjem (RMR × faktor aktivity) a zvážit deload týden jako diagnostiku.",
    });
  }

  // ===== NUTRITION =====
  // H15: restricted + flat-low
  if (a.nutrition === "restricted" && a.energy === "flat-low") {
    signals.push({
      en: "Restrictive protocol (IF/keto/OMAD) + low energy: verify the protocol fits training load and chronotype. The protocol may be the issue, not a missing supplement. Re-feeding window adjustment is the first lever.",
      cs: "Restriktivní protokol (přerušovaný půst/keto/OMAD) + nízká energie: ověřit soulad protokolu s tréninkovou zátěží a chronotypem. Problém může být protokol sám, ne chybějící doplněk. První páka je úprava jídelního okna.",
    });
  }
  // H16: skip-meals + afternoon-crash
  if (a.nutrition === "skip-meals" && a.energy === "afternoon-crash") {
    signals.push({
      en: "Reactive hypoglycemia / glycemic instability pattern. Protein-anchored breakfast within 60 minutes of waking is the single highest-impact intervention, with magnitude that exceeds most supplement effects.",
      cs: "Vzorec reaktivní hypoglykemie / glykemické nestability. Snídaně postavená na bílkovinách do 60 minut po probuzení je jediná intervence s nejvyšším dopadem — větším, než má většina doplňků.",
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
      cs: "V tomto věkovém pásmu začíná mitochondriální pokles — CoQ10 ve formě ubichinolu podstatně nabývá na hodnotě. Spojit se základními testy (štítná žláza, vitamin D, B12, feritin), než se příčina přisoudí stravě.",
    });
  }
  // H18: 55+ + persistent fatigue → bloodwork first
  if (a.age === "55+" && (a.energy === "flat-low" || a.sleepQuality === "tired")) {
    signals.push({
      en: "55+ with persistent fatigue: bloodwork BEFORE supplements (thyroid panel, B12 / methylmalonic acid, ferritin, vitamin D, fasting glucose, lipids). Lifestyle optimization has clear limits when underlying causes may be clinical (hypothyroidism, B12 deficiency, sleep apnea).",
      cs: "55+ s přetrvávající únavou: krevní testy PŘED doplňky (panel štítné žlázy, B12 / kyselina metylmalonová, feritin, vitamin D, glukóza nalačno, lipidy). Optimalizace životního stylu má jasné limity, když příčiny mohou být klinické (hypotyreóza, deficit B12, spánková apnoe).",
    });
  }

  // ===== PRIORITY SIGNAL (always last, only if priority chosen) =====
  if (a.priority) {
    signals.push({
      en: `USER PRIORITY: this user explicitly chose '${a.priority}' as the first thing to fix. Weight the Today's Focus, Week 1 protocol, and supplement startWeek scheduling toward this priority. Do not let other signals dilute the priority weighting — it's the user's explicit value statement.`,
      cs: `PRIORITA UŽIVATELE: uživatel výslovně zvolil '${a.priority}' jako první věc k řešení. Vážit Today's Focus, protokol Týdne 1 a plánování startWeek u doplňků směrem k této prioritě. Nenech ostatní signály prioritu rozmělnit — je to explicitní hodnotové vyjádření uživatele.`,
    });
  }

  return signals;
}
