import type { Habit, Progress, HabitWithProgress } from "@/lib/types/habit";
import { getDateString } from "./date-helpers";

export { getDateString } from "./date-helpers";

export function calculateStreak(progress: Progress[]): number {
  if (progress.length === 0) return 0;

  const sortedProgress = [...progress]
    .filter((p) => p.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedProgress.length === 0) return 0;

  let streak = 0;
  const currentDate = new Date();

  for (const p of sortedProgress) {
    const progressDate = new Date(p.date);
    const daysDiff = Math.floor(
      (currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getTotalCompletions(progress: Progress[]): number {
  return progress.filter((p) => p.completed).length;
}

export function getProgressForDate(
  progress: Progress[],
  date: Date
): Progress | null {
  const dateString = getDateString(date);
  return progress.find((p) => p.date === dateString) || null;
}

export function combineHabitWithProgress(
  habit: Habit,
  allProgress: Progress[],
  date: Date = new Date()
): HabitWithProgress {
  const habitProgress = allProgress.filter((p) => p.habitId === habit.id);
  const dayProgress = getProgressForDate(habitProgress, date);

  return {
    ...habit,
    progress: dayProgress,
    streak: calculateStreak(habitProgress),
    totalCompletions: getTotalCompletions(habitProgress),
  };
}

export const HABIT_TEMPLATES = [
  {
    title: "Beber água",
    icon: "Droplet",
    color: "#60a5fa",
    backgroundColor: "#1e3a8a",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 8,
    description: "8 copos de água por dia",
  },
  {
    title: "Fazer a cama",
    icon: "Bed",
    color: "#a78bfa",
    backgroundColor: "#4c1d95",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Arrumar a cama ao acordar",
  },
  {
    title: "Ler livro",
    icon: "BookOpen",
    color: "#fbbf24",
    backgroundColor: "#78350f",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 30,
    description: "Ler por 30 minutos",
  },
  {
    title: "Estudar programação",
    icon: "Code",
    color: "#ec4899",
    backgroundColor: "#831843",
    category: "tarefas" as const,
    frequency: "daily" as const,
    habitType: "pomodoro" as const,
    targetCount: 4,
    pomodoroWork: 25,
    pomodoroBreak: 5,
    description: "4 sessões pomodoro de estudo",
  },
  {
    title: "Treino academia",
    icon: "Dumbbell",
    color: "#10b981",
    backgroundColor: "#064e3b",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 60,
    description: "1 hora de treino",
  },
  {
    title: "Não petiscar",
    icon: "Cookie",
    color: "#ef4444",
    backgroundColor: "#7f1d1d",
    category: "maus" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Evitar petiscos entre refeições",
  },
  {
    title: "Meditar",
    icon: "Brain",
    color: "#8b5cf6",
    backgroundColor: "#4c1d95",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 15,
    description: "15 minutos de meditação",
  },
  {
    title: "Revisar inglês",
    icon: "Languages",
    color: "#f59e0b",
    backgroundColor: "#78350f",
    category: "tarefas" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 20,
    description: "20 minutos de inglês",
  },
  {
    title: "Tomar vitaminas",
    icon: "Pill",
    color: "#f472b6",
    backgroundColor: "#831843",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Tomar suplementos vitamínicos",
  },
  {
    title: "Alongamento",
    icon: "Stretch",
    color: "#06b6d4",
    backgroundColor: "#164e63",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 10,
    description: "10 minutos de alongamento",
  },
  {
    title: "Escovar os dentes",
    icon: "Sparkles",
    color: "#22d3ee",
    backgroundColor: "#155e75",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 3,
    description: "Escovar 3 vezes ao dia",
  },
  {
    title: "Revisar finanças",
    icon: "DollarSign",
    color: "#84cc16",
    backgroundColor: "#365314",
    category: "tarefas" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Revisar gastos diários",
  },
  {
    title: "Gratidão",
    icon: "Heart",
    color: "#fb7185",
    backgroundColor: "#881337",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 3,
    description: "Listar 3 coisas pelas quais sou grato",
  },
  {
    title: "Caminhada",
    icon: "Footprints",
    color: "#14b8a6",
    backgroundColor: "#134e4a",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 30,
    description: "30 minutos de caminhada",
  },
  {
    title: "Não fumar",
    icon: "Cigarette",
    color: "#f87171",
    backgroundColor: "#7f1d1d",
    category: "maus" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Evitar cigarros",
  },
  {
    title: "Não usar redes sociais",
    icon: "Smartphone",
    color: "#fb923c",
    backgroundColor: "#7c2d12",
    category: "maus" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Limitar uso de redes sociais",
  },
  {
    title: "Café da manhã saudável",
    icon: "Apple",
    color: "#4ade80",
    backgroundColor: "#14532d",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Café nutritivo",
  },
  {
    title: "Organizar mesa",
    icon: "Layout",
    color: "#a855f7",
    backgroundColor: "#581c87",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Manter mesa organizada",
  },
  {
    title: "Dormir cedo",
    icon: "Moon",
    color: "#818cf8",
    backgroundColor: "#312e81",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Dormir antes das 23h",
  },
  {
    title: "Praticar violão",
    icon: "Music",
    color: "#fbbf24",
    backgroundColor: "#78350f",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 30,
    description: "Praticar 30 minutos",
  },
  {
    title: "Limpar inbox",
    icon: "Mail",
    color: "#60a5fa",
    backgroundColor: "#1e3a8a",
    category: "tarefas" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Limpar emails",
  },
  {
    title: "Não procrastinar",
    icon: "Hourglass",
    color: "#fb7185",
    backgroundColor: "#881337",
    category: "maus" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Evitar procrastinação",
  },
  {
    title: "Yoga",
    icon: "Origami",
    color: "#c084fc",
    backgroundColor: "#581c87",
    category: "saude" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 20,
    description: "20 minutos de yoga",
  },
  {
    title: "Escrever diário",
    icon: "PenTool",
    color: "#fdba74",
    backgroundColor: "#7c2d12",
    category: "bons" as const,
    frequency: "daily" as const,
    habitType: "timer" as const,
    targetCount: 1,
    targetMinutes: 10,
    description: "10 minutos de journaling",
  },
  {
    title: "Revisar objetivos",
    icon: "Target",
    color: "#38bdf8",
    backgroundColor: "#0c4a6e",
    category: "tarefas" as const,
    frequency: "daily" as const,
    habitType: "counter" as const,
    targetCount: 1,
    description: "Revisar metas do dia",
  },
];
