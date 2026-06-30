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
import { LucideFileText } from '@lucide/angular';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { InputComponent } from '../../shared/components/ui/input.component';
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
    LucideFileText,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <svg lucideFileText class="mx-auto h-12 w-12 text-brand-600"></svg>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">Criar Conta</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Registre-se no DevPortal</p>
        </div>

        <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div *ngIf="error" class="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            </div>

            <app-input
              inputId="name"
              label="Nome"
              placeholder="Seu nome"
              [error]="getError('name')"
              [formControl]="$any(form.controls['name'])"
            ></app-input>

            <app-input
              inputId="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              autocomplete="email"
              [error]="getError('email')"
              [formControl]="$any(form.controls['email'])"
            ></app-input>

            <app-input
              inputId="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              [error]="getError('password')"
              [formControl]="$any(form.controls['password'])"
            ></app-input>

            <app-input
              inputId="confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="••••••••"
              autocomplete="new-password"
              [error]="getError('confirmPassword')"
              [formControl]="$any(form.controls['confirmPassword'])"
            ></app-input>

            <app-button type="submit" className="w-full" [isLoading]="isLoading">
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
  form: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (field === 'name') {
      if (control.errors['required']) return 'Nome é obrigatório';
      if (control.errors['minlength']) return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (field === 'email') {
      if (control.errors['required']) return 'Email é obrigatório';
      if (control.errors['email']) return 'Email inválido';
    }
    if (field === 'password') {
      if (control.errors['required']) return 'Senha é obrigatória';
      if (control.errors['minlength']) return 'Senha deve ter pelo menos 8 caracteres';
    }
    if (field === 'confirmPassword') {
      if (control.errors['required']) return 'Confirmação de senha é obrigatória';
      if (control.errors['passwordMismatch']) return 'Senhas não coincidem';
    }
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    this.error = null;

    this.authService
      .register({
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' },
          });
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Erro ao criar conta. Tente novamente.';
        },
      });
  }
}
