import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucidePlusCircle, LucideSearch } from '@lucide/angular';
import { ButtonComponent } from '@app/components/ui/button/button.component';
import { SelectComponent } from '@app/components/ui/select/select.component';
import { RequestCardComponent } from '@app/components/request-card/request-card.component';
import { RequestsService } from '@app/core/services/requests.service';
import { Request, RequestStatus, RequestType } from '@app/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LucidePlusCircle,
    LucideSearch,
    ButtonComponent,
    SelectComponent,
    RequestCardComponent,
  ],
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
            <svg lucidePlusCircle [size]="16" class="mr-2"></svg>
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <svg lucideSearch [size]="16" class="text-gray-400"></svg>
        <app-select
          selectId="status-filter"
          [options]="statusOptions"
          className="w-48"
          [ngModel]="statusFilter"
          (ngModelChange)="onStatusChange($event)"
        />
        <app-select
          selectId="type-filter"
          [options]="typeOptions"
          className="w-48"
          [ngModel]="typeFilter"
          (ngModelChange)="onTypeChange($event)"
        />
      </div>

      @if (isLoading) {
        <div class="space-y-4">
          @for (i of [1, 2, 3]; track i) {
            <div class="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
          }
        </div>
      } @else if (error) {
        <div class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-400">{{ error }}</p>
        </div>
      } @else if (requests.length === 0) {
        <div class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
          <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
          <a routerLink="/requests/new" class="mt-4 inline-block">
            <app-button variant="outline">
              <svg lucidePlusCircle [size]="16" class="mr-2"></svg>
              Criar primeira solicitação
            </app-button>
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (request of requests; track request.id) {
            <app-request-card [request]="request" />
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;
  statusFilter = '';
  typeFilter = '';

  readonly statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'done', label: 'Concluído' },
    { value: 'failed', label: 'Falhou' },
  ];

  readonly typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'feature', label: 'Feature' },
    { value: 'migration', label: 'Migration' },
  ];

  constructor(private readonly requestsService: RequestsService) {}

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
