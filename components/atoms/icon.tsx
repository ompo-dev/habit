import { cn } from "@/lib/utils/cn"

interface IconProps {
  emoji: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
}

export function Icon({ emoji, className, size = "md" }: IconProps) {
  return <span className={cn("inline-block", sizeClasses[size], className)}>{emoji}</span>
}
