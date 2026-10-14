import { Leave } from '../../types';
import { generateDemoLeaves } from './generator-cuti-demo';

/**
 * SAMPLE DATABASE: DATA PENGAJUAN CUTI & IZIN (MODE DEMO)
 * Dihasilkan secara dinamis menggunakan sistem 3 bulan (1 bulan lalu, bulan ini, 1 bulan mendatang)
 */
export const sampleLeaves: Leave[] = generateDemoLeaves();
export default sampleLeaves;
