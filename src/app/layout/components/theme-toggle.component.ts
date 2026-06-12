import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <lucide-icon
        *ngIf="(themeService.theme$ | async) === 'dark'"
        [img]="SunIcon"
        class="h-5 w-5 text-gray-400"
        [size]="20"
      ></lucide-icon>
      <lucide-icon
        *ngIf="(themeService.theme$ | async) !== 'dark'"
        [img]="MoonIcon"
        class="h-5 w-5 text-gray-400"
        [size]="20"
      ></lucide-icon>
      {{ (themeService.theme$ | async) === 'dark' ? 'Tema Claro' : 'Tema Escuro' }}
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  constructor(public themeService: ThemeService) {}
}
