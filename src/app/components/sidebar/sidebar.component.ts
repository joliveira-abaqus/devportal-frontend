import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideLayoutDashboard,
  LucidePlusCircle,
  LucideFileText,
  LucideSettings,
} from '@lucide/angular';
import { ThemeToggleComponent } from '@app/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideLayoutDashboard,
    LucidePlusCircle,
    LucideFileText,
    LucideSettings,
    ThemeToggleComponent,
  ],
  template: `
    <aside class="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div class="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <svg lucideFileText [size]="24" class="text-brand-600"></svg>
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">DevPortal</span>
        </a>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
          [routerLinkActiveOptions]="{ exact: true }"
          class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        >
          <svg lucideLayoutDashboard [size]="20" class="flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"></svg>
          Dashboard
        </a>
        <a
          routerLink="/requests/new"
          routerLinkActive="bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
          [routerLinkActiveOptions]="{ exact: true }"
          class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        >
          <svg lucidePlusCircle [size]="20" class="flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"></svg>
          Nova Solicitação
        </a>
      </nav>

      <div class="border-t border-gray-200 p-3 space-y-1 dark:border-gray-700">
        <app-theme-toggle />
        <a
          href="#"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg lucideSettings [size]="20" class="text-gray-400"></svg>
          Configurações
        </a>
      </div>
    </aside>
  `,
})
export class SidebarComponent {}
