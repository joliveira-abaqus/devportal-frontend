import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge/status-badge.component';
import { Request, requestTypeLabels } from '../../../shared/models';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent],
  template: `
    <a [routerLink]="'/requests/' + request.id">
      <app-card extraClass="transition-shadow hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ request.title }}</h3>
              <app-status-badge [status]="request.status" />
            </div>

            <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {{ request.description }}
            </p>

            <div class="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span
                class="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {{ typeLabels[request.type] }}
              </span>
              <span class="inline-flex items-center gap-1">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatRelativeDate(request.createdAt) }}
              </span>
            </div>
          </div>

          <svg class="ml-4 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </app-card>
    </a>
  `,
})
export class RequestCardComponent {
  @Input() request!: Request;

  typeLabels = requestTypeLabels;

  formatRelativeDate(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  }
}
