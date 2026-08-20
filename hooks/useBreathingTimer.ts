"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseBreathingTimerOptions {
  /** Phase durations in seconds, e.g. [4, 4, 4, 4]. */
  phases: number[];
  /** Labels aligned with phases (Inhale / Hold / Exhale / …). */
  phaseLabels?: string[];
  /** How many full cycles to run. Default: Infinity (manual stop). */
  totalSets?: number;
  /** Auto-start when mounted / when phases change. Default: false. */
  autoStart?: boolean;
  onPhaseChange?: (info: {
    phaseIndex: number;
    label: string;
    duration: number;
    set: number;
  }) => void;
  onSetComplete?: (set: number) => void;
  onComplete?: () => void;
}

export interface BreathingTimerState {
  isRunning: boolean;
  isComplete: boolean;
  phaseIndex: number;
  phaseLabel: string;
  phaseDuration: number;
  /** Whole seconds remaining in the current phase (ceil for display). */
  secondsRemaining: number;
  /** 0–1 progress through the current phase. */
  phaseProgress: number;
  /** Current set (1-based while running). */
  currentSet: number;
  totalSets: number;
  /** 0–1 progress through the full session (all sets). */
  sessionProgress: number;
  /** Scale hint: 1 = expanded (inhale end), 0 = contracted (exhale end). */
  orbScale: number;
}

export interface BreathingTimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
}

const defaultLabels = ["Inhale", "Hold", "Exhale", "Hold"];

function labelFor(labels: string[] | undefined, index: number): string {
  const list = labels?.length ? labels : defaultLabels;
  return list[index % list.length] ?? "Breathe";
}

/**
 * Accurate breathing timer using requestAnimationFrame + timestamps
 * to avoid interval drift. Cleans up on unmount.
 */
export function useBreathingTimer({
  phases,
  phaseLabels,
  totalSets = Infinity,
  autoStart = false,
  onPhaseChange,
  onSetComplete,
  onComplete,
}: UseBreathingTimerOptions): BreathingTimerState & BreathingTimerControls {
  const safePhases = phases.length > 0 ? phases : [4];
  const finiteSets = Number.isFinite(totalSets) ? Math.max(1, totalSets) : Infinity;

  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedInPhase, setElapsedInPhase] = useState(0);

  const phaseIndexRef = useRef(0);
  const currentSetRef = useRef(1);
  const elapsedRef = useRef(0);
  const runningRef = useRef(autoStart);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const onPhaseChangeRef = useRef(onPhaseChange);
  const onSetCompleteRef = useRef(onSetComplete);
  const onCompleteRef = useRef(onComplete);
  onPhaseChangeRef.current = onPhaseChange;
  onSetCompleteRef.current = onSetComplete;
  onCompleteRef.current = onComplete;

  const phasesKey = safePhases.join(",");
  const labelsKey = (phaseLabels ?? []).join(",");

  const emitPhase = useCallback(
    (index: number, set: number) => {
      onPhaseChangeRef.current?.({
        phaseIndex: index,
        label: labelFor(phaseLabels, index),
        duration: safePhases[index] ?? 0,
        set,
      });
    },
    [phaseLabels, safePhases],
  );

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stopRaf();
    runningRef.current = false;
    phaseIndexRef.current = 0;
    currentSetRef.current = 1;
    elapsedRef.current = 0;
    setIsRunning(false);
    setIsComplete(false);
    setPhaseIndex(0);
    setCurrentSet(1);
    setElapsedInPhase(0);
  }, [stopRaf]);

  // Reset when pattern / set config changes
  useEffect(() => {
    reset();
    if (autoStart) {
      runningRef.current = true;
      setIsRunning(true);
      emitPhase(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only on pattern identity
  }, [phasesKey, labelsKey, finiteSets, autoStart]);

  useEffect(() => {
    if (!isRunning || isComplete) {
      stopRaf();
      return;
    }

    const tick = (ts: number) => {
      if (!runningRef.current) return;

      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
      }
      const delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      let elapsed = elapsedRef.current + delta;
      let index = phaseIndexRef.current;
      let set = currentSetRef.current;
      let duration = safePhases[index] ?? 4;

      while (elapsed >= duration) {
        elapsed -= duration;
        const nextIndex = index + 1;

        if (nextIndex >= safePhases.length) {
          onSetCompleteRef.current?.(set);
          if (set >= finiteSets) {
            elapsedRef.current = duration;
            phaseIndexRef.current = index;
            currentSetRef.current = set;
            setElapsedInPhase(duration);
            setPhaseIndex(index);
            setCurrentSet(set);
            setIsRunning(false);
            setIsComplete(true);
            runningRef.current = false;
            stopRaf();
            onCompleteRef.current?.();
            return;
          }
          set += 1;
          index = 0;
        } else {
          index = nextIndex;
        }

        duration = safePhases[index] ?? 4;
        phaseIndexRef.current = index;
        currentSetRef.current = set;
        setPhaseIndex(index);
        setCurrentSet(set);
        emitPhase(index, set);
      }

      elapsedRef.current = elapsed;
      setElapsedInPhase(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stopRaf;
  }, [isRunning, isComplete, safePhases, finiteSets, emitPhase, stopRaf]);

  const start = useCallback(() => {
    if (isComplete) {
      phaseIndexRef.current = 0;
      currentSetRef.current = 1;
      elapsedRef.current = 0;
      setPhaseIndex(0);
      setCurrentSet(1);
      setElapsedInPhase(0);
      setIsComplete(false);
      emitPhase(0, 1);
    } else if (!runningRef.current && elapsedRef.current === 0 && phaseIndexRef.current === 0) {
      emitPhase(0, currentSetRef.current);
    }
    runningRef.current = true;
    setIsRunning(true);
  }, [isComplete, emitPhase]);

  const pause = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    lastTsRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (runningRef.current) pause();
    else start();
  }, [pause, start]);

  const phaseDuration = safePhases[phaseIndex] ?? 4;
  const phaseProgress = phaseDuration > 0 ? Math.min(1, elapsedInPhase / phaseDuration) : 0;
  const secondsRemaining = Math.max(0, Math.ceil(phaseDuration - elapsedInPhase));
  const phaseLabel = labelFor(phaseLabels, phaseIndex);

  const cycleSec = safePhases.reduce((a, b) => a + b, 0);
  const completedSets = Math.max(0, currentSet - 1);
  const completedInSet = safePhases
    .slice(0, phaseIndex)
    .reduce((a, b) => a + b, 0);
  const sessionElapsed = completedSets * cycleSec + completedInSet + elapsedInPhase;
  const sessionTotal = Number.isFinite(finiteSets) ? finiteSets * cycleSec : cycleSec;
  const sessionProgress =
    sessionTotal > 0 ? Math.min(1, sessionElapsed / sessionTotal) : phaseProgress;

  const orbScale = computeOrbScale(phaseLabels, phaseIndex, phaseProgress);

  return {
    isRunning,
    isComplete,
    phaseIndex,
    phaseLabel,
    phaseDuration,
    secondsRemaining,
    phaseProgress,
    currentSet,
    totalSets: Number.isFinite(finiteSets) ? finiteSets : currentSet,
    sessionProgress,
    orbScale,
    start,
    pause,
    reset,
    toggle,
  };
}

/**
 * Map phase to orb fullness (0 contracted → 1 expanded).
 * Holds keep the size of the preceding breath action.
 */
function computeOrbScale(
  labels: string[] | undefined,
  phaseIndex: number,
  progress: number,
): number {
  const list = labels?.length ? labels : defaultLabels;
  const label = (list[phaseIndex] ?? "").toLowerCase();

  if (label.includes("inhale")) return progress;
  if (label.includes("exhale")) return 1 - progress;

  if (label.includes("hold")) {
    // Look backward for last inhale/exhale to decide held size
    for (let i = phaseIndex - 1; i >= 0; i--) {
      const prev = (list[i] ?? "").toLowerCase();
      if (prev.includes("inhale")) return 1;
      if (prev.includes("exhale")) return 0;
    }
    // Hold at start of cycle (unusual): assume expanded after prior cycle inhale
    return 1;
  }

  return 0.5 + progress * 0.5;
}
