/**
 * Search Params Type-Safe com nuqs
 * Controla estado da aplicação através de URL
 */

import { parseAsString, parseAsStringEnum, parseAsBoolean, useQueryStates, createParser } from "nuqs"
import type { HabitCategory } from "@/lib/types/habit"

// Parser customizado para data no formato DDMMYYYY
const parseDayFormat = createParser({
  parse: (value: string) => {
    if (!value || value.length !== 8) return null
    const day = parseInt(value.substring(0, 2))
    const month = parseInt(value.substring(2, 4)) - 1 // Month is 0-indexed
    const year = parseInt(value.substring(4, 8))
    
    const date = new Date(year, month, day)
    if (isNaN(date.getTime())) return null
    return date
  },
  serialize: (value: Date) => {
    const day = String(value.getDate()).padStart(2, '0')
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const year = value.getFullYear()
    return `${day}${month}${year}`
  },
})

// Parser personalizado para datas
export const parsers = {
  // Tab ativa (controla qual "página" está visível)
  tab: parseAsStringEnum(["habits", "statistics", "settings"]).withDefault("habits"),
  
  // Data selecionada (formato: DDMMYYYY, ex: 12102025 = 12/10/2025)
  day: parseDayFormat.withDefault(new Date()),
  
  // Categoria filtrada
  category: parseAsStringEnum<HabitCategory | "todos">(["bons", "saude", "maus", "tarefas", "todos"]).withDefault("todos"),
  
  // Hábito selecionado (para modal)
  habit: parseAsString,
  
  // Grupo(s) aberto(s) - agora suporta múltiplos grupos
  group: parseAsString,
  
  // Modo de visualização do calendário
  view: parseAsStringEnum(["week", "month", "year"]).withDefault("week"),
  
  // Busca/filtro
  search: parseAsString.withDefault(""),
}

/**
 * Hook principal para gerenciar search params
 */
export function useAppSearchParams() {
  const [params, setParams] = useQueryStates(parsers, {
    // Configurações
    history: "replace", // Usa replace ao invés de push para não poluir histórico
    shallow: true, // Navegação shallow
    scroll: false, // Não rola ao mudar params
  })

  return {
    ...params,
    setTab: (tab: "habits" | "statistics" | "settings") => setParams({ tab }),
    setDay: (day: Date) => setParams({ day }),
    setCategory: (category: HabitCategory | "todos") => setParams({ category }),
    setHabit: (habit: string | null) => setParams({ habit }),
    setGroup: (group: string | null) => setParams({ group }),
    setView: (view: "week" | "month" | "year") => setParams({ view }),
    setSearch: (search: string) => setParams({ search }),
    clearFilters: () => setParams({
      category: "todos",
      search: "",
      group: null,
    }),
    resetAll: () => setParams({
      tab: "habits",
      day: new Date(),
      category: "todos",
      habit: null,
      group: null,
      view: "week",
      search: "",
    }),
  }
}

/**
 * Hook simplificado para data selecionada (formato DDMMYYYY)
 */
export function useSelectedDay() {
  const [state, setState] = useQueryStates({
    day: parsers.day,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  const isToday = () => {
    const today = new Date()
    return state.day.toDateString() === today.toDateString()
  }

  return {
    selectedDay: state.day,
    setSelectedDay: (newDay: Date) => setState({ day: newDay }),
    isToday: isToday(),
    goToPreviousDay: () => {
      const prev = new Date(state.day)
      prev.setDate(prev.getDate() - 1)
      setState({ day: prev })
    },
    goToNextDay: () => {
      const next = new Date(state.day)
      next.setDate(next.getDate() + 1)
      setState({ day: next })
    },
    goToToday: () => setState({ day: new Date() }),
  }
}

/**
 * Hook para categoria selecionada
 */
export function useSelectedCategory() {
  const [state, setState] = useQueryStates({
    category: parsers.category,
  }, {
    history: "replace",
    shallow: true,
  })

  return {
    selectedCategory: state.category,
    setSelectedCategory: (category: HabitCategory | "todos") => setState({ category }),
  }
}

/**
 * Hook para hábito selecionado (modal)
 */
export function useSelectedHabit() {
  const [state, setState] = useQueryStates({
    habit: parsers.habit,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    selectedHabitId: state.habit,
    openHabit: (habitId: string) => setState({ habit: habitId }),
    closeHabit: () => setState({ habit: null }),
    isOpen: state.habit !== null,
  }
}

/**
 * Hook para gerenciar adição de hábito a um grupo específico
 */
export function useAddToGroup() {
  const [state, setState] = useQueryStates({
    addToGroup: parseAsString,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    addingToGroupId: state.addToGroup,
    isAdding: state.addToGroup !== null,
    startAddingToGroup: (groupId: string) => setState({ addToGroup: groupId }),
    cancelAdding: () => setState({ addToGroup: null }),
  }
}

/**
 * Hook para controlar modal de templates de hábitos
 */
export function useHabitTemplatesModal() {
  const [state, setState] = useQueryStates({
    habitTemplates: parseAsBoolean,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    isOpen: state.habitTemplates || false,
    open: () => setState({ habitTemplates: true }),
    close: () => setState({ habitTemplates: null }),
  }
}

/**
 * Hook para controlar modal de criação/edição de hábitos
 */
export function useHabitCreationModal() {
  const [state, setState] = useQueryStates({
    creatingHabit: parseAsBoolean,
    editingHabit: parseAsString,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    isCreating: state.creatingHabit || false,
    editingHabitId: state.editingHabit,
    isEditing: state.editingHabit !== null,
    isOpen: state.creatingHabit || state.editingHabit !== null,
    openCreate: () => setState({ creatingHabit: true }),
    openEdit: (habitId: string) => setState({ editingHabit: habitId }),
    close: () => setState({ creatingHabit: null, editingHabit: null }),
  }
}

/**
 * Hook para controlar modal de templates de grupos
 */
export function useGroupTemplatesModal() {
  const [state, setState] = useQueryStates({
    groupTemplates: parseAsBoolean,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    isOpen: state.groupTemplates || false,
    open: () => setState({ groupTemplates: true }),
    close: () => setState({ groupTemplates: null }),
  }
}

/**
 * Hook para controlar modal de criação/edição de grupos
 */
export function useGroupCreationModal() {
  const [state, setState] = useQueryStates({
    creatingGroup: parseAsBoolean,
    editingGroup: parseAsString,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    isCreating: state.creatingGroup || false,
    editingGroupId: state.editingGroup,
    isEditing: state.editingGroup !== null,
    isOpen: state.creatingGroup || state.editingGroup !== null,
    openCreate: () => setState({ creatingGroup: true }),
    openEdit: (groupId: string) => setState({ editingGroup: groupId }),
    close: () => setState({ creatingGroup: null, editingGroup: null }),
  }
}

/**
 * Hook para modo de visualização do calendário
 */
export function useCalendarView() {
  const [state, setState] = useQueryStates({
    view: parsers.view,
  }, {
    history: "replace",
    shallow: true,
  })

  return {
    calendarView: state.view,
    setCalendarView: (view: "week" | "month" | "year") => setState({ view }),
  }
}

/**
 * Hook para controlar qual tab está ativa
 */
export function useActiveTab() {
  const [state, setState] = useQueryStates({
    tab: parsers.tab,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  return {
    activeTab: state.tab,
    setActiveTab: (tab: "habits" | "statistics" | "settings") => setState({ tab }),
    isHabitsTab: state.tab === "habits",
    isStatisticsTab: state.tab === "statistics",
    isSettingsTab: state.tab === "settings",
  }
}

/**
 * Hook para controlar grupos abertos/fechados
 */
export function useOpenGroups() {
  const [state, setState] = useQueryStates({
    group: parsers.group,
  }, {
    history: "replace",
    shallow: true,
    scroll: false,
  })

  // Parse grupos abertos (formato: "1,2,3")
  const openGroups = state.group ? state.group.split(",") : []

  return {
    openGroups,
    isGroupOpen: (groupId: string) => openGroups.includes(groupId),
    toggleGroup: (groupId: string) => {
      const current = state.group ? state.group.split(",") : []
      const updated = current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId]
      setState({ group: updated.length > 0 ? updated.join(",") : null })
    },
    openGroup: (groupId: string) => {
      const current = state.group ? state.group.split(",") : []
      if (!current.includes(groupId)) {
        setState({ group: [...current, groupId].join(",") })
      }
    },
    closeGroup: (groupId: string) => {
      const current = state.group ? state.group.split(",") : []
      const updated = current.filter(id => id !== groupId)
      setState({ group: updated.length > 0 ? updated.join(",") : null })
    },
    closeAllGroups: () => setState({ group: null }),
  }
}
