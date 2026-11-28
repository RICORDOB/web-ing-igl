"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  href?: string;
}

// Props that are valid for <a> elements (and thus Link)
const anchorProps = [
  "href",
  "target",
  "rel",
  "download",
  "hreflang",
  "type",
  "referrerPolicy",
  "ping",
] as const;

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  href,
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

  const classNameComputed = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    // Filter props to only include valid anchor attributes
    const linkProps: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (anchorProps.includes(key as typeof anchorProps[number])) {
        linkProps[key] = props[key as keyof typeof props];
      }
    }
    return (
      <Link href={href} className={classNameComputed} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classNameComputed}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
