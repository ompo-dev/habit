"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CalendarViewToggle } from "@/components/molecules/calendar-view-toggle";
import type { CalendarView } from "@/lib/hooks/use-search-params";

interface StatisticsHeaderProps {
  calendarView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function StatisticsHeader({
  calendarView,
  onViewChange,
}: StatisticsHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-white/10 bg-background/95 backdrop-blur-lg"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) - 18px)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
      </div>

      {/* Controles de visualização do calendário */}
      <div className="mx-auto max-w-lg px-6 pb-3">
        <CalendarViewToggle view={calendarView} onViewChange={onViewChange} />
      </div>
    </header>
  );
}

