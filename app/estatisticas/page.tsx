"use client";

import { useMemo, useEffect } from "react";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useHabitData, useHabitStatistics } from "@/lib/hooks/use-habit-data";
import { useSelectedDay, useCalendarView } from "@/lib/hooks/use-search-params";
import { useDateRange } from "@/lib/hooks/use-date-range";
import { usePeriodStats } from "@/lib/hooks/use-period-stats";
import { StatisticsHeader } from "@/components/organisms/statistics/statistics-header";
import { StatisticsCalendarSection } from "@/components/organisms/statistics/statistics-calendar-section";
import { StatisticsQuickStats } from "@/components/organisms/statistics/statistics-quick-stats";
import { StatisticsHighlights } from "@/components/organisms/statistics/statistics-highlights";
import { StatisticsProgressChartSection } from "@/components/organisms/statistics/statistics-progress-chart-section";
import { StatisticsCategoryStatsSection } from "@/components/organisms/statistics/statistics-category-stats-section";
import { StatisticsHabitStatsSection } from "@/components/organisms/statistics/statistics-habit-stats-section";

export default function EstatisticasPage() {
  // Log inicial para verificar se o componente está renderizando
  console.log("🚀 EstatisticasPage - Componente renderizado");

  useHabitData(); // Carrega dados mock
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const { calendarView, setCalendarView } = useCalendarView();
  const { habits, progress } = useHabitsStore();

  // Log imediato para verificar valores
  console.log("📊 EstatisticasPage - Valores iniciais:", {
    selectedDay: selectedDay?.toString(),
    selectedDayTime: selectedDay?.getTime(),
    calendarView,
    habitsCount: habits.length,
    progressCount: progress.length,
    urlParams: typeof window !== "undefined" ? window.location.search : "",
  });

  // Serializa a data para garantir reatividade - força recálculo quando muda
  // IMPORTANTE: Usa useMemo para garantir que selectedDayISO muda quando selectedDay muda
  // Compara o timestamp para detectar mudanças mesmo se o objeto Date for o mesmo
  const selectedDayTimestamp = selectedDay?.getTime() || 0;
  const selectedDayISO = useMemo(
    () => {
      const iso = selectedDay?.toISOString().split("T")[0] || "";
      console.log(
        "📅 selectedDayISO calculado:",
        iso,
        "timestamp:",
        selectedDayTimestamp
      );
      return iso;
    },
    [selectedDayTimestamp] // Usa getTime() para detectar mudanças
  );

  const selectedDayKey = useMemo(() => {
    const key = `${selectedDayISO}-${calendarView}`;
    console.log("🔑 selectedDayKey calculado:", key);
    return key;
  }, [selectedDayISO, calendarView]);

  // Debug: log para verificar mudanças e URL
  useEffect(() => {
    console.log("🔄 EstatisticasPage - useEffect executado");
    const urlParams =
      typeof window !== "undefined" ? window.location.search : "";
    const urlDay = urlParams.match(/day=(\d+)/)?.[1];

    console.log("🔄 EstatisticasPage - Mudança detectada:", {
      selectedDayRaw: selectedDay?.toString(),
      selectedDayISO,
      selectedDayYear: selectedDay?.getFullYear(),
      selectedDayMonth: selectedDay?.getMonth()
        ? selectedDay.getMonth() + 1
        : null,
      selectedDayDate: selectedDay?.getDate(),
      calendarView,
      selectedDayKey,
      urlParams,
      urlDay,
      progressCount: progress.length,
      habitsCount: habits.length,
    });
  }, [
    selectedDayISO,
    calendarView,
    selectedDayKey,
    progress.length,
    habits.length,
    selectedDayTimestamp,
  ]);

  // Calcula o período baseado na view e data selecionada
  // Passa selectedDayISO para garantir reatividade
  const dateRange = useDateRange(selectedDay, calendarView, selectedDayISO);

  // Calcula estatísticas do período
  const selectedDayTimestampForStats = selectedDay.getTime();
  const periodStats = usePeriodStats(
    habits,
    progress,
    dateRange,
    selectedDayTimestampForStats,
    calendarView,
    selectedDayKey // Passa selectedDayKey para forçar recálculo
  );

  // Estatísticas gerais (para streak total)
  const statistics = useHabitStatistics();

  return (
    <div
      className="bg-background"
      style={{ paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <StatisticsHeader
        calendarView={calendarView}
        onViewChange={setCalendarView}
      />

      <main className="mx-auto max-w-lg px-6 py-6" key={selectedDayKey}>
        <StatisticsCalendarSection calendarView={calendarView} />

        {/* Quick Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatisticsQuickStats
            key={`quick-stats-${selectedDayKey}`}
            calendarView={calendarView}
            periodStats={periodStats}
            totalStreak={statistics.totalStreak}
          />
        </div>

        <StatisticsHighlights
          key={`highlights-${selectedDayKey}`}
          calendarView={calendarView}
          mostConsistent={periodStats.mostConsistentInPeriod}
          bestCompletion={periodStats.bestCompletionInPeriod}
          habits={habits}
        />

        <StatisticsProgressChartSection
          key={`progress-${selectedDayKey}`}
          calendarView={calendarView}
          dateRange={dateRange}
          periodProgress={periodStats.periodProgress}
        />

        <StatisticsCategoryStatsSection
          key={`category-${selectedDayKey}`}
          categoryStats={periodStats.categoryStats}
        />

        <StatisticsHabitStatsSection
          key={`habit-stats-${selectedDayKey}`}
          habitStats={periodStats.habitStatsInPeriod}
          habits={habits}
        />
      </main>
    </div>
  );
}
