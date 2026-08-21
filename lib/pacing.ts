export const PACING_MODES = ["gentle", "standard", "deep"] as const;

export type PacingMode = (typeof PACING_MODES)[number];

export const PACING: Record<
  PacingMode,
  { label: string; hint: string; multiplier: number }
> = {
  gentle: { label: "Gentle", hint: "Shorter phases", multiplier: 0.75 },
  standard: { label: "Standard", hint: "As written", multiplier: 1 },
  deep: { label: "Deep", hint: "Longer phases", multiplier: 1.25 },
};

export function isPacingMode(value: string): value is PacingMode {
  return (PACING_MODES as readonly string[]).includes(value);
}

/** Scale phase seconds (Box 4s → Gentle 3s, Deep 5s). Floor at 1s. */
export function scalePhases(phases: number[], multiplier: number): number[] {
  const m = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1;
  return phases.map((sec) => Math.max(1, Math.round(sec * m)));
}
