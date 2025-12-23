"use client";

import { cn } from "@/lib/utils/cn";
import { Minus, Plus, FastForward, Undo2 } from "lucide-react";

interface CounterControlProps {
  count: number;
  targetCount: number;
  color: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onFastComplete: () => void;
  onUndo: () => void;
}

export function CounterControl({
  count,
  targetCount,
  color,
  onIncrement,
  onDecrement,
  onFastComplete,
  onUndo,
}: CounterControlProps) {
  const progress = Math.min((count / targetCount) * 100, 100);
  const isCompleted = count >= targetCount;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center gap-6">
        {/* Botão Menos - Fora do círculo à esquerda */}
        <button
          onClick={onDecrement}
          disabled={count === 0}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 backdrop-blur-xl border border-white/10 shadow-lg",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Minus className="h-6 w-6" />
        </button>

        {/* Círculo de progresso */}
        <div className="relative">
          <svg className="h-52 w-52 -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="92"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="104"
              cy="104"
              r="92"
              stroke={color}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 92}`}
              strokeDashoffset={`${2 * Math.PI * 92 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-white">{count}</span>
          </div>
        </div>

        {/* Botão Mais - Fora do círculo à direita */}
        <button
          onClick={onIncrement}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "transition-all hover:scale-110"
          )}
          style={{ backgroundColor: color }}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onFastComplete}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "transition-all hover:scale-110"
          )}
          style={{ backgroundColor: color + "40" }}
        >
          <FastForward className="h-6 w-6" style={{ color }} />
        </button>

        <button
          onClick={onUndo}
          disabled={count === 0}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-white/10 text-white transition-all hover:bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Undo2 className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
