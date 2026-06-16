import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Download, ExternalLink } from 'lucide-angular';
import { CardComponent } from '../../shared/components/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { RequestTimelineComponent } from './request-timeline.component';
import { RequestService } from '../../core/services/request.service';
import { Request } from '../../core/models';
import { formatDate, requestTypeLabels } from '../../core/utils';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    CardComponent,
    StatusBadgeComponent,
    RequestTimelineComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl">
      <a
        routerLink="/dashboard"
        class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <lucide-icon [img]="arrowLeftIcon" class="h-4 w-4" />
        Voltar ao Dashboard
      </a>

      @if (isLoading) {
        <div class="space-y-4">
          <div class="h-48 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
          <div class="h-64 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
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

            @if (request.prUrl) {
              <div class="mt-4">
                <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Pull Request</h2>
                <a
                  [href]="request.prUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                >
                  <lucide-icon [img]="externalLinkIcon" class="h-3 w-3" />
                  {{ request.prUrl }}
                </a>
              </div>
            }

            @if (request.attachmentUrl) {
              <div class="mt-4">
                <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Arquivo Anexo</h2>
                <a
                  [href]="request.attachmentUrl"
                  [download]="request.attachmentName"
                  class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                >
                  <lucide-icon [img]="downloadIcon" class="h-3 w-3" />
                  {{ request.attachmentName || 'Download' }}
                </a>
              </div>
            }
          </app-card>

          <app-card>
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline</h2>
            <app-request-timeline [events]="request.events" />
          </app-card>
        </div>
      }
    </div>
  `,
})
export class RequestDetailComponent implements OnInit {
  readonly arrowLeftIcon = ArrowLeft;
  readonly downloadIcon = Download;
  readonly externalLinkIcon = ExternalLink;
  readonly typeLabels = requestTypeLabels;

  request: Request | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

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

  getFormattedDate(date: string): string {
    return formatDate(date);
  }
}
