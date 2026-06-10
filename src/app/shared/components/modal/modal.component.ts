import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      #overlay
      role="dialog"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      (click)="onOverlayClick($event)"
      (keydown.escape)="close()"
    >
      <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
          <button
            (click)="close()"
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
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('overlay') overlay!: ElementRef;

  private escapeListener: ((e: KeyboardEvent) => void) | null = null;

  ngOnInit(): void {
    this.escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
    }
    document.body.style.overflow = 'unset';
  }

  close(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === this.overlay?.nativeElement) {
      this.close();
    }
  }
}
