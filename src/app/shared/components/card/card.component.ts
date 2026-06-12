import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      [class]="extraClass"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() extraClass = '';
}
