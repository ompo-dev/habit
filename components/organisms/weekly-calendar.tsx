"use client";

import { cn } from "@/lib/utils/cn";
import {
  getWeekDays,
  getStartOfWeek,
  isSameDay,
  getWeekdayShort,
  getDayOfMonth,
} from "@/lib/utils/date-helpers";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useSelectedDay } from "@/lib/hooks/use-search-params";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export function WeeklyCalendar() {
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const { habits, progress } = useHabitsStore();
  const [weekStart, setWeekStart] = useState(getStartOfWeek(selectedDay));

  // Atualiza weekStart quando selectedDay muda
  useEffect(() => {
    const newWeekStart = getStartOfWeek(selectedDay);
    setWeekStart(newWeekStart);
  }, [selectedDay]);

  const weekDays = getWeekDays(weekStart);
  const today = new Date();

  const getDayCompletionData = (day: Date) => {
    const dateString = day.toISOString().split("T")[0];
    const dayProgress = progress.filter((p) => p.date === dateString);

    if (dayProgress.length === 0)
      return { percentage: 0, status: "no-activity" as const };

    const totalHabits = habits.filter((h) => h.frequency === "daily").length;
    if (totalHabits === 0)
      return { percentage: 0, status: "no-activity" as const };

    const completedCount = dayProgress.filter((p) => p.completed).length;
    const percentage = (completedCount / totalHabits) * 100;

    let status:
      | "no-activity"
      | "not-completed"
      | "partially-completed"
      | "fully-completed";
    if (percentage === 0) status = "not-completed";
    else if (percentage === 100) status = "fully-completed";
    else status = "partially-completed";

    return { percentage, status };
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };


  return (
    <div className="flex items-center justify-between gap-1 sm:gap-3">
      {/* Botão Semana Anterior */}
      <button
        onClick={goToPreviousWeek}
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg"
        aria-label="Semana anterior"
      >
        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      {/* Dias da Semana */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center overflow-x-auto scrollbar-none">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const dayNumber = getDayOfMonth(day);
          const weekday = getWeekdayShort(day, "pt-BR");
          const { percentage, status } = getDayCompletionData(day);

          const isCompleted = status === "fully-completed";
          const isPartial = status === "partially-completed";

          // Calcular o stroke-dashoffset para o ring progressivo
          const radius = 14;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (percentage / 100) * circumference;

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[40px] sm:min-w-[48px] p-2 sm:p-2 rounded-full justify-center",
                "transition-all duration-200 backdrop-blur-xl",
                isSelected && "bg-primary shadow-lg"
              )}
            >
              {/* Dia da Semana */}
              <span
                className={cn(
                  "text-[9px] sm:text-[10px] font-medium uppercase tracking-wide",
                  isSelected ? "text-white" : "text-white/40"
                )}
              >
                {weekday.slice(0, 3)}.
              </span>

              {/* Número do Dia com Ring Progressivo */}
              <div className="relative -ml-1">
                {/* Ring Progressivo SVG */}
                {isPartial && (
                  <svg
                    className="absolute inset-0 -rotate-90"
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r={radius}
                      fill="none"
                      stroke={isSelected ? "white" : "rgb(139, 92, 246)"}
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                )}

                {/* Número */}
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full",
                    "text-xs sm:text-sm font-semibold transition-all duration-200",
                    // Completo
                    isCompleted && !isSelected && "bg-primary text-black",
                    // Completo + Selecionado
                    isCompleted && isSelected && "bg-white text-primary",
                    // Parcial (o ring já está visível)
                    isPartial && !isSelected && "text-white/70",
                    isPartial && isSelected && "text-white",
                    // Normal
                    !isCompleted &&
                      !isPartial &&
                      !isSelected &&
                      "text-white/50",
                    // Normal + Selecionado
                    !isCompleted && !isPartial && isSelected && "text-white"
                  )}
                >
                  <span className="translate-x-[2px] translate-y-[2px]">
                    {dayNumber}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Próxima Semana */}
      <button
        onClick={goToNextWeek}
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg"
        aria-label="Próxima semana"
      >
        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}
