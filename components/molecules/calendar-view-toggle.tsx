"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type CalendarView = "week" | "month" | "year";

interface CalendarViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  className?: string;
}

export function CalendarViewToggle({
  view,
  onViewChange,
  className,
}: CalendarViewToggleProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "year", label: "Ano" },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl bg-white/5 p-1.5 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {views.map((v) => {
        const isSelected = view === v.value;

        return (
          <motion.button
            key={v.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewChange(v.value)}
            animate={{
              backgroundColor: isSelected
                ? "rgba(139, 92, 246, 0.8)"
                : "transparent",
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex-1 rounded-xl py-2 px-3 text-sm font-semibold transition-all duration-200 backdrop-blur-sm",
              isSelected
                ? "text-white shadow-lg"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            )}
          >
            {v.label}
          </motion.button>
        );
      })}
    </div>
  );
}
