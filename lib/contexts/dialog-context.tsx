"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Dialog, DialogButton } from "@/components/ui/dialog";

interface DialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}

interface DialogContextType {
  confirm: (opts: DialogOptions) => Promise<boolean>;
  alert: (message: string, title?: string) => Promise<void>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "default",
  });
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean | void) => void) | null
  >(null);
  const [isAlert, setIsAlert] = useState(false);

  const confirm = useCallback(
    (opts: DialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setOptions({
          title: opts.title,
          description: opts.description,
          confirmText: opts.confirmText || "Confirmar",
          cancelText: opts.cancelText || "Cancelar",
          variant: opts.variant || "default",
        });
        setIsAlert(false);
        setResolvePromise(() => resolve);
        setIsOpen(true);
      });
    },
    []
  );

  const alert = useCallback(
    (message: string, title: string = "Aviso"): Promise<void> => {
      return new Promise((resolve) => {
        setOptions({
          title,
          description: message,
          confirmText: "OK",
          cancelText: "",
          variant: "default",
        });
        setIsAlert(true);
        setResolvePromise(() => resolve);
        setIsOpen(true);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={isAlert ? handleConfirm : handleCancel}
        title={options.title}
        description={options.description}
        variant={options.variant}
      >
        {!isAlert && options.cancelText && (
          <DialogButton onClick={handleCancel} variant="secondary">
            {options.cancelText}
          </DialogButton>
        )}
        <DialogButton
          onClick={handleConfirm}
          variant={options.variant}
          autoFocus
        >
          {options.confirmText}
        </DialogButton>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return context;
}

