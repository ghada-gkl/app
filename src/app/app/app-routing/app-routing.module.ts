import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../login/login.component';
import { LeaveRequestFormComponent } from '../../leave-request-form/leave-request-form.component';
import { LeaveRequestsListComponent } from '../../leave-request-list/leave-request-list.component';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LeaveRequestFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'requests',
    component: LeaveRequestsListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager', 'admin'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

