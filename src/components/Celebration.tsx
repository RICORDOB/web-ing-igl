"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Sparkles,
  PartyPopper,
  Heart,
  Trophy,
  Crown,
  Gift,
  ThumbsUp,
} from "lucide-react";

const PARTICLES = [
  Star,
  Sparkles,
  PartyPopper,
  Heart,
  Trophy,
  Crown,
  Gift,
  ThumbsUp,
];
const COLORS = ["text-purple-500", "text-amber-400", "text-pink-500", "text-blue-500", "text-green-500", "text-red-400"];

interface Particle {
  id: number;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  color: string;
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
      icon: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
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
      {particles.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.id}
            className="absolute animate-confetti text-center"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            <Icon size={p.size} className={p.color} />
          </div>
        );
      })}
    </div>
  );
}
