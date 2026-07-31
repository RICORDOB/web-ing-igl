"use client";

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = "", onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white p-6 shadow-lg shadow-purple-100/50 border border-purple-100/50 ${
        hover ? "cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
