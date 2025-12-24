"use client";

import { Suspense } from "react";
import { WeeklyCalendar } from "@/components/organisms/weekly-calendar";
import { MonthCalendar } from "@/components/molecules/month-calendar";
import { YearOverview } from "@/components/molecules/year-overview";
import type { CalendarView } from "@/lib/hooks/use-search-params";

interface StatisticsCalendarSectionProps {
  calendarView: CalendarView;
}

export function StatisticsCalendarSection({
  calendarView,
}: StatisticsCalendarSectionProps) {
  return (
    <div className="mb-6">
      <Suspense
        fallback={
          <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        }
      >
        {calendarView === "week" && <WeeklyCalendar />}
        {calendarView === "month" && <MonthCalendar />}
        {calendarView === "year" && <YearOverview />}
      </Suspense>
    </div>
  );
}

