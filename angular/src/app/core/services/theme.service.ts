import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private themeSubject: BehaviorSubject<Theme>;

  theme$: Observable<Theme>;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    this.themeSubject = new BehaviorSubject<Theme>(initial);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(initial);
  }

  toggle(): void {
    const next: Theme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(next);
    this.applyTheme(next);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      this.renderer.addClass(html, 'dark');
    } else {
      this.renderer.removeClass(html, 'dark');
    }
    localStorage.setItem('theme', theme);
  }
}
