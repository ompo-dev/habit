"use client";

import { motion } from "framer-motion";
import { BarChart3, Flame, CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/atoms/badge";
import type { Habit } from "@/lib/types/habit";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HabitStat {
  habitId: string;
  completed: number;
  total: number;
  rate: number;
  streak: number;
}

interface StatisticsHabitStatsSectionProps {
  habitStats: HabitStat[];
  habits: Habit[];
}

export function StatisticsHabitStatsSection({
  habitStats,
  habits,
}: StatisticsHabitStatsSectionProps) {
  if (habitStats.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Por Hábito no Período
      </h2>
      <div className="flex flex-col gap-3">
        {habitStats
          .sort((a, b) => b.rate - a.rate)
          .map((stat, index) => {
            const habit = habits.find((h) => h.id === stat.habitId);
            if (!habit) return null;

            const IconComponent =
              ((LucideIcons as any)[habit.icon] as LucideIcon) ||
              LucideIcons.Circle;
            const isHighRate = stat.rate >= 80;
            const isMediumRate = stat.rate >= 50;

            return (
              <motion.div
                key={stat.habitId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl p-4",
                  "backdrop-blur-xl border transition-all duration-300"
                )}
                style={{
                  backgroundColor: isHighRate
                    ? habit.color + "30"
                    : habit.color + "20",
                  borderColor: isHighRate
                    ? habit.color + "50"
                    : habit.color + "30",
                }}
              >
                {/* Ícone do hábito */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-lg border transition-all duration-300"
                  style={{
                    backgroundColor: isHighRate
                      ? habit.color + "40"
                      : habit.backgroundColor || habit.color + "30",
                    borderColor: isHighRate
                      ? habit.color + "60"
                      : habit.color + "40",
                  }}
                  aria-hidden="true"
                >
                  <IconComponent
                    className="h-6 w-6"
                    style={{ color: habit.color }}
                  />
                </div>

                {/* Informações do hábito */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <h3
                      className={cn(
                        "font-semibold text-white truncate transition-opacity duration-300"
                      )}
                    >
                      {habit.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Completos */}
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white/60" />
                      <span className="text-sm text-white/60">
                        <span className="font-semibold text-white">
                          {stat.completed}
                        </span>
                        <span className="text-white/40">/{stat.total}</span>
                      </span>
                    </div>

                    {/* Streak */}
                    {stat.streak > 0 && (
                      <Badge
                        variant="warning"
                        className="text-xs flex items-center gap-1"
                      >
                        <Flame className="h-3 w-3" />
                        {stat.streak}
                      </Badge>
                    )}

                    {/* Categoria */}
                    <span className="text-xs text-white/40 capitalize">
                      {habit.category}
                    </span>
                  </div>
                </div>

                {/* Indicador visual de progresso */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg
                      className="w-14 h-14 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-white/10"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${stat.rate}, 100`}
                        className={cn(
                          isHighRate
                            ? "text-emerald-400"
                            : isMediumRate
                            ? "text-yellow-400"
                            : "text-red-400"
                        )}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isHighRate
                            ? "text-emerald-400"
                            : isMediumRate
                            ? "text-yellow-400"
                            : "text-red-400"
                        )}
                      >
                        {stat.rate}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
