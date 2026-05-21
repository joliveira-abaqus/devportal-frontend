import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestEvent } from '../../../shared/models';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-request-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!events || events.length === 0) {
      <div class="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Nenhum evento registrado ainda.</span>
      </div>
    } @else {
      <div class="flow-root">
        <ul class="-mb-8">
          @for (event of events; track event.id; let idx = $index; let last = $last) {
            <li>
              <div class="relative pb-8">
                @if (!last) {
                  <span
                    class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  ></span>
                }
                <div class="relative flex space-x-3">
                  <div>
                    <span [class]="'flex h-8 w-8 items-center justify-center rounded-full ' + getEventColor(event.type)">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        [innerHTML]="getEventIconPath(event.type)"></svg>
                    </span>
                  </div>
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p class="text-sm text-gray-700 dark:text-gray-300">{{ event.description }}</p>
                      @if (event.metadata?.['prUrl']) {
                        <a
                          [href]="event.metadata?.['prUrl']"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                        >
                          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Ver Pull Request
                        </a>
                      }
                    </div>
                    <div class="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(event.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    }
  `,
})
export class RequestTimelineComponent {
  @Input() events: RequestEvent[] = [];

  private eventColors: Record<string, string> = {
    status_change: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    comment: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pr_linked: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    file_attached: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  };

  getEventColor(type: string): string {
    return this.eventColors[type] || 'bg-gray-100 text-gray-600';
  }

  getEventIconPath(type: string): string {
    const paths: Record<string, string> = {
      status_change:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />',
      comment:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />',
      pr_linked:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />',
      file_attached:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />',
    };
    return (
      paths[type] ||
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
    );
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  }
}
