"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useProgress } from "@/store/progress";
import { CodeEditor } from "@/components/CodeEditor";

interface Props {
  lessonId: string;
  starter: string;
  mustContain?: string[];
  mustNotContain?: string[];
  hint?: string;
}

export function CodeTask({
  lessonId,
  starter,
  mustContain,
  mustNotContain,
  hint,
}: Props) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const isCompleted = useProgress((s) => Boolean(s.lessons[lessonId]));
  const [code, setCode] = useState(starter);
  const [result, setResult] = useState<{
    passed: boolean;
    reason?: string;
    xpAwarded?: number;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const submit = () => {
    const must = mustContain ?? [];
    const notMust = mustNotContain ?? [];
    const missing = must.find((s) => !code.includes(s));
    if (missing) {
      setResult({ passed: false, reason: `Не хватает: ${missing}` });
      recordAttempt(lessonId);
      return;
    }
    const forbidden = notMust.find((s) => code.includes(s));
    if (forbidden) {
      setResult({ passed: false, reason: `Запрещено использовать: ${forbidden}` });
      recordAttempt(lessonId);
      return;
    }
    const r = completeLesson(lessonId, 100);
    setResult({ passed: true, xpAwarded: r.xpAwarded });
  };

  return (
    <div className="glass p-5 sm:p-6 space-y-3">
      <CodeEditor value={code} onChange={setCode} />

      <div className="text-xs text-white/55 space-y-1">
        {mustContain && (
          <div>
            ✅ Должно содержать:{" "}
            {mustContain.map((s) => (
              <code
                key={s}
                className="mx-1 px-1.5 py-0.5 rounded bg-white/10 text-cyber-cyan"
              >
                {s}
              </code>
            ))}
          </div>
        )}
        {mustNotContain && (
          <div>
            ❌ Не должно содержать:{" "}
            {mustNotContain.map((s) => (
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

      {hint && (
        <button
          className="text-xs text-accent-400 hover:text-accent"
          onClick={() => setShowHint((v) => !v)}
        >
          {showHint ? "Скрыть подсказку" : "Показать подсказку"}
        </button>
      )}
      {showHint && hint && (
        <div className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg p-3">
          💡 {hint}
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
            setCode(starter);
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
