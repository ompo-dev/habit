"use client";

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
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {views.map((v) => (
        <button
          key={v.value}
          onClick={() => onViewChange(v.value)}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-medium transition-all backdrop-blur-xl border shadow-lg",
            view === v.value
              ? "bg-primary text-white border-primary/40"
              : "bg-white/5 text-white/60 hover:bg-white/10 border-white/10"
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

