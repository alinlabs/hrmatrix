export type AllowanceCategoryLabel =
  | 'Tunjangan Tetap'
  | 'Tunjangan Tidak Tetap'
  | 'Bonus & Insentif';

const VARIABLE_KEYWORDS = [
  'makan',
  'meal',
  'transport',
  'transportasi',
  'bensin',
  'bbm',
  'parkir',
  'tol',
  'kehadiran',
  'absensi',
  'presensi',
  'shift',
  'lembur',
  'overtime',
  'perjalanan',
  'dinas',
  'pulsa',
  'kuota',
  'komunikasi',
  'operasional',
  'tidak tetap',
  'variabel',
];

const BONUS_KEYWORDS = [
  'bonus',
  'insentif',
  'incentive',
  'komisi',
  'commission',
  'thr',
  'keagamaan',
  'apresiasi',
  'reward',
  'kinerja',
  'kpi',
  'prestasi',
  'pengabdian',
  'tahun',
  'projek',
  'proyek',
  'project',
];

const FIXED_KEYWORDS = [
  'jabatan',
  'keahlian',
  'sertifikasi',
  'kompetensi',
  'struktural',
  'fungsional',
  'keluarga',
  'istri',
  'anak',
  'perumahan',
  'kesehatan tetap',
  'tetap',
  'fixed',
];

export function getAllowanceCategory(
  itemOrName:
    | string
    | {
        name?: string;
        nama?: string;
        ruleId?: string;
        category?: string;
        kategori?: string;
        allowanceGroup?: string;
        subCategory?: string;
        frekuensi_pembayaran?: string;
      },
  ruleData?: any
): AllowanceCategoryLabel {
  const source = typeof itemOrName === 'string' ? { name: itemOrName } : itemOrName || {};
  const merged = ruleData ? { ...source, ...ruleData } : source;

  const explicitKategori = String(merged.kategori || '').toLowerCase();
  if (explicitKategori.includes('bonus') || explicitKategori.includes('insentif')) {
    return 'Bonus & Insentif';
  }
  if (explicitKategori.includes('tidak tetap')) {
    return 'Tunjangan Tidak Tetap';
  }
  if (explicitKategori.includes('tetap')) {
    return 'Tunjangan Tetap';
  }

  const subCat = String(merged.subCategory || '').toLowerCase();
  if (subCat === 'fixed_allowance') return 'Tunjangan Tetap';
  if (subCat === 'variable_allowance') return 'Tunjangan Tidak Tetap';
  if (subCat === 'bonus_appreciation' || subCat === 'religious_allowance') {
    return 'Bonus & Insentif';
  }

  const group = String(merged.allowanceGroup || '').toLowerCase();
  if (group === 'bonus' || group === 'insentif') {
    return 'Bonus & Insentif';
  }

  const rawName = String(
    merged.name || merged.nama || (typeof itemOrName === 'string' ? itemOrName : '')
  ).toLowerCase();

  if (BONUS_KEYWORDS.some((kw) => rawName.includes(kw))) {
    return 'Bonus & Insentif';
  }
  if (VARIABLE_KEYWORDS.some((kw) => rawName.includes(kw))) {
    return 'Tunjangan Tidak Tetap';
  }
  if (FIXED_KEYWORDS.some((kw) => rawName.includes(kw))) {
    return 'Tunjangan Tetap';
  }

  const freq = String(merged.frekuensi_pembayaran || merged.paymentPeriod || '').toLowerCase();
  if (freq.includes('tahunan') || freq.includes('annual') || freq.includes('insidental')) {
    return 'Bonus & Insentif';
  }

  return 'Tunjangan Tetap';
}

export function isFixedAllowance(
  itemOrName:
    | string
    | {
        name?: string;
        nama?: string;
        ruleId?: string;
        category?: string;
        kategori?: string;
        allowanceGroup?: string;
        subCategory?: string;
        frekuensi_pembayaran?: string;
      },
  ruleData?: any
): boolean {
  return getAllowanceCategory(itemOrName, ruleData) === 'Tunjangan Tetap';
}
