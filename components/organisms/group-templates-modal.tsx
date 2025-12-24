"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Search, Sparkles, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GroupCreationModal } from "@/components/organisms/group-creation-modal";
import {
  useGroupTemplatesModal,
  useGroupCreationModal,
} from "@/lib/hooks/use-search-params";
import {
  GROUP_TEMPLATES,
  type GroupTemplate,
} from "@/lib/utils/group-templates";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function GroupTemplatesModal() {
  const { isOpen: isGroupTemplatesModalOpen, close: closeGroupTemplatesModal } =
    useGroupTemplatesModal();
  const { openCreate: openCreationModal } = useGroupCreationModal();

  const [searchQuery, setSearchQuery] = useState("");
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isGroupTemplatesModalOpen) {
      document.body.style.overflow = "hidden";
      isMountedRef.current = true;
    } else {
      document.body.style.overflow = "unset";
      // Delay para garantir que o drag termine antes de desmontar
      const timeout = setTimeout(() => {
        isMountedRef.current = false;
      }, 300);
      return () => clearTimeout(timeout);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGroupTemplatesModalOpen]);

  const filteredTemplates = GROUP_TEMPLATES.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = useCallback(
    (template: GroupTemplate) => {
      // Salva template no sessionStorage
      sessionStorage.setItem("selectedGroupTemplate", JSON.stringify(template));
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
    sessionStorage.removeItem("selectedGroupTemplate");
    // Delay pequeno para garantir que o drag termine
    setTimeout(() => {
      if (isMountedRef.current) {
        openCreationModal();
      }
    }, 50);
  }, [openCreationModal]);

  const handleClose = useCallback(() => {
    closeGroupTemplatesModal();
    setSearchQuery("");
  }, [closeGroupTemplatesModal]);

  // Handler para drag - fecha o modal quando arrastar para baixo
  // useCallback garante que a função seja estável e não seja recriada
  // SEMPRE definido, mesmo quando o modal está fechado, para evitar erros
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Verifica se o componente ainda está montado E se o modal ainda está aberto
      if (!isMountedRef.current || !isGroupTemplatesModalOpen) return;

      // Fecha se arrastou para baixo mais de 100px ou com velocidade alta
      if (info.offset.y > 100 || info.velocity.y > 500) {
        handleClose();
      }
    },
    [handleClose, isGroupTemplatesModalOpen]
  );

  // Se o modal não estiver aberto, ainda renderiza mas escondido para manter as funções no escopo
  if (!isGroupTemplatesModalOpen) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isGroupTemplatesModalOpen && (
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
            drag={isGroupTemplatesModalOpen ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl",
              "bg-background/95 backdrop-blur-3xl  shadow-[0_20px_60px_0_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col",
              "cursor-grab active:cursor-grabbing"
            )}
            style={{ touchAction: "pan-y" }}
          >
            {/* Handle para arrastar - indicador visual */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/30 z-20" />
            {/* Header fixo com fundo */}
            <div className="relative pt-6 px-6 pb-0 bg-background/95 backdrop-blur-xl border-b border-white/10 z-10">
              <div className="flex items-center justify-between pb-4 mb-4">
                <h2 className="text-2xl font-bold text-white">Grupos</h2>
                <button
                  onClick={handleClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={handleCreateCustom}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-4 mb-4",
                  "bg-primary/20 hover:bg-primary/30 transition-all backdrop-blur-xl",
                  "border-2 border-primary/40 shadow-lg w-full"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/40">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    Criar um grupo personalizado
                  </h3>
                </div>
              </button>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-white/60 mb-3">
                  Grupos populares
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto -mx-6 px-6 scrollbar-thin py-4">
              <div className="flex flex-col gap-3 pb-4 px-6">
                {filteredTemplates.map((template, index) => {
                  const IconComponent =
                    ((LucideIcons as any)[template.icon] as LucideIcon) ||
                    LucideIcons.FolderPlus;

                  return (
                    <button
                      key={index}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl p-4 transition-all w-full text-left",
                        "backdrop-blur-xl border shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]",
                        "hover:scale-[1.02] hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.35)] active:scale-[0.98] cursor-pointer"
                      )}
                      style={{
                        backgroundColor: template.color + "20",
                        borderColor: template.color + "30",
                      }}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-lg border"
                        style={{
                          backgroundColor: template.color + "30",
                          borderColor: template.color + "40",
                        }}
                      >
                        <IconComponent
                          className="h-6 w-6"
                          style={{ color: template.color }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-white/60 truncate">
                          {template.description}
                        </p>
                      </div>

                      <FolderPlus className="h-6 w-6 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-0 mt-4 border-t border-white/10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar grupos"
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
