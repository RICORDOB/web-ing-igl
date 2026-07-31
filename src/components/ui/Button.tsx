"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-purple-800 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30",
    secondary:
      "bg-white text-purple-800 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300",
    gold: "bg-amber-400 text-purple-900 hover:bg-amber-300 shadow-lg shadow-amber-200 dark:shadow-amber-900/30",
    ghost: "text-purple-700 hover:bg-purple-100",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
