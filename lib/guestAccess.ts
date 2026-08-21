/** Patterns guests may start without signing in. */
export const GUEST_ALLOWED_PATTERN_IDS = ["box-breathing"] as const;

export type GuestAllowedPatternId = (typeof GUEST_ALLOWED_PATTERN_IDS)[number];

export function isGuestAllowedPattern(patternId: string): boolean {
  return (GUEST_ALLOWED_PATTERN_IDS as readonly string[]).includes(patternId);
}
