import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideUpload, LucideX, LucideFile } from '@lucide/angular';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, LucideUpload, LucideX, LucideFile],
  template: `
    <div class="w-full">
      <span class="mb-1 block text-sm font-medium text-gray-700">Arquivo anexo (opcional)</span>

      @if (selectedFile) {
        <div class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <svg lucideFile [size]="20" class="text-gray-400"></svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">{{ getFileSize(selectedFile.size) }} KB</p>
          </div>
          <button
            type="button"
            (click)="removeFile()"
            class="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
            aria-label="Remover arquivo"
          >
            <svg lucideX [size]="16"></svg>
          </button>
        </div>
      } @else {
        <button
          type="button"
          class="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50"
          (click)="fileInput.click()"
        >
          <svg lucideUpload [size]="32" class="mb-2 text-gray-400"></svg>
          <p class="text-sm text-gray-600">
            <span class="font-medium text-brand-600">Clique para enviar</span> ou arraste um arquivo
          </p>
          <p class="mt-1 text-xs text-gray-500">PDF, PNG, JPG, ZIP até 10MB</p>
        </button>
      }

      <input
        #fileInput
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
  @Output() fileSelect = new EventEmitter<File | null>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  getFileSize(bytes: number): string {
    return (bytes / 1024).toFixed(1);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.fileSelect.emit(file);
  }

  removeFile(): void {
    this.fileSelect.emit(null);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
