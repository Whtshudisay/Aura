import type { PatternAccent, PatternIcon as IconId } from "@/lib/types";
import { cn } from "@/lib/utils";

const accentText: Record<PatternAccent, string> = {
  sage: "text-[var(--color-primary)]",
  teal: "text-[var(--color-secondary)]",
  lavender: "text-[var(--color-tertiary)]",
};

const accentBg: Record<PatternAccent, string> = {
  sage: "bg-[var(--accent-sage-soft)]",
  teal: "bg-[var(--accent-teal-soft)]",
  lavender: "bg-[var(--accent-lavender-soft)]",
};

function Glyph({ id }: { id: IconId }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };

  switch (id) {
    case "box":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z" />
        </svg>
      );
    case "equal":
      return (
        <svg {...common}>
          <path d="M6 9h12M6 15h12" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19c8-1 12-7 14-14-7 2-13 6-14 14Z" />
          <path d="M5 19c3-4 7-7 12-9" />
        </svg>
      );
    case "sigh":
      return (
        <svg {...common}>
          <path d="M4 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
          <path d="M8 8c1-1.5 2-1.5 3 0" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <path d="M12 5 20 19H4L12 5Z" />
        </svg>
      );
    case "coherent":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );
    case "energy":
      return (
        <svg {...common}>
          <path d="M13 3 6 14h6l-1 7 7-11h-6l1-7Z" />
        </svg>
      );
    case "relax":
      return (
        <svg {...common}>
          <path d="M4 15c3 3 6 3 8 0s5-3 8 0" />
          <circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
  }
}

export function PatternIconBadge({
  icon,
  accent,
  size = "md",
}: {
  icon: IconId;
  accent: PatternAccent;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        accentBg[accent],
        accentText[accent],
        size === "sm" ? "h-8 w-8" : "h-11 w-11",
      )}
      aria-hidden
    >
      <Glyph id={icon} />
    </span>
  );
}
