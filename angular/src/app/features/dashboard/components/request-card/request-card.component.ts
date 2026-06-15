import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Calendar, ArrowRight } from 'lucide-angular';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Request } from '../../../../core/models';
import { formatRelativeDate, requestTypeLabels } from '../../../../core/utils';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, CardComponent, StatusBadgeComponent],
  template: `
    <a [routerLink]="['/requests', request.id]">
      <app-card className="transition-shadow hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ request.title }}</h3>
              <app-status-badge [status]="request.status" />
            </div>

            <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{{ request.description }}</p>

            <div class="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span class="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {{ requestTypeLabels[request.type] }}
              </span>
              <span class="inline-flex items-center gap-1">
                <lucide-icon [img]="CalendarIcon" class="h-3 w-3" />
                {{ formatRelativeDate(request.createdAt) }}
              </span>
            </div>
          </div>

          <lucide-icon [img]="ArrowRightIcon" class="ml-4 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
        </div>
      </app-card>
    </a>
  `,
})
export class RequestCardComponent {
  @Input() request!: Request;

  readonly CalendarIcon = Calendar;
  readonly ArrowRightIcon = ArrowRight;
  readonly requestTypeLabels = requestTypeLabels;
  readonly formatRelativeDate = formatRelativeDate;
}
