import { useEffect, useMemo, useRef } from "react";
import { useHabitsStore } from "@/lib/stores/habits-store";

/**
 * Hook para carregar e processar dados de hábitos do JSON mock
 * Transforma os dados brutos em objetos tipados e inicializa o store
 */
const MOCK_DATA_LOADED_KEY = "habits-mock-data-loaded";

export function useHabitData() {
  const { habits, loadMockData } = useHabitsStore();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Evita carregar múltiplas vezes
    if (hasLoadedRef.current) return;
    
    // Aguarda um tick para garantir que o persist hydrate já aconteceu
    const timer = setTimeout(() => {
      // Verifica se os dados mock já foram carregados alguma vez
      const mockDataAlreadyLoaded =
        localStorage.getItem(MOCK_DATA_LOADED_KEY) === "true";

      // Carrega dados mock apenas se:
      // 1. Não houver hábitos
      // 2. Os dados mock NÃO foram carregados anteriormente (primeira vez)
      if (habits.length === 0 && !mockDataAlreadyLoaded) {
        hasLoadedRef.current = true;
        console.log("🔄 Carregando dados mock pela primeira vez...");
        loadMockData(); // A função loadMockData já define a flag no localStorage
      } else if (habits.length > 0) {
        hasLoadedRef.current = true;
        console.log(`✅ ${habits.length} hábitos já carregados`);
      } else {
        hasLoadedRef.current = true;
        console.log(
          "⏭️ Pulando carregamento automático (dados mock já foram carregados ou foram limpos)"
        );
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [habits.length]); // Removido loadMockData da dependência para evitar re-renders

  return {
    isLoaded: habits.length > 0,
    habitsCount: habits.length,
  };
}

/**
 * Hook para obter estatísticas agregadas dos hábitos
 */
export function useHabitStatistics() {
  const {
    habits,
    progress,
    getAllHabitsStats,
    getInsights,
    getTotalStreak,
    getCompletionRateToday,
  } = useHabitsStore();

  // Memoiza cálculos pesados para evitar recálculos desnecessários
  // Usa habits e progress como dependências pois as funções do store são estáveis
  const allStats = useMemo(
    () => getAllHabitsStats(),
    [habits, progress, getAllHabitsStats]
  );
  const insights = useMemo(
    () => getInsights(),
    [habits, progress, getInsights]
  );
  const totalStreak = useMemo(
    () => getTotalStreak(),
    [habits, progress, getTotalStreak]
  );
  const completionRateToday = useMemo(
    () => getCompletionRateToday(),
    [habits, progress, getCompletionRateToday]
  );

  // Estatísticas por categoria - memoizado
  const statsByCategory = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const category = habit.category;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          completed: 0,
          total: 0,
        };
      }
      acc[category].count++;

      const habitProgress = progress.filter(
        (p) => p.habitId === habit.id && p.completed
      );
      acc[category].completed += habitProgress.length;
      acc[category].total += progress.filter(
        (p) => p.habitId === habit.id
      ).length;

      return acc;
    }, {} as Record<string, { count: number; completed: number; total: number }>);
  }, [habits, progress]);

  // Estatísticas da semana atual - memoizado
  const { thisWeekCompletions, thisWeekTotal } = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekProgress = progress.filter((p) => {
      const date = new Date(p.date);
      return date >= startOfWeek && date <= today;
    });

    return {
      thisWeekCompletions: weekProgress.filter((p) => p.completed).length,
      thisWeekTotal: weekProgress.length,
    };
  }, [progress]);

  // Estatísticas do mês atual - memoizado
  const { thisMonthCompletions, thisMonthTotal } = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthProgress = progress.filter((p) => {
      const date = new Date(p.date);
      return date >= startOfMonth && date <= today;
    });

    return {
      thisMonthCompletions: monthProgress.filter((p) => p.completed).length,
      thisMonthTotal: monthProgress.length,
    };
  }, [progress]);

  // Hábito mais consistente (maior streak) - memoizado
  const mostConsistent = useMemo(() => {
    return allStats.reduce((best, stat) => {
      return stat.currentStreak > (best?.currentStreak || 0) ? stat : best;
    }, allStats[0]);
  }, [allStats]);

  // Hábito com melhor taxa de conclusão - memoizado
  const bestCompletion = useMemo(() => {
    return allStats.reduce((best, stat) => {
      return stat.completionRate > (best?.completionRate || 0) ? stat : best;
    }, allStats[0]);
  }, [allStats]);

  return {
    totalHabits: habits.length,
    totalStreak,
    completionRateToday,
    insights,
    statsByCategory,
    thisWeekCompletions,
    thisWeekTotal,
    thisMonthCompletions,
    thisMonthTotal,
    mostConsistent,
    bestCompletion,
    allStats,
  };
}

/**
 * Hook para obter dados de progresso por período
 */
export function useProgressData(habitId?: string) {
  const { progress, habits } = useHabitsStore();

  // Memoiza habitProgress para evitar recálculos
  const habitProgress = useMemo(() => {
    return habitId ? progress.filter((p) => p.habitId === habitId) : progress;
  }, [progress, habitId]);

  // Agrupa progresso por data - memoizado
  const progressByDate = useMemo(() => {
    return habitProgress.reduce((acc, p) => {
      if (!acc[p.date]) {
        acc[p.date] = [];
      }
      acc[p.date].push(p);
      return acc;
    }, {} as Record<string, typeof progress>);
  }, [habitProgress]);

  // Calcula progresso dos últimos 7 dias - memoizado
  const last7DaysProgress = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => ({
      date,
      completed: (progressByDate[date] || []).filter((p) => p.completed).length,
      total: (progressByDate[date] || []).length,
    }));
  }, [progressByDate]);

  // Calcula progresso dos últimos 30 dias - memoizado
  const last30DaysProgress = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last30Days.map((date) => ({
      date,
      completed: (progressByDate[date] || []).filter((p) => p.completed).length,
      total: (progressByDate[date] || []).length,
    }));
  }, [progressByDate]);

  // Memoiza totais
  const { totalProgress, completedProgress } = useMemo(
    () => ({
      totalProgress: habitProgress.length,
      completedProgress: habitProgress.filter((p) => p.completed).length,
    }),
    [habitProgress]
  );

  return {
    progressByDate,
    last7DaysProgress,
    last30DaysProgress,
    totalProgress,
    completedProgress,
  };
}
