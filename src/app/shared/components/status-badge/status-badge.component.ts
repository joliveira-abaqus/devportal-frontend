import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { RequestStatus } from '../../../models';
import { requestStatusLabels } from '../../utils';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="statusVariants[status]">
      {{ statusLabels[status] }}
    </app-badge>
  `,
})
export class StatusBadgeComponent {
  @Input() status: RequestStatus = 'pending';

  statusLabels = requestStatusLabels;

  readonly statusVariants: Record<RequestStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    in_progress: 'info',
    review: 'warning',
    done: 'success',
    failed: 'error',
  };
}
