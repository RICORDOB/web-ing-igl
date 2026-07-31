"use client";

import Link from "next/link";
import { useGame } from "@/context/GameContext";
import AvatarViewer from "@/components/AvatarViewer";
import { getLevel } from "@/lib/gamification";
import {
  Flame,
  Trophy,
  LogOut,
  User,
  Menu,
  X,
  Moon,
  Sun,
  BookOpen,
  Map,
  Gamepad2,
  Bot,
  Swords,
  Users,
  Settings,
  Medal,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { progress, isAuthenticated, logout } = useGame();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const levelInfo = getLevel(progress.xp);
  const showStreak = progress.streak > 0;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-purple-700">
              <BookOpen size={24} />
            </span>
            <span className="text-lg font-bold text-purple-900 hidden sm:block">
              Cristo English
            </span>
          </Link>

          {showStreak && (
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Flame size={18} className="text-orange-500" />
              <span className="text-sm font-bold text-orange-600">{progress.streak}</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/dashboard" icon={<Map size={16} />} label="Lecciones" />
            <NavLink href="/games" icon={<Gamepad2 size={16} />} label="Juegos" />
            <NavLink href="/ai" icon={<Bot size={16} />} label="IA" />
            <NavLink href="/arena" icon={<Swords size={16} />} label="Arena" />
            <NavLink href="/parents" icon={<Users size={16} />} label="Padres" />
            <NavLink href="/dev" icon={<Settings size={16} />} label="Dev" />

            <div className="flex items-center gap-3 pl-4 border-l border-purple-100">
              <div className="text-right">
                <p className="text-xs text-purple-500 font-medium">{levelInfo.title}</p>
                <div className="flex items-center gap-1">
                  <Trophy size={14} className="text-amber-500" />
                  <span className="text-sm font-bold text-purple-900">
                    Nv. {progress.level}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-purple-400 hover:text-amber-500 transition-colors"
                title={theme === "light" ? "Modo oscuro" : "Modo claro"}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <Link href="/avatar">
                <AvatarViewer avatarId={progress.avatarId} size="sm" />
              </Link>
              <button
                onClick={logout}
                className="p-2 text-purple-400 hover:text-red-500 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-purple-700"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 py-4 space-y-3 animate-slide-up">
          <MobileNavLink href="/dashboard" icon={<Map size={18} />} label="Lecciones" />
          <MobileNavLink href="/games" icon={<Gamepad2 size={18} />} label="Juegos" />
          <MobileNavLink href="/ai" icon={<Bot size={18} />} label="IA" />
          <MobileNavLink href="/arena" icon={<Swords size={18} />} label="Arena" />
          <MobileNavLink href="/parents" icon={<Users size={18} />} label="Panel Padres" />
          <MobileNavLink href="/avatar" icon={<Smile size={18} />} label="Mi Avatar" />
          <MobileNavLink href="/badges" icon={<Medal size={18} />} label="Insignias" />
          <MobileNavLink href="/dev" icon={<Settings size={18} />} label="Dev" />
          <MobileNavLink href="/profile" icon={<User size={18} />} label="Perfil" />
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-900 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-4 py-3 text-purple-700 hover:bg-purple-50 font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
