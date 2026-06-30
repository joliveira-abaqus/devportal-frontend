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
import { RequestEvent } from '../../../core/models';
import { formatDate } from '../../../core/utils';

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
    <div *ngIf="!events || events.length === 0" class="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
      <svg lucideClock class="h-4 w-4"></svg>
      <span>Nenhum evento registrado ainda.</span>
    </div>

    <div *ngIf="events && events.length > 0" class="flow-root">
      <ul class="-mb-8">
        <li *ngFor="let event of events; let last = last">
          <div class="relative pb-8">
            <span
              *ngIf="!last"
              class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
              aria-hidden="true"
            ></span>
            <div class="relative flex space-x-3">
              <div>
                <span [class]="'flex h-8 w-8 items-center justify-center rounded-full ' + getEventColor(event.type)">
                  <ng-container [ngSwitch]="event.type">
                    <svg *ngSwitchCase="'status_change'" lucideRefreshCw class="h-4 w-4"></svg>
                    <svg *ngSwitchCase="'comment'" lucideMessageSquare class="h-4 w-4"></svg>
                    <svg *ngSwitchCase="'pr_linked'" lucideGitPullRequest class="h-4 w-4"></svg>
                    <svg *ngSwitchCase="'file_attached'" lucidePaperclip class="h-4 w-4"></svg>
                    <svg *ngSwitchDefault lucideCheckCircle class="h-4 w-4"></svg>
                  </ng-container>
                </span>
              </div>
              <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ event.description }}</p>
                  <a
                    *ngIf="event.metadata?.['prUrl']"
                    [href]="event.metadata?.['prUrl']"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                  >
                    <svg lucideGitPullRequest class="h-3 w-3"></svg>
                    Ver Pull Request
                  </a>
                </div>
                <div class="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateFn(event.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
})
export class RequestTimelineComponent {
  @Input({ required: true }) events!: RequestEvent[];

  readonly formatDateFn = formatDate;

  private readonly eventColors: Record<string, string> = {
    status_change: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    comment: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pr_linked: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    file_attached: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  };

  getEventColor(type: string): string {
    return this.eventColors[type] || 'bg-gray-100 text-gray-600';
  }
}
