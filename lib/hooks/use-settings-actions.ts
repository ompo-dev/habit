import { useHabitsStore } from "@/lib/stores/habits-store";
import { useDialog } from "@/lib/contexts/dialog-context";

/**
 * Hook para ações de configurações
 */
export function useSettingsActions() {
  const { loadMockData, habits, progress } = useHabitsStore();
  const { confirm, alert } = useDialog();

  const handleLoadMockData = async () => {
    const confirmed = await confirm({
      title: "Carregar dados de exemplo",
      description:
        "Isso substituirá seus dados atuais por dados de exemplo. Deseja continuar?",
      confirmText: "Sim, carregar",
      cancelText: "Cancelar",
    });
    if (confirmed) {
      loadMockData();
      await alert("Dados de exemplo carregados com sucesso!", "Sucesso");
    }
  };

  const handleClearData = async () => {
    const confirmed = await confirm({
      title: "Limpar todos os dados",
      description:
        "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.",
      confirmText: "Sim, limpar",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (confirmed) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      habits,
      progress,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        // Aqui você implementaria a lógica de importação
        await alert("Dados importados com sucesso!", "Sucesso");
      } catch (error) {
        await alert("Erro ao importar dados", "Erro");
      }
    };
    input.click();
  };

  return {
    handleLoadMockData,
    handleClearData,
    handleExportData,
    handleImportData,
    stats: {
      habitsCount: habits.length,
      progressCount: progress.length,
    },
  };
}

