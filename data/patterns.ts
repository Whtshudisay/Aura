import type { BreathingPattern } from "@/lib/types";

/**
 * Modular breathing pattern catalog.
 * Add new techniques here — the library and session pages pick them up automatically.
 *
 * Alternate Nostril (Nadi Shodhana) uses timed phases only: the timer does not
 * guide left/right nostril switching. Users follow that manually if desired.
 */
export const patterns: BreathingPattern[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    shortName: "Box Breathing",
    description:
      "Equal inhale, hold, exhale, and hold — a Navy SEAL classic for sharp focus and calm under pressure.",
    phases: [4, 4, 4, 4],
    phaseLabels: ["Inhale", "Hold", "Exhale", "Hold"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 10,
    defaultSets: 4,
    accent: "sage",
    tag: "Recommended for Focus",
    featured: true,
    category: "focus",
    icon: "box",
  },
  {
    id: "4-7-8-sleep",
    name: "4-7-8 Sleep",
    shortName: "4-7-8 Sleep",
    description: "Dr. Weil's technique to quiet the nervous system and ease into rest.",
    phases: [4, 7, 8],
    phaseLabels: ["Inhale", "Hold", "Exhale"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 5,
    defaultSets: 4,
    accent: "sage",
    category: "sleep",
    icon: "moon",
  },
  {
    id: "equal-breathing",
    name: "Equal Breathing",
    shortName: "Equal Breathing",
    description: "Sama Vritti — balanced inhale and exhale to steady the mind.",
    phases: [4, 4],
    phaseLabels: ["Inhale", "Exhale"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 10,
    defaultSets: 6,
    accent: "lavender",
    category: "balance",
    icon: "equal",
  },
  {
    id: "resonance",
    name: "Resonance",
    shortName: "Resonance",
    description: "Slow ~6 breaths/min rhythm that supports heart–breath coherence.",
    phases: [5, 5],
    phaseLabels: ["Inhale", "Exhale"],
    recommendedDurations: [5, 10, 20],
    defaultDurationMin: 10,
    defaultSets: 8,
    accent: "teal",
    category: "coherence",
    icon: "wave",
  },
  {
    id: "alternate-nostril",
    name: "Alternate Nostril",
    shortName: "Alternate Nostril",
    description:
      "Nadi Shodhana — balances energy channels. Timer guides phases; switch nostrils manually.",
    phases: [4, 4, 4, 4],
    phaseLabels: ["Inhale", "Hold", "Exhale", "Hold"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 10,
    defaultSets: 4,
    accent: "sage",
    category: "balance",
    icon: "leaf",
  },
  {
    id: "physiological-sigh",
    name: "Physiological Sigh",
    shortName: "Physiological Sigh",
    description: "Double inhale then long exhale — rapid stress reset backed by research.",
    phases: [2, 1, 6],
    phaseLabels: ["Inhale", "Inhale", "Exhale"],
    recommendedDurations: [3, 5, 10],
    defaultDurationMin: 5,
    defaultSets: 3,
    accent: "teal",
    category: "stress",
    icon: "sigh",
    stub: true,
  },
  {
    id: "triangle-breathing",
    name: "Triangle Breathing",
    shortName: "Triangle",
    description: "Inhale, hold, exhale — three equal sides for grounded calm.",
    phases: [4, 4, 4],
    phaseLabels: ["Inhale", "Hold", "Exhale"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 10,
    defaultSets: 5,
    accent: "sage",
    category: "focus",
    icon: "triangle",
    stub: true,
  },
  {
    id: "coherent-breathing",
    name: "Coherent Breathing",
    shortName: "Coherent",
    description: "Five-second inhale and exhale for autonomic balance.",
    phases: [5, 5],
    phaseLabels: ["Inhale", "Exhale"],
    recommendedDurations: [10, 15, 20],
    defaultDurationMin: 15,
    defaultSets: 10,
    accent: "teal",
    category: "coherence",
    icon: "coherent",
    stub: true,
  },
  {
    id: "energizing-breath",
    name: "Energizing Breath",
    shortName: "Energizing",
    description: "Shorter inhale, longer hold — gentle lift without strain.",
    phases: [3, 6, 3],
    phaseLabels: ["Inhale", "Hold", "Exhale"],
    recommendedDurations: [5, 10],
    defaultDurationMin: 5,
    defaultSets: 6,
    accent: "lavender",
    category: "energy",
    icon: "energy",
    stub: true,
  },
  {
    id: "relaxing-breath",
    name: "Relaxing Breath",
    shortName: "Relaxing",
    description: "Longer exhale than inhale to activate the parasympathetic system.",
    phases: [4, 6],
    phaseLabels: ["Inhale", "Exhale"],
    recommendedDurations: [5, 10, 15],
    defaultDurationMin: 10,
    defaultSets: 6,
    accent: "lavender",
    category: "sleep",
    icon: "relax",
    stub: true,
  },
];

export function getPatternById(id: string): BreathingPattern | undefined {
  return patterns.find((p) => p.id === id);
}

export function getFeaturedPattern(): BreathingPattern {
  return patterns.find((p) => p.featured) ?? patterns[0];
}

/** Patterns shown on the home grid (non-featured, first 4 + room for View All). */
export function getLibraryGridPatterns(): BreathingPattern[] {
  return patterns.filter((p) => !p.featured).slice(0, 4);
}

export function getAllPatterns(): BreathingPattern[] {
  return patterns;
}

/** Approximate sets from duration (minutes) using sum of phase seconds. */
export function setsFromDuration(pattern: BreathingPattern, durationMin: number): number {
  const cycleSec = pattern.phases.reduce((a, b) => a + b, 0);
  if (cycleSec <= 0) return pattern.defaultSets;
  return Math.max(1, Math.round((durationMin * 60) / cycleSec));
}
