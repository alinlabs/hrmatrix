import { Attendance } from '../../types';
import { generateDemoAttendance } from './generator-presensi-demo';

/**
 * DAFTAR PRESENSI & LOG RIWAYAT KEHADIRAN SAMPEL DINAMIS (AUTO GENERASI DEMO)
 * 
 * Secara otomatis dihasilkan berbasis bulan pendaftaran (1 bulan lalu, bulan ini, 1 bulan mendatang).
 * Mencakup seluruh 50 karyawan dengan variasi status presensi:
 * - Present (Tepat waktu)
 * - Late (Terlambat sesuai toleransi regulasi 15 menit)
 * - Sick (Sakit dengan SKD)
 * - Leave (Cuti tahunan)
 * - Absent (Izin dan Alpa/Mangkir)
 * - WFH (Work From Home)
 * - Overtime (Lembur terverifikasi)
 */
export const sampleAttendanceRecords: Attendance[] = generateDemoAttendance(new Date());

export default sampleAttendanceRecords;
