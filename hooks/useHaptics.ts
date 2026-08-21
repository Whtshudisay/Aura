"use client";

import { useCallback, useEffect, useState } from "react";
import { PREFS, readBool, writeBool } from "@/lib/preferences";

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/** Soft pulse on phase change — short enough to feel calm, not alarming. */
export function pulseHaptic(pattern: number | number[] = 18): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers expose vibrate but throw when unsupported.
  }
}

export function useHaptics(defaultEnabled = true) {
  const [enabled, setEnabledState] = useState(defaultEnabled);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(canVibrate());
    setEnabledState(readBool(PREFS.haptics, defaultEnabled));
  }, [defaultEnabled]);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    writeBool(PREFS.haptics, value);
    if (value) pulseHaptic(12);
  }, []);

  const vibratePhaseChange = useCallback(() => {
    if (!enabled) return;
    pulseHaptic([16, 30, 16]);
  }, [enabled]);

  return {
    enabled,
    setEnabled,
    supported,
    vibratePhaseChange,
  };
}
