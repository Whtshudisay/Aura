import Link from "next/link";
import type { WeeklyProgress } from "@/lib/types";
import { MoodInsightCard } from "@/components/MoodInsightCard";
import { PatternIconBadge } from "@/components/PatternIcon";
import { getPatternById } from "@/data/patterns";

export function WeeklyProgressSidebar({
  progress,
  signedIn,
}: {
  progress: WeeklyProgress;
  signedIn: boolean;
}) {
  const pct = Math.min(
    100,
    Math.round((progress.totalMin / Math.max(1, progress.goalMin)) * 100),
  );

  return (
    <aside className="glass flex h-full min-h-full flex-col rounded-[var(--radius-lg)] p-6 lg:p-7">
      <div className="mb-6 flex items-center gap-2 text-[var(--color-on-surface-variant)]">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M4 19V5M4 19h16" strokeLinecap="round" />
          <path d="M7 15l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="label-caps">Weekly Progress</h2>
      </div>

      <div className="mb-2 flex items-end gap-2">
        <span className="display-lg text-[var(--color-on-surface)]">{progress.totalMin}</span>
        <span className="mb-2 text-sm text-[var(--color-on-surface-variant)]">Min Total</span>
      </div>

      <div
        className="mb-2 h-1 overflow-hidden rounded-full bg-[var(--color-surface-highest)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Weekly goal progress"
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--glow-sage)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mb-8 flex justify-between text-xs text-[var(--color-on-surface-variant)]">
        <span>Goal: {progress.goalMin}m</span>
        <span>{pct}%</span>
      </div>

      <div className="mb-8">
        <MoodInsightCard serverMood={progress.mood} />
      </div>

      <h3 className="label-caps mb-4 text-[var(--color-on-surface-variant)]">
        Recent Sessions
      </h3>

      {!signedIn ? (
        <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>{" "}
          to track your practice here.
        </p>
      ) : progress.recent.length === 0 ? (
        <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          No sessions yet this week. Start a technique when you are ready.
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {progress.recent.map((session) => {
            const pattern = getPatternById(session.patternId);
            return (
              <li key={session.id}>
                <Link
                  href={`/session/${session.patternId}`}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  <PatternIconBadge
                    icon={pattern?.icon ?? "box"}
                    accent={session.accent}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[var(--color-on-surface)]">
                      {session.patternName}
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      {session.when}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-on-surface-variant)]">
                    {session.durationMin}m
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
