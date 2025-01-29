import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports:[CommonModule,ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Connexion</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email" 
                   class="w-full p-2 border rounded" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Mot de passe</label>
            <input type="password" formControlName="password" 
                   class="w-full p-2 border rounded" />
          </div>

          <div *ngIf="error" class="text-red-600 text-sm">
            {{error}}
          </div>
          
          <button type="submit" [disabled]="loginForm.invalid || loading"
                  class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700
                         disabled:bg-gray-400">
            {{loading ? 'Connexion...' : 'Se connecter'}}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = 'Email ou mot de passe incorrect';
          this.loading = false;
        }
      });
    }
  }
}
