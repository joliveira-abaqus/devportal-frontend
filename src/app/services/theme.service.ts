import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeSubject = new BehaviorSubject<Theme>('light');

  readonly theme$ = this.themeSubject.asObservable();

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      this.applyTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.applyTheme('dark');
    } else {
      this.applyTheme('light');
    }
  }

  toggle(): void {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  private applyTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
