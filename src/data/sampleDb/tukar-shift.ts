import { ShiftSwap } from '../../types';
import { generateDemoShiftSwaps } from './generator-jadwal-demo';

/**
 * SAMPLE DATABASE: DATA PERTUKARAN / PERGANTIAN SHIFT (MODE DEMO)
 * Dihasilkan secara dinamis menggunakan sistem 3 bulan (1 bulan lalu, bulan ini, 1 bulan mendatang)
 */
export const sampleShiftSwaps: ShiftSwap[] = generateDemoShiftSwaps();
export default sampleShiftSwaps;
