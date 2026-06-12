import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, Clock, GitPullRequest, MessageSquare, Paperclip, RefreshCw } from 'lucide-angular';
import { RequestEvent } from '../../../../shared/models/request.model';
import { formatDate } from '../../../../shared/utils/format.utils';

type LucideIconData = readonly (readonly [string, Record<string, string | number>])[];

@Component({
  selector: 'app-request-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="!events || events.length === 0" class="flex items-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
      <lucide-icon [img]="ClockIcon" [size]="16"></lucide-icon>
      <span>Nenhum evento registrado ainda.</span>
    </div>

    <div *ngIf="events && events.length > 0" class="flow-root">
      <ul class="-mb-8">
        <li *ngFor="let event of events; let idx = index; let last = last">
          <div class="relative pb-8">
            <span
              *ngIf="!last"
              class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
              aria-hidden="true"
            ></span>
            <div class="relative flex space-x-3">
              <div>
                <span [ngClass]="'flex h-8 w-8 items-center justify-center rounded-full ' + getEventColor(event.type)">
                  <lucide-icon [img]="getEventIcon(event.type)" [size]="16"></lucide-icon>
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
                    <lucide-icon [img]="GitPullRequestIcon" [size]="12"></lucide-icon>
                    Ver Pull Request
                  </a>
                </div>
                <div class="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                  {{ getFormattedDate(event.createdAt) }}
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
  @Input() events: RequestEvent[] = [];

  readonly ClockIcon = Clock;
  readonly GitPullRequestIcon = GitPullRequest;

  private readonly eventIcons: Record<string, LucideIconData> = {
    status_change: RefreshCw,
    comment: MessageSquare,
    pr_linked: GitPullRequest,
    file_attached: Paperclip,
  };

  private readonly eventColors: Record<string, string> = {
    status_change: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    comment: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pr_linked: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    file_attached: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  };

  getEventIcon(type: string): LucideIconData {
    return this.eventIcons[type] || CheckCircle;
  }

  getEventColor(type: string): string {
    return this.eventColors[type] || 'bg-gray-100 text-gray-600';
  }

  getFormattedDate(date: string): string {
    return formatDate(date);
  }
}
