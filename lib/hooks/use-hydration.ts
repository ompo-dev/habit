import { useEffect, useState } from "react"

/**
 * Hook para prevenir erros de hidratação
 * Retorna true apenas após o componente montar no cliente
 * 
 * Use quando precisar mostrar valores do Zustand persist ou localStorage
 * que não estão disponíveis durante SSR
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook que retorna um valor apenas após hidratação
 * Durante SSR/hidratação, retorna o fallback
 */
export function useHydratedValue<T>(getValue: () => T, fallback: T): T {
  const isHydrated = useHydration()
  return isHydrated ? getValue() : fallback
}

