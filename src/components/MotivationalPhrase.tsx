"use client";

import { useGame } from "@/context/GameContext";
import { X, Star, Flame, PartyPopper, Medal, Shield } from "lucide-react";
import { useEffect } from "react";

export default function MotivationalPhrase() {
  const { showMotivational, dismissMotivational } = useGame();

  useEffect(() => {
    if (showMotivational) {
      const timer = setTimeout(dismissMotivational, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMotivational, dismissMotivational]);

  if (!showMotivational) return null;

  const bgColors: Record<string, string> = {
    success: "bg-green-50 border-green-200",
    error: "bg-orange-50 border-orange-200",
    levelup: "bg-amber-50 border-amber-200",
    badge: "bg-purple-50 border-purple-200",
    streak: "bg-blue-50 border-blue-200",
  };

  const iconColors: Record<string, string> = {
    success: "text-green-600",
    error: "text-orange-500",
    levelup: "text-amber-500",
    badge: "text-purple-600",
    streak: "text-blue-500",
  };

  const icons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    success: Star,
    error: Shield,
    levelup: PartyPopper,
    badge: Medal,
    streak: Flame,
  };

  const bg = bgColors[showMotivational.type] || "bg-purple-50 border-purple-200";
  const iconColor = iconColors[showMotivational.type] || "text-purple-600";
  const Icon = icons[showMotivational.type] || Star;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className={`rounded-2xl border-2 p-5 shadow-xl ${bg}`}>
        <button
          onClick={dismissMotivational}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-3">
          <span className={`shrink-0 ${iconColor}`}>
            <Icon size={28} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800 italic">
              &ldquo;{showMotivational.text}&rdquo;
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500">
              — {showMotivational.reference}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
