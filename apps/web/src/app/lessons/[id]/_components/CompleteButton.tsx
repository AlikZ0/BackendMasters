"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/store/progress";

export function CompleteButton({ lessonId }: { lessonId: string }) {
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
