"use client";

import { useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, CheckCircle2, RotateCw } from "lucide-react";
import {
  LESSON_BY_ID,
  KIND_LABEL,
  LEVEL_LABEL,
  nextLesson,
  prevLesson,
} from "@/curriculum";
import { useProgress } from "@/store/progress";
import { Markdown } from "@/components/Markdown";
import { CodeEditor } from "@/components/CodeEditor";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const lesson = LESSON_BY_ID.get(id);
  const isCompleted = useProgress((s) => Boolean(s.lessons[id]));
  const next = lesson ? nextLesson(id) : null;
  const prev = lesson ? prevLesson(id) : null;

  if (!lesson) notFound();

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
          {isCompleted && (
            <span className="chip text-cyber-green">
              <CheckCircle2 className="w-3.5 h-3.5" /> Пройдено
            </span>
          )}
          <span className="chip text-cyber-green">+{lesson.xp} XP</span>
        </div>
      </div>

      {lesson.body && (
        <div className="glass p-5 sm:p-6">
          <Markdown>{lesson.body}</Markdown>
        </div>
      )}

      {lesson.kind === "QUIZ" && <Quiz lesson={lesson} />}
      {lesson.kind === "CODE" && <CodeTask lesson={lesson} />}
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
          <Link
            href={`/lessons/${next.id}`}
            className="btn-primary text-sm"
            onClick={() => router.refresh()}
          >
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

// ─── QUIZ ───────────────────────────────────────────────────────

function Quiz({ lesson }: { lesson: Extract<NonNullable<ReturnType<typeof LESSON_BY_ID.get>>, { kind: "QUIZ" }> }) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(lesson.payload.questions.length).fill(""),
  );
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    xpAwarded: number;
    correctAt: number[];
  } | null>(null);

  const submit = () => {
    let correct = 0;
    const correctAt: number[] = [];
    lesson.payload.questions.forEach((q, i) => {
      if (q.correct === answers[i]) {
        correct += 1;
        correctAt.push(i);
      }
    });
    const score = Math.round((correct / lesson.payload.questions.length) * 100);
    const passed = score >= 70;
    let xpAwarded = 0;
    if (passed) {
      xpAwarded = completeLesson(lesson.id, score).xpAwarded;
    }
    setResult({ passed, score, xpAwarded, correctAt });
  };

  const reset = () => {
    setResult(null);
    setAnswers(new Array(lesson.payload.questions.length).fill(""));
  };

  return (
    <div className="glass p-5 sm:p-6 space-y-4">
      {lesson.payload.questions.map((q, i) => {
        const wasCorrect = result?.correctAt.includes(i) ?? false;
        return (
          <div key={i}>
            <div className="font-medium">
              {i + 1}. {q.q}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {q.options.map((opt) => {
                const picked = answers[i] === opt;
                const isCorrectAnswer = q.correct === opt;
                let stateClass =
                  "border-white/10 hover:bg-white/5";
                if (picked && !result) stateClass = "border-accent/60 bg-accent/10";
                if (result && picked && isCorrectAnswer)
                  stateClass = "border-cyber-green/60 bg-cyber-green/10 text-cyber-green";
                if (result && picked && !isCorrectAnswer)
                  stateClass = "border-red-500/60 bg-red-500/10 text-red-300";
                if (result && !picked && isCorrectAnswer)
                  stateClass = "border-cyber-green/40 text-cyber-green";

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${stateClass}`}
                  >
                    <input
                      type="radio"
                      className="accent-accent"
                      name={`q-${i}`}
                      value={opt}
                      checked={picked}
                      disabled={!!result}
                      onChange={() => {
                        const next = [...answers];
                        next[i] = opt;
                        setAnswers(next);
                      }}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
            {result && !wasCorrect && q.explanation && (
              <div className="text-xs text-white/55 mt-1.5 pl-1">💡 {q.explanation}</div>
            )}
          </div>
        );
      })}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 border ${
            result.passed
              ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}
        >
          {result.passed
            ? `Сдано на ${result.score}%! ${result.xpAwarded > 0 ? `+${result.xpAwarded} XP` : "(уже было засчитано)"}`
            : `Результат ${result.score}%. Для зачёта нужно 70%.`}
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        {!result ? (
          <button
            className="btn-primary"
            disabled={answers.some((a) => !a)}
            onClick={submit}
          >
            <Sparkles className="w-4 h-4" /> Сдать ответы
          </button>
        ) : (
          <button className="btn-ghost" onClick={reset}>
            <RotateCw className="w-4 h-4" /> Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CODE ──────────────────────────────────────────────────────

function CodeTask({ lesson }: { lesson: Extract<NonNullable<ReturnType<typeof LESSON_BY_ID.get>>, { kind: "CODE" }> }) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const isCompleted = useProgress((s) => Boolean(s.lessons[lesson.id]));
  const [code, setCode] = useState(lesson.payload.starter);
  const [result, setResult] = useState<{ passed: boolean; reason?: string; xpAwarded?: number } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const submit = () => {
    const must = lesson.payload.mustContain ?? [];
    const notMust = lesson.payload.mustNotContain ?? [];
    const missing = must.find((s) => !code.includes(s));
    if (missing) {
      setResult({ passed: false, reason: `Не хватает: ${missing}` });
      recordAttempt(lesson.id);
      return;
    }
    const forbidden = notMust.find((s) => code.includes(s));
    if (forbidden) {
      setResult({ passed: false, reason: `Запрещено использовать: ${forbidden}` });
      recordAttempt(lesson.id);
      return;
    }
    const r = completeLesson(lesson.id, 100);
    setResult({ passed: true, xpAwarded: r.xpAwarded });
  };

  return (
    <div className="glass p-5 sm:p-6 space-y-3">
      <CodeEditor value={code} onChange={setCode} />

      <div className="text-xs text-white/55 space-y-1">
        {lesson.payload.mustContain && (
          <div>
            ✅ Должно содержать:{" "}
            {lesson.payload.mustContain.map((s) => (
              <code
                key={s}
                className="mx-1 px-1.5 py-0.5 rounded bg-white/10 text-cyber-cyan"
              >
                {s}
              </code>
            ))}
          </div>
        )}
        {lesson.payload.mustNotContain && (
          <div>
            ❌ Не должно содержать:{" "}
            {lesson.payload.mustNotContain.map((s) => (
              <code
                key={s}
                className="mx-1 px-1.5 py-0.5 rounded bg-white/10 text-red-300"
              >
                {s}
              </code>
            ))}
          </div>
        )}
      </div>

      {lesson.payload.hint && (
        <button
          className="text-xs text-accent-400 hover:text-accent"
          onClick={() => setShowHint((v) => !v)}
        >
          {showHint ? "Скрыть подсказку" : "Показать подсказку"}
        </button>
      )}
      {showHint && lesson.payload.hint && (
        <div className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg p-3">
          💡 {lesson.payload.hint}
        </div>
      )}

      {result && (
        <div
          className={`rounded-xl p-4 border ${
            result.passed
              ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}
        >
          {result.passed
            ? `Принято! ${result.xpAwarded ? `+${result.xpAwarded} XP` : "(уже было засчитано)"}`
            : `Не принято. ${result.reason ?? ""}`}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={submit}>
          <Sparkles className="w-4 h-4" /> Проверить
        </button>
        <button
          className="btn-ghost text-sm"
          onClick={() => {
            setCode(lesson.payload.starter);
            setResult(null);
          }}
        >
          Сбросить код
        </button>
        {isCompleted && (
          <span className="text-xs text-cyber-green">Уже пройдено</span>
        )}
      </div>
    </div>
  );
}

// ─── READING / PROJECT / INTERVIEW ─────────────────────────────

function CompleteButton({ lessonId }: { lessonId: string }) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const isCompleted = useProgress((s) => Boolean(s.lessons[lessonId]));
  const [justAwarded, setJustAwarded] = useState<number | null>(null);

  const submit = () => {
    const r = completeLesson(lessonId);
    setJustAwarded(r.xpAwarded);
  };

  return (
    <div className="glass p-5">
      {isCompleted ? (
        <div className="flex items-center gap-2 text-cyber-green">
          <CheckCircle2 className="w-5 h-5" />
          {justAwarded && justAwarded > 0
            ? `Отмечено пройденным! +${justAwarded} XP`
            : "Урок отмечен пройденным"}
        </div>
      ) : (
        <button className="btn-primary" onClick={submit}>
          Отметить пройденным
        </button>
      )}
    </div>
  );
}
