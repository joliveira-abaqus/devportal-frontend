import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { cn } from '../../services/utils';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isOpen) {
      <div
        role="dialog"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        (click)="onOverlayClick($event)"
        (keydown.escape)="closeModal.emit()"
      >
        <div [class]="modalClasses">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
            <button
              (click)="closeModal.emit()"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <lucide-icon [img]="XIcon" [size]="20"></lucide-icon>
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

  readonly XIcon = X;

  get modalClasses(): string {
    return cn(
      'w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800',
      this.className,
    );
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }
}
