import { PayrollRule } from '../../types';
import { masterTunjangan, masterJaminanSosial } from '../../data/master';

export interface TunjanganItem {
  id: string;
  nama: string;
  kategori: string;
  deskripsi?: string;
  nominalFormula?: string;
}

export interface BpjsItem {
  id: string;
  nama: string;
  program: string;
  deskripsi?: string;
  nominalFormula?: string;
}

/**
 * Helper to format nominal amount or percentage for any PayrollRule / Tunjangan item
 */
export function formatNominalOrPercentage(rule: any): string {
  if (!rule) return '-';

  const metode = rule.metode_perhitungan || rule.ruleType || rule.calculationModel;
  const nilai = rule.nilai ?? rule.fixedAmount ?? rule.employeeShare ?? null;
  const unit = rule.satuan_nilai;

  // 1. Tunjangan Berjenjang (Jabatan / Masa Kerja / Level)
  if (
    metode === 'berjenjang' ||
    rule.ruleType === 'Tiered' ||
    rule.jenis_jenjang === 'custom_level' ||
    (rule.daftarJenjang && rule.daftarJenjang.length > 0) ||
    (rule.aturan && rule.aturan.length > 0)
  ) {
    const jenjangList = rule.daftarJenjang || rule.aturan || [];
    if (jenjangList.length > 0) {
      const nominals = jenjangList
        .map((j: any) => (typeof j.nominal === 'number' ? j.nominal : typeof j.nilai === 'number' ? j.nilai : null))
        .filter((n: any) => n !== null && n > 0);
      if (nominals.length > 0) {
        const minNominal = Math.min(...nominals);
        const maxNominal = Math.max(...nominals);
        return `Berjenjang (Rp ${minNominal.toLocaleString('id-ID')} - Rp ${maxNominal.toLocaleString('id-ID')})`;
      }
    }
    return 'Berjenjang Sesuai Level Jabatan';
  }

  // 2. Tipe Persentase (e.g. 10% dari Gaji Pokok)
  if (
    metode === 'persentase' ||
    rule.ruleType === 'Percentage' ||
    rule.calculationModel === 'percentage' ||
    unit === 'persen' ||
    rule.dasar_perhitungan === 'Gaji Pokok' ||
    rule.dasar_perhitungan === 'gaji_pokok'
  ) {
    const percentVal = typeof nilai === 'number' && nilai > 0 ? nilai : (rule.employeeShare || rule.prorataBasePercent || 0);
    const dasar = rule.dasar_perhitungan && rule.dasar_perhitungan !== 'Nominal' ? rule.dasar_perhitungan : 'Gaji Pokok';
    if (percentVal > 0) {
      return `${percentVal}% dari ${dasar}`;
    }
    return `% dari ${dasar}`;
  }

  // 3. Tipe Harian / Unit (e.g. Rp 50.000 / Hari Hadir)
  if (metode === 'harian' || unit === 'per_hari' || rule.calculationModel === 'unit_based') {
    if (typeof nilai === 'number' && nilai > 0) {
      return `Rp ${nilai.toLocaleString('id-ID')} / Hari Hadir`;
    }
  }

  // 4. Tipe Nominal Tetap (Fixed) (e.g. Rp 750.000 / Bulan)
  if (typeof nilai === 'number' && nilai > 0) {
    const frek = rule.frekuensi_pembayaran ? (rule.frekuensi_pembayaran === 'bulanan' ? ' / Bulan' : ` / ${rule.frekuensi_pembayaran}`) : ' / Bulan';
    return `Rp ${nilai.toLocaleString('id-ID')}${frek}`;
  }

  if (rule.fixedAmount && rule.fixedAmount > 0) {
    return `Rp ${rule.fixedAmount.toLocaleString('id-ID')} / Bulan`;
  }

  // Fallback to description or dasar_perhitungan
  if (rule.dasar_perhitungan && rule.dasar_perhitungan !== 'Nominal') {
    return rule.dasar_perhitungan;
  }

  if (rule.description || rule.deskripsi) {
    return rule.description || rule.deskripsi;
  }

  return 'Nominal Sesuai Ketentuan';
}

export function mapPayrollRuleToTunjanganItem(r: any): TunjanganItem {
  let cat = r.kategori || r.subCategory || '';
  if (
    r.allowanceGroup === 'insentif' ||
    cat === 'incentive' ||
    cat.toLowerCase().includes('bonus') ||
    cat.toLowerCase().includes('insentif') ||
    (r.name && (r.name.toLowerCase().includes('insentif') || r.name.toLowerCase().includes('bonus') || r.name.toLowerCase().includes('kpi'))) ||
    (r.nama && (r.nama.toLowerCase().includes('insentif') || r.nama.toLowerCase().includes('bonus') || r.nama.toLowerCase().includes('kpi')))
  ) {
    cat = 'Bonus & Insentif';
  } else if (
    cat === 'variable_allowance' ||
    cat.toLowerCase().includes('tidak tetap') ||
    r.allowanceType === 'variable'
  ) {
    cat = 'Tunjangan Tidak Tetap';
  } else {
    cat = 'Tunjangan Tetap';
  }

  return {
    id: r.id,
    nama: r.name || r.nama || '',
    kategori: cat,
    deskripsi: r.description,
    nominalFormula: formatNominalOrPercentage(r)
  };
}

export function mapPayrollRuleToBpjsItem(r: any): BpjsItem {
  let prog = 'BPJS Kesehatan';
  const nameStr = (r.name || r.nama || r.id || '').toLowerCase();
  const catStr = (r.category || r.kategori || '').toLowerCase();

  if (
    r.category === 'BPJS Employment' ||
    catStr.includes('ketenagakerjaan') ||
    nameStr.includes('ketenagakerjaan') ||
    nameStr.includes('jht') ||
    nameStr.includes('jp_') ||
    nameStr.includes('jkk') ||
    nameStr.includes('jkm') ||
    nameStr.includes('jkp') ||
    r.id?.includes('jht') ||
    r.id?.includes('jkk') ||
    r.id?.includes('jkm') ||
    r.id?.includes('jkp') ||
    r.id?.includes('jp_')
  ) {
    prog = 'BPJS Ketenagakerjaan';
  } else if (
    r.category === 'BPJS Health' ||
    catStr.includes('kesehatan') ||
    nameStr.includes('kesehatan') ||
    r.id?.includes('kes')
  ) {
    prog = 'BPJS Kesehatan';
  }

  let nominalFormula = r.description || 'Sesuai Ketentuan BPJS Resmi';
  if (r.employeeShare || r.employerShare) {
    const parts = [];
    if (r.employeeShare) parts.push(`Pekerja ${r.employeeShare}%`);
    if (r.employerShare) parts.push(`Perusahaan ${r.employerShare}%`);
    nominalFormula = parts.join(' + ');
  }
  return {
    id: r.id,
    nama: r.name || r.nama || '',
    program: prog,
    deskripsi: r.description,
    nominalFormula: nominalFormula
  };
}

export const MASTER_BPJS_LIST: BpjsItem[] = masterJaminanSosial.map(bpjs => mapPayrollRuleToBpjsItem(bpjs));

export const MASTER_TUNJANGAN_LIST: TunjanganItem[] = masterTunjangan.map(t => mapPayrollRuleToTunjanganItem(t));

/**
 * Normalizer & Sync Helper Utilities for Compensation Data (Tunjangan, BPJS, Pajak)
 */

// Tunjangan Alias Mapping Table
const TUNJANGAN_ALIAS_MAP: Record<string, string> = {
  // Tunjangan Jabatan
  'tunjangan_jabatan': 'tunjangan-jabatan',
  'tunjangan-jabatan': 'tunjangan-jabatan',
  'jabatan': 'tunjangan-jabatan',

  // Tunjangan Keahlian
  'tunjangan_keahlian': 'tunjangan-keahlian',
  'tunjangan-keahlian': 'tunjangan-keahlian',
  'keahlian': 'tunjangan-keahlian',

  // Tunjangan Sertifikasi K3
  'tunjangan_sertifikasi_k3': 'tunjangan-sertifikasi-k3',
  'tunjangan-sertifikasi-k3': 'tunjangan-sertifikasi-k3',
  'sertifikasi_k3': 'tunjangan-sertifikasi-k3',

  // Tunjangan SIO
  'tunjangan_sio_alat_berat': 'tunjangan-sio-alat-berat',
  'tunjangan-sio-alat-berat': 'tunjangan-sio-alat-berat',
  'sio_alat_berat': 'tunjangan-sio-alat-berat',

  // Tunjangan Lead Auditor
  'tunjangan_lead_auditor_iso': 'tunjangan-lead-auditor-iso',
  'tunjangan-lead-auditor-iso': 'tunjangan-lead-auditor-iso',

  // Tunjangan Komunikasi
  'tunjangan_komunikasi': 'tunjangan-komunikasi',
  'tunjangan-komunikasi': 'tunjangan-komunikasi',
  'komunikasi': 'tunjangan-komunikasi',

  // Tunjangan Kendaraan
  'tunjangan_kendaraan': 'tunjangan-kendaraan-manajerial',
  'tunjangan_kendaraan_manajerial': 'tunjangan-kendaraan-manajerial',
  'tunjangan-kendaraan-manajerial': 'tunjangan-kendaraan-manajerial',

  // Tunjangan Transportasi & Operasional
  'tunjangan_transportasi': 'tunjangan-operasional',
  'tunjangan_operasional': 'tunjangan-operasional',
  'tunjangan-operasional': 'tunjangan-operasional',
  'transportasi': 'tunjangan-operasional',
  'operasional': 'tunjangan-operasional',

  // Tunjangan Mobilitas
  'tunjangan_mobilitas_lapangan': 'tunjangan-mobilitas-lapangan',
  'tunjangan-mobilitas-lapangan': 'tunjangan-mobilitas-lapangan',

  // Tunjangan Makan
  'tunjangan_makan': 'tunjangan-makan',
  'tunjangan-makan': 'tunjangan-makan',
  'makan': 'tunjangan-makan',

  // Tunjangan Extra Fooding
  'tunjangan_extra_fooding': 'tunjangan-extra-fooding',
  'tunjangan-extra-fooding': 'tunjangan-extra-fooding',

  // Tunjangan Shift Malam
  'tunjangan_shift_malam': 'tunjangan-shift-malam-pabrik',
  'tunjangan_shift_malam_pabrik': 'tunjangan-shift-malam-pabrik',
  'tunjangan-shift-malam-pabrik': 'tunjangan-shift-malam-pabrik',

  // Tunjangan Bahaya & K3
  'tunjangan_bahaya': 'tunjangan-bahaya-resiko-k3',
  'tunjangan_resiko': 'tunjangan-bahaya-resiko-k3',
  'tunjangan_bahaya_resiko_k3': 'tunjangan-bahaya-resiko-k3',
  'tunjangan-bahaya-resiko-k3': 'tunjangan-bahaya-resiko-k3',

  // Tunjangan Site
  'tunjangan_penempatan_site': 'tunjangan-penempatan-site',
  'tunjangan_site': 'tunjangan-penempatan-site',
  'tunjangan-penempatan-site': 'tunjangan-penempatan-site',

  // Tunjangan Mess
  'tunjangan_tempat_tinggal_mess': 'tunjangan-tempat-tinggal-mess',
  'tunjangan_mess': 'tunjangan-tempat-tinggal-mess',
  'tunjangan_perumahan': 'tunjangan-tempat-tinggal-mess',
  'tunjangan-tempat-tinggal-mess': 'tunjangan-tempat-tinggal-mess',

  // Tunjangan Keluarga
  'tunjangan_keluarga': 'tunjangan-keluarga',
  'tunjangan-keluarga': 'tunjangan-keluarga',

  // Insentif Kehadiran
  'tunjangan_kehadiran': 'insentif-kehadiran-kedisiplinan',
  'insentif_kehadiran': 'insentif-kehadiran-kedisiplinan',
  'insentif-kehadiran-kedisiplinan': 'insentif-kehadiran-kedisiplinan',
  'kehadiran': 'insentif-kehadiran-kedisiplinan',

  // Insentif Produktivitas
  'insentif_produktivitas': 'insentif-produktivitas-line',
  'insentif-produktivitas-line': 'insentif-produktivitas-line',

  // Insentif Kinerja
  'insentif_kinerja': 'insentif-kinerja-triwulan',
  'insentif-kinerja-triwulan': 'insentif-kinerja-triwulan',
  'bonus_kpi': 'insentif-kinerja-triwulan',

  // THR
  'tunjangan_thr': 'tunjangan-thr',
  'tunjangan-thr': 'tunjangan-thr',
  'thr': 'tunjangan-thr',

  // Bonus Tahunan
  'bonus_tahunan': 'bonus-tahunan-masa-kerja',
  'bonus-tahunan-masa-kerja': 'bonus-tahunan-masa-kerja',

  // Komisi Penjualan
  'bonus_penjualan': 'insentif-komisi-penjualan',
  'komisi_penjualan': 'insentif-komisi-penjualan',

  // Shift & Profesi
  'tunjangan_shift': 'tunjangan-shift-malam-pabrik',
  'tunjangan_profesi': 'tunjangan-keahlian',
};

// BPJS Alias Mapping Table
const BPJS_ALIAS_MAP: Record<string, string> = {
  'rule_bpjs_kes_1': 'rule_bpjs_kes_1',
  'bpjs_kesehatan': 'rule_bpjs_kes_1',
  'bpjs-kesehatan': 'rule_bpjs_kes_1',
  'bpjs_kes': 'rule_bpjs_kes_1',
  'kes_1': 'rule_bpjs_kes_1',

  'rule_jht_1': 'rule_jht_1',
  'bpjs_jht': 'rule_jht_1',
  'bpjs-jht': 'rule_jht_1',
  'jht': 'rule_jht_1',

  'rule_jp_1': 'rule_jp_1',
  'bpjs_jp': 'rule_jp_1',
  'bpjs-jp': 'rule_jp_1',
  'jp': 'rule_jp_1',

  'rule_jkk_1': 'rule_jkk_1',
  'bpjs_jkk': 'rule_jkk_1',
  'bpjs-jkk': 'rule_jkk_1',
  'jkk': 'rule_jkk_1',

  'rule_jkm_1': 'rule_jkm_1',
  'bpjs_jkm': 'rule_jkm_1',
  'bpjs-jkm': 'rule_jkm_1',
  'jkm': 'rule_jkm_1',

  'rule_jkp_1': 'rule_jkp_1',
  'bpjs_jkp': 'rule_jkp_1',
  'bpjs-jkp': 'rule_jkp_1',
  'jkp': 'rule_jkp_1',
};

// Pajak Alias Mapping Table
const PAJAK_ALIAS_MAP: Record<string, string> = {
  'pajak-pph21-ter': 'pajak-pph21-ter',
  'pajak_pph21_ter': 'pajak-pph21-ter',
  'rule_pph21_ter': 'pajak-pph21-ter',
  'pph21_ter': 'pajak-pph21-ter',
  'ter': 'pajak-pph21-ter',

  'pajak-pph21-pasal17': 'pajak-pph21-pasal17',
  'pajak_pph21_pasal17': 'pajak-pph21-pasal17',
  'rule_pph21_pasal17': 'pajak-pph21-pasal17',
  'pph21_pasal17': 'pajak-pph21-pasal17',
  'pasal17': 'pajak-pph21-pasal17',
  'progresif': 'pajak-pph21-pasal17',

  'pajak-pph21-harian': 'pajak-pph21-harian',
  'pajak_pph21_harian': 'pajak-pph21-harian',
  'rule_pph21_harian': 'pajak-pph21-harian',
  'pph21_harian': 'pajak-pph21-harian',
  'harian': 'pajak-pph21-harian',
  'lepas': 'pajak-pph21-harian',
};

export function normalizeTunjanganId(input: string, catalogList: TunjanganItem[] = MASTER_TUNJANGAN_LIST): string {
  if (!input) return '';
  const clean = String(input).trim();
  const lower = clean.toLowerCase();

  // 1. Direct alias match
  if (TUNJANGAN_ALIAS_MAP[clean]) return TUNJANGAN_ALIAS_MAP[clean];
  if (TUNJANGAN_ALIAS_MAP[lower]) return TUNJANGAN_ALIAS_MAP[lower];

  // 2. Hyphen <-> Underscore conversion
  const dashed = lower.replace(/_/g, '-');
  if (TUNJANGAN_ALIAS_MAP[dashed]) return TUNJANGAN_ALIAS_MAP[dashed];

  // 3. Match against catalogList IDs
  const idMatch = catalogList.find(t => t.id === clean || t.id.toLowerCase() === lower || t.id.toLowerCase() === dashed);
  if (idMatch) return idMatch.id;

  // 4. Match against catalogList names
  const nameMatch = catalogList.find(t => 
    t.nama.toLowerCase() === lower || 
    lower.includes(t.nama.toLowerCase()) || 
    t.nama.toLowerCase().includes(lower)
  );
  if (nameMatch) return nameMatch.id;

  return clean;
}

export function normalizeBpjsId(input: string, catalogList: BpjsItem[] = MASTER_BPJS_LIST): string {
  if (!input) return '';
  const clean = String(input).trim();
  const lower = clean.toLowerCase();

  if (BPJS_ALIAS_MAP[clean]) return BPJS_ALIAS_MAP[clean];
  if (BPJS_ALIAS_MAP[lower]) return BPJS_ALIAS_MAP[lower];

  const dashed = lower.replace(/_/g, '-');
  if (BPJS_ALIAS_MAP[dashed]) return BPJS_ALIAS_MAP[dashed];

  const idMatch = catalogList.find(b => b.id === clean || b.id.toLowerCase() === lower || b.id.toLowerCase() === dashed);
  if (idMatch) return idMatch.id;

  const nameMatch = catalogList.find(b => 
    b.nama.toLowerCase() === lower || 
    lower.includes(b.nama.toLowerCase()) || 
    b.nama.toLowerCase().includes(lower)
  );
  if (nameMatch) return nameMatch.id;

  return clean;
}

export function normalizePajakId(input: string): string {
  if (!input) return 'pajak-pph21-ter';
  const clean = String(input).trim();
  const lower = clean.toLowerCase();

  if (PAJAK_ALIAS_MAP[clean]) return PAJAK_ALIAS_MAP[clean];
  if (PAJAK_ALIAS_MAP[lower]) return PAJAK_ALIAS_MAP[lower];

  if (lower.includes('pasal') || lower.includes('progresif')) return 'pajak-pph21-pasal17';
  if (lower.includes('harian') || lower.includes('lepas')) return 'pajak-pph21-harian';

  return 'pajak-pph21-ter';
}

export function isTunjanganSelected(
  selectedList: string[] = [],
  itemId: string,
  catalogList: TunjanganItem[] = MASTER_TUNJANGAN_LIST
): boolean {
  if (!selectedList || selectedList.length === 0) return false;
  const targetNorm = normalizeTunjanganId(itemId, catalogList);

  return selectedList.some(sel => {
    const selNorm = normalizeTunjanganId(sel, catalogList);
    if (selNorm === targetNorm) return true;
    if (sel.toLowerCase() === itemId.toLowerCase()) return true;
    if (sel.replace(/_/g, '-') === itemId.replace(/_/g, '-')) return true;
    return false;
  });
}

export function isBpjsSelected(
  selectedList: string[] = [],
  itemId: string,
  catalogList: BpjsItem[] = MASTER_BPJS_LIST
): boolean {
  if (!selectedList || selectedList.length === 0) return false;
  const targetNorm = normalizeBpjsId(itemId, catalogList);

  return selectedList.some(sel => {
    const selNorm = normalizeBpjsId(sel, catalogList);
    if (selNorm === targetNorm) return true;
    if (sel.toLowerCase() === itemId.toLowerCase()) return true;
    if (sel.replace(/_/g, '-') === itemId.replace(/_/g, '-')) return true;
    return false;
  });
}

export function normalizeCompensationStructure(
  kompensasi: any,
  tunjanganCatalog: TunjanganItem[] = MASTER_TUNJANGAN_LIST,
  bpjsCatalog: BpjsItem[] = MASTER_BPJS_LIST
): any {
  if (!kompensasi) {
    return {
      gajiPokok: { minimal: 0, standar: 0, maksimal: 0 },
      tunjangan: [],
      bpjs: [],
      pajakRuleId: 'pajak-pph21-ter',
      pajak: ['pajak-pph21-ter'],
      fasilitas: []
    };
  }

  // 1. Collect raw tunjangan inputs
  const rawTunjangan: string[] = [];
  if (Array.isArray(kompensasi.tunjangan)) rawTunjangan.push(...kompensasi.tunjangan);
  if (Array.isArray(kompensasi.tunjanganTetap)) rawTunjangan.push(...kompensasi.tunjanganTetap);
  if (Array.isArray(kompensasi.tunjanganTidakTetap)) rawTunjangan.push(...kompensasi.tunjanganTidakTetap);
  if (Array.isArray(kompensasi.insentif)) rawTunjangan.push(...kompensasi.insentif);
  if (Array.isArray(kompensasi.bonus)) rawTunjangan.push(...kompensasi.bonus);

  const normalizedTunjangan = Array.from(
    new Set(rawTunjangan.map(item => normalizeTunjanganId(item, tunjanganCatalog)).filter(Boolean))
  );

  // 2. Collect raw BPJS inputs
  const rawBpjs: string[] = [];
  if (Array.isArray(kompensasi.bpjs)) rawBpjs.push(...kompensasi.bpjs);

  const normalizedBpjs = Array.from(
    new Set(rawBpjs.map(item => normalizeBpjsId(item, bpjsCatalog)).filter(Boolean))
  );

  // 3. Normalize Pajak
  const rawPajak = kompensasi.pajakRuleId || (Array.isArray(kompensasi.pajak) ? kompensasi.pajak[0] : null) || 'pajak-pph21-ter';
  const normalizedPajak = normalizePajakId(rawPajak);

  return {
    ...kompensasi,
    gajiPokok: {
      minimal: Number(kompensasi.gajiPokok?.minimal || 0),
      standar: Number(kompensasi.gajiPokok?.standar || 0),
      maksimal: Number(kompensasi.gajiPokok?.maksimal || 0),
    },
    tunjangan: normalizedTunjangan,
    bpjs: normalizedBpjs,
    pajakRuleId: normalizedPajak,
    pajak: [normalizedPajak],
    fasilitas: Array.isArray(kompensasi.fasilitas) ? kompensasi.fasilitas : [],
  };
}

/**
 * Helper Utilities
 */
export function getTunjanganName(id: string): string {
  if (!id) return '-';
  const normId = normalizeTunjanganId(id);
  const tunjangan = MASTER_TUNJANGAN_LIST.find(t => t.id === normId || t.id === id);
  return tunjangan ? tunjangan.nama : id;
}

export function getBpjsName(id: string): string {
  if (!id) return '-';
  const normId = normalizeBpjsId(id);
  const bpjs = MASTER_BPJS_LIST.find(b => b.id === normId || b.id === id);
  return bpjs ? bpjs.nama : id;
}

/**
 * Utility to load dynamic configurations if needed by other components
 * Now relies directly on the strong-typed array.
 */
export async function loadTunjanganFromJson(): Promise<TunjanganItem[]> {
  return MASTER_TUNJANGAN_LIST;
}
