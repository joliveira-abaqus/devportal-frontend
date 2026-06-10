import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      [ngClass]="className"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() className = '';
}
