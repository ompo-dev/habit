import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReminderPreferences } from "@/lib/types/reminder-notifications";

interface RemindersState {
  preferences: ReminderPreferences;
  permission: NotificationPermission;
  
  // Actions
  updatePreferences: (prefs: Partial<ReminderPreferences>) => void;
  setPermission: (permission: NotificationPermission) => void;
  syncToServiceWorker: () => Promise<void>; // Sincroniza dados com SW
}

const defaultPreferences: ReminderPreferences = {
  enabled: false,
  habitReminders: true, // Habit app
  workoutReminders: false, // Habit não usa
  mealReminders: false, // Habit não usa
  reminderTimes: {
    habits: ["08:00", "20:00"], // Habit app
  }
};

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      permission: typeof window !== "undefined" 
        ? Notification.permission 
        : "default",
      
      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }));
        // Sincronizar com Service Worker
        get().syncToServiceWorker();
      },
      
      setPermission: (permission) => {
        set({ permission });
      },
      
      syncToServiceWorker: async () => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
          return;
        }
        
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.active) {
            // Enviar apenas preferências para Service Worker
            // Os dados de hábitos são sincronizados pelo hook use-reminder-notifications
            registration.active.postMessage({
              type: "UPDATE_REMINDER_PREFERENCES",
              preferences: get().preferences
            });
          }
        } catch (error) {
          console.error("Erro ao sincronizar com Service Worker:", error);
        }
      }
    }),
    {
      name: "reminders-storage",
      partialize: (state) => ({
        preferences: state.preferences,
        permission: state.permission
      })
    }
  )
);


