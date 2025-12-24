"use client";

import { Suspense, lazy, memo } from "react";
import { ClientProviders } from "./client-providers";
import { useHabitData } from "@/lib/hooks/use-habit-data";
import { Swapper } from "@/components/organisms/swapper";

// Lazy loading de modais
const HabitModal = lazy(() =>
  import("@/components/organisms/habit-modal").then((m) => ({
    default: m.HabitModal,
  }))
);
const TemplatesModal = lazy(() =>
  import("@/components/organisms/templates-modal").then((m) => ({
    default: m.TemplatesModal,
  }))
);
const HabitCreationModal = lazy(() =>
  import("@/components/organisms/habit-creation-modal").then((m) => ({
    default: m.HabitCreationModal,
  }))
);
const GroupTemplatesModal = lazy(() =>
  import("@/components/organisms/group-templates-modal").then((m) => ({
    default: m.GroupTemplatesModal,
  }))
);
const GroupCreationModal = lazy(() =>
  import("@/components/organisms/group-creation-modal").then((m) => ({
    default: m.GroupCreationModal,
  }))
);

export default function HomePage() {
  useHabitData(); // Carrega dados mock automaticamente

  return (
    <ClientProviders>
      <div
        className="bg-background"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <Suspense
          fallback={
            <div
              className="flex items-center justify-center h-screen"
              role="status"
              aria-label="Carregando aplicação"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Swapper>
            <HabitsTab />
            <StatisticsTab />
            <SettingsTab />
          </Swapper>
        </Suspense>

        <Suspense fallback={null}>
          <HabitModal />
          <TemplatesModal />
          <HabitCreationModal />
          <GroupTemplatesModal />
          <GroupCreationModal />
        </Suspense>
      </div>
    </ClientProviders>
  );
}

// Importa os componentes das páginas dedicadas
const HabitosPage = lazy(() =>
  import("@/app/habitos/page").then((m) => ({
    default: m.default,
  }))
);
const EstatisticasPage = lazy(() =>
  import("@/app/estatisticas/page").then((m) => ({
    default: m.default,
  }))
);
const ConfiguracoesPage = lazy(() =>
  import("@/app/configuracoes/page").then((m) => ({
    default: m.default,
  }))
);

// Tab de Hábitos - Usa o componente da página dedicada
const HabitsTab = memo(function HabitsTab() {
  return <HabitosPage />;
});

// Tab de Estatísticas - Usa o componente da página dedicada
const StatisticsTab = memo(function StatisticsTab() {
  return <EstatisticasPage />;
});

// Tab de Configurações - Usa o componente da página dedicada
const SettingsTab = memo(function SettingsTab() {
  return <ConfiguracoesPage />;
});
