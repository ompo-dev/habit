"use client";

import { Suspense, lazy, memo } from "react";
import {
  Plus,
  Flame,
  Download,
  Upload,
  Trash2,
  Database,
  Target,
  Calendar,
  BarChart3,
  TrendingUp,
  FolderPlus,
} from "lucide-react";
import { ClientProviders } from "./client-providers";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useUIStore } from "@/lib/stores/ui-store";
import {
  useHabitData,
  useHabitStatistics,
  useProgressData,
} from "@/lib/hooks/use-habit-data";
import { useHydratedValue } from "@/lib/hooks/use-hydration";
import {
  useCalendarView,
  useSelectedDay,
  useGroupTemplatesModal,
  useHabitTemplatesModal,
} from "@/lib/hooks/use-search-params";
import { useSettingsActions } from "@/lib/hooks/use-settings-actions";
import React from "react";
import { Swapper } from "@/components/organisms/swapper";
import type { HabitCategory } from "@/lib/types/habit";

// Lazy loading de componentes pesados para melhorar performance inicial
const WeeklyCalendar = lazy(() =>
  import("@/components/organisms/weekly-calendar").then((m) => ({
    default: m.WeeklyCalendar,
  }))
);
const HabitList = lazy(() =>
  import("@/components/organisms/habit-list").then((m) => ({
    default: m.HabitList,
  }))
);
const HabitModal = lazy(() =>
  import("@/components/organisms/habit-modal").then((m) => ({
    default: m.HabitModal,
  }))
);
const TemplatesModal = lazy(() =>
  import("@/components/organisms/templates-modal").then((m) => ({
    default: m.TemplatesModal,
  }))
);
const HabitCreationModal = lazy(() =>
  import("@/components/organisms/habit-creation-modal").then((m) => ({
    default: m.HabitCreationModal,
  }))
);
const GroupTemplatesModal = lazy(() =>
  import("@/components/organisms/group-templates-modal").then((m) => ({
    default: m.GroupTemplatesModal,
  }))
);
const GroupCreationModal = lazy(() =>
  import("@/components/organisms/group-creation-modal").then((m) => ({
    default: m.GroupCreationModal,
  }))
);
const MonthCalendar = lazy(() =>
  import("@/components/molecules/month-calendar").then((m) => ({
    default: m.MonthCalendar,
  }))
);
const YearOverview = lazy(() =>
  import("@/components/molecules/year-overview").then((m) => ({
    default: m.YearOverview,
  }))
);
const StatCard = lazy(() =>
  import("@/components/molecules/stat-card").then((m) => ({
    default: m.StatCard,
  }))
);
const HabitStatsList = lazy(() =>
  import("@/components/organisms/habit-stats-list").then((m) => ({
    default: m.HabitStatsList,
  }))
);
const ProgressChart = lazy(() =>
  import("@/components/molecules/progress-chart").then((m) => ({
    default: m.ProgressChart,
  }))
);
const CategoryStats = lazy(() =>
  import("@/components/molecules/category-stats").then((m) => ({
    default: m.CategoryStats,
  }))
);
const DateHeader = lazy(() =>
  import("@/components/molecules/date-header").then((m) => ({
    default: m.DateHeader,
  }))
);
const CalendarViewToggle = lazy(() =>
  import("@/components/molecules/calendar-view-toggle").then((m) => ({
    default: m.CalendarViewToggle,
  }))
);
const HighlightsSection = lazy(() =>
  import("@/components/molecules/highlights-section").then((m) => ({
    default: m.HighlightsSection,
  }))
);
const SettingsSection = lazy(() =>
  import("@/components/molecules/settings-section").then((m) => ({
    default: m.SettingsSection,
  }))
);

export default function HomePage() {
  useHabitData(); // Carrega dados mock automaticamente

  return (
    <ClientProviders>
      <div
        className="bg-background"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <Suspense
          fallback={
            <div
              className="flex items-center justify-center h-screen"
              role="status"
              aria-label="Carregando aplicação"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Swapper>
            <HabitsTab />
            <StatisticsTab />
            <SettingsTab />
          </Swapper>
        </Suspense>

        <Suspense fallback={null}>
          <HabitModal />
          <TemplatesModal />
          <HabitCreationModal />
          <GroupTemplatesModal />
          <GroupCreationModal />
        </Suspense>
      </div>
    </ClientProviders>
  );
}

// Tab de Hábitos - Memoizado para evitar re-renders desnecessários
const HabitsTab = memo(function HabitsTab() {
  const { getTotalStreak } = useHabitsStore();
  const { setSelectedDate } = useUIStore();
  const { open: openGroupTemplatesModal } = useGroupTemplatesModal();
  const { open: openHabitTemplatesModal } = useHabitTemplatesModal();
  const { selectedDay, isToday, goToPreviousDay, goToNextDay, goToToday } =
    useSelectedDay();

  // Previne erro de hidratação - só mostra dados do store após montar no cliente
  const totalStreak = useHydratedValue(() => getTotalStreak(), 0);

  // Sincroniza selectedDay com UIStore para manter compatibilidade
  React.useEffect(() => {
    setSelectedDate(selectedDay);
  }, [selectedDay, setSelectedDate]);

  return (
    <>
      <header
        className="sticky top-0 z-30 bg-background/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_24px_0_rgba(0,0,0,0.3)]"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
        }}
      >
        <div className="border-b border-white/8">
          <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
            <button
              onClick={openGroupTemplatesModal}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10 shadow-lg"
              aria-label="Abrir templates de grupos"
              type="button"
            >
              <FolderPlus className="h-5 w-5" aria-hidden="true" />
            </button>

            <DateHeader
              date={selectedDay}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
              showTodayButton={!isToday}
            />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-bold text-orange-500">{totalStreak}</span>
              </div>

              <button
                onClick={openHabitTemplatesModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg"
                aria-label="Criar novo hábito"
                type="button"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendário Semanal - Dentro do Header Sticky */}
        <div className="mx-auto max-w-lg px-2 py-4 border-b border-white/8">
          <WeeklyCalendar />
        </div>
      </header>

      <main
        className="mx-auto max-w-lg px-6 py-6 pb-24"
        role="main"
        aria-label="Lista de hábitos"
      >
        <div>
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center py-8"
                role="status"
                aria-label="Carregando hábitos"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            }
          >
            <HabitList />
          </Suspense>
        </div>
      </main>
    </>
  );
});

// Tab de Estatísticas - Memoizado para evitar re-renders desnecessários
const StatisticsTab = memo(function StatisticsTab() {
  const statistics = useHabitStatistics();
  const { last7DaysProgress } = useProgressData();
  const { habits } = useHabitsStore();
  const { calendarView, setCalendarView } = useCalendarView();

  const {
    totalStreak,
    completionRateToday,
    statsByCategory,
    thisWeekCompletions,
    thisMonthCompletions,
    mostConsistent,
    bestCompletion,
  } = statistics;

  // Previne erro de hidratação - só mostra dados após montar no cliente
  const hydratedTotalStreak = useHydratedValue(() => totalStreak, 0);
  const hydratedCompletionRate = useHydratedValue(() => completionRateToday, 0);
  const hydratedWeekCompletions = useHydratedValue(
    () => thisWeekCompletions,
    0
  );
  const hydratedMonthCompletions = useHydratedValue(
    () => thisMonthCompletions,
    0
  );

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-white/10 bg-background/95 backdrop-blur-lg"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
        </div>

        {/* Controles de visualização do calendário */}
        <div className="mx-auto max-w-lg px-6 pb-3">
          <CalendarViewToggle
            view={calendarView}
            onViewChange={setCalendarView}
          />
        </div>
      </header>

      <main
        className="mx-auto max-w-lg px-6 py-6 pb-24"
        role="main"
        aria-label="Estatísticas"
      >
        {/* Calendário */}
        <div className="mb-6">
          <Suspense
            fallback={
              <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            {calendarView === "week" && <WeeklyCalendar />}
            {calendarView === "month" && <MonthCalendar />}
            {calendarView === "year" && <YearOverview />}
          </Suspense>
        </div>

        {/* Quick Stats Grid */}
        <div
          className="mb-6 grid grid-cols-2 gap-3"
          role="region"
          aria-label="Estatísticas rápidas"
        >
          <Suspense
            fallback={
              <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            <StatCard
              icon={
                <Flame className="h-5 w-5 text-orange-400" aria-hidden="true" />
              }
              label="Streak Total"
              value={hydratedTotalStreak}
              color="bg-orange-500/20"
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            <StatCard
              icon={
                <Target
                  className="h-5 w-5 text-emerald-400"
                  aria-hidden="true"
                />
              }
              label="Taxa Hoje"
              value={`${hydratedCompletionRate}%`}
              color="bg-emerald-500/20"
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            <StatCard
              icon={
                <TrendingUp
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              }
              label="Esta Semana"
              value={hydratedWeekCompletions}
              color="bg-blue-500/20"
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            <StatCard
              icon={
                <Calendar
                  className="h-5 w-5 text-purple-400"
                  aria-hidden="true"
                />
              }
              label="Este Mês"
              value={hydratedMonthCompletions}
              color="bg-purple-500/20"
            />
          </Suspense>
        </div>

        {/* Destaques */}
        <Suspense
          fallback={
            <div className="h-32 bg-white/5 rounded-2xl animate-pulse mb-6" />
          }
        >
          <HighlightsSection
            mostConsistent={mostConsistent}
            bestCompletion={bestCompletion}
            habits={habits}
          />
        </Suspense>

        {/* Progresso da Semana */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Últimos 7 Dias</h2>
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <Suspense
              fallback={
                <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
              }
            >
              <ProgressChart data={last7DaysProgress} />
            </Suspense>
          </div>
        </div>

        {/* Estatísticas por Categoria */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(statsByCategory).map(([category, stats]) => (
              <CategoryStats
                key={category}
                category={category as HabitCategory}
                count={stats.count}
                completed={stats.completed}
                total={stats.total}
              />
            ))}
          </div>
        </div>

        {/* Habit Stats */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Por Hábito
          </h2>
          <HabitStatsList />
        </div>
      </main>
    </>
  );
});

// Tab de Configurações - Memoizado para evitar re-renders desnecessários
const SettingsTab = memo(function SettingsTab() {
  const {
    handleLoadMockData,
    handleClearData,
    handleExportData,
    handleImportData,
    stats,
  } = useSettingsActions();

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-white/10 bg-background/95 backdrop-blur-lg"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-6 pb-24">
        <div className="flex flex-col gap-4">
          <SettingsSection title="Aparência">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Tema</span>
              <span className="text-white">Escuro</span>
            </div>
          </SettingsSection>

          <SettingsSection title="Notificações">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Lembretes</span>
              <span className="text-white">Desativado</span>
            </div>
          </SettingsSection>

          <SettingsSection title="Desenvolvimento">
            <div className="space-y-3">
              <button
                onClick={handleLoadMockData}
                className="flex w-full items-center gap-3 rounded-lg bg-primary/20 p-3 text-white hover:bg-primary/30 transition-all backdrop-blur-xl border border-primary/30 shadow-lg"
                aria-label="Carregar dados de exemplo"
                type="button"
              >
                <Database className="h-5 w-5" aria-hidden="true" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Carregar dados de exemplo</div>
                  <div className="text-xs text-white/60">
                    Dados de 1 semana com múltiplos hábitos
                  </div>
                </div>
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="Dados">
            <div className="space-y-3">
              <div className="text-sm text-white/60 mb-3">
                {stats.habitsCount} hábitos • {stats.progressCount} registros
              </div>
              <button
                onClick={handleExportData}
                className="flex w-full items-center gap-3 text-left text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-xl"
                aria-label="Exportar dados"
                type="button"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar dados
              </button>
              <button
                onClick={handleImportData}
                className="flex w-full items-center gap-3 text-left text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-xl"
                aria-label="Importar dados"
                type="button"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                Importar dados
              </button>
              <button
                onClick={handleClearData}
                className="flex w-full items-center gap-3 text-left text-red-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 backdrop-blur-xl"
                aria-label="Limpar todos os dados"
                type="button"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Limpar todos os dados
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="">
            <div className="text-center text-white/40 text-sm">
              <p>Habit Builder v1.0.0</p>
              <p className="mt-1">PWA • Next.js 16 • Zustand</p>
            </div>
          </SettingsSection>
        </div>
      </main>
    </>
  );
});
