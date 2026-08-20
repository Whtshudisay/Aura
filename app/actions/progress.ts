"use server";

import { getSessionUser } from "@/lib/auth";
import { recordPracticeSession } from "@/lib/progress";
import type { PatternAccent } from "@/lib/types";

export async function saveCompletedSession(input: {
  patternId: string;
  patternName: string;
  durationMin: number;
  accent: PatternAccent;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in to save progress." };
  }

  if (!input.patternId || !input.patternName || input.durationMin < 1) {
    return { ok: false, error: "Invalid session data." };
  }

  try {
    await recordPracticeSession({
      userId: user.id,
      patternId: input.patternId,
      patternName: input.patternName,
      durationMin: input.durationMin,
      accent: input.accent,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save session.",
    };
  }
}
