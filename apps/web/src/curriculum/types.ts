export type LessonKind = "READING" | "QUIZ" | "CODE" | "PROJECT" | "INTERVIEW";

export type LevelTag = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR" | "EXPERT";

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export interface QuizPayload {
  questions: QuizQuestion[];
}

export interface CodePayload {
  starter: string;
  /** Регулярки или строки, которые ДОЛЖНЫ присутствовать в решении */
  mustContain?: string[];
  /** Запрещённые подстроки */
  mustNotContain?: string[];
  /** Подсказка-хинт */
  hint?: string;
}

export interface BaseLesson {
  id: string;
  title: string;
  body: string;
  xp: number;
  estMin: number;
}

export type Lesson =
  | (BaseLesson & { kind: "READING" })
  | (BaseLesson & { kind: "PROJECT" })
  | (BaseLesson & { kind: "INTERVIEW" })
  | (BaseLesson & { kind: "QUIZ"; payload: QuizPayload })
  | (BaseLesson & { kind: "CODE"; payload: CodePayload });

export interface Module {
  id: string;
  title: string;
  summary?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  modules: Module[];
}

export interface Track {
  id: string;
  level: LevelTag;
  title: string;
  description: string;
  hours: number;
  courses: Course[];
}
