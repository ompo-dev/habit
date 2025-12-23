"use client";

import { useEffect, useRef } from "react";
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

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full rounded-2xl shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
          "bg-background/95 backdrop-blur-3xl border border-white/15 p-6",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
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
              <p className="mt-2 text-sm text-white/60 whitespace-pre-line">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          {children}
        </div>
      </div>
    </div>
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
    <button
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
    </button>
  );
}
