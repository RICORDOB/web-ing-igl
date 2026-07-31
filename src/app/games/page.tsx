"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { games } from "@/data/games";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import GameIcon from "@/components/GameIcon";
import { Gamepad2, Lock } from "lucide-react";

export default function GamesHubPage() {
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900 flex items-center justify-center gap-2">
          <Gamepad2 size={30} className="text-purple-600" /> Mini Juegos
        </h1>
        <p className="text-purple-500">
          Refuerza lo aprendido mientras te diviertes
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {games.map((game) => {
          const locked = progress.level < game.minLevel;
          return (
            <Card
              key={game.id}
              hover={!locked}
              onClick={() => !locked && router.push(game.route)}
              className={`relative overflow-hidden ${
                locked ? "opacity-50 grayscale" : ""
              }`}
            >
              {locked && (
                <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock size={32} className="text-purple-400 mx-auto" />
                    <p className="text-sm text-purple-600 font-medium mt-1">
                      Nivel {game.minLevel} requerido
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <GameIcon gameId={game.id} image={game.image} color={game.color} size={64} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-900">{game.title}</h3>
                  <p className="text-sm text-purple-500 mt-1">{game.description}</p>
                  {!locked && (
                    <Button variant="primary" size="sm" className="mt-3">
                      ¡Jugar!
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
