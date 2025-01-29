// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
interface LeaveRequest {
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-dashboard',
  imports:[RouterOutlet,CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Page Header -->
      <div class="border-b bg-white shadow-sm">
        <div class="px-4 py-6">
          <h1 class="text-2xl font-semibold text-gray-900">Tableau de Bord</h1>
          <p class="mt-1 text-sm text-gray-500">
            Bienvenue {{ authService.currentUserValue?.name }}
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Leave Balance Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700">Solde Congés</h3>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                Année 2025
              </span>
            </div>
            <div class="mt-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Congés Annuels</span>
                <span class="font-semibold">{{ leaveBalance.annual }} jours</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">RTT</span>
                <span class="font-semibold">{{ leaveBalance.rtt }} jours</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Maladie</span>
                <span class="font-semibold">{{ leaveBalance.sick }} jours</span>
              </div>
              <div class="mt-4 pt-4 border-t">
                <button 
                  routerLink="/leave-request"
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Nouvelle Demande
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Requests Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-700">Demandes Récentes</h3>
              <a routerLink="/my-requests" 
                 class="text-sm text-blue-600 hover:text-blue-800">
                Voir tout
              </a>
            </div>
            <div class="space-y-3">
              <div *ngFor="let request of recentRequests" 
                   class="flex justify-between items-center py-2 border-b">
                <div>
                  <p class="font-medium">{{ request.type }}</p>
                  <p class="text-sm text-gray-500">
                    {{ request.startDate | date:'shortDate' }} - {{ request.endDate | date:'shortDate' }}
                  </p>
                </div>
                <span [class]="getStatusBadgeClass(request.status)">
                  {{ getStatusText(request.status) }}
                </span>
              </div>
              <div *ngIf="recentRequests.length === 0" 
                   class="text-center py-4 text-gray-500">
                Aucune demande récente
              </div>
            </div>
          </div>

          <!-- Manager Stats Card -->
          <div *ngIf="authService.isManager()" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">À Traiter</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Demandes en attente</span>
                <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {{ pendingRequests }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Traitées cette semaine</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {{ processedThisWeek }}
                </span>
              </div>
              <div class="mt-4 pt-4 border-t">
                <button 
                  routerLink="/manage-requests"
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Gérer les Demandes
                </button>
              </div>
            </div>
          </div>

          <!-- Admin Quick Stats (Admin Only) -->
          <div *ngIf="authService.isAdmin()" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Statistiques</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Employés en congé</p>
                  <p class="text-2xl font-semibold text-gray-900">8</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Retours aujourd'hui</p>
                  <p class="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t">
                <button 
                  routerLink="/admin/reports"
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Voir les Rapports
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="bg-white rounded-lg shadow p-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  leaveBalance = {
    annual: 25,
    rtt: 12,
    sick: 5
  };

  recentRequests: LeaveRequest[] = [
    {
      type: 'Congés Annuels',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-02-20'),
      status: 'pending'
    },
    {
      type: 'RTT',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-01'),
      status: 'approved'
    }
  ];

  pendingRequests = 5;
  processedThisWeek = 12;

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Will be implemented with real service calls
  }

  getStatusBadgeClass(status: 'pending' | 'approved' | 'rejected'): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full',
      approved: 'bg-green-100 text-green-800 px-3 py-1 rounded-full',
      rejected: 'bg-red-100 text-red-800 px-3 py-1 rounded-full'
    };
    return classes[status];
  }

  getStatusText(status: 'pending' | 'approved' | 'rejected'): string {
    const texts = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Refusé'
    };
    return texts[status];
  }
}