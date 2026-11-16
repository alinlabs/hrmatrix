import { PayrollRule } from '../../types';
import { masterJaminanSosial } from '../master/jaminan-sosial';

/**
 * SAMPLE DATABASE: PRESET & MASTER JAMINAN SOSIAL & KESEHATAN (BPJS)
 * 
 * Mencakup seluruh preset perlindungan ketenagakerjaan dan kesehatan sesuai regulasi Indonesia:
 * - BPJS Kesehatan (PPU Badan Usaha 4% Perusahaan + 1% Pekerja, Batas Upah Maks Rp 12.000.000)
 * - BPJS Ketenagakerjaan JHT (Jaminan Hari Tua - 3.7% Perusahaan + 2.0% Pekerja)
 * - BPJS Ketenagakerjaan JP (Jaminan Pensiun - 2.0% Perusahaan + 1.0% Pekerja, Batas Upah Maks Regulasi)
 * - BPJS Ketenagakerjaan JKK (Jaminan Kecelakaan Kerja - 5 Tingkat Risiko: 0.24%, 0.54%, 0.89%, 1.27%, 1.74%)
 * - BPJS Ketenagakerjaan JKM (Jaminan Kematian - 0.30% Perusahaan)
 * - BPJS Ketenagakerjaan JKP (Jaminan Kehilangan Pekerjaan - 0.46%)
 */
export const sampleKompensasiJaminan: PayrollRule[] = [...masterJaminanSosial];

export default sampleKompensasiJaminan;
