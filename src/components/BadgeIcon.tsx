"use client";

interface BadgeIconProps {
  badge: {
    id: string;
    name: string;
    icon: string;
    tier: string;
  };
  size?: number;
  glow?: boolean;
}

const TIER_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  bronze: { bg: "from-amber-600 to-amber-800", border: "#B8860B", glow: "rgba(218,165,32,0.3)" },
  silver: { bg: "from-slate-400 to-slate-600", border: "#8E8E93", glow: "rgba(142,142,147,0.3)" },
  gold: { bg: "from-yellow-400 to-yellow-600", border: "#FFD700", glow: "rgba(255,215,0,0.3)" },
};

function getBadgeSymbol(badgeId: string): string {
  const symbols: Record<string, string> = {
    "mustard-seed": "🌱",
    "living-water": "💧",
    "burning-bush": "🔥",
    "goliath-slayer": "🗡️",
    "pentecost": "🕊️",
    "ark-builder": "🚢",
    "proverbs-sage": "📜",
    "faithful-servant": "👑",
    "tongues-of-fire": "🔤",
    "overcomer": "🏆",
    "word-warrior": "⚔️",
    "crown-of-life": "👑",
  };
  return symbols[badgeId] || "⭐";
}

export default function BadgeIcon({ badge, size = 56, glow = false }: BadgeIconProps) {
  const colors = TIER_COLORS[badge.tier] || TIER_COLORS.bronze;
  const s = size;

  return (
    <svg width={s} height={s} viewBox="0 0 56 56" className="shrink-0">
      {glow && (
        <defs>
          <filter id={`glow-${badge.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor={colors.glow} floodOpacity="1" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <g filter={glow ? `url(#glow-${badge.id})` : undefined}>
        <polygon
          points="28,2 50,14 50,38 28,54 6,38 6,14"
          fill={`url(#grad-${badge.id})`}
          stroke={colors.border}
          strokeWidth="1.5"
        />
        <polygon
          points="28,6 47,16 47,36 28,50 9,36 9,16"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
      </g>
      <text
        x="28" y="33"
        textAnchor="middle"
        fontSize="20"
        dominantBaseline="central"
      >
        {getBadgeSymbol(badge.id)}
      </text>
      <defs>
        <linearGradient id={`grad-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <linearGradient
        id={`grad-${badge.id}`}
        x1="0%" y1="0%" x2="100%" y2="100%"
      >
        <stop offset="0%" stopColor={colors.bg.includes("amber") ? "#D97706" : colors.bg.includes("slate") ? "#64748B" : "#EAB308"} />
        <stop offset="100%" stopColor={colors.bg.includes("amber") ? "#92400E" : colors.bg.includes("slate") ? "#334155" : "#CA8A04"} />
      </linearGradient>
    </svg>
  );
}
