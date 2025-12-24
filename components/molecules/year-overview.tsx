"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useSelectedDay } from "@/lib/hooks/use-search-params";

export function YearOverview() {
  const { progress, habits } = useHabitsStore();
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Obtém o mês da data selecionada
  const selectedMonth = selectedDay.getMonth();

  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const getMonthCompletionData = (month: number) => {
    const monthProgress = progress.filter((p) => {
      const date = new Date(p.date);
      return date.getFullYear() === currentYear && date.getMonth() === month;
    });

    if (monthProgress.length === 0)
      return { percentage: 0, status: "no-activity" as const };

    const totalHabits = habits.filter((h) => h.frequency === "daily").length;
    if (totalHabits === 0)
      return { percentage: 0, status: "no-activity" as const };

    // Calcula a taxa de conclusão baseada nos dias do mês
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const totalPossible = totalHabits * daysInMonth;
    const completedCount = monthProgress.filter((p) => p.completed).length;
    const percentage =
      totalPossible > 0 ? (completedCount / totalPossible) * 100 : 0;

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

  const getMonthStats = (month: number) => {
    const monthProgress = progress.filter((p) => {
      const date = new Date(p.date);
      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === month &&
        p.completed
      );
    });
    return monthProgress.length;
  };

  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
      <h3 className="mb-3 text-base font-bold text-white">{currentYear}</h3>
      <div className="grid grid-cols-4 gap-2 place-items-center">
        {monthNames.map((name, index) => {
          const { percentage, status } = getMonthCompletionData(index);
          const count = getMonthStats(index);
          const isCurrentMonth = index === currentMonth;
          const isSelected = index === selectedMonth;

          const isCompleted = status === "fully-completed";
          const isPartial = status === "partially-completed";

          const handleMonthClick = () => {
            // Define a data para o primeiro dia do mês selecionado
            const selectedDate = new Date(currentYear, index, 1);
            setSelectedDay(selectedDate);
          };

          // Calcular o stroke-dashoffset para o ring progressivo
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (percentage / 100) * circumference;

          return (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMonthClick}
              animate={{
                backgroundColor: isSelected
                  ? "rgb(139, 92, 246)"
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-full px-3.5 py-3 transition-all duration-200 cursor-pointer w-fit h-fit",
                isSelected && "shadow-lg",
                isCurrentMonth && !isSelected && "ring-2 ring-primary/50"
              )}
            >
              {/* Conteúdo com Ring Progressivo */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Ring Progressivo SVG */}
                {isPartial && (
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 transition-opacity duration-200"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="none"
                      stroke={isSelected ? "white" : "rgb(139, 92, 246)"}
                      strokeWidth="2.5"
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
                    width="82"
                    height="82"
                    viewBox="0 0 82 82"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill={isSelected ? "white" : "rgb(139, 92, 246)"}
                      className="transition-all duration-300"
                    />
                  </svg>
                )}

                {/* Conteúdo */}
                <div className="relative flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      "text-xl font-bold transition-colors duration-200",
                      // Selecionado
                      isSelected && isCompleted && "text-primary",
                      isSelected && isPartial && "text-white",
                      isSelected && !isCompleted && !isPartial && "text-white",
                      // Não selecionado
                      !isSelected && isCompleted && "text-white",
                      !isSelected && isPartial && "text-white/90",
                      !isSelected &&
                        !isCompleted &&
                        !isPartial &&
                        "text-white/60"
                    )}
                  >
                    {count}
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-medium transition-colors duration-200",
                      // Selecionado
                      isSelected && isCompleted && "text-white/90",
                      isSelected && isPartial && "text-white/80",
                      isSelected &&
                        !isCompleted &&
                        !isPartial &&
                        "text-white/80",
                      // Não selecionado
                      !isSelected && isCompleted && "text-white/80",
                      !isSelected && isPartial && "text-white/70",
                      !isSelected &&
                        !isCompleted &&
                        !isPartial &&
                        "text-white/50"
                    )}
                  >
                    {name}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
