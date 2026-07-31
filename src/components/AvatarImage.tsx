"use client";

import { avatars } from "@/data/avatars";

interface AvatarImageProps {
  avatarId: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  threeD?: boolean;
}

const SIZES = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export default function AvatarImage({
  avatarId,
  size = "md",
  className = "",
  threeD = false,
}: AvatarImageProps) {
  const sizeClass = SIZES[size];

  if (avatarId.startsWith("custom-")) {
    const customImage =
      typeof window !== "undefined"
        ? localStorage.getItem("cristo-english-custom-avatar")
        : null;
    if (customImage) {
      const threeClass = threeD
        ? "transform-gpu transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        : "";
      return (
        <div
          className={`relative overflow-hidden rounded-2xl ${sizeClass} ${threeClass} ${className} shadow-lg`}
        >
          <img
            src={customImage}
            alt="Custom avatar"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  }

  const avatar = avatars.find((a) => a.id === avatarId);

  const threeClass = threeD
    ? "transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-2 hover:shadow-2xl"
    : "";

  if (!avatar) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${sizeClass} ${threeClass} ${className} flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-400 to-purple-600`}
      >
        <img
          src="/landing/book.svg"
          alt="Avatar"
          className="w-[55%] h-[55%] object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${sizeClass} ${threeClass} ${className} shadow-lg bg-gradient-to-br ${avatar.gradient}`}
    >
      <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
      <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-white/20 blur-xl" />
      <div className="relative w-full h-full flex items-center justify-center p-[18%]">
        <img
          src={avatar.image}
          alt={avatar.name}
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
}
