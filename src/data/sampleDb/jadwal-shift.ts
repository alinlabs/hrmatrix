import { ShiftSchedule } from '../../types';
import { generateDemoExtraShifts, generateDemoShiftSwaps, generateDemoShiftSchedules } from './generator-jadwal-demo';

/**
 * SAMPLE DATABASE: DATA OVERRIDE JADWAL SHIFT EFEKTIF (MODE DEMO)
 * Dihasilkan secara dinamis dari gabungan Extra Shift dan Shift Swap 3 bulan
 */
const defaultExtras = generateDemoExtraShifts();
const defaultSwaps = generateDemoShiftSwaps();

export const sampleShiftSchedules: ShiftSchedule[] = generateDemoShiftSchedules(defaultExtras, defaultSwaps);
export default sampleShiftSchedules;
