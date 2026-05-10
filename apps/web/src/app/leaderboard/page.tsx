"use client";

import { Trophy, User } from "lucide-react";
import { useProgress, levelForXp } from "@/store/progress";
import { useProfile } from "@/store/profile";
import { formatNumber } from "@/lib/utils";
import { LEVEL_LABEL } from "@/curriculum";

interface Player {
  name: string;
  xp: number;
  level: string;
  isYou?: boolean;
}

// 30 «соседей по карте» — детерминированные, без сервера.
const FAKE_PLAYERS: Array<{ name: string; xp: number }> = [
  { name: "kuznetsov_d", xp: 6420 },
  { name: "ada.lovelace", xp: 5980 },
  { name: "dmitri_p", xp: 5310 },
  { name: "tanya.dev", xp: 4870 },
  { name: "linus_t", xp: 4520 },
  { name: "anton_b", xp: 4180 },
  { name: "marina-s", xp: 3960 },
  { name: "kostya42", xp: 3720 },
  { name: "vova_codes", xp: 3540 },
  { name: "olya.dev", xp: 3290 },
  { name: "max-petrov", xp: 3050 },
  { name: "irina_m", xp: 2840 },
  { name: "alex_back", xp: 2620 },
  { name: "pavel.s", xp: 2380 },
  { name: "ksenia.q", xp: 2150 },
  { name: "node_lover", xp: 1920 },
  { name: "sasha-r", xp: 1740 },
  { name: "tim.b", xp: 1530 },
  { name: "lera.io", xp: 1340 },
  { name: "kirill_ts", xp: 1180 },
  { name: "guest_42", xp: 980 },
  { name: "zhenya", xp: 820 },
  { name: "polina.k", xp: 690 },
  { name: "newbie01", xp: 540 },
  { name: "katya-py", xp: 410 },
  { name: "alyosha", xp: 290 },
  { name: "starter_5", xp: 180 },
  { name: "first_step", xp: 90 },
  { name: "rookie", xp: 40 },
  { name: "hello_world", xp: 10 },
];

export default function LeaderboardPage() {
  const xp = useProgress((s) => s.xp);
  const profile = useProfile((s) => s.profile);
  const youName = profile?.name?.trim() || "ты";

  const players: Player[] = [
    ...FAKE_PLAYERS.map((p) => ({ ...p, level: levelForXp(p.xp) })),
    { name: youName, xp, level: levelForXp(xp), isYou: true },
  ].sort((a, b) => b.xp - a.xp);

  const yourRank = players.findIndex((p) => p.isYou) + 1;

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="w-7 h-7 text-cyber-amber" /> Рейтинг
        </h1>
        <div className="chip">
          <User className="w-3.5 h-3.5 text-accent-400" /> Твоё место: #{yourRank}
        </div>
      </div>

      <div className="text-xs text-white/45 -mt-3">
        Локальный соревновательный рейтинг — соревнуешься с воображаемыми соседями. Никаких аккаунтов нет.
      </div>

      <div className="glass overflow-hidden">
        <ul className="divide-y divide-white/5">
          {players.map((p, idx) => {
            const rank = idx + 1;
            return (
              <li
                key={`${p.name}-${idx}`}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${
                  p.isYou ? "bg-accent/10 border-l-2 border-accent" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 text-center text-sm font-mono ${
                      rank === 1
                        ? "text-cyber-amber"
                        : rank === 2
                        ? "text-white/80"
                        : rank === 3
                        ? "text-cyber-pink"
                        : "text-white/40"
                    }`}
                  >
                    #{rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyber-green grid place-items-center text-xs font-bold">
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {p.name} {p.isYou && <span className="text-accent-400">(ты)</span>}
                    </div>
                    <div className="text-xs text-white/45">{LEVEL_LABEL[p.level]}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-cyber-green shrink-0">
                  {formatNumber(p.xp)} XP
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
