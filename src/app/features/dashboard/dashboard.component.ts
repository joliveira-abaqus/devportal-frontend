import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <h1 class="mb-6 text-2xl font-bold text-brand-700">Dashboard</h1>
      <p class="text-gray-500">Painel principal — em construção.</p>
      <a routerLink="/requests/new" class="mt-4 inline-block text-brand-600 hover:underline">Nova solicitação</a>
    </div>
  `,
})
export class DashboardComponent {}
