"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isTemplatesModalOpen || isAdding) {
      document.body.style.overflow = "hidden";
      isMountedRef.current = true;
    } else {
      document.body.style.overflow = "unset";
      // Delay para garantir que o drag termine antes de desmontar
      setTimeout(() => {
        isMountedRef.current = false;
      }, 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTemplatesModalOpen, isAdding]);

  const filteredTemplates = useMemo(() => {
    return HABIT_TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "todos" || template.category === selectedCategory;
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = useCallback(
    (template: (typeof HABIT_TEMPLATES)[0]) => {
      // Salva template no sessionStorage para o modal de criação pegar
      sessionStorage.setItem("selectedHabitTemplate", JSON.stringify(template));
      // Delay pequeno para garantir que o drag termine
      setTimeout(() => {
        if (isMountedRef.current) {
          openCreationModal();
        }
      }, 50);
    },
    [openCreationModal]
  );

  const handleCreateCustom = useCallback(() => {
    // Remove template do sessionStorage
    sessionStorage.removeItem("selectedHabitTemplate");
    // Delay pequeno para garantir que o drag termine
    setTimeout(() => {
      if (isMountedRef.current) {
        openCreationModal();
      }
    }, 50);
  }, [openCreationModal]);

  const handleClose = useCallback(() => {
    closeTemplatesModal();
    setSearchQuery("");
    // Cancela o modo de adição ao grupo
    if (isAdding) {
      cancelAdding();
    }
  }, [closeTemplatesModal, isAdding, cancelAdding]);

  // Handler para drag - fecha o modal quando arrastar para baixo
  // useCallback garante que a função seja estável e não seja recriada
  // SEMPRE definido, mesmo quando o modal está fechado, para evitar erros
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Verifica se o componente ainda está montado E se o modal ainda está aberto
      if (!isMountedRef.current || (!isTemplatesModalOpen && !isAdding)) return;

      // Fecha se arrastou para baixo mais de 100px ou com velocidade alta
      if (info.offset.y > 100 || info.velocity.y > 500) {
        handleClose();
      }
    },
    [handleClose, isTemplatesModalOpen, isAdding]
  );

  if (!isTemplatesModalOpen && !isAdding) return null;

  return (
    <AnimatePresence>
      {(isTemplatesModalOpen || isAdding) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
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
            drag={isTemplatesModalOpen || isAdding ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            dragListener={isTemplatesModalOpen || isAdding}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl",
              "bg-background/95 backdrop-blur-3xl p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col",
              "cursor-grab active:cursor-grabbing"
            )}
            style={{ touchAction: "pan-y" }}
          >
            {/* Handle para arrastar - indicador visual */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/30" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
