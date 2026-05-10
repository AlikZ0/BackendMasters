import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  LESSON_BY_ID,
  KIND_LABEL,
  LEVEL_LABEL,
  nextLesson,
  prevLesson,
} from "@/curriculum";
import { Markdown } from "@/components/Markdown";
import { LessonStatusChip } from "./_components/LessonStatusChip";
import { Quiz } from "./_components/Quiz";
import { CodeTask } from "./_components/CodeTask";
import { CompleteButton } from "./_components/CompleteButton";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = LESSON_BY_ID.get(id);
  if (!lesson) notFound();

  const next = nextLesson(id);
  const prev = prevLesson(id);

  return (
    <div className="space-y-5 py-4">
      <Link
        href={`/courses/${lesson.course.id}`}
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" /> {lesson.course.title}
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-accent-400">
            {LEVEL_LABEL[lesson.track.level]} · {KIND_LABEL[lesson.kind]} · ~{lesson.estMin} мин
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LessonStatusChip lessonId={lesson.id} />
          <span className="chip text-cyber-green">+{lesson.xp} XP</span>
        </div>
      </div>

      {lesson.body && (
        <div className="glass p-5 sm:p-6">
          <Markdown>{lesson.body}</Markdown>
        </div>
      )}

      {lesson.kind === "QUIZ" && (
        <Quiz lessonId={lesson.id} questions={lesson.payload.questions} />
      )}
      {lesson.kind === "CODE" && (
        <CodeTask
          lessonId={lesson.id}
          starter={lesson.payload.starter}
          mustContain={lesson.payload.mustContain}
          mustNotContain={lesson.payload.mustNotContain}
          hint={lesson.payload.hint}
        />
      )}
      {(lesson.kind === "READING" ||
        lesson.kind === "PROJECT" ||
        lesson.kind === "INTERVIEW") && <CompleteButton lessonId={lesson.id} />}

      <div className="flex items-center justify-between pt-4">
        {prev ? (
          <Link href={`/lessons/${prev.id}`} className="btn-ghost text-sm">
            <ChevronLeft className="w-4 h-4" /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/lessons/${next.id}`} className="btn-primary text-sm">
            {next.title} <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-primary text-sm">
            На дашборд
          </Link>
        )}
      </div>
    </div>
  );
}
