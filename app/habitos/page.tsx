"use client";

import { Suspense, lazy } from "react";
import { Plus, Flame, FolderPlus } from "lucide-react";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useHydratedValue } from "@/lib/hooks/use-hydration";
import { useHabitData } from "@/lib/hooks/use-habit-data";
import {
  useSelectedDay,
  useGroupTemplatesModal,
  useHabitTemplatesModal,
} from "@/lib/hooks/use-search-params";
import React from "react";

// Lazy loading de componentes pesados
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
const DateHeader = lazy(() =>
  import("@/components/molecules/date-header").then((m) => ({
    default: m.DateHeader,
  }))
);

// Lazy loading de modais
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

function HabitosContent() {
  useHabitData(); // Carrega dados mock automaticamente
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
          paddingTop: "calc(env(safe-area-inset-top, 0px) - 10px)",
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
          <Suspense
            fallback={
              <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            }
          >
            <WeeklyCalendar />
          </Suspense>
        </div>
      </header>

      <main
        className="mx-auto max-w-lg px-6 py-6"
        style={{
          paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))",
        }}
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

      {/* Modais - necessários para funcionar quando acessado diretamente */}
      <Suspense fallback={null}>
        <HabitModal />
        <TemplatesModal />
        <HabitCreationModal />
        <GroupTemplatesModal />
        <GroupCreationModal />
      </Suspense>
    </>
  );
}

export default function HabitosPage() {
  return (
    <Suspense
      fallback={
        <div
          className="bg-background flex items-center justify-center"
          style={{
            height: "100vh",
            paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HabitosContent />
    </Suspense>
  );
}

