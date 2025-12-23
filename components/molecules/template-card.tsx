"use client";

import { cn } from "@/lib/utils/cn";
import { Clock, Timer, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TemplateCardProps {
  template: {
    title: string;
    icon: string;
    color: string;
    backgroundColor: string;
    category: "bons" | "saude" | "maus" | "tarefas";
    habitType: "counter" | "timer" | "pomodoro";
    targetCount: number;
    targetMinutes?: number;
    pomodoroWork?: number;
    pomodoroBreak?: number;
    description: string;
  };
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const IconComponent =
    ((LucideIcons as any)[template.icon] as LucideIcon) || LucideIcons.Circle;

  const getProgressText = () => {
    if (template.habitType === "counter") {
      const showCount = template.targetCount > 1;
      return showCount ? `Meta: ${template.targetCount}x` : "Cada dia";
    } else if (template.habitType === "timer") {
      return `Meta: ${template.targetMinutes} min`;
    } else if (template.habitType === "pomodoro") {
      return `Meta: ${template.targetCount} sessões`;
    }
    return "Cada dia";
  };

  const getIcon = () => {
    if (template.habitType === "timer")
      return <Clock className="h-4 w-4 text-white/60" />;
    if (template.habitType === "pomodoro")
      return <Timer className="h-4 w-4 text-white/60" />;
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl p-4 transition-all text-left",
        "backdrop-blur-xl border shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]",
        "hover:scale-[1.02] hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.35)] active:scale-[0.98]"
      )}
      style={{
        backgroundColor: template.color + "20",
        borderColor: template.color + "30",
      }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl backdrop-blur-lg border"
        style={{
          backgroundColor: template.backgroundColor || template.color + "30",
          borderColor: template.color + "40",
        }}
      >
        <IconComponent className="h-6 w-6" style={{ color: template.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{template.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {getIcon()}
          <p className="text-sm text-white/60">{getProgressText()}</p>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-white/40 shrink-0 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

