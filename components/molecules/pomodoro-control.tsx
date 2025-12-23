"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

interface PomodoroControlProps {
  targetSessions: number;
  currentSessions: number;
  workMinutes: number;
  breakMinutes: number;
  color: string;
  onUpdate: (sessions: number) => void;
}

type PomodoroPhase = "work" | "break";

export function PomodoroControl({
  targetSessions,
  currentSessions,
  workMinutes,
  breakMinutes,
  color,
  onUpdate,
}: PomodoroControlProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhaseMinutes = phase === "work" ? workMinutes : breakMinutes;
  const totalSeconds = currentPhaseMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const isCompleted = currentSessions >= targetSessions;

  useEffect(() => {
    if (isRunning && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === "work") {
              onUpdate(currentSessions + 1);
              setPhase("break");
              setIsRunning(false);
              return breakMinutes * 60;
            } else {
              setPhase("work");
              setIsRunning(false);
              return workMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isRunning,
    isCompleted,
    phase,
    workMinutes,
    breakMinutes,
    currentSessions,
    onUpdate,
  ]);

  const handleReset = () => {
    setIsRunning(false);
    setPhase("work");
    setTimeLeft(workMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
            stroke={phase === "work" ? color : "#10B981"}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 112}`}
            strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            {phase === "work" ? (
              <span className="text-2xl">💼</span>
            ) : (
              <Coffee className="h-6 w-6 text-green-500" />
            )}
          </div>
          <span className="text-6xl font-bold text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-white/60 mt-2">
            {phase === "work" ? "Trabalho" : "Descanso"} • {currentSessions}/
            {targetSessions}
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
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ backgroundColor: phase === "work" ? color : "#10B981" }}
        >
          {isRunning ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </button>

        <button
          onClick={handleReset}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-white/10 text-white transition-all hover:bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg"
          )}
        >
          <RotateCcw className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: targetSessions }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-8 rounded-full transition-all",
              i < currentSessions ? "bg-primary" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
