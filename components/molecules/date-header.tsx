"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDateFormatter } from "@/lib/hooks/use-date-format";

interface DateHeaderProps {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
  showTodayButton?: boolean;
  className?: string;
}

export function DateHeader({
  date,
  onPrevious,
  onNext,
  onToday,
  showTodayButton = true,
  className,
}: DateHeaderProps) {
  const { formatDate, isToday } = useDateFormatter();
  const isTodayDate = isToday(date);

  return (
    <div className={`flex flex-col items-center gap-1 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold text-white">
          {isTodayDate ? "Hoje" : formatDate(date)}
        </h1>
        <button
          onClick={onNext}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {!isTodayDate && showTodayButton && onToday && (
        <button
          onClick={onToday}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Voltar para hoje
        </button>
      )}
    </div>
  );
}

