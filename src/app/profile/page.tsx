"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { getLevel } from "@/lib/gamification";
import { badges } from "@/data/badges";
import AvatarViewer from "@/components/AvatarViewer";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BadgeIcon from "@/components/BadgeIcon";
import { Trophy, Flame, Target, BookOpen, Award, Zap, Users, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { progress, isAuthenticated, logout } = useGame();
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

  const stats = [
    { icon: <Trophy className="w-5 h-5" />, label: "Nivel", value: progress.level, color: "text-amber-600 bg-amber-50" },
    { icon: <Target className="w-5 h-5" />, label: "XP Total", value: progress.xp, color: "text-purple-600 bg-purple-50" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Lecciones", value: progress.lessonsCompleted, color: "text-blue-600 bg-blue-50" },
    { icon: <Flame className="w-5 h-5" />, label: "Racha", value: `${progress.streak} días`, color: "text-orange-600 bg-orange-50" },
    { icon: <CheckCircle className="w-5 h-5" />, label: "Correctas", value: progress.correctAnswers, color: "text-green-600 bg-green-50" },
    { icon: <Zap className="w-5 h-5" />, label: "Racha récord", value: progress.bestCorrectStreak, color: "text-yellow-600 bg-yellow-50" },
    { icon: <Award className="w-5 h-5" />, label: "Palabras", value: progress.wordsLearned, color: "text-indigo-600 bg-indigo-50" },
    { icon: <Users className="w-5 h-5" />, label: "Victorias Arena", value: progress.arenaWins, color: "text-red-600 bg-red-50" },
  ];

  const earnedBadges = badges.filter((b) => progress.badges.includes(b.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <AvatarViewer avatarId={progress.avatarId} size="xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-purple-900">{progress.username}</h1>
          <p className="text-purple-500 font-medium">{levelInfo.title}</p>
          <div className="mt-2 max-w-xs">
            <ProgressBar value={progress.xp % 100} max={100} color="bg-amber-500" />
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-purple-900">{stat.value}</p>
              <p className="text-xs text-purple-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Details */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Progreso Detallado</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-600">Lecciones completadas</span>
              <span className="font-bold text-purple-900">{progress.lessonsCompleted}</span>
            </div>
            <ProgressBar value={progress.lessonsCompleted} max={50} color="bg-blue-500" size="sm" showLabel={false} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-600">Palabras aprendidas</span>
              <span className="font-bold text-purple-900">{progress.wordsLearned}</span>
            </div>
            <ProgressBar value={progress.wordsLearned} max={200} color="bg-green-500" size="sm" showLabel={false} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-600">Racha de respuestas correctas</span>
              <span className="font-bold text-purple-900">{progress.correctStreak}</span>
            </div>
            <ProgressBar value={progress.correctStreak} max={Math.max(progress.bestCorrectStreak, 10)} color="bg-amber-500" size="sm" showLabel={false} />
          </div>
        </div>
      </Card>

      {/* Badges Earned */}
      <section>
        <h2 className="text-lg font-bold text-purple-900 mb-3">
          Insignias ({earnedBadges.length}/{badges.length})
        </h2>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
                <BadgeIcon badge={badge} size={36} />
                <span className="text-sm font-medium text-amber-800">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-purple-400">Aún no tienes insignias. ¡Sigue aprendiendo!</p>
        )}
      </section>

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
