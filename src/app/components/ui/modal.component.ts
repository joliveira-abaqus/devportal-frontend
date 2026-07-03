import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        (click)="onOverlayClick($event)"
        (keydown.escape)="closed.emit()"
      >
        <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
            <button
              (click)="closed.emit()"
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
export class ModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  readonly XIcon = X;

  private readonly handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.closed.emit();
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.addEventListener('keydown', this.handleEscape);
        document.body.style.overflow = 'hidden';
      } else {
        document.removeEventListener('keydown', this.handleEscape);
        document.body.style.overflow = 'unset';
      }
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = 'unset';
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
