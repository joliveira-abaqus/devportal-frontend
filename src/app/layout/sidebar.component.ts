import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, PlusCircle, FileText, Settings } from 'lucide-angular';
import { ThemeToggleComponent } from '../shared/components/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ThemeToggleComponent],
  template: `
    <aside
      class="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <lucide-icon [img]="fileTextIcon" class="h-6 w-6 text-brand-600" />
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">DevPortal</span>
        </a>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        @for (item of navigation; track item.name) {
          <a
            [routerLink]="item.href"
            routerLinkActive="bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
            [routerLinkActiveOptions]="{ exact: item.href === '/dashboard' }"
            class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <lucide-icon
              [img]="item.icon"
              class="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
            />
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
          <lucide-icon [img]="settingsIcon" class="h-5 w-5 text-gray-400" />
          Configurações
        </a>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly fileTextIcon = FileText;
  readonly settingsIcon = Settings;

  readonly navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Nova Solicitação', href: '/requests/new', icon: PlusCircle },
  ];
}
