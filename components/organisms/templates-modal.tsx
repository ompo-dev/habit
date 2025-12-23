"use client";

import { useState, useEffect } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CategoryTabs } from "@/components/molecules/category-tabs";
import { TemplateCard } from "@/components/molecules/template-card";
import { HabitCreationModal } from "@/components/organisms/habit-creation-modal";
import {
  useAddToGroup,
  useHabitTemplatesModal,
  useHabitCreationModal,
} from "@/lib/hooks/use-search-params";
import { HABIT_TEMPLATES } from "@/lib/utils/habit-helpers";
import type { HabitCategory } from "@/lib/types/habit";

export function TemplatesModal() {
  const { isOpen: isTemplatesModalOpen, close: closeTemplatesModal } =
    useHabitTemplatesModal();
  const { openCreate: openCreationModal } = useHabitCreationModal();
  const { addingToGroupId, isAdding, cancelAdding } = useAddToGroup();

  const [selectedCategory, setSelectedCategory] = useState<
    HabitCategory | "todos"
  >("todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isTemplatesModalOpen || isAdding) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTemplatesModalOpen, isAdding]);

  if (!isTemplatesModalOpen && !isAdding) return null;

  const filteredTemplates = HABIT_TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === "todos" || template.category === selectedCategory;
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: (typeof HABIT_TEMPLATES)[0]) => {
    // Salva template no sessionStorage para o modal de criação pegar
    sessionStorage.setItem("selectedHabitTemplate", JSON.stringify(template));
    openCreationModal();
  };

  const handleCreateCustom = () => {
    // Remove template do sessionStorage
    sessionStorage.removeItem("selectedHabitTemplate");
    openCreationModal();
  };

  const handleClose = () => {
    closeTemplatesModal();
    setSearchQuery("");
    // Cancela o modo de adição ao grupo
    if (isAdding) {
      cancelAdding();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl",
            "bg-background/95 backdrop-blur-3xl border border-white/15 p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col",
            "animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0",
            "duration-300"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Modelos</h2>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <CategoryTabs
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <button
            onClick={handleCreateCustom}
            className={cn(
              "flex items-center gap-3 rounded-2xl p-4 mb-4",
              "bg-primary/20 hover:bg-primary/30 transition-all backdrop-blur-xl",
              "border-2 border-primary/40 shadow-lg"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/40">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">
                Criar um hábito personalizado
              </h3>
            </div>
          </button>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 mb-3">
              Mais populares
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto -mx-6 px-6 scrollbar-thin">
            <div className="flex flex-col gap-3 pb-4">
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={index}
                  template={template}
                  onClick={() => handleSelectTemplate(template)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full rounded-xl bg-white/10 px-12 py-3 backdrop-blur-xl border border-white/10",
                  "text-white placeholder:text-white/40",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
