import Dexie, { Table } from 'dexie';
import { Company, Employee, Department, Position, Attendance, PayrollPeriod, PayrollRecord, Settings, Leave, KPITemplate, KPIResult, KPIPeriod, SalaryHistory, RegulatorySource, PayrollRule, ShiftSchedule, ShiftSwap, ExtraShift, DeletedEntityId } from '../types';

export class HRISDatabase extends Dexie {
  company!: Table<Company, string>;
  employees!: Table<Employee, string>;
  departments!: Table<Department, string>;
  positions!: Table<Position, string>;
  attendance!: Table<Attendance, string>;
  payrollPeriods!: Table<PayrollPeriod, string>;
  payrollRecords!: Table<PayrollRecord, string>;
  settings!: Table<Settings, string>;
  leaves!: Table<Leave, string>;
  kpiTemplates!: Table<KPITemplate, string>;
  kpiResults!: Table<KPIResult, string>;
  kpiPeriods!: Table<KPIPeriod, string>;
  salaryHistory!: Table<SalaryHistory, string>;
  regulatorySources!: Table<RegulatorySource, string>;
  payrollRules!: Table<PayrollRule, string>;
  shiftSchedules!: Table<ShiftSchedule, string>;
  shiftSwaps!: Table<ShiftSwap, string>;
  extraShifts!: Table<ExtraShift, string>;
  deletedEntityIds!: Table<DeletedEntityId, string>;

  constructor() {
    super('LocalHRISDB');
    this.version(5).stores({
      company: 'id',
      employees: 'id, employeeId, departmentId, positionId, status',
      departments: 'id',
      positions: 'id, departmentId',
      attendance: 'id, employeeId, date, status',
      payrollPeriods: 'id, month, year, status',
      payrollRecords: 'id, payrollPeriodId, employeeId, status',
      settings: 'id',
      leaves: 'id, employeeId, leaveType, status',
      kpiTemplates: 'id, name',
      kpiResults: 'id, employeeId, periodId, templateId',
      salaryHistory: 'id, employeeId, effectiveDate',
      regulatorySources: 'id, status',
      payrollRules: 'id, category, status, origin',
      shiftSchedules: 'id, employeeId, date, shiftId',
      shiftSwaps: 'id, requesterEmployeeId, targetEmployeeId, status',
      extraShifts: 'id, employeeId, workDate, status',
      deletedEntityIds: 'id, entityType'
    });
    this.version(6).stores({
      kpiPeriods: 'id, month, year, status'
    });
    this.version(7).stores({
      company: 'id',
      employees: 'id, employeeId, departmentId, positionId, status',
      departments: 'id',
      positions: 'id, departmentId',
      attendance: 'id, employeeId, date, status',
      payrollPeriods: 'id, month, year, status',
      payrollRecords: 'id, payrollPeriodId, employeeId, status',
      settings: 'id',
      leaves: 'id, employeeId, leaveType, status',
      kpiTemplates: 'id, name',
      kpiResults: 'id, employeeId, periodId, templateId',
      kpiPeriods: 'id, month, year, status',
      salaryHistory: 'id, employeeId, effectiveDate',
      regulatorySources: 'id, status',
      payrollRules: 'id, category, status, origin',
      shiftSchedules: 'id, employeeId, date, shiftId',
      shiftSwaps: 'id, requesterEmployeeId, targetEmployeeId, status',
      extraShifts: 'id, employeeId, workDate, status',
      deletedEntityIds: 'id, entityType'
    });
  }

  async clearAllTables(): Promise<void> {
    const tablePromises = this.tables.map(async (table) => {
      try {
        await table.clear();
      } catch (err) {
        // Suppress individual table error if object store is not yet present
        console.warn(`Could not clear table ${table.name}:`, err);
      }
    });
    await Promise.allSettled(tablePromises);

    if (typeof localStorage !== 'undefined') {
      try {
        const gaKeys = [
          'hrmatrix_ga_assets_v2',
          'hrmatrix_ga_supplies_v2',
          'hrmatrix_ga_purchase_requests_v2',
          'hrmatrix_ga_maintenance_schedules_v2',
          'hrmatrix_ga_room_bookings_v2',
          'hrmatrix_ga_maintenance_tickets_v2',
          'hrmatrix_ga_vendors_v2',
          'hrmatrix_ga_permits_v2',
          'hrmatrix_ga_guests_v2',
          'hrmatrix_ga_mails_v2',
          'hrmatrix_ga_demo_seeded_v2',
          'hrmatrix_ga_assets',
          'hrmatrix_ga_supplies',
          'hrmatrix_ga_purchase_requests',
          'hrmatrix_ga_maintenance_schedules',
          'hrmatrix_ga_room_bookings',
          'hrmatrix_ga_maintenance_tickets',
          'hrmatrix_ga_vendors',
          'hrmatrix_ga_permits',
          'hrmatrix_ga_guests',
          'hrmatrix_ga_mails',
        ];
        gaKeys.forEach((key) => localStorage.removeItem(key));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hrmatrix_ga_update', { detail: { key: 'ALL' } }));
        }
      } catch {
        // ignore storage errors
      }
    }
  }
}

export const db = new HRISDatabase();
