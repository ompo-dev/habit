"use client";

export function registerServiceWorker() {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "✅ Service Worker registrado com sucesso:",
            registration.scope
          );

          // Verifica atualizações periodicamente
          setInterval(() => {
            registration.update();
          }, 60000); // A cada 1 minuto

          // Listener para atualizações
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Nova versão disponível
                  console.log("🔄 Nova versão do app disponível!");
                  // Pode mostrar notificação para o usuário atualizar
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("❌ Erro ao registrar Service Worker:", error);
        });
    });
  }
}

