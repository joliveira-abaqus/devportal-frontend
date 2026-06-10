import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { RequestTimelineComponent } from './timeline/request-timeline.component';
import { RequestsService } from '../../core/services/requests.service';
import { Request } from '../../models';
import { formatDate, requestTypeLabels } from '../../shared/utils';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent, RequestTimelineComponent],
  template: `
    <div class="mx-auto max-w-3xl">
      <a
        routerLink="/dashboard"
        class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar ao Dashboard
      </a>

      <div *ngIf="isLoading" class="space-y-4">
        <div class="h-48 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
        <div class="h-64 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
      </div>

      <div *ngIf="!isLoading && error" class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
        <p class="text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <div *ngIf="!isLoading && !error && request" class="space-y-6">
        <app-card>
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ request.title }}</h1>
              <div class="mt-2 flex items-center gap-3">
                <app-status-badge [status]="request.status"></app-status-badge>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ typeLabels[request.type] }}
                </span>
                <span class="text-sm text-gray-400 dark:text-gray-500">
                  Criado em {{ getFormattedDate(request.createdAt) }}
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

          <div *ngIf="request.prUrl" class="mt-4">
            <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Pull Request</h2>
            <a
              [href]="request.prUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ request.prUrl }}
            </a>
          </div>

          <div *ngIf="request.attachmentUrl" class="mt-4">
            <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Arquivo Anexo</h2>
            <a
              [href]="request.attachmentUrl"
              [download]="request.attachmentName"
              class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ request.attachmentName || 'Download' }}
            </a>
          </div>
        </app-card>

        <app-card>
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline</h2>
          <app-request-timeline [events]="request.events"></app-request-timeline>
        </app-card>
      </div>
    </div>
  `,
})
export class RequestDetailComponent implements OnInit {
  request: Request | null = null;
  isLoading = true;
  error: string | null = null;
  typeLabels = requestTypeLabels;

  constructor(
    private route: ActivatedRoute,
    private requestsService: RequestsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestsService.getRequest(id).subscribe({
        next: (data) => {
          this.request = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar solicitação';
          this.isLoading = false;
        },
      });
    }
  }

  getFormattedDate(date: string): string {
    return formatDate(date);
  }
}
