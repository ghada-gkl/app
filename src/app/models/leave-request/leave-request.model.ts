// models/leave-request.model.ts
export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}
