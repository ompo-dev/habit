import type { HabitGroup } from "@/lib/types/habit";

export interface GroupTemplate {
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const GROUP_TEMPLATES: GroupTemplate[] = [
  {
    name: "Saúde & Bem-estar",
    icon: "Heart",
    color: "#ef4444",
    description: "Hábitos relacionados à saúde física e mental",
  },
  {
    name: "Produtividade",
    icon: "Zap",
    color: "#f59e0b",
    description: "Hábitos para aumentar sua produtividade",
  },
  {
    name: "Estudos",
    icon: "BookOpen",
    color: "#3b82f6",
    description: "Hábitos de aprendizado e desenvolvimento",
  },
  {
    name: "Fitness",
    icon: "Dumbbell",
    color: "#10b981",
    description: "Exercícios e atividades físicas",
  },
  {
    name: "Alimentação",
    icon: "Apple",
    color: "#84cc16",
    description: "Hábitos alimentares e nutrição",
  },
  {
    name: "Mindfulness",
    icon: "Brain",
    color: "#8b5cf6",
    description: "Meditação e práticas de atenção plena",
  },
  {
    name: "Trabalho",
    icon: "Briefcase",
    color: "#06b6d4",
    description: "Hábitos profissionais e de carreira",
  },
  {
    name: "Criatividade",
    icon: "Sparkles",
    color: "#ec4899",
    description: "Atividades criativas e artísticas",
  },
  {
    name: "Social",
    icon: "Users",
    color: "#a78bfa",
    description: "Relacionamentos e vida social",
  },
  {
    name: "Finanças",
    icon: "DollarSign",
    color: "#22c55e",
    description: "Gestão financeira e economia",
  },
  {
    name: "Casa",
    icon: "Home",
    color: "#f97316",
    description: "Tarefas domésticas e organização",
  },
  {
    name: "Sono",
    icon: "Moon",
    color: "#6366f1",
    description: "Rotina de sono e descanso",
  },
];

