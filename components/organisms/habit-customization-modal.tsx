"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HabitCustomizationModalProps {
  habitId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Lista de ícones populares do Lucide
const POPULAR_ICONS = [
  "Droplet",
  "Coffee",
  "BookOpen",
  "Code",
  "Dumbbell",
  "Cookie",
  "Brain",
  "Languages",
  "Pill",
  "Stretch",
  "Sparkles",
  "DollarSign",
  "Heart",
  "Footprints",
  "Cigarette",
  "Smartphone",
  "Apple",
  "Layout",
  "Moon",
  "Music",
  "Mail",
  "Hourglass",
  "Origami",
  "PenTool",
  "Target",
  "Sun",
  "Zap",
  "Star",
  "Camera",
  "Leaf",
  "Flame",
  "Trophy",
  "Clock",
  "Calendar",
  "CheckCircle",
  "Activity",
  "TrendingUp",
  "BarChart",
  "Award",
  "Bike",
  "Book",
  "Briefcase",
  "BellRing",
  "Pizza",
  "Utensils",
  "Gamepad2",
  "Laptop",
];

// Paleta de cores
const COLORS = [
  { name: "Azul", primary: "#60a5fa", background: "#1e3a8a" },
  { name: "Roxo", primary: "#a78bfa", background: "#4c1d95" },
  { name: "Rosa", primary: "#f472b6", background: "#831843" },
  { name: "Vermelho", primary: "#ef4444", background: "#7f1d1d" },
  { name: "Laranja", primary: "#fb923c", background: "#7c2d12" },
  { name: "Amarelo", primary: "#fbbf24", background: "#78350f" },
  { name: "Verde", primary: "#10b981", background: "#064e3b" },
  { name: "Verde Limão", primary: "#84cc16", background: "#365314" },
  { name: "Ciano", primary: "#06b6d4", background: "#164e63" },
  { name: "Índigo", primary: "#818cf8", background: "#312e81" },
  { name: "Violeta", primary: "#8b5cf6", background: "#4c1d95" },
  { name: "Fúcsia", primary: "#ec4899", background: "#831843" },
];

export function HabitCustomizationModal({
  habitId,
  isOpen,
  onClose,
}: HabitCustomizationModalProps) {
  const { getHabitById, updateHabit } = useHabitsStore();
  const habit = getHabitById(habitId);

  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState({
    primary: "",
    background: "",
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setSelectedIcon(habit.icon);
      setSelectedColor({
        primary: habit.color,
        background: habit.backgroundColor || habit.color,
      });
    }
  }, [habit]);

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

  if (!isOpen || !habit) return null;

  const handleSave = () => {
    updateHabit(habitId, {
      title,
      icon: selectedIcon,
      color: selectedColor.primary,
      backgroundColor: selectedColor.background,
    });
    onClose();
  };

  const IconComponent = (LucideIcons as any)[selectedIcon] as LucideIcon;

  // Monitora o scroll para saber se está no topo
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      setIsAtTop(container.scrollTop === 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Handler para drag - fecha o modal quando arrastar para baixo
  // useCallback garante que a função seja estável
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Só fecha se estiver no topo E arrastou para baixo mais de 100px ou com velocidade alta
      if (isAtTop && (info.offset.y > 100 || info.velocity.y > 500)) {
        onClose();
      }
    },
    [onClose, isAtTop]
  );

  const handleDragStart = useCallback(() => {
    // Só permite drag se estiver no topo
    if (!isAtTop && scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "hidden";
    }
  }, [isAtTop]);

  const handleDrag = useCallback(() => {
    // Restaura scroll durante o drag se não estiver no topo
    if (!isAtTop && scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "auto";
    }
  }, [isAtTop]);

  return (
    <AnimatePresence>
      {isOpen && habit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            ref={scrollContainerRef}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            drag={isAtTop ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            dragListener={isAtTop}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh]",
              "bg-background/95 backdrop-blur-3xl shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
              "flex flex-col",
              isAtTop ? "cursor-grab active:cursor-grabbing" : ""
            )}
            style={{ touchAction: isAtTop ? "pan-y" : "auto" }}
          >
            {/* Handle para arrastar - indicador visual */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/30 z-20" />
            {/* Header fixo com fundo */}
            <div className="relative pt-6 px-6 pb-0 bg-background/95 backdrop-blur-xl border-b border-white/10 z-10">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-bold text-white">
                  Personalizar Hábito
                </h2>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Preview */}
              <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
                <p className="text-sm text-white/60 mb-3">Preview</p>
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: selectedColor.background }}
                  >
                    {IconComponent && (
                      <IconComponent
                        className="h-8 w-8"
                        style={{ color: selectedColor.primary }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {title || "Nome do hábito"}
                    </h3>
                    <p className="text-sm text-white/60">{habit.category}</p>
                  </div>
                </div>
              </div>

              {/* Nome */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Nome do Hábito
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
                  placeholder="Digite o nome..."
                />
              </div>

              {/* Ícones */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  Ícone
                </label>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
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
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
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
                  Cor
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {COLORS.map((color) => {
                    const isSelected = selectedColor.primary === color.primary;

                    return (
                      <button
                        key={color.name}
                        onClick={() =>
                          setSelectedColor({
                            primary: color.primary,
                            background: color.background,
                          })
                        }
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all backdrop-blur-xl border",
                          isSelected
                            ? "bg-white/20 ring-2 ring-white/50 border-white/30"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        )}
                      >
                        <div
                          className="h-10 w-10 rounded-lg"
                          style={{ backgroundColor: color.primary }}
                        />
                        <span className="text-xs text-white/80">
                          {color.name}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-medium backdrop-blur-xl border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all font-medium shadow-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
