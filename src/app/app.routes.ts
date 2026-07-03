import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'requests/new',
    loadComponent: () =>
      import('./pages/requests-new/requests-new.component').then(
        (m) => m.RequestsNewComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'requests/:id',
    loadComponent: () =>
      import('./pages/request-detail/request-detail.component').then(
        (m) => m.RequestDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
