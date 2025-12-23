"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface IconPickerProps {
  icons: string[];
  selectedIcon: string;
  onSelect: (iconName: string) => void;
  className?: string;
}

export function IconPicker({
  icons,
  selectedIcon,
  onSelect,
  className,
}: IconPickerProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-6 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-2 rounded-xl bg-white/5 border border-white/10",
        className
      )}
    >
      {icons.map((iconName) => {
        const Icon = (LucideIcons as any)[iconName] as LucideIcon;
        const isSelected = selectedIcon === iconName;

        return (
          <button
            key={iconName}
            onClick={() => onSelect(iconName)}
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all backdrop-blur-xl border",
              isSelected
                ? "bg-white/20 ring-2 ring-white/50 border-white/30"
                : "bg-white/5 hover:bg-white/10 border-white/10"
            )}
          >
            {Icon && <Icon className="h-5 w-5 text-white" />}
            {isSelected && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

