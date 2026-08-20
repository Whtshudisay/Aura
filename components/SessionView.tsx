"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { BreathingPattern } from "@/lib/types";
import { useBreathingTimer } from "@/hooks/useBreathingTimer";
import { BreathingOrb } from "@/components/BreathingOrb";
import { SessionControls } from "@/components/SessionControls";
import { setsFromDuration } from "@/data/patterns";
import { saveCompletedSession } from "@/app/actions/progress";

export function SessionView({
  pattern,
  durationMin,
}: {
  pattern: BreathingPattern;
  durationMin: number;
}) {
  const router = useRouter();
  const totalSets = setsFromDuration(pattern, durationMin);
  const [hasStarted, setHasStarted] = useState(false);
  const savedRef = useRef(false);

  const onComplete = useCallback(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    void saveCompletedSession({
      patternId: pattern.id,
      patternName: pattern.name,
      durationMin,
      accent: pattern.accent,
    }).then(() => {
      router.refresh();
    });
  }, [pattern.id, pattern.name, pattern.accent, durationMin, router]);

  const timer = useBreathingTimer({
    phases: pattern.phases,
    phaseLabels: pattern.phaseLabels,
    totalSets,
    autoStart: false,
    onComplete,
  });

  // Keep hasStarted in sync if timer somehow running
  useEffect(() => {
    if (timer.isRunning) setHasStarted(true);
  }, [timer.isRunning]);

  const phaseHue = timer.phaseLabel.toLowerCase().includes("exhale")
    ? "rgba(175, 203, 214, 0.1)"
    : timer.phaseLabel.toLowerCase().includes("hold")
      ? "rgba(203, 190, 255, 0.08)"
      : "rgba(172, 206, 197, 0.12)";

  const close = () => router.push("/");

  const start = () => {
    setHasStarted(true);
    timer.start();
  };

  const restart = () => {
    savedRef.current = false;
    timer.reset();
    setHasStarted(false);
  };

  const displayLabel = hasStarted
    ? timer.phaseLabel
    : "Ready";
  const displaySeconds = hasStarted ? timer.secondsRemaining : pattern.phases[0] ?? 4;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${
            hasStarted ? phaseHue : "rgba(172, 206, 197, 0.08)"
          }, transparent 70%)`,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="page-shell relative z-10 flex items-center justify-between py-6">
        <div
          className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-[var(--color-on-surface-variant)]"
          aria-live="polite"
        >
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--glow-sage)]"
            aria-hidden
          />
          <span className="label-caps tracking-[0.12em]">
            Set {hasStarted ? timer.currentSet : 1} of {timer.totalSets}
          </span>
        </div>

        <button
          type="button"
          onClick={close}
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          aria-label="Close session"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8">
        <p className="label-caps mb-8 text-[var(--color-on-surface-variant)]">
          {pattern.name}
        </p>

        <BreathingOrb
          phaseLabel={displayLabel}
          secondsRemaining={displaySeconds}
          orbScale={hasStarted ? timer.orbScale : 0.35}
          phaseProgress={hasStarted ? timer.phaseProgress : 0}
          isRunning={timer.isRunning}
        />
      </div>

      <div className="relative z-10 flex justify-center pb-10 pt-2">
        <SessionControls
          hasStarted={hasStarted}
          isRunning={timer.isRunning}
          isComplete={timer.isComplete}
          onStart={start}
          onPause={timer.pause}
          onRestart={restart}
        />
      </div>
    </div>
  );
}
