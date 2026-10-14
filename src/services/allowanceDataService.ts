import { PayrollRule } from '../types';
import { db } from '../db/database';
import { masterTunjangan, ensureDefaultPayrollRules } from '../data/master';

/**
 * Service untuk memuat (fetch) dan mengelola data master tunjangan
 * secara dinamis dari IndexedDB (dengan fallback ke masterTunjangan).
 */

export async function fetchAllowanceRulesFromJson(): Promise<PayrollRule[]> {
  try {
    await ensureDefaultPayrollRules();
    const dbAllowances = await db.payrollRules.where('category').equals('Allowance').toArray();
    if (dbAllowances.length > 0) {
      return dbAllowances;
    }
  } catch (err) {
    console.warn(`Gagal memuat tunjangan dari IndexedDB:`, err);
  }
  return masterTunjangan;
}

export async function syncAllowancesFromJsonToDb(forceOverride = false): Promise<PayrollRule[]> {
  // Not heavily used now that we have robust seeding, but keeping signature for compatibility
  await ensureDefaultPayrollRules();
  return await db.payrollRules.where('category').equals('Allowance').toArray();
}

/**
 * Mendownload seluruh daftar tunjangan aktif dalam format file JSON
 */
export function downloadAllowancesAsJson(rules: PayrollRule[], filename = 'tunjangan.json') {
  const jsonStr = JSON.stringify(rules, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
