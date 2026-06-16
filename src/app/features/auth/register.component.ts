import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { AuthService } from '../../core/services/auth.service';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <lucide-icon [img]="fileTextIcon" class="mx-auto h-12 w-12 text-brand-600" />
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
              formControlName="name"
              [error]="getFieldError('name')"
            />

            <app-input
              inputId="email"
              type="email"
              label="Email"
              placeholder="seu&#64;email.com"
              autocomplete="email"
              formControlName="email"
              [error]="getFieldError('email')"
            />

            <app-input
              inputId="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              formControlName="password"
              [error]="getFieldError('password')"
            />

            <app-input
              inputId="confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              formControlName="confirmPassword"
              [error]="getFieldError('confirmPassword')"
            />

            <app-button type="submit" extraClass="w-full" [isLoading]="isLoading">
              Criar Conta
            </app-button>
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
  readonly fileTextIcon = FileText;

  form: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) {
      const labels: Record<string, string> = {
        name: 'Nome é obrigatório',
        email: 'Email é obrigatório',
        password: 'Senha é obrigatória',
        confirmPassword: 'Confirmação de senha é obrigatória',
      };
      return labels[field] || 'Campo obrigatório';
    }
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength as number;
      if (field === 'name') return `Nome deve ter pelo menos ${min} caracteres`;
      if (field === 'password') return `Senha deve ter pelo menos ${min} caracteres`;
    }
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['passwordMismatch']) return 'Senhas não coincidem';
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    this.error = null;

    const { name, email, password } = this.form.value;
    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: () => {
        this.error = 'Erro ao criar conta. Tente novamente.';
        this.isLoading = false;
      },
    });
  }
}
