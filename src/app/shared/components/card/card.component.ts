import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="cardClasses">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() className = '';

  get cardClasses(): string {
    return [
      'rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
      this.className,
    ].join(' ');
  }
}
