/**
 * API Layer - Simula chamadas de API com delay
 * Futuramente será substituída por chamadas reais
 */

import type { Habit, Progress, CreateHabitDTO, UpdateHabitDTO, HabitGroup, CreateGroupDTO } from "@/lib/types/habit"

// Simula delay de rede
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Simula taxa de erro (desabilitado em produção)
const shouldFail = () => false // Math.random() < 0.1

export class HabitsAPI {
  // Hábitos
  static async getHabits(): Promise<Habit[]> {
    await delay(300)
    if (shouldFail()) throw new Error("Falha ao buscar hábitos")
    
    // Retorna do localStorage ou mock
    const stored = localStorage.getItem("habits-storage")
    if (stored) {
      const data = JSON.parse(stored)
      return data.state.habits || []
    }
    return []
  }

  static async createHabit(data: CreateHabitDTO): Promise<Habit> {
    await delay(400)
    if (shouldFail()) throw new Error("Falha ao criar hábito")
    
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      order: 999, // Will be set by store
    }
    
    return newHabit
  }

  static async updateHabit(id: string, data: UpdateHabitDTO): Promise<Habit> {
    await delay(350)
    if (shouldFail()) throw new Error("Falha ao atualizar hábito")
    
    // Simula retorno do servidor
    const stored = localStorage.getItem("habits-storage")
    if (stored) {
      const storeData = JSON.parse(stored)
      const habit = storeData.state.habits.find((h: Habit) => h.id === id)
      if (habit) {
        return { ...habit, ...data }
      }
    }
    
    throw new Error("Hábito não encontrado")
  }

  static async deleteHabit(id: string): Promise<void> {
    await delay(300)
    if (shouldFail()) throw new Error("Falha ao deletar hábito")
    
    // Simula sucesso
    return
  }

  static async reorderHabits(habits: Habit[]): Promise<Habit[]> {
    await delay(250)
    if (shouldFail()) throw new Error("Falha ao reordenar hábitos")
    
    return habits
  }

  // Progresso
  static async getProgress(): Promise<Progress[]> {
    await delay(300)
    if (shouldFail()) throw new Error("Falha ao buscar progresso")
    
    const stored = localStorage.getItem("habits-storage")
    if (stored) {
      const data = JSON.parse(stored)
      return data.state.progress || []
    }
    return []
  }

  static async markComplete(habitId: string, date: Date, count: number): Promise<Progress> {
    await delay(200)
    if (shouldFail()) throw new Error("Falha ao marcar como completo")
    
    const dateString = date.toISOString().split('T')[0]
    
    return {
      id: crypto.randomUUID(),
      habitId,
      date: dateString,
      count,
      completed: true,
      completedAt: new Date(),
    }
  }

  static async updateTimer(habitId: string, date: Date, minutesSpent: number): Promise<Progress> {
    await delay(200)
    if (shouldFail()) throw new Error("Falha ao atualizar timer")
    
    const dateString = date.toISOString().split('T')[0]
    
    return {
      id: crypto.randomUUID(),
      habitId,
      date: dateString,
      count: 1,
      minutesSpent,
      completed: false,
    }
  }

  static async updatePomodoro(habitId: string, date: Date, sessions: number): Promise<Progress> {
    await delay(200)
    if (shouldFail()) throw new Error("Falha ao atualizar pomodoro")
    
    const dateString = date.toISOString().split('T')[0]
    
    return {
      id: crypto.randomUUID(),
      habitId,
      date: dateString,
      count: sessions,
      pomodoroSessions: sessions,
      completed: false,
    }
  }

  // Grupos
  static async getGroups(): Promise<HabitGroup[]> {
    await delay(200)
    if (shouldFail()) throw new Error("Falha ao buscar grupos")
    
    const stored = localStorage.getItem("habits-storage")
    if (stored) {
      const data = JSON.parse(stored)
      return data.state.groups || []
    }
    return []
  }

  static async createGroup(data: CreateGroupDTO): Promise<HabitGroup> {
    await delay(300)
    if (shouldFail()) throw new Error("Falha ao criar grupo")
    
    return {
      id: crypto.randomUUID(),
      ...data,
      order: 999,
    }
  }

  static async updateGroup(id: string, data: Partial<CreateGroupDTO>): Promise<HabitGroup> {
    await delay(250)
    if (shouldFail()) throw new Error("Falha ao atualizar grupo")
    
    const stored = localStorage.getItem("habits-storage")
    if (stored) {
      const storeData = JSON.parse(stored)
      const group = storeData.state.groups.find((g: HabitGroup) => g.id === id)
      if (group) {
        return { ...group, ...data }
      }
    }
    
    throw new Error("Grupo não encontrado")
  }

  static async deleteGroup(id: string): Promise<void> {
    await delay(200)
    if (shouldFail()) throw new Error("Falha ao deletar grupo")
    
    return
  }
}

