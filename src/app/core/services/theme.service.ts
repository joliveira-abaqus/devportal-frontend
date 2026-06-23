import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, map } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'devportal-theme';
  private themeSubject: BehaviorSubject<Theme>;

  readonly theme$: Observable<Theme>;
  readonly isDark$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const initial = this.getInitialTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initial);
    this.theme$ = this.themeSubject.asObservable();
    this.isDark$ = this.theme$.pipe(
      map((theme) => theme === 'dark')
    );
    this.applyTheme(initial);
  }

  toggle(): void {
    const next: Theme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } catch {
        // localStorage indisponível
      }
    }
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
      } catch {
        // localStorage indisponível
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
    }
  }
}
