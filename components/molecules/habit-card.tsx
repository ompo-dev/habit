"use client"

import { motion, AnimatePresence } from "framer-motion"
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl p-4",
        "backdrop-blur-xl border transition-all duration-300",
        "cursor-pointer"
      )}
      style={{ 
        backgroundColor: isCompleted 
          ? habit.color + "30" 
          : habit.color + "20",
        borderColor: isCompleted 
          ? habit.color + "50" 
          : habit.color + "30"
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${habit.title}, ${isCompleted ? 'completo' : 'não completo'}, ${progress.text}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-lg border transition-all duration-300"
        style={{ 
          backgroundColor: isCompleted
            ? habit.color + "40"
            : habit.backgroundColor || habit.color + "30",
          borderColor: isCompleted
            ? habit.color + "60"
            : habit.color + "40"
        }}
        aria-hidden="true"
      >
        <IconComponent className="h-6 w-6" style={{ color: habit.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-semibold text-white truncate transition-opacity duration-300",
          isCompleted && "opacity-80"
        )}>
          {habit.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {getIcon() && <span aria-hidden="true">{getIcon()}</span>}
          <p className={cn(
            "text-sm transition-opacity duration-300",
            isCompleted ? "text-white/50" : "text-white/60"
          )}>
            {progress.text}
          </p>
          {habit.streak > 0 && (
            <Badge variant="warning" className="text-xs flex items-center gap-1" aria-label={`Sequência de ${habit.streak} dias`}>
              <Flame className="h-3 w-3" aria-hidden="true" /> {habit.streak}
            </Badge>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation()
          if (isCompleted) {
            onUndo()
          } else {
            onComplete()
          }
        }}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 backdrop-blur-lg border",
          isCompleted 
            ? "bg-white/20 text-white border-white/30 shadow-lg" 
            : "bg-white/8 text-white/40 border-white/12 hover:bg-white/20 hover:text-white hover:border-white/25",
        )}
        aria-label={isCompleted ? `Desfazer conclusão de ${habit.title}` : `Marcar ${habit.title} como completo`}
        type="button"
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-6 w-6" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="x"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
