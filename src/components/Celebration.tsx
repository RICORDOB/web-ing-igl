"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["✨", "🌟", "⭐", "💫", "🎉", "🎊", "🙌", "👏"];
const COLORS = ["bg-purple-500", "bg-amber-400", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-red-400"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

interface CelebrationProps {
  show: boolean;
  type?: "levelup" | "badge" | "complete";
  onComplete?: () => void;
}

export default function Celebration({ show, type = "complete", onComplete }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const count = type === "levelup" ? 30 : type === "badge" ? 20 : 12;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      size: 16 + Math.random() * 20,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, type, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti text-center"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
