import React from 'react';
import { AttendanceConfig, Attendance, WorkShift, Employee, Leave, ShiftSchedule } from '../../../types';

export interface PresentNowProps {
  config: AttendanceConfig | null;
  onConfigSaved?: () => void;
  onSubViewChange?: (isSubView: boolean) => void;
}

export type ClockMode = 'clock-in' | 'clock-out' | 'leave';
export type ViewMode = 'card' | 'table';

export interface EmployeeAttendanceItem {
  employee: Employee;
  departmentName: string;
  positionName: string;
  attendance: Attendance | null;
  leaveRecord: Leave | null;
  schedRecord: ShiftSchedule | null;
  hasRecord: boolean;
  status: string;
  checkIn: string;
  checkOut: string;
  shiftId: string;
  shiftName: string;
  notes: string;
}

export interface AttendanceStats {
  present: number;
  late: number;
  wfh: number;
  leave: number;
  absent: number;
  notSet: number;
}

export interface PresensiFormData {
  employeeId: string;
  date: string;
  shiftId: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'Leave' | 'Sick' | 'WFH';
  notes: string;
}

export interface QuickUpdatePayload {
  status?: 'Present' | 'Late' | 'Absent' | 'Leave' | 'Sick' | 'WFH';
  shiftId?: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}
