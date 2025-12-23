"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Verifica status inicial
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      // Remove o indicador após 3 segundos quando volta online
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || wasOffline) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 mx-auto max-w-lg",
            "pointer-events-none safe-header"
          )}
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <div
            className={cn(
              "mx-4 mt-4 rounded-xl px-4 py-3 shadow-lg",
              "flex items-center gap-3",
              isOnline
                ? "bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/30"
                : "bg-orange-500/90 backdrop-blur-xl border border-orange-400/30"
            )}
          >
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-white" />
                <p className="text-sm font-medium text-white">
                  Conexão restaurada
                </p>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-white" />
                <p className="text-sm font-medium text-white">
                  Modo offline - Alguns recursos podem estar limitados
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

