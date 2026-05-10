"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfile } from "@/store/profile";
import { useProgress } from "@/store/progress";
import { ALL_LESSONS } from "@/curriculum";
import { formatNumber } from "@/lib/utils";
import { AlertTriangle, User } from "lucide-react";

export default function ProfilePage() {
  const { profile, hydrated, setName, reset: resetProfile } = useProfile();
  const xp = useProgress((s) => s.xp);
  const lessons = useProgress((s) => s.lessons);
  const resetProgress = useProgress((s) => s.reset);
  const [draft, setDraft] = useState(profile?.name ?? "");
  const [saved, setSaved] = useState(false);

  const completedCount = Object.keys(lessons).length;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setName(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const onResetAll = () => {
    if (!confirm("Полностью обнулить прогресс и профиль? Это нельзя отменить.")) return;
    resetProgress();
    resetProfile();
    setDraft("");
  };

  return (
    <div className="space-y-6 py-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="w-7 h-7 text-accent-400" /> Профиль
        </h1>
        <p className="text-white/60 mt-1 text-sm">
          Имя хранится у тебя в браузере (cookie). Никому не уходит.
        </p>
      </div>

      <div className="glass p-5 sm:p-6">
        <form onSubmit={onSave} className="space-y-3">
          <label className="text-sm text-white/70">Как тебя называть</label>
          <input
            className="input"
            placeholder="Например, alex"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={32}
          />
          <button className="btn-primary" disabled={!draft.trim()}>
            {saved ? "Сохранено!" : "Сохранить"}
          </button>
        </form>

        {hydrated && profile && (
          <div className="text-xs text-white/45 mt-4">
            С нами с {new Date(profile.joinedAt).toLocaleDateString("ru-RU")}
          </div>
        )}
      </div>

      <div className="glass p-5">
        <h2 className="font-semibold mb-2">Где хранится прогресс</h2>
        <ul className="text-sm text-white/65 space-y-1.5">
          <li>
            • <b>localStorage</b> — XP ({formatNumber(xp)}), серия, {completedCount} пройденных
            уроков из {ALL_LESSONS.length}, достижения
          </li>
          <li>
            • <b>cookie</b> — твоё имя ({profile?.name ?? "не задано"}) и дата начала
          </li>
          <li>• <b>Сервера нет.</b> Очистил браузер — потерял всё. Учти.</li>
        </ul>
        <Link href="/dashboard" className="btn-ghost text-sm mt-4">
          Открыть дашборд
        </Link>
      </div>

      <div className="glass p-5 border-red-500/30">
        <h2 className="font-semibold text-red-300 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" /> Опасная зона
        </h2>
        <p className="text-sm text-white/65 mb-3">
          Полный сброс. Всё пропадёт. Используй, только если хочешь начать заново.
        </p>
        <button
          onClick={onResetAll}
          className="btn-ghost border-red-500/30 text-red-300 hover:bg-red-500/10"
        >
          Сбросить весь прогресс
        </button>
      </div>
    </div>
  );
}
