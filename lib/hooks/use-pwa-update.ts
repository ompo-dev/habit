"use client";

import { useEffect, useState } from "react";

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;

    // Registra o service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;

        // Listener para detectar atualizações
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nova versão disponível
              console.log("🔄 Nova versão disponível!");
              setUpdateAvailable(true);
            }
          });
        });

        // Verifica atualizações a cada 60 segundos
        setInterval(() => {
          reg.update();
        }, 60000);

        // Verifica atualizações quando a página recebe foco
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) {
            reg.update();
          }
        });

        // Listener para mensagens do service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "SW_UPDATED") {
            console.log("✅ Service Worker atualizado:", event.data.version);
            // Recarrega a página para aplicar a nova versão
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("❌ Erro ao registrar Service Worker:", error);
      });

    // Cleanup
    return () => {
      if (registration) {
        registration.removeEventListener("updatefound", () => {});
      }
    };
  }, []);

  const applyUpdate = async () => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    setIsUpdating(true);

    try {
      // Envia mensagem para o service worker pular a espera
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // Força recarregamento da página após um breve delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("❌ Erro ao aplicar atualização:", error);
      setIsUpdating(false);
    }
  };

  return {
    updateAvailable,
    isUpdating,
    applyUpdate,
  };
}

