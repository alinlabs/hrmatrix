import { db } from '../db/database';
import { Leave, LeaveCategory, LeaveTypePolicy, EmployeeLeaveQuota, Employee } from '../types';

export const DEFAULT_LEAVE_POLICIES: LeaveTypePolicy[] = [
  {
    id: 'annual',
    code: 'AL',
    name: 'Tahunan',
    defaultQuota: 12,
    isPaid: true,
    periodType: '1_year',
    unusedBalanceAction: 'carry_forward',
    description: 'Hak cuti tahunan resmi 12 hari kerja per tahun bagi karyawan setelah 1 tahun bekerja (UU Ketenagakerjaan).'
  },
  {
    id: 'maternity',
    code: 'ML',
    name: 'Melahirkan',
    defaultQuota: 90,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    genderEligibility: 'Female',
    description: 'Hak cuti bersalin bagi karyawan wanita selama 1.5 bulan sebelum & 1.5 bulan setelah melahirkan (90 hari).'
  },
  {
    id: 'marriage',
    code: 'MR',
    name: 'Menikah',
    defaultQuota: 3,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    description: 'Hak cuti pernikahan karyawan selama 3 hari berturut-turut.'
  },
  {
    id: 'compassionate',
    code: 'CL',
    name: 'Berduka',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    description: 'Hak cuti berduka atas wafatnya anggota keluarga inti (suami/istri, orang tua, mertua, anak).'
  },
  {
    id: 'personal',
    code: 'PL',
    name: 'Khusus',
    defaultQuota: 3,
    isPaid: true,
    periodType: '1_year',
    unusedBalanceAction: 'forfeit',
    description: 'Izin keperluan pribadi mendesak atau keluarga.'
  },
  {
    id: 'unpaid',
    code: 'UL',
    name: 'Diluar Tanggungan',
    defaultQuota: 30,
    isPaid: false,
    periodType: '1_year',
    unusedBalanceAction: 'forfeit',
    description: 'Cuti khusus tanpa menerima upah atas persetujuan manajemen.'
  },
  {
    id: 'other',
    code: 'OT',
    name: 'Lainnya',
    defaultQuota: 0,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    description: 'Jenis cuti atau dispensasi keperluan lainnya.'
  }
];

// ==========================================
// LEAVE POLICY MANAGEMENT SERVICES
// ==========================================

export const getLeavePolicies = async (): Promise<LeaveTypePolicy[]> => {
  try {
    const raw = await db.settings.get('custom_leave_policies' as any);
    if (raw && (raw as any).data && Array.isArray((raw as any).data) && (raw as any).data.length > 0) {
      let policies = ((raw as any).data as LeaveTypePolicy[]);
      
      // Filter out sick leave and hajj (Sakit adalah data ketidakhadiran, bukan cuti)
      policies = policies.filter(
        p => p.id !== 'sick' && p.code !== 'SL' && p.name !== 'Cuti Sakit' && p.name !== 'Sakit' && p.id !== 'hajj' && p.code !== 'HL'
      );
      
      // Rename old leave types to simplified versions
      policies = policies.map(p => {
        const nameMap: Record<string, string> = {
          'Cuti Tahunan': 'Tahunan',
          'Cuti Melahirkan / Bersalin': 'Melahirkan',
          'Cuti Menikah': 'Menikah',
          'Cuti Berduka / Kemalangan': 'Berduka',
          'Izin Khusus / Pribadi': 'Khusus',
          'Cuti di Luar Tanggungan': 'Diluar Tanggungan',
          'Cuti di Luar Tanggungan (Unpaid)': 'Diluar Tanggungan'
        };
        
        if (nameMap[p.name]) {
          return { ...p, name: nameMap[p.name] };
        }
        return p;
      });
      
      return policies;
    }
  } catch (err) {
    console.error('Failed to get custom leave policies:', err);
  }
  return DEFAULT_LEAVE_POLICIES;
};

export const saveLeavePolicies = async (policies: LeaveTypePolicy[]): Promise<void> => {
  await db.settings.put({
    id: 'custom_leave_policies',
    data: policies
  } as any);
};

export const addLeavePolicy = async (policy: Omit<LeaveTypePolicy, 'id'>): Promise<LeaveTypePolicy> => {
  const current = await getLeavePolicies();
  const id = `custom_${crypto.randomUUID()}`;
  const newPolicy: LeaveTypePolicy = {
    ...policy,
    id
  };
  const updated = [...current, newPolicy];
  await saveLeavePolicies(updated);
  return newPolicy;
};

export const updateLeavePolicy = async (id: string, updates: Partial<LeaveTypePolicy>): Promise<void> => {
  const current = await getLeavePolicies();
  const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
  await saveLeavePolicies(updated);
};

export const deleteLeavePolicy = async (id: string): Promise<void> => {
  const current = await getLeavePolicies();
  const updated = current.filter(p => p.id !== id);
  await saveLeavePolicies(updated);
};

// ==========================================
// LEAVE RECORD SERVICES
// ==========================================

export const cleanupLegacySickLeaves = async (): Promise<void> => {
  try {
    const sickLeaves = await db.leaves
      .filter(l => (l.leaveType as any) === 'Sakit' || (l.leaveType as any) === 'Sick Leave' || (l.leaveType as any) === 'Cuti Sakit')
      .toArray();
    if (sickLeaves.length > 0) {
      await db.leaves.bulkDelete(sickLeaves.map(l => l.id));
    }
  } catch (err) {
    console.warn('Failed to cleanup legacy sick leaves:', err);
  }
};

export const getLeaves = async (): Promise<Leave[]> => {
  await cleanupLegacySickLeaves();
  return await db.leaves.toArray();
};

export const getLeavesByEmployeeId = async (employeeId: string): Promise<Leave[]> => {
  return await db.leaves.where('employeeId').equals(employeeId).toArray();
};

export const getLeavesByDateRange = async (startDate: string, endDate: string): Promise<Leave[]> => {
  return await db.leaves
    .filter(leave => leave.startDate <= endDate && leave.endDate >= startDate)
    .toArray();
};

export const addLeave = async (leave: Omit<Leave, 'id'>): Promise<string> => {
  const id = crypto.randomUUID();
  const newLeave = { 
    ...leave, 
    id,
    status: 'Approved', // Semua pengajuan terdaftar langsung berstatus ACC / Approved
    createdAt: new Date().toISOString()
  } as Leave;
  await db.leaves.add(newLeave);
  return id;
};

export const updateLeave = async (id: string, updates: Partial<Leave>): Promise<void> => {
  await db.leaves.update(id, {
    ...updates,
    status: 'Approved' // Tetap Approved
  });
};

export const deleteLeave = async (id: string): Promise<void> => {
  await db.leaves.delete(id);
};

// ==========================================
// LEAVE QUOTA & BALANCE SERVICES
// ==========================================

export interface EmployeeLeaveSummary {
  employeeId: string;
  employeeName: string;
  departmentId?: string;
  positionId?: string;
  year: number;
  annualQuota: number; // Hak Tahunan
  carryForward: number; // Sisa Bawaan Lalu
  adjustedQuota: number; // Penyesuaian / Bonus
  totalEntitlement: number; // annualQuota + carryForward + adjustedQuota
  usedAnnual: number;
  remainingAnnual: number;
  
  // Dynamic breakdown usage map per policy ID / name
  policyUsageMap: Record<string, number>;
  
  usedSick: number;
  usedMaternity: number;
  usedMarriage: number;
  usedCompassionate: number;
  usedOther: number;
  totalUsedAllTypes: number;
  notes?: string;
  updatedAt?: string;
}

export const getSavedLeaveQuotas = async (): Promise<Record<string, EmployeeLeaveQuota>> => {
  try {
    const raw = await db.settings.get('employee_leave_quotas' as any);
    if (raw && (raw as any).data) {
      return (raw as any).data;
    }
  } catch (err) {
    console.error('Failed to get saved leave quotas:', err);
  }
  return {};
};

export const saveEmployeeLeaveQuotaRecord = async (quota: EmployeeLeaveQuota): Promise<void> => {
  const allQuotas = await getSavedLeaveQuotas();
  const key = `${quota.employeeId}_${quota.year}`;
  allQuotas[key] = {
    ...quota,
    id: key,
    updatedAt: new Date().toISOString()
  };

  await db.settings.put({
    id: 'employee_leave_quotas',
    data: allQuotas
  } as any);
};

/**
 * Menghitung rekapitulasi kuota dan saldo cuti seluruh karyawan untuk tahun tertentu
 */
export const calculateAllEmployeesLeaveSummary = (
  employees: Employee[],
  allLeaves: Leave[],
  savedQuotasMap: Record<string, EmployeeLeaveQuota>,
  year: number = new Date().getFullYear(),
  policies: LeaveTypePolicy[] = DEFAULT_LEAVE_POLICIES
): EmployeeLeaveSummary[] => {
  const yearStr = String(year);

  // Filter leaves for this year (since all leaves registered are approved)
  const leavesThisYear = allLeaves.filter(l => {
    return l.startDate.startsWith(yearStr) || l.endDate.startsWith(yearStr);
  });

  return employees.map(emp => {
    const empLeaves = leavesThisYear.filter(l => l.employeeId === emp.id);
    const key = `${emp.id}_${year}`;
    const customQuota = savedQuotasMap[key];

    // Default annual quota = 12 hari (atau sesuai setting)
    const annualQuota = customQuota?.annualQuota !== undefined ? customQuota.annualQuota : 12;
    const carryForward = customQuota?.carryForward || 0;
    const adjustedQuota = customQuota?.adjustedQuota || 0;
    const totalEntitlement = annualQuota + carryForward + adjustedQuota;

    let usedAnnual = 0;
    let usedSick = 0;
    let usedMaternity = 0;
    let usedMarriage = 0;
    let usedCompassionate = 0;
    let usedOther = 0;

    const policyUsageMap: Record<string, number> = {};
    // Initialize 0 for all active policies
    policies.forEach(p => {
      policyUsageMap[p.id] = 0;
      policyUsageMap[p.name] = 0;
    });

    empLeaves.forEach(l => {
      const dur = Number(l.duration) || 1;

      // Track by policy match
      const matchedPolicy = policies.find(p => p.name === l.leaveType || p.id === l.leaveType || p.code === l.leaveType);
      if (matchedPolicy) {
        policyUsageMap[matchedPolicy.id] = (policyUsageMap[matchedPolicy.id] || 0) + dur;
        policyUsageMap[matchedPolicy.name] = (policyUsageMap[matchedPolicy.name] || 0) + dur;
        if (matchedPolicy.isAnnualQuotaDeducted) {
          usedAnnual += dur;
        }
      } else {
        policyUsageMap[l.leaveType] = (policyUsageMap[l.leaveType] || 0) + dur;
      }

      const typeStr = l.leaveType as string;
      if (typeStr === 'Annual Leave' || typeStr === 'Cuti Tahunan' || typeStr === 'Tahunan') {
        if (!matchedPolicy) usedAnnual += dur;
      } else if (typeStr === 'Maternity Leave' || typeStr === 'Cuti Melahirkan / Bersalin' || typeStr === 'Melahirkan') {
        usedMaternity += dur;
      } else if (typeStr === 'Marriage Leave' || typeStr === 'Cuti Menikah' || typeStr === 'Menikah') {
        usedMarriage += dur;
      } else if (typeStr === 'Compassionate Leave' || typeStr === 'Cuti Berduka / Kemalangan' || typeStr === 'Berduka') {
        usedCompassionate += dur;
      } else {
        usedOther += dur;
      }
    });

    const remainingAnnual = Math.max(0, totalEntitlement - usedAnnual);
    const totalUsedAllTypes = empLeaves.reduce((sum, l) => sum + (Number(l.duration) || 1), 0);

    return {
      employeeId: emp.id,
      employeeName: emp.fullName,
      departmentId: emp.departmentId,
      positionId: emp.positionId,
      year,
      annualQuota,
      carryForward,
      adjustedQuota,
      totalEntitlement,
      usedAnnual,
      remainingAnnual,
      policyUsageMap,
      usedSick,
      usedMaternity,
      usedMarriage,
      usedCompassionate,
      usedOther,
      totalUsedAllTypes,
      notes: customQuota?.notes,
      updatedAt: customQuota?.updatedAt
    };
  });
};

