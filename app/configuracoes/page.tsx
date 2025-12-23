"use client";
import { ArrowLeft, Download, Upload, Trash2, Database } from "lucide-react";
import Link from "next/link";
import { CACHE_VERSION } from "@/lib/constants/version";
import { useSettingsActions } from "@/lib/hooks/use-settings-actions";
import { ClientProviders } from "@/app/client-providers";

// Força renderização dinâmica para evitar pré-renderização durante o build
export const dynamic = "force-dynamic";

function ConfiguracoesContent() {
  const {
    handleLoadMockData,
    handleClearData,
    handleExportData,
    handleImportData,
    stats,
  } = useSettingsActions();

  return (
    <div
      className="bg-background"
      style={{
        paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <h2 className="font-semibold text-white mb-4">Aparência</h2>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Tema</span>
              <span className="text-white">Escuro</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <h2 className="font-semibold text-white mb-4">Notificações</h2>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Lembretes</span>
              <span className="text-white">Desativado</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <h2 className="font-semibold text-white mb-4">Desenvolvimento</h2>
            <div className="space-y-3">
              <button
                onClick={handleLoadMockData}
                className="flex w-full items-center gap-3 rounded-lg bg-primary/20 p-3 text-white hover:bg-primary/30 transition-all backdrop-blur-xl border border-primary/30 shadow-lg"
              >
                <Database className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Carregar dados de exemplo</div>
                  <div className="text-xs text-white/60">
                    Dados de 1 semana com múltiplos hábitos
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <h2 className="font-semibold text-white mb-4">Dados</h2>
            <div className="space-y-3">
              <div className="text-sm text-white/60 mb-3">
                {stats.habitsCount} hábitos • {stats.progressCount} registros
              </div>
              <button
                onClick={handleExportData}
                className="flex w-full items-center gap-3 text-left text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-xl"
                aria-label="Exportar dados"
                type="button"
              >
                <Download className="h-4 w-4" />
                Exportar dados
              </button>
              <button
                onClick={handleImportData}
                className="flex w-full items-center gap-3 text-left text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 backdrop-blur-xl"
                aria-label="Importar dados"
                type="button"
              >
                <Upload className="h-4 w-4" />
                Importar dados
              </button>
              <button
                onClick={handleClearData}
                className="flex w-full items-center gap-3 text-left text-red-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 backdrop-blur-xl"
              >
                <Trash2 className="h-4 w-4" />
                Limpar todos os dados
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-xl border border-white/8 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
            <div className="text-center text-white/40 text-sm">
              <p>Habit Builder - {CACHE_VERSION}</p>
              <p className="mt-1">PWA • Next.js 16 • Zustand</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <ClientProviders>
      <ConfiguracoesContent />
    </ClientProviders>
  );
}
