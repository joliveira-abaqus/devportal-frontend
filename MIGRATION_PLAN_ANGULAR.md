# Plano de Migração: Next.js → Angular 17+

> **DevPortal Frontend** — Documento de planejamento para migração completa do framework React/Next.js para Angular 17+ com standalone components.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Fase 0 — Preparação e Setup do Projeto Angular](#2-fase-0--preparação-e-setup-do-projeto-angular)
3. [Fase 1 — Infraestrutura Core (Autenticação e HTTP)](#3-fase-1--infraestrutura-core-autenticação-e-http)
4. [Fase 2 — Roteamento e Layouts](#4-fase-2--roteamento-e-layouts)
5. [Fase 3 — Componentes UI](#5-fase-3--componentes-ui)
6. [Fase 4 — Serviços de Dados](#6-fase-4--serviços-de-dados)
7. [Fase 5 — Páginas e Formulários](#7-fase-5--páginas-e-formulários)
8. [Fase 6 — Tema (Dark Mode)](#8-fase-6--tema-dark-mode)
9. [Fase 7 — Utilitários](#9-fase-7--utilitários)
10. [Fase 8 — Docker e Deploy](#10-fase-8--docker-e-deploy)
11. [Fase 9 — Testes](#11-fase-9--testes)
12. [Fase 10 — Limpeza e Documentação](#12-fase-10--limpeza-e-documentação)
13. [Dependências — Mapeamento](#13-dependências--mapeamento)
14. [Riscos e Mitigações](#14-riscos-e-mitigações)

---

## 1. Visão Geral

### Stack Atual

| Camada | Tecnologia | Detalhes |
|--------|-----------|----------|
| Framework | **Next.js 14** (App Router) | `next@^14.2.0`, modo `standalone`, `reactStrictMode: true` |
| Linguagem | **TypeScript 5.4+** | Strict mode, module resolution `bundler`, path alias `@/*` → `./src/*` |
| UI | **React 18.3** | Componentes funcionais, hooks, `forwardRef` para inputs |
| Estilização | **Tailwind CSS 3.4** | Dark mode via classe (`darkMode: 'class'`), plugin `@tailwindcss/forms`, cor customizada `brand` (paleta blue 50–950) |
| Autenticação | **NextAuth.js 4.24** | `CredentialsProvider`, estratégia JWT (24h), rota API `[...nextauth]/route.ts` |
| HTTP Client | **Axios 1.7** | Instância centralizada com `withCredentials: true`, interceptor 401 → redirect `/login` |
| Formulários | **react-hook-form 7.51** + **Zod 3.23** | `@hookform/resolvers` para integração Zod→RHF |
| Ícones | **lucide-react 0.370** | Ícones SVG como componentes React |
| Tema | **next-themes 0.4.6** | `attribute="class"`, `defaultTheme="system"`, `enableSystem` |
| CSS Utils | **clsx 2.1** + **tailwind-merge 2.3** | Função `cn()` para merge condicional de classes |
| Datas | **date-fns 3.6** | Locale `ptBR`, funções `format` e `formatDistanceToNow` |
| Testes E2E | **Playwright 1.43** | Chromium, vídeo + screenshot + trace, config em `e2e/playwright.config.ts` |
| Formatação | **Prettier 3.2** + **ESLint 8.57** | Plugin `prettier-plugin-tailwindcss`, config `eslint-config-next` |

### Stack Alvo

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | **Angular 17+** | Standalone components, signals, control flow (`@if`, `@for`) |
| Linguagem | **TypeScript 5.4+** | Mesma versão, tipos reutilizáveis |
| Roteamento | **Angular Router** | Lazy loading por rota, guards, resolvers |
| Formulários | **Angular Reactive Forms** | `FormGroup`, `FormControl`, `Validators` |
| HTTP | **HttpClient + HttpInterceptor** | Substitui Axios, suporte nativo a interceptors |
| Estilização | **Tailwind CSS 3.4+** | Manter mesma configuração, adaptar `content` paths |
| Ícones | **lucide-angular** | Mesmo pacote de ícones, wrapper Angular |
| Testes E2E | **Playwright** | Reutilizar specs com ajustes mínimos de seletores |
| Testes Unit | **Jest** ou **Jasmine/Karma** | Setup padrão Angular CLI |

### Estimativa de Esforço por Fase

| Fase | Descrição | Esforço Estimado |
|------|-----------|-----------------|
| 0 | Setup do projeto Angular | 1–2 dias |
| 1 | Autenticação e HTTP | 2–3 dias |
| 2 | Roteamento e Layouts | 1–2 dias |
| 3 | Componentes UI | 2–3 dias |
| 4 | Serviços de Dados | 1–2 dias |
| 5 | Páginas e Formulários | 3–4 dias |
| 6 | Dark Mode | 1 dia |
| 7 | Utilitários | 0.5 dia |
| 8 | Docker e Deploy | 1 dia |
| 9 | Testes | 2–3 dias |
| 10 | Limpeza e Documentação | 1 dia |
| **Total** | | **~15–22 dias úteis** |

---

## 2. Fase 0 — Preparação e Setup do Projeto Angular

### 2.1 Criar novo projeto Angular 17+

```bash
ng new devportal-frontend --standalone --style=css --routing --ssr=false
cd devportal-frontend
```

> **Nota:** Usar `--standalone` para componentes sem `NgModule`. Desabilitar SSR inicialmente (`--ssr=false`) — a aplicação atual usa Next.js standalone output sem SSR explícito em produção.

### 2.2 Configurar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init
```

Configurar `tailwind.config.js` replicando a config atual:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

Em `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100;
}
```

### 2.3 Configurar variáveis de ambiente

Criar arquivos `environment.ts` e `environment.prod.ts` em `src/environments/`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',    // substitui NEXT_PUBLIC_API_URL
  appUrl: 'http://localhost:4200',    // substitui NEXTAUTH_URL (porta padrão Angular)
};
```

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '${API_URL}',              // substituído no build/deploy
  appUrl: '${APP_URL}',
};
```

> **Alternativa para runtime config:** Caso seja necessário injetar variáveis em tempo de execução (sem rebuild), criar um arquivo `assets/config.json` carregado via `APP_INITIALIZER`.

### 2.4 Setup ESLint e Prettier

```bash
ng add @angular-eslint/schematics
npm install -D prettier prettier-plugin-tailwindcss eslint-config-prettier
```

Configurar `.prettierrc` mantendo as mesmas regras do projeto atual:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 2.5 Copiar tipos TypeScript

Os tipos em `src/types/index.ts` são TypeScript puro e podem ser copiados diretamente:

```typescript
// src/app/types/index.ts (Angular)
// Copiar integralmente — nenhuma dependência de React/Next.js

export type RequestType = 'bug_fix' | 'feature' | 'migration';
export type RequestStatus = 'pending' | 'in_progress' | 'review' | 'done' | 'failed';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface RequestEvent {
  id: string;
  requestId: string;
  type: 'status_change' | 'comment' | 'pr_linked' | 'file_attached';
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  userId: string;
  attachmentUrl?: string;
  attachmentName?: string;
  prUrl?: string;
  events: RequestEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
  type: RequestType;
  file?: File;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### 2.6 Instalar dependências adicionais

```bash
npm install date-fns lucide-angular tailwind-merge clsx
```

---

## 3. Fase 1 — Infraestrutura Core (Autenticação e HTTP)

### 3.1 HTTP Client Service — substitui `src/lib/api-client.ts`

**Arquivo atual (Axios):**
- Base URL: `NEXT_PUBLIC_API_URL || 'http://localhost:3001'`
- `withCredentials: true`
- Header: `Content-Type: application/json`
- Interceptor: 401 → `window.location.href = '/login'`

**Implementação Angular:**

```typescript
// src/app/core/interceptors/api.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const apiReq = req.clone({
    url: req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`,
    withCredentials: true,
    setHeaders: {
      'Content-Type': 'application/json',
      ...(authService.getToken() ? { Authorization: `Bearer ${authService.getToken()}` } : {}),
    },
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
```

Registrar no `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiInterceptor])),
    // ...
  ],
};
```

### 3.2 Auth Service — substitui `src/lib/auth.ts` + NextAuth.js

**Comportamento atual (Dual-Auth Strategy):**
1. Login chama `POST /auth/login` diretamente no backend (define cookie `token` httpOnly)
2. Depois chama `signIn('credentials', ...)` do NextAuth para criar sessão client-side
3. Backend retorna: `{ data: { id, email, name } }`
4. JWT com `maxAge: 24h`
5. Middleware lê token NextAuth para proteger rotas

**Implementação Angular:**

```typescript
// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  data: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<AuthUser | null>(null);
  private tokenKey = 'devportal_token';

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadStoredSession();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // Chama POST /auth/login — o backend define o cookie httpOnly "token"
    return this.http.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        const user = response.data ?? (response as unknown as AuthUser);
        this.currentUser.set(user);
        localStorage.setItem('devportal_user', JSON.stringify(user));
      }),
    );
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.http.post('/auth/register', { name, email, password });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem('devportal_user');
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadStoredSession(): void {
    const stored = localStorage.getItem('devportal_user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        this.clearSession();
      }
    }
  }
}
```

> **Nota importante:** A aplicação atual usa uma estratégia dupla: cookie httpOnly definido pelo backend + sessão NextAuth. No Angular, simplificamos para depender apenas do cookie httpOnly do backend (já que `withCredentials: true` envia o cookie automaticamente). O `AuthService` armazena apenas os dados do usuário para exibição na UI. O token JWT real continua sendo gerenciado pelo backend via cookie httpOnly.

### 3.3 Auth Guard — substitui `src/middleware.ts`

**Comportamento atual:**
- Middleware Next.js intercepta rotas que correspondem a `/dashboard/:path*` e `/requests/:path*`
- Verifica token JWT via `getToken()` do NextAuth
- Redireciona para `/login?callbackUrl=<pathname>` se não autenticado

**Implementação Angular:**

```typescript
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login com callbackUrl (mesmo comportamento do middleware atual)
  return router.createUrlTree(['/login'], {
    queryParams: { callbackUrl: state.url },
  });
};
```

---

## 4. Fase 2 — Roteamento e Layouts

### 4.1 Estrutura de rotas

**Mapeamento das rotas atuais do Next.js App Router para Angular Router:**

| Next.js (App Router) | Angular Route | Componente | Guard |
|---|---|---|---|
| `src/app/page.tsx` → `redirect('/login')` | `''` → redirect `/login` | — | — |
| `src/app/login/page.tsx` | `/login` | `LoginComponent` | — |
| `src/app/register/page.tsx` | `/register` | `RegisterComponent` | — |
| `src/app/dashboard/page.tsx` | `/dashboard` | `DashboardComponent` | `authGuard` |
| `src/app/requests/new/page.tsx` | `/requests/new` | `NewRequestComponent` | `authGuard` |
| `src/app/requests/[id]/page.tsx` | `/requests/:id` | `RequestDetailComponent` | `authGuard` |

**Configuração de rotas:**

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas públicas (sem sidebar/header)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  },

  // Rotas protegidas (com sidebar + header via MainLayoutComponent)
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'requests/new',
        loadComponent: () => import('./pages/requests/new-request/new-request.component').then(m => m.NewRequestComponent),
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./pages/requests/request-detail/request-detail.component').then(m => m.RequestDetailComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
```

> **Nota:** Usar `loadComponent` com `import()` dinâmico garante lazy loading automático por rota — equivalente ao code splitting automático do Next.js.

### 4.2 Layout Principal — substitui `src/app/dashboard/layout.tsx`

**Comportamento atual:**
- `DashboardLayout` envolve todas as páginas sob `/dashboard` com `<Sidebar>` + `<Header>` + `<main>`
- As páginas `/requests/new` e `/requests/[id]` renderizam `<Sidebar>` e `<Header>` individualmente dentro de cada page

**Implementação Angular:**

```typescript
// src/app/layouts/main-layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {}
```

### 4.3 Root Layout — substitui `src/app/layout.tsx`

**Comportamento atual:**
- `<html lang="pt-BR" suppressHydrationWarning>`
- Fonte Inter (Google Fonts)
- Wrapping com `<ThemeProvider>` e `<SessionProvider>`

**Implementação Angular:**

Em `index.html`:

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>DevPortal</title>
  <meta name="description" content="Portal de solicitações de desenvolvimento">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="font-['Inter']">
  <app-root></app-root>
</body>
</html>
```

---

## 5. Fase 3 — Componentes UI

### 5.1 Inventário de componentes atuais

| Componente React | Arquivo | Descrição | Complexidade |
|---|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | 5 variantes (`primary`, `secondary`, `outline`, `ghost`, `danger`), 3 tamanhos, estado `isLoading`, `forwardRef` | Média |
| `Input` | `src/components/ui/Input.tsx` | Label opcional, mensagem de erro, `forwardRef` | Baixa |
| `Select` | `src/components/ui/Select.tsx` | Label opcional, array de opções, mensagem de erro, `forwardRef` | Baixa |
| `Card` | `src/components/ui/Card.tsx` | Wrapper com borda, sombra, padding, dark mode | Baixa |
| `Badge` | `src/components/ui/Badge.tsx` | 5 variantes de cor (`default`, `success`, `warning`, `error`, `info`) | Baixa |
| `Modal` | `src/components/ui/Modal.tsx` | Overlay, fechar com Escape, bloqueio de scroll, click outside | Média |
| `Sidebar` | `src/components/Sidebar.tsx` | Navegação com ícones, item ativo via `usePathname()`, `ThemeToggle` | Média |
| `Header` | `src/components/Header.tsx` | Exibe nome do usuário (via `useSession()`), botão Sair (via `signOut()`) | Média |
| `RequestCard` | `src/components/RequestCard.tsx` | Card clicável com status badge, tipo, data relativa | Baixa |
| `RequestForm` | `src/components/RequestForm.tsx` | Formulário com Zod validation (título min 3, descrição min 10, tipo enum), submit via apiClient | Alta |
| `RequestTimeline` | `src/components/RequestTimeline.tsx` | Timeline vertical com ícones por tipo de evento, link para PR | Média |
| `StatusBadge` | `src/components/StatusBadge.tsx` | Mapeia `RequestStatus` → variante do `Badge` | Baixa |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Toggle dark/light com `next-themes`, hydration guard (`mounted`) | Baixa |
| `FileUpload` | `src/components/FileUpload.tsx` | Upload com drag area, preview do arquivo selecionado, botão remover | Média |

### 5.2 Estratégia de migração

#### Componentes UI base (`ui/`)

Migrar como **standalone components** Angular. Manter classes Tailwind CSS idênticas.

Exemplo — `ButtonComponent`:

```typescript
// src/app/shared/components/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || isLoading"
      [ngClass]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      @if (isLoading) {
        <svg class="-ml-1 mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Carregando...
      } @else {
        <ng-content />
      }
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() class = '';
  @Output() onClick = new EventEmitter<MouseEvent>();

  // Manter mesmas classes Tailwind do componente React
  get buttonClasses(): string {
    return cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors ...',
      variantMap[this.variant],
      sizeMap[this.size],
      this.class,
    );
  }
}
```

#### Utilitário `cn()` — substitui `src/lib/utils.ts`

A função `cn()` usa `clsx` + `tailwind-merge` e **não tem dependência de React**. Pode ser copiada diretamente:

```typescript
// src/app/shared/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Alternativa: usar `[ngClass]` diretamente nos templates, mas `cn()` é mais limpo para composição de muitas classes condicionais.

### 5.3 Componentes de layout

#### `SidebarComponent` — substitui `src/components/Sidebar.tsx`

**Pontos de atenção:**
- Usa `usePathname()` para detectar rota ativa → Angular: injetar `Router` e usar `router.url` ou `routerLinkActive`
- Renderiza ícones lucide dinamicamente → usar `lucide-angular`
- Inclui `<ThemeToggle>` no footer

```typescript
// Usar routerLink e routerLinkActive do Angular Router
@Component({
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <aside class="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <!-- ... -->
      <nav class="flex-1 space-y-1 px-3 py-4">
        @for (item of navigation; track item.href) {
          <a [routerLink]="item.href" routerLinkActive="bg-brand-50 text-brand-700 ..."
             [routerLinkActiveOptions]="{ exact: item.href === '/dashboard' }"
             class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors">
            <lucide-icon [name]="item.icon" class="h-5 w-5" />
            {{ item.name }}
          </a>
        }
      </nav>
      <!-- ... -->
    </aside>
  `,
})
```

#### `HeaderComponent` — substitui `src/components/Header.tsx`

**Pontos de atenção:**
- Usa `useSession()` do NextAuth para obter nome do usuário → Angular: injetar `AuthService` e ler `authService.user()`
- Botão "Sair" chama `signOut()` → Angular: chamar `authService.logout()`

---

## 6. Fase 4 — Serviços de Dados

### 6.1 `RequestsService` — substitui `src/hooks/useRequests.ts`

**Comportamento atual:**
- Hook `useRequests({ status?, type? })` que retorna `{ requests, isLoading, error, refetch }`
- Chama `GET /requests?status=X&type=Y` via `apiClient`
- Resposta: `Array<Request>` ou `{ data: Request[] }`

**Implementação Angular:**

```typescript
// src/app/core/services/requests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Request, RequestStatus, RequestType } from '../../types';

interface RequestsFilter {
  status?: RequestStatus;
  type?: RequestType;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(private http: HttpClient) {}

  getRequests(filter: RequestsFilter = {}): Observable<Request[]> {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.type) params = params.set('type', filter.type);

    return this.http.get<Request[] | { data: Request[] }>('/requests', { params }).pipe(
      map((body) => (Array.isArray(body) ? body : body.data ?? [])),
    );
  }

  getRequest(id: string): Observable<Request> {
    return this.http.get<Request | { data: Request }>(`/requests/${id}`).pipe(
      map((body) => ('data' in body ? body.data : body)),
    );
  }

  createRequest(payload: { title: string; description: string; type: RequestType }): Observable<Request> {
    return this.http.post<{ data: Request }>('/requests', payload).pipe(
      map((body) => body.data ?? (body as unknown as Request)),
    );
  }
}
```

### 6.2 Alternativa com Angular Signals

Para componentes que precisam de estado reativo local (substituindo `useState` + `useEffect`):

```typescript
// Nos componentes que consomem os dados:
@Component({ /* ... */ })
export class DashboardComponent {
  private requestsService = inject(RequestsService);

  requests = signal<Request[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  statusFilter = signal<RequestStatus | ''>('');
  typeFilter = signal<RequestType | ''>('');

  constructor() {
    // Efeito reativo: recarrega quando filtros mudam
    effect(() => {
      this.loadRequests(this.statusFilter(), this.typeFilter());
    });
  }

  private loadRequests(status: string, type: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.requestsService
      .getRequests({
        status: status || undefined,
        type: type || undefined,
      })
      .subscribe({
        next: (data) => { this.requests.set(data); this.isLoading.set(false); },
        error: () => { this.error.set('Erro ao carregar solicitações'); this.isLoading.set(false); },
      });
  }
}
```

---

## 7. Fase 5 — Páginas e Formulários

### 7.1 `LoginComponent` — substitui `src/app/login/page.tsx`

**Comportamento atual:**
1. Formulário com campos `email` (validação email) e `password` (min 1 char)
2. Submit: chama `POST /auth/login` via `fetch` direto (com `credentials: 'include'`) + `signIn('credentials', ...)` do NextAuth
3. Sucesso → `router.push(callbackUrl)` (default: `/dashboard`)
4. Erro → exibe mensagem "Email ou senha inválidos"
5. Suporte a `callbackUrl` via query param (com validação de segurança: deve começar com `/` e não `//`)

**Implementação Angular com Reactive Forms:**

```typescript
// src/app/pages/login/login.component.ts
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <!-- Logo + título -->
        <div class="mb-8 text-center">
          <lucide-icon name="file-text" class="mx-auto h-12 w-12 text-brand-600" />
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">DevPortal</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Faça login para acessar o portal</p>
        </div>

        <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            @if (error()) {
              <div class="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
                <p class="text-sm text-red-700 dark:text-red-400">{{ error() }}</p>
              </div>
            }
            <app-input id="email" type="email" label="Email" formControlName="email"
                       placeholder="seu@email.com" [error]="getError('email')" />
            <app-input id="password" type="password" label="Senha" formControlName="password"
                       placeholder="••••••••" [error]="getError('password')" />
            <app-button type="submit" class="w-full" [isLoading]="isLoading()">Entrar</app-button>
          </form>
          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Não tem conta? <a routerLink="/register" class="font-medium text-brand-600 hover:text-brand-500">Registre-se</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  error = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        const callbackUrl = this.route.snapshot.queryParamMap.get('callbackUrl') || '/dashboard';
        const safeUrl = callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/dashboard';
        this.router.navigateByUrl(safeUrl);
      },
      error: () => {
        this.error.set('Email ou senha inválidos');
        this.isLoading.set(false);
      },
    });
  }
}
```

### 7.2 `RegisterComponent` — substitui `src/app/register/page.tsx`

**Comportamento atual:**
- Campos: `name` (min 2), `email`, `password` (min 8), `confirmPassword`
- Validação Zod: `refine` para verificar que passwords coincidem
- Submit: `POST /auth/register` via `apiClient`
- Sucesso → redirect para `/login?registered=true`

**Implementação Angular:**

```typescript
registerForm = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  confirmPassword: new FormControl('', [Validators.required]),
}, {
  validators: [passwordMatchValidator],  // custom validator cross-field
});

// Validator customizado para substituir o Zod refine:
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}
```

### 7.3 `DashboardComponent` — substitui `src/app/dashboard/page.tsx`

**Comportamento atual:**
- Exibe título "Minhas Solicitações" com botão "Nova Solicitação"
- Filtros: Select para status (6 opções) e tipo (4 opções)
- Lista de `<RequestCard>` ou skeleton loading (3 placeholders animados) ou mensagem de erro ou estado vazio
- Dados via hook `useRequests({ status, type })`

**Implementação Angular:**
- Usar `signals` para filtros e estado
- `@for` para iterar requests
- `@if` para estados loading/error/empty
- `routerLink` para navegação

### 7.4 `RequestFormComponent` — substitui `src/components/RequestForm.tsx`

**Comportamento atual (Zod schema):**

```typescript
const requestSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['bug_fix', 'feature', 'migration']),
});
```

**Equivalente Angular Reactive Forms:**

```typescript
requestForm = new FormGroup({
  title: new FormControl('', [
    Validators.required,
    Validators.minLength(3),       // "Título deve ter pelo menos 3 caracteres"
  ]),
  description: new FormControl('', [
    Validators.required,
    Validators.minLength(10),      // "Descrição deve ter pelo menos 10 caracteres"
  ]),
  type: new FormControl<RequestType>('feature', [
    Validators.required,
    Validators.pattern(/^(bug_fix|feature|migration)$/),
  ]),
});
```

**Mensagens de erro customizadas** (replicando o comportamento do Zod):

```typescript
getErrorMessage(field: string): string | null {
  const control = this.requestForm.get(field);
  if (!control?.errors || !control.touched) return null;

  if (control.errors['required']) return `${labels[field]} é obrigatório`;
  if (control.errors['minlength']) {
    const min = control.errors['minlength'].requiredLength;
    return `${labels[field]} deve ter pelo menos ${min} caracteres`;
  }
  return null;
}
```

### 7.5 `RequestDetailComponent` — substitui `src/app/requests/[id]/page.tsx`

**Comportamento atual:**
- Obtém `id` via `useParams()`
- Busca request via `useRequest(id)`
- Exibe: título, StatusBadge, tipo (com label traduzido), data de criação formatada
- Seções condicionais: Pull Request (link externo), Arquivo Anexo (link download)
- Timeline de eventos via `<RequestTimeline>`
- Link "Voltar ao Dashboard"

**Implementação Angular:**

```typescript
@Component({ /* ... */ })
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private requestsService = inject(RequestsService);

  request = signal<Request | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.requestsService.getRequest(id).subscribe({
      next: (data) => { this.request.set(data); this.isLoading.set(false); },
      error: () => { this.error.set('Erro ao carregar solicitação'); this.isLoading.set(false); },
    });
  }
}
```

---

## 8. Fase 6 — Tema (Dark Mode)

### 8.1 Comportamento atual (`next-themes`)

- `ThemeProvider` com `attribute="class"` adiciona/remove classe `dark` no `<html>`
- `defaultTheme="system"` detecta preferência do sistema
- `enableSystem` permite seguir `prefers-color-scheme`
- Componente `ThemeToggle` usa `resolvedTheme` + hydration guard (`mounted` state)
- Preferência salva automaticamente no `localStorage` (chave `theme`)

### 8.2 Implementação Angular — `ThemeService`

```typescript
// src/app/core/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'theme';
  private theme = signal<Theme>(this.getStoredTheme());

  readonly currentTheme = this.theme.asReadonly();
  readonly resolvedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Aplica tema ao <html> reativamente
    effect(() => {
      const resolved = this.resolveTheme(this.theme());
      this.resolvedTheme.set(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      localStorage.setItem(this.storageKey, this.theme());
    });

    // Escuta mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme() === 'system') {
        const resolved = this.resolveTheme('system');
        this.resolvedTheme.set(resolved);
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      }
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggle(): void {
    const next = this.resolvedTheme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.storageKey);
    return (stored as Theme) || 'system';
  }

  private resolveTheme(theme: Theme): 'light' | 'dark' {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }
}
```

### 8.3 `ThemeToggleComponent` — substitui `src/components/ThemeToggle.tsx`

```typescript
@Component({
  standalone: true,
  template: `
    <button (click)="themeService.toggle()"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
      @if (themeService.resolvedTheme() === 'dark') {
        <lucide-icon name="sun" class="h-5 w-5 text-gray-400" />
        Tema Claro
      } @else {
        <lucide-icon name="moon" class="h-5 w-5 text-gray-400" />
        Tema Escuro
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
```

> **Nota:** No Angular não há problema de hydration mismatch (não tem SSR habilitado), então o guard `mounted` do React é desnecessário.

---

## 9. Fase 7 — Utilitários

### 9.1 Funções de `src/lib/utils.ts`

| Função atual | Dependência | Ação |
|---|---|---|
| `cn(...inputs)` | `clsx`, `tailwind-merge` | Copiar diretamente — não usa React |
| `formatDate(date)` | `date-fns`, `ptBR` | Copiar diretamente — não usa React |
| `formatRelativeDate(date)` | `date-fns`, `ptBR` | Copiar diretamente — não usa React |
| `requestTypeLabels` | Nenhuma | Copiar diretamente |
| `requestStatusLabels` | Nenhuma | Copiar diretamente |

**Arquivo Angular:**

```typescript
// src/app/shared/utils/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export const requestTypeLabels: Record<string, string> = {
  bug_fix: 'Bug Fix',
  feature: 'Feature',
  migration: 'Migration',
};

export const requestStatusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
  failed: 'Falhou',
};
```

> Todas as funções de `utils.ts` são **100% reutilizáveis** sem modificação.

---

## 10. Fase 8 — Docker e Deploy

### 10.1 Dockerfile atual (Next.js standalone)

O Dockerfile atual é um multi-stage build complexo com 3 estágios (deps → builder → runner) que produz um servidor Node.js standalone.

### 10.2 Dockerfile Angular (muito mais simples)

Como a aplicação Angular sem SSR é um SPA puro (arquivos estáticos), podemos servir com nginx:

```dockerfile
# Estágio 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Servir com nginx
FROM nginx:alpine AS runner

# Copiar config do nginx para SPA (rewrite todas as rotas para index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefatos do build
COPY --from=builder /app/dist/devportal-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Arquivo `nginx.conf`:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA: todas as rotas redirecionam para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> **Vantagem:** Imagem final muito menor (~30MB nginx vs ~150MB+ Node.js). Sem runtime Node.js necessário.

### 10.3 Variáveis de ambiente em runtime

**Problema:** Angular compila variáveis de ambiente no build time (`environment.ts`). Para configuração em runtime (sem rebuild por ambiente):

**Solução:** Criar `assets/config.json` substituído no entrypoint do container:

```bash
# entrypoint.sh
#!/bin/sh
envsubst < /usr/share/nginx/html/assets/config.template.json > /usr/share/nginx/html/assets/config.json
exec "$@"
```

```json
// assets/config.template.json
{
  "apiUrl": "${API_URL}",
  "appUrl": "${APP_URL}"
}
```

Carregar via `APP_INITIALIZER`:

```typescript
// src/app/core/config/app-config.service.ts
export function initializeApp(http: HttpClient): () => Observable<void> {
  return () => http.get<AppConfig>('/assets/config.json').pipe(
    tap((config) => AppConfigService.config = config),
    map(() => void 0),
  );
}
```

---

## 11. Fase 9 — Testes

### 11.1 Testes E2E — adaptar Playwright

**Testes atuais:**

| Arquivo | Testes | Reutilizável? |
|---|---|---|
| `e2e/auth.spec.ts` | 5 testes: exibir login, login válido, login inválido, logout, exibir registro, redirect sem auth | **~90%** — seletores por label/role são agnósticos de framework |
| `e2e/requests.spec.ts` | 5 testes: listar no dashboard, navegar para form, validar campos, criar com sucesso, exibir filtros | **~90%** — mesma situação |

**O que precisa mudar:**

1. **Porta padrão:** `3000` → `4200` (ou manter 3000 se configurado)
2. **Tempo de resposta:** Angular pode ter tempos de carregamento diferentes; ajustar timeouts se necessário
3. **Seletores:** A maioria usa `getByLabel`, `getByRole`, `getByText` que são agnósticos de framework. Possíveis mudanças:
   - Se a estrutura HTML mudar significativamente (improvável se manter mesmas classes Tailwind)
4. **Config do Playwright:** Atualizar `webServer.command` de `npm run start` para `npm run serve` ou `ng serve`

**Arquivo adaptado (exemplo):**

```typescript
// e2e/playwright.config.ts — Angular
export default defineConfig({
  // ...mesma config...
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    // ...
  },
  webServer: process.env.CI
    ? {
        command: 'npx ng serve --port 4200',
        port: 4200,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
```

### 11.2 Testes Unitários

Configurar testes unitários para serviços e componentes críticos:

| Serviço/Componente | Prioridade | Framework |
|---|---|---|
| `AuthService` | Alta | Jest ou Jasmine |
| `RequestsService` | Alta | Jest ou Jasmine |
| `ThemeService` | Média | Jest ou Jasmine |
| `AuthGuard` | Alta | Jest ou Jasmine |
| `ApiInterceptor` | Alta | Jest ou Jasmine |
| `LoginComponent` | Média | TestBed + HttpClientTestingModule |
| `RequestFormComponent` | Média | TestBed |

---

## 12. Fase 10 — Limpeza e Documentação

### 12.1 Atualizar README.md

```markdown
# DevPortal Frontend (Angular)

## Pré-requisitos
- Node.js 20+
- Angular CLI 17+

## Setup
npm install
cp src/environments/environment.example.ts src/environments/environment.ts

## Desenvolvimento
ng serve                    # http://localhost:4200

## Build
ng build --configuration production

## Testes
npm run test                # Testes unitários
npm run test:e2e            # Testes E2E com Playwright

## Lint
ng lint
```

### 12.2 Remover dependências React/Next.js

Dependências a remover do `package.json`:

```
next, react, react-dom
next-auth, next-themes
react-hook-form, @hookform/resolvers
axios
lucide-react
eslint-config-next
@types/react, @types/react-dom
```

### 12.3 Checklist de QA final

- [ ] Todos os fluxos de autenticação funcionam (login, registro, logout, redirect)
- [ ] Rotas protegidas redirecionam corretamente para login
- [ ] Dashboard exibe lista de solicitações com filtros
- [ ] Formulário de nova solicitação valida e submete
- [ ] Página de detalhe exibe dados e timeline
- [ ] Dark mode funciona (toggle + persistência + preferência do sistema)
- [ ] Build de produção sem erros
- [ ] Docker build funciona
- [ ] Todos os testes E2E passam
- [ ] Lint sem erros

---

## 13. Dependências — Mapeamento

| Atual (Next.js) | Angular Equivalente | Notas |
|---|---|---|
| `next@^14.2.0` | `@angular/core`, `@angular/cli` | Framework completo |
| `react@^18.3.0`, `react-dom@^18.3.0` | *(built-in)* | Angular não precisa de lib separada de view |
| `next-auth@^4.24.0` | **Custom `AuthService` + `AuthGuard`** | Serviço customizado com JWT; sem equivalente direto no Angular |
| `react-hook-form@^7.51.0` | `@angular/forms` (Reactive Forms) | `FormGroup`, `FormControl`, `Validators` |
| `zod@^3.23.0` + `@hookform/resolvers@^3.3.0` | `Validators` do Angular ou `class-validator` | Validators built-in cobrem a maioria; para schemas complexos, usar `class-validator` |
| `axios@^1.7.0` | `@angular/common/http` (`HttpClient`) | Built-in, suporte a interceptors via `HttpInterceptorFn` |
| `next-themes@^0.4.6` | **Custom `ThemeService`** | Serviço simples com `localStorage` + `classList.toggle('dark')` |
| `clsx@^2.1.0` + `tailwind-merge@^2.3.0` | `clsx` + `tailwind-merge` (**manter**) | Função `cn()` é TypeScript puro — reutilizar sem alteração |
| `lucide-react@^0.370.0` | `lucide-angular` | Mesmo pacote de ícones, wrapper Angular |
| `date-fns@^3.6.0` | `date-fns` (**manter**) | Biblioteca de datas independente de framework |
| `tailwindcss@^3.4.0` | `tailwindcss` (**manter**, reconfigurar `content` paths) | Apenas mudar caminhos de scan: `./src/**/*.{html,ts}` |
| `@tailwindcss/forms@^0.5.7` | `@tailwindcss/forms` (**manter**) | Plugin Tailwind independente de framework |
| `postcss@^8.4.0` + `autoprefixer@^10.4.0` | `postcss` + `autoprefixer` (**manter**) | Processamento CSS idêntico |
| `@playwright/test@^1.43.0` | `@playwright/test` (**manter**) | Testes E2E agnósticos de framework |
| `eslint@^8.57.0` + `eslint-config-next` | `@angular-eslint/schematics` | ESLint configurado para Angular |
| `prettier@^3.2.0` + `prettier-plugin-tailwindcss` | `prettier` + `prettier-plugin-tailwindcss` (**manter**) | Formatação idêntica |
| `typescript@^5.4.0` | `typescript@^5.4.0` (**manter**) | Mesma versão |

**Resumo:** Das 16 dependências, **7 podem ser mantidas sem alteração**, 5 são substituídas por módulos built-in do Angular, e 4 precisam de implementação customizada ou pacote alternativo.

---

## 14. Riscos e Mitigações

### 14.1 API Routes (`src/app/api/auth/[...nextauth]/route.ts`)

| Risco | Impacto | Mitigação |
|---|---|---|
| NextAuth API route handler não tem equivalente em Angular — todo o fluxo de autenticação server-side desaparece | **Alto** | A aplicação já faz chamada direta ao backend (`POST /auth/login`) antes de criar a sessão NextAuth. No Angular, basta manter a chamada direta. O cookie httpOnly é definido pelo backend, não pelo frontend. A sessão NextAuth era redundante e pode ser eliminada. |

### 14.2 Server-Side Rendering (SSR)

| Risco | Impacto | Mitigação |
|---|---|---|
| Angular Universal é mais complexo de configurar que Next.js para SSR | **Baixo** | A aplicação atual usa `output: 'standalone'` mas todos os componentes são marcados como `'use client'`. Na prática não há SSR real sendo utilizado. Angular SPA sem SSR é suficiente. Se SSR for necessário no futuro, avaliar Angular Universal separadamente. |

### 14.3 Code Splitting automático

| Risco | Impacto | Mitigação |
|---|---|---|
| Next.js faz code splitting automático por rota; Angular requer `loadComponent` explícito | **Baixo** | Usar `loadComponent` com `import()` dinâmico em todas as rotas (já demonstrado na seção de roteamento). O resultado é equivalente ao code splitting do Next.js. |

### 14.4 Variáveis de ambiente

| Risco | Impacto | Mitigação |
|---|---|---|
| Next.js expõe variáveis `NEXT_PUBLIC_*` no client-side automaticamente; Angular não tem esse mecanismo | **Médio** | Usar `environment.ts` para build time ou `assets/config.json` + `APP_INITIALIZER` para runtime config (detalhado na Fase 8). Nunca expor secrets no client-side — `NEXTAUTH_SECRET` e `BACKEND_URL` não são necessários no Angular (eram usados apenas pelo NextAuth server-side). |

### 14.5 Middleware de autenticação

| Risco | Impacto | Mitigação |
|---|---|---|
| `middleware.ts` do Next.js roda no edge/server antes da renderização; Angular guards rodam no client | **Médio** | Em SPAs, guards no client-side são o padrão da indústria. O backend já protege todas as rotas com middleware JWT (`401 Unauthorized`). O guard Angular é uma camada de UX, não de segurança. Segurança real permanece no backend. |

### 14.6 Tempo de migração

| Risco | Impacto | Mitigação |
|---|---|---|
| Migração pode demorar mais que o estimado (15–22 dias) | **Médio** | Executar fases incrementalmente. Cada fase pode ser validada independentemente. Priorizar Fases 0–5 (funcionalidade core) e deixar Fases 6–10 como refinamento. Considerar período de transição onde ambas as aplicações coexistem. |

### 14.7 Curva de aprendizado

| Risco | Impacto | Mitigação |
|---|---|---|
| Equipe pode ter mais experiência com React que Angular | **Médio** | Documentar padrões e convenções claramente. Usar standalone components (API mais simples, sem NgModules). Usar Angular Signals (API mais próxima de React hooks). Prover exemplos de código para cada padrão de migração. |

---

## Estrutura de arquivos proposta (Angular)

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── api.interceptor.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── requests.service.ts
│   │       └── theme.service.ts
│   ├── layouts/
│   │   └── main-layout/
│   │       └── main-layout.component.ts
│   ├── pages/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   ├── register/
│   │   │   └── register.component.ts
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   └── requests/
│   │       ├── new-request/
│   │       │   └── new-request.component.ts
│   │       └── request-detail/
│   │           └── request-detail.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── button/
│   │   │   │   └── button.component.ts
│   │   │   ├── input/
│   │   │   │   └── input.component.ts
│   │   │   ├── select/
│   │   │   │   └── select.component.ts
│   │   │   ├── card/
│   │   │   │   └── card.component.ts
│   │   │   ├── badge/
│   │   │   │   └── badge.component.ts
│   │   │   ├── modal/
│   │   │   │   └── modal.component.ts
│   │   │   ├── file-upload/
│   │   │   │   └── file-upload.component.ts
│   │   │   ├── header/
│   │   │   │   └── header.component.ts
│   │   │   ├── sidebar/
│   │   │   │   └── sidebar.component.ts
│   │   │   ├── request-card/
│   │   │   │   └── request-card.component.ts
│   │   │   ├── request-timeline/
│   │   │   │   └── request-timeline.component.ts
│   │   │   ├── status-badge/
│   │   │   │   └── status-badge.component.ts
│   │   │   └── theme-toggle/
│   │   │       └── theme-toggle.component.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── config.json
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── styles.css
└── index.html
e2e/
├── auth.spec.ts
├── requests.spec.ts
└── playwright.config.ts
Dockerfile
nginx.conf
```

---

> **Próximos passos:** Iniciar pela **Fase 0** criando o projeto Angular e configurando o ambiente. Validar cada fase com testes antes de prosseguir para a próxima.
