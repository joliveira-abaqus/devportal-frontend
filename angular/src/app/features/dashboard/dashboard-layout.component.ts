import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {}
