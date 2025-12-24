"use client";

import { useMemo } from "react";
import type { Habit, Progress } from "@/lib/types/habit";
import type { CalendarView } from "./use-search-params";
import { getDateString, getStartOfWeek } from "@/lib/utils/date-helpers";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface PeriodStats {
  completedCount: number;
  totalCount: number;
  completionRate: number;
  categoryStats: Record<
    string,
    { count: number; completed: number; total: number }
  >;
  periodProgress: Array<{ date: string; completed: number; total: number }>;
  habitStatsInPeriod: Array<{
    habitId: string;
    completed: number;
    total: number;
    rate: number;
    streak: number;
  }>;
  mostConsistentInPeriod?: {
    habitId: string;
    streak: number;
    rate: number;
  };
  bestCompletionInPeriod?: {
    habitId: string;
    rate: number;
    streak: number;
  };
}

export function usePeriodStats(
  habits: Habit[],
  progress: Progress[],
  dateRange: DateRange,
  selectedDayTimestamp: number,
  calendarView: CalendarView,
  selectedDayKey: string // Adiciona selectedDayKey para forçar recálculo
): PeriodStats {
  // Serializa as datas para garantir reatividade
  const startDateStr = getDateString(dateRange.startDate);
  const endDateStr = getDateString(dateRange.endDate);
  
  // Filtra o progresso pelo período selecionado
  // Progress.date é uma string no formato YYYY-MM-DD
  const filteredProgress = useMemo(() => {
    const filtered = progress.filter((p) => {
      // p.date já é uma string no formato YYYY-MM-DD
      return p.date >= startDateStr && p.date <= endDateStr;
    });
    
    // Debug: log para verificar o que está sendo filtrado
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Filtro de Progress:", {
        calendarView,
        totalProgress: progress.length,
        filteredCount: filtered.length,
        dateRange: { start: startDateStr, end: endDateStr },
        selectedDayKey,
        sampleFilteredDates: filtered.slice(0, 5).map(p => p.date),
      });
    }
    
    return filtered;
  }, [progress, startDateStr, endDateStr, selectedDayKey, calendarView]);

  // Calcula estatísticas do período selecionado
  const periodStats = useMemo(() => {
    const completedCount = filteredProgress.filter((p) => p.completed).length;
    const totalCount = filteredProgress.length;
    const completionRate =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Estatísticas por categoria no período
    const categoryStats = habits.reduce((acc, habit) => {
      const category = habit.category;
      if (!acc[category]) {
        acc[category] = { count: 0, completed: 0, total: 0 };
      }
      acc[category].count++;

      const habitProgress = filteredProgress.filter(
        (p) => p.habitId === habit.id
      );
      acc[category].completed += habitProgress.filter(
        (p) => p.completed
      ).length;
      acc[category].total += habitProgress.length;

      return acc;
    }, {} as Record<string, { count: number; completed: number; total: number }>);

    // Progresso por data no período
    const progressByDate = filteredProgress.reduce((acc, p) => {
      if (!acc[p.date]) {
        acc[p.date] = [];
      }
      acc[p.date].push(p);
      return acc;
    }, {} as Record<string, typeof filteredProgress>);

    // Gera array de datas/semanas do período baseado na view
    let periodProgress: Array<{ date: string; completed: number; total: number }>;
    
    if (calendarView === "year") {
      // Para ano: agrupa por semanas (4 semanas no mês)
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const weeks: Array<{ weekStart: string; weekEnd: string; dates: string[] }> = [];
      
      let currentWeekStart = getStartOfWeek(startDate, 0); // Domingo
      while (currentWeekStart <= endDate) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Sábado
        
        // Ajusta o fim da semana se passar do fim do mês
        const actualWeekEnd = weekEnd > endDate ? endDate : weekEnd;
        
        const weekDates: string[] = [];
        const currentDate = new Date(currentWeekStart);
        while (currentDate <= actualWeekEnd && currentDate <= endDate) {
          weekDates.push(getDateString(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (weekDates.length > 0) {
          weeks.push({
            weekStart: getDateString(currentWeekStart),
            weekEnd: getDateString(actualWeekEnd),
            dates: weekDates,
          });
        }
        
        // Próxima semana
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
      
      periodProgress = weeks.map((week, index) => {
        const weekCompleted = week.dates.reduce((sum, date) => {
          return sum + (progressByDate[date] || []).filter((p) => p.completed).length;
        }, 0);
        const weekTotal = week.dates.reduce((sum, date) => {
          return sum + (progressByDate[date] || []).length;
        }, 0);
        
        return {
          date: `Semana ${index + 1}`, // Label da semana
          completed: weekCompleted,
          total: weekTotal,
        };
      });
    } else {
      // Para semana e mês: mostra por dia
      const datesInPeriod: string[] = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        datesInPeriod.push(getDateString(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      periodProgress = datesInPeriod.map((date) => ({
        date,
        completed: (progressByDate[date] || []).filter((p) => p.completed).length,
        total: (progressByDate[date] || []).length,
      }));
    }

    // Estatísticas por hábito no período
    const habitStatsInPeriod = habits
      .map((habit) => {
        const habitProgress = filteredProgress.filter(
          (p) => p.habitId === habit.id
        );
        const completed = habitProgress.filter((p) => p.completed).length;
        const total = habitProgress.length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Calcula streak no período
        let streak = 0;
        const sortedDates = habitProgress
          .filter((p) => p.completed)
          .map((p) => p.date)
          .sort()
          .reverse();

        for (const dateStr of sortedDates) {
          const date = new Date(dateStr);
          const prevDate = new Date(date);
          prevDate.setDate(prevDate.getDate() - 1);
          const prevDateStr = getDateString(prevDate);

          if (streak === 0) {
            streak = 1;
          } else if (sortedDates.includes(prevDateStr)) {
            streak++;
          } else {
            break;
          }
        }

        return {
          habitId: habit.id,
          completed,
          total,
          rate,
          streak,
        };
      })
      .filter((stat) => stat.total > 0); // Apenas hábitos com atividade no período

    // Destaques do período
    const mostConsistentInPeriod = habitStatsInPeriod.reduce((best, stat) => {
      return stat.streak > (best?.streak || 0) ? stat : best;
    }, habitStatsInPeriod[0]);

    const bestCompletionInPeriod = habitStatsInPeriod.reduce((best, stat) => {
      return stat.rate > (best?.rate || 0) ? stat : best;
    }, habitStatsInPeriod[0]);

    return {
      completedCount,
      totalCount,
      completionRate,
      categoryStats,
      periodProgress,
      habitStatsInPeriod,
      mostConsistentInPeriod,
      bestCompletionInPeriod,
    };
  }, [
    filteredProgress,
    habits,
    startDateStr,
    endDateStr,
    dateRange.startDate,
    dateRange.endDate,
    selectedDayTimestamp,
    calendarView,
    selectedDayKey, // Adiciona selectedDayKey para forçar recálculo
  ]);

  return periodStats;
}

