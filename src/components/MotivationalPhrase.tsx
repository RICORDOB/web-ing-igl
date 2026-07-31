"use client";

import { useGame } from "@/context/GameContext";
import { X } from "lucide-react";
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

  const icons: Record<string, string> = {
    success: "🌟",
    error: "💪",
    levelup: "🎉",
    badge: "🏅",
    streak: "🔥",
  };

  const bg = bgColors[showMotivational.type] || "bg-purple-50 border-purple-200";
  const icon = icons[showMotivational.type] || "📖";

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
          <span className="text-2xl">{icon}</span>
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
