"use client";

import { type ReactNode } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import MotivationalPhrase from "@/components/MotivationalPhrase";
import Celebration from "@/components/Celebration";
import PwaRegister from "@/components/PwaRegister";

function CelebrationWrapper() {
  const { celebration, dismissCelebration } = useGame();
  return (
    <Celebration
      show={celebration.show}
      type={celebration.type}
      onComplete={dismissCelebration}
    />
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <GameProvider>
        <Navbar />
        <main className="flex-1 page-enter">{children}</main>
        <MotivationalPhrase />
        <CelebrationWrapper />
        <PwaRegister />
      </GameProvider>
    </ThemeProvider>
  );
}
