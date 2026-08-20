"use client";

export function SessionControls({
  hasStarted,
  isRunning,
  isComplete,
  onStart,
  onPause,
  onRestart,
}: {
  hasStarted: boolean;
  isRunning: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}) {
  if (!hasStarted || isComplete) {
    return (
      <div className="flex flex-col items-center gap-3" role="group" aria-label="Session controls">
        <button
          type="button"
          onClick={isComplete ? onRestart : onStart}
          className="rounded-full bg-[var(--color-secondary)] px-8 py-3.5 text-sm font-medium tracking-wide text-[var(--color-on-secondary)] shadow-[0_0_24px_var(--glow-teal)] transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          {isComplete ? "Restart" : "Start"}
        </button>
        {isComplete && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Session complete. Rest for a moment, or restart when ready.
          </p>
        )}
        {!hasStarted && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Press Start when you are ready.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="glass-strong flex items-center rounded-full px-2 py-2"
      role="group"
      aria-label="Session controls"
    >
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className="flex h-12 min-w-[3.5rem] items-center justify-center gap-2 rounded-full px-3 text-[var(--color-on-surface)] transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-label={isRunning ? "Pause session" : "Resume session"}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
        <span className="sr-only sm:not-sr-only sm:text-xs sm:tracking-wide">
          {isRunning ? "Pause" : "Resume"}
        </span>
      </button>

      <span className="h-6 w-px bg-white/15" aria-hidden />

      <button
        type="button"
        onClick={onRestart}
        className="flex h-12 min-w-[3.5rem] items-center justify-center gap-2 rounded-full px-3 text-[var(--color-on-surface)] transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-label="Restart session"
      >
        <RestartIcon />
        <span className="sr-only sm:not-sr-only sm:text-xs sm:tracking-wide">Restart</span>
      </button>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="M4.5 12a7.5 7.5 0 0 1 12.7-5.4M19.5 12a7.5 7.5 0 0 1-12.7 5.4"
        strokeLinecap="round"
      />
      <path d="M17 3.5v4h-4M7 20.5v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
