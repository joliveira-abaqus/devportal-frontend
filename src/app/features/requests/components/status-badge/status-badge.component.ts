import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { RequestStatus } from '../../../../shared/models/request.model';
import { requestStatusLabels } from '../../../../shared/utils/format.utils';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  template: `<app-badge [variant]="statusVariants[status]">{{ requestStatusLabels[status] }}</app-badge>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: RequestStatus;

  readonly requestStatusLabels = requestStatusLabels;

  readonly statusVariants: Record<RequestStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    in_progress: 'info',
    review: 'warning',
    done: 'success',
    failed: 'error',
  };
}
