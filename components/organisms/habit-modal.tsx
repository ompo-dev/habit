"use client";

import { useEffect, useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useHabitProgress } from "@/lib/hooks/use-habit-progress";
import { useModalBodyLock } from "@/lib/hooks/use-modal";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HabitWithProgress } from "@/lib/types/habit";

export const HabitModal = memo(function HabitModal() {
  const { selectedDate } = useUIStore();
  const { selectedHabitId, closeHabit, isOpen } = useSelectedHabit();
  const { getHabitWithProgress, markComplete, undoComplete, deleteHabit } =
    useHabitsStore();
  const { confirm } = useDialog();

  const habit = selectedHabitId ? getHabitWithProgress(selectedHabitId) : null;
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hooks devem ser chamados sempre, antes de qualquer return condicional
  useModalBodyLock(isOpen);
  // Passa null seguro para o hook quando habit não existe (garante que não seja undefined)
  const { getSubtitle } = useHabitProgress(habit ?? null);

  // Memoiza IconComponent para evitar recálculos (só quando habit existe)
  const IconComponent = useMemo(
    () =>
      habit
        ? ((LucideIcons as any)[habit.icon] as LucideIcon) || LucideIcons.Circle
        : LucideIcons.Circle,
    [habit?.icon]
  );

  // Return condicional DEPOIS de todos os hooks
  if (!isOpen || !habit) return null;

  const handleClose = () => {
    closeHabit();
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Excluir hábito",
      description:
        "Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.",
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
    <AnimatePresence>
      {isOpen && habit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="habit-modal-title"
          aria-describedby="habit-modal-description"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl",
              "bg-background/95 backdrop-blur-3xl border border-white/15 p-6",
              "shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]"
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-start justify-between mb-6"
            >
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="flex h-14 w-14 items-center justify-center rounded-xl backdrop-blur-xl border shadow-lg"
                  style={{
                    backgroundColor:
                      habit.backgroundColor || habit.color + "40",
                    borderColor: habit.color + "50",
                  }}
                >
                  <IconComponent
                    className="h-7 w-7"
                    style={{ color: habit.color }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2
                    id="habit-modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    {habit.title}
                  </h2>
                  <p
                    id="habit-modal-description"
                    className="text-sm text-white/60"
                  >
                    {getSubtitle()}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10 shadow-lg"
                      aria-label="Menu de opções do hábito"
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen}
                      type="button"
                    >
                      <MoreVertical className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
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
                      aria-label="Editar hábito"
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
                      aria-label="Ver estatísticas do hábito"
                    >
                      <BarChart3 className="h-4 w-4" aria-hidden="true" />
                      <span>Estatísticas</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleDelete();
                      }}
                      className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 cursor-pointer"
                      aria-label="Excluir hábito"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              {habit.streak > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, type: "spring" }}
                >
                  <Badge
                    variant="warning"
                    className="mb-2 backdrop-blur-xl shadow-lg"
                    aria-label={`Sequência de ${habit.streak} dias`}
                  >
                    <span aria-hidden="true">🔥</span> {habit.streak} dias de
                    sequência
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {renderControl()}
            </motion.div>
          </motion.div>

          {selectedHabitId && (
            <HabitCustomizationModal
              habitId={selectedHabitId}
              isOpen={isCustomizationOpen}
              onClose={() => setIsCustomizationOpen(false)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
