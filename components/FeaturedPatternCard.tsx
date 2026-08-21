"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BreathingPattern } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePacingMode } from "@/hooks/usePacingMode";
import { PacingControl } from "@/components/PacingControl";
import { scalePhases } from "@/lib/pacing";

export function FeaturedPatternCard({ pattern }: { pattern: BreathingPattern }) {
  const router = useRouter();
  const [duration, setDuration] = useState(pattern.defaultDurationMin);
  const pacing = usePacingMode();
  const paced = scalePhases(pattern.phases, pacing.multiplier);

  const start = () => {
    router.push(`/session/${pattern.id}?duration=${duration}`);
  };

  return (
    <article className="glass relative overflow-hidden rounded-[var(--radius-lg)] p-6 sm:p-8 md:p-10">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--accent-sage-soft)] blur-3xl"
        aria-hidden
      />
      {pattern.tag && (
        <p className="label-caps mb-4 text-[var(--color-primary)]">{pattern.tag}</p>
      )}
      <h2 className="headline-lg mb-3 text-[var(--color-on-surface)]">{pattern.name}</h2>
      <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
        {pattern.description}
      </p>
      <p className="mb-6 text-xs text-[var(--color-on-surface-variant)]">
        Phases: {paced.join("–")}s
      </p>

      <div className="mb-6">
        <PacingControl mode={pacing.mode} onChange={pacing.setMode} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Session duration"
        >
          {pattern.recommendedDurations.map((min) => {
            const selected = duration === min;
            return (
              <button
                key={min}
                type="button"
                onClick={() => setDuration(min)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  selected
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                    : "border border-[var(--glass-border)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-on-surface)]",
                )}
                aria-pressed={selected}
              >
                {min} min
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={start}
          className="glow-primary inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-on-primary)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Session
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}
