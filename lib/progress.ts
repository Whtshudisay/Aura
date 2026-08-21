import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PatternAccent, RecentSession, WeeklyProgress } from "@/lib/types";

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

  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sessionDay.getTime() === today.getTime()) return `Today, ${time}`;
  if (sessionDay.getTime() === yesterday.getTime()) return `Yesterday, ${time}`;

  return `${date.toLocaleDateString(undefined, { weekday: "short" })}, ${time}`;
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
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("practice_sessions").insert({
    user_id: input.userId,
    pattern_id: input.patternId,
    pattern_name: input.patternName,
    duration_min: Math.max(1, Math.round(input.durationMin)),
    accent: input.accent,
    completed_at: new Date().toISOString(),
  });

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

    const { data: rows } = await supabase
      .from("practice_sessions")
      .select("id, pattern_id, pattern_name, duration_min, accent, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    const list = rows ?? [];

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
    }));

    return {
      totalMin,
      goalMin: weeklyGoalMin,
      streakDays: computeStreak(
        list.map((r) => r.completed_at),
        now,
      ),
      recent,
    };
  },
);

export function emptyWeeklyProgress(goalMin = 60): WeeklyProgress {
  return {
    totalMin: 0,
    goalMin,
    streakDays: 0,
    recent: [],
  };
}
