import { Component } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [DashboardComponent],
  template: '<app-dashboard />',
})
export class RequestListComponent {}
