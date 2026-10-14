import { EmployeeLeaveQuota } from '../../types';
import { generateDemoSaldoCuti } from './generator-cuti-demo';

/**
 * SAMPLE DATABASE: SALDO AWAL & KUOTA CUTI KARYAWAN (MODE DEMO)
 * Dihasilkan secara dinamis dengan penyesuaian tanggal awal perhitungan (1 Januari tahun periode aktif)
 */
const { list, map } = generateDemoSaldoCuti();

export const sampleSaldoCutiList: EmployeeLeaveQuota[] = list;
export const sampleSaldoCutiMap: Record<string, EmployeeLeaveQuota> = map;

export default {
  list: sampleSaldoCutiList,
  map: sampleSaldoCutiMap,
};
