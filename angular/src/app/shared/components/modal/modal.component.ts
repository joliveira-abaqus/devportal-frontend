import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { cn } from '../../../core/utils';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        (click)="onOverlayClick($event)"
      >
        <div [class]="modalClasses">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
            <button
              (click)="close()"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <lucide-icon [img]="XIcon" class="h-5 w-5" />
            </button>
          </div>
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() className = '';
  @Output() closeEvent = new EventEmitter<void>();

  readonly XIcon = X;

  get modalClasses(): string {
    return cn(
      'w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800',
      this.className,
    );
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.closeEvent.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
