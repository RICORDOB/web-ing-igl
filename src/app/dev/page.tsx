"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { avatars } from "@/data/avatars";
import { badges } from "@/data/badges";
import { games } from "@/data/games";
import lessons from "@/data/lessons";
import { getItem, setItem, removeItem } from "@/lib/storage";
import { getLevel } from "@/lib/gamification";
import { useSound } from "@/lib/useSound";
import AvatarImage from "@/components/AvatarImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Terminal, Trash2, Volume2, RefreshCw, Bug, Eye, EyeOff } from "lucide-react";

export default function DevPage() {
  const router = useRouter();
  const { progress, isAuthenticated, completeLesson, selectAvatar } = useGame();
  const { play } = useSound();
  const [mounted, setMounted] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [storageDump, setStorageDump] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    refreshStorageDump();
  }, []);

  const refreshStorageDump = () => {
    const dump: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          dump[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
          dump[key] = localStorage.getItem(key);
        }
      }
    }
    setStorageDump(dump);
  };

  const clearAllData = () => {
    if (confirm("¿Estás seguro? Se borrará TODO el progreso local.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const addTestXP = () => {
    const today = new Date().toISOString().split("T")[0];
    completeLesson("test-dev", 100);
    play("levelup");
    setTimeout(refreshStorageDump, 100);
  };

  const unlockAllAvatars = () => {
    avatars.forEach((a) => selectAvatar(a.id));
    setTimeout(refreshStorageDump, 100);
  };

  const simularRacha = () => {
    const p = getItem<any>("cristo-english-progress", {});
    p.streak = 30;
    p.lastActiveDate = new Date().toISOString().split("T")[0];
    setItem("cristo-english-progress", p);
    window.location.reload();
  };

  const completarTodasLecciones = () => {
    const p = getItem<any>("cristo-english-progress", {});
    const allIds = lessons.map((l) => l.id);
    p.completedLessons = [...new Set([...(p.completedLessons || []), ...allIds])];
    p.lessonsCompleted = p.completedLessons.length;
    setItem("cristo-english-progress", p);
    window.location.reload();
  };

  const triggerNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("📖 Cristo English", {
            body: "¡Tiempo de estudiar! Dios te espera.",
            icon: "/icons/icon-192.svg",
          });
        }
      });
    }
  };

  if (!mounted) return null;

  const levelInfo = getLevel(progress.xp);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <Terminal className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-purple-900">Panel de Desarrollador</h1>
          <p className="text-sm text-purple-500">Herramientas internas y debug</p>
        </div>
        <Button variant="danger" size="sm" onClick={clearAllData}>
          <Trash2 size={16} /> Reset Total
        </Button>
      </div>

      {/* Estado Actual */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Estado del Jugador</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <span className="text-purple-500">Usuario</span>
            <p className="font-bold text-purple-900">{progress.username || "—"}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <span className="text-amber-600">Nivel</span>
            <p className="font-bold text-amber-800">{progress.level} — {levelInfo.title}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <span className="text-blue-600">XP</span>
            <p className="font-bold text-blue-800">{progress.xp}</p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <span className="text-orange-600">Racha</span>
            <p className="font-bold text-orange-800">{progress.streak} días</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
            <span className="text-green-600">Lecciones</span>
            <p className="font-bold text-green-800">{progress.lessonsCompleted}/{lessons.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <span className="text-indigo-600">Insignias</span>
            <p className="font-bold text-indigo-800">{progress.badges.length}/{badges.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20">
            <span className="text-pink-600">Palabras</span>
            <p className="font-bold text-pink-800">{progress.wordsLearned}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20">
            <span className="text-cyan-600">Avatar</span>
            <p className="font-bold text-cyan-800">{progress.avatarId}</p>
          </div>
        </div>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="gold" size="sm" onClick={addTestXP}>
            +100 XP (test)
          </Button>
          <Button variant="secondary" size="sm" onClick={unlockAllAvatars}>
            Desbloquear avatares
          </Button>
          <Button variant="secondary" size="sm" onClick={simularRacha}>
            Racha 30 días
          </Button>
          <Button variant="secondary" size="sm" onClick={completarTodasLecciones}>
            Completar todo
          </Button>
          <Button variant="secondary" size="sm" onClick={triggerNotification}>
            Probar notificación
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { play("correct"); play("levelup"); play("badge"); }}>
            Probar sonidos
          </Button>
        </div>
      </Card>

      {/* Test de Sonidos */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Volume2 size={18} /> Test de Sonidos
        </h2>
        <div className="flex flex-wrap gap-3">
          {(["correct", "wrong", "levelup", "badge"] as const).map((s) => (
            <button
              key={s}
              onClick={() => play(s)}
              className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium hover:bg-purple-200 transition-all active:scale-95"
            >
              🔊 {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Vista previa de avatares */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Vista previa de Avatares</h2>
        <div className="flex flex-wrap gap-4">
          {avatars.map((a) => (
            <div key={a.id} className="text-center space-y-1">
              <AvatarImage avatarId={a.id} size="md" />
              <p className="text-xs text-purple-500">{a.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Selector de insignias */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Insignias ({badges.length})</h2>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-xs font-medium text-amber-700">
              <img src={b.image} alt={b.name} className="w-5 h-5 object-contain" /> {b.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Lecciones registradas */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Lecciones ({lessons.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {lessons.map((l) => (
            <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className={`w-2 h-2 rounded-full ${progress.completedLessons.includes(l.id) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-purple-700 dark:text-purple-300">{l.id}</span>
              <span className="text-purple-500">Nv.{l.level}</span>
              <span className="text-amber-600 ml-auto">+{l.xpReward}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* localStorage dump */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-purple-900">LocalStorage</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-100"
            >
              {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button onClick={refreshStorageDump} className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-100">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto max-h-96">
          {JSON.stringify(storageDump, (key, val) => {
            if (!showSensitive && typeof val === "string" && val.length > 50) return val.slice(0, 30) + "...";
            return val;
          }, 2)}
        </pre>
      </Card>

      {/* Info de sesión */}
      <Card>
        <h2 className="font-bold text-purple-900 mb-4">Info del Sistema</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-purple-500">User Agent:</span> <span className="text-purple-900 text-xs break-all">{navigator.userAgent}</span></div>
          <div><span className="text-purple-500">Speech API:</span> {typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) ? "✅" : "❌"}</div>
          <div><span className="text-purple-500">Service Worker:</span> {"serviceWorker" in navigator ? "✅" : "❌"}</div>
          <div><span className="text-purple-500">Notification:</span> {"Notification" in window ? "✅" : "❌"}</div>
          <div><span className="text-purple-500">LocalStorage:</span> {typeof window !== "undefined" ? `${new Blob([JSON.stringify(localStorage)]).size} bytes` : "—"}</div>
          <div><span className="text-purple-500">Online:</span> {typeof navigator !== "undefined" ? (navigator.onLine ? "✅" : "❌") : "—"}</div>
        </div>
      </Card>

      <div className="text-center pb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
