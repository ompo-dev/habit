"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  isSameDay,
  getWeekdayShort,
  getDayOfMonth,
} from "@/lib/utils/date-helpers";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useSelectedDay } from "@/lib/hooks/use-search-params";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useHydration } from "@/lib/hooks/use-hydration";

export function WeeklyCalendar() {
  const isHydrated = useHydration();
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const { habits, progress } = useHabitsStore();

  // Calcula 5 dias sempre com o dia atual centralizado
  const weekDays = useMemo(() => {
    if (!isHydrated) return [];

    const days: Date[] = [];
    // 2 dias antes, dia atual, 2 dias depois = 5 dias total
    for (let i = -2; i <= 2; i++) {
      const date = new Date(selectedDay);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDay, isHydrated]);

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
    // Avança 5 dias para trás (mostra os 5 dias anteriores)
    const newDay = new Date(selectedDay);
    newDay.setDate(newDay.getDate() - 5);
    setSelectedDay(newDay);
  };

  const goToNextWeek = () => {
    // Avança 5 dias para frente (mostra os próximos 5 dias)
    const newDay = new Date(selectedDay);
    newDay.setDate(newDay.getDate() + 5);
    setSelectedDay(newDay);
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-between gap-1 sm:gap-3">
        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {/* Botão Semana Anterior */}
      <motion.button
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToPreviousWeek}
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg mr-2 sm:mr-3"
        aria-label="Semana anterior"
      >
        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </motion.button>

      {/* Dias da Semana */}
      <div className="flex items-center gap-2 sm:gap-3">
        {weekDays.map((day, index) => {
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
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: isSelected
                  ? "rgb(139, 92, 246)"
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[40px] sm:min-w-[48px] p-2 sm:p-2 rounded-full justify-center",
                "backdrop-blur-xl transition-all duration-200",
                isSelected && "shadow-lg"
              )}
            >
              {/* Dia da Semana */}
              <span
                className={cn(
                  "text-[9px] sm:text-[10px] font-medium uppercase tracking-wide transition-colors duration-200",
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
                    className="absolute inset-0 -rotate-90 transition-opacity duration-200"
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
                <motion.div
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-200",
                    "text-xs sm:text-sm font-semibold",
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
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Botão Próxima Semana */}
      <motion.button
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToNextWeek}
        className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg ml-2 sm:ml-3"
        aria-label="Próxima semana"
      >
        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </motion.button>
    </div>
  );
}
