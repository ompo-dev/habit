"use client";

import { useMemo } from "react";
import type { CalendarView } from "./use-search-params";
import { getStartOfWeek } from "@/lib/utils/date-helpers";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useDateRange(
  selectedDay: Date,
  calendarView: CalendarView,
  selectedDayISO?: string // Recebe selectedDayISO como parâmetro para garantir reatividade
): DateRange {
  // Usa o selectedDayISO passado ou calcula a partir do selectedDay
  const dayISO = selectedDayISO || selectedDay.toISOString().split("T")[0];
  const selectedDayTimestamp = selectedDay.getTime();
  
  // Calcula o período baseado na view e data selecionada
  const dateRange = useMemo(() => {
    // Reconstrói a data a partir da string ISO para garantir consistência
    const selectedDate = new Date(dayISO + "T00:00:00");
    selectedDate.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    if (calendarView === "week") {
      // Semana: apenas o dia selecionado
      startDate = new Date(selectedDate);
      endDate = new Date(selectedDate);
    } else if (calendarView === "month") {
      // Mês: domingo da semana do dia selecionado até o dia selecionado
      // getStartOfWeek com startOfWeek = 0 retorna o domingo (0 = domingo)
      startDate = getStartOfWeek(selectedDate, 0); // Domingo da semana
      endDate = new Date(selectedDate); // Até o dia selecionado
    } else {
      // Ano: todo o mês do dia selecionado
      startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );
    }

    // Debug: log para verificar o período calculado
    if (process.env.NODE_ENV === "development") {
      console.log("📅 DateRange calculado:", {
        selectedDayISO: dayISO,
        calendarView,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        selectedDateYear: selectedDate.getFullYear(),
        selectedDateMonth: selectedDate.getMonth(),
        selectedDateDay: selectedDate.getDate(),
        selectedDateWeekday: selectedDate.getDay(), // 0 = domingo, 6 = sábado
      });
    }

    return { startDate, endDate };
  }, [dayISO, calendarView, selectedDayTimestamp]);

  return dateRange;
}

