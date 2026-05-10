"use client";

import Link from "next/link";
import { TRACKS, LEVEL_LABEL } from "@/curriculum";
import { useProgress } from "@/store/progress";

export default function CoursesPage() {
  const lessonsDone = useProgress((s) => s.lessons);
  const courses = TRACKS.flatMap((t) =>
    t.courses.map((c) => ({
      ...c,
      level: t.level,
      trackTitle: t.title,
    })),
  );

  return (
    <div className="space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-bold">Все курсы</h1>
        <p className="text-white/65 mt-1">{courses.length} курсов на пути от нуля до Senior.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => {
          const lessons = c.modules.flatMap((m) => m.lessons);
          const done = lessons.filter((l) => lessonsDone[l.id]).length;
          const pct = lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100);
          return (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="glass p-5 hover:bg-white/[0.07] transition-colors flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{c.emoji}</span>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-accent-400">
                    {LEVEL_LABEL[c.level]}
                  </div>
                  <div className="font-semibold leading-tight">{c.title}</div>
                </div>
              </div>
              <p className="text-sm text-white/65">{c.description}</p>
              <div className="mt-auto">
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-cyber-green"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-white/45 mt-1">
                  {done}/{lessons.length} уроков
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
