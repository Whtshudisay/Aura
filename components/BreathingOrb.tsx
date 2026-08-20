"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pad2 } from "@/lib/utils";

export interface BreathingOrbProps {
  phaseLabel: string;
  secondsRemaining: number;
  /** 0 contracted → 1 expanded */
  orbScale: number;
  phaseProgress: number;
  isRunning: boolean;
}

/**
 * Central pulsating breathing circle.
 * Expands on inhale, contracts on exhale; holds keep prior size.
 * Respects prefers-reduced-motion with gentler scaling.
 */
export function BreathingOrb({
  phaseLabel,
  secondsRemaining,
  orbScale,
  phaseProgress,
  isRunning,
}: BreathingOrbProps) {
  const reduceMotion = useReducedMotion();
  const minScale = 0.72;
  const maxScale = 1;
  const visualScale = minScale + orbScale * (maxScale - minScale);
  const gentleScale = reduceMotion
    ? minScale + orbScale * (maxScale - minScale) * 0.45 + 0.2
    : visualScale;

  const label = phaseLabel.toUpperCase();
  const ringOpacity = 0.25 + phaseProgress * 0.15;

  return (
    <div
      className="relative flex h-[min(72vw,340px)] w-[min(72vw,340px)] items-center justify-center sm:h-[380px] sm:w-[380px]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${phaseLabel}, ${secondsRemaining} seconds remaining${isRunning ? "" : ", paused"}`}
    >
      {/* Guide rings */}
      <div
        className="absolute inset-0 rounded-full border border-white/10"
        style={{ opacity: ringOpacity }}
        aria-hidden
      />
      <div
        className="absolute inset-[8%] rounded-full border border-white/[0.07]"
        aria-hidden
      />

      <motion.div
        className="relative flex h-[68%] w-[68%] items-center justify-center rounded-full"
        animate={{ scale: gentleScale }}
        transition={
          reduceMotion
            ? { duration: 0.35, ease: "easeInOut" }
            : { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.45 }
        }
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(172, 206, 197, 0.55), rgba(132, 165, 157, 0.28) 55%, rgba(43, 69, 78, 0.35) 100%)",
          boxShadow:
            "0 0 60px rgba(172, 206, 197, 0.22), inset 0 0 40px rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="label-caps text-[var(--color-on-surface)]/90">{label}</span>
          <span
            className="font-light tabular-nums tracking-[0.08em] text-[var(--color-on-surface)]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", lineHeight: 1.1 }}
          >
            {pad2(secondsRemaining)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
