"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { getLevel } from "@/lib/gamification";
import { badges } from "@/data/badges";
import { avatars } from "@/data/avatars";
import lessons from "@/data/lessons";
import AvatarViewer from "@/components/AvatarViewer";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BadgeIcon from "@/components/BadgeIcon";
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  Award,
  TrendingUp,
  Heart,
  Star,
  ChevronRight,
  Users,
  PartyPopper,
  Check,
  Lightbulb,
  Calendar,
  Handshake,
} from "lucide-react";

export default function ParentsPage() {
  const router = useRouter();
  const { progress, isAuthenticated } = useGame();
  const [mounted, setMounted] = useState(false);
  const [sessionTime] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("cristo-english-session-time") || "0");
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  if (!mounted) return null;

  const levelInfo = getLevel(progress.xp);
  const currentAvatar = avatars.find((a) => a.id === progress.avatarId);
  const earnedBadges = badges.filter((b) => progress.badges.includes(b.id));
  const completedLessons = lessons.filter((l) => progress.completedLessons.includes(l.id));
  const completionPct = Math.round((progress.completedLessons.length / lessons.length) * 100);

  const weeklyGoal = 5;
  const weeklyProgress = Math.min(progress.lessonsCompleted % weeklyGoal || weeklyGoal, weeklyGoal);

  const strengths: { label: string; pct: number }[] = [
    { label: "Vocabulario", pct: Math.min(Math.round((progress.wordsLearned / 50) * 100), 100) },
    { label: "Versículos", pct: Math.min(Math.round((progress.versesCompleted / 20) * 100), 100) },
    { label: "Consistencia", pct: Math.min(progress.streak * 10, 100) },
    { label: "Precisión", pct: progress.correctAnswers > 0 ? Math.min(Math.round((progress.correctAnswers / (progress.correctAnswers + 5)) * 100), 100) : 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
            <Users size={28} className="text-purple-600" /> Panel para Padres
          </h1>
          <p className="text-purple-500">
            Progreso educativo de {progress.username}
          </p>
        </div>
        <Heart className="w-8 h-8 text-red-400 animate-pulse" />
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <img src="/landing/cross.svg" alt="" className="w-32 h-32 object-contain" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <AvatarViewer avatarId={progress.avatarId} size="xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{progress.username}</h2>
            <p className="text-purple-200">{levelInfo.title} · Nivel {progress.level}</p>
            <div className="mt-3 max-w-xs">
              <p className="text-xs text-purple-300 mb-1">Progreso total: {completionPct}%</p>
              <ProgressBar
                value={progress.completedLessons.length}
                max={lessons.length}
                color="bg-amber-400"
                size="sm"
                showLabel={false}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-400">{progress.streak}</div>
            <div className="text-xs text-purple-200">días seguidos</div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen size={20} />} label="Lecciones" value={progress.lessonsCompleted} total={lessons.length} color="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" />
        <StatCard icon={<Award size={20} />} label="Insignias" value={earnedBadges.length} total={badges.length} color="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" />
        <StatCard icon={<Target size={20} />} label="Palabras" value={progress.wordsLearned} total={200} color="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" />
        <StatCard icon={<Clock size={20} />} label="Racha" value={`${progress.streak}d`} unit="" color="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" />
      </div>

      {/* Progress Details */}
      <section>
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Áreas de Fortaleza
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {strengths.map((s) => (
            <Card key={s.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">{s.label}</span>
                <span className="font-bold text-purple-900">{s.pct}%</span>
              </div>
              <ProgressBar value={s.pct} max={100} color={s.pct >= 70 ? "bg-green-500" : s.pct >= 40 ? "bg-amber-500" : "bg-blue-500"} size="sm" showLabel={false} />
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Goal */}
      <section>
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Star size={20} className="text-amber-500" />
          Meta Semanal
        </h2>
        <Card className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-purple-600">Lecciones de esta semana</span>
            <span className="font-bold text-purple-900">{Math.min(progress.lessonsCompleted % weeklyGoal || weeklyGoal, weeklyGoal)}/{weeklyGoal}</span>
          </div>
          <ProgressBar value={weeklyProgress} max={weeklyGoal} color="bg-amber-500" size="md" />
          <p className="text-xs text-purple-500 text-center">
            {weeklyProgress >= weeklyGoal
              ? <span className="flex items-center justify-center gap-1"><PartyPopper size={14} className="text-amber-500" /> ¡Meta semanal completada!</span>
              : `Faltan ${weeklyGoal - weeklyProgress} lecciones para cumplir la meta`}
          </p>
        </Card>
      </section>

      {/* Recently Completed Lessons */}
      <section>
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-500" />
          Últimas Lecciones Completadas
        </h2>
        <div className="space-y-3">
          {completedLessons.slice(-5).reverse().map((lesson) => (
            <Card key={lesson.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Check size={20} /></div>
              <div className="flex-1">
                <p className="font-bold text-sm text-purple-900">{lesson.titleEn}</p>
                <p className="text-xs text-purple-500">{lesson.topic}</p>
              </div>
              <ChevronRight size={18} className="text-purple-400" />
            </Card>
          ))}
          {completedLessons.length === 0 && (
            <Card className="text-center py-8">
              <p className="text-purple-500">Aún no hay lecciones completadas</p>
            </Card>
          )}
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Insignias Obtenidas ({earnedBadges.length}/{badges.length})
        </h2>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <BadgeIcon badge={badge} size={40} />
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{badge.name}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-purple-500">Aún no hay insignias. ¡A seguir aprendiendo!</p>
          </Card>
        )}
      </section>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 shrink-0">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 dark:text-purple-200">Consejos para Padres</h3>
            <ul className="mt-2 text-sm text-purple-600 dark:text-purple-400 space-y-1.5">
              <li className="flex items-start gap-2"><Target size={16} className="text-purple-500 mt-0.5 shrink-0" /> Celebra cada insignia con tu hijo</li>
              <li className="flex items-start gap-2"><Calendar size={16} className="text-purple-500 mt-0.5 shrink-0" /> Revisa la racha diaria para motivar consistencia</li>
              <li className="flex items-start gap-2"><Handshake size={16} className="text-purple-500 mt-0.5 shrink-0" /> Practica juntos: pídele que te enseñe lo que aprendió</li>
              <li className="flex items-start gap-2"><BookOpen size={16} className="text-purple-500 mt-0.5 shrink-0" /> Pregúntale por el versículo del día</li>
              <li className="flex items-start gap-2"><Trophy size={16} className="text-purple-500 mt-0.5 shrink-0" /> Establece metas semanales alcanzables</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Volver al dashboard
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  total,
  color,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  total?: number;
  color: string;
  unit?: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
          {value}{total !== undefined ? `/${total}` : ""}{unit}
        </p>
        <p className="text-xs text-purple-500">{label}</p>
      </div>
    </Card>
  );
}
