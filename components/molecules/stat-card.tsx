import { cn } from "@/lib/utils/cn"
import type { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
  className?: string
}

export function StatCard({ icon, label, value, trend, color = "bg-primary/20", className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl p-4 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]", color, className)}>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] backdrop-blur-lg border border-white/[0.12]">{icon}</div>
        {trend && (
          <div
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400",
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="mt-1 text-sm text-white/60">{label}</div>
      </div>
    </div>
  )
}
