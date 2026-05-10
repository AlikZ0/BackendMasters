"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Trophy } from "lucide-react";
import { useProgress } from "@/store/progress";
import { useProfile } from "@/store/profile";
import { cn } from "@/lib/utils";

const links = [
  { href: "/roadmap", label: "Карта" },
  { href: "/courses", label: "Курсы" },
  { href: "/playground", label: "Песочница" },
  { href: "/leaderboard", label: "Рейтинг" },
];

export function Navbar() {
  const pathname = usePathname();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const profile = useProfile((s) => s.profile);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-accent to-cyber-green shadow-glow" />
          <span className="hidden sm:inline">BackendMasters</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname?.startsWith(l.href)
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex chip">
            <Flame className="w-3.5 h-3.5 text-cyber-amber" /> {streak}
          </span>
          <span className="hidden sm:inline-flex chip">
            <Trophy className="w-3.5 h-3.5 text-cyber-green" /> {xp} XP
          </span>
          <Link href="/profile" className="btn-ghost text-sm">
            {profile?.name ?? "Профиль"}
          </Link>
        </div>
      </div>
    </header>
  );
}
