import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly isBrowser: boolean;

  readonly theme = signal<Theme>('system');
  readonly resolvedTheme = signal<'light' | 'dark'>('light');

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const stored = localStorage.getItem(this.storageKey) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        this.theme.set(stored);
      }
      this.applyTheme();

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => this.applyTheme());
    }

    effect(() => {
      const current = this.theme();
      if (this.isBrowser) {
        localStorage.setItem(this.storageKey, current);
        this.applyTheme();
      }
    });
  }

  toggle(): void {
    const current = this.resolvedTheme();
    this.theme.set(current === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(): void {
    if (!this.isBrowser) return;

    const current = this.theme();
    let resolved: 'light' | 'dark';

    if (current === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = current;
    }

    this.resolvedTheme.set(resolved);
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
