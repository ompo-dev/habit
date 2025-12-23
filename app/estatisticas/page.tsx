"use client";
import {
  ArrowLeft,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { StatCard } from "@/components/molecules/stat-card";
import { HabitStatsList } from "@/components/organisms/habit-stats-list";
import { ProgressChart } from "@/components/molecules/progress-chart";
import { CategoryStats } from "@/components/molecules/category-stats";
import {
  useHabitData,
  useHabitStatistics,
  useProgressData,
} from "@/lib/hooks/use-habit-data";
import type { HabitCategory } from "@/lib/types/habit";

export default function EstatisticasPage() {
  useHabitData(); // Carrega dados mock
  const statistics = useHabitStatistics();
  const { last7DaysProgress } = useProgressData();
  const { habits } = useHabitsStore();

  const {
    totalStreak,
    completionRateToday,
    statsByCategory,
    thisWeekCompletions,
    thisMonthCompletions,
    mostConsistent,
    bestCompletion,
  } = statistics;

  return (
    <div 
      className="bg-background"
      style={{ paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <header
        className="sticky top-0 z-30 border-b border-white/10 bg-background/95 backdrop-blur-lg"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) - 18px)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Quick Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-400" />}
            label="Streak Total"
            value={totalStreak}
            color="bg-orange-500/20"
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-emerald-400" />}
            label="Taxa Hoje"
            value={`${completionRateToday}%`}
            color="bg-emerald-500/20"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
            label="Esta Semana"
            value={thisWeekCompletions}
            color="bg-blue-500/20"
          />
          <StatCard
            icon={<Calendar className="h-5 w-5 text-purple-400" />}
            label="Este Mês"
            value={thisMonthCompletions}
            color="bg-purple-500/20"
          />
        </div>

        {/* Destaques */}
        {(mostConsistent || bestCompletion) && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-white">Destaques</h2>
            <div className="grid grid-cols-1 gap-3">
              {mostConsistent && (
                <div className="rounded-2xl bg-linear-to-r from-orange-500/20 to-red-500/20 p-4 border border-orange-500/30 backdrop-blur-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-orange-400" />
                    <h3 className="font-semibold text-white">
                      Mais Consistente
                    </h3>
                  </div>
                  <p className="text-white/80">
                    {habits.find((h) => h.id === mostConsistent.habitId)?.title}
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    {mostConsistent.currentStreak} dias de sequência
                  </p>
                </div>
              )}
              {bestCompletion && (
                <div className="rounded-2xl bg-linear-to-r from-emerald-500/20 to-cyan-500/20 p-4 border border-emerald-500/30 backdrop-blur-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">
                      Melhor Performance
                    </h3>
                  </div>
                  <p className="text-white/80">
                    {habits.find((h) => h.id === bestCompletion.habitId)?.title}
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    {bestCompletion.completionRate}% de conclusão
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progresso da Semana */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Últimos 7 Dias</h2>
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <ProgressChart data={last7DaysProgress} />
          </div>
        </div>

        {/* Estatísticas por Categoria */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-white">Por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(statsByCategory).map(([category, stats]) => (
              <CategoryStats
                key={category}
                category={category as HabitCategory}
                count={stats.count}
                completed={stats.completed}
                total={stats.total}
              />
            ))}
          </div>
        </div>

        {/* Habit Stats */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Por Hábito
          </h2>
          <HabitStatsList />
        </div>
      </main>
    </div>
  );
}
