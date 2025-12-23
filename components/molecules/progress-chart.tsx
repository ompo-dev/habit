"use client"

import { cn } from "@/lib/utils/cn"

interface ProgressChartProps {
  data: Array<{
    date: string
    completed: number
    total: number
  }>
  className?: string
}

export function ProgressChart({ data, className }: ProgressChartProps) {
  const maxValue = Math.max(...data.map((d) => d.total), 1)

  return (
    <div className={cn("flex items-end justify-between gap-1", className)}>
      {data.map((item, index) => {
        const height = item.total > 0 ? (item.completed / maxValue) * 100 : 0
        const completionRate = item.total > 0 ? (item.completed / item.total) * 100 : 0
        const dayName = new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short' })

        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative w-full h-24 flex items-end">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  completionRate >= 80
                    ? "bg-emerald-500"
                    : completionRate >= 50
                      ? "bg-yellow-500"
                      : completionRate > 0
                        ? "bg-red-500"
                        : "bg-white/10",
                )}
                style={{ height: `${Math.max(height, 5)}%` }}
              >
                {item.completed > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white/90">{item.completed}</span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-white/40 capitalize">{dayName}</span>
          </div>
        )
      })}
    </div>
  )
}

