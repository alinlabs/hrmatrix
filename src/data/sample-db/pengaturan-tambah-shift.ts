import { OvertimeConfig } from '../../types';

/**
 * SAMPLE DATABASE: PENGATURAN & ATURAN TAMBAH SHIFT / LEMBUR (MODE DEMO)
 * 
 * Sesuai dengan konfigurasi pada modal pengaturan Lembur & Tambah Shift:
 * 1. Skema Hari Kerja vs Hari Libur (Separate vs Unified)
 * 2. Durasi Minimum & Otomatisasi Presensi
 * 3. Skema Upah Lembur Hari Kerja (Depnaker 1/173, Tiered 1.5x & 2.0x)
 * 4. Skema Upah Lembur Hari Libur / Offday (Flat 2.0x / Tiered Nominal & Pengali)
 */
export const samplePengaturanTambahShift: OvertimeConfig = {
  dayMode: 'separate',
  minimumOvertimeMinutes: 60,
  autoOvertime: true,
  
  // Skema Upah Lembur Hari Kerja (Normal Workday)
  normalWorkday: {
    calculationType: 'multiplier',
    calculationBasis: 'government',
    ratePerHour: 25000,
    baseDivider: 173,
    multiplierFirstHour: 1.5,
    multiplierNextHours: 2.0,
    flatMultiplier: 1.5,
    flatSalaryMultiplier: 1.5,
    staticFirstHourRate: 35000,
    staticNextHoursRate: 45000,
    tieredMultipliers: [1.5, 2.0],
    tieredNominals: [35000, 45000]
  },

  // Skema Upah Lembur Hari Libur / Istirahat Roster (Offday)
  offday: {
    calculationType: 'multiplier',
    calculationBasis: 'government',
    ratePerHour: 50000,
    baseDivider: 173,
    multiplierFirstHour: 2.0,
    multiplierNextHours: 2.0,
    flatMultiplier: 2.0,
    flatSalaryMultiplier: 2.0,
    staticFirstHourRate: 50000,
    staticNextHoursRate: 60000,
    tieredMultipliers: [2.0, 2.0],
    tieredNominals: [50000, 60000]
  },

  updatedAt: "{{ISO_NOW}}"
};

export default samplePengaturanTambahShift;
