import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload, X, File as FileIcon } from 'lucide-angular';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="w-full">
      <span class="mb-1 block text-sm font-medium text-gray-700">Arquivo anexo (opcional)</span>

      @if (selectedFile) {
        <div class="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <lucide-icon [img]="FileIconImg" [size]="20" class="text-gray-400"></lucide-icon>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
          </div>
          <button
            type="button"
            (click)="onRemove()"
            class="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
          >
            <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
          </button>
        </div>
      } @else {
        <button
          type="button"
          class="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-brand-400 hover:bg-brand-50/50"
          (click)="fileInput.click()"
        >
          <lucide-icon [img]="UploadIcon" [size]="32" class="mb-2 text-gray-400"></lucide-icon>
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly UploadIcon = Upload;
  readonly XIcon = X;
  readonly FileIconImg = FileIcon;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileSelect.emit(file);
  }

  onRemove(): void {
    this.fileSelect.emit(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
