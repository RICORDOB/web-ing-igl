"use client";

interface BadgeIconProps {
  badge: {
    id: string;
    name: string;
    icon: string;
    image?: string;
    tier: string;
  };
  size?: number;
  glow?: boolean;
}

const TIER_COLORS: Record<string, { border: string; glow: string }> = {
  bronze: { border: "#B8860B", glow: "rgba(218,165,32,0.3)" },
  silver: { border: "#8E8E93", glow: "rgba(142,142,147,0.3)" },
  gold: { border: "#FFD700", glow: "rgba(255,215,0,0.3)" },
};

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
      <image
        href={badge.image || "/landing/book.svg"}
        x="13"
        y="13"
        width="30"
        height="30"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.4))" }}
      />
      <defs>
        <linearGradient id={`grad-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={badge.tier === "gold" ? "#FDE047" : badge.tier === "silver" ? "#CBD5E1" : "#F59E0B"} />
          <stop offset="100%" stopColor={badge.tier === "gold" ? "#EAB308" : badge.tier === "silver" ? "#64748B" : "#92400E"} />
        </linearGradient>
      </defs>
    </svg>
  );
}
