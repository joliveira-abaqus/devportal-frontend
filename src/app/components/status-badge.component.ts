import { Component, Input } from '@angular/core';
import { BadgeComponent } from './ui/badge.component';
import { RequestStatus } from '../models';
import { requestStatusLabels } from '../services/utils';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <app-badge [variant]="statusVariants[status]">{{ statusLabels[status] }}</app-badge>
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: RequestStatus;

  readonly statusLabels = requestStatusLabels;

  readonly statusVariants: Record<RequestStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    in_progress: 'info',
    review: 'warning',
    done: 'success',
    failed: 'error',
  };
}
