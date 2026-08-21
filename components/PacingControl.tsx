"use client";

import { PACING_MODES, PACING, type PacingMode } from "@/lib/pacing";
import { cn } from "@/lib/utils";

export function PacingControl({
  mode,
  onChange,
  disabled,
}: {
  mode: PacingMode;
  onChange: (mode: PacingMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[var(--color-on-surface-variant)]">Lung pacing</p>
      <div
        className="flex flex-wrap gap-1.5"
        role="radiogroup"
        aria-label="Breathing pace"
      >
        {PACING_MODES.map((id) => {
          const selected = mode === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors disabled:opacity-40",
                selected
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "border border-[var(--glass-border)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]",
              )}
            >
              {PACING[id].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
