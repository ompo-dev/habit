"use client";

import { useState, useEffect } from "react";
import { X, Search, Sparkles, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GroupCreationModal } from "@/components/organisms/group-creation-modal";
import { useGroupTemplatesModal, useGroupCreationModal } from "@/lib/hooks/use-search-params";
import { GROUP_TEMPLATES, type GroupTemplate } from "@/lib/utils/group-templates";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function GroupTemplatesModal() {
  const { isOpen: isGroupTemplatesModalOpen, close: closeGroupTemplatesModal } = useGroupTemplatesModal();
  const { openCreate: openCreationModal } = useGroupCreationModal();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isGroupTemplatesModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGroupTemplatesModalOpen]);

  if (!isGroupTemplatesModalOpen) return null;

  const filteredTemplates = GROUP_TEMPLATES.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: GroupTemplate) => {
    // Salva template no sessionStorage
    sessionStorage.setItem('selectedGroupTemplate', JSON.stringify(template));
    openCreationModal();
  };

  const handleCreateCustom = () => {
    // Remove template do sessionStorage
    sessionStorage.removeItem('selectedGroupTemplate');
    openCreationModal();
  };

  const handleClose = () => {
    closeGroupTemplatesModal();
    setSearchQuery("");
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
              "border-2 border-primary/40 shadow-lg"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/40">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Criar um grupo personalizado</h3>
            </div>
          </button>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 mb-3">Grupos populares</h3>
          </div>

          <div className="flex-1 overflow-y-auto -mx-6 px-6 scrollbar-thin">
            <div className="flex flex-col gap-3 pb-4">
              {filteredTemplates.map((template, index) => {
                const IconComponent =
                  ((LucideIcons as any)[template.icon] as LucideIcon) || LucideIcons.FolderPlus;

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
                      <IconComponent className="h-6 w-6" style={{ color: template.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{template.name}</h3>
                      <p className="text-sm text-white/60 truncate">{template.description}</p>
                    </div>

                    <FolderPlus className="h-6 w-6 text-white/40 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
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
        </div>
      </div>
    </>
  );
}

