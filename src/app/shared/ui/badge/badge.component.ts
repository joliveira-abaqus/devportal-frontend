import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="computedClasses">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default';

  private readonly variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  };

  get computedClasses(): string {
    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${this.variantClasses[this.variant]}`;
  }
}
