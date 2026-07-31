"use client";

interface GameIconProps {
  gameId: string;
  emoji: string;
  color: string;
  size?: number;
}

const GAME_GRADIENTS: Record<string, string> = {
  "memory-bible": "from-purple-500 via-purple-600 to-indigo-700",
  "race-of-faith": "from-blue-500 via-blue-600 to-cyan-700",
  "armor-of-god": "from-amber-500 via-orange-500 to-red-600",
  "trivia": "from-red-500 via-rose-600 to-pink-700",
};

export default function GameIcon({ gameId, emoji, color, size = 64 }: GameIconProps) {
  const s = size;
  const gradient = GAME_GRADIENTS[gameId] || "from-purple-500 to-purple-700";

  return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="shrink-0">
      <defs>
        <linearGradient id={`game-grad-${gameId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
        <filter id={`game-shine-${gameId}`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feSpecularLighting surfaceScale="2" specularConstant="0.6" specularExponent="20" result="spec">
            <fePointLight x="10" y="10" z="20" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" />
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0" />
        </filter>
      </defs>
      <rect
        x="2" y="2" width="60" height="60" rx="16"
        fill={`url(#game-grad-${gameId})`}
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <rect
        x="4" y="4" width="56" height="56" rx="14"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.5"
      />
      {emoji && (
        <text
          x="32" y="38"
          textAnchor="middle"
          fontSize="28"
          dominantBaseline="central"
          filter={`url(#game-shine-${gameId})`}
        >
          {emoji}
        </text>
      )}
    </svg>
  );
}
