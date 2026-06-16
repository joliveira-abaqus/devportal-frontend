import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 class="mb-6 text-2xl font-bold text-brand-700">Criar Conta</h1>
        <p class="text-gray-500">Página de registro — em construção.</p>
        <a routerLink="/login" class="mt-4 block text-brand-600 hover:underline">Já tem conta? Entrar</a>
      </div>
    </div>
  `,
})
export class RegisterComponent {}
