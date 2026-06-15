import { Component, Input } from '@angular/core';
import { cn } from '../../../core/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="cardClasses">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() className = '';

  get cardClasses(): string {
    return cn(
      'rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
      this.className,
    );
  }
}
