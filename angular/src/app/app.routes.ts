import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'requests/new',
        loadComponent: () =>
          import('./features/requests/request-new/request-new.component').then(
            (m) => m.RequestNewComponent,
          ),
      },
      {
        path: 'requests/:id',
        loadComponent: () =>
          import('./features/requests/request-detail/request-detail.component').then(
            (m) => m.RequestDetailComponent,
          ),
      },
    ],
  },
];
