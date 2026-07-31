"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import lessons from "@/data/lessons";
import { getLevel } from "@/lib/gamification";
import { badges } from "@/data/badges";
import AvatarViewer from "@/components/AvatarViewer";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BadgeIcon from "@/components/BadgeIcon";
import { Trophy, Flame, Target, BookOpen, Zap, Medal, Swords, Check, Lock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { progress, isAuthenticated } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  if (!mounted) return null;

  const levelInfo = getLevel(progress.xp);
  const completedCount = progress.completedLessons.length;
  const totalLessons = lessons.length;
  const availableLessons = lessons.filter((l) => l.level <= progress.level);
  const nextLesson = availableLessons.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const latestBadge = progress.badges.length > 0
    ? badges.find((b) => b.id === progress.badges[progress.badges.length - 1])
    : null;

  const lastCompletedIndex = lessons.reduce((maxIdx, l, i) => {
    if (progress.completedLessons.includes(l.id)) return i;
    return maxIdx;
  }, -1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <AvatarViewer avatarId={progress.avatarId} size="xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-purple-900">
            ¡Hola, {progress.username}!
          </h1>
          <p className="text-purple-500 font-medium">{levelInfo.title}</p>
          <div className="mt-2 max-w-xs">
            <ProgressBar value={progress.xp % 100} max={100} color="bg-amber-500" />
          </div>
        </div>
        <div className="flex gap-4">
          <StatBadge
            icon={<Flame className="w-4 h-4" />}
            value={progress.streak}
            label="Racha"
            color="text-orange-600 bg-orange-50"
          />
          <StatBadge
            icon={<Trophy className="w-4 h-4" />}
            value={progress.level}
            label="Nivel"
            color="text-amber-600 bg-amber-50"
          />
          <StatBadge
            icon={<Target className="w-4 h-4" />}
            value={progress.xp}
            label="XP"
            color="text-purple-600 bg-purple-50"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button variant="primary" onClick={() => router.push("/learn/" + (nextLesson?.id || availableLessons[0]?.id || lessons[0]?.id))}>
          <BookOpen size={18} /> Continuar
        </Button>
        <Button variant="gold" onClick={() => router.push("/games")}>
          <Zap size={18} /> Juegos
        </Button>
        <Button variant="secondary" onClick={() => router.push("/badges")}>
          <Medal size={18} /> Insignias
        </Button>
        <Button variant="secondary" onClick={() => router.push("/arena")}>
          <Swords size={18} /> Arena
        </Button>
      </div>

      {/* Lesson Map */}
      <section>
        <h2 className="text-xl font-bold text-purple-900 mb-4">
          Mapa de Lecciones
          <span className="text-sm font-normal text-purple-400 ml-2">
            ({completedCount}/{totalLessons})
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => {
            const completed = progress.completedLessons.includes(lesson.id);
            const locked = lesson.level > progress.level;
            const isNext = index === lastCompletedIndex + 1;

            return (
              <Card
                key={lesson.id}
                hover={!locked}
                onClick={() => !locked && router.push("/learn/" + lesson.id)}
                className={`relative ${
                  locked
                    ? "opacity-50 grayscale"
                    : completed
                    ? "border-green-200 bg-green-50/30"
                    : isNext
                    ? "border-amber-300 ring-2 ring-amber-200"
                    : ""
                }`}
              >
                {completed && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
                {locked && (
                  <div className="absolute top-3 right-3">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      completed
                        ? "bg-green-100 text-green-600"
                        : locked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {completed ? <CheckCircle2 size={20} /> : locked ? <Lock size={18} /> : <BookOpen size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${completed ? "text-green-700" : "text-purple-900"}`}>
                      {lesson.titleEn}
                    </h3>
                    <p className="text-xs text-purple-500 truncate">
                      {lesson.description}
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      +{lesson.xpReward} XP
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Latest Badge */}
      {latestBadge && (
        <section>
          <h2 className="text-lg font-bold text-purple-900 mb-3">Última Insignia</h2>
          <Card className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <BadgeIcon badge={latestBadge} size={56} glow />
            <div>
              <p className="font-bold text-amber-800">{latestBadge.name}</p>
              <p className="text-sm text-amber-600">{latestBadge.description}</p>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

function StatBadge({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${color}`}>
      {icon}
      <span className="font-bold text-sm">{value}</span>
      <span className="text-xs opacity-75">{label}</span>
    </div>
  );
}
