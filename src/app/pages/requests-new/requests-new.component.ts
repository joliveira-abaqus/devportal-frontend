import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar.component';
import { HeaderComponent } from '../../components/header.component';
import { CardComponent } from '../../components/ui/card.component';
import { RequestFormComponent } from '../../components/request-form.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-requests-new',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CardComponent, RequestFormComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <div class="mx-auto max-w-2xl">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Nova Solicitação</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
              </p>
            </div>

            <app-card>
              <app-request-form />
            </app-card>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class RequestsNewComponent {
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.themeService.init();
  }
}
