"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useHabitsStore } from "@/lib/stores/habits-store";
import {
  useHabitCreationModal,
  useAddToGroup,
  useHabitTemplatesModal,
} from "@/lib/hooks/use-search-params";
import { useModalWithCleanup } from "@/lib/hooks/use-modal";
import { IconPicker } from "@/components/molecules/icon-picker";
import { ColorPicker } from "@/components/molecules/color-picker";
import { PreviewCard } from "@/components/molecules/preview-card";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HabitCategory } from "@/lib/types/habit";

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
  "Activity",
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
  "Bed",
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

const CATEGORIES = [
  { value: "bons" as const, label: "Bons Hábitos" },
  { value: "saude" as const, label: "Saúde" },
  { value: "maus" as const, label: "Maus Hábitos" },
  { value: "tarefas" as const, label: "Tarefas" },
];

const HABIT_TYPES = [
  {
    value: "counter" as const,
    label: "Contador",
    description: "Marcar quantas vezes",
  },
  {
    value: "timer" as const,
    label: "Timer",
    description: "Medir tempo em minutos",
  },
  {
    value: "pomodoro" as const,
    label: "Pomodoro",
    description: "Sessões de foco",
  },
];

export function HabitCreationModal() {
  const { addHabit, groups } = useHabitsStore();
  const { isOpen, close: closeModal } = useHabitCreationModal();
  const { close: closeTemplatesModal } = useHabitTemplatesModal();
  const { addingToGroupId, cancelAdding } = useAddToGroup();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Target");
  const [selectedColor, setSelectedColor] = useState({
    primary: "#60a5fa",
    background: "#1e3a8a",
  });
  const [category, setCategory] = useState<HabitCategory>("bons");
  const [habitType, setHabitType] = useState<"counter" | "timer" | "pomodoro">(
    "counter"
  );
  const [targetCount, setTargetCount] = useState(1);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [pomodoroWork, setPomodoroWork] = useState(25);
  const [pomodoroBreak, setPomodoroBreak] = useState(5);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Tenta carregar template do sessionStorage
      const savedTemplate = sessionStorage.getItem("selectedHabitTemplate");

      if (savedTemplate) {
        const template = JSON.parse(savedTemplate);
        setTitle(template.title);
        setDescription(template.description || "");
        setSelectedIcon(template.icon);
        setSelectedColor({
          primary: template.color,
          background: template.backgroundColor,
        });
        setCategory(template.category);
        setHabitType(template.habitType);
        setTargetCount(template.targetCount);
        setTargetMinutes(template.targetMinutes || 30);
        setPomodoroWork(template.pomodoroWork || 25);
        setPomodoroBreak(template.pomodoroBreak || 5);
      } else {
        // Reset para valores padrão quando não há template
        setTitle("");
        setDescription("");
        setSelectedIcon("Target");
        setSelectedColor({ primary: "#60a5fa", background: "#1e3a8a" });
        setCategory("bons");
        setHabitType("counter");
        setTargetCount(1);
        setTargetMinutes(30);
        setPomodoroWork(25);
        setPomodoroBreak(5);
      }

      // Usa grupo pré-selecionado se houver
      setSelectedGroupId(addingToGroupId || null);
    }
  }, [isOpen, addingToGroupId]);

  const { handleClose: handleCloseWithCleanup } = useModalWithCleanup(
    isOpen,
    "selectedHabitTemplate",
    () => {
      closeModal();
      closeTemplatesModal();
      cancelAdding();
    }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const newHabit: any = {
      title,
      description,
      icon: selectedIcon,
      color: selectedColor.primary,
      backgroundColor: selectedColor.background,
      category,
      frequency: "daily" as const,
      habitType,
      targetCount,
      groupId: selectedGroupId,
    };

    if (habitType === "timer") {
      newHabit.targetMinutes = targetMinutes;
    } else if (habitType === "pomodoro") {
      newHabit.pomodoroWork = pomodoroWork;
      newHabit.pomodoroBreak = pomodoroBreak;
    }

    addHabit(newHabit);
    handleCloseWithCleanup();
  };

  // Handler para drag - fecha o modal quando arrastar para baixo
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Fecha se arrastou para baixo mais de 100px ou com velocidade alta
    if (info.offset.y > 100 || info.velocity.y > 500) {
      handleCloseWithCleanup();
    }
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
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto",
              "bg-background/95 backdrop-blur-3xl border border-white/15 p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
              "cursor-grab active:cursor-grabbing"
            )}
            style={{ touchAction: "pan-y" }}
          >
            {/* Handle para arrastar - indicador visual */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/30" />
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6 sticky top-0 bg-background/95 pb-4 border-b border-white/10 backdrop-blur-xl z-10"
            >
              <h2 className="text-2xl font-bold text-white">
                {sessionStorage.getItem("selectedHabitTemplate")
                  ? "Personalizar Hábito"
                  : "Criar Hábito"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!title}
                className={cn(
                  "flex h-10 px-6 items-center justify-center rounded-full transition-all font-medium shadow-lg",
                  title
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-white/10 cursor-not-allowed opacity-50 text-white/40"
                )}
              >
                <Check className="h-5 w-5 mr-2" />
                {sessionStorage.getItem("selectedHabitTemplate") ? "Add" : "Criar"}
              </motion.button>
            </motion.div>

        {/* Preview */}
        <PreviewCard
          icon={selectedIcon}
          title={title}
          subtitle={CATEGORIES.find((c) => c.value === category)?.label}
          color={selectedColor}
        />

        {/* Nome */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Nome do Hábito *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
            placeholder="Ex: Beber água, Ler livro..."
          />
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Descrição
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
            placeholder="Ex: 8 copos por dia..."
          />
        </div>

        {/* Grupo */}
        {groups.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              Grupo (opcional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedGroupId(null)}
                className={cn(
                  "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
                  !selectedGroupId
                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                )}
              >
                Sem grupo
              </button>
              {groups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                const GroupIcon =
                  ((LucideIcons as any)[group.icon] as LucideIcon) ||
                  LucideIcons.FolderPlus;

                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border flex items-center gap-2",
                      isSelected
                        ? "ring-2 ring-white/50 border-white/30 shadow-lg"
                        : "border-white/10 hover:bg-white/10"
                    )}
                    style={{
                      backgroundColor: isSelected
                        ? group.color + "30"
                        : "rgba(255,255,255,0.05)",
                      color: isSelected ? group.color : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <GroupIcon className="h-4 w-4" />
                    <span className="truncate">{group.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categoria */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Categoria *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "p-3 rounded-xl text-sm font-medium transition-all backdrop-blur-xl border",
                    isSelected
                      ? "bg-primary/20 border-primary/40 text-primary shadow-lg"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tipo de Hábito */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Tipo *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HABIT_TYPES.map((type) => {
              const isSelected = habitType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setHabitType(type.value)}
                  className={cn(
                    "p-4 rounded-xl text-left transition-all backdrop-blur-xl border",
                    isSelected
                      ? "bg-primary/20 border-primary/40 shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="font-semibold text-white mb-1">
                    {type.label}
                  </div>
                  <div className="text-xs text-white/60">
                    {type.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configurações específicas do tipo */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
          {habitType === "counter" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Diária
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                >
                  <Minus className="h-5 w-5 text-white" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-white">
                    {targetCount}
                  </div>
                  <div className="text-xs text-white/60">
                    {targetCount === 1 ? "vez por dia" : "vezes por dia"}
                  </div>
                </div>
                <button
                  onClick={() => setTargetCount(targetCount + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                >
                  <Plus className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          )}

          {habitType === "timer" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta de Tempo
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setTargetMinutes(Math.max(5, targetMinutes - 5))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                >
                  <Minus className="h-5 w-5 text-white" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-white">
                    {targetMinutes}
                  </div>
                  <div className="text-xs text-white/60">minutos</div>
                </div>
                <button
                  onClick={() => setTargetMinutes(targetMinutes + 5)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                >
                  <Plus className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          )}

          {habitType === "pomodoro" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Sessões por Dia
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                  >
                    <Minus className="h-5 w-5 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-white">
                      {targetCount}
                    </div>
                    <div className="text-xs text-white/60">
                      {targetCount === 1 ? "sessão" : "sessões"}
                    </div>
                  </div>
                  <button
                    onClick={() => setTargetCount(targetCount + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl border border-white/10"
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-2">
                    Tempo de Trabalho
                  </label>
                  <input
                    type="number"
                    value={pomodoroWork}
                    onChange={(e) =>
                      setPomodoroWork(
                        Math.max(1, parseInt(e.target.value) || 25)
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <p className="text-xs text-white/40 mt-1 text-center">
                    minutos
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-2">
                    Tempo de Pausa
                  </label>
                  <input
                    type="number"
                    value={pomodoroBreak}
                    onChange={(e) =>
                      setPomodoroBreak(
                        Math.max(1, parseInt(e.target.value) || 5)
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <p className="text-xs text-white/40 mt-1 text-center">
                    minutos
                  </p>
                </div>
              </div>
            </div>
          )}
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
              setSelectedColor(
                typeof color === "string"
                  ? { primary: color, background: color + "30" }
                  : color
              )
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
