"use client";

import Link from "next/link";
import type { BreathingPattern } from "@/lib/types";
import { PatternIconBadge } from "@/components/PatternIcon";

export function TechniqueCard({
  pattern,
  locked = false,
}: {
  pattern: BreathingPattern;
  locked?: boolean;
}) {
  if (locked) {
    return (
      <div className="glass relative flex h-full min-h-[200px] flex-col rounded-[var(--radius-md)] p-5 opacity-80 sm:min-h-[220px] sm:p-6">
        <PatternIconBadge icon={pattern.icon} accent={pattern.accent} />
        <h3 className="mt-4 text-lg font-medium tracking-wide text-[var(--color-on-surface)]">
          {pattern.shortName}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)] sm:text-[0.95rem]">
          {pattern.description}
        </p>
        <Link
          href={`/login?mode=register&next=/session/${pattern.id}`}
          className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          <LockIcon />
          Sign up to unlock
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/session/${pattern.id}?duration=${pattern.defaultDurationMin}`}
      className="glass group flex h-full min-h-[200px] flex-col rounded-[var(--radius-md)] p-5 sm:min-h-[220px] sm:p-6 transition-colors hover:bg-[var(--glass-fill-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      <PatternIconBadge icon={pattern.icon} accent={pattern.accent} />
      <h3 className="mt-4 text-lg font-medium tracking-wide text-[var(--color-on-surface)]">
        {pattern.shortName}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)] sm:text-[0.95rem]">
        {pattern.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-primary)]">
        Start
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}

export function ViewAllCard({ total }: { total: number }) {
  return (
    <Link
      href="/library"
      className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--glass-border)] p-5 text-center text-[var(--color-on-surface-variant)] transition-colors hover:border-[var(--color-primary)]/50 hover:text-[var(--color-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:min-h-[220px]"
    >
      <span className="text-2xl font-light text-[var(--color-primary)]" aria-hidden>
        +
      </span>
      <span className="mt-2 text-sm tracking-wide sm:text-base">
        View All {total} Techniques
      </span>
    </Link>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
