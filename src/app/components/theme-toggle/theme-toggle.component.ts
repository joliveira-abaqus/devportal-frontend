import { Component } from '@angular/core';
import { LucideSun, LucideMoon } from '@lucide/angular';
import { ThemeService } from '@app/core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideSun, LucideMoon],
  template: `
    <button
      (click)="themeService.toggle()"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      @if (themeService.currentTheme() === 'dark') {
        <svg lucideSun [size]="20" class="text-gray-400"></svg>
        Tema Claro
      } @else {
        <svg lucideMoon [size]="20" class="text-gray-400"></svg>
        Tema Escuro
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  constructor(readonly themeService: ThemeService) {}
}
