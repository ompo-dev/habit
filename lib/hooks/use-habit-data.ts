import { useEffect } from "react"
import { useHabitsStore } from "@/lib/stores/habits-store"

/**
 * Hook para carregar e processar dados de hábitos do JSON mock
 * Transforma os dados brutos em objetos tipados e inicializa o store
 */
export function useHabitData() {
  const { habits, loadMockData } = useHabitsStore()

  useEffect(() => {
    // Aguarda um tick para garantir que o persist hydrate já aconteceu
    const timer = setTimeout(() => {
      // Carrega dados mock se ainda não houver hábitos
      if (habits.length === 0) {
        console.log('🔄 Carregando dados mock...')
        loadMockData()
      } else {
        console.log(`✅ ${habits.length} hábitos já carregados`)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [habits.length, loadMockData])

  return {
    isLoaded: habits.length > 0,
    habitsCount: habits.length,
  }
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
  } = useHabitsStore()

  const allStats = getAllHabitsStats()
  const insights = getInsights()
  const totalStreak = getTotalStreak()
  const completionRateToday = getCompletionRateToday()

  // Estatísticas por categoria
  const statsByCategory = habits.reduce((acc, habit) => {
    const category = habit.category
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        completed: 0,
        total: 0,
      }
    }
    acc[category].count++

    const habitProgress = progress.filter((p) => p.habitId === habit.id && p.completed)
    acc[category].completed += habitProgress.length
    acc[category].total += progress.filter((p) => p.habitId === habit.id).length

    return acc
  }, {} as Record<string, { count: number; completed: number; total: number }>)

  // Estatísticas da semana atual
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  const weekProgress = progress.filter((p) => {
    const date = new Date(p.date)
    return date >= startOfWeek && date <= today
  })

  const thisWeekCompletions = weekProgress.filter((p) => p.completed).length
  const thisWeekTotal = weekProgress.length

  // Estatísticas do mês atual
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthProgress = progress.filter((p) => {
    const date = new Date(p.date)
    return date >= startOfMonth && date <= today
  })

  const thisMonthCompletions = monthProgress.filter((p) => p.completed).length
  const thisMonthTotal = monthProgress.length

  // Hábito mais consistente (maior streak)
  const mostConsistent = allStats.reduce((best, stat) => {
    return stat.currentStreak > (best?.currentStreak || 0) ? stat : best
  }, allStats[0])

  // Hábito com melhor taxa de conclusão
  const bestCompletion = allStats.reduce((best, stat) => {
    return stat.completionRate > (best?.completionRate || 0) ? stat : best
  }, allStats[0])

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
  }
}

/**
 * Hook para obter dados de progresso por período
 */
export function useProgressData(habitId?: string) {
  const { progress, habits } = useHabitsStore()

  const habitProgress = habitId
    ? progress.filter((p) => p.habitId === habitId)
    : progress

  // Agrupa progresso por data
  const progressByDate = habitProgress.reduce((acc, p) => {
    if (!acc[p.date]) {
      acc[p.date] = []
    }
    acc[p.date].push(p)
    return acc
  }, {} as Record<string, typeof progress>)

  // Calcula progresso dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const last7DaysProgress = last7Days.map((date) => ({
    date,
    completed: (progressByDate[date] || []).filter((p) => p.completed).length,
    total: (progressByDate[date] || []).length,
  }))

  // Calcula progresso dos últimos 30 dias
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const last30DaysProgress = last30Days.map((date) => ({
    date,
    completed: (progressByDate[date] || []).filter((p) => p.completed).length,
    total: (progressByDate[date] || []).length,
  }))

  return {
    progressByDate,
    last7DaysProgress,
    last30DaysProgress,
    totalProgress: habitProgress.length,
    completedProgress: habitProgress.filter((p) => p.completed).length,
  }
}

