"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Copy, Check, X, ChevronDown, ChevronUp, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    timestamp: new Date(),
    route: pathname,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  });

  useEffect(() => {
    // Atualiza detalhes quando o erro ocorre
    setErrorDetails({
      timestamp: new Date(),
      route: pathname,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });

    // Log completo do erro
    const errorLog = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      },
      ...errorDetails,
      timestamp: new Date().toISOString(),
    };

    console.error("🚨 Next.js Error capturado:", errorLog);

    // Envia para serviço de logging em produção
    if (process.env.NODE_ENV === "production") {
      // sendErrorToLoggingService(errorLog);
    }
  }, [error, pathname]);

  const handleCopy = async () => {
    const errorReport = generateErrorReport();
    try {
      await navigator.clipboard.writeText(errorReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const generateErrorReport = (): string => {
    return `
═══════════════════════════════════════════════════════════
🚨 RELATÓRIO DE ERRO - Habit Builder (Next.js Error)
═══════════════════════════════════════════════════════════

Timestamp: ${errorDetails.timestamp.toISOString()}
Data/Hora Local: ${errorDetails.timestamp.toLocaleString("pt-BR")}
Digest: ${error.digest || "N/A"}

═══════════════════════════════════════════════════════════
📋 INFORMAÇÕES DO ERRO
═══════════════════════════════════════════════════════════

Nome: ${error.name || "N/A"}
Mensagem: ${error.message || "N/A"}

Stack Trace:
${error.stack || "N/A"}

═══════════════════════════════════════════════════════════
🔍 CONTEXTO
═══════════════════════════════════════════════════════════

Rota: ${errorDetails.route || "N/A"}
URL Completa: ${errorDetails.url || "N/A"}
User Agent: ${errorDetails.userAgent || "N/A"}

═══════════════════════════════════════════════════════════
💻 INFORMAÇÕES DO AMBIENTE
═══════════════════════════════════════════════════════════

Ambiente: ${process.env.NODE_ENV || "development"}
Plataforma: ${typeof window !== "undefined" ? "Browser" : "Server"}
Framework: Next.js

═══════════════════════════════════════════════════════════
    `.trim();
  };

  const handleGoHome = () => {
    router.push("/");
    reset();
  };

  return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full max-w-4xl rounded-3xl bg-background/95 backdrop-blur-3xl",
          "border border-white/15 shadow-[0_20px_60px_0_rgba(0,0,0,0.5)]",
          "max-h-[90vh] flex flex-col overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Erro na Aplicação</h1>
            <p className="text-sm text-white/60">
              {error.digest ? `Digest: ${error.digest}` : "Erro inesperado ocorreu"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Informações Básicas */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="text-sm font-semibold text-white/80 mb-3">
              Informações Básicas
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-white/60 min-w-[100px]">Data/Hora:</span>
                <span className="text-white">
                  {errorDetails.timestamp.toLocaleString("pt-BR", {
                    dateStyle: "full",
                    timeStyle: "long",
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/60 min-w-[100px]">Rota:</span>
                <span className="text-white font-mono text-xs break-all">
                  {errorDetails.route || "/"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/60 min-w-[100px]">URL:</span>
                <span className="text-white font-mono text-xs break-all">
                  {errorDetails.url}
                </span>
              </div>
              {error.digest && (
                <div className="flex items-start gap-2">
                  <span className="text-white/60 min-w-[100px]">Digest:</span>
                  <span className="text-white font-mono text-xs break-all">
                    {error.digest}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mensagem do Erro */}
          <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20">
            <h2 className="text-sm font-semibold text-red-400 mb-2">Mensagem do Erro</h2>
            <p className="text-white font-mono text-sm">{error.message || "Erro desconhecido"}</p>
          </div>

          {/* Stack Trace (Expandido) */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              <span>Stack Trace</span>
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 overflow-auto rounded-lg bg-black/30 p-3 text-xs font-mono text-white/80 whitespace-pre-wrap break-all"
                >
                  {error.stack || "Stack trace não disponível"}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>

          {/* User Agent */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h2 className="text-sm font-semibold text-white/80 mb-2">User Agent</h2>
            <p className="text-white/60 font-mono text-xs break-all">
              {errorDetails.userAgent}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-white/10 p-6">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar Relatório
              </>
            )}
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <Home className="h-4 w-4" />
            Ir para Home
          </button>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/30 transition-all border border-primary/30"
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

