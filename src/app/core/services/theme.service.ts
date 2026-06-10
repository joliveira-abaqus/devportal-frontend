import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject: BehaviorSubject<Theme>;
  theme$;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const initial = this.getInitialTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initial);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(initial);
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(next);
    this.applyTheme(next);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }
}
