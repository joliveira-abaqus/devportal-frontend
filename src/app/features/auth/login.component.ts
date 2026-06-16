import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">DevPortal</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar o portal
          </p>
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
              autocomplete="current-password"
              formControlName="password"
              [error]="getFieldError('password')"
            />

            <app-button type="submit" extraClass="w-full" [isLoading]="isLoading">
              Entrar
            </app-button>
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
export class LoginComponent {
  readonly fileTextIcon = FileText;

  form: FormGroup;
  error: string | null = null;
  isLoading = false;

  private callbackUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      const raw = params['callbackUrl'] || '/dashboard';
      this.callbackUrl = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
    });
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) {
      return field === 'email' ? 'Email é obrigatório' : 'Senha é obrigatória';
    }
    if (control.errors['email']) return 'Email inválido';
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigateByUrl(this.callbackUrl);
      },
      error: () => {
        this.error = 'Email ou senha inválidos';
        this.isLoading = false;
      },
    });
  }
}
