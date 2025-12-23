"use client"

import { cn } from "@/lib/utils/cn"
import { useHabitsStore } from "@/lib/stores/habits-store"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export function MonthCalendar() {
  const { progress, habits, currentDate, setCurrentDate } = useHabitsStore()
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1))
  }

  const getDayCompletionRate = (day: number): number => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayProgress = progress.filter((p) => p.date === dateString)
    const totalHabits = habits.length

    if (totalHabits === 0) return 0

    const completedCount = dayProgress.filter((p) => p.completed).length
    return (completedCount / totalHabits) * 100
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const completionRate = getDayCompletionRate(day)
    const date = new Date(year, month, day)
    const isToday = date.toDateString() === new Date().toDateString()
    const isSelected = date.toDateString() === currentDate.toDateString()

    days.push(
      <button
        key={day}
        onClick={() => setCurrentDate(date)}
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-lg text-sm font-medium transition-all",
          completionRate === 100 && "bg-primary/80 text-white",
          completionRate > 0 && completionRate < 100 && "bg-primary/40 text-white",
          completionRate === 0 && "text-white/40 hover:bg-white/5",
          isToday && "ring-2 ring-primary",
          isSelected && "ring-2 ring-white/40",
        )}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={goToPreviousMonth} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-white">
          {monthNames[month]} {year}
        </h3>
        <button onClick={goToNextMonth} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
          <div key={i} className="flex items-center justify-center text-xs font-medium text-white/50">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  )
}
