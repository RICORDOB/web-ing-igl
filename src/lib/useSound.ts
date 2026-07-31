"use client";

import { useCallback, useRef } from "react";

type SoundType = "correct" | "wrong" | "levelup" | "click" | "badge" | "countdown";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playNotes(notes: [number, number][], type: OscillatorType = "sine") {
  notes.forEach(([freq, start], i) => {
    setTimeout(() => playTone(freq, 0.15, type), start * 1000);
  });
}

const SOUNDS: Record<SoundType, () => void> = {
  correct: () => playNotes([
    [523, 0], [659, 0.1], [784, 0.2],
  ]),
  wrong: () => playNotes([
    [300, 0], [250, 0.15],
  ], "sawtooth"),
  levelup: () => playNotes([
    [523, 0], [659, 0.1], [784, 0.2], [1047, 0.3],
  ]),
  click: () => playTone(600, 0.05, "sine", 0.08),
  badge: () => playNotes([
    [784, 0], [988, 0.15], [1175, 0.3], [1568, 0.5],
  ]),
  countdown: () => playTone(440, 0.1, "square", 0.05),
};

export function useSound() {
  const lastPlayed = useRef<Record<string, number>>({});

  const play = useCallback((type: SoundType) => {
    const now = Date.now();
    if (lastPlayed.current[type] && now - lastPlayed.current[type] < 300) return;
    lastPlayed.current[type] = now;
    try {
      SOUNDS[type]();
    } catch {}
  }, []);

  return { play };
}
