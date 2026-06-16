import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select.component';
import { FileUploadComponent } from '../../shared/components/file-upload.component';
import { RequestService } from '../../core/services/request.service';
import { RequestType } from '../../core/models';

@Component({
  selector: 'app-request-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    FileUploadComponent,
  ],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Nova Solicitação</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
        </p>
      </div>

      <app-card>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          @if (submitError) {
            <div class="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <p class="text-sm text-red-700 dark:text-red-400">{{ submitError }}</p>
            </div>
          }

          <app-input
            inputId="title"
            label="Título"
            placeholder="Descreva brevemente a solicitação"
            formControlName="title"
            [error]="getFieldError('title')"
          />

          <div class="w-full">
            <label
              for="description"
              class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descrição
            </label>
            <textarea
              id="description"
              rows="5"
              placeholder="Descreva em detalhes o que precisa ser feito"
              formControlName="description"
              class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            ></textarea>
            @if (getFieldError('description')) {
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ getFieldError('description') }}
              </p>
            }
          </div>

          <app-select
            selectId="type"
            label="Tipo"
            [options]="typeOptions"
            formControlName="type"
            [error]="getFieldError('type')"
          />

          <app-file-upload [selectedFile]="selectedFile" (fileSelect)="onFileSelect($event)" />

          <div class="flex justify-end gap-3">
            <app-button type="button" variant="outline" (click)="goBack()"> Cancelar </app-button>
            <app-button type="submit" [isLoading]="isSubmitting"> Criar Solicitação </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class RequestNewComponent {
  form: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  selectedFile: File | null = null;

  readonly typeOptions: SelectOption[] = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['feature', [Validators.required]],
    });
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength as number;
      if (field === 'title') return `Título deve ter pelo menos ${min} caracteres`;
      if (field === 'description') return `Descrição deve ter pelo menos ${min} caracteres`;
    }
    return '';
  }

  onFileSelect(file: File | null): void {
    this.selectedFile = file;
  }

  goBack(): void {
    window.history.back();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.submitError = null;

    const payload = {
      title: this.form.value.title as string,
      description: this.form.value.description as string,
      type: this.form.value.type as RequestType,
      file: this.selectedFile ?? undefined,
    };

    this.requestService.createRequest(payload).subscribe({
      next: (created) => {
        this.router.navigate(['/requests', created.id]);
      },
      error: () => {
        this.submitError = 'Erro ao criar solicitação. Tente novamente.';
        this.isSubmitting = false;
      },
    });
  }
}
