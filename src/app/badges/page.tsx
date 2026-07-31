"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { badges } from "@/data/badges";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BadgeIcon from "@/components/BadgeIcon";

export default function BadgesPage() {
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

  const tiers = [
    { key: "bronze", label: "Bronce", color: "bg-amber-100 text-amber-800 border-amber-300" },
    { key: "silver", label: "Plata", color: "bg-gray-100 text-gray-800 border-gray-300" },
    { key: "gold", label: "Oro", color: "bg-yellow-100 text-yellow-800 border-yellow-400" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900">🏅 Insignias</h1>
        <p className="text-purple-500">
          {progress.badges.length} de {badges.length} desbloqueadas
        </p>
      </div>

      {tiers.map((tier) => {
        const tierBadges = badges.filter((b) => b.tier === tier.key);
        return (
          <section key={tier.key}>
            <h2 className={`text-lg font-bold mb-3 ${tier.color.split(" ")[0].replace("bg-", "text-")}`}>
              {tier.label}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tierBadges.map((badge) => {
                const earned = progress.badges.includes(badge.id);
                return (
                  <Card
                    key={badge.id}
                    className={`relative text-center space-y-2 ${
                      earned ? "" : "opacity-50 grayscale"
                    }`}
                  >
                    {!earned && (
                      <div className="absolute inset-0 rounded-2xl bg-white/50 flex items-center justify-center z-10">
                        <span className="text-5xl opacity-50">❓</span>
                      </div>
                    )}
                    <div className="flex justify-center">
                      <BadgeIcon badge={badge} size={64} glow={earned} />
                    </div>
                    <p className="font-bold text-sm text-purple-900">{badge.name}</p>
                    <p className="text-xs text-purple-500">{badge.description}</p>
                    <p className="text-xs text-purple-400 mt-1 italic">
                      {earned ? "✓ Desbloqueada" : badge.condition}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
