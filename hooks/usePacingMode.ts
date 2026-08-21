"use client";

import { useCallback, useEffect, useState } from "react";
import { PREFS, readString, writeString } from "@/lib/preferences";
import { isPacingMode, PACING, type PacingMode } from "@/lib/pacing";

export function usePacingMode() {
  const [mode, setModeState] = useState<PacingMode>("standard");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readString(PREFS.pacingMode, "standard");
    setModeState(isPacingMode(stored) ? stored : "standard");
    setReady(true);
  }, []);

  const setMode = useCallback((next: PacingMode) => {
    setModeState(next);
    writeString(PREFS.pacingMode, next);
  }, []);

  return {
    mode,
    setMode,
    ready,
    multiplier: PACING[mode].multiplier,
  };
}
