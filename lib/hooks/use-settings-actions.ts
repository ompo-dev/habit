import { useHabitsStore } from "@/lib/stores/habits-store";
import { useDialog } from "@/lib/contexts/dialog-context";

/**
 * Hook para ações de configurações
 */
export function useSettingsActions() {
  const { loadMockData, habits, progress, groups, importData, clearAllData } = useHabitsStore();
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
      // Usa a função do store para limpar todos os dados
      clearAllData();

      // Limpa também outras possíveis chaves relacionadas ao app (caso existam)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("habit") || key.includes("habits"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Recarrega a página para garantir que tudo seja resetado
      window.location.href = "/";
    }
  };

  const handleExportData = () => {
    const data = {
      habits,
      progress,
      groups,
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
    const confirmed = await confirm({
      title: "Importar dados",
      description:
        "Isso substituirá seus dados atuais pelos dados importados. Deseja continuar?",
      confirmText: "Sim, importar",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!confirmed) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validação básica da estrutura dos dados
        if (!data.habits || !Array.isArray(data.habits)) {
          throw new Error("Formato de arquivo inválido: 'habits' deve ser um array");
        }

        if (!data.progress || !Array.isArray(data.progress)) {
          throw new Error("Formato de arquivo inválido: 'progress' deve ser um array");
        }

        // Importa os dados usando a função do store
        importData({
          habits: data.habits,
          progress: data.progress,
          groups: data.groups || [],
        });

        await alert("Dados importados com sucesso!", "Sucesso");
      } catch (error) {
        console.error("Erro ao importar dados:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao importar dados";
        await alert(
          `Erro ao importar dados: ${errorMessage}`,
          "Erro"
        );
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

