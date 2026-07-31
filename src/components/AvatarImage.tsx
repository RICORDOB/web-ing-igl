"use client";

import { avatars } from "@/data/avatars";
import { useState } from "react";

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

const STYLES = ["adventurer", "adventurer-neutral", "big-smile", "icons"];

export default function AvatarImage({
  avatarId,
  size = "md",
  className = "",
  threeD = false,
}: AvatarImageProps) {
  const [currentStyle, setCurrentStyle] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (avatarId.startsWith("custom-")) {
    const customImage =
      typeof window !== "undefined"
        ? localStorage.getItem("cristo-english-custom-avatar")
        : null;
    if (customImage) {
      const sizeClass = SIZES[size];
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
  if (!avatar) {
    const sizeClass = SIZES[size];
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${sizeClass} ${className} flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-400 to-purple-600`}
      >
        <span className="text-2xl">😊</span>
      </div>
    );
  }

  const sizeClass = SIZES[size];
  const style = STYLES[currentStyle % STYLES.length];
  const dicebearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${avatar.dicebearSeed}&backgroundColor=${avatar.color.replace("#", "")}`;

  const threeClass = threeD
    ? "transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-2 hover:shadow-2xl"
    : "";

  const cardClass = `relative overflow-hidden rounded-2xl ${sizeClass} ${threeClass} ${className}`;

  if (imgError) {
    return (
      <div
        className={`${cardClass} flex items-center justify-center shadow-lg`}
        style={{
          background: `linear-gradient(135deg, ${avatar.color}22, ${avatar.color}44)`,
          border: `2px solid ${avatar.color}33`,
        }}
      >
        <div className="text-center">
          <div
            className="text-2xl sm:text-3xl mb-0.5"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          >
            {avatar.icon}
          </div>
          <div
            className="text-[8px] font-bold opacity-60 uppercase tracking-wider"
            style={{ color: avatar.color }}
          >
            {avatar.nameEn}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClass} shadow-lg group`}>
      <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
        <img
          key={style}
          src={dicebearUrl}
          alt={avatar.name}
          onError={() => {
            if (currentStyle < STYLES.length - 1) {
              setCurrentStyle((prev) => prev + 1);
            } else {
              setImgError(true);
            }
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
