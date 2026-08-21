export type PhaseLabel = "Inhale" | "Hold" | "Exhale" | string;

export type PatternAccent = "sage" | "teal" | "lavender";

export type PatternCategory =
  | "focus"
  | "sleep"
  | "balance"
  | "coherence"
  | "stress"
  | "energy";

export type PatternIcon =
  | "box"
  | "moon"
  | "equal"
  | "wave"
  | "leaf"
  | "sigh"
  | "triangle"
  | "coherent"
  | "energy"
  | "relax";

export interface BreathingPattern {
  id: string;
  name: string;
  shortName: string;
  description: string;
  /** Phase durations in seconds, e.g. [4, 4, 4, 4] for box breathing. */
  phases: number[];
  /** Labels aligned 1:1 with `phases`. */
  phaseLabels: PhaseLabel[];
  /** Suggested session lengths in minutes (duration chips). */
  recommendedDurations: number[];
  defaultDurationMin: number;
  defaultSets: number;
  accent: PatternAccent;
  tag?: string;
  featured?: boolean;
  category: PatternCategory;
  icon: PatternIcon;
  /** Placeholder entry for "View All 10" growth — still fully playable. */
  stub?: boolean;
}

export type SessionMood = "stressed" | "neutral" | "calmer" | "relaxed";

export interface RecentSession {
  id: string;
  patternId: string;
  patternName: string;
  when: string;
  durationMin: number;
  accent: PatternAccent;
  mood?: SessionMood | null;
}

export interface WeeklyMoodInsight {
  logged: number;
  lifted: number;
  recentMoods: SessionMood[];
}

export interface WeeklyProgress {
  totalMin: number;
  goalMin: number;
  streakDays: number;
  recent: RecentSession[];
  mood: WeeklyMoodInsight;
}
