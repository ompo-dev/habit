"use client"

import { cn } from "@/lib/utils/cn"
import { BarChart3, Settings, ListChecks } from "lucide-react"
import { useActiveTab } from "@/lib/hooks/use-search-params"

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useActiveTab()

  const navItems = [
    {
      label: "Hábitos",
      icon: <ListChecks className="h-6 w-6" />,
      tab: "habits" as const,
    },
    {
      label: "Estatísticas",
      icon: <BarChart3 className="h-6 w-6" />,
      tab: "statistics" as const,
    },
    {
      label: "Configurações",
      icon: <Settings className="h-6 w-6" />,
      tab: "settings" as const,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-2xl border-t border-white/[0.1] shadow-[0_-4px_24px_0_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-6 py-2 transition-all backdrop-blur-xl",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-lg" 
                  : "text-white/40 hover:text-white/60 hover:bg-white/5",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              type="button"
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
