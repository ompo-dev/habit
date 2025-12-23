"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  variant?: "default" | "danger";
  size?: "sm" | "md" | "lg";
}

interface DialogButtonProps {
  onClick: () => void;
  variant?: "default" | "danger" | "secondary";
  children: React.ReactNode;
  autoFocus?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "default",
  size = "md",
}: DialogProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);


  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full rounded-2xl shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
              "bg-background/95 backdrop-blur-3xl border border-white/15 p-6",
              sizeClasses[size]
            )}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-start justify-between mb-4"
            >
              <div className="flex-1">
                <h2
                  className={cn(
                    "text-xl font-bold",
                    variant === "danger" ? "text-red-400" : "text-white"
                  )}
                >
                  {title}
                </h2>
                {description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-2 text-sm text-white/60 whitespace-pre-line"
                  >
                    {description}
                  </motion.p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-end gap-3 pt-4 border-t border-white/10"
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DialogButton({
  onClick,
  variant = "default",
  children,
  autoFocus = false,
}: DialogButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all backdrop-blur-xl border shadow-lg",
        variant === "danger"
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500/40"
          : variant === "secondary"
            ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
            : "bg-primary hover:bg-primary/90 text-white border-primary/40"
      )}
    >
      {children}
    </motion.button>
  );
}
