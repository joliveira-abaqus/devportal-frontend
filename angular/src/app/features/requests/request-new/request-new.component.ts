import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RequestFormComponent } from '../components/request-form/request-form.component';

@Component({
  selector: 'app-request-new',
  standalone: true,
  imports: [CardComponent, RequestFormComponent],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Nova Solicitação</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Preencha os dados abaixo para criar uma nova solicitação de desenvolvimento
        </p>
      </div>

      <app-card>
        <app-request-form />
      </app-card>
    </div>
  `,
})
export class RequestNewComponent {}
