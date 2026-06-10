import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { RequestsService } from '../../core/services/requests.service';

@Component({
  selector: 'app-request-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent, SelectComponent],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Nova Solicitação</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
        </p>
      </div>

      <app-card>
        <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="submitError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <p class="text-sm text-red-700 dark:text-red-400">{{ submitError }}</p>
          </div>

          <app-input
            inputId="title"
            label="Título"
            placeholder="Descreva brevemente a solicitação"
            formControlName="title"
            [error]="getError('title')"
          ></app-input>

          <div class="w-full">
            <label for="description" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              rows="5"
              placeholder="Descreva em detalhes o que precisa ser feito"
              formControlName="description"
              class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            ></textarea>
            <p *ngIf="getError('description')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getError('description') }}
            </p>
          </div>

          <div class="w-full">
            <label for="type" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo
            </label>
            <select
              id="type"
              formControlName="type"
              class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="feature">Feature</option>
              <option value="bug_fix">Bug Fix</option>
              <option value="migration">Migration</option>
            </select>
            <p *ngIf="getError('type')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getError('type') }}
            </p>
          </div>

          <div class="flex justify-end gap-3">
            <app-button type="button" variant="outline" (click)="goBack()">
              Cancelar
            </app-button>
            <app-button type="submit" [isLoading]="isSubmitting">
              Criar Solicitação
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class RequestNewComponent {
  requestForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private router: Router,
  ) {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['feature', [Validators.required]],
    });
  }

  getError(field: string): string {
    const control = this.requestForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        const labels: Record<string, string> = {
          title: 'Título é obrigatório',
          description: 'Descrição é obrigatória',
          type: 'Tipo é obrigatório',
        };
        return labels[field] || 'Campo obrigatório';
      }
      if (control.errors['minlength']) {
        const min = control.errors['minlength'].requiredLength;
        const labels: Record<string, string> = {
          title: `Título deve ter pelo menos ${min} caracteres`,
          description: `Descrição deve ter pelo menos ${min} caracteres`,
        };
        return labels[field] || `Deve ter pelo menos ${min} caracteres`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const { title, description, type } = this.requestForm.value;

    this.requestsService.createRequest({ title, description, type }).subscribe({
      next: (created) => {
        this.router.navigate(['/requests', created.id]);
      },
      error: () => {
        this.submitError = 'Erro ao criar solicitação. Tente novamente.';
        this.isSubmitting = false;
      },
    });
  }

  goBack(): void {
    window.history.back();
  }
}
