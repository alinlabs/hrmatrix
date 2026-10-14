import { LeaveCategory, Leave, LeaveTypePolicy } from '../../types';

export type CutiSubTab = 'pengajuan' | 'kuota' | 'kebijakan';

export interface LeaveFormData {
  employeeId: string;
  leaveType: LeaveCategory | string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: Leave['status'];
}

export interface QuotaFormData {
  annualQuota: number | string;
  carryForward: number | string;
  adjustedQuota: number | string;
  notes: string;
}
