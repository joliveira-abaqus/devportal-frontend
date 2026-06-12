import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      (click)="onOverlayClick($event)"
    >
      <div [ngClass]="modalClasses">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
          <button
            (click)="close.emit()"
            class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() className = '';
  @Output() close = new EventEmitter<void>();

  private handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close.emit();
  };

  get modalClasses(): string {
    return ['w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800', this.className].join(' ');
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscape);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = 'unset';
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
