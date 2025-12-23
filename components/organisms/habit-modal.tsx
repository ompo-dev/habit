"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Trash2, Edit, BarChart3, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/atoms/badge";
import { CounterControl } from "@/components/molecules/counter-control";
import { TimerControl } from "@/components/molecules/timer-control";
import { PomodoroControl } from "@/components/molecules/pomodoro-control";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { HabitCustomizationModal } from "./habit-customization-modal";
import { useSelectedHabit } from "@/lib/hooks/use-search-params";
import { useDialog } from "@/lib/contexts/dialog-context";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HabitModal() {
  const { selectedDate } = useUIStore();
  const { selectedHabitId, closeHabit, isOpen } = useSelectedHabit();
  const { getHabitWithProgress, markComplete, undoComplete, deleteHabit } =
    useHabitsStore();
  const { confirm } = useDialog();

  const habit = selectedHabitId ? getHabitWithProgress(selectedHabitId) : null;
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  if (!isOpen || !habit) return null;

  const IconComponent =
    ((LucideIcons as any)[habit.icon] as LucideIcon) || LucideIcons.Circle;

  const getSubtitle = () => {
    if (habit.habitType === "counter") {
      const currentCount = habit.progress?.count || 0;
      return `${
        habit.frequency === "daily" ? "Cada dia" : "Semanal"
      }, ${currentCount}/${habit.targetCount}`;
    } else if (habit.habitType === "timer") {
      const currentMinutes = habit.progress?.minutesSpent || 0;
      return `Timer: ${currentMinutes}/${habit.targetMinutes} minutos`;
    } else if (habit.habitType === "pomodoro") {
      const currentSessions = habit.progress?.pomodoroSessions || 0;
      return `Pomodoro: ${currentSessions}/${habit.targetCount} sessões`;
    }
    return "";
  };

  const handleClose = () => {
    closeHabit();
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Excluir hábito",
      description: "Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (confirmed) {
      deleteHabit(habit.id);
      closeHabit();
    }
  };

  const renderControl = () => {
    if (habit.habitType === "counter") {
      const currentCount = habit.progress?.count || 0;

      return (
        <CounterControl
          count={currentCount}
          targetCount={habit.targetCount}
          color={habit.color}
          onIncrement={() => markComplete(habit.id, selectedDate)}
          onDecrement={() => undoComplete(habit.id, selectedDate)}
          onFastComplete={() => {
            const remaining = habit.targetCount - currentCount;
            if (remaining > 0) {
              for (let i = 0; i < remaining; i++) {
                markComplete(habit.id, selectedDate);
              }
            }
          }}
          onUndo={() => undoComplete(habit.id, selectedDate)}
        />
      );
    } else if (habit.habitType === "timer") {
      const currentMinutes = habit.progress?.minutesSpent || 0;

      return (
        <TimerControl
          targetMinutes={habit.targetMinutes || 20}
          currentMinutes={currentMinutes}
          color={habit.color}
          onUpdate={(minutes) => {
            // Update timer progress in store
            const store = useHabitsStore.getState();
            store.updateTimer(habit.id, selectedDate, minutes);
          }}
        />
      );
    } else if (habit.habitType === "pomodoro") {
      const currentSessions = habit.progress?.pomodoroSessions || 0;

      return (
        <PomodoroControl
          targetSessions={habit.targetCount}
          currentSessions={currentSessions}
          workMinutes={habit.pomodoroWork || 25}
          breakMinutes={habit.pomodoroBreak || 5}
          color={habit.color}
          onUpdate={(sessions) => {
            // Update pomodoro progress in store
            const store = useHabitsStore.getState();
            store.updatePomodoro(habit.id, selectedDate, sessions);
          }}
        />
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/5 backdrop-blur-xs" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl",
          "bg-background/95 backdrop-blur-3xl border border-white/15 p-6",
          "shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
          "animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0",
          "duration-300"
        )}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl backdrop-blur-xl border shadow-lg"
              style={{
                backgroundColor: habit.backgroundColor || habit.color + "40",
                borderColor: habit.color + "50",
              }}
            >
              <IconComponent
                className="h-7 w-7"
                style={{ color: habit.color }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{habit.title}</h2>
              <p className="text-sm text-white/60">{getSubtitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10 shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10 shadow-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-background/95 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
              >
                <DropdownMenuItem
                  onClick={() => {
                    setIsCustomizationOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Estatísticas</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDelete();
                  }}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-6">
          {habit.streak > 0 && (
            <Badge
              variant="warning"
              className="mb-2 backdrop-blur-xl shadow-lg"
            >
              🔥 {habit.streak} dias de sequência
            </Badge>
          )}
        </div>

        <div>{renderControl()}</div>
      </div>

      {selectedHabitId && (
        <HabitCustomizationModal
          habitId={selectedHabitId}
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
        />
      )}
    </div>
  );
}
