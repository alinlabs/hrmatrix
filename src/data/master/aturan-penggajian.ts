import { PayrollRule } from '../../types';
import { masterPajak } from './pajak';
import { masterJaminanSosial } from './jaminan-sosial';
import { masterTunjangan } from './tunjangan';

export const masterTambahanPayrollRules: PayrollRule[] = [
  {
    "id": "rule_lembur",
    "name": "Uang Lembur (Overtime)",
    "category": "Allowance",
    "description": "Kompensasi jam lembur tambahan karyawan berdasarkan standar pemerintah / perusahaan.",
    "ruleType": "Formula",
    "employeeShare": 0,
    "employerShare": 0,
    "effectiveFrom": "2024-01-01",
    "origin": "PP No. 35/2021",
    "status": "Active",
    "version": "2024.1"
  },
  {
    "id": "rule_terlambat",
    "name": "Potongan Denda Terlambat",
    "category": "Deduction",
    "description": "Pemotongan denda atas keterlambatan jam masuk kerja dari data presensi.",
    "ruleType": "Formula",
    "employeeShare": 0,
    "employerShare": 0,
    "effectiveFrom": "2024-01-01",
    "origin": "Peraturan Perusahaan (PP)",
    "status": "Active",
    "version": "2024.1"
  },
  {
    "id": "rule_absensi",
    "name": "Potongan Ketidakhadiran / Alpa",
    "category": "Deduction",
    "description": "Pemotongan upah pro-rata atas hari kerja alpa / tidak hadir tanpa izin.",
    "ruleType": "Formula",
    "employeeShare": 0,
    "employerShare": 0,
    "effectiveFrom": "2024-01-01",
    "origin": "UU Cipta Kerja & PP 35/2021",
    "status": "Active",
    "version": "2024.1"
  }
];

export const DEFAULT_PAYROLL_RULES: PayrollRule[] = [
  ...masterPajak,
  ...masterJaminanSosial,
  ...masterTambahanPayrollRules,
  ...masterTunjangan
];

let isSeeding = false;

export async function ensureDefaultPayrollRules(): Promise<void> {
  if (isSeeding) return;
  try {
    isSeeding = true;
    const { db } = await import('../../db/database');

    // 1. Ambil semua ID yang pernah sengaja dihapus oleh pengguna (Tombstone)
    const deletedRecords = await db.deletedEntityIds
      .where('entityType')
      .equals('payrollRules')
      .toArray();
    const deletedIdSet = new Set(deletedRecords.map(d => d.id));

    // 2. Ambil data yang saat ini sudah ada di IndexedDB
    const existingRecords = await db.payrollRules.toArray();
    const existingIdSet = new Set(existingRecords.map(r => r.id));

    // Force update names of rule_pph21_1 and rule_pph21_pasal17 if they already exist in database
    for (const rule of existingRecords) {
      if (rule.id === 'rule_pph21_1' && rule.name !== 'PPh 21 Tarif Efektif Rata Rata') {
        await db.payrollRules.update('rule_pph21_1', { name: 'PPh 21 Tarif Efektif Rata Rata' });
      } else if (rule.id === 'rule_pph21_pasal17' && rule.name !== 'PPh 21 Tarif Progresif') {
        await db.payrollRules.update('rule_pph21_pasal17', { name: 'PPh 21 Tarif Progresif' });
      }
    }

    // 3. Filter template bawaan dari file .ts:
    // HANYA seed jika: BELUM ada di IndexedDB DAN BELUM PERNAH dihapus pengguna
    const rulesToSeed = DEFAULT_PAYROLL_RULES.filter(defaultRule => 
      !existingIdSet.has(defaultRule.id) && !deletedIdSet.has(defaultRule.id)
    );

    if (rulesToSeed.length > 0) {
      await db.payrollRules.bulkAdd(rulesToSeed);
      console.info(`[Database] Aman diseed: ${rulesToSeed.length} rules.`);
    }

  } catch (error) {
    console.error('Failed to ensure default payroll rules:', error);
  } finally {
    isSeeding = false;
  }
}
