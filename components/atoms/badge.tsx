import type React from "react"
import { cn } from "@/lib/utils/cn"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "purple"
  className?: string
}

const variantClasses = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-500/10 text-green-500",
  warning: "bg-orange-500/10 text-orange-500",
  purple: "bg-purple-500/10 text-purple-500",
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-xl border shadow-lg",
        variantClasses[variant],
        variant === "default" && "border-primary/30",
        variant === "success" && "border-green-500/30",
        variant === "warning" && "border-orange-500/30",
        variant === "purple" && "border-purple-500/30",
        className,
      )}
    >
      {children}
    </span>
  )
}
