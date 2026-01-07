# 🎯 Habit Builder - Aplicativo PWA de Construção de Hábitos

## 📋 Visão Geral

**Habit Builder** é uma Progressive Web App (PWA) moderna e completa para construção e acompanhamento de hábitos diários. O aplicativo permite que usuários criem pequenas tarefas diárias que, com o tempo, se transformam em hábitos sólidos através de tracking visual, gamificação e estatísticas detalhadas.

### ✨ Características Principais

- ✅ **Optimistic Updates** - UI responde instantaneamente, sem delays perceptíveis
- 🔄 **Estado na URL** - Compartilhável via nuqs (search params type-safe)
- 📱 **PWA Completo** - Funciona offline, instalável, com Service Worker
- 🎨 **Design Moderno** - Dark mode, glassmorphism, animações suaves
- 📊 **Estatísticas Avançadas** - Gráficos, streaks, insights inteligentes
- 🎯 **Múltiplos Tipos de Hábitos** - Counter, Timer, Pomodoro
- 👥 **Grupos de Hábitos** - Organize hábitos em grupos temáticos
- 🎨 **Personalização Completa** - Ícones, cores, templates pré-definidos

---

## 🏗️ Arquitetura Técnica

### Stack Principal

| Tecnologia       | Versão  | Propósito                      |
| ---------------- | ------- | ------------------------------ |
| **Next.js**      | 16.0.10 | Framework React com App Router |
| **React**        | 19.2.0  | Biblioteca UI                  |
| **TypeScript**   | 5.x     | Type safety                    |
| **Zustand**      | 5.0.9   | State management global        |
| **nuqs**         | 2.8.5   | Search params type-safe        |
| **Tailwind CSS** | 4.1.9   | Estilização                    |
| **shadcn/ui**    | Latest  | Componentes UI                 |
| **Sonner**       | 1.7.4   | Toast notifications            |
| **date-fns**     | 4.1.0   | Manipulação de datas           |
| **Recharts**     | 2.15.4  | Gráficos e visualizações       |

### Padrão de Fluxo de Dados

```
┌─────────────────────────────────────────┐
│     UI Components (React)                │
│  (Presentation Layer - Client Components)│
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│     Search Params (nuqs)                │
│  (Estado compartilhável via URL)        │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│     Zustand Store                       │
│  (State Management + Business Logic)   │
│  - Optimistic Updates                   │
│  - Rollback automático                  │
│  - Persistência localStorage            │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│     API Layer (Simulada)                │
│  (habits-api.ts)                        │
│  - Delay realista (200-500ms)           │
│  - Taxa de erro configurável            │
│  - Pronta para substituição por API real│
└─────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
habit/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout raiz com providers
│   ├── page.tsx                  # Página principal (Home)
│   ├── client-providers.tsx      # Providers client-side
│   ├── habitos/
│   │   └── page.tsx              # Página de hábitos
│   ├── estatisticas/
│   │   └── page.tsx              # Página de estatísticas
│   └── configuracoes/
│       └── page.tsx              # Página de configurações
│
├── components/                   # Componentes React
│   ├── atoms/                    # Componentes atômicos
│   │   ├── badge.tsx
│   │   └── icon.tsx
│   ├── molecules/                # Componentes moleculares
│   │   ├── habit-card.tsx
│   │   ├── counter-control.tsx
│   │   ├── timer-control.tsx
│   │   ├── pomodoro-control.tsx
│   │   ├── progress-chart.tsx
│   │   ├── category-stats.tsx
│   │   └── ...
│   ├── organisms/                # Componentes complexos
│   │   ├── habit-list.tsx
│   │   ├── habit-modal.tsx
│   │   ├── habit-creation-modal.tsx
│   │   ├── templates-modal.tsx
│   │   ├── group-creation-modal.tsx
│   │   ├── weekly-calendar.tsx
│   │   ├── bottom-navigation.tsx
│   │   ├── error-boundary.tsx
│   │   ├── offline-indicator.tsx
│   │   ├── pwa-install-banner.tsx
│   │   └── ...
│   └── ui/                       # Componentes shadcn/ui
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/                          # Lógica de negócio
│   ├── api/
│   │   └── habits-api.ts        # Camada de API (simulada)
│   ├── stores/
│   │   ├── habits-store.ts      # Store principal Zustand
│   │   └── ui-store.ts          # Store de UI
│   ├── hooks/
│   │   ├── use-search-params.ts # Hooks nuqs
│   │   ├── use-habit-data.ts    # Hooks de dados
│   │   ├── use-habit-progress.ts
│   │   ├── use-calendar-completion.ts
│   │   └── ...
│   ├── types/
│   │   └── habit.ts             # TypeScript types
│   ├── utils/
│   │   ├── habit-helpers.ts     # Helpers de hábitos
│   │   ├── stats-helpers.ts     # Cálculos estatísticos
│   │   ├── date-helpers.ts      # Helpers de data
│   │   ├── group-templates.ts  # Templates de grupos
│   │   └── ...
│   ├── contexts/
│   │   └── dialog-context.tsx  # Context de diálogos
│   └── mock-data/
│       └── habits-mock.json     # Dados mock para desenvolvimento
│
├── public/                       # Arquivos estáticos
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service Worker
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-icon-180.png
│
├── scripts/                      # Scripts utilitários
│   ├── dev.js                   # Script de desenvolvimento
│   ├── generate-icons.js        # Geração de ícones
│   └── sync-version.js          # Sincronização de versão
│
└── ARQUITETURA.md               # Documentação arquitetural detalhada
```

---

## 🔄 Optimistic Updates - Como Funciona

O sistema implementa **Optimistic Updates** em todas as operações CRUD, garantindo que a UI responda instantaneamente enquanto a API processa em background.

### Fluxo Completo: Adicionar Hábito

```typescript
// 1️⃣ Usuário clica "Criar hábito"
await addHabit(habitData);

// 2️⃣ Store atualiza IMEDIATAMENTE (optimistic)
const tempId = `temp-${Date.now()}`;
set({
  habits: [...habits, optimisticHabit],
  pendingOperations: pendingOperations + 1,
});
// ✅ UI já mostra o novo hábito!

// 3️⃣ Chamada API em background
const serverHabit = await HabitsAPI.createHabit(habitData);

// 4️⃣ SUCESSO: Substitui temp com real
set({
  habits: habits.map((h) => (h.id === tempId ? serverHabit : h)),
  pendingOperations: pendingOperations - 1,
});
toast.success("Hábito criado!");

// OU 4️⃣ ERRO: Rollback automático
set({
  habits: habits.filter((h) => h.id !== tempId),
  pendingOperations: pendingOperations - 1,
});
toast.error("Erro ao criar hábito");
// ✅ UI volta ao estado anterior automaticamente
```

### Operações com Optimistic Updates

- ✅ `addHabit` - Criar hábito
- ✅ `updateHabit` - Atualizar hábito
- ✅ `deleteHabit` - Deletar hábito
- ✅ `reorderHabits` - Reordenar hábitos
- ✅ `markComplete` - Marcar como completo
- ✅ `updateTimer` - Atualizar timer
- ✅ `updatePomodoro` - Atualizar pomodoro
- ✅ `addGroup` - Criar grupo
- ✅ `updateGroup` - Atualizar grupo
- ✅ `deleteGroup` - Deletar grupo
- ✅ `assignHabitToGroup` - Atribuir hábito a grupo

### Benefícios

- **0ms de delay percebido** - UI sempre responsiva
- **Melhor UX** - Feedback imediato
- **Rollback automático** - Em caso de erro, UI reverte
- **Indicador de sincronização** - `pendingOperations` mostra ops pendentes

---

## 🔍 Search Params com nuqs

O estado da aplicação é gerenciado através da URL usando **nuqs**, permitindo compartilhamento, bookmarks e navegação com botão voltar.

### Hooks Disponíveis

```typescript
// Hook completo com todos os params
const {
  day, // Data selecionada (Date)
  category, // Categoria filtrada
  habit, // Hábito selecionado (modal)
  group, // Grupo(s) aberto(s)
  view, // Modo de visualização (week/month/year)
  search, // Busca/filtro
  setDay,
  setCategory,
  setHabit,
  clearFilters,
  resetAll,
} = useAppSearchParams();

// Hook simplificado para data
const {
  selectedDay,
  setSelectedDay,
  isToday,
  goToPreviousDay,
  goToNextDay,
  goToToday,
} = useSelectedDay();

// Hook para categoria
const { selectedCategory, setSelectedCategory } = useSelectedCategory();

// Hook para hábito (modal)
const { selectedHabitId, openHabit, closeHabit, isOpen } = useSelectedHabit();

// Hook para visualização do calendário
const { calendarView, setCalendarView } = useCalendarView();
```

### Formato da URL

```
/?day=12102025&category=saude&habit=abc123&view=week
```

- `day`: Data no formato DDMMYYYY (ex: `12102025` = 12/10/2025)
- `category`: `bons` | `saude` | `maus` | `tarefas` | `todos`
- `habit`: ID do hábito selecionado
- `group`: IDs dos grupos abertos (separados por vírgula)
- `view`: `week` | `month` | `year`

### Benefícios

- ✅ Estado compartilhável via URL
- ✅ Bookmarks funcionam perfeitamente
- ✅ Botão voltar do navegador funciona
- ✅ Type-safe com TypeScript
- ✅ SSR-friendly

---

## 🎯 Funcionalidades Core

### 1. Gerenciamento de Hábitos

#### Tipos de Hábitos

1. **Counter** (Contador)

   - Incrementa/decrementa contador
   - Meta: número de repetições (ex: 8 copos de água)

2. **Timer** (Cronômetro)

   - Rastreia tempo gasto
   - Meta: minutos (ex: 30 min de leitura)

3. **Pomodoro** (Técnica Pomodoro)
   - Sessões de trabalho/descanso
   - Meta: número de sessões (ex: 4 pomodoros)

#### Operações CRUD

- ✅ Criar hábito personalizado
- ✅ Escolher templates pré-definidos (30+ templates)
- ✅ Editar hábito (nome, ícone, cores, meta)
- ✅ Deletar hábito
- ✅ Reordenar hábitos (drag & drop)
- ✅ Personalização completa (ícones Lucide, cores)

### 2. Tracking de Progresso

- ✅ Marcar conclusão de hábitos
- ✅ Contador de repetições
- ✅ Streak (sequência de dias consecutivos)
- ✅ Calendário visual semanal/mensal/anual
- ✅ Histórico completo de progresso
- ✅ Undo/Redo de ações

### 3. Grupos de Hábitos

- ✅ Criar grupos temáticos
- ✅ Templates de grupos pré-definidos (12 templates)
- ✅ Atribuir hábitos a grupos
- ✅ Visualização por grupo
- ✅ Expandir/colapsar grupos

### 4. Estatísticas & Insights

#### Métricas Disponíveis

- 📊 **Taxa de conclusão hoje** - Percentual de hábitos completados hoje
- 🔥 **Streak total** - Soma de todos os streaks
- 📈 **Gráfico de progresso** - Últimos 7 dias visualizados
- 📅 **Estatísticas por categoria** - Bons, Saúde, Maus, Tarefas
- 🎯 **Hábito mais consistente** - Maior streak atual
- 💯 **Melhor performance** - Maior taxa de conclusão
- 📊 **Completions da semana** - Total da semana atual
- 📊 **Completions do mês** - Total do mês atual

#### Insights Inteligentes

- "Seu melhor dia da semana é Segunda"
- "Beber água é seu hábito mais consistente"
- "Você melhorou 15% na última semana"

### 5. Templates & Categorias

#### Categorias

- **Bons** - Hábitos positivos gerais
- **Saúde** - Exercícios, alimentação, bem-estar
- **Maus** - Hábitos a evitar
- **Tarefas** - Tarefas diárias e produtividade

#### Templates de Hábitos (30+)

- 🛏️ Fazer a cama
- 💧 Beber água
- 📚 Ler livro
- 🏋️ Treino academia
- 🧘 Meditar
- 💊 Tomar vitaminas
- 🎸 Praticar violão
- 📝 Escrever diário
- E muitos mais...

#### Templates de Grupos (12)

- Saúde & Bem-estar
- Produtividade
- Estudos
- Fitness
- Alimentação
- Mindfulness
- Trabalho
- Criatividade
- Social
- Finanças
- Casa
- Sono

### 6. PWA Features

#### Service Worker

- ✅ Cache de assets estáticos
- ✅ Estratégia Network First com fallback para Cache
- ✅ Atualização automática de versão
- ✅ Limpeza de caches antigos
- ✅ Funcionamento offline completo

#### Manifest

- ✅ Instalável em dispositivos móveis
- ✅ Ícones para todas as plataformas (192x192, 512x512, Apple 180x180)
- ✅ Splash screens
- ✅ Tema escuro padrão
- ✅ Modo standalone

#### Features PWA

- ✅ **Offline Indicator** - Mostra status de conexão
- ✅ **PWA Install Banner** - Convite para instalar
- ✅ **PWA Update Banner** - Notifica atualizações disponíveis
- ✅ **App Updating Screen** - Tela durante atualização

### 7. Configurações

- ⚙️ Limpar todos os dados
- 💾 Importar/Exportar dados (JSON)
- 🔄 Sincronizar com servidor (quando implementado)
- 📊 Carregar dados mock para desenvolvimento

---

## 🎨 Design System

### Tema Visual

- **Tema Principal**: Dark mode com cores vibrantes
- **Paleta de Cores**:
  - Primary: Roxo/Indigo (#6366F1)
  - Success: Verde (#10B981)
  - Warning: Amarelo/Laranja (#F59E0B)
  - Danger: Vermelho (#EF4444)
  - Purple: Rosa/Roxo (#D946EF)

### Componentes

- **Base**: shadcn/ui
- **Estilização**: Tailwind CSS v4
- **Ícones**: Lucide React (50+ ícones disponíveis)
- **Animações**: Framer Motion
- **Tipografia**: Sistema de fontes nativas

### Atomic Design

- **Atoms**: Badge, Icon, Button
- **Molecules**: HabitCard, CounterControl, TimerControl, ProgressChart
- **Organisms**: HabitList, HabitModal, WeeklyCalendar, BottomNavigation
- **Templates**: Layout principal, páginas
- **Pages**: Home, Estatísticas, Configurações

---

## 💾 Persistência de Dados

### LocalStorage Strategy

```typescript
interface StoredData {
  habits: Habit[];
  progress: Progress[];
  groups: HabitGroup[];
  currentDate: Date;
  skipAutoLoad: boolean;
}
```

- ✅ Persistência automática via Zustand persist middleware
- ✅ Rehydrate automático ao carregar aplicação
- ✅ Conversão automática de strings para Date objects
- ✅ Tratamento de erros de parsing

### API Layer (Simulada)

```typescript
// lib/api/habits-api.ts
export class HabitsAPI {
  static async getHabits(): Promise<Habit[]>;
  static async createHabit(data: CreateHabitDTO): Promise<Habit>;
  static async updateHabit(id: string, data: UpdateHabitDTO): Promise<Habit>;
  static async deleteHabit(id: string): Promise<void>;
  static async markComplete(
    habitId: string,
    date: Date,
    count: number
  ): Promise<Progress>;
  // ... mais métodos
}
```

**Características:**

- Delay realista (200-500ms)
- Taxa de erro configurável (desabilitada por padrão)
- Pronta para substituição por API real

---

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd habit

# Instale as dependências
npm install
# ou
pnpm install

# Execute em desenvolvimento
npm run dev
# ou
pnpm dev
```

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (com hot reload)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run generate-icons # Gerar ícones PWA
npm run version:sync  # Sincronizar versão
```

### Desenvolvimento

1. **Carregar dados mock**: Os dados mock são carregados automaticamente na primeira execução
2. **Criar hábito**: Clique no botão "+" e escolha um template ou crie customizado
3. **Marcar como completo**: Clique no card do hábito ou use os controles
4. **Ver estatísticas**: Navegue para a aba "Estatísticas"
5. **Personalizar**: Clique em um hábito → Editar → Personalize ícone e cores

---

## 📊 Exemplos de Uso

### Criar Hábito

```typescript
import { useHabitsStore } from "@/lib/stores/habits-store";

const { addHabit } = useHabitsStore();

await addHabit({
  title: "Beber água",
  icon: "Droplet",
  color: "#60a5fa",
  category: "saude",
  frequency: "daily",
  habitType: "counter",
  targetCount: 8,
  description: "8 copos de água por dia",
});
// ✅ UI atualiza instantaneamente!
```

### Marcar como Completo

```typescript
import { useHabitsStore } from "@/lib/stores/habits-store";
import { useSelectedDay } from "@/lib/hooks/use-search-params";

const { markComplete } = useHabitsStore();
const { selectedDay } = useSelectedDay();

await markComplete(habitId, selectedDay, 1);
// ✅ Progresso atualizado imediatamente!
```

### Obter Estatísticas

```typescript
import { useHabitStatistics } from "@/lib/hooks/use-habit-data";

const {
  totalStreak,
  completionRateToday,
  statsByCategory,
  mostConsistent,
  bestCompletion,
  insights,
} = useHabitStatistics();
```

### Usar Search Params

```typescript
import {
  useSelectedDay,
  useSelectedCategory,
} from "@/lib/hooks/use-search-params";

const { selectedDay, goToNextDay } = useSelectedDay();
const { selectedCategory, setSelectedCategory } = useSelectedCategory();

// URL atualiza automaticamente: /?day=12102025&category=saude
```

---

## 🧪 Dados Mock

O projeto inclui dados mock completos para desenvolvimento:

- **25 hábitos** diversos
- **60 dias de histórico** de progresso
- **1178 registros** de progresso gerados
- **Variação realista** baseada em categoria e dia da semana

### Carregar Dados Mock

```typescript
import { useHabitData } from "@/lib/hooks/use-habit-data";

// Carrega automaticamente se não houver dados
useHabitData();
```

Ou manualmente:

```typescript
import { useHabitsStore } from "@/lib/stores/habits-store";

const { loadMockData } = useHabitsStore();
loadMockData();
```

---

## 🔐 Type Safety

Tudo é type-safe com TypeScript:

```typescript
// ✅ Type-safe
const { selectedCategory } = useSelectedCategory();
// selectedCategory: "bons" | "saude" | "maus" | "tarefas" | "todos"

// ✅ Type-safe
await updateHabit(id, { title: "Novo nome" });
// Autocomplete funciona!

// ❌ Type error
await updateHabit(id, { invalid: "field" });
// Error: Object literal may only specify known properties
```

---

## 🚀 Preparado para o Futuro

### Próximos Passos Sugeridos

1. **Substituir API Simulada por Real**

   ```typescript
   // De:
   await HabitsAPI.createHabit(data);

   // Para:
   await fetch("/api/habits", {
     method: "POST",
     body: JSON.stringify(data),
   });
   ```

2. **Adicionar Autenticação**

   - NextAuth ou Better Auth
   - Tokens nas chamadas API
   - Proteção de rotas

3. **WebSocket para Sync em Tempo Real**

   - Atualiza quando outro device faz mudanças
   - Notificações push

4. **Offline-First Avançado**
   - Queue de operações quando offline
   - Sync quando reconectar
   - Resolução de conflitos

---

## 📈 Performance & Otimizações

### Métricas de Performance

- ✅ **0ms de delay percebido** (optimistic updates)
- ✅ **UI sempre responsiva** mesmo com internet lenta
- ✅ **Code splitting automático** (Next.js)
- ✅ **Lazy loading** de modais e componentes pesados
- ✅ **Memoização** de cálculos estatísticos
- ✅ **Bundle otimizado** com tree-shaking

### Otimizações Implementadas

- ⚡ Server Components por padrão
- 🎨 CSS-in-JS evitado (Tailwind only)
- 📦 Code splitting automático
- 🖼️ Lazy loading de imagens
- 💨 Debounce em inputs
- 🔄 Optimistic updates
- 📱 Mobile-first responsive

---

## 🧪 Testing Strategy (Futuro)

- Unit tests: Vitest
- Integration tests: Testing Library
- E2E tests: Playwright
- Coverage mínimo: 80%

---

## 📱 PWA Checklist

- ✅ Service Worker configurado
- ✅ Manifest.json completo
- ✅ Offline functionality
- ✅ Install prompt
- ✅ App icons (192x192, 512x512, Apple 180x180)
- ✅ Splash screens
- ✅ Update notifications
- ⏳ Push notifications (opcional)

---

## 🔐 Segurança & Boas Práticas

- ✅ Input validation
- ✅ XSS prevention
- ✅ Data sanitization
- ✅ Secure cookie settings (quando implementado)
- ✅ Content Security Policy (via headers)
- ✅ Error boundaries para captura de erros
- ✅ Logging estruturado de erros

---

## 📚 Documentação Adicional

- **[ARQUITETURA.md](./ARQUITETURA.md)** - Documentação arquitetural detalhada
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de mudanças

---

## 🎯 Roadmap

### v1.0 (MVP) ✅

- [x] Estrutura básica do projeto
- [x] CRUD de hábitos
- [x] Tracking diário
- [x] Calendário semanal/mensal/anual
- [x] Templates pré-definidos
- [x] PWA básico
- [x] Estatísticas detalhadas
- [x] Grupos de hábitos
- [x] Personalização completa

### v1.1 (Enhance)

- [ ] Notificações push
- [ ] Temas customizáveis
- [ ] Backup na nuvem
- [ ] Exportação de relatórios
- [ ] Comparação entre períodos

### v2.0 (Cloud)

- [ ] Backend completo
- [ ] Autenticação
- [ ] Sync multi-device
- [ ] Social features
- [ ] Achievements/Badges
- [ ] Compartilhamento de hábitos

---

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas!

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License

---

## 🎓 Conceitos Aplicados

1. **Optimistic UI** - Atualiza antes da confirmação
2. **Pessimistic Rollback** - Desfaz se API falhar
3. **State in URL** - nuqs para compartilhar estado
4. **Separation of Concerns** - API / Store / UI separados
5. **Type Safety** - TypeScript em todo lugar
6. **Error Boundaries** - Try/catch + toasts + ErrorBoundary
7. **Persistence** - localStorage para offline
8. **Middleware** - Zustand persist
9. **Atomic Design** - Estrutura de componentes
10. **PWA Best Practices** - Service Worker, Manifest, Offline

---

**Desenvolvido com ❤️ usando Next.js, TypeScript, Zustand e Tailwind CSS**

---

## 📞 Suporte

Para dúvidas, sugestões ou problemas, abra uma issue no repositório.
