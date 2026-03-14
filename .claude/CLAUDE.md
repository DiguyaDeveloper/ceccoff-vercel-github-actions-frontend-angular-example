# Project Memory

Instructions here apply to this project and are shared with team members.

## Context

Admin Dashboard SPA em Angular 21. Rebrand do template ThemeForest "Fuse" para **Ceccoff**.
Versão atual: **1.1.0**. Mock API habilitada em desenvolvimento. Tema padrão: **dark / classy / theme-default**.

---

## Estado Atual do Projeto

### Configuração Base (app.config.ts)

- Layout: `classy`
- Scheme: `dark`
- Theme: `theme-default` (azul cobalto #0047AB)

### Layouts Disponíveis (11)

- **Vertical:** classic, classy, compact, dense, thin, futuristic
- **Horizontal:** material, enterprise, centered, modern
- **Vazio:** empty (usado em auth pages)

### Temas Disponíveis (6)

`theme-default`, `theme-brand`, `theme-teal`, `theme-rose`, `theme-purple`, `theme-amber`

---

## Estrutura de Módulos

### @design-system — Design System

- `components/` — alert, card, drawer, loading-bar, masonry, highlight, fullscreen, navigation (vertical/horizontal)
- `directives/` — scrollbar, scroll-reset
- `lib/mock-api/` — HTTP interceptor de desenvolvimento
- `pipes/` — find-by-key
- `services/` — config, loading, confirmation, media-watcher, platform, splash-screen, utils
- `styles/` — SCSS: themes.scss, tailwind.scss, components/, overrides/
- `tailwind/` — plugins: generate-palette, icon-size, theming
- `validators/` — validadores customizados
- `version/` — CECCOFF_VERSION

### @core — Infraestrutura

- `auth/` — AuthService, AuthGuard, NoAuthGuard, authInterceptor, auth.utils.ts
- `icons/` — registro de ícones Material
- `navigation/` — NavigationService, tipos CeccoffNavigationItem, Navigation
- `transloco/` — configuração i18n (English/Turkish)
- `user/` — UserService, tipos User

### @layouts — Layouts

- `common/` — messages, notifications, user-menu, shortcuts, languages, quick-chat, search, settings
- `layouts/vertical/` — classic, classy, compact, dense, thin, futuristic
- `layouts/horizontal/` — material, enterprise, centered, modern
- `layouts/empty/` — para auth pages
- `layout.component.ts` — seletor de layout (aplica classes ao `<body>`)

### @features/admin — Admin Dashboard

#### Dashboards (4)

| Rota                    | Componente         | Serviço          |
| ----------------------- | ------------------ | ---------------- |
| `/dashboards/project`   | ProjectComponent   | ProjectService   |
| `/dashboards/analytics` | AnalyticsComponent | AnalyticsService |
| `/dashboards/finance`   | FinanceComponent   | FinanceService   |
| `/dashboards/crypto`    | CryptoComponent    | CryptoService    |

#### Apps (11)

| Rota                 | App         | Serviço            | Mock API                  |
| -------------------- | ----------- | ------------------ | ------------------------- |
| `/apps/mailbox`      | Mailbox     | MailboxService     | MailboxMockApi            |
| `/apps/chat`         | Chat        | ChatService        | ChatMockApi               |
| `/apps/tasks`        | Tasks       | TasksService       | TasksMockApi              |
| `/apps/agenda`       | Agenda      | AgendaService      | AgendaMockApi             |
| `/apps/contacts`     | Contacts    | ContactsService    | ContactsMockApi           |
| `/apps/academy`      | Academy     | AcademyService     | AcademyMockApi            |
| `/apps/ecommerce`    | ECommerce   | ECommerceService   | ECommerceInventoryMockApi |
| `/apps/file-manager` | FileManager | FileManagerService | FileManagerMockApi        |
| `/apps/help-center`  | HelpCenter  | HelpCenterService  | HelpCenterMockApi         |
| `/apps/notes`        | Notes       | NotesService       | NotesMockApi              |
| `/apps/scrumboard`   | Scrumboard  | ScrumboardService  | ScrumboardMockApi         |

#### Pages

- Profile, Settings (5 abas: Account, Security, Notifications, Team, Plan & Billing)
- Activities, Invoice (compact/modern), Pricing (modern/simple/single/table)
- Coming Soon (6 variações), Error 404/500, Maintenance

#### UI Showcase

Material Components, Ceccoff Components, Other Components, Cards, Colors,
Confirmation Dialog, Datatable, Forms, Icons, Page Layouts, TailwindCSS,
Typography, Animations, Advanced Search

### @features/auth — Autenticação

sign-in, sign-up, forgot-password, reset-password, sign-out, confirmation-required, unlock-session

### @features/landing

`/home` — Landing page pública

---

## Rotas Principais

```
/                          → redirect → /dashboards/project
/sign-in                   → NoAuthGuard
/sign-up                   → NoAuthGuard
/forgot-password           → NoAuthGuard
/reset-password            → NoAuthGuard
/sign-out                  → AuthGuard
/home                      → público
/dashboards/*              → AuthGuard
/apps/*                    → AuthGuard
/pages/*                   → AuthGuard
/ui/*                      → AuthGuard
/docs/*                    → AuthGuard
/404-not-found             → público
**                         → redirect → /404-not-found
```

**Características:**

- Lazy loading em todos os módulos
- PreloadAllModules habilitado
- `initialDataResolver` carrega em paralelo: navegação, mensagens, notificações, chats, atalhos

---

## Mock API (25 serviços)

Habilitada via `environment.enableMockApi = true` (desenvolvimento).
Intercepta requisições HTTP e retorna dados simulados.

**Common:** auth, user, navigation, messages, notifications, shortcuts, search
**Dashboards:** project, analytics, finance, crypto
**Apps:** mailbox, chat, tasks, agenda, contacts, academy, ecommerce, file-manager, help-center, notes, scrumboard
**UI:** icons
**Pages:** activities

---

## Padrão de um Feature (ex: Mailbox)

```
@features/admin/apps/mailbox/
├── mailbox.component.ts       # Container
├── mailbox.component.html
├── mailbox.component.scss
├── mailbox.routes.ts
├── mailbox.service.ts         # Lógica, BehaviorSubject, HTTP
├── mailbox.types.ts           # Mail, MailFolder, MailFilter, MailLabel
├── sidebar/
├── list/
├── details/
└── compose/

app/mock-api/apps/mailbox/
├── api.ts                     # Handlers das rotas mock
└── data.ts                    # Dados estáticos simulados
```

---

## Serviços do Design System

| Serviço                    | Propósito                     |
| -------------------------- | ----------------------------- |
| CeccoffConfigService       | Gerencia tema, layout, scheme |
| CeccoffLoadingService      | Barra de loading global       |
| CeccoffMediaWatcherService | Media queries e breakpoints   |
| CeccoffPlatformService     | Detecção de OS                |
| CeccoffSplashScreenService | Splash screen inicial         |
| CeccoffConfirmationService | Diálogos de confirmação       |
| CeccoffUtilsService        | Utilitários                   |

---

## HTTP Interceptors (ordem)

1. `ceccoffLoadingInterceptor` — barra de loading
2. `mockApiInterceptor` — Mock API (dev only)
3. `authInterceptor` — injeta token Bearer

---

## Autenticação

- Token salvo em `localStorage`
- `AuthService.check()` valida token ao inicializar
- `signInUsingToken()` para renovação silenciosa
- `AuthGuard` → redireciona para `/sign-in` se não autenticado
- `NoAuthGuard` → redireciona para `/dashboards/project` se já autenticado

---

## i18n (Transloco)

- Idiomas: `en` (padrão), `tr`
- Arquivos: `src/assets/i18n/en.json`, `tr.json`
- Switch dinâmico disponível no header (languages component)

---

## Ambientes

| Arquivo                    | enableMockApi | apiUrl          |
| -------------------------- | ------------- | --------------- |
| environment.development.ts | `true`        | localhost:3000  |
| environment.staging.ts     | `false`       | staging API     |
| environment.ts (prod)      | `false`       | api.ceccoff.com |

---

## Padrões Obrigatórios em Todo Código Novo

- `standalone: true` — sem NgModule
- `changeDetection: ChangeDetectionStrategy.OnPush` — sempre
- Signal inputs (`input()`) ao invés de `@Input()`
- `@if` / `@for` ao invés de `*ngIf` / `*ngFor`
- Unsubscribe com `takeUntil(this._unsubscribeAll)`
- `trackByFn` em listas

---

**Última análise automática:** 2026-03-04
