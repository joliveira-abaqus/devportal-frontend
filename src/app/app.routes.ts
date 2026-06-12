import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { DashboardLayoutComponent } from './features/dashboard/layout/dashboard-layout.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { RequestListComponent } from './features/requests/pages/request-list/request-list.component';
import { RequestNewComponent } from './features/requests/pages/request-new/request-new.component';
import { RequestDetailComponent } from './features/requests/pages/request-detail/request-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'requests', component: RequestListComponent },
      { path: 'requests/new', component: RequestNewComponent },
      { path: 'requests/:id', component: RequestDetailComponent },
    ],
  },
];
