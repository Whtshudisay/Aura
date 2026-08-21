"use client";

import type { SessionMood } from "@/lib/types";
import { MOOD_OPTIONS } from "@/lib/moods";

export function MoodCheckIn({
  onSelect,
  onSkip,
}: {
  onSelect: (mood: SessionMood) => void;
  onSkip: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex items-end justify-center bg-[var(--color-surface-lowest)]/70 p-6 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mood-checkin-title"
    >
      <div className="glass w-full max-w-md rounded-[var(--radius-lg)] p-6 sm:p-8">
        <p className="label-caps mb-2 text-[var(--color-primary)]">Session complete</p>
        <h2
          id="mood-checkin-title"
          className="headline-lg mb-6 text-[var(--color-on-surface)]"
        >
          How are you feeling right now?
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className="flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-[var(--glass-border)] px-3 py-4 text-sm text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-primary)]/50 hover:bg-white/5"
            >
              <span className="text-2xl" aria-hidden>
                {opt.emoji}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="mt-5 w-full text-center text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
