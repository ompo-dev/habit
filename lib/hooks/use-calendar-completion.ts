import { useMemo } from "react";
import type { Habit, Progress } from "@/lib/types/habit";

/**
 * Hook para calcular dados de completion de um dia no calendário
 */
export function useCalendarCompletion(
  date: Date,
  habits: Habit[],
  progress: Progress[]
) {
  const completionData = useMemo(() => {
    const dateString = date.toISOString().split("T")[0];
    
    // Normaliza a data para comparação (remove horas)
    const targetDateNormalized = new Date(date);
    targetDateNormalized.setHours(0, 0, 0, 0);
    
    // Filtra hábitos que foram criados antes ou no mesmo dia da data selecionada
    const habitsForDate = habits.filter((habit) => {
      const createdAt = habit.createdAt instanceof Date 
        ? habit.createdAt 
        : new Date(habit.createdAt);
      const createdAtNormalized = new Date(createdAt);
      createdAtNormalized.setHours(0, 0, 0, 0);
      
      // Hábito só conta se foi criado antes ou no mesmo dia da data selecionada
      if (createdAtNormalized > targetDateNormalized) {
        return false;
      }

      // Se é esporádico, verifica se a data está dentro do período
      if (habit.isSporadic && habit.sporadicStartDate && habit.sporadicEndDate) {
        const startDate = habit.sporadicStartDate instanceof Date
          ? habit.sporadicStartDate
          : new Date(habit.sporadicStartDate);
        const endDate = habit.sporadicEndDate instanceof Date
          ? habit.sporadicEndDate
          : new Date(habit.sporadicEndDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return targetDateNormalized >= startDate && targetDateNormalized <= endDate;
      }

      return true;
    });
    
    const dayProgress = progress.filter((p) => p.date === dateString);

    if (dayProgress.length === 0)
      return { percentage: 0, status: "no-activity" as const };

    const totalHabits = habitsForDate.filter((h) => h.frequency === "daily").length;
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
  }, [date, habits, progress]);

  return completionData;
}

