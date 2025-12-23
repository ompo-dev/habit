"use client"

import { cn } from "@/lib/utils/cn"
import type { HabitCategory } from "@/lib/types/habit"

interface CategoryTabsProps {
  selected: HabitCategory | "todos"
  onSelect: (category: HabitCategory | "todos") => void
}

const categories = [
  { value: "todos" as const, label: "Todos" },
  { value: "bons" as const, label: "Bons" },
  { value: "saude" as const, label: "Saúde" },
  { value: "maus" as const, label: "Maus" },
  { value: "tarefas" as const, label: "Tarefas" },
]

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap backdrop-blur-xl border shadow-lg",
            selected === category.value
              ? "bg-white text-background border-white/20"
              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border-white/10",
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
