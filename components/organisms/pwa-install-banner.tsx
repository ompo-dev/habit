"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Plus } from "lucide-react";
import { usePWAInstall } from "@/lib/hooks/use-pwa-install";
import { cn } from "@/lib/utils/cn";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Mostra banner apenas se:
    // 1. App é instalável
    // 2. Não está instalado
    // 3. Não foi dispensado
    // 4. Não está em modo standalone
    if (isInstallable && !isInstalled && !dismissed) {
      // Delay para não aparecer imediatamente
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Aparece após 3 segundos

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    // Salva no localStorage para não mostrar novamente
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  const handleInstall = async () => {
    if (isIOS) {
      // Para iOS, mostra instruções
      return;
    }
    await promptInstall();
    handleDismiss();
  };

  // Verifica se foi dispensado anteriormente
  useEffect(() => {
    const wasDismissed = localStorage.getItem("pwa-banner-dismissed");
    if (wasDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  if (!isVisible || isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed left-0 right-0 z-50 mx-auto max-w-lg px-4",
            "pointer-events-auto"
          )}
          style={{
            bottom: `calc(5rem + env(safe-area-inset-bottom, 0px))`,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div
            className={cn(
              "rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]",
              "bg-background/95 backdrop-blur-3xl border border-white/15",
              "flex items-center gap-3"
            )}
          >
            {isIOS ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    Instalar App
                  </h3>
                  <p className="text-xs text-white/60">
                    Toque em{" "}
                    <span className="inline-flex items-center gap-1 font-medium text-white/80">
                      <Share2 className="h-3 w-3" />
                      Compartilhar
                    </span>{" "}
                    e depois{" "}
                    <span className="inline-flex items-center gap-1 font-medium text-white/80">
                      <Plus className="h-3 w-3" />
                      Adicionar à Tela de Início
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    Instalar App
                  </h3>
                  <p className="text-xs text-white/60">
                    Instale o app para acesso rápido e funcionamento offline
                  </p>
                </div>
                <button
                  onClick={handleInstall}
                  className={cn(
                    "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white",
                    "hover:bg-primary/90 transition-all shadow-lg",
                    "flex items-center gap-2"
                  )}
                  aria-label="Instalar aplicativo"
                >
                  <Download className="h-4 w-4" />
                  Instalar
                </button>
              </>
            )}
            <button
              onClick={handleDismiss}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                "bg-white/10 text-white/60 hover:bg-white/20 transition-all"
              )}
              aria-label="Fechar banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

