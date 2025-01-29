// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from '../app.component';
import { LoginComponent } from '../login/login.component';
import { LeaveRequestFormComponent } from '../leave-request-form/leave-request-form.component';
import { LeaveRequestsListComponent } from '../leave-request-list/leave-request-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
// HTTP Interceptor for adding auth token
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    return next.handle(request);
  }
}

@NgModule({
  declarations: [
    
  ],
  imports: [
    AppComponent,
    LoginComponent,
    LeaveRequestFormComponent,
    LeaveRequestsListComponent,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,DashboardComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: []
})
export class AppModule { }