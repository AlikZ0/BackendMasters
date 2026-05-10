"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ALL_LESSONS, LESSON_BY_ID } from "@/curriculum";

export type LevelTag = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR" | "EXPERT";

interface LessonRecord {
  completed: true;
  score?: number;
  attempts: number;
  completedAt: string;
}

interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  lessons: Record<string, LessonRecord>;
  achievements: string[];

  completeLesson: (lessonId: string, score?: number) => { xpAwarded: number; newAchievements: string[] };
  recordAttempt: (lessonId: string, score?: number) => void;
  reset: () => void;

  isCompleted: (lessonId: string) => boolean;
  level: () => LevelTag;
  completedCount: () => number;
}

const LEVEL_THRESHOLDS: Array<{ level: LevelTag; xp: number }> = [
  { level: "EXPERT", xp: 6000 },
  { level: "SENIOR", xp: 3000 },
  { level: "MIDDLE", xp: 1200 },
  { level: "JUNIOR", xp: 300 },
  { level: "BEGINNER", xp: 0 },
];

export function levelForXp(xp: number): LevelTag {
  for (const t of LEVEL_THRESHOLDS) if (xp >= t.xp) return t.level;
  return "BEGINNER";
}

export function nextLevelTarget(xp: number): { level: LevelTag; xp: number } | null {
  const ascending = [...LEVEL_THRESHOLDS].reverse();
  for (const t of ascending) if (t.xp > xp) return t;
  return null;
}

const ACHIEVEMENT_RULES: Array<{
  id: string;
  title: string;
  description: string;
  unlocked: (s: Pick<ProgressState, "xp" | "streak" | "lessons">) => boolean;
}> = [
  {
    id: "first-blood",
    title: "Первая кровь",
    description: "Пройди первый урок",
    unlocked: (s) => Object.keys(s.lessons).length >= 1,
  },
  {
    id: "ten-down",
    title: "Десятка",
    description: "10 пройденных уроков",
    unlocked: (s) => Object.keys(s.lessons).length >= 10,
  },
  {
    id: "centurion",
    title: "Центурион",
    description: "Набери 100 XP",
    unlocked: (s) => s.xp >= 100,
  },
  {
    id: "thousand-club",
    title: "Тысяча",
    description: "Набери 1000 XP",
    unlocked: (s) => s.xp >= 1000,
  },
  {
    id: "streak-3",
    title: "В огне",
    description: "Серия из 3 дней",
    unlocked: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    title: "Воин недели",
    description: "Серия из 7 дней",
    unlocked: (s) => s.streak >= 7,
  },
  {
    id: "junior",
    title: "Junior unlocked",
    description: "Достиг уровня Junior",
    unlocked: (s) => levelForXp(s.xp) === "JUNIOR" || levelForXp(s.xp) === "MIDDLE" || levelForXp(s.xp) === "SENIOR" || levelForXp(s.xp) === "EXPERT",
  },
  {
    id: "middle",
    title: "Middle unlocked",
    description: "Достиг уровня Middle",
    unlocked: (s) => ["MIDDLE", "SENIOR", "EXPERT"].includes(levelForXp(s.xp)),
  },
  {
    id: "senior",
    title: "Senior unlocked",
    description: "Достиг уровня Senior",
    unlocked: (s) => ["SENIOR", "EXPERT"].includes(levelForXp(s.xp)),
  },
];

export const ACHIEVEMENT_LIST = ACHIEVEMENT_RULES.map(({ id, title, description }) => ({
  id,
  title,
  description,
}));

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const dA = new Date(a + "T00:00:00Z").getTime();
  const dB = new Date(b + "T00:00:00Z").getTime();
  return Math.round((dB - dA) / 86_400_000);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      lessons: {},
      achievements: [],

      isCompleted: (id) => Boolean(get().lessons[id]),
      completedCount: () => Object.keys(get().lessons).length,
      level: () => levelForXp(get().xp),

      recordAttempt: (lessonId, score) =>
        set((s) => {
          const cur = s.lessons[lessonId];
          if (!cur) return s;
          return {
            lessons: { ...s.lessons, [lessonId]: { ...cur, attempts: cur.attempts + 1, score } },
          };
        }),

      completeLesson: (lessonId, score) => {
        const lesson = LESSON_BY_ID.get(lessonId);
        if (!lesson) return { xpAwarded: 0, newAchievements: [] };
        const existing = get().lessons[lessonId];

        const today = todayUTC();
        const last = get().lastActiveDate;
        let nextStreak = get().streak;
        if (!last) nextStreak = 1;
        else {
          const diff = daysBetween(last, today);
          if (diff === 0) nextStreak = get().streak;
          else if (diff === 1) nextStreak = get().streak + 1;
          else nextStreak = 1;
        }

        const xpAwarded = existing ? 0 : lesson.xp;
        const nextXp = get().xp + xpAwarded;
        const nextLessons = {
          ...get().lessons,
          [lessonId]: {
            completed: true as const,
            score,
            attempts: (existing?.attempts ?? 0) + 1,
            completedAt: existing?.completedAt ?? new Date().toISOString(),
          },
        };

        const draftState = {
          xp: nextXp,
          streak: nextStreak,
          lessons: nextLessons,
        };
        const earned = new Set(get().achievements);
        const newOnes: string[] = [];
        for (const r of ACHIEVEMENT_RULES) {
          if (!earned.has(r.id) && r.unlocked(draftState)) {
            earned.add(r.id);
            newOnes.push(r.id);
          }
        }

        set({
          xp: nextXp,
          streak: nextStreak,
          lastActiveDate: today,
          lessons: nextLessons,
          achievements: Array.from(earned),
        });

        return { xpAwarded, newAchievements: newOnes };
      },

      reset: () =>
        set({
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          lessons: {},
          achievements: [],
        }),
    }),
    {
      name: "bm_progress_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/** Доля пройденных уроков из всех */
export function progressPercent(state: ProgressState): number {
  const total = ALL_LESSONS.length;
  return total === 0 ? 0 : Math.round((Object.keys(state.lessons).length / total) * 100);
}
