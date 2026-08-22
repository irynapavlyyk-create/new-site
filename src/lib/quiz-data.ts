import type { QuizKey } from "@/types";

export type QuizOption = { value: string; labelEn: string; labelCs: string };
export type QuizStep = {
  key: QuizKey;
  qEn: string;
  qCs: string;
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
    qCs: "Jsi spíš ranní ptáče, nebo noční sova?",
    options: [
      { value: "early-bird",   labelEn: "Morning person — I wake up easily before 7am", labelCs: "Ranní ptáče — bez problému vstávám před 7:00" },
      { value: "intermediate", labelEn: "Somewhere in the middle — wake by 8-9am",      labelCs: "Něco mezi — vstávám mezi 8. a 9. hodinou" },
      { value: "night-owl",    labelEn: "Night person — most energetic after 9pm",      labelCs: "Noční sova — nejvíc energie mám po 21:00" },
      { value: "irregular",    labelEn: "Depends on the day, no real pattern",          labelCs: "Podle dne, žádný stálý vzorec" },
    ],
  },
  {
    key: "age",
    qEn: "Your age",
    qCs: "Tvůj věk",
    options: [
      { value: "18-24", labelEn: "18-24", labelCs: "18-24" },
      { value: "25-34", labelEn: "25-34", labelCs: "25-34" },
      { value: "35-44", labelEn: "35-44", labelCs: "35-44" },
      { value: "45-54", labelEn: "45-54", labelCs: "45-54" },
      { value: "55+",   labelEn: "55+",   labelCs: "55+" },
    ],
  },
  {
    key: "energy",
    qEn: "How does your energy move through the day?",
    qCs: "Jak se tvoje energie mění během dne?",
    options: [
      { value: "morning-peak",    labelEn: "Strong morning, fades by afternoon",                  labelCs: "Silné ráno, k odpoledni slábne" },
      { value: "afternoon-crash", labelEn: "OK until 2pm, then crash hits hard",                  labelCs: "Do 14:00 v pohodě, pak tvrdý propad" },
      { value: "evening-peak",    labelEn: "Slow morning, energy comes by evening",               labelCs: "Pomalé ráno, energie naskočí až k večeru" },
      { value: "flat-low",        labelEn: "Low all day, no real peaks",                          labelCs: "Nízká celý den, žádné skutečné vrcholy" },
      { value: "flat-high",       labelEn: "High all day, can't switch off even when I should",   labelCs: "Vysoká celý den, nejde vypnout, ani když je potřeba" },
    ],
  },
  {
    key: "sleepDuration",
    qEn: "How many hours of sleep do you usually get?",
    qCs: "Kolik hodin spánku obvykle máš?",
    options: [
      { value: "<6h",   labelEn: "Less than 6 hours", labelCs: "Méně než 6 hodin" },
      { value: "6-7h",  labelEn: "6-7 hours",         labelCs: "6-7 hodin" },
      { value: "7-8h",  labelEn: "7-8 hours",         labelCs: "7-8 hodin" },
      { value: ">8h",   labelEn: "More than 8 hours", labelCs: "Více než 8 hodin" },
    ],
  },
  {
    key: "sleepQuality",
    qEn: "How do you feel when you wake up?",
    qCs: "Jak se cítíš po probuzení?",
    options: [
      { value: "refreshed",   labelEn: "Refreshed and ready",                  labelCs: "Svěže a odpočatě" },
      { value: "groggy",      labelEn: "Groggy, need 30+ min to wake up",      labelCs: "Rozlámaně, potřebuju 30+ minut se probrat" },
      { value: "tired",       labelEn: "Tired even after enough sleep",        labelCs: "Unaveně i po dostatku spánku" },
      { value: "interrupted", labelEn: "Wake up 1-2+ times during the night",  labelCs: "Budím se 1-2+ krát za noc" },
    ],
  },
  {
    key: "caffeine",
    qEn: "How much caffeine — and how late?",
    qCs: "Kolik kofeinu — a do kolika hodin?",
    options: [
      { value: "none",           labelEn: "I don't drink caffeine",                  labelCs: "Kofein nepiju" },
      { value: "1-2-morning",    labelEn: "1-2 cups, all before noon",               labelCs: "1-2 šálky, vše před polednem" },
      { value: "3+-morning",     labelEn: "3+ cups, all before noon",                labelCs: "3+ šálků, vše před polednem" },
      { value: "1-2-afternoon",  labelEn: "1-2 cups, at least one after 2pm",        labelCs: "1-2 šálky, aspoň jeden po 14:00" },
      { value: "3+-afternoon",   labelEn: "3+ cups, including afternoon/evening",    labelCs: "3+ šálků, včetně odpoledne/večera" },
      { value: "energy-drinks",  labelEn: "Mostly energy drinks or pre-workout",     labelCs: "Hlavně energetické nápoje nebo pre-workout" },
    ],
  },
  {
    key: "stressSymptoms",
    type: "multi-select",
    mutexValue: "none",
    qEn: "Which of these happen to you regularly? (Pick all that apply — or 'None')",
    qCs: "Co z tohohle se ti děje pravidelně? (Označ vše, co sedí — nebo „Nic“)",
    options: [
      { value: "racing-thoughts",   labelEn: "Mind races, hard to switch off",                labelCs: "Myšlenky se ženou, těžko se vypíná" },
      { value: "tension-headaches", labelEn: "Tension headaches or jaw clenching",            labelCs: "Tenzní bolesti hlavy nebo zatínání čelisti" },
      { value: "irritable",         labelEn: "Snap easily, lose patience over small things",  labelCs: "Snadno vybouchnu, ztrácím trpělivost kvůli maličkostem" },
      { value: "wired-cant-relax",  labelEn: "Body feels tense, can't physically relax",      labelCs: "Tělo je napjaté, fyzicky se nedokážu uvolnit" },
      { value: "dread-anxiety",     labelEn: "Dread or anxiety about upcoming things",        labelCs: "Úzkost nebo strach z toho, co mě čeká" },
      { value: "overwhelmed",       labelEn: "Feel overwhelmed by daily tasks",               labelCs: "Denní úkoly mě zahlcují" },
      { value: "none",              labelEn: "None of these regularly",                       labelCs: "Nic z toho pravidelně" },
    ],
  },
  {
    key: "nutrition",
    qEn: "How do you eat in a typical day?",
    qCs: "Jak jíš v běžný den?",
    options: [
      { value: "skip-meals",       labelEn: "Often skip breakfast or lunch",                            labelCs: "Často vynechávám snídani nebo oběd" },
      { value: "irregular",        labelEn: "Meals happen but timing varies a lot",                     labelCs: "Jím, ale časy se hodně mění" },
      { value: "regular-3",        labelEn: "3 meals at roughly the same times",                        labelCs: "3 jídla zhruba ve stejné časy" },
      { value: "regular-3-snacks", labelEn: "3 meals + planned snacks",                                 labelCs: "3 jídla + plánované svačiny" },
      { value: "restricted",       labelEn: "I follow a specific protocol (IF, OMAD, keto, etc.)",      labelCs: "Držím konkrétní protokol (přerušovaný půst, OMAD, keto apod.)" },
    ],
  },
  {
    key: "activity",
    type: "multi-select",
    mutexValue: "sedentary",
    qEn: "What kind of activity do you do? (Pick all that apply)",
    qCs: "Jaký pohyb děláš? (Označ vše, co sedí)",
    options: [
      { value: "walking",          labelEn: "Walking — daily or most days",                        labelCs: "Chůze — denně nebo skoro denně" },
      { value: "cardio-moderate",  labelEn: "Moderate cardio (jogging, cycling, swimming) 2-3×",   labelCs: "Mírné kardio (běh, kolo, plavání) 2-3×" },
      { value: "strength",         labelEn: "Strength training (gym, lifting) 1-3×",               labelCs: "Silový trénink (posilovna, činky) 1-3×" },
      { value: "combat",           labelEn: "Combat sports (boxing, BJJ, MMA) 1-3×",               labelCs: "Bojové sporty (box, BJJ, MMA) 1-3×" },
      { value: "intense-cardio",   labelEn: "Intense cardio (HIIT, CrossFit, running) 3+×",        labelCs: "Intenzivní kardio (HIIT, CrossFit, běh) 3+×" },
      { value: "mind-body",        labelEn: "Yoga, Pilates, stretching",                           labelCs: "Jóga, pilates, strečink" },
      { value: "daily-pro",        labelEn: "Train daily — multiple disciplines or competitive",   labelCs: "Trénuju denně — více disciplín nebo závodně" },
      { value: "sedentary",        labelEn: "None right now / mostly sitting",                     labelCs: "Teď nic / hlavně sedím" },
    ],
  },
  {
    key: "priority",
    qEn: "Which one would you fix first if you could only pick one?",
    qCs: "Co opravit jako první, kdyby šlo vybrat jen jedno?",
    options: [
      { value: "energy", labelEn: "Energy — I want consistent, reliable energy",   labelCs: "Energie — chci konzistentní, spolehlivou energii" },
      { value: "sleep",  labelEn: "Sleep — quality, not just quantity",            labelCs: "Spánek — kvalita, ne jen kvantita" },
      { value: "focus",  labelEn: "Focus — clear, sharp thinking",                 labelCs: "Soustředění — jasné, ostré myšlení" },
      { value: "stress", labelEn: "Stress — calm down the chronic activation",    labelCs: "Stres — zklidnit chronické nabuzení" },
      { value: "mood",   labelEn: "Mood — feeling more like myself",               labelCs: "Nálada — cítit se zase ve své kůži" },
    ],
  },
  {
    key: "biologicalSex",
    qEn: "Biological sex (for hormone-related recommendations)",
    qCs: "Biologické pohlaví (kvůli doporučením souvisejícím s hormony)",
    options: [
      { value: "female",          labelEn: "Female",             labelCs: "Žena" },
      { value: "male",            labelEn: "Male",               labelCs: "Muž" },
      { value: "prefer-not-say",  labelEn: "Prefer not to say",  labelCs: "Nechci uvádět" },
    ],
  },
];
