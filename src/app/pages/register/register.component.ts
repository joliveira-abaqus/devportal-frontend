import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button.component';
import { InputComponent } from '../../components/ui/input.component';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, ButtonComponent, InputComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <lucide-icon [img]="FileTextIcon" [size]="48" class="mx-auto text-brand-600"></lucide-icon>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Criar Conta</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Registre-se no DevPortal</p>
        </div>

        <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            @if (error) {
              <div class="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
                <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
              </div>
            }

            <app-input
              inputId="name"
              label="Nome"
              placeholder="Seu nome"
              [error]="getError('name')"
              formControlName="name"
            />

            <app-input
              inputId="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              autocomplete="email"
              [error]="getError('email')"
              formControlName="email"
            />

            <app-input
              inputId="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              [error]="getError('password')"
              formControlName="password"
            />

            <app-input
              inputId="confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              [error]="getError('confirmPassword')"
              formControlName="confirmPassword"
            />

            <app-button type="submit" className="w-full" [isLoading]="isLoading">Criar Conta</app-button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem conta?
            <a routerLink="/login" class="font-medium text-brand-600 hover:text-brand-500">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly FileTextIcon = FileText;

  error: string | null = null;
  isLoading = false;

  readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    const errorMessages: Record<string, Record<string, string>> = {
      name: {
        required: 'Nome é obrigatório',
        minlength: 'Nome deve ter pelo menos 2 caracteres',
      },
      email: {
        required: 'Email é obrigatório',
        email: 'Email inválido',
      },
      password: {
        required: 'Senha é obrigatória',
        minlength: 'Senha deve ter pelo menos 8 caracteres',
      },
      confirmPassword: {
        required: 'Confirmação de senha é obrigatória',
        passwordMismatch: 'Senhas não coincidem',
      },
    };

    const fieldErrors = errorMessages[field];
    if (!fieldErrors) {
      return '';
    }

    for (const key of Object.keys(control.errors)) {
      if (fieldErrors[key]) {
        return fieldErrors[key];
      }
    }

    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { name, email, password } = this.form.getRawValue();

    this.authService.register(name!, email!, password!).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        } else {
          this.error = 'Erro ao criar conta. Tente novamente.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Erro ao criar conta. Tente novamente.';
      },
    });
  }
}
