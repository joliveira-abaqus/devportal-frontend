import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 class="mb-6 text-2xl font-bold text-brand-700">Login</h1>
        <p class="text-gray-500">Página de login — em construção.</p>
        <a routerLink="/register" class="mt-4 block text-brand-600 hover:underline">Criar conta</a>
      </div>
    </div>
  `,
})
export class LoginComponent {}
