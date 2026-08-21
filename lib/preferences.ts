/** Client preference keys (localStorage). */

export const PREFS = {
  haptics: "aura.haptics.enabled",
  soundEnabled: "aura.sound.enabled",
  soundTrack: "aura.sound.track",
  soundVolume: "aura.sound.volume",
  pacingMode: "aura.pacing.mode",
  moodLog: "aura.mood.log",
} as const;

export type AmbientTrackId = "rain" | "meditation" | "off";

export const AMBIENT_TRACKS: Array<{
  id: Exclude<AmbientTrackId, "off">;
  label: string;
  src: string;
}> = [
  { id: "rain", label: "Rain", src: "/audio/rain.mp3" },
  { id: "meditation", label: "Meditation", src: "/audio/meditation.mp3" },
];

export function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "1" || v === "true";
  } catch {
    return fallback;
  }
}

export function writeBool(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore quota / private mode
  }
}

export function readString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function readNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

export function writeNumber(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}
