"use client"

import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/atoms/badge"
import type { HabitWithProgress } from "@/lib/types/habit"
import { useHabitProgress } from "@/lib/hooks/use-habit-progress"
import { Check, X, Clock, Timer, Flame } from "lucide-react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface HabitCardProps {
  habit: HabitWithProgress
  onClick: () => void
  onComplete: () => void
  onUndo: () => void
}

export function HabitCard({ habit, onClick, onComplete, onUndo }: HabitCardProps) {
  const { progress } = useHabitProgress(habit)
  const isCompleted = progress.isCompleted
  const IconComponent = (LucideIcons as any)[habit.icon] as LucideIcon || LucideIcons.Circle

  const getIcon = () => {
    if (habit.habitType === "timer") return <Clock className="h-4 w-4 text-white/60" />
    if (habit.habitType === "pomodoro") return <Timer className="h-4 w-4 text-white/60" />
    return null
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl p-4 transition-all",
        "backdrop-blur-xl border shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]",
        "hover:scale-[1.02] hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.35)] active:scale-[0.98] cursor-pointer",
      )}
      style={{ 
        backgroundColor: habit.color + "20",
        borderColor: habit.color + "30"
      }}
      onClick={onClick}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-lg border"
        style={{ 
          backgroundColor: habit.backgroundColor || habit.color + "30",
          borderColor: habit.color + "40"
        }}
      >
        <IconComponent className="h-6 w-6" style={{ color: habit.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{habit.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {getIcon()}
          <p className="text-sm text-white/60">{progress.text}</p>
          {habit.streak > 0 && (
            <Badge variant="warning" className="text-xs flex items-center gap-1">
              <Flame className="h-3 w-3" /> {habit.streak}
            </Badge>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          if (isCompleted) {
            onUndo()
          } else {
            onComplete()
          }
        }}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-all backdrop-blur-lg border",
          isCompleted 
            ? "bg-white/20 text-white border-white/30 shadow-lg" 
            : "bg-white/8 text-white/40 border-white/12 hover:bg-white/20 hover:text-white hover:border-white/25",
        )}
      >
        {isCompleted ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>
    </div>
  )
}
