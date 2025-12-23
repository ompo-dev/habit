"use client"

import type React from "react"

import { useEffect } from "react"
import { useUIStore } from "@/lib/stores/ui-store"
import { Toaster } from "sonner"
import { DialogProvider } from "@/lib/contexts/dialog-context"
import { ErrorBoundary } from "@/components/organisms/error-boundary"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { openTemplatesModal } = useUIStore()

  useEffect(() => {
    const handleOpenTemplates = () => {
      openTemplatesModal()
    }

    window.addEventListener("open-templates", handleOpenTemplates)

    return () => {
      window.removeEventListener("open-templates", handleOpenTemplates)
    }
  }, [openTemplatesModal])

  // Captura erros globais não tratados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("🚨 Erro global capturado:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 Promise rejeitada não tratada:", {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <ErrorBoundary>
      <DialogProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            },
          }}
        />
      </DialogProvider>
    </ErrorBoundary>
  )
}
