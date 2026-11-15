import { masterTunjangan } from '../data/master';

export type AllowanceCategory = 'Tunjangan Tetap' | 'Tunjangan Tidak Tetap' | 'Bonus & Insentif';

/**
 * Validasi dan klasifikasikan kategori tunjangan karyawan:
 * - "Tunjangan Tetap"
 * - "Tunjangan Tidak Tetap"
 * - "Bonus & Insentif"
 * 
 * Aturan Ketat (Sesuai SE Menaker No. 07/1990 & UU Ketenagakerjaan):
 * 1. Bonus & Insentif:
 *    - Insentif Kinerja & KPI, Bonus Tahunan, Tantiem, THR Keagamaan, Komisi Penjualan, Bonus Proyek, Tunjangan Cuti.
 * 2. Tunjangan Tidak Tetap (Variabel / Operasional / Kehadiran / Komunikasi):
 *    - Uang Transport / Transportasi Harian, Uang Makan / Makan Siang Harian, Tunjangan Kehadiran / Shift Malam,
 *      Tunjangan Komunikasi & Pulsa, Uang Bensin/BBM, Uang Lembur, Tunjangan Operasional Lapangan.
 * 3. Tunjangan Tetap:
 *    - Tunjangan Jabatan, Tunjangan Keahlian / Sertifikasi Profesi, Tunjangan Perumahan / Fasilitas Hunian,
 *      Tunjangan Kendaraan Dinas / Car Allowance, Tunjangan Keluarga (Istri/Anak), Tunjangan Masa Kerja,
 *      Tunjangan Kemahalan Daerah / Remote Area, Tunjangan Bahasa Asing.
 */
export function getAllowanceCategory(
  allowance: { name?: string; ruleId?: string; category?: string; kategori?: string; subCategory?: string; [key: string]: any } | string,
  ruleData?: any
): AllowanceCategory {
  const allowanceName = typeof allowance === 'string' ? allowance : allowance?.name || '';
  if (!allowanceName || allowanceName.trim() === '') {
    return 'Tunjangan Tetap';
  }

  const nameLower = allowanceName.toLowerCase().trim();

  // 1. Prioritas Utama: Evaluasi Kata Kunci Nama Tunjangan (Sesuai klasifikasi form section Gaji & Tunjangan)
  // a. Bonus & Insentif
  if (
    nameLower.includes('bonus') ||
    nameLower.includes('insentif') ||
    nameLower.includes('incentive') ||
    nameLower.includes('kpi') ||
    nameLower.includes('kinerja') ||
    nameLower.includes('komisi') ||
    nameLower.includes('thr') ||
    nameLower.includes('hari raya') ||
    nameLower.includes('tahunan') ||
    nameLower.includes('prestasi') ||
    nameLower.includes('tantiem') ||
    nameLower.includes('cuti')
  ) {
    return 'Bonus & Insentif';
  }

  // b. Tunjangan Tidak Tetap (Operasional, Komunikasi/Pulsa, Transport, Makan, Kehadiran, Shift, Lembur, Harian)
  if (
    nameLower.includes('tidak tetap') ||
    nameLower.includes('variable') ||
    nameLower.includes('flexible') ||
    nameLower.includes('makan') ||
    nameLower.includes('transport') ||
    nameLower.includes('kehadiran') ||
    nameLower.includes('bbm') ||
    nameLower.includes('lembur') ||
    nameLower.includes('shift') ||
    nameLower.includes('pulsa') ||
    nameLower.includes('operasional') ||
    nameLower.includes('harian') ||
    nameLower.includes('komunikasi')
  ) {
    return 'Tunjangan Tidak Tetap';
  }

  // c. Tunjangan Tetap (Jabatan, Keahlian, Keluarga, Perumahan, Kendaraan Dinas, Masa Kerja, Kemahalan)
  if (
    nameLower.includes('jabatan') ||
    nameLower.includes('keahlian') ||
    nameLower.includes('profesi') ||
    nameLower.includes('keluarga') ||
    nameLower.includes('istri') ||
    nameLower.includes('anak') ||
    nameLower.includes('perumahan') ||
    nameLower.includes('hunian') ||
    nameLower.includes('kendaraan') ||
    nameLower.includes('car allowance') ||
    nameLower.includes('kemahalan') ||
    nameLower.includes('masa kerja') ||
    nameLower.includes('retensi') ||
    nameLower.includes('bahasa')
  ) {
    return 'Tunjangan Tetap';
  }

  // 2. Cek kategori dari objek atau ruleData jika nama belum ter-cover di atas
  const explicitCategory = typeof allowance === 'object' && allowance !== null 
    ? (allowance.category || allowance.kategori || allowance.subCategory) 
    : undefined;

  const ruleId = typeof allowance === 'object' && allowance !== null ? allowance.ruleId : undefined;
  const matchedRule = ruleData || masterTunjangan.find(
    m => (ruleId && m.id === ruleId) || (m.name || m.nama || '').toLowerCase() === nameLower
  );

  const rawCat = explicitCategory || matchedRule?.kategori || matchedRule?.category || matchedRule?.subCategory;
  if (rawCat) {
    const rawLower = String(rawCat).toLowerCase().trim();
    if (rawLower.includes('bonus') || rawLower.includes('insentif') || rawLower.includes('incentive') || rawLower === 'annual' || rawLower.includes('tahunan')) {
      return 'Bonus & Insentif';
    }
    // PERHATIKAN: Cek 'tidak tetap' terlebih dahulu sebelum 'tetap' agar tidak terjadi false positive substring!
    if (rawLower.includes('tidak tetap') || rawLower.includes('variable') || rawLower.includes('flexible') || rawLower.includes('harian')) {
      return 'Tunjangan Tidak Tetap';
    }
    if (rawLower === 'tunjangan tetap' || (rawLower.includes('tetap') && !rawLower.includes('tidak tetap')) || rawLower.includes('fixed') || matchedRule?.allowanceType === 'fixed') {
      return 'Tunjangan Tetap';
    }
  }

  if (nameLower.includes('tetap') && !nameLower.includes('tidak tetap')) {
    return 'Tunjangan Tetap';
  }

  if (matchedRule?.isBpjsBase) {
    return 'Tunjangan Tetap';
  }

  return 'Tunjangan Tetap';
}

/**
 * Memastikan apakah suatu tunjangan terverifikasi valid sebagai "Tunjangan Tetap".
 * Mengembalikan false jika tergolong "Tunjangan Tidak Tetap" atau "Bonus & Insentif".
 */
export function isFixedAllowance(
  allowance: { name?: string; ruleId?: string; category?: string; [key: string]: any } | string,
  ruleData?: any
): boolean {
  return getAllowanceCategory(allowance, ruleData) === 'Tunjangan Tetap';
}
