"use client";

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

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const groupHabits = getHabitsByGroup(group.id);
        const isExpanded = isGroupOpen(group.id);

        return (
          <div key={group.id} className="flex flex-col gap-3">
            <GroupHeader
              group={group}
              isExpanded={isExpanded}
              onToggle={() => toggleGroup(group.id)}
              habitCount={groupHabits.length}
            />
            {isExpanded && (
              <div className="flex flex-col gap-3 px-2.5">
                {groupHabits.length > 0 ? (
                  <>
                    {groupHabits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onClick={() => openHabit(habit.id)}
                        onComplete={() => markComplete(habit.id, selectedDate)}
                        onUndo={() => undoComplete(habit.id, selectedDate)}
                      />
                    ))}
                    {/* Botões de Ação do Grupo */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToGroup(group.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl p-4 transition-all backdrop-blur-xl border border-dashed border-white/20 hover:border-primary/40 hover:bg-primary/10 text-white/60 hover:text-primary"
                      >
                        <Plus className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Adicionar hábito
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="flex items-center justify-center gap-2 rounded-2xl p-4 transition-all backdrop-blur-xl border border-dashed border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-500/60 hover:text-red-500"
                        title={`Excluir grupo "${group.name}"`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm mb-4">
                      Nenhum hábito neste grupo ainda.
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => handleAddToGroup(group.id)}
                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 transition-all bg-primary/20 hover:bg-primary/30 border-2 border-primary/40 text-white font-medium"
                      >
                        <Plus className="h-5 w-5" />
                        Adicionar primeiro hábito
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="flex items-center justify-center rounded-full p-3 transition-all bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 text-red-500 hover:text-red-400"
                        title={`Excluir grupo "${group.name}"`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {ungroupedHabits.length > 0 && (
        <div className="flex flex-col gap-3">
          {ungroupedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => openHabit(habit.id)}
              onComplete={() => markComplete(habit.id, selectedDate)}
              onUndo={() => undoComplete(habit.id, selectedDate)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
