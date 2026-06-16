import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'requests/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/new-request/new-request.component').then((m) => m.NewRequestComponent),
  },
  {
    path: 'requests/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/request-detail/request-detail.component').then(
        (m) => m.RequestDetailComponent,
      ),
  },
];
