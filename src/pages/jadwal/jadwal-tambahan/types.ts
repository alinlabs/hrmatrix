import React from 'react';
import { AttendanceConfig, WorkShift, ShiftSchedule } from '../../../types';

export interface JadwalTambahanProps {
  activeConfig?: AttendanceConfig | null;
  availableShifts: WorkShift[];
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
}
