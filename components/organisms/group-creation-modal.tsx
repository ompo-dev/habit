"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import {
  useGroupCreationModal,
  useGroupTemplatesModal,
} from "@/lib/hooks/use-search-params";
import { useModalWithCleanup } from "@/lib/hooks/use-modal";
import { IconPicker } from "@/components/molecules/icon-picker";
import { ColorPicker } from "@/components/molecules/color-picker";
import { PreviewCard } from "@/components/molecules/preview-card";
import type { GroupTemplate } from "@/lib/utils/group-templates";

// Lista de ícones populares do Lucide
const POPULAR_ICONS = [
  "Heart",
  "Zap",
  "BookOpen",
  "Dumbbell",
  "Apple",
  "Brain",
  "Briefcase",
  "Sparkles",
  "Users",
  "DollarSign",
  "Home",
  "Moon",
  "Target",
  "Trophy",
  "Star",
  "Flame",
  "Coffee",
  "Music",
  "Camera",
  "Palette",
  "Rocket",
  "Shield",
  "Crown",
  "Gem",
  "Leaf",
  "Sun",
  "Cloud",
  "Umbrella",
  "Gift",
  "Bell",
  "Flag",
  "Key",
];

// Paleta de cores
const COLORS = [
  { name: "Vermelho", value: "#ef4444" },
  { name: "Laranja", value: "#f59e0b" },
  { name: "Amarelo", value: "#fbbf24" },
  { name: "Verde Limão", value: "#84cc16" },
  { name: "Verde", value: "#10b981" },
  { name: "Esmeralda", value: "#22c55e" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Violeta", value: "#8b5cf6" },
  { name: "Roxo", value: "#a78bfa" },
  { name: "Rosa", value: "#ec4899" },
];

export function GroupCreationModal() {
  const { addGroup, updateGroup, getGroupById } = useHabitsStore();
  const { isOpen, editingGroupId, close: closeModal } = useGroupCreationModal();
  const { close: closeTemplatesModal } = useGroupTemplatesModal();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Target");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  useEffect(() => {
    if (isOpen) {
      if (editingGroupId) {
        const group = getGroupById(editingGroupId);
        if (group) {
          setName(group.name);
          setSelectedIcon(group.icon);
          setSelectedColor(group.color);
        }
      } else {
        // Tenta carregar template do sessionStorage
        const savedTemplate = sessionStorage.getItem("selectedGroupTemplate");

        if (savedTemplate) {
          const template = JSON.parse(savedTemplate);
          setName(template.name);
          setSelectedIcon(template.icon);
          setSelectedColor(template.color);
        } else {
          // Reset para valores padrão
          setName("");
          setSelectedIcon("Target");
          setSelectedColor("#3b82f6");
        }
      }
    }
  }, [editingGroupId, isOpen, getGroupById]);

  const { handleClose: handleCloseWithCleanup } = useModalWithCleanup(
    isOpen,
    "selectedGroupTemplate",
    () => {
      closeModal();
      closeTemplatesModal();
    }
  );

  const handleSave = async () => {
    if (editingGroupId) {
      await updateGroup(editingGroupId, {
        name,
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      await addGroup({
        name,
        icon: selectedIcon,
        color: selectedColor,
      });
    }
    handleCloseWithCleanup();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-60 flex items-end justify-center sm:items-center"
          onClick={handleCloseWithCleanup}
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
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto",
              "bg-background/95 backdrop-blur-3xl border border-white/15 p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]"
            )}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6 sticky top-0 bg-background/95 pb-4 border-b border-white/10 backdrop-blur-xl z-10"
            >
              <h2 className="text-2xl font-bold text-white">
                {editingGroupId
                  ? "Editar Grupo"
                  : sessionStorage.getItem("selectedGroupTemplate")
                  ? "Personalizar Grupo"
                  : "Criar Grupo"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!name}
                className={cn(
                  "flex h-10 px-6 items-center justify-center rounded-full transition-all font-medium shadow-lg",
                  name
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-white/10 cursor-not-allowed opacity-50 text-white/40"
                )}
              >
                <Check className="h-5 w-5 mr-2" />
                {editingGroupId
                  ? "Salvar"
                  : sessionStorage.getItem("selectedGroupTemplate")
                  ? "Add"
                  : "Criar"}
              </motion.button>
            </motion.div>

        {/* Preview */}
        <PreviewCard
          icon={selectedIcon}
          title={name}
          subtitle={
            (() => {
              const saved = sessionStorage.getItem("selectedGroupTemplate");
              return saved
                ? JSON.parse(saved).description
                : "Organize seus hábitos";
            })()
          }
          color={selectedColor}
        />

        {/* Nome */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Nome do Grupo *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
            placeholder="Ex: Saúde, Produtividade, Estudos..."
          />
        </div>

        {/* Ícones */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Ícone *
          </label>
          <IconPicker
            icons={POPULAR_ICONS}
            selectedIcon={selectedIcon}
            onSelect={setSelectedIcon}
          />
        </div>

        {/* Cores */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Cor *
          </label>
          <ColorPicker
            colors={COLORS}
            selectedColor={selectedColor}
            onSelect={(color) =>
              setSelectedColor(typeof color === "string" ? color : color.primary)
            }
          />
        </div>

            {/* Espaçamento final */}
            <div className="h-4"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
