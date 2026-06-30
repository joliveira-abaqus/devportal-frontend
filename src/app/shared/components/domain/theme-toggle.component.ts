import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSun, LucideMoon } from '@lucide/angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideSun, LucideMoon],
  template: `
    <button
      (click)="themeService.toggle()"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <ng-container *ngIf="themeService.resolvedTheme() === 'dark'; else moonTpl">
        <svg lucideSun class="h-5 w-5 text-gray-400"></svg>
      </ng-container>
      <ng-template #moonTpl>
        <svg lucideMoon class="h-5 w-5 text-gray-400"></svg>
      </ng-template>
      {{ themeService.resolvedTheme() === 'dark' ? 'Tema Claro' : 'Tema Escuro' }}
    </button>
  `,
})
export class ThemeToggleComponent {
  constructor(public readonly themeService: ThemeService) {}
}
