import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '@app/components/ui/button/button.component';
import { InputComponent } from '@app/components/ui/input/input.component';
import { SelectComponent } from '@app/components/ui/select/select.component';
import { RequestsService } from '@app/core/services/requests.service';
import { RequestType } from '@app/types';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent],
  template: `
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
        [error]="getError('title')"
        formControlName="title"
      />

      <div class="w-full">
        <label for="description" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descrição
        </label>
        <textarea
          id="description"
          rows="5"
          placeholder="Descreva em detalhes o que precisa ser feito"
          class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          formControlName="description"
        ></textarea>
        @if (getError('description')) {
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ getError('description') }}</p>
        }
      </div>

      <app-select
        selectId="type"
        label="Tipo"
        [options]="typeOptions"
        [error]="getError('type')"
        formControlName="type"
      />

      <div class="flex justify-end gap-3">
        <app-button variant="outline" (click)="goBack()">Cancelar</app-button>
        <app-button type="submit" [isLoading]="isSubmitting">Criar Solicitação</app-button>
      </div>
    </form>
  `,
})
export class RequestFormComponent {
  form: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  readonly typeOptions = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly requestsService: RequestsService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['feature', [Validators.required]],
    });
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return '';

    if (control.errors['required']) {
      const labels: Record<string, string> = {
        title: 'Título é obrigatório',
        description: 'Descrição é obrigatória',
        type: 'Tipo é obrigatório',
      };
      return labels[field] || 'Campo obrigatório';
    }
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength as number;
      const labels: Record<string, string> = {
        title: `Título deve ter pelo menos ${min} caracteres`,
        description: `Descrição deve ter pelo menos ${min} caracteres`,
      };
      return labels[field] || `Deve ter pelo menos ${min} caracteres`;
    }
    return '';
  }

  goBack(): void {
    window.history.back();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.submitError = null;

    const { title, description, type } = this.form.value as {
      title: string;
      description: string;
      type: RequestType;
    };

    this.requestsService.createRequest({ title, description, type }).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.router.navigate(['/requests', created.id]);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Erro ao criar solicitação. Tente novamente.';
      },
    });
  }
}
