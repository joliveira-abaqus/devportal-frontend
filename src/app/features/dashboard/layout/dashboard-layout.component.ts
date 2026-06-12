import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../layout/components/sidebar.component';
import { HeaderComponent } from '../../../layout/components/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar></app-sidebar>
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {}
