import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideX } from '@lucide/angular';
import { cn } from '@app/lib/utils';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideX],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        (keydown.escape)="closeModal.emit()"
      >
        <div [class]="modalClasses">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
            <button
              type="button"
              (click)="closeModal.emit()"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Fechar"
            >
              <svg lucideX class="h-5 w-5" [size]="20"></svg>
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
  @Output() closeModal = new EventEmitter<void>();

  get modalClasses(): string {
    return cn(
      'w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800',
      this.className,
    );
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.closeModal.emit();
    }
  }
}
