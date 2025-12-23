"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import {
  useGroupCreationModal,
  useGroupTemplatesModal,
} from "@/lib/hooks/use-search-params";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

  if (!isOpen) return null;

  const handleClose = () => {
    closeModal();
    closeTemplatesModal();
    // Limpa template do sessionStorage
    sessionStorage.removeItem("selectedGroupTemplate");
  };

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
    handleClose();
  };

  const IconComponent = (LucideIcons as any)[selectedIcon] as LucideIcon;

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center sm:items-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto",
          "bg-background/95 backdrop-blur-3xl border border-white/15 p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
          "animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0",
          "duration-300"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/95 pb-4 border-b border-white/10 backdrop-blur-xl z-10">
          <h2 className="text-2xl font-bold text-white">
            {editingGroupId
              ? "Editar Grupo"
              : sessionStorage.getItem("selectedGroupTemplate")
              ? "Personalizar Grupo"
              : "Criar Grupo"}
          </h2>
          <button
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
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
          <p className="text-sm text-white/60 mb-3">Preview</p>
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-xl border shadow-lg"
              style={{
                backgroundColor: selectedColor + "30",
                borderColor: selectedColor + "50",
              }}
            >
              {IconComponent && (
                <IconComponent
                  className="h-8 w-8"
                  style={{ color: selectedColor }}
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {name || "Nome do grupo"}
              </h3>
              <p className="text-sm text-white/60">
                {(() => {
                  const saved = sessionStorage.getItem("selectedGroupTemplate");
                  return saved
                    ? JSON.parse(saved).description
                    : "Organize seus hábitos";
                })()}
              </p>
            </div>
          </div>
        </div>

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
          <div className="grid grid-cols-6 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-2 rounded-xl bg-white/5 border border-white/10">
            {POPULAR_ICONS.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName] as LucideIcon;
              const isSelected = selectedIcon === iconName;

              return (
                <button
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all backdrop-blur-xl border",
                    isSelected
                      ? "bg-white/20 ring-2 ring-white/50 border-white/30"
                      : "bg-white/5 hover:bg-white/10 border-white/10"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5 text-white" />}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cores */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Cor *
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {COLORS.map((color) => {
              const isSelected = selectedColor === color.value;

              return (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all backdrop-blur-xl border",
                    isSelected
                      ? "bg-white/20 ring-2 ring-white/50 border-white/30"
                      : "bg-white/5 hover:bg-white/10 border-white/10"
                  )}
                >
                  <div
                    className="h-10 w-10 rounded-lg shadow-lg"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-white/80">{color.name}</span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Espaçamento final */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
