// ============================================
// SCRIPT DE TESTE DE NOTIFICAÇÕES - HABIT BUILDER
// ============================================
// INSTRUÇÕES:
// 1. Abra o console do navegador (F12)
// 2. Se aparecer aviso, digite: allow pasting
// 3. Pressione Enter
// 4. Cole este código completo abaixo
// 5. Pressione Enter novamente
// ============================================

(async () => {
  console.log("🔍 DIAGNÓSTICO COMPLETO DE NOTIFICAÇÕES - HABIT BUILDER");
  console.log("========================================================");

  // 1. Verificar suporte básico
  console.log("\n1️⃣ Verificando suporte básico...");
  if (!("Notification" in window)) {
    console.error("❌ Navegador não suporta notificações");
    return;
  }
  console.log("✅ API Notification disponível");

  if (!("serviceWorker" in navigator)) {
    console.error("❌ Service Worker não suportado");
    return;
  }
  console.log("✅ Service Worker suportado");

  // 2. Verificar Service Worker
  console.log("\n2️⃣ Verificando Service Worker...");
  let registration = null;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length === 0) {
      console.log("⚠️ Nenhum Service Worker registrado");
      console.log("💡 O Service Worker deve estar em /sw.js");
    } else {
      console.log(`✅ ${registrations.length} Service Worker(s) registrado(s)`);
      
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      try {
        registration = await Promise.race([readyPromise, timeoutPromise]);
        console.log("✅ Service Worker ativo:", registration.active?.scriptURL);
        console.log("📊 Estado:", registration.active?.state);
      } catch (e) {
        console.log("⚠️ Service Worker registrado mas não está pronto ainda");
        if (registrations.length > 0) {
          registration = registrations[0];
        }
      }
    }
  } catch (e) {
    console.log("❌ Erro ao verificar Service Worker:", e.message);
  }

  // 3. Verificar permissão
  console.log("\n3️⃣ Verificando permissão...");
  let permission = Notification.permission;
  console.log("📊 Status atual:", permission);

  if (permission === "denied") {
    console.error("❌ Permissão negada anteriormente");
    console.log("💡 Para reativar:");
    console.log("   1. Clique no ícone de cadeado 🔒 na barra de endereço");
    console.log("   2. Procure por 'Notificações'");
    console.log("   3. Altere para 'Permitir'");
    console.log("   4. Recarregue a página e tente novamente");
    return;
  }

  if (permission === "default") {
    console.log("📱 Solicitando permissão...");
    permission = await Notification.requestPermission();
    console.log("📊 Nova permissão:", permission);
  }

  if (permission !== "granted") {
    console.error("❌ Permissão não concedida");
    return;
  }

  // 4. Verificar dados do app (habits e progress)
  console.log("\n4️⃣ Verificando dados do app...");
  try {
    const habitsStorage = localStorage.getItem("habits-storage");
    if (habitsStorage) {
      const habitsData = JSON.parse(habitsStorage);
      const habits = habitsData.state?.habits || [];
      const progress = habitsData.state?.progress || [];
      console.log(`✅ ${habits.length} hábito(s) encontrado(s)`);
      console.log(`✅ ${progress.length} registro(s) de progresso`);
      
      if (habits.length > 0) {
        console.log("📋 Hábitos:", habits.map(h => h.title || h.name).join(", "));
      }
    } else {
      console.log("ℹ️ Nenhum dado de hábitos encontrado no localStorage");
    }
  } catch (e) {
    console.log("⚠️ Erro ao ler dados:", e.message);
  }

  // 5. Verificar preferências de lembretes
  console.log("\n5️⃣ Verificando preferências de lembretes...");
  try {
    const remindersStorage = localStorage.getItem("reminders-storage");
    if (remindersStorage) {
      const remindersData = JSON.parse(remindersStorage);
      const prefs = remindersData.state?.preferences;
      const perm = remindersData.state?.permission;
      
      if (prefs) {
        console.log("📊 Preferências:", {
          enabled: prefs.enabled,
          habitReminders: prefs.habitReminders,
          reminderTimes: prefs.reminderTimes
        });
      }
      if (perm) {
        console.log("📊 Permissão no store:", perm);
      }
    } else {
      console.log("ℹ️ Nenhuma preferência de lembretes encontrada");
    }
  } catch (e) {
    console.log("⚠️ Erro ao ler preferências:", e.message);
  }

  // 6. Verificar IndexedDB (dados do Service Worker)
  console.log("\n6️⃣ Verificando IndexedDB (dados do Service Worker)...");
  try {
    const dbName = "reminders-db";
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => resolve(null);
    });

    if (db) {
      const prefsTransaction = db.transaction(["reminders"], "readonly");
      const prefsStore = prefsTransaction.objectStore("reminders");
      const prefsRequest = prefsStore.get("preferences");
      
      await new Promise((resolve) => {
        prefsRequest.onsuccess = () => {
          const result = prefsRequest.result;
          if (result) {
            console.log("✅ Preferências no IndexedDB:", result.data);
          } else {
            console.log("ℹ️ Nenhuma preferência no IndexedDB");
          }
          resolve();
        };
        prefsRequest.onerror = () => resolve();
      });

      const appDataRequest = prefsStore.get("app-data");
      await new Promise((resolve) => {
        appDataRequest.onsuccess = () => {
          const result = appDataRequest.result;
          if (result && result.data) {
            const appData = result.data;
            console.log("✅ Dados do app no IndexedDB:", {
              habitsCount: appData.habits?.length || 0,
              progressCount: appData.progress?.length || 0
            });
          } else {
            console.log("ℹ️ Nenhum dado do app no IndexedDB");
          }
          resolve();
        };
        appDataRequest.onerror = () => resolve();
      });

      db.close();
    } else {
      console.log("ℹ️ IndexedDB ainda não foi criado (normal se SW não foi ativado)");
    }
  } catch (e) {
    console.log("⚠️ Erro ao verificar IndexedDB:", e.message);
  }

  // 7. Testar criação de notificação básica
  console.log("\n7️⃣ Testando criação de notificação básica...");
  try {
    const notification1 = new Notification("🧪 Teste - Habit Builder", {
      body: "Esta é uma notificação de teste básica do Habit Builder",
      tag: "test-simple-" + Date.now(),
      icon: window.location.origin + "/icon-192.png",
      badge: window.location.origin + "/icon-192.png",
      requireInteraction: true,
    });

    console.log("✅ Notificação básica criada");
    notification1.onshow = () => console.log("👁️ Notificação básica EXIBIDA!");
    notification1.onerror = (e) => console.error("❌ Erro na notificação básica:", e);
    notification1.onclick = () => {
      console.log("👆 Notificação básica clicada!");
      window.focus();
      notification1.close();
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (error) {
    console.error("❌ Erro ao criar notificação básica:", error);
  }

  // 8. Testar sincronização com Service Worker
  console.log("\n8️⃣ Testando sincronização com Service Worker...");
  if (registration && registration.active) {
    try {
      console.log("📤 Enviando preferências para SW...");
      registration.active.postMessage({
        type: "UPDATE_REMINDER_PREFERENCES",
        preferences: {
          enabled: true,
          habitReminders: true,
          reminderTimes: {
            habits: ["08:00", "20:00"]
          }
        }
      });
      console.log("✅ Preferências enviadas");

      console.log("📤 Enviando dados do app para SW...");
      const habitsStorage = localStorage.getItem("habits-storage");
      let appData = { habits: [], progress: [] };
      
      if (habitsStorage) {
        try {
          const habitsData = JSON.parse(habitsStorage);
          const habits = habitsData.state?.habits || [];
          const progress = habitsData.state?.progress || [];
          
          appData = {
            habits: habits.map(h => ({
              id: h.id,
              name: h.title || h.name
            })),
            progress: progress.map(p => ({
              habitId: p.habitId,
              date: p.date,
              completed: p.completed
            }))
          };
        } catch (e) {
          console.log("⚠️ Erro ao processar dados:", e.message);
        }
      }

      registration.active.postMessage({
        type: "UPDATE_APP_DATA",
        data: appData
      });
      console.log("✅ Dados do app enviados:", {
        habitsCount: appData.habits.length,
        progressCount: appData.progress.length
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.error("❌ Erro ao sincronizar com SW:", e.message);
    }
  } else {
    console.log("⚠️ Service Worker não está ativo, pulando sincronização");
  }

  // 9. Testar verificação imediata de lembretes
  console.log("\n9️⃣ Testando verificação imediata de lembretes...");
  if (registration && registration.active) {
    try {
      console.log("📤 Enviando comando CHECK_REMINDERS_NOW...");
      registration.active.postMessage({
        type: "CHECK_REMINDERS_NOW"
      });
      console.log("✅ Comando enviado - SW deve verificar lembretes agora");
      console.log("💡 Se houver hábitos não completados, você deve receber notificações");
    } catch (e) {
      console.error("❌ Erro ao verificar lembretes:", e.message);
    }
  } else {
    console.log("⚠️ Service Worker não está ativo, pulando verificação");
  }

  // 10. Testar notificação via Service Worker
  console.log("\n🔟 Testando notificação via Service Worker...");
  if (registration) {
    try {
      await registration.showNotification("🔔 Teste via SW - Habit Builder", {
        body: "Esta notificação foi criada diretamente via Service Worker",
        icon: window.location.origin + "/icon-192.png",
        badge: window.location.origin + "/icon-192.png",
        tag: "test-sw-direct-" + Date.now(),
        requireInteraction: true,
        data: { url: window.location.href },
      });
      console.log("✅ Notificação via SW criada com sucesso!");
    } catch (e) {
      console.error("❌ Erro ao criar notificação via SW:", e.message);
    }
  } else {
    console.log("⚠️ Service Worker não disponível");
  }

  // 11. Resumo final
  console.log("\n📊 RESUMO FINAL:");
  console.log("========================================================");
  console.log("✅ Diagnóstico completo executado!");
  console.log("");
  console.log("🔍 SE AS NOTIFICAÇÕES NÃO APARECERAM, VERIFIQUE:");
  console.log("");
  console.log("📱 WINDOWS - Configurações do Sistema:");
  console.log("   1. Win + I → Sistema → Notificações");
  console.log("   2. Certifique-se que 'Notificações' está ATIVADO");
  console.log("   3. Verifique se seu navegador está na lista de apps permitidos");
  console.log("   4. Desative 'Modo Foco' ou 'Não perturbe'");
  console.log("   5. Verifique 'Centro de Ações' (canto inferior direito)");
  console.log("");
  console.log("🌐 NAVEGADOR:");
  console.log("   1. Verifique se não está em modo 'Não perturbe'");
  console.log("   2. Tente focar na aba do navegador (clique nela)");
  console.log("   3. Alguns navegadores só mostram quando a aba está ativa");
  console.log("   4. Verifique as configurações de notificações do navegador");
  console.log("");
  console.log("🔧 SERVICE WORKER:");
  console.log("   1. Verifique se /sw.js está acessível");
  console.log("   2. Abra DevTools → Application → Service Workers");
  console.log("   3. Verifique se o SW está ativo e sem erros");
  console.log("   4. Verifique o console do Service Worker para erros");
  console.log("");
  console.log("💾 DADOS:");
  console.log("   1. Verifique se há hábitos cadastrados");
  console.log("   2. Verifique se as preferências estão habilitadas");
  console.log("   3. Verifique se os dados foram sincronizados com o SW");
  console.log("   4. Abra DevTools → Application → IndexedDB → reminders-db");
  console.log("");
  console.log("🧪 TESTES ADICIONAIS:");
  console.log("   Para testar lembretes reais:");
  console.log("   1. Certifique-se que há hábitos cadastrados");
  console.log("   2. Configure horários de lembrete próximos (ex: 5 minutos)");
  console.log("   3. Aguarde o horário ou use CHECK_REMINDERS_NOW");
  console.log("   4. Verifique se os hábitos não estão completados hoje");
  console.log("");
  console.log("💡 DICAS:");
  console.log("   - Olhe no canto inferior direito da tela");
  console.log("   - Verifique o histórico de notificações do Windows");
  console.log("   - Tente em uma janela anônima/privada");
  console.log("   - Verifique se o Windows não está em modo 'Não perturbe'");
  console.log("   - Para debug, abra DevTools → Application → Service Workers");
  console.log("     e veja o console do Service Worker");
})();

