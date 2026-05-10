"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { TRACKS, TOTAL_LESSONS, LEVEL_LABEL, LEVEL_COLOR } from "@/curriculum";
import { useProgress } from "@/store/progress";

const declineCourses = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "курс";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "курса";
  return "курсов";
};
const declineLessons = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "урок";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "урока";
  return "уроков";
};

export default function RoadmapPage() {
  const lessonsDone = useProgress((s) => s.lessons);

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-bold">Карта обучения</h1>
        <p className="text-white/65 mt-1">
          {TRACKS.length} уровней, {TOTAL_LESSONS} уроков. Иди по порядку или прыгай — прогресс
          сохраняется в твоём браузере.
        </p>
      </div>

      <ol className="relative pl-6 sm:pl-8 space-y-6">
        <span className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
        {TRACKS.map((t, i) => {
          const allLessons = t.courses.flatMap((c) => c.modules.flatMap((m) => m.lessons));
          const done = allLessons.filter((l) => lessonsDone[l.id]).length;
          const totalLessons = allLessons.length;
          const pct = totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);

          return (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[3px] sm:-left-[1px] top-3 w-3 h-3 rounded-full bg-accent shadow-glow" />
              <div className="glass p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className={`text-xs font-mono bg-gradient-to-r ${LEVEL_COLOR[t.level]} bg-clip-text text-transparent`}
                    >
                      {LEVEL_LABEL[t.level]} · ~{t.hours} ч
                    </div>
                    <h2 className="text-xl font-bold mt-0.5">{t.title}</h2>
                  </div>
                  <span className="chip whitespace-nowrap">
                    {t.courses.length} {declineCourses(t.courses.length)} · {totalLessons}{" "}
                    {declineLessons(totalLessons)}
                  </span>
                </div>
                <p className="text-sm text-white/70 mt-2">{t.description}</p>

                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${LEVEL_COLOR[t.level]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-white/45 mt-1">
                    {done} из {totalLessons} пройдено · {pct}%
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {t.courses.map((c) => {
                    const cLessons = c.modules.flatMap((m) => m.lessons);
                    const cDone = cLessons.filter((l) => lessonsDone[l.id]).length;
                    const allDone = cDone === cLessons.length && cLessons.length > 0;
                    return (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        className="group block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium flex items-center gap-2 min-w-0">
                            <span className="shrink-0">{c.emoji}</span>
                            <span className="truncate">{c.title}</span>
                            {allDone && (
                              <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0" />
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </div>
                        <div className="text-xs text-white/55 mt-1">
                          {cDone}/{cLessons.length} {declineLessons(cLessons.length)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
