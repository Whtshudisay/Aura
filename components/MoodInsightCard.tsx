"use client";

import { useEffect, useState } from "react";
import { MOOD_OPTIONS } from "@/lib/moods";
import { readMoodLog, summarizeMoods } from "@/lib/moodLog";
import type { SessionMood, WeeklyMoodInsight } from "@/lib/types";

function emojiFor(mood: SessionMood): string {
  return MOOD_OPTIONS.find((o) => o.id === mood)?.emoji ?? "·";
}

export function MoodInsightCard({
  serverMood,
}: {
  serverMood?: WeeklyMoodInsight;
}) {
  const [insight, setInsight] = useState<WeeklyMoodInsight>(
    serverMood ?? { logged: 0, lifted: 0, recentMoods: [] },
  );

  useEffect(() => {
    if (serverMood && serverMood.logged > 0) {
      setInsight(serverMood);
      return;
    }
    const local = summarizeMoods(readMoodLog());
    if (local.logged > 0) setInsight(local);
    else if (serverMood) setInsight(serverMood);
  }, [serverMood]);

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--glass-border)] p-4">
      <h3 className="label-caps mb-3 text-[var(--color-on-surface-variant)]">
        Mood this week
      </h3>
      {insight.logged === 0 ? (
        <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          After a session, a one-tap check-in will show how your mood is shifting.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-on-surface)]">
            {insight.lifted} of {insight.logged} check-in
            {insight.logged === 1 ? "" : "s"} felt calmer or relaxed.
          </p>
          <div className="flex gap-1.5" aria-label="Recent moods">
            {insight.recentMoods.map((mood, i) => (
              <span key={`${mood}-${i}`} className="text-lg" title={mood}>
                {emojiFor(mood)}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
