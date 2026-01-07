"use client";

import { useEffect, useState, useCallback } from "react";
import { useRemindersStore } from "@/lib/stores/reminders-store";
import { useHabitsStore } from "@/lib/stores/habits-store";

export function useReminderNotifications() {
  const { preferences, permission, updatePreferences, setPermission, syncToServiceWorker } = useRemindersStore();
  const { habits, progress } = useHabitsStore();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar suporte
    setIsSupported(
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "Notification" in window
    );
  }, []);

  // Solicitar permissão
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === "granted") {
        // Ativar lembretes por padrão
        updatePreferences({ enabled: true });
        // Sincronizar com Service Worker
        await syncToServiceWorker();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      return false;
    }
  }, [isSupported, setPermission, updatePreferences, syncToServiceWorker]);

  // Função para buscar dados do app e sincronizar
  const syncAppData = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) return;

      // Buscar dados do store de habits
      const appData = {
        habits: habits.map(h => ({
          id: h.id,
          name: h.title, // Habit usa 'title', não 'name'
        })),
        progress: progress.map(p => ({
          habitId: p.habitId,
          date: p.date,
          completed: p.completed
        }))
      };
      
      registration.active.postMessage({
        type: "UPDATE_APP_DATA",
        data: appData
      });
    } catch (error) {
      console.error("Erro ao sincronizar dados com SW:", error);
    }
  }, [habits, progress]);

  // Sincronizar dados quando preferências ou permissão mudarem
  useEffect(() => {
    if (!preferences.enabled || permission !== "granted") return;
    
    // Sincronizar preferências e dados do app
    syncToServiceWorker();
    syncAppData();
  }, [preferences.enabled, permission, syncToServiceWorker, syncAppData]);

  // Sincronizar dados de hábitos quando mudarem (debounced)
  useEffect(() => {
    if (!preferences.enabled || permission !== "granted") return;

    // Debounce para evitar sincronizações excessivas
    const timeoutId = setTimeout(() => {
      syncAppData();
    }, 1000); // Aguarda 1s após última mudança

    return () => clearTimeout(timeoutId);
  }, [habits, progress, preferences.enabled, permission, syncAppData]);

  // Sincronização periódica (a cada 5 minutos)
  useEffect(() => {
    if (!preferences.enabled || permission !== "granted") return;

    const interval = setInterval(() => {
      syncAppData();
    }, 5 * 60 * 1000); // A cada 5 minutos

    return () => clearInterval(interval);
  }, [preferences.enabled, permission, syncAppData]);

  return {
    isSupported,
    permission,
    preferences,
    isEnabled: preferences.enabled && permission === "granted",
    requestPermission,
    updatePreferences,
  };
}

