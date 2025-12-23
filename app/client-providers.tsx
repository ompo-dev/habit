"use client"

import type React from "react"

import { useEffect } from "react"
import { useUIStore } from "@/lib/stores/ui-store"
import { Toaster } from "sonner"
import { DialogProvider } from "@/lib/contexts/dialog-context"

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

  return (
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
  )
}
