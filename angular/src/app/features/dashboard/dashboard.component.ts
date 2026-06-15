import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Search } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { RequestCardComponent } from './components/request-card/request-card.component';
import { RequestsService } from '../../core/services/requests.service';
import { Request, RequestStatus, RequestType } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, ButtonComponent, SelectComponent, RequestCardComponent],
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
            <lucide-icon [img]="PlusCircleIcon" class="mr-2 h-4 w-4" />
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <lucide-icon [img]="SearchIcon" class="h-4 w-4 text-gray-400" />
        <app-select
          selectId="status-filter"
          [options]="statusOptions"
          className="w-48"
          (change)="onStatusChange($event)"
        />
        <app-select
          selectId="type-filter"
          [options]="typeOptions"
          className="w-48"
          (change)="onTypeChange($event)"
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
              <lucide-icon [img]="PlusCircleIcon" class="mr-2 h-4 w-4" />
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
  readonly PlusCircleIcon = PlusCircle;
  readonly SearchIcon = Search;

  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;

  statusFilter: RequestStatus | '' = '';
  typeFilter: RequestType | '' = '';

  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'done', label: 'Concluído' },
    { value: 'failed', label: 'Falhou' },
  ];

  typeOptions = [
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
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value as RequestStatus | '';
    this.loadRequests();
  }

  onTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.typeFilter = target.value as RequestType | '';
    this.loadRequests();
  }

  private loadRequests(): void {
    this.isLoading = true;
    this.error = null;
    this.requestsService.getAll(this.statusFilter, this.typeFilter).subscribe({
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
