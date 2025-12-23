"use client"

import { cn } from "@/lib/utils/cn"
import { Heart, Activity, XCircle, CheckSquare } from "lucide-react"
import type { HabitCategory } from "@/lib/types/habit"
import { memo, useMemo } from "react"

interface CategoryStatsProps {
  category: HabitCategory
  count: number
  completed: number
  total: number
}

const CATEGORY_CONFIG = {
  bons: {
    label: "Bons Hábitos",
    icon: Heart,
    color: "#10b981",
    bgColor: "#064e3b",
  },
  saude: {
    label: "Saúde",
    icon: Activity,
    color: "#06b6d4",
    bgColor: "#164e63",
  },
  maus: {
    label: "Maus Hábitos",
    icon: XCircle,
    color: "#ef4444",
    bgColor: "#7f1d1d",
  },
  tarefas: {
    label: "Tarefas",
    icon: CheckSquare,
    color: "#f59e0b",
    bgColor: "#78350f",
  },
}

export const CategoryStats = memo(function CategoryStats({ category, count, completed, total }: CategoryStatsProps) {
  const config = CATEGORY_CONFIG[category]
  const Icon = config.icon
  // Memoiza cálculo de completionRate
  const completionRate = useMemo(
    () => total > 0 ? Math.round((completed / total) * 100) : 0,
    [completed, total]
  )

  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)] hover:bg-white/8 transition-all">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon className="h-5 w-5" style={{ color: config.color }} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{config.label}</h3>
          <p className="text-xs text-white/40">{count} hábitos</p>
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold",
            completionRate >= 80
              ? "bg-emerald-500/20 text-emerald-400"
              : completionRate >= 50
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400",
          )}
        >
          {completionRate}%
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${completionRate}%`,
              backgroundColor: config.color,
            }}
          />
        </div>
        <span className="text-xs text-white/60">
          {completed}/{total}
        </span>
      </div>
    </div>
  )
})

