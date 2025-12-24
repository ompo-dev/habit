"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { isSameDay } from "@/lib/utils/date-helpers";
import { useSelectedDay } from "@/lib/hooks/use-search-params";

export function MonthCalendar() {
  const { progress, habits } = useHabitsStore();
  const { selectedDay, setSelectedDay } = useSelectedDay();

  // Usa o mês da data selecionada, não um estado local separado
  const year = selectedDay.getFullYear();
  const month = selectedDay.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDay);
    newDate.setMonth(month - 1);
    setSelectedDay(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDay);
    newDate.setMonth(month + 1);
    setSelectedDay(newDate);
  };

  const getDayCompletionData = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
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

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDay);
    const { percentage, status } = getDayCompletionData(day);

    const isCompleted = status === "fully-completed";
    const isPartial = status === "partially-completed";

    // Calcular o stroke-dashoffset para o ring progressivo
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    days.push(
      <motion.button
        key={day}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedDay(date)}
        animate={{
          backgroundColor: isSelected ? "rgb(139, 92, 246)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex h-fit w-fit p-0.5 items-center justify-center rounded-full transition-all duration-200",
          isSelected && "shadow-lg",
          isToday && !isSelected && "ring-2 ring-primary/50"
        )}
      >
        {/* Número do Dia com Ring Progressivo */}
        <div className="relative flex items-center justify-center">
          {/* Ring Progressivo SVG */}
          {isPartial && (
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 transition-opacity duration-200"
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

          {/* Círculo completo quando 100% concluído */}
          {isCompleted && (
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
              width="38"
              height="38"
              viewBox="0 0 38 38"
            >
              <circle
                cx="18"
                cy="18"
                r={radius}
                fill={isSelected ? "white" : "rgb(139, 92, 246)"}
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
              "relative flex h-8 w-8 items-center justify-center transition-all duration-200",
              "text-xs font-semibold",
              // Completo
              isCompleted && !isSelected && "text-white",
              // Completo + Selecionado
              isCompleted && isSelected && "text-primary",
              // Parcial
              isPartial && !isSelected && "text-white/70",
              isPartial && isSelected && "text-white",
              // Normal
              !isCompleted && !isPartial && !isSelected && "text-white/50",
              // Normal + Selecionado
              !isCompleted && !isPartial && isSelected && "text-white"
            )}
          >
            {day}
          </motion.div>
        </div>
      </motion.button>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousMonth}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        <h3 className="text-lg font-bold text-white">
          {monthNames[month]} {year}
        </h3>
        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextMonth}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-xs font-medium text-white/50"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
