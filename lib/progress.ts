import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { summarizeMoods } from "@/lib/moodLog";
import type { PatternAccent, RecentSession, SessionMood, WeeklyProgress } from "@/lib/types";

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWhen(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sessionDay = startOfDay(date);

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sessionDay.getTime() === today.getTime()) return `Today, ${time}`;
  if (sessionDay.getTime() === yesterday.getTime()) return `Yesterday, ${time}`;

  return `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${time}`;
}

function computeStreak(completedAts: string[], now = new Date()): number {
  if (completedAts.length === 0) return 0;

  const dayKeys = new Set(
    completedAts.map((iso) => startOfDay(new Date(iso)).toISOString()),
  );

  let streak = 0;
  const cursor = startOfDay(now);

  if (!dayKeys.has(cursor.toISOString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dayKeys.has(cursor.toISOString())) return 0;
  }

  while (dayKeys.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function recordPracticeSession(input: {
  userId: string;
  patternId: string;
  patternName: string;
  durationMin: number;
  accent: PatternAccent;
  mood?: SessionMood | null;
}): Promise<void> {
  const supabase = await createClient();
  const row: Record<string, unknown> = {
    user_id: input.userId,
    pattern_id: input.patternId,
    pattern_name: input.patternName,
    duration_min: Math.max(1, Math.round(input.durationMin)),
    accent: input.accent,
    completed_at: new Date().toISOString(),
  };
  if (input.mood) row.mood = input.mood;

  let { error } = await supabase.from("practice_sessions").insert(row);
  if (error && input.mood) {
    delete row.mood;
    ({ error } = await supabase.from("practice_sessions").insert(row));
  }

  if (error) {
    throw new Error(error.message);
  }
}

/** One DB round-trip; memoized per request for layout + page. */
export const getWeeklyProgressForUser = cache(
  async (userId: string, weeklyGoalMin: number): Promise<WeeklyProgress> => {
    const supabase = await createClient();
    const now = new Date();
    const weekStartMs = startOfWeek(now).getTime();

    type SessionRow = {
      id: string;
      pattern_id: string;
      pattern_name: string;
      duration_min: number;
      accent: string;
      completed_at: string;
      mood?: string | null;
    };

    let rows: SessionRow[] | null = null;
    const withMood = await supabase
      .from("practice_sessions")
      .select("id, pattern_id, pattern_name, duration_min, accent, completed_at, mood")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (withMood.error) {
      const fallback = await supabase
        .from("practice_sessions")
        .select("id, pattern_id, pattern_name, duration_min, accent, completed_at")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false });
      rows = (fallback.data ?? []) as SessionRow[];
    } else {
      rows = (withMood.data ?? []) as SessionRow[];
    }

    const list = rows;

    const totalMin = list.reduce((sum, row) => {
      if (new Date(row.completed_at).getTime() >= weekStartMs) {
        return sum + (row.duration_min ?? 0);
      }
      return sum;
    }, 0);

    const recent: RecentSession[] = list.slice(0, 5).map((row) => ({
      id: row.id,
      patternId: row.pattern_id,
      patternName: row.pattern_name,
      when: formatWhen(row.completed_at, now),
      durationMin: row.duration_min,
      accent: row.accent as PatternAccent,
      mood: (row.mood as SessionMood | null) ?? null,
    }));

    const mood = summarizeMoods(
      list.map((r) => ({
        at: r.completed_at,
        mood: (r.mood as SessionMood | null) ?? null,
      })),
      now,
    );

    return {
      totalMin,
      goalMin: weeklyGoalMin,
      streakDays: computeStreak(
        list.map((r) => r.completed_at),
        now,
      ),
      recent,
      mood,
    };
  },
);

export function emptyWeeklyProgress(goalMin = 60): WeeklyProgress {
  return {
    totalMin: 0,
    goalMin,
    streakDays: 0,
    recent: [],
    mood: { logged: 0, lifted: 0, recentMoods: [] },
  };
}
