export const MOOD_OPTIONS: Array<{
  id: import("@/lib/types").SessionMood;
  emoji: string;
  label: string;
}> = [
  { id: "stressed", emoji: "😣", label: "Stressed" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "calmer", emoji: "😌", label: "Calmer" },
  { id: "relaxed", emoji: "✨", label: "Relaxed" },
];
