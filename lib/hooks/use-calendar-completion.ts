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
  }, [date, habits, progress]);

  return completionData;
}

