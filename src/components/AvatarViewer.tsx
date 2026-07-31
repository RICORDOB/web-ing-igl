"use client";

import AvatarImage from "@/components/AvatarImage";

interface AvatarViewerProps {
  avatarId: string;
  size?: "sm" | "md" | "lg" | "xl";
  threeD?: boolean;
}

export default function AvatarViewer({ avatarId, size = "md", threeD = true }: AvatarViewerProps) {
  return <AvatarImage avatarId={avatarId} size={size} threeD={threeD} />;
}
