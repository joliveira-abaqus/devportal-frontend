import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Search } from 'lucide-angular';
import { SidebarComponent } from '../../components/sidebar.component';
import { HeaderComponent } from '../../components/header.component';
import { ButtonComponent } from '../../components/ui/button.component';
import { SelectComponent } from '../../components/ui/select.component';
import { RequestCardComponent } from '../../components/request-card.component';
import { RequestsService } from '../../services/requests.service';
import { ThemeService } from '../../services/theme.service';
import { Request, RequestStatus, RequestType } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
    SidebarComponent,
    HeaderComponent,
    ButtonComponent,
    SelectComponent,
    RequestCardComponent,
  ],
  template: `
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          @if (isLoading) {
            <!-- Skeleton de carregamento -->
            <div>
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <div class="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
                  <div class="mt-2 h-4 w-80 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div class="h-10 w-40 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div class="mb-6 h-16 animate-pulse rounded-lg bg-white shadow-sm"></div>
              <div class="space-y-4">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div class="h-24 animate-pulse rounded-lg bg-white shadow-sm"></div>
                }
              </div>
            </div>
          } @else {
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
                    <lucide-icon [img]="PlusCircleIcon" [size]="16" class="mr-2"></lucide-icon>
                    Nova Solicitação
                  </app-button>
                </a>
              </div>

              <div
                class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
              >
                <lucide-icon [img]="SearchIcon" [size]="16" class="text-gray-400"></lucide-icon>
                <app-select
                  selectId="status-filter"
                  [options]="statusOptions"
                  className="w-48"
                  [ngModel]="statusFilter"
                  (ngModelChange)="onStatusFilterChange($event)"
                />
                <app-select
                  selectId="type-filter"
                  [options]="typeOptions"
                  className="w-48"
                  [ngModel]="typeFilter"
                  (ngModelChange)="onTypeFilterChange($event)"
                />
              </div>

              @if (error) {
                <div class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
                  <p class="text-red-700 dark:text-red-400">{{ error }}</p>
                </div>
              } @else if (requests.length === 0) {
                <div class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
                  <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
                  <a routerLink="/requests/new" class="mt-4 inline-block">
                    <app-button variant="outline">
                      <lucide-icon [img]="PlusCircleIcon" [size]="16" class="mr-2"></lucide-icon>
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
          }
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly requestsService = inject(RequestsService);
  private readonly themeService = inject(ThemeService);

  readonly PlusCircleIcon = PlusCircle;
  readonly SearchIcon = Search;

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

  ngOnInit(): void {
    this.themeService.init();
    this.loadRequests();
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter = value;
    this.loadRequests();
  }

  onTypeFilterChange(value: string): void {
    this.typeFilter = value;
    this.loadRequests();
  }

  private loadRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.requestsService
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
