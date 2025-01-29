// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { LeaveRequestsListComponent } from './leave-request-list/leave-request-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'leave-request',
        pathMatch: 'full'
      },
      {
        path: 'leave-request',
        component: LeaveRequestFormComponent,
        title: 'Nouvelle Demande'
      },
      {
        path: 'my-requests',
        component: LeaveRequestsListComponent,
        title: 'Mes Demandes'
      },
      {
        path: 'manage-requests',
        component: LeaveRequestsListComponent,
        title: 'Gestion des Demandes',
        data: { roles: ['manager', 'admin'] }
      },
      
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion'
  },
  {
    path: '**',
    redirectTo: ''
  }
];