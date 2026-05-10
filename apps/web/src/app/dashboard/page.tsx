"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Trophy, Target, BookOpen, Award, ArrowRight } from "lucide-react";
import { useProgress, levelForXp, nextLevelTarget, ACHIEVEMENT_LIST } from "@/store/progress";
import { useProfile } from "@/store/profile";
import { ALL_LESSONS, LEVEL_LABEL } from "@/curriculum";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { profile } = useProfile();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const lessons = useProgress((s) => s.lessons);
  const achievements = useProgress((s) => s.achievements);

  const completedCount = Object.keys(lessons).length;
  const total = ALL_LESSONS.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const level = levelForXp(xp);
  const nextTarget = nextLevelTarget(xp);

  const recent = Object.entries(lessons)
    .map(([id, rec]) => ({
      id,
      lesson: ALL_LESSONS.find((l) => l.id === id),
      completedAt: rec.completedAt,
    }))
    .filter((r) => r.lesson)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 5);

  // следующий ещё не пройденный урок
  const nextLesson = ALL_LESSONS.find((l) => !lessons[l.id]);

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="text-sm text-white/50">С возвращением,</div>
        <h1 className="text-3xl font-bold">{profile?.name ?? "ученик"}</h1>
        <div className="text-sm text-white/60 mt-1">
          Уровень: <span className="text-accent-400 font-medium">{LEVEL_LABEL[level]}</span>
          {nextTarget && (
            <span className="text-white/40">
              {" "}
              · до {LEVEL_LABEL[nextTarget.level]} осталось{" "}
              {formatNumber(nextTarget.xp - xp)} XP
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Trophy} label="XP" value={formatNumber(xp)} accent="text-cyber-green" />
        <StatCard icon={Flame} label="Серия" value={`${streak} дн.`} accent="text-cyber-amber" />
        <StatCard
          icon={BookOpen}
          label="Уроков"
          value={`${completedCount}/${total}`}
          accent="text-cyber-cyan"
        />
        <StatCard icon={Target} label="Прогресс" value={`${pct}%`} accent="text-accent-400" />
      </div>

      {/* Уровневый прогресс */}
      {nextTarget && (
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">До уровня {LEVEL_LABEL[nextTarget.level]}</h2>
            <span className="text-xs text-white/50">
              {formatNumber(xp)} / {formatNumber(nextTarget.xp)} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-cyber-green"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.round((xp / nextTarget.xp) * 100)}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Continue */}
      {nextLesson && (
        <Link
          href={`/lessons/${nextLesson.id}`}
          className="glass-strong p-5 flex items-center justify-between gap-3 hover:bg-white/[0.08] transition-colors"
        >
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-accent-400">
              Продолжить с того же места
            </div>
            <div className="font-semibold mt-1 truncate">{nextLesson.title}</div>
            <div className="text-xs text-white/55 mt-0.5 truncate">
              {nextLesson.course.emoji} {nextLesson.course.title} · ~{nextLesson.estMin} мин
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-accent-400 shrink-0" />
        </Link>
      )}

      {/* Recent activity */}
      <div className="glass p-5">
        <h2 className="font-semibold mb-3">Последние пройденные</h2>
        {recent.length === 0 ? (
          <div className="text-sm text-white/50">
            Пока пусто.{" "}
            <Link href="/roadmap" className="text-accent-400">
              Открой карту и начни →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map(
              (r) =>
                r.lesson && (
                  <li key={r.id}>
                    <Link
                      href={`/lessons/${r.id}`}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{r.lesson.title}</div>
                        <div className="text-xs text-white/50 truncate">
                          {r.lesson.course.emoji} {r.lesson.course.title}
                        </div>
                      </div>
                      <div className="text-xs text-white/40 shrink-0">
                        {new Date(r.completedAt).toLocaleDateString("ru-RU")}
                      </div>
                    </Link>
                  </li>
                ),
            )}
          </ul>
        )}
      </div>

      {/* Achievements */}
      <div className="glass p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-cyber-amber" /> Достижения
          </h2>
          <span className="text-xs text-white/50">
            {achievements.length}/{ACHIEVEMENT_LIST.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACHIEVEMENT_LIST.map((a) => {
            const got = achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`p-3 rounded-xl border ${
                  got
                    ? "bg-cyber-amber/10 border-cyber-amber/30"
                    : "bg-white/5 border-white/10 opacity-50"
                }`}
              >
                <div className="text-sm font-medium">
                  {got ? "🏆" : "🔒"} {a.title}
                </div>
                <div className="text-[11px] text-white/55 mt-0.5">{a.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 text-xs text-white/60">
        <Icon className={`w-4 h-4 ${accent}`} />
        {label}
      </div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
