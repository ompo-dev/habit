"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import type { HabitGroup } from "@/lib/types/habit"
import { ChevronDown } from "lucide-react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface GroupHeaderProps {
  group: HabitGroup
  isExpanded: boolean
  onToggle: () => void
  habitCount: number
}

export function GroupHeader({ group, isExpanded, onToggle, habitCount }: GroupHeaderProps) {
  const IconComponent = (LucideIcons as any)[group.icon] as LucideIcon || LucideIcons.Folder

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] px-4 py-3 transition-all hover:bg-white/[0.12] hover:border-white/[0.16] shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-lg border"
          style={{ 
            backgroundColor: `${group.color}20`,
            borderColor: `${group.color}30`
          }}
        >
          <IconComponent className="h-5 w-5" style={{ color: group.color }} />
        </motion.div>
        <div className="text-left">
          <h3 className="font-semibold text-white">{group.name}</h3>
          <p className="text-xs text-white/50">{habitCount} hábitos</p>
        </div>
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-white/60" />
      </motion.div>
    </motion.button>
  )
}
