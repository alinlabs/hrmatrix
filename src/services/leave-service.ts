import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { Employee, EmployeeLeaveQuota, Leave, LeaveTypePolicy } from '../types';

export const DEFAULT_LEAVE_POLICIES: LeaveTypePolicy[] = [
  {
    id: 'policy_tahunan',
    code: 'TAHUNAN',
    name: 'Cuti Tahunan',
    defaultQuota: 12,
    isPaid: true,
    periodType: '1_year',
    unusedBalanceAction: 'carry_forward',
    isAnnualQuotaDeducted: true,
    genderEligibility: 'All',
    description: 'Hak cuti tahunan wajib minimal 12 hari kerja setelah 12 bulan masa kerja terus-menerus (UU Cipta Kerja).',
  },
  {
    id: 'policy_melahirkan',
    code: 'MELAHIRKAN',
    name: 'Cuti Melahirkan',
    defaultQuota: 90,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    isAnnualQuotaDeducted: false,
    genderEligibility: 'Female',
    description: 'Istirahat melahirkan 1,5 bulan sebelum dan 1,5 bulan sesudah melahirkan (UU Ketenagakerjaan & UU KIA).',
  },
  {
    id: 'policy_menikah',
    code: 'MENIKAH',
    name: 'Cuti Menikah',
    defaultQuota: 3,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    isAnnualQuotaDeducted: false,
    genderEligibility: 'All',
    description: 'Izin meninggalkan pekerjaan karena karyawan melangsungkan pernikahan resmi.',
  },
  {
    id: 'policy_berduka',
    code: 'BERDUKA',
    name: 'Cuti Berduka',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    isAnnualQuotaDeducted: false,
    genderEligibility: 'All',
    description: 'Izin meninggalkan pekerjaan karena keluarga inti meninggal dunia.',
  },
  {
    id: 'policy_khusus',
    code: 'KHUSUS',
    name: 'Cuti Khusus / Penting',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    isAnnualQuotaDeducted: false,
    genderEligibility: 'All',
    description: 'Izin keperluan keluarga mendesak (menikahkan/mengkhitankan/membaptiskan anak, istri melahirkan).',
  },
  {
    id: 'policy_unpaid',
    code: 'UNPAID',
    name: 'Cuti Diluar Tanggungan',
    defaultQuota: 30,
    isPaid: false,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    isAnnualQuotaDeducted: false,
    genderEligibility: 'All',
    description: 'Izin tidak dibayar (unpaid leave) berdasarkan persetujuan khusus manajemen.',
  },
];

export interface EmployeeLeaveSummary {
  employeeId: string;
  employeeName: string;
  departmentId?: string;
  positionId?: string;
  annualQuota: number;
  carryForward: number;
  adjustedQuota: number;
  totalEntitlement: number;
  usedAnnual: number;
  remainingAnnual: number;
  totalUsedAllTypes: number;
  policyUsageMap: Record<string, number>;
  notes?: string;
}

export async function getLeavePolicies(): Promise<LeaveTypePolicy[]> {
  try {
    const row = await db.settings.get('custom_leave_policies');
    const data = (row as any)?.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Ignore DB errors
  }
  return DEFAULT_LEAVE_POLICIES;
}

async function saveLeavePolicies(policies: LeaveTypePolicy[]): Promise<void> {
  await db.settings.put({
    id: 'custom_leave_policies',
    data: policies,
  });
}

export async function addLeavePolicy(
  policy: Omit<LeaveTypePolicy, 'id'> & { id?: string }
): Promise<LeaveTypePolicy[]> {
  const current = await getLeavePolicies();
  const newPolicy: LeaveTypePolicy = {
    ...policy,
    id: policy.id || `policy_${uuidv4().slice(0, 8)}`,
  };
  const next = [...current, newPolicy];
  await saveLeavePolicies(next);
  return next;
}

export async function updateLeavePolicy(
  id: string,
  updates: Partial<LeaveTypePolicy>
): Promise<LeaveTypePolicy[]> {
  const current = await getLeavePolicies();
  const next = current.map((p) => (p.id === id ? { ...p, ...updates, id } : p));
  await saveLeavePolicies(next);
  return next;
}

export async function deleteLeavePolicy(id: string): Promise<LeaveTypePolicy[]> {
  const current = await getLeavePolicies();
  const next = current.filter((p) => p.id !== id);
  await saveLeavePolicies(next);
  return next;
}

export async function addLeave(input: Omit<Leave, 'id'> & { id?: string }): Promise<Leave> {
  const record: Leave = {
    ...input,
    id: input.id || uuidv4(),
    createdAt: input.createdAt || new Date().toISOString(),
  };
  await db.leaves.put(record);
  return record;
}

export async function updateLeave(id: string, updates: Partial<Leave>): Promise<void> {
  await db.leaves.update(id, updates);
}

export async function deleteLeave(id: string): Promise<void> {
  await db.leaves.delete(id);
}

export async function cleanupLegacySickLeaves(): Promise<void> {
  try {
    const allLeaves = await db.leaves.toArray();
    const legacyIds = allLeaves
      .filter((l) => (l.leaveType as string) === 'Sakit')
      .map((l) => l.id);
    if (legacyIds.length > 0) {
      await db.leaves.bulkDelete(legacyIds);
    }
  } catch {
    // Ignore cleanup errors
  }
}

export async function getSavedLeaveQuotas(): Promise<Record<string, EmployeeLeaveQuota>> {
  try {
    const row = await db.settings.get('employee_leave_quotas');
    const data = (row as any)?.data;
    if (Array.isArray(data)) {
      const recordMap: Record<string, EmployeeLeaveQuota> = {};
      data.forEach((q: EmployeeLeaveQuota) => {
        if (q?.id) recordMap[q.id] = q;
      });
      return recordMap;
    }
    if (data && typeof data === 'object') {
      return data as Record<string, EmployeeLeaveQuota>;
    }
  } catch {
    // Ignore
  }
  return {};
}

export async function saveEmployeeLeaveQuotaRecord(
  record: EmployeeLeaveQuota
): Promise<Record<string, EmployeeLeaveQuota>> {
  const current = await getSavedLeaveQuotas();
  const updatedRecord: EmployeeLeaveQuota = {
    ...record,
    id: record.id || `${record.employeeId}_${record.year}`,
    updatedAt: new Date().toISOString(),
  };
  const next: Record<string, EmployeeLeaveQuota> = {
    ...current,
    [updatedRecord.id]: updatedRecord,
  };

  await db.settings.put({
    id: 'employee_leave_quotas',
    data: next,
  });
  return next;
}

export function calculateAllEmployeesLeaveSummary(
  employees: Employee[],
  leaves: Leave[],
  savedQuotas: Record<string, EmployeeLeaveQuota> | EmployeeLeaveQuota[],
  selectedYear: number,
  leavePolicies: LeaveTypePolicy[] = DEFAULT_LEAVE_POLICIES
): EmployeeLeaveSummary[] {
  const annualPolicy =
    leavePolicies.find(
      (p) => p.code?.toUpperCase() === 'TAHUNAN' || p.name.toLowerCase().includes('tahunan')
    ) || DEFAULT_LEAVE_POLICIES[0];
  const baseAnnualQuota = annualPolicy?.defaultQuota ?? 12;

  const quotaArray = Array.isArray(savedQuotas)
    ? savedQuotas
    : Object.values(savedQuotas || {});

  const quotaMap = new Map<string, EmployeeLeaveQuota>();
  quotaArray
    .filter((q) => q && q.year === selectedYear)
    .forEach((q) => quotaMap.set(q.employeeId, q));

  return employees
    .filter((e) => e.status !== 'Terminated')
    .map((emp) => {
      const saved = quotaMap.get(emp.id);
      const annualQuota = saved ? saved.annualQuota : baseAnnualQuota;
      const carryForward = saved ? saved.carryForward : 0;
      const adjustedQuota = saved?.adjustedQuota || 0;
      const totalEntitlement = annualQuota + carryForward + adjustedQuota;

      const empApprovedLeaves = leaves.filter((l) => {
        if (l.employeeId !== emp.id || l.status !== 'Approved') return false;
        const y = parseInt((l.startDate || '').slice(0, 4), 10);
        return y === selectedYear;
      });

      const policyUsageMap: Record<string, number> = {};
      let usedAnnual = 0;
      let totalUsedAllTypes = 0;

      empApprovedLeaves.forEach((l) => {
        const days = Math.max(0, Number(l.duration || 0));
        totalUsedAllTypes += days;
        const typeKey = String(l.leaveType || 'Lainnya');
        policyUsageMap[typeKey] = (policyUsageMap[typeKey] || 0) + days;

        const matchedPolicy = leavePolicies.find(
          (p) =>
            p.name.toLowerCase().includes(typeKey.toLowerCase()) ||
            p.code.toLowerCase() === typeKey.toLowerCase()
        );

        if (
          typeKey.toLowerCase() === 'tahunan' ||
          matchedPolicy?.isAnnualQuotaDeducted
        ) {
          usedAnnual += days;
        }
      });

      return {
        employeeId: emp.id,
        employeeName: emp.fullName,
        departmentId: emp.departmentId,
        positionId: emp.positionId,
        annualQuota,
        carryForward,
        adjustedQuota,
        totalEntitlement,
        usedAnnual,
        remainingAnnual: totalEntitlement - usedAnnual,
        totalUsedAllTypes,
        policyUsageMap,
        notes: saved?.notes,
      };
    });
}
