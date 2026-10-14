import React from 'react';
import { 
  AttendanceConfig, 
  WorkShift, 
  ShiftSchedule, 
  Employee, 
  Department, 
  ShiftPattern, 
  SavedSchedulePattern, 
  ShiftGroup, 
  ShiftGroupAssignment, 
  DepartmentScheduleAssignment,
  ShiftSwapType,
  ShiftSwapInitiator,
  ShiftSwap
} from '../../../types';

export type JadwalSubTab = 'matriks' | 'pengaturan' | 'pertukaran' | 'tambahan';

export interface JadwalCommonProps {
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
}

export interface DayOfWeekItem {
  key: string;
  label: string;
  defaultDayIndex: number;
}

export interface CellInfo {
  shiftId: string;
  shiftName: string;
  code: string;
  color: string;
  startTime: string;
  endTime: string;
  isOff: boolean;
  sched?: ShiftSchedule;
}

export interface ViewCellDetail {
  employee: Employee;
  date: string;
  cellInfo: CellInfo;
  shiftId: string;
  shiftName: string;
}

export interface RotationTemplate {
  id: string;
  group: string;
  name: string;
  label: string;
  days: number;
  description: string;
  cycle: string[];
}

// Pertukaran Shift Types
export interface JadwalPertukaranProps {
  activeConfig?: AttendanceConfig | null;
  availableShifts: WorkShift[];
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  onBack?: () => void;
}

export type ModalMode = 'create' | 'view' | 'edit';

export interface EmployeeComboboxProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  employees: Employee[];
  excludeId?: string;
  placeholder?: string;
  rightAction?: React.ReactNode;
  disabled?: boolean;
}

export interface FormGantiShiftProps {
  employees: Employee[];
  selectedEmp1: string;
  setSelectedEmp1: (id: string) => void;
  date1: string;
  setDate1: (d: string) => void;
  setGantiShiftTargetDate: (d: string) => void;
  detectedShift1: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  filteredGantiShifts: WorkShift[];
  targetShiftChoice: string;
  setTargetShiftChoice: (shiftId: string | ((prev: string) => string)) => void;
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  isEmp1Locked?: boolean;
}

export interface FormTukarShiftProps {
  employees: Employee[];
  employeesForEmp2: Employee[];
  selectedEmp1: string;
  setSelectedEmp1: (id: string) => void;
  selectedEmp2: string;
  setSelectedEmp2: (id: string) => void;
  date1: string;
  setDate1: (d: string) => void;
  date2: string;
  setDate2: (d: string) => void;
  isSameDateTukarShift: boolean;
  setIsSameDateTukarShift: (val: boolean | ((prev: boolean) => boolean)) => void;
  detectedShift1: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  detectedShift2Peer: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  isHasIdenticalShiftError: boolean;
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  isEmp1Locked?: boolean;
}

export interface FormTukarOffProps {
  employees: Employee[];
  selectedEmp1: string;
  setSelectedEmp1: (id: string) => void;
  date1: string;
  setDate1: (d: string) => void;
  date2: string;
  setDate2: (d: string) => void;
  detectedShift1: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  detectedShift2Self: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  showTukarOffRules: boolean;
  setShowTukarOffRules: (val: boolean | ((prev: boolean) => boolean)) => void;
  tukarOffShiftList: WorkShift[];
  targetShiftChoice: string;
  setTargetShiftChoice: (shiftId: string | ((prev: string) => string)) => void;
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  isEmp1Locked?: boolean;
}

export interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: ModalMode;
  selectedSwap: ShiftSwap | null;
  handleSwitchToEdit: () => void;
  handleSaveSwap: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  isEmp1Locked?: boolean;
  
  // Header / Form common state
  initiator: ShiftSwapInitiator;
  setInitiator: (init: ShiftSwapInitiator) => void;
  swapType: ShiftSwapType;
  setSwapType: (st: ShiftSwapType) => void;
  showCategoryInfo: boolean;
  setShowCategoryInfo: (val: boolean | ((prev: boolean) => boolean)) => void;
  swapReason: string;
  setSwapReason: (r: string) => void;
  
  // Data for Category Forms
  employees: Employee[];
  employeesForEmp2: Employee[];
  selectedEmp1: string;
  setSelectedEmp1: (id: string) => void;
  selectedEmp2: string;
  setSelectedEmp2: (id: string) => void;
  date1: string;
  setDate1: (d: string) => void;
  date2: string;
  setDate2: (d: string) => void;
  isSameDateTukarShift: boolean;
  setIsSameDateTukarShift: (val: boolean | ((prev: boolean) => boolean)) => void;
  setGantiShiftTargetDate: (d: string) => void;
  targetShiftChoice: string;
  setTargetShiftChoice: (shiftId: string | ((prev: string) => string)) => void;
  showTukarOffRules: boolean;
  setShowTukarOffRules: (val: boolean | ((prev: boolean) => boolean)) => void;
  
  // Detected Shifts & Lists
  detectedShift1: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  detectedShift2Peer: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  detectedShift2Self: { shiftId: string; shiftName?: string; isOff?: boolean; startTime?: string; endTime?: string } | null;
  filteredGantiShifts: WorkShift[];
  tukarOffShiftList: WorkShift[];
  isHasIdenticalShiftError: boolean;
  
  // Maps & Badges for View & Form Mode
  empMap: Map<string, Employee>;
  posMap: Map<string, string>;
  deptMap: Map<string, string>;
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
}

export interface ModalTabelProps {
  selectedSwap: ShiftSwap;
  empMap: Map<string, Employee>;
  posMap: Map<string, string>;
  deptMap: Map<string, string>;
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
}

export interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filterInitiator: 'ALL' | ShiftSwapInitiator;
  setFilterInitiator: (val: 'ALL' | ShiftSwapInitiator) => void;
  filterSwapType: 'ALL' | ShiftSwapType;
  setFilterSwapType: (val: 'ALL' | ShiftSwapType) => void;
  hasActiveFilters: boolean;
}

// Jadwal Tambahan Types
export interface JadwalTambahanProps {
  activeConfig?: AttendanceConfig | null;
  availableShifts: WorkShift[];
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  onBack?: () => void;
}
