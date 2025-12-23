# 🎯 Habit Builder - Aplicativo PWA de Construção de Hábitos

## 📋 Visão Geral

Habit Builder é uma Progressive Web App (PWA) moderna para construção e acompanhamento de hábitos diários. O aplicativo permite que usuários criem pequenas tarefas diárias que, com o tempo, se transformam em hábitos sólidos através de tracking visual e gamificação.

## 🎨 Design System & UI/UX

### Tema Visual
- **Tema Principal**: Dark mode com cores vibrantes (roxo, verde, rosa)
- **Paleta de Cores**:
  - Primary: Roxo/Indigo (#6366F1)
  - Success: Verde (#10B981)
  - Warning: Amarelo/Laranja (#F59E0B)
  - Danger: Vermelho (#EF4444)
  - Purple: Rosa/Roxo (#D946EF)
- **Tipografia**: Sistema de fontes nativas com fallbacks
- **Componentes**: shadcn/ui como base
- **Estilização**: Tailwind CSS v4 com clsx para composição de classes

### Layout & Navegação
- **Estrutura Atomic Design**:
  - Atoms: Botões, ícones, badges, inputs
  - Molecules: Cards de hábitos, seletores de data, contadores
  - Organisms: Calendário semanal, lista de hábitos, modals
  - Templates: Layout principal, páginas
  - Pages: Home, Estatísticas, Configurações, Modelos

## 🏗️ Arquitetura Técnica

### Stack Principal
- **Framework**: Next.js 16 (App Router com SSR)
- **Linguagem**: TypeScript (strict mode)
- **State Management**: Zustand
- **Estilização**: Tailwind CSS v4 + shadcn/ui
- **Search Params**: nuqs + TanStack
- **Storage**: Cookies + LocalStorage para persistência
- **PWA**: next-pwa para funcionalidades offline

### Padrão de Fluxo de Dados

```
┌─────────────────────────────────────────┐
│          COMPONENT LAYER                │
│  (UI Components + Presentation Logic)   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│          ZUSTAND STORE                  │
│  (State Management + Business Logic)    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│            API LAYER                    │
│  (Server Actions + Route Handlers)      │
└─────────────────────────────────────────┘
```

### Estrutura de Pastas

```
app/
├── (main)/
│   ├── page.tsx                 # Dashboard principal
│   ├── layout.tsx               # Layout principal
│   └── loading.tsx
├── estatisticas/
│   └── page.tsx                 # Página de estatísticas
├── configuracoes/
│   └── page.tsx                 # Configurações do usuário
├── modelos/
│   └── page.tsx                 # Templates de hábitos
├── api/
│   ├── habits/
│   │   └── route.ts             # CRUD de hábitos
│   └── progress/
│       └── route.ts             # Tracking de progresso
└── globals.css

components/
├── atoms/
│   ├── button.tsx
│   ├── badge.tsx
│   ├── icon.tsx
│   └── input.tsx
├── molecules/
│   ├── habit-card.tsx           # Card de hábito individual
│   ├── date-selector.tsx        # Seletor de data
│   ├── counter-control.tsx      # Controle de contador
│   └── category-tabs.tsx        # Tabs de categoria
├── organisms/
│   ├── weekly-calendar.tsx      # Calendário semanal
│   ├── habit-list.tsx           # Lista de hábitos
│   ├── habit-modal.tsx          # Modal de detalhes
│   ├── templates-list.tsx       # Lista de templates
│   └── bottom-navigation.tsx    # Navegação inferior
└── templates/
    └── main-layout.tsx          # Template principal

lib/
├── stores/
│   ├── habits-store.ts          # Store de hábitos
│   ├── ui-store.ts              # Store de UI
│   └── settings-store.ts        # Store de configurações
├── hooks/
│   ├── use-habits.ts            # Hook de hábitos
│   ├── use-progress.ts          # Hook de progresso
│   ├── use-calendar.ts          # Hook de calendário
│   └── use-local-storage.ts     # Hook de storage
├── actions/
│   ├── habit-actions.ts         # Server actions de hábitos
│   └── progress-actions.ts      # Server actions de progresso
├── utils/
│   ├── cn.ts                    # Merge de classes
│   ├── date-helpers.ts          # Helpers de data
│   └── habit-helpers.ts         # Helpers de hábitos
└── types/
    └── habit.ts                 # Tipos TypeScript

public/
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── manifest.json
```

## 🎯 Funcionalidades Core

### 1. Gerenciamento de Hábitos
- ✅ Criar hábitos personalizados
- ✅ Escolher templates pré-definidos
- ✅ Definir frequência (diária, semanal, etc)
- ✅ Adicionar ícones e cores
- ✅ Definir categoria (Bons, Saúde, etc)
- ✅ Editar e deletar hábitos

### 2. Tracking de Progresso
- ✅ Marcar conclusão de hábitos
- ✅ Contador de repetições
- ✅ Streak (sequência de dias)
- ✅ Calendário visual semanal
- ✅ Sistema de pontos/gamificação

### 3. Templates & Categorias
- **Categorias**:
  - Bons (hábitos positivos gerais)
  - Saúde (exercícios, alimentação)
  - Maus (hábitos a evitar)
  - Tarefas (tarefas diárias)

- **Templates Populares**:
  - 🛏️ Fazer a cama
  - 💧 Beber água
  - 🧊 Tomar um banho frio
  - 💊 Tomar vitaminas
  - 😴 Acordar cedo
  - 🥗 Fazer uma refeição saudável
  - 🪥 Escovar os dentes
  - 📚 Ler um livro
  - 🚿 Tomar um banho

### 4. Estatísticas & Insights
- 📊 Gráficos de progresso
- 📈 Taxa de conclusão
- 🔥 Streaks mais longos
- 📅 Histórico mensal
- 🎯 Metas alcançadas

### 5. Configurações
- ⚙️ Notificações push
- 🌙 Tema escuro/claro
- 🌍 Idioma
- 🔄 Sincronização de dados
- 💾 Backup e restauração

## 🔧 Tecnologias & Patterns

### Zustand Store Pattern

```typescript
// Example: habits-store.ts
interface HabitsStore {
  habits: Habit[]
  selectedHabit: Habit | null
  isLoading: boolean
  
  // Actions
  fetchHabits: () => Promise<void>
  addHabit: (habit: CreateHabitDTO) => Promise<void>
  updateHabit: (id: string, data: UpdateHabitDTO) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  selectHabit: (id: string) => void
  
  // Progress
  markComplete: (habitId: string, date: Date, count: number) => Promise<void>
  undoComplete: (habitId: string, date: Date) => Promise<void>
}
```

### Search Params com nuqs

```typescript
// Gerenciar estado via URL
import { useQueryState } from 'nuqs'

const [selectedDate, setSelectedDate] = useQueryState('date')
const [habitModal, setHabitModal] = useQueryState('habit')
const [view, setView] = useQueryState('view', { defaultValue: 'list' })
```

### Server Side Rendering

- Páginas principais renderizadas no servidor
- Dados de hábitos carregados server-side
- Metadados dinâmicos por página
- Otimização de performance com streaming

### PWA Features

```json
// manifest.json
{
  "name": "Habit Builder",
  "short_name": "Habits",
  "theme_color": "#6366F1",
  "background_color": "#0F172A",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [...]
}
```

## 💾 Persistência de Dados

### LocalStorage Strategy
```typescript
// Estrutura de dados local
interface LocalStorageData {
  habits: Habit[]
  progress: Progress[]
  settings: UserSettings
  lastSync: Date
}
```

### Cookies Strategy
```typescript
// Preferências do usuário
cookies: {
  theme: 'dark' | 'light'
  locale: 'pt-BR' | 'en-US'
  notifications: boolean
}
```

### Sync Strategy
- Auto-save a cada ação
- Sync com servidor (quando implementado)
- Offline-first approach
- Conflict resolution

## 🎨 Component Examples

### Habit Card Component

```typescript
interface HabitCardProps {
  habit: Habit
  progress: Progress
  onComplete: () => void
  onUndo: () => void
  onClick: () => void
}

// Usage
<HabitCard
  habit={habit}
  progress={todayProgress}
  onComplete={handleComplete}
  onClick={openModal}
/>
```

### Weekly Calendar Component

```typescript
interface WeeklyCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  habitProgress: Record<string, Progress[]>
}
```

## 🚀 Performance & Optimization

- ⚡ Server Components por padrão
- 🎨 CSS-in-JS evitado (Tailwind only)
- 📦 Code splitting automático
- 🖼️ Lazy loading de imagens
- 💨 Debounce em inputs
- 🔄 Optimistic updates
- 📱 Mobile-first responsive

## 🧪 Testing Strategy (Futuro)

- Unit tests: Vitest
- Integration tests: Testing Library
- E2E tests: Playwright
- Coverage mínimo: 80%

## 📱 PWA Checklist

- ✅ Service Worker
- ✅ Manifest.json
- ✅ Offline functionality
- ✅ Install prompt
- ✅ App icons (192x192, 512x512)
- ✅ Splash screens
- ✅ Push notifications (opcional)

## 🔐 Security & Best Practices

- Input validation
- XSS prevention
- CSRF protection (quando usar auth)
- Data sanitization
- Secure cookie settings
- Content Security Policy

## 📈 Roadmap

### v1.0 (MVP)
- [x] Estrutura básica do projeto
- [x] CRUD de hábitos
- [x] Tracking diário
- [x] Calendário semanal
- [x] Templates pré-definidos
- [x] PWA básico

### v1.1 (Enhance)
- [ ] Estatísticas detalhadas
- [ ] Sistema de streaks
- [ ] Notificações
- [ ] Temas customizáveis
- [ ] Backup local

### v2.0 (Cloud)
- [ ] Backend completo
- [ ] Autenticação
- [ ] Sync multi-device
- [ ] Social features
- [ ] Achievements/Badges

## 🎯 Métricas de Sucesso

- Lighthouse Score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 200KB (initial)
- Acessibilidade AAA

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas!

## 📄 Licença

MIT License

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**
