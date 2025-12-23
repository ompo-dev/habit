"use client"

import { cn } from "@/lib/utils/cn"
import { useHabitsStore } from "@/lib/stores/habits-store"

export function YearOverview() {
  const { progress, habits } = useHabitsStore()
  const currentYear = new Date().getFullYear()

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  const getMonthCompletionRate = (month: number): number => {
    const monthProgress = progress.filter((p) => {
      const date = new Date(p.date)
      return date.getFullYear() === currentYear && date.getMonth() === month
    })

    if (monthProgress.length === 0) return 0

    const completedCount = monthProgress.filter((p) => p.completed).length
    return (completedCount / monthProgress.length) * 100
  }

  const getMonthStats = (month: number) => {
    const monthProgress = progress.filter((p) => {
      const date = new Date(p.date)
      return date.getFullYear() === currentYear && date.getMonth() === month && p.completed
    })
    return monthProgress.length
  }

  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
      <h3 className="mb-4 text-lg font-bold text-white">{currentYear}</h3>
      <div className="grid grid-cols-3 gap-3">
        {monthNames.map((name, index) => {
          const rate = getMonthCompletionRate(index)
          const count = getMonthStats(index)

          return (
            <div
              key={name}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl p-4 transition-all backdrop-blur-sm border",
                rate >= 80 && "bg-primary/80 border-primary/40",
                rate >= 50 && rate < 80 && "bg-primary/50 border-primary/30",
                rate >= 20 && rate < 50 && "bg-primary/20 border-primary/20",
                rate < 20 && "bg-white/5 border-white/10",
              )}
            >
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-white/60">{name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
