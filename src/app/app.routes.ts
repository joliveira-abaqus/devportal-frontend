import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('@app/layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@app/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'requests/new',
        loadComponent: () =>
          import('@app/pages/new-request/new-request.component').then(
            (m) => m.NewRequestComponent,
          ),
      },
      {
        path: 'requests/:id',
        loadComponent: () =>
          import('@app/pages/request-detail/request-detail.component').then(
            (m) => m.RequestDetailComponent,
          ),
      },
    ],
  },
];
