"use client";

import { Award, TrendingUp } from "lucide-react";
import type { CalendarView } from "@/lib/hooks/use-search-params";
import type { Habit } from "@/lib/types/habit";

interface HabitStat {
  habitId: string;
  streak: number;
  rate: number;
}

interface StatisticsHighlightsProps {
  calendarView: CalendarView;
  mostConsistent?: HabitStat;
  bestCompletion?: HabitStat;
  habits: Habit[];
}

export function StatisticsHighlights({
  calendarView,
  mostConsistent,
  bestCompletion,
  habits,
}: StatisticsHighlightsProps) {
  if (!mostConsistent && !bestCompletion) return null;

  const getPeriodLabel = () => {
    if (calendarView === "week") return "dias";
    if (calendarView === "month") return "dias";
    return "meses";
  };

  const getTitle = () => {
    if (calendarView === "week") return "Destaques da Semana";
    if (calendarView === "month") return "Destaques do Mês";
    return "Destaques do Ano";
  };

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-white">{getTitle()}</h2>
      <div className="grid grid-cols-1 gap-3">
        {mostConsistent && (
          <div className="rounded-2xl bg-linear-to-r from-orange-500/20 to-red-500/20 p-4 border border-orange-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-white">Mais Consistente</h3>
            </div>
            <p className="text-white/80">
              {habits.find((h) => h.id === mostConsistent.habitId)?.title}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {mostConsistent.streak} {getPeriodLabel()} de sequência
            </p>
          </div>
        )}
        {bestCompletion && (
          <div className="rounded-2xl bg-linear-to-r from-emerald-500/20 to-cyan-500/20 p-4 border border-emerald-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Melhor Performance</h3>
            </div>
            <p className="text-white/80">
              {habits.find((h) => h.id === bestCompletion.habitId)?.title}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {bestCompletion.rate}% de conclusão no período
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

