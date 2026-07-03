import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button.component';
import { InputComponent } from '../../components/ui/input.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, ButtonComponent, InputComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <lucide-icon [img]="FileTextIcon" [size]="48" class="mx-auto text-brand-600"></lucide-icon>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">DevPortal</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Faça login para acessar o portal</p>
        </div>

        <div class="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            @if (error) {
              <div class="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
                <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
              </div>
            }

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
              autocomplete="current-password"
              [error]="getError('password')"
              formControlName="password"
            />

            <app-button type="submit" className="w-full" [isLoading]="isLoading">Entrar</app-button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Não tem conta?
            <a routerLink="/register" class="font-medium text-brand-600 hover:text-brand-500">
              Registre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly FileTextIcon = FileText;

  error: string | null = null;
  isLoading = false;
  private callbackUrl = '/dashboard';

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const rawCallback = this.route.snapshot.queryParamMap.get('callbackUrl') ?? '/dashboard';
    this.callbackUrl =
      rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/dashboard';
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (field === 'email') {
      if (control.errors['required']) return 'Email é obrigatório';
      if (control.errors['email']) return 'Email inválido';
    }
    if (field === 'password') {
      if (control.errors['required']) return 'Senha é obrigatória';
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

    const { email, password } = this.form.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigateByUrl(this.callbackUrl);
        } else {
          this.error = 'Email ou senha inválidos';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Erro ao fazer login. Tente novamente.';
      },
    });
  }
}
