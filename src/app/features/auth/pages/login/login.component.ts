import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule, ButtonComponent, InputComponent],
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
            <div *ngIf="error" class="rounded-md bg-red-50 p-3 dark:bg-red-900/30">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            </div>

            <app-input
              inputId="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              autocomplete="email"
              [error]="getError('email')"
              formControlName="email"
            ></app-input>

            <app-input
              inputId="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              autocomplete="current-password"
              [error]="getError('password')"
              formControlName="password"
            ></app-input>

            <app-button type="submit" className="w-full" [isLoading]="isLoading">Entrar</app-button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Não tem conta?
            <a routerLink="/register" class="font-medium text-brand-600 hover:text-brand-500">Registre-se</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly FileTextIcon = FileText;

  form: FormGroup;
  error: string | null = null;
  isLoading = false;

  private callbackUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    const rawCallback = this.route.snapshot.queryParamMap.get('callbackUrl') || '/dashboard';
    this.callbackUrl = rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/dashboard';
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return field === 'email' ? 'Email é obrigatório' : 'Senha é obrigatória';
    if (control.errors['email']) return 'Email inválido';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.callbackUrl);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Email ou senha inválidos';
      },
    });
  }
}
