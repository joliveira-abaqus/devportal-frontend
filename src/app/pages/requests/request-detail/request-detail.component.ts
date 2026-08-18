import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Download, ExternalLink } from 'lucide-angular';
import { CardComponent } from '../../../components/ui/card.component';
import { StatusBadgeComponent } from '../../../components/shared/status-badge.component';
import { RequestTimelineComponent } from '../../../components/shared/request-timeline.component';
import { RequestsService } from '../../../services/requests.service';
import { Request } from '../../../models';
import { formatDate, requestTypeLabels } from '../../../utils';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
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
        <lucide-icon [img]="ArrowLeftIcon" [size]="16"></lucide-icon>
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
                <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ request.title }}</h1>
                <div class="mt-2 flex items-center gap-3">
                  <app-status-badge [status]="request.status" />
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ requestTypeLabels[request.type] }}
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
                <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Pull Request</h2>
                <a
                  [href]="request.prUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                >
                  <lucide-icon [img]="ExternalLinkIcon" [size]="12"></lucide-icon>
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
                  <lucide-icon [img]="DownloadIcon" [size]="12"></lucide-icon>
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
  request: Request | null = null;
  isLoading = true;
  error: string | null = null;

  readonly ArrowLeftIcon = ArrowLeft;
  readonly DownloadIcon = Download;
  readonly ExternalLinkIcon = ExternalLink;
  readonly requestTypeLabels = requestTypeLabels;
  readonly formatDate = formatDate;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
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
