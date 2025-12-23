"use client"

import { useHabitsStore } from "@/lib/stores/habits-store"
import { TrendingUp, Calendar, Target } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

export function HabitStatsList() {
  const { habits, getAllHabitsStats } = useHabitsStore()
  const allStats = getAllHabitsStats()

  if (allStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <span className="text-4xl opacity-50">📊</span>
        <p className="text-sm text-white/40">Nenhum dado ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {allStats.map((stat) => {
        const habit = habits.find((h) => h.id === stat.habitId)
        if (!habit) return null

        const IconComponent = (LucideIcons as any)[habit.icon] as LucideIcon || LucideIcons.Circle

        return (
          <div key={stat.habitId} className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)] hover:bg-white/8 transition-all">
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: habit.backgroundColor || habit.color + "40" }}
              >
                <IconComponent className="h-5 w-5" style={{ color: habit.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{habit.title}</h3>
                <p className="text-xs text-white/40">{habit.category}</p>
              </div>
              <div
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  stat.completionRate >= 80
                    ? "bg-emerald-500/20 text-emerald-400"
                    : stat.completionRate >= 50
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400",
                )}
              >
                {stat.completionRate}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-white/40">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Streak</span>
                </div>
                <p className="text-lg font-bold text-white">{stat.currentStreak}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-white/40">
                  <Target className="h-3 w-3" />
                  <span className="text-xs">Melhor</span>
                </div>
                <p className="text-lg font-bold text-white">{stat.longestStreak}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-white/40">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Total</span>
                </div>
                <p className="text-lg font-bold text-white">{stat.totalCompletions}</p>
              </div>
            </div>

            {stat.averagePerWeek > 0 && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-white/40">
                  Média de <span className="font-semibold text-white">{stat.averagePerWeek}x</span> por semana
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
