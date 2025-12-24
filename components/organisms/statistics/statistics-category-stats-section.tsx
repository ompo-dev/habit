"use client";

import { CategoryStats } from "@/components/molecules/category-stats";
import type { HabitCategory } from "@/lib/types/habit";

interface CategoryStatsData {
  count: number;
  completed: number;
  total: number;
}

interface StatisticsCategoryStatsSectionProps {
  categoryStats: Record<string, CategoryStatsData>;
}

export function StatisticsCategoryStatsSection({
  categoryStats,
}: StatisticsCategoryStatsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-bold text-white">Por Categoria</h2>
      <div className="space-y-3">
        {Object.entries(categoryStats).map(([category, stats]) => (
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
  );
}

