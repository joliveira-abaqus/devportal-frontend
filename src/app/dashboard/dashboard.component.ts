import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../shared/components/select/select.component';
import { RequestCardComponent } from './request-card/request-card.component';
import { RequestsService } from '../core/services/requests.service';
import { Request } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, SelectComponent, RequestCardComponent],
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Minhas Solicitações</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas solicitações de desenvolvimento
          </p>
        </div>
        <a routerLink="/requests/new">
          <app-button>
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div class="w-48">
          <select
            [value]="statusFilter"
            (change)="onStatusChange($event)"
            class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option *ngFor="let opt of statusOptions" [value]="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="w-48">
          <select
            [value]="typeFilter"
            (change)="onTypeChange($event)"
            class="block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option *ngFor="let opt of typeOptions" [value]="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="isLoading" class="space-y-4">
        <div *ngFor="let i of [1, 2, 3]" class="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
      </div>

      <div *ngIf="!isLoading && error" class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
        <p class="text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <div *ngIf="!isLoading && !error && requests.length === 0" class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
        <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
        <a routerLink="/requests/new" class="mt-4 inline-block">
          <app-button variant="outline">
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Criar primeira solicitação
          </app-button>
        </a>
      </div>

      <div *ngIf="!isLoading && !error && requests.length > 0" class="space-y-4">
        <app-request-card *ngFor="let request of requests" [request]="request"></app-request-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;
  statusFilter = '';
  typeFilter = '';

  statusOptions: SelectOption[] = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'done', label: 'Concluído' },
    { value: 'failed', label: 'Falhou' },
  ];

  typeOptions: SelectOption[] = [
    { value: '', label: 'Todos os tipos' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'feature', label: 'Feature' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  onStatusChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.loadRequests();
  }

  onTypeChange(event: Event): void {
    this.typeFilter = (event.target as HTMLSelectElement).value;
    this.loadRequests();
  }

  private loadRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.requestsService
      .getRequests({
        status: this.statusFilter || undefined,
        type: this.typeFilter || undefined,
      })
      .subscribe({
        next: (data) => {
          this.requests = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar solicitações';
          this.isLoading = false;
        },
      });
  }
}
