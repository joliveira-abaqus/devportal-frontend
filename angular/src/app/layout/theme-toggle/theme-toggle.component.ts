import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [AsyncPipe, LucideAngularModule],
  template: `
    @if (theme$ | async; as theme) {
      <button
        (click)="themeService.toggle()"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        @if (theme === 'dark') {
          <lucide-icon [img]="SunIcon" class="h-5 w-5 text-gray-400" />
          Tema Claro
        } @else {
          <lucide-icon [img]="MoonIcon" class="h-5 w-5 text-gray-400" />
          Tema Escuro
        }
      </button>
    }
  `,
})
export class ThemeToggleComponent {
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  theme$;

  constructor(public themeService: ThemeService) {
    this.theme$ = themeService.theme$;
  }
}
