import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { RequestsService } from '../../../../core/services/requests.service';
import { RequestType } from '../../../../core/models';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent],
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
        <app-button type="button" variant="outline" (click)="cancel()">
          Cancelar
        </app-button>
        <app-button type="submit" [isLoading]="isSubmitting">
          Criar Solicitação
        </app-button>
      </div>
    </form>
  `,
})
export class RequestFormComponent {
  form: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  typeOptions = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private router: Router,
    private location: Location,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['feature', [Validators.required]],
    });
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.touched || !control?.errors) return '';

    if (field === 'title' && control.errors['minlength']) {
      return 'Título deve ter pelo menos 3 caracteres';
    }
    if (field === 'description' && control.errors['minlength']) {
      return 'Descrição deve ter pelo menos 10 caracteres';
    }
    if (control.errors['required']) {
      return 'Campo obrigatório';
    }
    return '';
  }

  cancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const { title, description, type } = this.form.value;
    this.requestsService
      .create({ title, description, type: type as RequestType })
      .subscribe({
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
