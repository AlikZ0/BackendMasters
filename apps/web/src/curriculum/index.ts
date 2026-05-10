import type { Course, Lesson, Module, Track } from "./types";
import { LEVEL_1 } from "./level-1";
import { LEVEL_2 } from "./level-2";
import { LEVEL_3 } from "./level-3";
import { LEVEL_4 } from "./level-4";
import { LEVEL_5 } from "./level-5";
import { LEVEL_6 } from "./level-6";

export const TRACKS: Track[] = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];

export type FlatLesson = Lesson & {
  track: Pick<Track, "id" | "title" | "level">;
  course: Pick<Course, "id" | "title" | "emoji">;
  module: Pick<Module, "id" | "title">;
};

export const ALL_LESSONS: FlatLesson[] = TRACKS.flatMap((t) =>
  t.courses.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons.map((l) => ({
        ...l,
        track: { id: t.id, title: t.title, level: t.level },
        course: { id: c.id, title: c.title, emoji: c.emoji },
        module: { id: m.id, title: m.title },
      })),
    ),
  ),
);

export const LESSON_BY_ID = new Map(ALL_LESSONS.map((l) => [l.id, l]));
export const COURSE_BY_ID = new Map(
  TRACKS.flatMap((t) => t.courses.map((c) => [c.id, { ...c, trackId: t.id, level: t.level, trackTitle: t.title }] as const)),
);
export const TRACK_BY_ID = new Map(TRACKS.map((t) => [t.id, t]));

export const TOTAL_LESSONS = ALL_LESSONS.length;
export const TOTAL_XP = ALL_LESSONS.reduce((s, l) => s + l.xp, 0);

export function lessonsForCourse(courseId: string): FlatLesson[] {
  return ALL_LESSONS.filter((l) => l.course.id === courseId);
}

export function nextLesson(currentId: string): FlatLesson | null {
  const idx = ALL_LESSONS.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx === ALL_LESSONS.length - 1) return null;
  return ALL_LESSONS[idx + 1] ?? null;
}

export function prevLesson(currentId: string): FlatLesson | null {
  const idx = ALL_LESSONS.findIndex((l) => l.id === currentId);
  if (idx <= 0) return null;
  return ALL_LESSONS[idx - 1] ?? null;
}

export const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: "Новичок",
  JUNIOR: "Junior",
  MIDDLE: "Middle",
  SENIOR: "Senior",
  EXPERT: "Эксперт",
};

export const KIND_LABEL: Record<string, string> = {
  READING: "Чтение",
  QUIZ: "Тест",
  CODE: "Код",
  PROJECT: "Проект",
  INTERVIEW: "Собес",
};

export const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: "from-cyber-cyan to-accent",
  JUNIOR: "from-accent to-cyber-pink",
  MIDDLE: "from-cyber-green to-cyber-cyan",
  SENIOR: "from-cyber-amber to-cyber-pink",
  EXPERT: "from-cyber-pink to-accent",
};
