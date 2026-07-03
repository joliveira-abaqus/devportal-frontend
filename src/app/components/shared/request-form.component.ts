import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../ui/button.component';
import { InputComponent } from '../ui/input.component';
import { SelectComponent } from '../ui/select.component';
import { RequestsService } from '../../services/requests.service';

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
          formControlName="description"
          rows="5"
          placeholder="Descreva em detalhes o que precisa ser feito"
          class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
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
        <app-button type="button" variant="outline" (click)="onCancel()">Cancelar</app-button>
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
      return labels[field] ?? 'Campo obrigatório';
    }

    if (control.errors['minlength']) {
      const minLen = control.errors['minlength'].requiredLength as number;
      const labels: Record<string, string> = {
        title: `Título deve ter pelo menos ${minLen} caracteres`,
        description: `Descrição deve ter pelo menos ${minLen} caracteres`,
      };
      return labels[field] ?? `Mínimo de ${minLen} caracteres`;
    }

    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.submitError = null;

    this.requestsService.createRequest(this.form.value).subscribe({
      next: (created) => {
        this.router.navigate(['/requests', created.id]);
      },
      error: () => {
        this.submitError = 'Erro ao criar solicitação. Tente novamente.';
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    window.history.back();
  }
}
