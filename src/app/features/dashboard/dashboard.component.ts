import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, PlusCircle, Search } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/button.component';
import { SelectComponent, SelectOption } from '../../shared/components/select.component';
import { RequestCardComponent } from './request-card.component';
import { RequestService } from '../../core/services/request.service';
import { Request, RequestStatus, RequestType } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
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
            <lucide-icon [img]="plusCircleIcon" class="mr-2 h-4 w-4" />
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div
        class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
      >
        <lucide-icon [img]="searchIcon" class="h-4 w-4 text-gray-400" />
        <app-select
          selectId="status-filter"
          [options]="statusOptions"
          [ngModel]="statusFilter"
          (ngModelChange)="onStatusChange($event)"
          extraClass="w-48"
        />
        <app-select
          selectId="type-filter"
          [options]="typeOptions"
          [ngModel]="typeFilter"
          (ngModelChange)="onTypeChange($event)"
          extraClass="w-48"
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
              <lucide-icon [img]="plusCircleIcon" class="mr-2 h-4 w-4" />
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
  readonly plusCircleIcon = PlusCircle;
  readonly searchIcon = Search;

  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;

  statusFilter = '';
  typeFilter = '';

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

  constructor(private requestService: RequestService) {}

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

    this.requestService
      .getRequests({
        status: (this.statusFilter as RequestStatus) || undefined,
        type: (this.typeFilter as RequestType) || undefined,
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
