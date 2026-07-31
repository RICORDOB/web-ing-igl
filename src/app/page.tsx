"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import Button from "@/components/ui/Button";
import { BookOpen, Gamepad2, Trophy, Users, Sparkles } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useGame();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 px-4 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">✝️</div>
          <div className="absolute top-20 right-20 text-6xl animate-float" style={{ animationDelay: "1s" }}>🕊️</div>
          <div className="absolute bottom-20 left-1/4 text-7xl animate-float" style={{ animationDelay: "2s" }}>🔥</div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center space-y-8">
          <div className="text-7xl animate-float">📖</div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            Cristo English
          </h1>
          <p className="text-xl sm:text-2xl text-purple-200 max-w-2xl mx-auto">
            La forma más divertida de aprender inglés mientras exploras las
            historias y versículos de la Biblia
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => router.push("/login")}
            >
              ¡Comenzar Gratis! 🚀
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/login")}
            >
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">
          ¿Por qué Cristo English?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Lecciones Bíblicas"
            description="Cada lección está basada en historias reales de la Biblia con vocabulario en inglés"
            color="bg-purple-100 text-purple-700"
          />
          <FeatureCard
            icon={<Gamepad2 className="w-8 h-8" />}
            title="Mini Juegos"
            description="Refuerza lo aprendido con juegos divertidos tipo memorama, carreras y trivias"
            color="bg-blue-100 text-blue-700"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Insignias y Logros"
            description="Gana insignias al completar lecciones, mantener rachas y dominar vocabulario"
            color="bg-amber-100 text-amber-700"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Multiplayer"
            description="Compite con hasta 5 amigos en salas de batalla bíblica con chat y audio"
            color="bg-green-100 text-green-700"
          />
        </div>
      </section>

      {/* Avatars */}
      <section className="bg-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold text-purple-900">
            Elige tu Avatar Bíblico
          </h2>
          <p className="text-purple-600 text-lg">
            Desbloquea personajes como David, Ester, Sansón y más mientras avanzas
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {["🦁", "⚔️", "👑", "💪", "🌊", "🐋", "🕊️", "⚡"].map((emoji, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl animate-float"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <Sparkles className="w-12 h-12 mx-auto text-amber-500" />
          <h2 className="text-3xl font-bold text-purple-900">
            Listo para empezar tu aventura?
          </h2>
          <p className="text-purple-600">
            &ldquo;Train up a child in the way he should go: and when he is old,
            he will not depart from it.&rdquo;
            <br />
            <span className="text-sm font-medium">Proverbs 22:6</span>
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/login")}
          >
            ¡Quiero Aprender! 🙌
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-purple-300 py-8 px-4 text-center text-sm">
        <p>Cristo English © 2026 — Aprende inglés, conoce la Biblia</p>
        <p className="mt-1 text-purple-400">
          &ldquo;Faith comes from hearing, and hearing through the word of Christ.&rdquo;
          <br />— Romans 10:17
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg shadow-purple-100/50 border border-purple-100/50 text-center space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className={`inline-flex p-3 rounded-xl ${color}`}>{icon}</div>
      <h3 className="font-bold text-lg text-purple-900">{title}</h3>
      <p className="text-sm text-purple-600">{description}</p>
    </div>
  );
}
