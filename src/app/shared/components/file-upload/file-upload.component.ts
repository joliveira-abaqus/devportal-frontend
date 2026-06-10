import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <label for="file-upload-input" class="mb-1 block text-sm font-medium text-gray-700">
        Arquivo anexo (opcional)
      </label>

      <div *ngIf="selectedFile; else uploadArea" class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-700">{{ selectedFile.name }}</p>
          <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
        </div>
        <button
          type="button"
          (click)="handleRemove()"
          class="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ng-template #uploadArea>
        <div
          role="button"
          tabindex="0"
          class="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50"
          (click)="fileInput.click()"
          (keydown.enter)="fileInput.click()"
          (keydown.space)="fileInput.click()"
        >
          <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p class="text-sm text-gray-600">
            <span class="font-medium text-brand-600">Clique para enviar</span> ou arraste um arquivo
          </p>
          <p class="mt-1 text-xs text-gray-500">PDF, PNG, JPG, ZIP até 10MB</p>
        </div>
      </ng-template>

      <input
        #fileInput
        id="file-upload-input"
        type="file"
        class="hidden"
        (change)="handleFileChange($event)"
        accept=".pdf,.png,.jpg,.jpeg,.zip,.gz,.tar"
      />
    </div>
  `,
})
export class FileUploadComponent {
  @Input() selectedFile: File | null = null;
  @Output() fileSelected = new EventEmitter<File | null>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.fileSelected.emit(file);
  }

  handleRemove(): void {
    this.fileSelected.emit(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
