"use server";

import { getSessionUser } from "@/lib/auth";
import { recordPracticeSession } from "@/lib/progress";
import type { PatternAccent, SessionMood } from "@/lib/types";

const MOODS = new Set<SessionMood>(["stressed", "neutral", "calmer", "relaxed"]);

export async function saveCompletedSession(input: {
  patternId: string;
  patternName: string;
  durationMin: number;
  accent: PatternAccent;
  mood?: SessionMood | null;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in to save progress." };
  }

  if (!input.patternId || !input.patternName || input.durationMin < 1) {
    return { ok: false, error: "Invalid session data." };
  }

  const mood = input.mood && MOODS.has(input.mood) ? input.mood : null;

  try {
    await recordPracticeSession({
      userId: user.id,
      patternId: input.patternId,
      patternName: input.patternName,
      durationMin: input.durationMin,
      accent: input.accent,
      mood,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save session.",
    };
  }
}
