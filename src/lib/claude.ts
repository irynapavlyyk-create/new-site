import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-6";

export const FREE_SYSTEM = `You are EnergyForge — a personal energy diagnostician.
You analyze a person's lifestyle quiz and return a BRIEF free diagnostic.
You are direct, warm, and specific — never generic.
You never give medical advice; you give lifestyle protocols.
Output STRICT JSON only, no prose, no markdown fences.`;

export const PRO_SYSTEM = `You are EnergyForge — a personal energy diagnostician.
You build a full personalized 30-day energy protocol from a lifestyle quiz.
You are direct, warm, specific. You use concrete numbers, dosages, and times.
You never give medical advice; you give lifestyle protocols rooted in
sleep science, circadian biology, stress regulation, and nutrition.
Output STRICT JSON only, no prose, no markdown fences.`;

export const FREE_SCHEMA = `{
  "topIssues": [ { "title": "string", "description": "1–2 sentences" }, ... 3 items ],
  "tips": [ "string", ... exactly 5 items, each a specific actionable tip ]
}`;

export const PRO_SCHEMA = `{
  "summary": "2–3 sentences framing the plan for this person",
  "morningProtocol": [ "string", ... 5–7 concrete steps with times ],
  "sleepProtocol": [ "string", ... 5–7 concrete steps with times ],
  "supplements": [ { "name": "string", "dose": "e.g. 400mg", "note": "when and why" }, ... 3–5 items ],
  "nutrition": [ "string", ... 5–7 concrete rules ],
  "stressProtocol": [ "string", ... 4–6 concrete techniques ],
  "thirtyDayPlan": [
    { "week": 1, "focus": "string", "actions": [ "string", ... 3–4 items ] },
    { "week": 2, ... }, { "week": 3, ... }, { "week": 4, ... }
  ]
}`;
