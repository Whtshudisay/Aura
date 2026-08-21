"use client";

import type { AmbientTrackId } from "@/lib/preferences";

export function SessionExtras({
  hapticsEnabled,
  hapticsSupported,
  onToggleHaptics,
  soundEnabled,
  onToggleSound,
  trackId,
  onTrackChange,
  volume,
  onVolumeChange,
  tracks,
}: {
  hapticsEnabled: boolean;
  hapticsSupported: boolean;
  onToggleHaptics: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  trackId: AmbientTrackId;
  onTrackChange: (id: AmbientTrackId) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  tracks: Array<{ id: Exclude<AmbientTrackId, "off">; label: string }>;
}) {
  return (
    <div className="glass flex w-full max-w-md flex-col gap-3 rounded-[var(--radius-md)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-on-surface)]">Haptics</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            {hapticsSupported
              ? "Vibrate on phase changes"
              : "Not supported on this device"}
          </p>
        </div>
        <Toggle
          pressed={hapticsEnabled && hapticsSupported}
          disabled={!hapticsSupported}
          onClick={onToggleHaptics}
          label={hapticsEnabled ? "Haptics on" : "Haptics off"}
        />
      </div>

      <div className="h-px bg-white/10" aria-hidden />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-on-surface)]">Ambient sound</p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Loops while you breathe
          </p>
        </div>
        <Toggle
          pressed={soundEnabled}
          onClick={onToggleSound}
          label={soundEnabled ? "Sound on" : "Sound off"}
        />
      </div>

      {soundEnabled && (
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Ambient track">
            {tracks.map((track) => {
              const active = trackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => onTrackChange(track.id)}
                  className={
                    active
                      ? "rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs text-[var(--color-on-primary)]"
                      : "rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)]"
                  }
                  aria-pressed={active}
                >
                  {track.label}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)]">
            <span className="w-12 shrink-0">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
              aria-label="Ambient volume"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function Toggle({
  pressed,
  onClick,
  label,
  disabled,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={
        pressed
          ? "rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-on-primary)] disabled:opacity-40"
          : "rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--color-on-surface-variant)] disabled:opacity-40"
      }
    >
      {pressed ? "On" : "Off"}
    </button>
  );
}
