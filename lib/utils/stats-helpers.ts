export interface DayStats {
  date: string
  completions: number
  totalHabits: number
  percentage: number
}

export interface WeekStats {
  weekNumber: number
  completions: number
  totalHabits: number
  percentage: number
}

export interface MonthStats {
  month: string
  completions: number
  totalHabits: number
  percentage: number
}

export interface HabitStats {
  habitId: string
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number
  lastCompleted?: Date
  firstCompleted?: Date
  averagePerWeek: number
}

export function calculateHabitStats(
  habitId: string,
  progress: Array<{ habitId: string; date: string; completed: boolean; completedAt?: Date }>,
  createdAt: Date | string, // Accept both Date and string
): HabitStats {
  const habitProgress = progress
    .filter((p) => p.habitId === habitId && p.completed)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (habitProgress.length === 0) {
    return {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
      averagePerWeek: 0,
    }
  }

  // Current streak
  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(today)

  while (true) {
    const dateString = checkDate.toISOString().split("T")[0]
    const hasProgress = habitProgress.find((p) => p.date === dateString)

    if (hasProgress) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Longest streak
  let longestStreak = 0
  let tempStreak = 0
  const sortedDates = habitProgress.map((p) => new Date(p.date)).sort((a, b) => a.getTime() - b.getTime())

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const diff = Math.floor((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  const creationDate = typeof createdAt === "string" ? new Date(createdAt) : createdAt

  // Completion rate
  const daysSinceCreation = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const completionRate = (habitProgress.length / daysSinceCreation) * 100

  // Average per week
  const weeksSinceCreation = daysSinceCreation / 7
  const averagePerWeek = habitProgress.length / weeksSinceCreation

  return {
    habitId,
    currentStreak,
    longestStreak,
    totalCompletions: habitProgress.length,
    completionRate: Math.round(completionRate),
    lastCompleted: habitProgress[0].completedAt,
    firstCompleted: habitProgress[habitProgress.length - 1].completedAt,
    averagePerWeek: Math.round(averagePerWeek * 10) / 10,
  }
}

export function getDailyStats(
  progress: Array<{ date: string; completed: boolean }>,
  startDate: Date,
  endDate: Date,
): DayStats[] {
  const stats: DayStats[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0]
    const dayProgress = progress.filter((p) => p.date === dateString)
    const completions = dayProgress.filter((p) => p.completed).length
    const totalHabits = dayProgress.length

    stats.push({
      date: dateString,
      completions,
      totalHabits,
      percentage: totalHabits > 0 ? Math.round((completions / totalHabits) * 100) : 0,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return stats
}

export function getInsights(
  progress: Array<{ date: string; completed: boolean; habitId: string }>,
  habits: Array<{ id: string; title: string; createdAt: Date }>,
): string[] {
  const insights: string[] = []

  // Best day of week
  const dayCompletions: { [key: number]: number } = {}
  progress
    .filter((p) => p.completed)
    .forEach((p) => {
      const day = new Date(p.date).getDay()
      dayCompletions[day] = (dayCompletions[day] || 0) + 1
    })

  const bestDay = Object.entries(dayCompletions).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  if (bestDay) {
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    insights.push(`Seu melhor dia da semana é ${dayNames[Number(bestDay[0])]}`)
  }

  // Most consistent habit
  const habitCompletions: { [key: string]: number } = {}
  progress
    .filter((p) => p.completed)
    .forEach((p) => {
      habitCompletions[p.habitId] = (habitCompletions[p.habitId] || 0) + 1
    })

  const mostConsistent = Object.entries(habitCompletions).sort((a, b) => b[1] - a[1])[0]
  if (mostConsistent) {
    const habit = habits.find((h) => h.id === mostConsistent[0])
    if (habit) {
      insights.push(`"${habit.title}" é seu hábito mais consistente`)
    }
  }

  // Recent improvement
  const last7Days = progress.filter((p) => {
    const date = new Date(p.date)
    const today = new Date()
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return diff <= 7 && p.completed
  })

  const previous7Days = progress.filter((p) => {
    const date = new Date(p.date)
    const today = new Date()
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 7 && diff <= 14 && p.completed
  })

  if (last7Days.length > previous7Days.length) {
    const improvement = Math.round(((last7Days.length - previous7Days.length) / previous7Days.length) * 100)
    insights.push(`Você melhorou ${improvement}% na última semana`)
  }

  return insights
}
