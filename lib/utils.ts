import type { PatternAccent } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

/** CSS variable / utility mapping for pattern accents (editable tokens). */
export const accentStyles: Record<
  PatternAccent,
  { soft: string; solid: string; glow: string; ring: string }
> = {
  sage: {
    soft: "bg-[var(--accent-sage-soft)]",
    solid: "bg-[var(--color-primary)]",
    glow: "shadow-[0_0_24px_var(--glow-sage)]",
    ring: "ring-[var(--color-primary)]",
  },
  teal: {
    soft: "bg-[var(--accent-teal-soft)]",
    solid: "bg-[var(--color-secondary)]",
    glow: "shadow-[0_0_24px_var(--glow-teal)]",
    ring: "ring-[var(--color-secondary)]",
  },
  lavender: {
    soft: "bg-[var(--accent-lavender-soft)]",
    solid: "bg-[var(--color-tertiary)]",
    glow: "shadow-[0_0_24px_var(--glow-lavender)]",
    ring: "ring-[var(--color-tertiary)]",
  },
};
