import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload, X, File as FileIcon } from 'lucide-angular';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="w-full">
      <label for="file-upload-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Arquivo anexo (opcional)
      </label>

      @if (selectedFile) {
        <div
          class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-700"
        >
          <lucide-icon [img]="fileIconRef" class="h-5 w-5 text-gray-400" />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ (selectedFile.size / 1024).toFixed(1) }} KB
            </p>
          </div>
          <button
            type="button"
            (click)="removeFile()"
            class="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500 dark:hover:bg-gray-600"
          >
            <lucide-icon [img]="xIcon" class="h-4 w-4" />
          </button>
        </div>
      } @else {
        <button
          type="button"
          class="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-600 dark:hover:border-brand-500"
          (click)="fileInput.click()"
        >
          <lucide-icon [img]="uploadIcon" class="mb-2 h-8 w-8 text-gray-400" />
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
  @Output() fileSelect = new EventEmitter<File | null>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly uploadIcon = Upload;
  readonly xIcon = X;
  readonly fileIconRef = FileIcon;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.fileSelect.emit(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileSelect.emit(null);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
