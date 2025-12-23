"use client";

import { Award, TrendingUp } from "lucide-react";
import { useHydratedValue } from "@/lib/hooks/use-hydration";
import type { Habit } from "@/lib/types/habit";
import { memo, useMemo } from "react";

interface Highlight {
  habitId: string;
  currentStreak?: number;
  completionRate?: number;
}

interface HighlightsSectionProps {
  mostConsistent?: Highlight;
  bestCompletion?: Highlight;
  habits: Habit[];
}

export const HighlightsSection = memo(function HighlightsSection({
  mostConsistent,
  bestCompletion,
  habits,
}: HighlightsSectionProps) {
  // Previne erro de hidratação
  const hasHighlights = useHydratedValue(
    () => !!(mostConsistent || bestCompletion),
    false
  );

  // Memoiza busca de hábitos
  const mostConsistentHabit = useMemo(
    () => mostConsistent ? habits.find((h) => h.id === mostConsistent.habitId) : null,
    [habits, mostConsistent]
  );
  
  const bestCompletionHabit = useMemo(
    () => bestCompletion ? habits.find((h) => h.id === bestCompletion.habitId) : null,
    [habits, bestCompletion]
  );

  if (!hasHighlights) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-white">Destaques</h2>
      <div className="grid grid-cols-1 gap-3">
        {mostConsistent && (
          <div className="rounded-2xl bg-linear-to-r from-orange-500/20 to-red-500/20 p-4 border border-orange-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-orange-400" aria-hidden="true" />
              <h3 className="font-semibold text-white">Mais Consistente</h3>
            </div>
            <p className="text-white/80">
              {mostConsistentHabit?.title}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {mostConsistent.currentStreak} dias de sequência
            </p>
          </div>
        )}
        {bestCompletion && (
          <div className="rounded-2xl bg-linear-to-r from-emerald-500/20 to-cyan-500/20 p-4 border border-emerald-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              <h3 className="font-semibold text-white">Melhor Performance</h3>
            </div>
            <p className="text-white/80">
              {bestCompletionHabit?.title}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {bestCompletion.completionRate}% de conclusão
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

