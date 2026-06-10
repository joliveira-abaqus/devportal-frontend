import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">DevPortal</h1>
      </div>

      <div class="flex items-center gap-4">
        <div *ngIf="authService.currentUser$ | async as user" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{{ user.name || user.email }}</span>
        </div>

        <app-button variant="ghost" size="sm" (click)="authService.logout()">
          <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
