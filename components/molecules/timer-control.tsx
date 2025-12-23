"use client"

import { useState, useEffect, useRef, memo, useMemo } from "react"
import { cn } from "@/lib/utils/cn"
import { Play, Pause, RotateCcw } from "lucide-react"

interface TimerControlProps {
  targetMinutes: number
  currentMinutes: number
  color: string
  onUpdate: (minutes: number) => void
}

export const TimerControl = memo(function TimerControl({ targetMinutes, currentMinutes, color, onUpdate }: TimerControlProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Memoiza cálculos
  const totalSeconds = useMemo(() => targetMinutes * 60, [targetMinutes])
  const elapsedSeconds = useMemo(() => currentMinutes * 60 + seconds, [currentMinutes, seconds])
  const progress = useMemo(() => Math.min((elapsedSeconds / totalSeconds) * 100, 100), [elapsedSeconds, totalSeconds])
  const isCompleted = elapsedSeconds >= totalSeconds

  useEffect(() => {
    if (isRunning && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev + 1 >= 60) {
            onUpdate(currentMinutes + 1)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isCompleted, currentMinutes, onUpdate])

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
    onUpdate(0)
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg className="h-64 w-64 -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-white/10"
          />
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 112}`}
            strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-white" aria-label={`Tempo decorrido: ${formatTime(elapsedSeconds)}`}>{formatTime(elapsedSeconds)}</span>
          <span className="text-sm text-white/60 mt-2">
            Meta: {targetMinutes} {targetMinutes === 1 ? "minuto" : "minutos"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={isCompleted}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            "transition-all hover:scale-110",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          style={{ backgroundColor: color }}
          aria-label={isRunning ? "Pausar timer" : "Iniciar timer"}
          type="button"
        >
          {isRunning ? <Pause className="h-8 w-8 text-white" aria-hidden="true" /> : <Play className="h-8 w-8 text-white ml-1" aria-hidden="true" />}
        </button>

        <button
          onClick={handleReset}
          disabled={currentMinutes === 0 && seconds === 0}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-white/10 text-white transition-all hover:bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          )}
          aria-label="Resetar timer"
          type="button"
        >
          <RotateCcw className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
});
