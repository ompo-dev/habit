// Service Worker para PWA - Habit Builder
// IMPORTANTE: Esta versão é atualizada automaticamente pelo script sync-version.js
// Para alterar, edite apenas o package.json e execute: npm run version:sync
const CACHE_VERSION = "v2.3.0";
const CACHE_NAME = `habit-builder-${CACHE_VERSION}`;
const RUNTIME_CACHE = `habit-builder-runtime-${CACHE_VERSION}`;

// Arquivos estáticos para cache
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon-180.png",
  "/apple-icon.png",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...", CACHE_VERSION);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("[SW] Erro ao instalar cache:", error);
      })
  );
  // Força ativação imediata do novo service worker
  self.skipWaiting();
});

// Verificação periódica de lembretes (a cada hora)
let reminderCheckInterval = null;

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Ativando Service Worker...", CACHE_VERSION);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        // Deleta todos os caches antigos que não correspondem à versão atual
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                name.startsWith("habit-builder-") &&
                name !== CACHE_NAME &&
                name !== RUNTIME_CACHE
              );
            })
            .map((name) => {
              console.log("[SW] Removendo cache antigo:", name);
              return caches.delete(name);
            })
        );
      })
      .catch((error) => {
        console.error("[SW] Erro ao limpar caches antigos:", error);
      })
  );
  // Assume controle imediato de todas as páginas
  event.waitUntil(
    self.clients
      .claim()
      .then(() => {
        // Notifica todos os clientes sobre a atualização
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          try {
            client.postMessage({
              type: "SW_UPDATED",
              version: CACHE_VERSION,
            });
          } catch (error) {
            console.error("[SW] Erro ao enviar mensagem para cliente:", error);
          }
        });
      })
      .catch((error) => {
        console.error("[SW] Erro ao assumir controle:", error);
      })
      .then(() => {
        // Iniciar verificação de lembretes
        checkReminders();
        reminderCheckInterval = setInterval(checkReminders, 60 * 60 * 1000); // 1 hora
      })
  );
});

// Estratégia: Network First, fallback para Cache
self.addEventListener("fetch", (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== "GET") return;

  // Ignora requisições de analytics e outras APIs externas
  if (
    event.request.url.includes("vercel.app") ||
    event.request.url.includes("google-analytics") ||
    event.request.url.includes("googletagmanager")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clona a resposta para cache
        const responseToCache = response.clone();

        // Cache apenas respostas válidas
        if (response.status === 200) {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Fallback para cache se offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback para página inicial se for navegação
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});

// Mensagem para atualizar cache
self.addEventListener("message", (event) => {
  try {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    } else if (event.data && event.data.type === "UPDATE_REMINDER_PREFERENCES") {
      // Salvar preferências no IndexedDB
      saveReminderPreferences(event.data.preferences);
    } else if (event.data && event.data.type === "UPDATE_APP_DATA") {
      // Salvar dados do app no IndexedDB
      saveAppData(event.data.data);
    } else if (event.data && event.data.type === "CHECK_REMINDERS_NOW") {
      // Verificar lembretes imediatamente (para testes)
      checkReminders();
    }
  } catch (error) {
    console.error("[SW] Erro ao processar mensagem:", error);
  }
});

// ============================================
// SISTEMA DE LEMBRETES AUTOMÁTICOS
// ============================================

const REMINDERS_DB = 'reminders-db';
const REMINDERS_STORE = 'reminders';
const NOTIFICATIONS_STORE = 'sent-notifications';

// Função para verificar e enviar lembretes
async function checkReminders() {
  try {
    // Buscar preferências do IndexedDB
    const prefs = await getReminderPreferences();
    if (!prefs || !prefs.enabled) return;

    // Buscar dados do app do IndexedDB
    const appData = await getAppData();
    
    // Verificar regras e enviar notificações
    const notifications = await checkReminderRules(prefs, appData);
    
    // Enviar cada notificação
    for (const notif of notifications) {
      await showReminderNotification(notif);
    }
  } catch (error) {
    console.error('[SW] Erro ao verificar lembretes:', error);
  }
}

// Verificar regras de negócio
async function checkReminderRules(prefs, appData) {
  const notifications = [];
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

  // HABIT APP: Verificar hábitos não completados
  if (prefs.habitReminders && appData.habits) {
    const reminderTimes = prefs.reminderTimes.habits || [];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Verificar cada horário de lembrete
    for (const reminderTime of reminderTimes) {
      const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);
      
      // Verificar se estamos na mesma hora do lembrete (com tolerância de 1 hora)
      // Como o SW verifica a cada hora, verificamos se estamos na hora do lembrete
      // ou até 1 hora depois (para cobrir casos onde o SW não executou exatamente no horário)
      const isWithinReminderWindow = 
        (currentHour === reminderHour && currentMinute >= reminderMinute) ||
        (currentHour === reminderHour + 1 && currentMinute <= reminderMinute);
      
      if (isWithinReminderWindow) {
        // Verificar cada hábito
        for (const habit of appData.habits) {
          // Verificar se hábito foi completado hoje
          const completed = appData.progress?.some(
            p => p.habitId === habit.id && p.date === today && p.completed
          );
          
          if (!completed) {
            // Verificar se já enviamos esta notificação hoje para este horário
            const tag = `habit-${habit.id}-${today}-${reminderTime}`;
            const alreadySent = await wasNotificationSent(tag);
            
            if (!alreadySent) {
              notifications.push({
                title: "Lembrete de Hábito",
                body: `Você não completou o hábito "${habit.name}"`,
                url: `/habitos?habit=${habit.id}`,
                tag: tag,
                icon: "/icon-192.png"
              });
            }
          }
        }
      }
    }
  }

  return notifications;
}

// Exibir notificação
async function showReminderNotification(notif) {
  const options = {
    body: notif.body,
    icon: notif.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: notif.url
    },
    tag: notif.tag,
    requireInteraction: false,
  };

  await self.registration.showNotification(notif.title, options);
  
  // Marcar como enviada no IndexedDB
  await markNotificationSent(notif.tag);
}

// Event listener para cliques na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// ============================================
// IndexedDB Helpers para Lembretes
// ============================================

async function openRemindersDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(REMINDERS_DB, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(REMINDERS_STORE)) {
        db.createObjectStore(REMINDERS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(NOTIFICATIONS_STORE)) {
        const store = db.createObjectStore(NOTIFICATIONS_STORE, { keyPath: 'tag' });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
}

async function getReminderPreferences() {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([REMINDERS_STORE], 'readonly');
    const store = transaction.objectStore(REMINDERS_STORE);
    const request = store.get('preferences');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erro ao buscar preferências:', error);
    return null;
  }
}

async function getAppData() {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([REMINDERS_STORE], 'readonly');
    const store = transaction.objectStore(REMINDERS_STORE);
    const request = store.get('app-data');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.data || {});
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erro ao buscar dados do app:', error);
    return {};
  }
}

async function wasNotificationSent(tag) {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([NOTIFICATIONS_STORE], 'readonly');
    const store = transaction.objectStore(NOTIFICATIONS_STORE);
    const request = store.get(tag);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(false);
          return;
        }
        
        // Verificar se foi enviada hoje
        const today = new Date().toISOString().split('T')[0];
        const sentDate = new Date(result.date).toISOString().split('T')[0];
        resolve(sentDate === today);
      };
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    return false;
  }
}

async function markNotificationSent(tag) {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([NOTIFICATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATIONS_STORE);
    
    await new Promise((resolve, reject) => {
      const request = store.put({
        tag: tag,
        date: new Date().toISOString()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erro ao marcar notificação como enviada:', error);
  }
}

async function saveReminderPreferences(prefs) {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([REMINDERS_STORE], 'readwrite');
    const store = transaction.objectStore(REMINDERS_STORE);
    
    await new Promise((resolve, reject) => {
      const request = store.put({
        id: 'preferences',
        data: prefs
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erro ao salvar preferências:', error);
  }
}

async function saveAppData(data) {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([REMINDERS_STORE], 'readwrite');
    const store = transaction.objectStore(REMINDERS_STORE);
    
    await new Promise((resolve, reject) => {
      const request = store.put({
        id: 'app-data',
        data: data
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erro ao salvar dados do app:', error);
  }
}

// Limpar notificações antigas (mais de 7 dias)
async function cleanupOldNotifications() {
  try {
    const db = await openRemindersDB();
    const transaction = db.transaction([NOTIFICATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATIONS_STORE);
    const index = store.index('date');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const range = IDBKeyRange.upperBound(sevenDaysAgo.toISOString());
    const request = index.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  } catch (error) {
    console.error('[SW] Erro ao limpar notificações antigas:', error);
  }
}

// Limpar a cada 24 horas
setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
