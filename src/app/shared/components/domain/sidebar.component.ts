import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LucideLayoutDashboard,
  LucidePlusCircle,
  LucideFileText,
  LucideSettings,
} from '@lucide/angular';
import { ThemeToggleComponent } from './theme-toggle.component';

interface NavItem {
  name: string;
  href: string;
  iconType: 'dashboard' | 'plus';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
          <svg lucideFileText class="h-6 w-6 text-brand-600"></svg>
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">DevPortal</span>
        </a>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <a
          *ngFor="let item of navigation"
          [routerLink]="item.href"
          [class]="getNavClasses(item)"
        >
          <ng-container [ngSwitch]="item.iconType">
            <svg *ngSwitchCase="'dashboard'" lucideLayoutDashboard [class]="getIconClasses(item)"></svg>
            <svg *ngSwitchCase="'plus'" lucidePlusCircle [class]="getIconClasses(item)"></svg>
          </ng-container>
          {{ item.name }}
        </a>
      </nav>

      <div class="border-t border-gray-200 p-3 space-y-1 dark:border-gray-700">
        <app-theme-toggle></app-theme-toggle>
        <a
          href="#"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg lucideSettings class="h-5 w-5 text-gray-400"></svg>
          Configurações
        </a>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', iconType: 'dashboard' },
    { name: 'Nova Solicitação', href: '/requests/new', iconType: 'plus' },
  ];

  constructor(private readonly router: Router) {}

  isActive(item: NavItem): boolean {
    const url = this.router.url;
    return url === item.href || url.startsWith(item.href + '/');
  }

  getNavClasses(item: NavItem): string {
    const base = 'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';
    if (this.isActive(item)) {
      return `${base} bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300`;
    }
    return `${base} text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100`;
  }

  getIconClasses(item: NavItem): string {
    const base = 'h-5 w-5 flex-shrink-0';
    if (this.isActive(item)) {
      return `${base} text-brand-600 dark:text-brand-400`;
    }
    return `${base} text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400`;
  }
}
