export type HabitCategory = "bons" | "saude" | "maus" | "tarefas"

export type HabitFrequency = "daily" | "weekly" | "custom"

export type HabitType = "counter" | "timer" | "pomodoro"

export interface Habit {
  id: string
  title: string
  icon: string // Nome do ícone do Lucide (ex: "Droplet", "Coffee")
  color: string // Cor principal
  backgroundColor?: string // Cor de fundo personalizada
  category: HabitCategory
  frequency: HabitFrequency
  habitType: HabitType
  targetCount: number
  targetMinutes?: number // For timer-based habits
  pomodoroWork?: number // For pomodoro habits (work minutes)
  pomodoroBreak?: number // For pomodoro habits (break minutes)
  description?: string
  createdAt: Date
  order: number
  groupId?: string | null
}

export interface Progress {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  count: number
  completed: boolean
  completedAt?: Date
  minutesSpent?: number // For timer-based habits
  pomodoroSessions?: number // For pomodoro habits
}

export interface HabitWithProgress extends Habit {
  progress: Progress | null
  streak: number
  totalCompletions: number
}

export interface CreateHabitDTO {
  title: string
  icon: string
  color: string
  category: HabitCategory
  frequency: HabitFrequency
  habitType: HabitType
  targetCount: number
  targetMinutes?: number
  pomodoroWork?: number
  pomodoroBreak?: number
  description?: string
  groupId?: string | null
}

export interface UpdateHabitDTO extends Partial<CreateHabitDTO> {
  order?: number
}

export interface HabitTemplate {
  title: string
  icon: string
  color: string
  category: HabitCategory
  frequency: HabitFrequency
  habitType: HabitType
  targetCount: number
  targetMinutes?: number
  pomodoroWork?: number
  pomodoroBreak?: number
  description?: string
}

export interface HabitGroup {
  id: string
  name: string
  icon: string
  color: string
  order: number
}

export interface CreateGroupDTO {
  name: string
  icon: string
  color: string
}

export interface UserSettings {
  theme: "dark" | "light"
  locale: "pt-BR" | "en-US"
  notifications: boolean
  startOfWeek: 0 | 1 // 0 = Sunday, 1 = Monday
}
