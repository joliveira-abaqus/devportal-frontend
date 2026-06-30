import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../ui/button.component';
import { InputComponent } from '../ui/input.component';
import { SelectComponent, SelectOption } from '../ui/select.component';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <div *ngIf="submitError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
        <p class="text-sm text-red-700 dark:text-red-400">{{ submitError }}</p>
      </div>

      <app-input
        inputId="title"
        label="Título"
        placeholder="Descreva brevemente a solicitação"
        [error]="getError('title')"
        [formControl]="$any(form.controls['title'])"
      ></app-input>

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
        <p *ngIf="getError('description')" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ getError('description') }}
        </p>
      </div>

      <app-select
        selectId="type"
        label="Tipo"
        [options]="typeOptions"
        [error]="getError('type')"
        [formControl]="$any(form.controls['type'])"
      ></app-select>

      <div class="flex justify-end gap-3">
        <app-button variant="outline" (click)="goBack()">
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

  readonly typeOptions: SelectOption[] = [
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
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['minlength'] || control.errors['required']) {
      const minLengths: Record<string, number> = { title: 3, description: 10 };
      const min = minLengths[field];
      if (min) {
        const labels: Record<string, string> = {
          title: `Título deve ter pelo menos ${min} caracteres`,
          description: `Descrição deve ter pelo menos ${min} caracteres`,
        };
        return labels[field];
      }
      if (control.errors['required']) {
        return field === 'type' ? 'Tipo é obrigatório' : 'Campo obrigatório';
      }
    }

    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.submitError = null;

    this.requestsService
      .createRequest({
        title: this.form.value.title,
        description: this.form.value.description,
        type: this.form.value.type,
      })
      .subscribe({
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

  goBack(): void {
    window.history.back();
  }
}
