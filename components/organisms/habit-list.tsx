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
import { useHydratedValue } from "@/lib/hooks/use-hydration";
import { useEffect, useRef } from "react";

export function HabitList() {
  const { selectedDate } = useUIStore();
  const {
    getHabitsWithProgress,
    getHabitsByGroup,
    groups,
    markComplete,
    undoComplete,
    deleteGroup,
  } = useHabitsStore();
  const { isGroupOpen, toggleGroup, openGroups, openGroup } = useOpenGroups();
  const { openHabit } = useSelectedHabit();
  const { startAddingToGroup } = useAddToGroup();
  const { open: openTemplatesModal } = useHabitTemplatesModal();
  const hasInitialized = useRef(false);

  const handleAddToGroup = (groupId: string) => {
    startAddingToGroup(groupId);
    openTemplatesModal();
  };

  const { confirm } = useDialog();

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    const confirmed = await confirm({
      title: "Excluir grupo",
      description: `Tem certeza que deseja excluir o grupo "${groupName}"?\n\nOs hábitos deste grupo não serão excluídos, apenas removidos do grupo.`,
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (confirmed) {
      await deleteGroup(groupId);
    }
  };

  // Previne erro de hidratação - só mostra dados após montar no cliente
  const allHabits = useHydratedValue(
    () => getHabitsWithProgress(selectedDate),
    []
  );
  const ungroupedHabits = allHabits.filter((h) => !h.groupId);

  // Abre todos os grupos por padrão na primeira renderização
  useEffect(() => {
    if (
      !hasInitialized.current &&
      groups.length > 0 &&
      openGroups.length === 0
    ) {
      hasInitialized.current = true;
      // Abre todos os grupos (mesmo os vazios)
      groups.forEach((group) => {
        openGroup(group.id);
      });
    }
  }, [groups, openGroups, openGroup]);

  if (allHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Target className="h-16 w-16 text-white/20" />
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {groups.map((group, groupIndex) => {
        const groupHabits = getHabitsByGroup(group.id);
        const isExpanded = isGroupOpen(group.id);

        return (
          <motion.div
            key={group.id}
            variants={itemVariants}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
                        className="flex items-center gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToGroup(group.id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl p-4 transition-all backdrop-blur-xl border border-dashed border-white/20 hover:border-primary/40 hover:bg-primary/10 text-white/60 hover:text-primary"
                        >
                          <Plus className="h-5 w-5" />
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
                          title={`Excluir grupo "${group.name}"`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
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
                        >
                          <Plus className="h-5 w-5" />
                          Adicionar primeiro hábito
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleDeleteGroup(group.id, group.name)
                          }
                          className="flex items-center justify-center rounded-full p-3 transition-all bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 text-red-500 hover:text-red-400"
                          title={`Excluir grupo "${group.name}"`}
                        >
                          <Trash2 className="h-5 w-5" />
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
    </motion.div>
  );
}
