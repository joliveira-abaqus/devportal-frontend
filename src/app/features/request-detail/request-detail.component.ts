import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <h1 class="mb-6 text-2xl font-bold text-brand-700">Detalhes da Solicitação</h1>
      <p class="text-gray-500">Detalhes da solicitação — em construção.</p>
      <a routerLink="/dashboard" class="mt-4 inline-block text-brand-600 hover:underline">Voltar ao dashboard</a>
    </div>
  `,
})
export class RequestDetailComponent {}
