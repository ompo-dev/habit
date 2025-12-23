import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Habit,
  Progress,
  CreateHabitDTO,
  UpdateHabitDTO,
  HabitWithProgress,
  HabitGroup,
  CreateGroupDTO,
} from "@/lib/types/habit";
import {
  combineHabitWithProgress,
  getDateString,
} from "@/lib/utils/habit-helpers";
import {
  calculateHabitStats,
  getInsights,
  type HabitStats,
} from "@/lib/utils/stats-helpers";
import { HabitsAPI } from "@/lib/api/habits-api";
import { toast } from "sonner";

interface HabitsState {
  // Estado
  habits: Habit[];
  progress: Progress[];
  selectedHabitId: string | null;
  isLoading: boolean;
  currentDate: Date;
  groups: HabitGroup[];
  skipAutoLoad: boolean; // Flag para pular carregamento automático de dados mock

  // Estado de sincronização
  isSyncing: boolean;
  lastSync: Date | null;
  pendingOperations: number;

  // Habit CRUD com optimistic updates
  addHabit: (habit: CreateHabitDTO) => Promise<void>;
  updateHabit: (id: string, data: UpdateHabitDTO) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  reorderHabits: (habits: Habit[]) => Promise<void>;

  // Selection
  selectHabit: (id: string | null) => void;
  getHabitById: (id: string) => Habit | undefined;

  // Progress com optimistic updates
  markComplete: (habitId: string, date: Date, count?: number) => Promise<void>;
  undoComplete: (habitId: string, date: Date) => Promise<void>;
  getProgressForDate: (habitId: string, date: Date) => Progress | null;
  updateTimer: (
    habitId: string,
    date: Date,
    minutesSpent: number
  ) => Promise<void>;
  updatePomodoro: (
    habitId: string,
    date: Date,
    sessions: number
  ) => Promise<void>;

  // Computed
  getHabitsWithProgress: (date?: Date) => HabitWithProgress[];
  getHabitWithProgress: (id: string) => HabitWithProgress | undefined;

  getHabitStats: (habitId: string) => HabitStats | null;
  getAllHabitsStats: () => HabitStats[];
  getInsights: () => string[];
  getTotalStreak: () => number;
  getCompletionRateToday: () => number;

  // Date Navigation
  setCurrentDate: (date: Date) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;

  // Groups com optimistic updates
  addGroup: (group: CreateGroupDTO) => Promise<void>;
  updateGroup: (id: string, data: Partial<CreateGroupDTO>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  getGroupById: (id: string) => HabitGroup | undefined;
  getHabitsByGroup: (groupId: string | null) => HabitWithProgress[];
  assignHabitToGroup: (
    habitId: string,
    groupId: string | null
  ) => Promise<void>;

  // Mock Data
  loadMockData: () => void;

  // Import/Export
  importData: (data: {
    habits: Habit[];
    progress: Progress[];
    groups?: HabitGroup[];
  }) => void;

  // Clear Data
  clearAllData: () => void;

  // Sync
  syncWithServer: () => Promise<void>;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      progress: [],
      selectedHabitId: null,
      isLoading: false,
      currentDate: new Date(),
      groups: [],
      isSyncing: false,
      lastSync: null,
      pendingOperations: 0,
      skipAutoLoad: false,

      // OPTIMISTIC UPDATE: Adicionar hábito
      addHabit: async (habitData) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticHabit: Habit = {
          id: tempId,
          ...habitData,
          createdAt: new Date(),
          order: get().habits.length,
        };

        // Update otimista
        set((state) => ({
          habits: [...state.habits, optimisticHabit],
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          const serverHabit = await HabitsAPI.createHabit(habitData);

          // Substitui o temp com o real
          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === tempId ? serverHabit : h
            ),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.success("Hábito criado com sucesso!");
        } catch (error) {
          // Rollback em caso de erro
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== tempId),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao criar hábito. Tente novamente.");
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Atualizar hábito
      updateHabit: async (id, data) => {
        const previousHabit = get().habits.find((h) => h.id === id);
        if (!previousHabit) return;

        // Update otimista
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...data } : h
          ),
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          await HabitsAPI.updateHabit(id, data);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.success("Hábito atualizado!");
        } catch (error) {
          // Rollback
          set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? previousHabit : h)),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao atualizar hábito");
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Deletar hábito
      deleteHabit: async (id) => {
        const previousState = {
          habit: get().habits.find((h) => h.id === id),
          progress: get().progress.filter((p) => p.habitId === id),
        };

        if (!previousState.habit) return;

        // Update otimista
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          progress: state.progress.filter((p) => p.habitId !== id),
          selectedHabitId:
            state.selectedHabitId === id ? null : state.selectedHabitId,
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          await HabitsAPI.deleteHabit(id);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.success("Hábito excluído");
        } catch (error) {
          // Rollback
          set((state) => ({
            habits: [...state.habits, previousState.habit!],
            progress: [...state.progress, ...previousState.progress],
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao excluir hábito");
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Reordenar hábitos
      reorderHabits: async (habits) => {
        const previousHabits = get().habits;

        set({
          habits,
          pendingOperations: get().pendingOperations + 1,
        });

        try {
          await HabitsAPI.reorderHabits(habits);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          set({
            habits: previousHabits,
            pendingOperations: get().pendingOperations - 1,
          });

          toast.error("Erro ao reordenar hábitos");
          throw error;
        }
      },

      selectHabit: (id) => {
        set({ selectedHabitId: id });
      },

      getHabitById: (id) => {
        return get().habits.find((h) => h.id === id);
      },

      // OPTIMISTIC UPDATE: Marcar como completo
      markComplete: async (habitId, date, count = 1) => {
        const dateString = getDateString(date);
        const habit = get().getHabitById(habitId);
        if (!habit) return;

        const existingProgress = get().progress.find(
          (p) => p.habitId === habitId && p.date === dateString
        );

        const newCount = (existingProgress?.count || 0) + count;
        const completed =
          habit.habitType === "counter"
            ? newCount >= habit.targetCount
            : habit.habitType === "timer"
            ? (existingProgress?.minutesSpent || 0) >=
              (habit.targetMinutes || 0)
            : (existingProgress?.pomodoroSessions || 0) >= habit.targetCount;

        // Update otimista
        if (existingProgress) {
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? {
                    ...p,
                    count: newCount,
                    completed,
                    completedAt: completed ? new Date() : p.completedAt,
                  }
                : p
            ),
            pendingOperations: state.pendingOperations + 1,
          }));
        } else {
          const tempProgress: Progress = {
            id: `temp-${Date.now()}`,
            habitId,
            date: dateString,
            count,
            completed,
            completedAt: completed ? new Date() : undefined,
          };

          set((state) => ({
            progress: [...state.progress, tempProgress],
            pendingOperations: state.pendingOperations + 1,
          }));
        }

        try {
          await HabitsAPI.markComplete(habitId, date, count);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          // Rollback seria complexo aqui, apenas mostra erro
          toast.error("Erro ao salvar progresso");
          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
          throw error;
        }
      },

      undoComplete: async (habitId, date) => {
        const dateString = getDateString(date);

        set((state) => {
          const existingProgress = state.progress.find(
            (p) => p.habitId === habitId && p.date === dateString
          );

          if (!existingProgress || existingProgress.count === 0) return state;

          const newCount = existingProgress.count - 1;

          if (newCount === 0) {
            return {
              progress: state.progress.filter(
                (p) => p.id !== existingProgress.id
              ),
            };
          }

          const habit = get().getHabitById(habitId);
          const completed = habit ? newCount >= habit.targetCount : false;

          return {
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? {
                    ...p,
                    count: newCount,
                    completed,
                    completedAt: completed ? p.completedAt : undefined,
                  }
                : p
            ),
          };
        });
      },

      getProgressForDate: (habitId, date) => {
        const dateString = getDateString(date);
        return (
          get().progress.find(
            (p) => p.habitId === habitId && p.date === dateString
          ) || null
        );
      },

      // OPTIMISTIC UPDATE: Timer
      updateTimer: async (habitId, date, minutesSpent) => {
        const dateString = getDateString(date);
        const habit = get().getHabitById(habitId);
        if (!habit || habit.habitType !== "timer") return;

        const existingProgress = get().progress.find(
          (p) => p.habitId === habitId && p.date === dateString
        );
        const completed = minutesSpent >= (habit.targetMinutes || 0);

        // Update otimista
        if (existingProgress) {
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? {
                    ...p,
                    minutesSpent,
                    completed,
                    completedAt: completed ? new Date() : p.completedAt,
                  }
                : p
            ),
            pendingOperations: state.pendingOperations + 1,
          }));
        } else {
          const tempProgress: Progress = {
            id: `temp-${Date.now()}`,
            habitId,
            date: dateString,
            count: 0,
            minutesSpent,
            completed,
            completedAt: completed ? new Date() : undefined,
          };

          set((state) => ({
            progress: [...state.progress, tempProgress],
            pendingOperations: state.pendingOperations + 1,
          }));
        }

        try {
          await HabitsAPI.updateTimer(habitId, date, minutesSpent);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          toast.error("Erro ao salvar timer");
          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Pomodoro
      updatePomodoro: async (habitId, date, sessions) => {
        const dateString = getDateString(date);
        const habit = get().getHabitById(habitId);
        if (!habit || habit.habitType !== "pomodoro") return;

        const existingProgress = get().progress.find(
          (p) => p.habitId === habitId && p.date === dateString
        );
        const completed = sessions >= habit.targetCount;

        // Update otimista
        if (existingProgress) {
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? {
                    ...p,
                    pomodoroSessions: sessions,
                    completed,
                    completedAt: completed ? new Date() : p.completedAt,
                  }
                : p
            ),
            pendingOperations: state.pendingOperations + 1,
          }));
        } else {
          const tempProgress: Progress = {
            id: `temp-${Date.now()}`,
            habitId,
            date: dateString,
            count: 0,
            pomodoroSessions: sessions,
            completed,
            completedAt: completed ? new Date() : undefined,
          };

          set((state) => ({
            progress: [...state.progress, tempProgress],
            pendingOperations: state.pendingOperations + 1,
          }));
        }

        try {
          await HabitsAPI.updatePomodoro(habitId, date, sessions);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          toast.error("Erro ao salvar pomodoro");
          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
          throw error;
        }
      },

      getHabitsWithProgress: (date = new Date()) => {
        const { habits, progress, currentDate } = get();
        const targetDate = date || currentDate;
        return habits
          .sort((a, b) => a.order - b.order)
          .map((habit) =>
            combineHabitWithProgress(habit, progress, targetDate)
          );
      },

      getHabitWithProgress: (id) => {
        const { habits, progress, currentDate } = get();
        const habit = habits.find((h) => h.id === id);
        if (!habit) return undefined;
        return combineHabitWithProgress(habit, progress, currentDate);
      },

      getHabitStats: (habitId) => {
        const { habits, progress } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return null;

        const createdAt =
          typeof habit.createdAt === "string"
            ? new Date(habit.createdAt)
            : habit.createdAt;
        return calculateHabitStats(habitId, progress, createdAt);
      },

      getAllHabitsStats: () => {
        const { habits } = get();
        return habits
          .map((habit) => get().getHabitStats(habit.id))
          .filter(Boolean) as HabitStats[];
      },

      getInsights: () => {
        const { habits, progress } = get();
        return getInsights(progress, habits);
      },

      getTotalStreak: () => {
        const { habits } = get();
        const allStats = habits
          .map((habit) => get().getHabitStats(habit.id))
          .filter(Boolean) as HabitStats[];
        return allStats.reduce((sum, stat) => sum + stat.currentStreak, 0);
      },

      getCompletionRateToday: () => {
        const { habits, progress } = get();
        const today = getDateString(new Date());
        const todayProgress = progress.filter((p) => p.date === today);

        if (habits.length === 0) return 0;

        const completed = todayProgress.filter((p) => p.completed).length;
        return Math.round((completed / habits.length) * 100);
      },

      setCurrentDate: (date) => {
        set({ currentDate: date });
      },

      goToPreviousDay: () => {
        const current = get().currentDate;
        const previous = new Date(current);
        previous.setDate(previous.getDate() - 1);
        set({ currentDate: previous });
      },

      goToNextDay: () => {
        const current = get().currentDate;
        const next = new Date(current);
        next.setDate(next.getDate() + 1);
        set({ currentDate: next });
      },

      goToToday: () => {
        set({ currentDate: new Date() });
      },

      // OPTIMISTIC UPDATE: Adicionar grupo
      addGroup: async (groupData) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticGroup: HabitGroup = {
          id: tempId,
          ...groupData,
          order: get().groups.length,
        };

        set((state) => ({
          groups: [...state.groups, optimisticGroup],
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          const serverGroup = await HabitsAPI.createGroup(groupData);

          set((state) => ({
            groups: state.groups.map((g) =>
              g.id === tempId ? serverGroup : g
            ),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.success("Grupo criado!");
        } catch (error) {
          set((state) => ({
            groups: state.groups.filter((g) => g.id !== tempId),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao criar grupo");
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Atualizar grupo
      updateGroup: async (id, data) => {
        const previousGroup = get().groups.find((g) => g.id === id);
        if (!previousGroup) return;

        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...data } : g
          ),
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          await HabitsAPI.updateGroup(id, data);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          set((state) => ({
            groups: state.groups.map((g) => (g.id === id ? previousGroup : g)),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao atualizar grupo");
          throw error;
        }
      },

      // OPTIMISTIC UPDATE: Deletar grupo
      deleteGroup: async (id) => {
        const previousGroup = get().groups.find((g) => g.id === id);
        if (!previousGroup) return;

        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          habits: state.habits.map((h) =>
            h.groupId === id ? { ...h, groupId: null } : h
          ),
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          await HabitsAPI.deleteGroup(id);

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.success("Grupo excluído");
        } catch (error) {
          set((state) => ({
            groups: [...state.groups, previousGroup],
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao excluir grupo");
          throw error;
        }
      },

      getGroupById: (id) => {
        return get().groups.find((g) => g.id === id);
      },

      getHabitsByGroup: (groupId) => {
        const { habits, progress, currentDate } = get();
        return habits
          .filter((h) => h.groupId === groupId)
          .sort((a, b) => a.order - b.order)
          .map((habit) =>
            combineHabitWithProgress(habit, progress, currentDate)
          );
      },

      // OPTIMISTIC UPDATE: Atribuir hábito a grupo
      assignHabitToGroup: async (habitId, groupId) => {
        const previousHabit = get().habits.find((h) => h.id === habitId);
        if (!previousHabit) return;

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, groupId } : h
          ),
          pendingOperations: state.pendingOperations + 1,
        }));

        try {
          await HabitsAPI.updateHabit(habitId, { groupId });

          set((state) => ({
            pendingOperations: state.pendingOperations - 1,
          }));
        } catch (error) {
          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === habitId ? previousHabit : h
            ),
            pendingOperations: state.pendingOperations - 1,
          }));

          toast.error("Erro ao atribuir grupo");
          throw error;
        }
      },

      loadMockData: () => {
        const mockData = require("@/lib/mock-data/habits-mock.json");

        const habits = mockData.habits.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
        }));

        const progress = mockData.progress.map((p: any) => ({
          ...p,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
        }));

        set({
          habits,
          progress,
          groups: mockData.groups || [],
          skipAutoLoad: false, // Reseta a flag ao carregar dados manualmente
        });

        // Marca que os dados mock foram carregados (permite recarregar manualmente depois)
        localStorage.setItem("habits-mock-data-loaded", "true");
      },

      importData: (data) => {
        // Converte strings de data para objetos Date
        const habits = (data.habits || []).map((h: any) => ({
          ...h,
          createdAt:
            h.createdAt instanceof Date ? h.createdAt : new Date(h.createdAt),
        }));

        const progress = (data.progress || []).map((p: any) => ({
          ...p,
          completedAt: p.completedAt
            ? p.completedAt instanceof Date
              ? p.completedAt
              : new Date(p.completedAt)
            : undefined,
        }));

        const groups = (data.groups || []).map((g: any) => ({
          ...g,
          createdAt:
            g.createdAt instanceof Date ? g.createdAt : new Date(g.createdAt),
        }));

        set({
          habits,
          progress,
          groups,
          skipAutoLoad: false, // Reseta a flag ao importar dados
        });

        toast.success("Dados importados com sucesso!");
      },

      clearAllData: () => {
        // Reseta todos os dados para valores iniciais
        // Nota: O localStorage já foi removido antes desta função ser chamada
        // (veja handleClearData em use-settings-actions.ts)
        set({
          habits: [],
          progress: [],
          groups: [],
          currentDate: new Date(),
          selectedHabitId: null,
          isLoading: false,
          isSyncing: false,
          lastSync: null,
          pendingOperations: 0,
          skipAutoLoad: true, // Marca para pular carregamento automático
        });
      },

      syncWithServer: async () => {
        set({ isSyncing: true });

        try {
          // Simula sync com servidor
          await Promise.all([
            HabitsAPI.getHabits(),
            HabitsAPI.getProgress(),
            HabitsAPI.getGroups(),
          ]);

          set({
            lastSync: new Date(),
            isSyncing: false,
          });

          toast.success("Sincronizado com sucesso!");
        } catch (error) {
          set({ isSyncing: false });
          toast.error("Erro ao sincronizar");
          throw error;
        }
      },
    }),
    {
      name: "habits-storage",
      partialize: (state) => ({
        habits: state.habits,
        progress: state.progress,
        groups: state.groups,
        currentDate: state.currentDate,
        skipAutoLoad: state.skipAutoLoad,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            state.currentDate =
              state.currentDate instanceof Date
                ? state.currentDate
                : new Date(state.currentDate);

            state.habits = state.habits.map((h) => ({
              ...h,
              createdAt:
                h.createdAt instanceof Date
                  ? h.createdAt
                  : new Date(h.createdAt),
            }));

            state.progress = state.progress.map((p) => ({
              ...p,
              completedAt: p.completedAt
                ? p.completedAt instanceof Date
                  ? p.completedAt
                  : new Date(p.completedAt)
                : undefined,
            }));
          } catch (error) {
            console.error("Error rehydrating dates:", error);
            state.currentDate = new Date();
          }
        }
      },
    }
  )
);
