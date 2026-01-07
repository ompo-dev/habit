"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { getDateString } from "@/lib/utils/date-helpers";
import { getStartOfWeek, addDays } from "@/lib/utils/date-helpers";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { MonthCaptionProps } from "react-day-picker";

export type SporadicType = "day" | "week" | "month";

interface PeriodSelectorProps {
  isSporadic: boolean;
  sporadicType?: SporadicType;
  sporadicStartDate?: Date;
  sporadicEndDate?: Date;
  onSporadicChange: (isSporadic: boolean) => void;
  onTypeChange: (type: SporadicType) => void;
  onDatesChange: (startDate: Date, endDate: Date) => void;
}

export function PeriodSelector({
  isSporadic,
  sporadicType = "day",
  sporadicStartDate,
  sporadicEndDate,
  onSporadicChange,
  onTypeChange,
  onDatesChange,
}: PeriodSelectorProps) {
  // Para modo "day": usa single date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    sporadicStartDate || new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    sporadicStartDate || new Date()
  );

  // Para modo "week" e "month": usa date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    sporadicStartDate && sporadicEndDate
      ? {
          from: sporadicStartDate,
          to: sporadicEndDate,
        }
      : sporadicType !== "day" && sporadicStartDate
      ? {
          from: sporadicStartDate,
          to: undefined,
        }
      : undefined
  );
  const [currentMonthRange, setCurrentMonthRange] = useState<Date>(
    sporadicStartDate || new Date()
  );

  // Atualiza o mês atual quando as props mudam
  useEffect(() => {
    if (sporadicStartDate) {
      setCurrentMonth(sporadicStartDate);
      setCurrentMonthRange(sporadicStartDate);
    }
  }, [sporadicStartDate]);

  // Calcula o período baseado no tipo selecionado
  const periodDates = useMemo(() => {
    if (sporadicType === "day") {
      if (!selectedDate) return null;
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      return { start, end: new Date(start) };
    } else {
      if (!dateRange?.from || !dateRange?.to) return null;
      const start = new Date(dateRange.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }, [selectedDate, dateRange, sporadicType]);

  // Atualiza as datas quando o período muda (modo day)
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);

    onDatesChange(start, end);
  };

  // Atualiza as datas quando o range muda (modo week/month)
  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from && range?.to) {
      const start = new Date(range.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(range.to);
      end.setHours(23, 59, 59, 999);
      onDatesChange(start, end);
    } else if (range?.from) {
      // Ainda selecionando (só from definido)
      const start = new Date(range.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      onDatesChange(start, end);
    }
  };

  // Atualiza quando o tipo muda
  const handleTypeChange = (type: SporadicType) => {
    // Se clicou em "Personalizado", usa "week" como tipo interno (permite range)
    const internalType = type === "day" ? "day" : "week";
    onTypeChange(internalType);

    // Reseta as seleções quando muda o tipo
    if (type === "day") {
      const today = new Date();
      setSelectedDate(today);
      setDateRange(undefined);
      handleDateSelect(today);
    } else {
      // Personalizado: usa range
      setSelectedDate(undefined);
      if (sporadicStartDate && sporadicEndDate) {
        const range: DateRange = {
          from: sporadicStartDate,
          to: sporadicEndDate,
        };
        setDateRange(range);
        handleRangeSelect(range);
      } else {
        // Inicializa sem range para permitir seleção livre do primeiro dia
        setDateRange(undefined);
        // Não chama handleRangeSelect aqui para não definir datas ainda
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Tipo: Esporádico ou Permanente */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Tipo de Hábito
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSporadicChange(false)}
            className={cn(
              "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
              !isSporadic
                ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            Permanente
          </button>
          <button
            onClick={() => onSporadicChange(true)}
            className={cn(
              "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
              isSporadic
                ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            Esporádico
          </button>
        </div>
      </div>

      {/* Se esporádico, mostra opções de período */}
      {isSporadic && (
        <>
          {/* Tipo de Período */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Período
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTypeChange("day")}
                className={cn(
                  "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
                  sporadicType === "day"
                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                )}
              >
                1 dia
              </button>
              <button
                onClick={() => handleTypeChange("week")}
                className={cn(
                  "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
                  sporadicType === "week" || sporadicType === "month"
                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                )}
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Calendário para selecionar período */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white block">
              {sporadicType === "day"
                ? "Selecione o dia"
                : "Selecione o período personalizado"}
            </Label>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-center">
              {sporadicType === "day" ? (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md"
                  components={{
                    MonthCaption: ({
                      calendarMonth,
                      ...props
                    }: MonthCaptionProps) => {
                      const displayMonth = calendarMonth.date;
                      const monthName = displayMonth.toLocaleDateString(
                        "pt-BR",
                        {
                          month: "long",
                        }
                      );
                      const year = displayMonth.getFullYear();
                      return (
                        <div className="w-full pt-1 pb-2" {...props}>
                          <div className="flex items-center w-full relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const prevMonth = new Date(displayMonth);
                                prevMonth.setMonth(prevMonth.getMonth() - 1);
                                setCurrentMonth(prevMonth);
                              }}
                              className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-md p-0 opacity-70 hover:opacity-100 text-white transition-all flex items-center justify-center shrink-0 z-10"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-white capitalize absolute left-1/2 -translate-x-1/2 z-0">
                              {monthName} {year}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const nextMonth = new Date(displayMonth);
                                nextMonth.setMonth(nextMonth.getMonth() + 1);
                                setCurrentMonth(nextMonth);
                              }}
                              className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-md p-0 opacity-70 hover:opacity-100 text-white transition-all flex items-center justify-center shrink-0 ml-auto z-10"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    },
                  }}
                  formatters={{
                    formatWeekdayName: (date) => {
                      const weekdays = [
                        "Dom",
                        "Seg",
                        "Ter",
                        "Qua",
                        "Qui",
                        "Sex",
                        "Sáb",
                      ];
                      return weekdays[date.getDay()];
                    },
                  }}
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "hidden",
                    caption_label: "hidden",
                    nav: "hidden",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-white/10 rounded-md"
                    ),
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-white/10 text-white font-semibold",
                    day_outside:
                      "day-outside text-white/30 opacity-50 aria-selected:bg-white/5 aria-selected:text-white/30 aria-selected:opacity-30",
                    day_disabled: "text-white/20 opacity-50",
                    day_range_middle:
                      "aria-selected:bg-white/10 aria-selected:text-white",
                    day_hidden: "invisible",
                  }}
                />
              ) : (
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleRangeSelect}
                  month={currentMonthRange}
                  onMonthChange={setCurrentMonthRange}
                  numberOfMonths={1}
                  className="rounded-md"
                  components={{
                    MonthCaption: ({
                      calendarMonth,
                      ...props
                    }: MonthCaptionProps) => {
                      const displayMonth = calendarMonth.date;
                      const monthName = displayMonth.toLocaleDateString(
                        "pt-BR",
                        {
                          month: "long",
                        }
                      );
                      const year = displayMonth.getFullYear();
                      return (
                        <div
                          className="flex items-center justify-center gap-2 pt-1 pb-2"
                          {...props}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const prevMonth = new Date(displayMonth);
                              prevMonth.setMonth(prevMonth.getMonth() - 1);
                              setCurrentMonthRange(prevMonth);
                            }}
                            className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-md p-0 opacity-70 hover:opacity-100 text-white transition-all flex items-center justify-center"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium text-white capitalize">
                            {monthName} {year}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const nextMonth = new Date(displayMonth);
                              nextMonth.setMonth(nextMonth.getMonth() + 1);
                              setCurrentMonthRange(nextMonth);
                            }}
                            className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-md p-0 opacity-70 hover:opacity-100 text-white transition-all flex items-center justify-center"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    },
                  }}
                  formatters={{
                    formatWeekdayName: (date) => {
                      const weekdays = [
                        "Dom",
                        "Seg",
                        "Ter",
                        "Qua",
                        "Qui",
                        "Sex",
                        "Sáb",
                      ];
                      return weekdays[date.getDay()];
                    },
                  }}
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "hidden",
                    caption_label: "hidden",
                    nav: "hidden",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-white/10 rounded-md"
                    ),
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-white/10 text-white font-semibold",
                    day_outside:
                      "day-outside text-white/30 opacity-50 aria-selected:bg-white/5 aria-selected:text-white/30 aria-selected:opacity-30",
                    day_disabled: "text-white/20 opacity-50",
                    day_range_middle:
                      "aria-selected:bg-white/10 aria-selected:text-white",
                    day_hidden: "invisible",
                  }}
                />
              )}
            </div>

            {/* Mostra o período selecionado */}
            {periodDates && (
              <div className="text-sm text-white/60 bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {sporadicType === "day" && (
                      <>
                        {periodDates.start.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </>
                    )}
                    {sporadicType === "week" && (
                      <>
                        {periodDates.start.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {periodDates.end.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                    {sporadicType === "month" && (
                      <>
                        {periodDates.start.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {periodDates.end.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
