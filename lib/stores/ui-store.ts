import { create } from "zustand"

interface UIState {
  selectedDate: Date
  isHabitModalOpen: boolean
  isTemplatesModalOpen: boolean
  isGroupTemplatesModalOpen: boolean

  setSelectedDate: (date: Date) => void
  openHabitModal: () => void
  closeHabitModal: () => void
  openTemplatesModal: () => void
  closeTemplatesModal: () => void
  openGroupTemplatesModal: () => void
  closeGroupTemplatesModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedDate: new Date(),
  isHabitModalOpen: false,
  isTemplatesModalOpen: false,
  isGroupTemplatesModalOpen: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  openHabitModal: () => set({ isHabitModalOpen: true }),
  closeHabitModal: () => set({ isHabitModalOpen: false }),
  openTemplatesModal: () => set({ isTemplatesModalOpen: true }),
  closeTemplatesModal: () => set({ isTemplatesModalOpen: false }),
  openGroupTemplatesModal: () => set({ isGroupTemplatesModalOpen: true }),
  closeGroupTemplatesModal: () => set({ isGroupTemplatesModalOpen: false }),
}))
