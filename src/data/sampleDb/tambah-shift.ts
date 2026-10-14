import { ExtraShift } from '../../types';
import { generateDemoExtraShifts } from './generator-jadwal-demo';

/**
 * SAMPLE DATABASE: DATA TABEL TAMBAH SHIFT & LEMBUR (MODE DEMO)
 * Dihasilkan secara dinamis menggunakan sistem 3 bulan (1 bulan lalu, bulan ini, 1 bulan mendatang)
 */
export const sampleExtraShifts: ExtraShift[] = generateDemoExtraShifts();
export default sampleExtraShifts;
