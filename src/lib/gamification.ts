export interface UserProgress {
  username: string;
  avatarId: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  lessonsCompleted: number;
  wordsLearned: number;
  versesCompleted: number;
  correctAnswers: number;
  correctStreak: number;
  bestCorrectStreak: number;
  badges: string[];
  completedLessons: string[];
  arenaWins: number;
  xpToNextLevel: number;
}

export function createInitialProgress(): UserProgress {
  return {
    username: "",
    avatarId: "lion-of-judah",
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    lessonsCompleted: 0,
    wordsLearned: 0,
    versesCompleted: 0,
    correctAnswers: 0,
    correctStreak: 0,
    bestCorrectStreak: 0,
    badges: [],
    completedLessons: [],
    arenaWins: 0,
    xpToNextLevel: 100,
  };
}

export const LEVEL_THRESHOLDS = [
  { level: 1, xpNeeded: 0, title: "Semilla" },
  { level: 2, xpNeeded: 100, title: "Brote" },
  { level: 3, xpNeeded: 250, title: "Ángel" },
  { level: 4, xpNeeded: 500, title: "Querubín" },
  { level: 5, xpNeeded: 800, title: "Pastorcillo" },
  { level: 6, xpNeeded: 1200, title: "Discípulo" },
  { level: 7, xpNeeded: 1700, title: "Misionero" },
  { level: 8, xpNeeded: 2300, title: "Profeta" },
  { level: 9, xpNeeded: 3000, title: "Apóstol" },
  { level: 10, xpNeeded: 4000, title: "Serafín" },
];

export function getLevel(xp: number): { level: number; title: string; xpToNext: number } {
  const thresholds = [...LEVEL_THRESHOLDS].reverse();
  for (const t of thresholds) {
    if (xp >= t.xpNeeded) {
      const nextThreshold = LEVEL_THRESHOLDS.find((lt) => lt.level === t.level + 1);
      return {
        level: t.level,
        title: t.title,
        xpToNext: nextThreshold ? nextThreshold.xpNeeded - xp : 0,
      };
    }
  }
  return { level: 1, title: "Semilla", xpToNext: 100 };
}

export function addXp(
  progress: UserProgress,
  amount: number,
  date: string
): { progress: UserProgress; leveledUp: boolean } {
  let leveledUp = false;
  const newProgress = { ...progress };
  newProgress.xp += amount;

  const currentLevel = getLevel(newProgress.xp);
  if (currentLevel.level > progress.level) {
    leveledUp = true;
  }
  newProgress.level = currentLevel.level;

  if (newProgress.lastActiveDate !== date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (newProgress.lastActiveDate === yesterdayStr) {
      newProgress.streak += 1;
    } else if (newProgress.lastActiveDate !== date) {
      newProgress.streak = 1;
    }
    newProgress.lastActiveDate = date;
  }

  return { progress: newProgress, leveledUp };
}
