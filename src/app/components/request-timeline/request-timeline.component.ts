import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideCheckCircle,
  LucideClock,
  LucideGitPullRequest,
  LucideMessageSquare,
  LucidePaperclip,
  LucideRefreshCw,
} from '@lucide/angular';
import { RequestEvent } from '@app/types';
import { formatDate } from '@app/lib/utils';

@Component({
  selector: 'app-request-timeline',
  standalone: true,
  imports: [
    CommonModule,
    LucideCheckCircle,
    LucideClock,
    LucideGitPullRequest,
    LucideMessageSquare,
    LucidePaperclip,
    LucideRefreshCw,
  ],
  template: `
    @if (!events || events.length === 0) {
      <div class="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
        <svg lucideClock [size]="16"></svg>
        <span>Nenhum evento registrado ainda.</span>
      </div>
    } @else {
      <div class="flow-root">
        <ul class="-mb-8">
          @for (event of events; track event.id; let last = $last) {
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
                      @switch (event.type) {
                        @case ('status_change') { <svg lucideRefreshCw [size]="16"></svg> }
                        @case ('comment') { <svg lucideMessageSquare [size]="16"></svg> }
                        @case ('pr_linked') { <svg lucideGitPullRequest [size]="16"></svg> }
                        @case ('file_attached') { <svg lucidePaperclip [size]="16"></svg> }
                        @default { <svg lucideCheckCircle [size]="16"></svg> }
                      }
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
                          <svg lucideGitPullRequest [size]="12"></svg>
                          Ver Pull Request
                        </a>
                      }
                    </div>
                    <div class="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                      {{ getFormattedDate(event.createdAt) }}
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
  @Input({ required: true }) events!: RequestEvent[];

  private readonly eventColors: Record<string, string> = {
    status_change: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    comment: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pr_linked: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    file_attached: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  };

  getEventColor(type: string): string {
    return this.eventColors[type] || 'bg-gray-100 text-gray-600';
  }

  getFormattedDate(date: string): string {
    return formatDate(date);
  }
}
