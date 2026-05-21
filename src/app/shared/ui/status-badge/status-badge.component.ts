import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { RequestStatus, requestStatusLabels } from '../../models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <app-badge [variant]="statusVariants[status]">{{ requestStatusLabels[status] }}</app-badge>
  `,
})
export class StatusBadgeComponent {
  @Input() status: RequestStatus = 'pending';

  requestStatusLabels = requestStatusLabels;

  statusVariants: Record<RequestStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    in_progress: 'info',
    review: 'warning',
    done: 'success',
    failed: 'error',
  };
}
