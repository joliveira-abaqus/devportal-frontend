import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <label for="file-upload-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Arquivo anexo (opcional)
      </label>

      @if (selectedFile) {
        <div class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ (selectedFile.size / 1024).toFixed(1) }} KB
            </p>
          </div>
          <button
            type="button"
            (click)="removeFile()"
            class="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      } @else {
        <button
          type="button"
          class="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-600 dark:hover:border-brand-500"
          (click)="fileInput.click()"
        >
          <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-brand-600">Clique para enviar</span> ou arraste um arquivo
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG, ZIP até 10MB</p>
        </button>
      }

      <input
        #fileInput
        id="file-upload-input"
        type="file"
        class="hidden"
        (change)="onFileChange($event)"
        accept=".pdf,.png,.jpg,.jpeg,.zip,.gz,.tar"
      />
    </div>
  `,
})
export class FileUploadComponent {
  @Input() selectedFile: File | null = null;
  @Output() fileSelected = new EventEmitter<File | null>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileSelected.emit(null);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
