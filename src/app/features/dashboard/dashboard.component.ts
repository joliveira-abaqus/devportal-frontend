import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../core/services/requests.service';
import { Request, RequestStatus, RequestType } from '../../core/models';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { RequestCardComponent } from '../../shared/components/request-card/request-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    LayoutComponent,
    ButtonComponent,
    SelectComponent,
    RequestCardComponent,
  ],
  template: `
    <app-layout>
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
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nova Solicitação
            </app-button>
          </a>
        </div>

        <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <app-select
            selectId="status-filter"
            [options]="statusOptions"
            [ngModel]="statusFilter"
            (selectionChange)="onStatusChange($event)"
            class="w-48"
          />
          <app-select
            selectId="type-filter"
            [options]="typeOptions"
            [ngModel]="typeFilter"
            (selectionChange)="onTypeChange($event)"
            class="w-48"
          />
        </div>

        @if (isLoading) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
            }
          </div>
        }

        @if (!isLoading && error) {
          <div class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
            <p class="text-red-700 dark:text-red-400">{{ error }}</p>
          </div>
        }

        @if (!isLoading && !error && requests.length === 0) {
          <div class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
            <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
            <a routerLink="/requests/new" class="mt-4 inline-block">
              <app-button variant="outline">
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Criar primeira solicitação
              </app-button>
            </a>
          </div>
        }

        @if (!isLoading && !error && requests.length > 0) {
          <div class="space-y-4">
            @for (request of requests; track request.id) {
              <app-request-card [request]="request" />
            }
          </div>
        }
      </div>
    </app-layout>
  `,
})
export class DashboardComponent implements OnInit {
  private requestsService = inject(RequestsService);

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

  ngOnInit(): void {
    this.fetchRequests();
  }

  onStatusChange(value: string): void {
    this.statusFilter = value;
    this.fetchRequests();
  }

  onTypeChange(value: string): void {
    this.typeFilter = value;
    this.fetchRequests();
  }

  private fetchRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.requestsService
      .getRequests({
        status: (this.statusFilter as RequestStatus) || undefined,
        type: (this.typeFilter as RequestType) || undefined,
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
