import { Employee } from '../../types';
import { formatDateRange, getEmployeePhotoUrl } from '../payroll/utils-helper';
import { INDO_MONTHS_FULL } from '../../services/kpiService';

export { formatDateRange, getEmployeePhotoUrl, INDO_MONTHS_FULL };

/**
 * Format string tanggal YYYY-MM-DD ke format Indonesia (e.g. 15 Sep 2026)
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return 'Pilih Tanggal';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parts[0];
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d} ${months[m - 1] || ''} ${y}`;
}

/**
 * Format tanggal sekarang / target menjadi format YYYY-MM-DD
 */
export function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Helper generator catatan evaluasi otomatis berdasarkan grade, skor, nama karyawan, dan perusahaan
 */
export function generateAutoEvaluationNote(
  gradeLetter: string, 
  scoreVal: number, 
  empName = 'Karyawan', 
  compName = 'Perusahaan'
): string {
  const gradeUpper = (gradeLetter || '').toUpperCase();

  if (gradeUpper.includes('A')) {
    return `Halo, ${empName}. Selamat dan terima kasih atas dedikasi serta kinerja luar biasa yang Anda tunjukkan selama bekerja di ${compName}. Pada evaluasi KPI periode ini, Anda berhasil meraih skor ${scoreVal} dengan predikat Grade ${gradeLetter}. Pencapaian istimewa ini mencerminkan komitmen tinggi, profesionalisme, serta kontribusi nyata Anda bagi kemajuan tim dan perusahaan. Terus pertahankan standar keunggulan ini dan jadilah inspirasi bagi rekan kerja lainnya.`;
  } else if (gradeUpper.includes('B')) {
    return `Halo, ${empName}. Terima kasih atas kerja keras, loyalitas, dan dedikasi yang konsisten selama bekerja di ${compName}. Pada evaluasi KPI periode ini, Anda memperoleh skor ${scoreVal} dengan predikat Grade ${gradeLetter}. Hasil ini menunjukkan performa yang solid dan memenuhi ekspektasi. Tetap semangat, tingkatkan inisiatif, dan optimalkan potensi yang Anda miliki untuk meraih pencapaian yang lebih gemilang pada periode selanjutnya.`;
  } else if (gradeUpper.includes('C')) {
    return `Halo, ${empName}. Terima kasih atas usaha dan kontribusi Anda selama bekerja di ${compName}. Dari hasil evaluasi KPI periode ini, Anda memperoleh skor ${scoreVal} dengan predikat Grade ${gradeLetter}. Hasil ini menunjukkan kinerja yang cukup, namun masih membutuhkan peningkatan pada beberapa target prioritas. Kami mendorong Anda untuk lebih fokus, meningkatkan kedisiplinan, serta aktif berkoordinasi dengan atasan guna memaksimalkan hasil di periode berikutnya.`;
  } else {
    return `Halo, ${empName}. Terima kasih telah terus berkontribusi dan memberikan usaha terbaik selama bekerja di ${compName}. Namun, terdapat beberapa catatan penting dari hasil evaluasi KPI periode ini, di mana Anda memperoleh skor ${scoreVal} dengan predikat Grade ${gradeLetter}. Hasil ini menunjukkan bahwa masih terdapat ruang yang cukup untuk meningkatkan kinerja. Jadikan evaluasi ini sebagai bahan perbaikan dan motivasi untuk periode berikutnya. Tingkatkan konsistensi, fokus terhadap target, serta maksimalkan tanggung jawab dan potensi yang dimiliki. Kami berharap ke depannya dapat melihat perkembangan dan pencapaian yang lebih baik.`;
  }
}
