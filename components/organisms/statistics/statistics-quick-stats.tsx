"use client";

import { Target, TrendingUp, Calendar, Flame } from "lucide-react";
import { StatCard } from "@/components/molecules/stat-card";
import type { CalendarView } from "@/lib/hooks/use-search-params";

interface PeriodStats {
  completionRate: number;
  completedCount: number;
  totalCount: number;
  periodProgress: Array<{ date: string; completed: number; total: number }>;
}

interface StatisticsQuickStatsProps {
  calendarView: CalendarView;
  periodStats: PeriodStats;
  totalStreak?: number;
}

export function StatisticsQuickStats({
  calendarView,
  periodStats,
  totalStreak = 0,
}: StatisticsQuickStatsProps) {
  const activeDays = periodStats.periodProgress.filter(
    (p) => p.completed > 0
  ).length;

  const activeMonths = new Set(
    periodStats.periodProgress
      .filter((p) => p.completed > 0)
      .map((p) => p.date.substring(0, 7))
  ).size;

  if (calendarView === "week") {
    return (
      <>
        <StatCard
          icon={<Target className="h-5 w-5 text-emerald-400" />}
          label="Taxa da Semana"
          value={`${periodStats.completionRate}%`}
          color="bg-emerald-500/20"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          label="Completos"
          value={periodStats.completedCount}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-purple-400" />}
          label="Total"
          value={periodStats.totalCount}
          color="bg-purple-500/20"
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          label="Dias Ativos"
          value={activeDays}
          color="bg-orange-500/20"
        />
      </>
    );
  }

  if (calendarView === "month") {
    return (
      <>
        <StatCard
          icon={<Target className="h-5 w-5 text-emerald-400" />}
          label="Taxa do Mês"
          value={`${periodStats.completionRate}%`}
          color="bg-emerald-500/20"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          label="Completos"
          value={periodStats.completedCount}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-purple-400" />}
          label="Total"
          value={periodStats.totalCount}
          color="bg-purple-500/20"
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          label="Dias Ativos"
          value={activeDays}
          color="bg-orange-500/20"
        />
      </>
    );
  }

  // Year view
  return (
    <>
      <StatCard
        icon={<Target className="h-5 w-5 text-emerald-400" />}
        label="Taxa do Ano"
        value={`${periodStats.completionRate}%`}
        color="bg-emerald-500/20"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
        label="Completos"
        value={periodStats.completedCount}
        color="bg-blue-500/20"
      />
      <StatCard
        icon={<Calendar className="h-5 w-5 text-purple-400" />}
        label="Meses Ativos"
        value={activeMonths}
        color="bg-purple-500/20"
      />
      <StatCard
        icon={<Flame className="h-5 w-5 text-orange-400" />}
        label="Streak Total"
        value={totalStreak}
        color="bg-orange-500/20"
      />
    </>
  );
}

