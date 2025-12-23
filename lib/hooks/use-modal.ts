import { useEffect } from "react";

/**
 * Hook para gerenciar o overflow do body quando um modal está aberto
 */
export function useModalBodyLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
}

/**
 * Hook para gerenciar estado de modal com limpeza de sessionStorage
 */
export function useModalWithCleanup(
  isOpen: boolean,
  storageKey?: string,
  onClose?: () => void
) {
  const handleClose = () => {
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }
    onClose?.();
  };

  useModalBodyLock(isOpen);

  return { handleClose };
}

