import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideLogOut, LucideUser } from '@lucide/angular';
import { ButtonComponent } from '../ui/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideLogOut, LucideUser, ButtonComponent],
  template: `
    <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">DevPortal</h1>
      </div>

      <div class="flex items-center gap-4">
        <div *ngIf="authService.user()" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg lucideUser class="h-4 w-4"></svg>
          <span>{{ authService.user()?.name || authService.user()?.email }}</span>
        </div>

        <app-button variant="ghost" size="sm" (click)="authService.logout()">
          <svg lucideLogOut class="mr-2 h-4 w-4"></svg>
          Sair
        </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  constructor(public readonly authService: AuthService) {}
}
