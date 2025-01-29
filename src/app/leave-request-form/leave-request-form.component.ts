
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../services/leave.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-leave-request-form',
  imports:[ReactiveFormsModule],
  template: `
    <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Nouvelle Demande de Congé</h2>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium">Type de Congé</label>
        <select formControlName="type" class="w-full p-2 border rounded">
          <option value="">Sélectionnez un type</option>
          <option value="annual">Congés Annuels</option>
          <option value="sick">Maladie</option>
          <option value="maternity">Maternité</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium">Date de début</label>
          <input type="date" formControlName="startDate" class="w-full p-2 border rounded">
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium">Date de fin</label>
          <input type="date" formControlName="endDate" class="w-full p-2 border rounded">
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium">Commentaires</label>
        <textarea formControlName="comments" rows="3" class="w-full p-2 border rounded"></textarea>
      </div>

      <button type="submit" [disabled]="!leaveForm.valid" 
              class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
        Soumettre la demande
      </button>
    </form>
  `
})
export class LeaveRequestFormComponent {
  leaveForm: FormGroup;

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {
    this.leaveForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      comments: ['']
    });
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.leaveService.submitLeaveRequest(this.leaveForm.value).subscribe({
        next: (response) => {
          console.log('Demande soumise avec succès', response);
          this.leaveForm.reset();
        },
        error: (error) => console.error('Erreur lors de la soumission', error)
      });
    }
  }
}