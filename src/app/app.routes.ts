import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RequestNewComponent } from './features/requests/request-new.component';
import { RequestDetailComponent } from './features/requests/request-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'requests/new', component: RequestNewComponent },
      { path: 'requests/:id', component: RequestDetailComponent },
    ],
  },
];
