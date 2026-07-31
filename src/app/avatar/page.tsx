"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { avatars } from "@/data/avatars";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AvatarImage from "@/components/AvatarImage";
import ImageUploader from "@/components/ImageUploader";
import { Upload, Sparkles, Lock, Crown, Check } from "lucide-react";

export default function AvatarPage() {
  const router = useRouter();
  const { progress, isAuthenticated, selectAvatar } = useGame();
  const [mounted, setMounted] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cristo-english-custom-avatar");
      setCustomAvatar(saved);
    }
  }, [isAuthenticated, router]);

  const handleCustomImage = (dataUrl: string) => {
    if (dataUrl) {
      localStorage.setItem("cristo-english-custom-avatar", dataUrl);
      setCustomAvatar(dataUrl);
      selectAvatar("custom-upload");
      setShowUploader(false);
    } else {
      localStorage.removeItem("cristo-english-custom-avatar");
      setCustomAvatar(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-purple-900">Personaliza tu Avatar</h1>
        <p className="text-purple-500 max-w-md mx-auto">
          Elige un personaje bíblico o sube tu propia imagen. Desbloquea más avatares mientras avanzas.
        </p>
      </div>

      {/* Currently Selected */}
      <Card className="flex items-center gap-6 bg-gradient-to-r from-purple-50 to-amber-50 border-amber-200">
        <div className="perspective-500">
          <AvatarImage
            avatarId={progress.avatarId}
            size="xl"
            threeD
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-purple-500 font-medium">Tu avatar actual</p>
          <p className="text-xl font-bold text-purple-900">
            {progress.avatarId === "custom-upload"
              ? "Tu imagen personalizada"
              : avatars.find((a) => a.id === progress.avatarId)?.name || "Desconocido"}
          </p>
        </div>
      </Card>

      {/* Predefined Avatars Grid */}
      <section>
        <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Crown size={20} className="text-amber-500" />
          Personajes bíblicos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {avatars.map((avatar) => {
            const unlocked = progress.level >= avatar.unlockLevel;
            const selected = progress.avatarId === avatar.id;

            return (
              <div
                key={avatar.id}
                className={`relative group cursor-pointer rounded-2xl bg-white p-5 text-center space-y-4 transition-all duration-300 ${
                  selected
                    ? "ring-2 ring-amber-400 shadow-xl shadow-amber-100 scale-[1.02]"
                    : unlocked
                    ? "shadow-lg shadow-purple-100/50 hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-200/50"
                    : "shadow-lg opacity-60"
                }`}
                onClick={() => unlocked && selectAvatar(avatar.id)}
                style={{
                  perspective: "800px",
                }}
              >
                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="text-center space-y-1">
                      <Lock size={24} className="mx-auto text-purple-400" />
                      <p className="text-xs font-medium text-purple-500">
                        Nivel {avatar.unlockLevel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected badge */}
                {selected && (
                  <div className="absolute top-3 right-3 z-20 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
                    <Check size={16} className="text-white" />
                  </div>
                )}

                {/* Avatar image with 3D hover */}
                <div className="flex justify-center perspective-500">
                  <div
                    className={`transform-gpu transition-all duration-300 ${
                      unlocked && !selected
                        ? "group-hover:scale-110 group-hover:rotate-2"
                        : ""
                    }`}
                  >
                    <AvatarImage
                      avatarId={avatar.id}
                      size="lg"
                      threeD={unlocked && !selected}
                    />
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="font-bold text-purple-900">{avatar.name}</p>
                  <p className="text-xs text-purple-400">{avatar.nameEn}</p>
                  <p className="text-xs text-purple-500 mt-1">{avatar.description}</p>
                </div>

                {/* Action */}
                {unlocked && !selected && (
                  <Button variant="secondary" size="sm" className="w-full">
                    Seleccionar
                  </Button>
                )}
                {selected && (
                  <Button variant="gold" size="sm" className="w-full" disabled>
                    ✓ En uso
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom Upload Section */}
      <section>
        <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
          <div className="text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">
                Sube tu propia imagen
              </h3>
              <p className="text-sm text-purple-500 mt-1">
                Una foto tuya, un dibujo, o cualquier imagen que te represente
              </p>
            </div>

            {customAvatar && (
              <div className="flex items-center justify-center gap-4">
                <img
                  src={customAvatar}
                  alt="Custom"
                  className="w-16 h-16 rounded-2xl object-cover shadow-md"
                />
                <div className="text-left">
                  <p className="text-sm font-bold text-purple-900">Imagen personalizada</p>
                  <p className="text-xs text-purple-500">Guardada localmente</p>
                </div>
                {progress.avatarId === "custom-upload" && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                    En uso
                  </span>
                )}
              </div>
            )}

            {showUploader ? (
              <div className="max-w-md mx-auto">
                <ImageUploader
                  onImageReady={handleCustomImage}
                  currentImage={customAvatar || undefined}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                  className="mt-2"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={() => setShowUploader(true)}
                >
                  <Upload size={18} /> Subir imagen
                </Button>
                {customAvatar && progress.avatarId !== "custom-upload" && (
                  <Button
                    variant="gold"
                    onClick={() => selectAvatar("custom-upload")}
                  >
                    Usar imagen personalizada
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Back */}
      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
