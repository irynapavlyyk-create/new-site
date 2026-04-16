export type Lang = "en" | "ru";

export type QuizAnswers = {
  goal?: string;
  age?: string;
  energy?: string;
  sleep?: string;
  caffeine?: string;
  stress?: string;
  nutrition?: string;
  activity?: string;
  mainIssue?: string;
};

export type QuizKey = keyof QuizAnswers;

export type FreeReport = {
  topIssues: { title: string; description: string }[];
  tips: string[];
};

export type ProPlan = {
  summary: string;
  morningProtocol: string[];
  sleepProtocol: string[];
  supplements: { name: string; dose: string; note: string }[];
  nutrition: string[];
  stressProtocol: string[];
  thirtyDayPlan: { week: number; focus: string; actions: string[] }[];
};
