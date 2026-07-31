"use client";

import { useCallback, useRef } from "react";

const PREFERRED_VOICES = [
  "Samantha",
  "Karen",
  "Daniel",
  "Moira",
  "Tessa",
  "Google US English",
  "Microsoft Zira",
  "Microsoft David",
  "Microsoft Mark",
];

function findBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  for (const name of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  const enVoices = voices.filter((v) => v.lang.startsWith("en"));
  return enVoices[0] || voices[0];
}

export function useSpeech() {
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voice = findBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onerror = () => {};
    utterance.onend = () => {
      currentUtterance.current = null;
    };

    currentUtterance.current = utterance;

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, []);

  return speak;
}
