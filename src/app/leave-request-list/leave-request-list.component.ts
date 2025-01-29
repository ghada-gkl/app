import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../services/leave.service';
import { LeaveRequest } from '../models/leave-request/leave-request.model'; // Adjust the path if necessary
import { CommonModule } from '@angular/common';

const statusClasses = {
  pending: 'text-yellow-600',
  approved: 'text-green-600',
  rejected: 'text-red-600'
};

@Component({
  selector: 'app-leave-requests-list',
  standalone: true,  // Add this for standalone components
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Demandes de Congés</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-4 text-left">Employé</th>
              <th class="p-4 text-left">Type</th>
              <th class="p-4 text-left">Début</th>
              <th class="p-4 text-left">Fin</th>
              <th class="p-4 text-left">Status</th>
              <th class="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let request of leaveRequests" class="border-t">
              <td class="p-4">{{ request.employeeName }}</td>
              <td class="p-4">{{ request.type }}</td>
              <td class="p-4">{{ request.startDate | date }}</td>
              <td class="p-4">{{ request.endDate | date }}</td>
              <td class="p-4">
                <span [class]="getStatusClass(request.status)">
                  {{ request.status }}
                </span>
              </td>
              <td class="p-4 space-x-2" *ngIf="isManager">
                <button (click)="updateStatus(request.id, 'approved')"
                        class="bg-green-600 text-white px-3 py-1 rounded">
                  Approuver
                </button>
                <button (click)="updateStatus(request.id, 'rejected')"
                        class="bg-red-600 text-white px-3 py-1 rounded">
                  Refuser
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class LeaveRequestsListComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  isManager = true; // This should come from an auth service

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.leaveService.getLeaveRequests().subscribe({
      next: (requests) => this.leaveRequests = requests,
      error: (error) => console.error('Erreur de chargement des demandes', error)
    });
  }

  updateStatus(id: number, status: string) {
    this.leaveService.updateLeaveRequest(id, status).subscribe({
      next: () => this.loadRequests(),
      error: (error) => console.error('Erreur de mise à jour', error)
    });
  }

  getStatusClass(status: keyof typeof statusClasses): string {
    return statusClasses[status] || '';
  }
}
