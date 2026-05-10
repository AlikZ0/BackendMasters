"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCw } from "lucide-react";
import { useProgress } from "@/store/progress";
import type { QuizQuestion } from "@/curriculum/types";

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
}

export function Quiz({ lessonId, questions }: Props) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(questions.length).fill(""),
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
    questions.forEach((q, i) => {
      if (q.correct === answers[i]) {
        correct += 1;
        correctAt.push(i);
      }
    });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    let xpAwarded = 0;
    if (passed) {
      xpAwarded = completeLesson(lessonId, score).xpAwarded;
    }
    setResult({ passed, score, xpAwarded, correctAt });
  };

  const reset = () => {
    setResult(null);
    setAnswers(new Array(questions.length).fill(""));
  };

  return (
    <div className="glass p-5 sm:p-6 space-y-4">
      {questions.map((q, i) => {
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
                let stateClass = "border-white/10 hover:bg-white/5";
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
