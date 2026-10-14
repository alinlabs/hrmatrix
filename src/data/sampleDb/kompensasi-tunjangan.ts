import { PayrollRule } from '../../types';
import { masterTunjangan } from '../master/tunjangan';

/**
 * SAMPLE DATABASE: PRESET & MASTER TUNJANGAN KOMPENSASI KARYAWAN
 * 
 * Mencakup seluruh preset tunjangan tetap & tidak tetap/variabel:
 * - Tunjangan Jabatan Struktural & Fungsional (Berjenjang Level Posisi)
 * - Tunjangan Transportasi & Uang Bensin
 * - Tunjangan Uang Makan Harian / Kehadiran
 * - Tunjangan Komunikasi & Kuota Internet
 * - Tunjangan Kinerja / Prestasi Kerja
 * - Tunjangan Tempat Tinggal / Fasilitas Perumahan
 * - Tunjangan Keluarga (Pasangan & Anak)
 * - Tunjangan Masa Kerja & Loyalitas
 * - Tunjangan Hari Raya (THR Keagamaan)
 * - Tunjangan Sertifikasi / Kompetensi Khusus
 */
export const sampleKompensasiTunjangan: PayrollRule[] = [...masterTunjangan];

export default sampleKompensasiTunjangan;
