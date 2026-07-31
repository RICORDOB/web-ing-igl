"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { getItem, setItem } from "@/lib/storage";
import {
  type UserProgress,
  createInitialProgress,
  addXp,
  getLevel,
} from "@/lib/gamification";
import { badges } from "@/data/badges";
import { motivationalVerses } from "@/data/verses";

interface GameContextType {
  progress: UserProgress;
  isAuthenticated: boolean;
  showMotivational: { text: string; reference: string; type: string } | null;
  celebration: { show: boolean; type: "levelup" | "badge" | "complete" };
  login: (username: string) => void;
  logout: () => void;
  completeLesson: (lessonId: string, xp: number) => { leveledUp: boolean; newBadges: string[] };
  addCorrectAnswer: () => void;
  addWordLearned: (count?: number) => void;
  addArenaWin: () => void;
  selectAvatar: (avatarId: string) => void;
  dismissMotivational: () => void;
  dismissCelebration: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

function getRandomVerse(type: string) {
  const filtered = motivationalVerses.filter((v) => v.type === type);
  const pool = filtered.length > 0 ? filtered : motivationalVerses;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = getItem<UserProgress | null>("cristo-english-progress", null);
    const auth = getItem<boolean>("cristo-english-auth", false);
    if (saved) {
      setProgress(saved);
    }
    setIsAuthenticated(auth);
  }, []);
  const [showMotivational, setShowMotivational] = useState<{
    text: string;
    reference: string;
    type: string;
  } | null>(null);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    type: "levelup" | "badge" | "complete";
  }>({ show: false, type: "complete" });

  const saveProgress = useCallback((p: UserProgress) => {
    setProgress(p);
    setItem("cristo-english-progress", p);
  }, []);

  const showVerse = useCallback((type: string) => {
    const verse = getRandomVerse(type);
    setShowMotivational(verse);
    setTimeout(() => setShowMotivational(null), 4000);
  }, []);

  const login = useCallback(
    (username: string) => {
      const p = { ...createInitialProgress(), username };
      setProgress(p);
      setIsAuthenticated(true);
      setItem("cristo-english-progress", p);
      setItem("cristo-english-auth", true);
    },
    []
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setItem("cristo-english-auth", false);
    setProgress(createInitialProgress());
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, xp: number) => {
      const today = new Date().toISOString().split("T")[0];
      const result = addXp(progress, xp, today);
      const newProgress = { ...result.progress };
      newProgress.lessonsCompleted += 1;

      if (!newProgress.completedLessons.includes(lessonId)) {
        newProgress.completedLessons = [...newProgress.completedLessons, lessonId];
      }

      const newBadges: string[] = [];
      for (const badge of badges) {
        if (!newProgress.badges.includes(badge.id)) {
          let earned = false;
          if (badge.id === "mustard-seed" && newProgress.lessonsCompleted >= 1) earned = true;
          if (badge.id === "living-water" && newProgress.lessonsCompleted >= 10) earned = true;
          if (badge.id === "ark-builder" && newProgress.lessonsCompleted >= 30) earned = true;
          if (badge.id === "faithful-servant" && newProgress.lessonsCompleted >= 50) earned = true;
          if (badge.id === "burning-bush" && newProgress.streak >= 7) earned = true;
          if (badge.id === "pentecost" && newProgress.wordsLearned >= 50) earned = true;
          if (badge.id === "tongues-of-fire" && newProgress.wordsLearned >= 200) earned = true;
          if (badge.id === "proverbs-sage" && newProgress.versesCompleted >= 100) earned = true;
          if (badge.id === "word-warrior" && newProgress.bestCorrectStreak >= 100) earned = true;
          if (badge.id === "goliath-slayer" && newProgress.arenaWins >= 5) earned = true;

          if (earned) {
            newBadges.push(badge.id);
            newProgress.badges = [...newProgress.badges, badge.id];
          }
        }
      }

      saveProgress(newProgress);
      showVerse(result.leveledUp ? "levelup" : "success");

      if (result.leveledUp) {
        setCelebration({ show: true, type: "levelup" });
      } else if (newBadges.length > 0) {
        setCelebration({ show: true, type: "badge" });
      } else {
        setCelebration({ show: true, type: "complete" });
      }

      return { leveledUp: result.leveledUp, newBadges };
    },
    [progress, saveProgress, showVerse]
  );

  const addCorrectAnswer = useCallback(() => {
    setProgress((prev) => {
      const newStreak = prev.correctStreak + 1;
      return {
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        correctStreak: newStreak,
        bestCorrectStreak: Math.max(prev.bestCorrectStreak, newStreak),
      };
    });
  }, []);

  const addWordLearned = useCallback(
    (count = 1) => {
      setProgress((prev) => {
        const p = { ...prev, wordsLearned: prev.wordsLearned + count };
        setItem("cristo-english-progress", p);
        return p;
      });
    },
    []
  );

  const addArenaWin = useCallback(() => {
    setProgress((prev) => {
      const p = { ...prev, arenaWins: prev.arenaWins + 1 };
      setItem("cristo-english-progress", p);
      return p;
    });
  }, []);

  const selectAvatar = useCallback(
    (avatarId: string) => {
      setProgress((prev) => {
        const p = { ...prev, avatarId };
        setItem("cristo-english-progress", p);
        return p;
      });
    },
    []
  );

  const dismissMotivational = useCallback(() => {
    setShowMotivational(null);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration((prev) => ({ ...prev, show: false }));
  }, []);

  const contextValue = useMemo(
    () => ({
      progress,
      isAuthenticated,
      showMotivational,
      celebration,
      login,
      logout,
      completeLesson,
      addCorrectAnswer,
      addWordLearned,
      addArenaWin,
      selectAvatar,
      dismissMotivational,
      dismissCelebration,
    }),
    [
      progress,
      isAuthenticated,
      showMotivational,
      celebration,
      login,
      logout,
      completeLesson,
      addCorrectAnswer,
      addWordLearned,
      addArenaWin,
      selectAvatar,
      dismissMotivational,
      dismissCelebration,
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
