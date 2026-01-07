"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HabitCard } from "@/components/molecules/habit-card";
import { GroupHeader } from "@/components/molecules/group-header";
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useDialog } from "@/lib/contexts/dialog-context";
import { Target, Plus, Trash2 } from "lucide-react";
import {
  useOpenGroups,
  useSelectedHabit,
  useAddToGroup,
  useHabitTemplatesModal,
} from "@/lib/hooks/use-search-params";
import { useHydration } from "@/lib/hooks/use-hydration";
import { useEffect, useRef, useMemo } from "react";

export const HabitList = function HabitList() {
  const { selectedDate } = useUIStore();
  const {
    getHabitsWithProgress,
    getHabitsByGroup,
    getGroupsForDate,
    markComplete,
    undoComplete,
    deleteGroup,
  } = useHabitsStore();
  const { isGroupOpen, toggleGroup, openGroups, openGroup } = useOpenGroups();
  const { openHabit } = useSelectedHabit();
  const { startAddingToGroup } = useAddToGroup();
  const { open: openTemplatesModal } = useHabitTemplatesModal();

  const handleAddToGroup = (groupId: string) => {
    startAddingToGroup(groupId);
    openTemplatesModal();
  };

  const { confirm } = useDialog();

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    const groupHabits = getHabitsByGroup(groupId);
    const habitCount = groupHabits.length;

    const confirmed = await confirm({
      title: "Excluir grupo",
      description: `Tem certeza que deseja excluir o grupo "${groupName}"?\n\n${
        habitCount > 0
          ? `Todos os ${habitCount} hábito${
              habitCount > 1 ? "s" : ""
            } deste grupo também serão excluído${habitCount > 1 ? "s" : ""}.`
          : "Este grupo está vazio."
      }`,
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (confirmed) {
      await deleteGroup(groupId);
    }
  };

  // Previne erro de hidratação - só mostra dados após montar no cliente
  // Mas ainda reage a mudanças no store
  const isHydrated = useHydration();

  // Obtém dados diretamente do store - Zustand notifica automaticamente quando mudam
  const allHabits = isHydrated ? getHabitsWithProgress(selectedDate) : [];
  const hydratedGroups = isHydrated ? getGroupsForDate(selectedDate) : [];

  // Memoiza ungroupedHabits para evitar recálculos desnecessários
  const ungroupedHabits = useMemo(
    () => allHabits.filter((h) => !h.groupId),
    [allHabits]
  );

  // Mostra mensagem vazia apenas se não houver hábitos E não houver grupos
  if (allHabits.length === 0 && hydratedGroups.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16"
        role="status"
        aria-live="polite"
      >
        <Target className="h-16 w-16 text-white/20" aria-hidden="true" />
        <p className="text-center text-white/60">
          Nenhum hábito criado ainda.
          <br />
          Toque no + para começar!
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
    },
  };

  return (
    <div className="flex flex-col gap-4">
      {hydratedGroups.map((group, groupIndex) => {
        const groupHabits = getHabitsByGroup(group.id);
        const isExpanded = isGroupOpen(group.id);

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              delay: groupIndex * 0.05,
            }}
            className="flex flex-col gap-3"
          >
            <GroupHeader
              group={group}
              isExpanded={isExpanded}
              onToggle={() => toggleGroup(group.id)}
              habitCount={groupHabits.length}
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col gap-3 px-2.5 overflow-hidden"
                >
                  {groupHabits.length > 0 ? (
                    <>
                      {groupHabits.map((habit, index) => (
                        <motion.div
                          key={habit.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <HabitCard
                            habit={habit}
                            onClick={() => openHabit(habit.id)}
                            onComplete={() =>
                              markComplete(habit.id, selectedDate)
                            }
                            onUndo={() => undoComplete(habit.id, selectedDate)}
                          />
                        </motion.div>
                      ))}
                      {/* Botões de Ação do Grupo */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupHabits.length * 0.05 + 0.1 }}
                        className="flex items-center gap-2 py-1"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToGroup(group.id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl p-4 transition-all backdrop-blur-xl border border-dashed border-white/20 hover:border-primary/40 hover:bg-primary/10 text-white/60 hover:text-primary"
                          aria-label={`Adicionar hábito ao grupo ${group.name}`}
                          type="button"
                        >
                          <Plus className="h-5 w-5" aria-hidden="true" />
                          <span className="text-sm font-medium">
                            Adicionar hábito
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleDeleteGroup(group.id, group.name)
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl p-4 transition-all backdrop-blur-xl border border-dashed border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-500/60 hover:text-red-500"
                          aria-label={`Excluir grupo ${group.name}`}
                          type="button"
                        >
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </motion.button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-2"
                    >
                      <p className="text-white/40 text-sm mb-4">
                        Nenhum hábito neste grupo ainda.
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToGroup(group.id)}
                          className="inline-flex items-center gap-2 rounded-full px-6 py-3 transition-all bg-primary/20 hover:bg-primary/30 border-2 border-primary/40 text-white font-medium"
                          aria-label={`Adicionar primeiro hábito ao grupo ${group.name}`}
                          type="button"
                        >
                          <Plus className="h-5 w-5" aria-hidden="true" />
                          Adicionar primeiro hábito
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleDeleteGroup(group.id, group.name)
                          }
                          className="flex items-center justify-center rounded-full p-3 transition-all bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 text-red-500 hover:text-red-400"
                          aria-label={`Excluir grupo ${group.name}`}
                          type="button"
                        >
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {ungroupedHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3"
        >
          {ungroupedHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <HabitCard
                habit={habit}
                onClick={() => openHabit(habit.id)}
                onComplete={() => markComplete(habit.id, selectedDate)}
                onUndo={() => undoComplete(habit.id, selectedDate)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
