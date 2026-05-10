"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { COURSE_BY_ID, KIND_LABEL, LEVEL_LABEL } from "@/curriculum";
import { useProgress } from "@/store/progress";

const KIND_COLOR: Record<string, string> = {
  READING: "text-cyber-cyan",
  QUIZ: "text-cyber-amber",
  CODE: "text-cyber-green",
  PROJECT: "text-cyber-pink",
  INTERVIEW: "text-accent-400",
};

const declineLessons = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "урок";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "урока";
  return "уроков";
};

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const course = COURSE_BY_ID.get(slug);
  const lessonsDone = useProgress((s) => s.lessons);

  if (!course) notFound();

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start gap-4">
        <span className="text-5xl">{course.emoji}</span>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-accent-400">
            {LEVEL_LABEL[course.level]} · {course.trackTitle}
          </div>
          <h1 className="text-3xl font-bold mt-1">{course.title}</h1>
          <p className="text-white/65 mt-1">{course.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {course.modules.map((m, i) => (
          <div key={m.id} className="glass p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                <span className="text-white/40 mr-2">{i + 1}.</span>
                {m.title}
              </h2>
              <span className="chip">
                {m.lessons.length} {declineLessons(m.lessons.length)}
              </span>
            </div>
            {m.summary && <p className="text-sm text-white/60 mt-1">{m.summary}</p>}
            <ul className="mt-3 divide-y divide-white/5">
              {m.lessons.map((l) => {
                const done = Boolean(lessonsDone[l.id]);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/lessons/${l.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-cyber-green shrink-0" />
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{l.title}</div>
                          <div className="text-[11px] text-white/45 mt-0.5 flex items-center gap-2">
                            <span className={KIND_COLOR[l.kind]}>{KIND_LABEL[l.kind]}</span>
                            <span>·</span>
                            <span>~{l.estMin} мин</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-cyber-green shrink-0">+{l.xp} XP</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
