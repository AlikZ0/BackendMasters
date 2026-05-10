"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/store/progress";

export function LessonStatusChip({ lessonId }: { lessonId: string }) {
  const isCompleted = useProgress((s) => Boolean(s.lessons[lessonId]));
  if (!isCompleted) return null;
  return (
    <span className="chip text-cyber-green">
      <CheckCircle2 className="w-3.5 h-3.5" /> Пройдено
    </span>
  );
}
