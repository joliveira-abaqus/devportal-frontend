import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge/status-badge.component';
import { RequestTimelineComponent } from '../request-timeline/request-timeline.component';
import { HeaderComponent } from '../../../layout/header/header.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { RequestService } from '../../../core/services/request.service';
import { Request, requestTypeLabels } from '../../../shared/models';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    StatusBadgeComponent,
    RequestTimelineComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <div class="mx-auto max-w-3xl">
            <a
              routerLink="/dashboard"
              class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Voltar ao Dashboard
            </a>

            @if (isLoading) {
              <div class="space-y-4">
                <div
                  class="h-48 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"
                ></div>
                <div
                  class="h-64 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"
                ></div>
              </div>
            } @else if (error) {
              <div class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
                <p class="text-red-700 dark:text-red-400">{{ error }}</p>
              </div>
            } @else if (request) {
              <div class="space-y-6">
                <app-card>
                  <div class="flex items-start justify-between">
                    <div>
                      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {{ request.title }}
                      </h1>
                      <div class="mt-2 flex items-center gap-3">
                        <app-status-badge [status]="request.status" />
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {{ typeLabels[request.type] }}
                        </span>
                        <span class="text-sm text-gray-400 dark:text-gray-500">
                          Criado em {{ formatDate(request.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4">
                    <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</h2>
                    <p class="mt-1 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
                      {{ request.description }}
                    </p>
                  </div>

                  @if (request.prUrl) {
                    <div class="mt-4">
                      <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pull Request
                      </h2>
                      <a
                        [href]="request.prUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                      >
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        {{ request.prUrl }}
                      </a>
                    </div>
                  }

                  @if (request.attachmentUrl) {
                    <div class="mt-4">
                      <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Arquivo Anexo
                      </h2>
                      <a
                        [href]="request.attachmentUrl"
                        [download]="request.attachmentName"
                        class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                      >
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        {{ request.attachmentName || 'Download' }}
                      </a>
                    </div>
                  }
                </app-card>

                <app-card>
                  <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Timeline
                  </h2>
                  <app-request-timeline [events]="request.events" />
                </app-card>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `,
})
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private requestService = inject(RequestService);

  request: Request | null = null;
  isLoading = true;
  error: string | null = null;
  typeLabels = requestTypeLabels;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID da solicitação não encontrado';
      this.isLoading = false;
      return;
    }

    this.requestService.getRequest(id).subscribe({
      next: (request) => {
        this.request = request;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar solicitação';
        this.isLoading = false;
      },
    });
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  }
}
