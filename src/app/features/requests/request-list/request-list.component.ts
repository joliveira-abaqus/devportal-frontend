import { Component } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { HeaderComponent } from '../../../layout/header/header.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [DashboardComponent, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <app-dashboard />
        </main>
      </div>
    </div>
  `,
})
export class RequestListComponent {}
