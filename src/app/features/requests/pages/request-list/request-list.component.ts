import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, PlusCircle, Search } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { RequestCardComponent } from '../../components/request-card/request-card.component';
import { RequestService } from '../../services/request.service';
import { Request, RequestStatus, RequestType } from '../../../../shared/models/request.model';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, ButtonComponent, SelectComponent, RequestCardComponent],
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Minhas Solicitações</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie suas solicitações de desenvolvimento</p>
        </div>
        <a routerLink="/requests/new">
          <app-button>
            <lucide-icon [img]="PlusCircleIcon" [size]="16" class="mr-2"></lucide-icon>
            Nova Solicitação
          </app-button>
        </a>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <lucide-icon [img]="SearchIcon" [size]="16" class="text-gray-400"></lucide-icon>
        <app-select
          selectId="status-filter"
          [options]="statusOptions"
          className="w-48"
          [ngModel]="statusFilter"
          (ngModelChange)="onStatusChange($event)"
        ></app-select>
        <app-select
          selectId="type-filter"
          [options]="typeOptions"
          className="w-48"
          [ngModel]="typeFilter"
          (ngModelChange)="onTypeChange($event)"
        ></app-select>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="space-y-4">
        <div *ngFor="let i of [1, 2, 3]" class="h-24 animate-pulse rounded-lg bg-white shadow-sm dark:bg-gray-800"></div>
      </div>

      <!-- Error -->
      <div *ngIf="!isLoading && error" class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
        <p class="text-red-700 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Empty -->
      <div
        *ngIf="!isLoading && !error && requests.length === 0"
        class="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800"
      >
        <p class="text-gray-500 dark:text-gray-400">Nenhuma solicitação encontrada.</p>
        <a routerLink="/requests/new" class="mt-4 inline-block">
          <app-button variant="outline">
            <lucide-icon [img]="PlusCircleIcon" [size]="16" class="mr-2"></lucide-icon>
            Criar primeira solicitação
          </app-button>
        </a>
      </div>

      <!-- List -->
      <div *ngIf="!isLoading && !error && requests.length > 0" class="space-y-4">
        <app-request-card *ngFor="let request of requests" [request]="request"></app-request-card>
      </div>
    </div>
  `,
})
export class RequestListComponent implements OnInit {
  readonly PlusCircleIcon = PlusCircle;
  readonly SearchIcon = Search;

  requests: Request[] = [];
  isLoading = true;
  error: string | null = null;
  statusFilter = '';
  typeFilter = '';

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
