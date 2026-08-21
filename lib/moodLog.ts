import { PREFS } from "@/lib/preferences";
import type { SessionMood } from "@/lib/types";

export interface MoodLogEntry {
  id: string;
  at: string;
  patternId: string;
  patternName: string;
  durationMin: number;
  mood: SessionMood | null;
}

const MAX_ENTRIES = 60;

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

export function appendMoodLog(entry: Omit<MoodLogEntry, "id" | "at"> & { at?: string }): void {
  if (typeof window === "undefined") return;
  try {
    const next: MoodLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: entry.at ?? new Date().toISOString(),
      patternId: entry.patternId,
      patternName: entry.patternName,
      durationMin: entry.durationMin,
      mood: entry.mood,
    };
    const prev = readMoodLog();
    localStorage.setItem(PREFS.moodLog, JSON.stringify([next, ...prev].slice(0, MAX_ENTRIES)));
  } catch {
    // ignore quota / private mode
  }
}

export function readMoodLog(): MoodLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PREFS.moodLog);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MoodLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function summarizeMoods(
  entries: Array<{ at: string; mood?: SessionMood | null }>,
  now = new Date(),
): { logged: number; lifted: number; recentMoods: SessionMood[] } {
  const weekStart = startOfWeek(now).getTime();
  const week = entries.filter((e) => new Date(e.at).getTime() >= weekStart);
  const withMood = week.filter((e): e is typeof e & { mood: SessionMood } => Boolean(e.mood));
  const lifted = withMood.filter((e) => e.mood === "calmer" || e.mood === "relaxed").length;
  return {
    logged: withMood.length,
    lifted,
    recentMoods: withMood.slice(0, 7).map((e) => e.mood),
  };
}
