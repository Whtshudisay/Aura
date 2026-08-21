"use client";

import Link from "next/link";

/** Guest-safe Box Breathing, 5 min, auto-starts on the session screen. */
export const CALM_NOW_HREF = "/session/box-breathing?duration=5&autostart=1";

export function CalmNowFab() {
  return (
    <Link
      href={CALM_NOW_HREF}
      className="glow-primary fixed bottom-20 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-4 py-3 text-sm font-medium text-[var(--color-on-secondary)] shadow-[0_0_28px_var(--glow-teal)] transition-transform hover:scale-[1.03] active:scale-[0.98] sm:bottom-8 sm:right-8"
      aria-label="Calm me down now. Starts Box Breathing immediately."
    >
      <CalmIcon />
      Calm me down now
    </Link>
  );
}

export function CalmNowBanner() {
  return (
    <Link
      href={CALM_NOW_HREF}
      className="glass group flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-5 py-4 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-teal-soft)] text-[var(--color-secondary)]">
          <CalmIcon />
        </span>
        <span>
          <span className="block text-sm text-[var(--color-on-surface)]">
            Need to settle right now?
          </span>
          <span className="block text-xs text-[var(--color-on-surface-variant)]">
            Skip the menus. Box Breathing starts instantly.
          </span>
        </span>
      </span>
      <span className="label-caps text-[var(--color-secondary)] group-hover:underline">
        Begin
      </span>
    </Link>
  );
}

function CalmIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" opacity="0.7" />
    </svg>
  );
}
