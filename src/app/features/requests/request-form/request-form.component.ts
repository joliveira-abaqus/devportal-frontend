import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../shared/ui/select/select.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { HeaderComponent } from '../../../layout/header/header.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { RequestService } from '../../../core/services/request.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <div class="mx-auto max-w-2xl">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Nova Solicitação</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
              </p>
            </div>

            <app-card>
              <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                  [error]="getError('title')"
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
                  @if (getError('description')) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ getError('description') }}
                    </p>
                  }
                </div>

                <app-select
                  selectId="type"
                  label="Tipo"
                  formControlName="type"
                  [options]="typeOptions"
                  [error]="getError('type')"
                />

                <div class="flex justify-end gap-3">
                  <app-button variant="outline" (click)="goBack()">Cancelar</app-button>
                  <app-button type="submit" [isLoading]="isSubmitting"
                    >Criar Solicitação</app-button
                  >
                </div>
              </form>
            </app-card>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class RequestFormComponent {
  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);
  private router = inject(Router);

  requestForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  typeOptions = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor() {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['feature', [Validators.required]],
    });
  }

  getError(field: string): string {
    const control = this.requestForm.get(field);
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
      const min = control.errors['minlength'].requiredLength;
      if (field === 'title') return 'Título deve ter pelo menos 3 caracteres';
      if (field === 'description') return 'Descrição deve ter pelo menos 10 caracteres';
      return `Deve ter pelo menos ${min} caracteres`;
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    this.requestService.createRequest(this.requestForm.value).subscribe({
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
