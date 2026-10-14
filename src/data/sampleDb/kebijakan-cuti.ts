import { LeaveTypePolicy } from '../../types';

/**
 * SAMPLE DATABASE: KEBIJAKAN & MASTER JENIS CUTI PERUSAHAAN
 * 
 * Standar kebijakan cuti sesuai UU Ketenagakerjaan No. 13/2003 & Peraturan Perusahaan:
 * - Cuti Tahunan (12 hari/tahun, hak bawaan tahun lalu / carry-forward)
 * - Cuti Melahirkan / Bersalin (90 hari, khusus wanita)
 * - Cuti Menikah Karyawan (3 hari berbayar)
 * - Cuti Menikahkan Anak (2 hari berbayar)
 * - Cuti Istri Melahirkan / Keguguran (2 hari berbayar untuk suami)
 * - Cuti Berduka / Kemalangan Keluarga Inti (2 hari berbayar)
 * - Cuti Khusus / Izin Keperluan Mendesak (3 hari/tahun)
 * - Cuti Khitanan / Pembaptisan Anak (2 hari berbayar)
 * - Cuti Ibadah Keagamaan / Haji / Umroh (40 hari berbayar satu kali selama masa kerja)
 * - Cuti di Luar Tanggungan / Unpaid Leave (Maks 30 hari tanpa upah)
 * - Cuti Lainnya / Dispensasi Resmi Perusahaan
 */
export const sampleKebijakanCuti: LeaveTypePolicy[] = [
  {
    id: 'annual',
    code: 'AL',
    name: 'Tahunan',
    defaultQuota: 12,
    isPaid: true,
    periodType: '1_year',
    unusedBalanceAction: 'carry_forward',
    maxConsecutiveDays: 12,
    genderEligibility: 'All',
    description: 'Hak cuti tahunan resmi 12 hari kerja per tahun bagi karyawan setelah 1 tahun bekerja (UU Ketenagakerjaan). Sisa cuti dapat dibawa ke tahun berikutnya (carry forward).'
  },
  {
    id: 'maternity',
    code: 'ML',
    name: 'Melahirkan',
    defaultQuota: 90,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 90,
    genderEligibility: 'Female',
    description: 'Hak cuti bersalin bagi karyawan wanita selama 1.5 bulan sebelum & 1.5 bulan setelah melahirkan (total 90 hari kalender).'
  },
  {
    id: 'paternity',
    code: 'PL-M',
    name: 'Istri Melahirkan',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 2,
    genderEligibility: 'Male',
    description: 'Hak cuti pendampingan persalinan atau keguguran kandungan istri bagi karyawan pria (2 hari kerja).'
  },
  {
    id: 'marriage',
    code: 'MR',
    name: 'Menikah',
    defaultQuota: 3,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 3,
    genderEligibility: 'All',
    description: 'Hak cuti pernikahan resmi bagi karyawan yang melangsungkan perkawinan (3 hari kerja berbayar).'
  },
  {
    id: 'child_marriage',
    code: 'MR-C',
    name: 'Menikahkan Anak',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 2,
    genderEligibility: 'All',
    description: 'Hak cuti bagi orang tua dalam rangka acara pernikahan anak kandung (2 hari kerja berbayar).'
  },
  {
    id: 'compassionate',
    code: 'CL',
    name: 'Berduka',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 2,
    genderEligibility: 'All',
    description: 'Hak cuti berduka atas wafatnya anggota keluarga inti (suami/istri, orang tua, mertua, anak, atau menantu).'
  },
  {
    id: 'child_circumcision',
    code: 'CC',
    name: 'Khitanan / Baptis Anak',
    defaultQuota: 2,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 2,
    genderEligibility: 'All',
    description: 'Hak cuti untuk perayaan khitanan atau pembaptisan anak kandung (2 hari kerja berbayar).'
  },
  {
    id: 'hajj_umrah',
    code: 'HL',
    name: 'Ibadah Haji / Umroh',
    defaultQuota: 40,
    isPaid: true,
    periodType: 'entire_tenure',
    unusedBalanceAction: 'none',
    maxConsecutiveDays: 40,
    genderEligibility: 'All',
    description: 'Cuti ibadah keagamaan wajib pertama kali yang diselenggarakan pemerintah / badan resmi (maksimal 40 hari).'
  },
  {
    id: 'personal',
    code: 'PL',
    name: 'Khusus',
    defaultQuota: 3,
    isPaid: true,
    periodType: '1_year',
    unusedBalanceAction: 'forfeit',
    maxConsecutiveDays: 2,
    genderEligibility: 'All',
    description: 'Izin keperluan pribadi mendesak atau kepentingan keluarga darurat atas persetujuan atasan langsung.'
  },
  {
    id: 'unpaid',
    code: 'UL',
    name: 'Diluar Tanggungan',
    defaultQuota: 30,
    isPaid: false,
    periodType: '1_year',
    unusedBalanceAction: 'forfeit',
    maxConsecutiveDays: 30,
    genderEligibility: 'All',
    description: 'Cuti istirahat panjang tanpa menerima upah (unpaid leave) atas persetujuan manajemen dan direksi.'
  },
  {
    id: 'other',
    code: 'OT',
    name: 'Lainnya',
    defaultQuota: 0,
    isPaid: true,
    periodType: 'conditional',
    unusedBalanceAction: 'none',
    genderEligibility: 'All',
    description: 'Jenis dispensasi resmi lainnya (tugas negara, donor darah, ujian pendidikan lanjutan, dll).'
  }
];

export default sampleKebijakanCuti;
