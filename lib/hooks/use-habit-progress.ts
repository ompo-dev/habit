import { useMemo } from "react";
import type { HabitWithProgress, Habit } from "@/lib/types/habit";

/**
 * Hook para calcular e formatar progresso de um hábito
 */
export function useHabitProgress(habit: HabitWithProgress | null) {
  const progress = useMemo(() => {
    if (!habit) {
      return {
        text: "",
        current: 0,
        target: 1,
        percentage: 0,
        isCompleted: false,
      };
    }

    if (habit.habitType === "counter") {
      const currentCount = habit.progress?.count || 0;
      const showCount = habit.targetCount > 1;
      return {
        text: showCount ? `${currentCount}/${habit.targetCount}` : "Cada dia",
        current: currentCount,
        target: habit.targetCount,
        percentage: (currentCount / habit.targetCount) * 100,
        isCompleted: habit.progress?.completed || false,
      };
    } else if (habit.habitType === "timer") {
      const currentMinutes = habit.progress?.minutesSpent || 0;
      const targetMinutes = habit.targetMinutes || 0;
      return {
        text: `${currentMinutes}/${targetMinutes} min`,
        current: currentMinutes,
        target: targetMinutes,
        percentage: targetMinutes > 0 ? (currentMinutes / targetMinutes) * 100 : 0,
        isCompleted: habit.progress?.completed || false,
      };
    } else if (habit.habitType === "pomodoro") {
      const currentSessions = habit.progress?.pomodoroSessions || 0;
      return {
        text: `${currentSessions}/${habit.targetCount} sessões`,
        current: currentSessions,
        target: habit.targetCount,
        percentage: (currentSessions / habit.targetCount) * 100,
        isCompleted: habit.progress?.completed || false,
      };
    }

    return {
      text: "Cada dia",
      current: 0,
      target: 1,
      percentage: 0,
      isCompleted: false,
    };
  }, [habit]);

  const getSubtitle = (): string => {
    if (!habit) return "";
    
    if (habit.habitType === "counter") {
      const currentCount = habit.progress?.count || 0;
      return `${
        habit.frequency === "daily" ? "Cada dia" : "Semanal"
      }, ${currentCount}/${habit.targetCount}`;
    } else if (habit.habitType === "timer") {
      const currentMinutes = habit.progress?.minutesSpent || 0;
      return `Timer: ${currentMinutes}/${habit.targetMinutes} minutos`;
    } else if (habit.habitType === "pomodoro") {
      const currentSessions = habit.progress?.pomodoroSessions || 0;
      return `Pomodoro: ${currentSessions}/${habit.targetCount} sessões`;
    }
    return "";
  };

  return {
    progress,
    getSubtitle,
  };
}

