"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Terminal, Trophy, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/roadmap", label: "Карта", icon: Compass },
  { href: "/courses", label: "Курсы", icon: BookOpen },
  { href: "/dashboard", label: "Я", icon: LayoutDashboard },
  { href: "/playground", label: "Код", icon: Terminal },
  { href: "/leaderboard", label: "Топ", icon: Trophy },
];

export function MobileTabs() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-2xl bg-black/60 border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 transition-colors active:scale-95",
                  active ? "text-white" : "text-white/55",
                )}
              >
                <Icon className={cn("w-5 h-5", active && "text-accent-400")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
