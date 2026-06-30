import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucidePlusCircle, LucideSearch } from '@lucide/angular';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { SelectComponent, SelectOption } from '../../shared/components/ui/select.component';
import { RequestCardComponent } from '../../shared/components/domain/request-card.component';
import { RequestsService } from '../../core/services/requests.service';
import { Request, RequestStatus, RequestType } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
            <svg lucidePlusCircle class="mr-2 h-4 w-4"></svg>
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <svg lucideSearch class="h-4 w-4 text-gray-400"></svg>
        <app-select
          selectId="status-filter"
          [options]="statusOptions"
          className="w-48"
          (selectionChange)="onStatusChange($event)"
        ></app-select>
        <app-select
          selectId="type-filter"
          [options]="typeOptions"
          className="w-48"
          (selectionChange)="onTypeChange($event)"
        ></app-select>
      </div>

      <ng-container *ngIf="isLoading; else loaded">
        <div class="space-y-4">
          <div *ngFor="let i of [1, 2, 3]" class="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
        </div>
      </ng-container>

      <ng-template #loaded>
        <div *ngIf="error" class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-400">{{ error }}</p>
        </div>

        <div *ngIf="!error && requests.length === 0" class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
          <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
          <a routerLink="/requests/new" class="mt-4 inline-block">
            <app-button variant="outline">
              <svg lucidePlusCircle class="mr-2 h-4 w-4"></svg>
              Criar primeira solicitação
            </app-button>
          </a>
        </div>

        <div *ngIf="!error && requests.length > 0" class="space-y-4">
          <app-request-card *ngFor="let request of requests" [request]="request"></app-request-card>
        </div>
      </ng-template>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;

  statusFilter: RequestStatus | '' = '';
  typeFilter: RequestType | '' = '';

  readonly statusOptions: SelectOption[] = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'done', label: 'Concluído' },
    { value: 'failed', label: 'Falhou' },
  ];

  readonly typeOptions: SelectOption[] = [
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
    this.statusFilter = value as RequestStatus | '';
    this.fetchRequests();
  }

  onTypeChange(value: string): void {
    this.typeFilter = value as RequestType | '';
    this.fetchRequests();
  }

  private fetchRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.requestsService
      .getRequests({
        status: this.statusFilter || undefined,
        type: this.typeFilter || undefined,
      })
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar solicitações';
          this.isLoading = false;
        },
      });
  }
}
