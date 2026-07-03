import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, PlusCircle, FileText, Settings } from 'lucide-angular';
import { cn } from '../services/utils';
import { ThemeToggleComponent } from './theme-toggle.component';

type IconData = typeof FileText;

interface NavItem {
  name: string;
  href: string;
  icon: IconData;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ThemeToggleComponent],
  template: `
    <aside
      class="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <lucide-icon [img]="FileTextIcon" [size]="24" class="text-brand-600"></lucide-icon>
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">DevPortal</span>
        </a>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        @for (item of navigation; track item.name) {
          <a
            [routerLink]="item.href"
            [class]="getNavItemClasses(item)"
          >
            <lucide-icon [img]="item.icon" [size]="20" [class]="getIconClasses(item)"></lucide-icon>
            {{ item.name }}
          </a>
        }
      </nav>

      <div class="space-y-1 border-t border-gray-200 p-3 dark:border-gray-700">
        <app-theme-toggle />
        <a
          href="#"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <lucide-icon [img]="SettingsIcon" [size]="20" class="text-gray-400"></lucide-icon>
          Configurações
        </a>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly FileTextIcon = FileText;
  readonly SettingsIcon = Settings;

  readonly navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Nova Solicitação', href: '/requests/new', icon: PlusCircle },
  ];

  isActive(item: NavItem): boolean {
    const url = this.router.url;
    return url === item.href || url.startsWith(item.href + '/');
  }

  getNavItemClasses(item: NavItem): string {
    const active = this.isActive(item);
    return cn(
      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100',
    );
  }

  getIconClasses(item: NavItem): string {
    const active = this.isActive(item);
    return cn(
      'h-5 w-5 flex-shrink-0',
      active
        ? 'text-brand-600 dark:text-brand-400'
        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
    );
  }
}
