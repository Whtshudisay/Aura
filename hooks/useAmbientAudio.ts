"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AMBIENT_TRACKS,
  PREFS,
  readBool,
  readNumber,
  readString,
  writeBool,
  writeNumber,
  writeString,
  type AmbientTrackId,
} from "@/lib/preferences";

export function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabledState] = useState(false);
  const [trackId, setTrackIdState] = useState<AmbientTrackId>("rain");
  const [volume, setVolumeState] = useState(0.4);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setEnabledState(readBool(PREFS.soundEnabled, false));
    const savedTrack = readString(PREFS.soundTrack, "rain") as AmbientTrackId;
    setTrackIdState(
      savedTrack === "meditation" || savedTrack === "rain" || savedTrack === "off"
        ? savedTrack
        : "rain",
    );
    setVolumeState(Math.min(1, Math.max(0, readNumber(PREFS.soundVolume, 0.4))));
  }, []);

  const ensureAudio = useCallback((src: string) => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    if (!audio.src.endsWith(src)) {
      audio.src = src;
    }
    audio.loop = true;
    return audio;
  }, []);

  const resolveSrc = useCallback((id: AmbientTrackId) => {
    if (id === "off") return null;
    return AMBIENT_TRACKS.find((t) => t.id === id)?.src ?? null;
  }, []);

  const play = useCallback(async () => {
    const id = trackId === "off" ? "rain" : trackId;
    const src = resolveSrc(id);
    if (!src || !enabled) return;
    const audio = ensureAudio(src);
    audio.volume = volume;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [enabled, ensureAudio, resolveSrc, trackId, volume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      writeBool(PREFS.soundEnabled, value);
      if (!value) {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    },
    [],
  );

  const setTrackId = useCallback(
    (id: AmbientTrackId) => {
      setTrackIdState(id);
      writeString(PREFS.soundTrack, id);
      if (id === "off") {
        setEnabled(false);
        return;
      }
      const src = resolveSrc(id);
      if (!src) return;
      const audio = ensureAudio(src);
      audio.volume = volume;
      if (enabled && !audio.paused) {
        void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    },
    [enabled, ensureAudio, resolveSrc, setEnabled, volume],
  );

  const setVolume = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value));
    setVolumeState(next);
    writeNumber(PREFS.soundVolume, next);
    if (audioRef.current) audioRef.current.volume = next;
  }, []);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  return {
    enabled,
    setEnabled,
    trackId,
    setTrackId,
    volume,
    setVolume,
    isPlaying,
    play,
    pause,
    stop,
    tracks: AMBIENT_TRACKS,
  };
}
