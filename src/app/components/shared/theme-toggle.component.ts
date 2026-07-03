import { Component } from '@angular/core';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="themeService.toggle()"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      @if (themeService.currentTheme === 'dark') {
        <lucide-icon [img]="SunIcon" [size]="20" class="text-gray-400"></lucide-icon>
        Tema Claro
      } @else {
        <lucide-icon [img]="MoonIcon" [size]="20" class="text-gray-400"></lucide-icon>
        Tema Escuro
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  constructor(readonly themeService: ThemeService) {}
}
