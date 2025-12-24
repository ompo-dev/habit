"use client";

import { ProgressChart } from "@/components/molecules/progress-chart";
import type { CalendarView } from "@/lib/hooks/use-search-params";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface PeriodProgress {
  date: string;
  completed: number;
  total: number;
}

interface StatisticsProgressChartSectionProps {
  calendarView: CalendarView;
  dateRange: DateRange;
  periodProgress: PeriodProgress[];
}

export function StatisticsProgressChartSection({
  calendarView,
  dateRange,
  periodProgress,
}: StatisticsProgressChartSectionProps) {
  const getTitle = () => {
    if (calendarView === "week") {
      return `Progresso da Semana (${dateRange.startDate.toLocaleDateString(
        "pt-BR",
        { day: "2-digit", month: "2-digit" }
      )} - ${dateRange.endDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })})`;
    }
    if (calendarView === "month") {
      return `Progresso de ${dateRange.startDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })}`;
    }
    return `Progresso de ${dateRange.startDate.getFullYear()}`;
  };

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-white">{getTitle()}</h2>
      <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
        <ProgressChart data={periodProgress} />
      </div>
    </div>
  );
}

