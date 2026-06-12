import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut, User } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <header
      class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">DevPortal</h1>
      </div>

      <div class="flex items-center gap-4">
        <div
          *ngIf="authService.currentUser$ | async as user"
          class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <lucide-icon [img]="UserIcon" [size]="16"></lucide-icon>
          <span>{{ user.name || user.email }}</span>
        </div>

        <app-button variant="ghost" size="sm" (click)="authService.logout()">
          <lucide-icon [img]="LogOutIcon" [size]="16" class="mr-2"></lucide-icon>
          Sair
        </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly UserIcon = User;
  readonly LogOutIcon = LogOut;

  constructor(public authService: AuthService) {}
}
