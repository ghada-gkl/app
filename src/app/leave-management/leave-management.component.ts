// leave-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
interface LeaveRequest {
  id: number;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

@Component({
  selector: 'app-leave-management',
  imports: [FormsModule,CommonModule],
  template: `
    <div class="container mx-4 my-4">
      <nav class="bg-blue-600 p-4 mb-6 rounded">
        <div class="flex justify-between items-center">
          <h1 class="text-white text-xl">Système de Gestion des Congés</h1>
          <div class="space-x-4">
            <button (click)="currentView = 'employee'" 
                    [class.bg-blue-800]="currentView === 'employee'"
                    class="text-white px-4 py-2 rounded">
              Employé
            </button>
            <button (click)="currentView = 'manager'"
                    [class.bg-blue-800]="currentView === 'manager'"
                    class="text-white px-4 py-2 rounded">
              Manager
            </button>
            <button (click)="currentView = 'admin'"
                    [class.bg-blue-800]="currentView === 'admin'"
                    class="text-white px-4 py-2 rounded">
              Admin
            </button>
          </div>
        </div>
      </nav>

      <!-- Employee View -->
      <div *ngIf="currentView === 'employee'" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Solde de Congés</h2>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded">
              <h3 class="font-semibold">Congés Annuels</h3>
              <p class="text-2xl">25 jours</p>
            </div>
            <div class="bg-green-50 p-4 rounded">
              <h3 class="font-semibold">RTT</h3>
              <p class="text-2xl">12 jours</p>
            </div>
            <div class="bg-purple-50 p-4 rounded">
              <h3 class="font-semibold">Maladie</h3>
              <p class="text-2xl">5 jours</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Nouvelle Demande</h2>
          <form (ngSubmit)="submitRequest()" class="space-y-4">
            <div>
              <label class="block mb-2">Type de Congé</label>
              <select [(ngModel)]="newRequest.type" name="type" 
                      class="w-full p-2 border rounded">
                <option value="annual">Congés Annuels</option>
                <option value="rtt">RTT</option>
                <option value="sick">Maladie</option>
                <option value="maternity">Maternité</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-2">Date de début</label>
                <input type="date" [(ngModel)]="newRequest.startDate" 
                       name="startDate" class="w-full p-2 border rounded">
              </div>
              <div>
                <label class="block mb-2">Date de fin</label>
                <input type="date" [(ngModel)]="newRequest.endDate" 
                       name="endDate" class="w-full p-2 border rounded">
              </div>
            </div>
            <div>
              <label class="block mb-2">Commentaires</label>
              <textarea [(ngModel)]="newRequest.comments" name="comments" 
                        class="w-full p-2 border rounded"></textarea>
            </div>
            <button type="submit" 
                    class="bg-blue-600 text-white px-4 py-2 rounded">
              Soumettre la demande
            </button>
          </form>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Mes Demandes</h2>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-2 text-left">Type</th>
                <th class="p-2 text-left">Début</th>
                <th class="p-2 text-left">Fin</th>
                <th class="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let request of leaveRequests">
                <td class="p-2">{{request.type}}</td>
                <td class="p-2">{{request.startDate}}</td>
                <td class="p-2">{{request.endDate}}</td>
                <td class="p-2">
                  <span [class]="getStatusClass(request.status)">
                    {{request.status}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Manager View -->
      <div *ngIf="currentView === 'manager'" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Demandes à Valider</h2>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-2 text-left">Employé</th>
                <th class="p-2 text-left">Type</th>
                <th class="p-2 text-left">Période</th>
                <th class="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let request of pendingRequests">
                <td class="p-2">{{request.employeeName}}</td>
                <td class="p-2">{{request.type}}</td>
                <td class="p-2">{{request.startDate}} - {{request.endDate}}</td>
                <td class="p-2 space-x-2">
                  <button (click)="approveRequest(request.id)"
                          class="bg-green-600 text-white px-3 py-1 rounded">
                    Approuver
                  </button>
                  <button (click)="rejectRequest(request.id)"
                          class="bg-red-600 text-white px-3 py-1 rounded">
                    Refuser
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Admin View -->
      <div *ngIf="currentView === 'admin'" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Tableau de Bord RH</h2>
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded">
              <h3 class="font-semibold">Demandes en Attente</h3>
              <p class="text-2xl">{{pendingRequests.length}}</p>
            </div>
            <div class="bg-green-50 p-4 rounded">
              <h3 class="font-semibold">Demandes Approuvées</h3>
              <p class="text-2xl">{{approvedRequests.length}}</p>
            </div>
            <div class="bg-red-50 p-4 rounded">
              <h3 class="font-semibold">Demandes Refusées</h3>
              <p class="text-2xl">{{rejectedRequests.length}}</p>
            </div>
          </div>
          <div class="space-y-4">
            <button class="bg-blue-600 text-white px-4 py-2 rounded">
              Générer Rapport Mensuel
            </button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded ml-4">
              Exporter les Données
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})

export class LeaveManagementComponent implements OnInit {
 
  currentView: 'employee' | 'manager' | 'admin' = 'employee';
  
  newRequest = {
    type: '',
    startDate: '',
    endDate: '',
    comments: ''
  };

  leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employeeName: 'Jean Dupont',
      type: 'Congés Annuels',
      startDate: '2025-02-01',
      endDate: '2025-02-07',
      status: 'pending'
    },
    // Add more sample data as needed
  ];

  get pendingRequests() {
    return this.leaveRequests.filter(r => r.status === 'pending');
  }

  get approvedRequests() {
    return this.leaveRequests.filter(r => r.status === 'approved');
  }

  get rejectedRequests() {
    return this.leaveRequests.filter(r => r.status === 'rejected');
  }

  submitRequest() {
    // Handle submission logic
    console.log('Submitting request:', this.newRequest);
  }

  approveRequest(id: number) {
    // Handle approval logic
    console.log('Approving request:', id);
  }

  rejectRequest(id: number) {
    // Handle rejection logic
    console.log('Rejecting request:', id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  }

  ngOnInit() {
    // Initialize component
  }
}