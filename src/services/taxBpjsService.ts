import { Employee, TaxProfile, BpjsKesehatanProfile, BpjsKetenagakerjaanProfile } from '../types';

// ==========================================
// 1. PTKP & TER MAPPING (PP 58/2023 & UU HPP)
// ==========================================

export interface PtkpItem {
  code: string;
  label: string;
  maritalStatus: 'Single' | 'Married';
  dependents: number;
  ptkpAnnual: number;
  terCategory: 'A' | 'B' | 'C';
  description: string;
}

export const PTKP_DATA: PtkpItem[] = [
  { code: 'TK/0', label: 'TK/0 - Tidak Kawin, 0 Tanggungan (Rp 54.000.000/thn)', maritalStatus: 'Single', dependents: 0, ptkpAnnual: 54000000, terCategory: 'A', description: 'Wajib Pajak Sendiri (Kategori TER A)' },
  { code: 'TK/1', label: 'TK/1 - Tidak Kawin, 1 Tanggungan (Rp 58.500.000/thn)', maritalStatus: 'Single', dependents: 1, ptkpAnnual: 58500000, terCategory: 'A', description: 'Wajib Pajak Sendiri + 1 Tanggungan (Kategori TER A)' },
  { code: 'TK/2', label: 'TK/2 - Tidak Kawin, 2 Tanggungan (Rp 63.000.000/thn)', maritalStatus: 'Single', dependents: 2, ptkpAnnual: 63000000, terCategory: 'B', description: 'Wajib Pajak Sendiri + 2 Tanggungan (Kategori TER B)' },
  { code: 'TK/3', label: 'TK/3 - Tidak Kawin, 3 Tanggungan (Rp 67.500.000/thn)', maritalStatus: 'Single', dependents: 3, ptkpAnnual: 67500000, terCategory: 'B', description: 'Wajib Pajak Sendiri + 3 Tanggungan (Kategori TER B)' },
  
  { code: 'K/0', label: 'K/0 - Kawin, 0 Tanggungan (Rp 58.500.000/thn)', maritalStatus: 'Married', dependents: 0, ptkpAnnual: 58500000, terCategory: 'A', description: 'Kawin tanpa tanggungan (Kategori TER A)' },
  { code: 'K/1', label: 'K/1 - Kawin, 1 Tanggungan (Rp 63.000.000/thn)', maritalStatus: 'Married', dependents: 1, ptkpAnnual: 63000000, terCategory: 'B', description: 'Kawin + 1 Tanggungan (Kategori TER B)' },
  { code: 'K/2', label: 'K/2 - Kawin, 2 Tanggungan (Rp 67.500.000/thn)', maritalStatus: 'Married', dependents: 2, ptkpAnnual: 67500000, terCategory: 'B', description: 'Kawin + 2 Tanggungan (Kategori TER B)' },
  { code: 'K/3', label: 'K/3 - Kawin, 3 Tanggungan (Rp 72.000.000/thn)', maritalStatus: 'Married', dependents: 3, ptkpAnnual: 72000000, terCategory: 'C', description: 'Kawin + 3 Tanggungan (Kategori TER C)' },

  { code: 'K/I/0', label: 'K/I/0 - Kawin Penghasilan Istri Digabung, 0 Tanggungan (Rp 112.500.000/thn)', maritalStatus: 'Married', dependents: 0, ptkpAnnual: 112500000, terCategory: 'C', description: 'Kawin Penghasilan Digabung (Kategori TER C)' },
  { code: 'K/I/1', label: 'K/I/1 - Kawin Penghasilan Istri Digabung, 1 Tanggungan (Rp 117.000.000/thn)', maritalStatus: 'Married', dependents: 1, ptkpAnnual: 117000000, terCategory: 'C', description: 'Kawin Penghasilan Digabung + 1 (Kategori TER C)' },
  { code: 'K/I/2', label: 'K/I/2 - Kawin Penghasilan Istri Digabung, 2 Tanggungan (Rp 121.500.000/thn)', maritalStatus: 'Married', dependents: 2, ptkpAnnual: 121500000, terCategory: 'C', description: 'Kawin Penghasilan Digabung + 2 (Kategori TER C)' },
  { code: 'K/I/3', label: 'K/I/3 - Kawin Penghasilan Istri Digabung, 3 Tanggungan (Rp 126.000.000/thn)', maritalStatus: 'Married', dependents: 3, ptkpAnnual: 126000000, terCategory: 'C', description: 'Kawin Penghasilan Digabung + 3 (Kategori TER C)' },
];

export const EMPLOYEE_TAX_TYPES = [
  { value: 'Pegawai Tetap', label: 'Pegawai Tetap (PKWTT / Regular)', description: 'Dikenakan PPh 21 TER Bulanan Masa Jan-Nov dan Tarif Pasal 17 di Masa Des' },
  { value: 'Pegawai Tidak Tetap', label: 'Pegawai Tidak Tetap / Kontrak (PKWT)', description: 'Upah bulanan/harian dikenakan TER bulanan/harian sesuai PMK 168/2023' },
  { value: 'Tenaga Ahli', label: 'Tenaga Ahli / Konsultan (Bukan Pegawai)', description: 'Dasar Pemotongan: 50% dari Penghasilan Bruto x Tarif Progresif Pasal 17' },
  { value: 'Bukan Pegawai', label: 'Bukan Pegawai / Pekerja Lepas (Freelancer)', description: 'Penghasilan bersifat tidak berkesinambungan atau kumulatif' },
  { value: 'Ekspatriat', label: 'Ekspatriat / Warga Negara Asing (WNA / SPLN/SPDN)', description: 'Sesuai Tax Treaty (P3B) atau PPh Pasal 26 / Pasal 21' }
];

export const TAX_METHODS = [
  { 
    value: 'Gross', 
    label: 'Gross (PPh 21 Ditanggung Karyawan)', 
    description: 'Pajak PPh 21 dipotong langsung dari total gaji bruto karyawan.',
    badge: 'Standar Umum'
  },
  { 
    value: 'Gross Up', 
    label: 'Gross Up (Tunjangan Pajak oleh Perusahaan)', 
    description: 'Perusahaan memberikan tunjangan pajak sebesar PPh 21 sehingga take home pay utuh dan tunjangan jadi biaya fiskal pengurang pajak.',
    badge: 'Rekomendasi Benefit HR'
  },
  { 
    value: 'Nett', 
    label: 'Nett (PPh 21 Ditanggung Perusahaan Tanpa Tunjangan)', 
    description: 'Pajak PPh 21 dibayarkan langsung oleh perusahaan (Non-Deductible Expense secara fiskal).',
    badge: 'Netto Murni'
  }
];

// ==========================================
// 2. BPJS STATUTORY CONFIGURATION & LIMITS
// ==========================================

export const BPJS_CONFIG = {
  KESEHATAN: {
    MAX_WAGE_CAP: 12000000, // Batas Atas Upah Maksimal BPJS Kesehatan (Perpres 64/2020)
    MIN_WAGE_FLOOR: 0,      // Mengikuti UMP/UMK daerah
    EMPLOYEE_RATE: 0.01,    // 1% Iuran Pekerja
    EMPLOYER_RATE: 0.04,    // 4% Iuran Perusahaan
    TOTAL_RATE: 0.05,       // Total 5%
    MAX_EMPLOYEE_AMOUNT: 120000, // Max Rp 120.000 / bln
    MAX_EMPLOYER_AMOUNT: 480000, // Max Rp 480.000 / bln
    MAX_TOTAL_AMOUNT: 600000     // Max Rp 600.000 / bln
  },
  KETENAGAKERJAAN: {
    JHT: {
      EMPLOYEE_RATE: 0.02,   // 2%
      EMPLOYER_RATE: 0.037,  // 3.7%
      TOTAL_RATE: 0.057,     // 5.7%
      HAS_CAP: false
    },
    JKK: {
      VERY_LOW: { rate: 0.0024, label: 'Tingkat I - Sangat Rendah (0.24%)', desc: 'Perkantoran, Administrasi, Jasa Keuangan, IT' },
      LOW: { rate: 0.0054, label: 'Tingkat II - Rendah (0.54%)', desc: 'Perdagangan, Retail, Restoran, Pendidikan, Pariwisata' },
      MEDIUM: { rate: 0.0089, label: 'Tingkat III - Sedang (0.89%)', desc: 'Manufaktur Ringan, Otomotif, Tekstil, Logistik' },
      HIGH: { rate: 0.0127, label: 'Tingkat IV - Tinggi (1.27%)', desc: 'Manufaktur Berat, Kimia, Transportasi Laut/Udara' },
      VERY_HIGH: { rate: 0.0174, label: 'Tingkat V - Sangat Tinggi (1.74%)', desc: 'Pertambangan, Minyak & Gas, Konstruksi Bangunan Tinggi' },
    },
    JKM: {
      EMPLOYER_RATE: 0.0030, // 0.30% Ditanggung Perusahaan
      EMPLOYEE_RATE: 0.0
    },
    JP: {
      MAX_WAGE_CAP: 10042300, // Batas maksimal upah JP tahun berjalan (PP 45/2015)
      EMPLOYEE_RATE: 0.01,    // 1%
      EMPLOYER_RATE: 0.02,    // 2%
      TOTAL_RATE: 0.03,
      MAX_EMPLOYEE_AMOUNT: 100423,
      MAX_EMPLOYER_AMOUNT: 200846,
      MAX_TOTAL_AMOUNT: 301269
    },
    JKP: {
      RATE: 0.0046, // 0.46% (0.22% APBN + 0.24% Rekomposisi JKK/JKM) - Sesuai PP 37/2021
      MAX_WAGE_CAP: 5000000,
      EMPLOYEE_DEDUCTION: 0 // Tidak memotong gaji pekerja
    }
  }
};

export const JKK_RISK_OPTIONS = [
  { value: 'Very Low', rate: 0.0024, label: 'Tingkat I - Sangat Rendah (0.24%)', subtitle: 'Perkantoran, Administrasi, IT, Jasa Perbankan' },
  { value: 'Low', rate: 0.0054, label: 'Tingkat II - Rendah (0.54%)', subtitle: 'Retail, Perdagangan, Restoran, Jasa Umum' },
  { value: 'Medium', rate: 0.0089, label: 'Tingkat III - Sedang (0.89%)', subtitle: 'Pabrik Ringan, Tekstil, Makanan/Minuman, Pergudangan' },
  { value: 'High', rate: 0.0127, label: 'Tingkat IV - Tinggi (1.27%)', subtitle: 'Industri Logam, Kimia, Transportasi, Logistik Alat Berat' },
  { value: 'Very High', rate: 0.0174, label: 'Tingkat V - Sangat Tinggi (1.74%)', subtitle: 'Konstruksi, Pertambangan, Migas, Penebangan Kayu' }
];

export const BPJS_HEALTH_PARTICIPANT_OPTIONS = [
  { value: 'PPU Badan Usaha', label: 'PPU Badan Usaha Swasta', subLabel: '1% Pekerja & 4% Pemberi Kerja', active: true },
  { value: 'PPU Penyelenggara Negara', label: 'PPU Penyelenggara Negara / BUMN', subLabel: '1% Pekerja & 4% Instansi', active: true },
  { value: 'Keluarga Tambahan', label: 'Keluarga Tambahan', subLabel: 'Anak ke-4 dst / Ortu (1% Pekerja)', active: true },
  { value: 'Mandiri PBPU - Kelas I', label: 'Mandiri PBPU - Kelas I', subLabel: 'Rp 150.000 / bln', active: false },
  { value: 'Mandiri PBPU - Kelas II', label: 'Mandiri PBPU - Kelas II', subLabel: 'Rp 100.000 / bln', active: false },
  { value: 'Mandiri PBPU - Kelas III', label: 'Mandiri PBPU - Kelas III', subLabel: 'Rp 35.000 / bln', active: false },
  { value: 'Bukan Pekerja', label: 'Bukan Pekerja', subLabel: 'Pensiunan / Investor', active: false },
  { value: 'None', label: 'Tidak Terdaftar / Dinonaktifkan', subLabel: 'Non-Aktif', active: false }
];

// ==========================================
// 3. TER BRACKETS (PP NO. 58 TAHUN 2023)
// ==========================================

export const TER_A_BRACKETS: [number, number][] = [
  [5400000, 0.0],
  [5650000, 0.0025],
  [5950000, 0.005],
  [6300000, 0.0075],
  [6750000, 0.01],
  [7500000, 0.0125],
  [8550000, 0.015],
  [9650000, 0.0175],
  [10050000, 0.02],
  [10350000, 0.0225],
  [10700000, 0.025],
  [11050000, 0.03],
  [11600000, 0.035],
  [12500000, 0.04],
  [13750000, 0.05],
  [15100000, 0.06],
  [16950000, 0.07],
  [19750000, 0.08],
  [24150000, 0.09],
  [26450000, 0.10],
  [28000000, 0.11],
  [30050000, 0.12],
  [32400000, 0.13],
  [35400000, 0.14],
  [39100000, 0.15],
  [43850000, 0.16],
  [47800000, 0.17],
  [51400000, 0.18],
  [56300000, 0.19],
  [62200000, 0.20],
  [68600000, 0.21],
  [77500000, 0.22],
  [89000000, 0.23],
  [103000000, 0.24],
  [125000000, 0.25],
  [157000000, 0.26],
  [206000000, 0.27],
  [337000000, 0.28],
  [454000000, 0.29],
  [550000000, 0.30],
  [695000000, 0.31],
  [910000000, 0.32],
  [1400000000, 0.33],
  [Infinity, 0.34]
];

export const TER_B_BRACKETS: [number, number][] = [
  [6200000, 0.0],
  [6500000, 0.0025],
  [6850000, 0.005],
  [7300000, 0.0075],
  [9200000, 0.01],
  [10750000, 0.015],
  [11250000, 0.02],
  [11600000, 0.025],
  [12600000, 0.03],
  [13600000, 0.04],
  [14950000, 0.05],
  [16400000, 0.06],
  [18450000, 0.07],
  [21850000, 0.08],
  [26000000, 0.09],
  [27700000, 0.10],
  [29350000, 0.11],
  [31450000, 0.12],
  [33950000, 0.13],
  [37100000, 0.14],
  [41100000, 0.15],
  [45800000, 0.16],
  [49500000, 0.17],
  [53800000, 0.18],
  [58500000, 0.19],
  [64000000, 0.20],
  [71000000, 0.21],
  [80000000, 0.22],
  [93000000, 0.23],
  [109000000, 0.24],
  [129000000, 0.25],
  [163000000, 0.26],
  [211000000, 0.27],
  [374000000, 0.28],
  [459000000, 0.29],
  [555000000, 0.30],
  [704000000, 0.31],
  [957000000, 0.32],
  [1405000000, 0.33],
  [Infinity, 0.34]
];

export const TER_C_BRACKETS: [number, number][] = [
  [6600000, 0.0],
  [6950000, 0.0025],
  [7350000, 0.005],
  [7800000, 0.0075],
  [8850000, 0.01],
  [9800000, 0.0125],
  [10950000, 0.015],
  [11200000, 0.0175],
  [12050000, 0.02],
  [12950000, 0.03],
  [14150000, 0.04],
  [15550000, 0.05],
  [17050000, 0.06],
  [19500000, 0.07],
  [22700000, 0.08],
  [26600000, 0.09],
  [28100000, 0.10],
  [30100000, 0.11],
  [32600000, 0.12],
  [35400000, 0.13],
  [38900000, 0.14],
  [43000000, 0.15],
  [47400000, 0.16],
  [51200000, 0.17],
  [55800000, 0.18],
  [60400000, 0.19],
  [66700000, 0.20],
  [74500000, 0.21],
  [83200000, 0.22],
  [95600000, 0.23],
  [110000000, 0.24],
  [134000000, 0.25],
  [169000000, 0.26],
  [221000000, 0.27],
  [390000000, 0.28],
  [463000000, 0.29],
  [561000000, 0.30],
  [709000000, 0.31],
  [965000000, 0.32],
  [1419000000, 0.33],
  [Infinity, 0.34]
];

/**
 * Get TER Category for a given PTKP code
 */
export function getTerCategory(ptkpCode: string): 'A' | 'B' | 'C' {
  const match = PTKP_DATA.find(p => p.code.toUpperCase() === ptkpCode.toUpperCase());
  return match ? match.terCategory : 'A';
}

/**
 * Get monthly TER Rate based on Category (A/B/C) and Gross Monthly Income
 */
export function getMonthlyTerRate(grossMonthlyIncome: number, terCategory: 'A' | 'B' | 'C', hasNpwp: boolean = true): number {
  if (grossMonthlyIncome <= 0) return 0;

  let brackets = TER_A_BRACKETS;
  if (terCategory === 'B') brackets = TER_B_BRACKETS;
  else if (terCategory === 'C') brackets = TER_C_BRACKETS;

  for (const [limit, rate] of brackets) {
    if (grossMonthlyIncome <= limit) {
      // If no NPWP, standard surcharge was 20% higher under older regulation; under PMK 168/2023 NIK is NPWP.
      // If explicitly marked no NPWP, we can apply 1.2x factor if rate > 0
      return (!hasNpwp && rate > 0) ? rate * 1.2 : rate;
    }
  }

  return 0.34;
}

// ==========================================
// 4. CALCULATION & SIMULATION FUNCTIONS
// ==========================================

export interface TaxCalculationResult {
  ptkpCode: string;
  terCategory: 'A' | 'B' | 'C';
  ptkpAnnual: number;
  taxMethod: 'Gross' | 'Gross Up' | 'Nett';
  grossMonthlyIncome: number;
  terRate: number;
  pph21Monthly: number;
  taxAllowance: number; // For Gross Up
  effectiveTakeHomeSalary: number;
  isProgressive?: boolean;
  annualNetIncome?: number;
  annualPkp?: number;
  annualTax?: number;
}

export function calculateEmployeeProgressiveTaxSimulation(
  grossMonthlyIncome: number,
  ptkpCode: string = 'TK/0',
  taxMethod: 'Gross' | 'Gross Up' | 'Nett' = 'Gross',
  hasNpwp: boolean = true
): TaxCalculationResult {
  const ptkp = PTKP_DATA.find(p => p.code === ptkpCode) || PTKP_DATA[0];
  const annualGross = grossMonthlyIncome * 12;
  const monthlyBiayaJabatan = Math.min(grossMonthlyIncome * 0.05, 500000);
  const annualBiayaJabatan = monthlyBiayaJabatan * 12;
  const annualNetIncome = Math.max(0, annualGross - annualBiayaJabatan);
  const annualPkp = Math.max(0, Math.floor((annualNetIncome - ptkp.ptkpAnnual) / 1000) * 1000);

  // Progressive Tax Brackets (UU HPP No. 7/2021)
  let remainingPkp = annualPkp;
  let annualTax = 0;

  const bracket1 = Math.min(remainingPkp, 60000000);
  annualTax += bracket1 * 0.05;
  remainingPkp = Math.max(0, remainingPkp - bracket1);

  const bracket2 = Math.min(remainingPkp, 190000000);
  annualTax += bracket2 * 0.15;
  remainingPkp = Math.max(0, remainingPkp - bracket2);

  const bracket3 = Math.min(remainingPkp, 250000000);
  annualTax += bracket3 * 0.25;
  remainingPkp = Math.max(0, remainingPkp - bracket3);

  const bracket4 = Math.min(remainingPkp, 4500000000);
  annualTax += bracket4 * 0.30;
  remainingPkp = Math.max(0, remainingPkp - bracket4);

  if (remainingPkp > 0) {
    annualTax += remainingPkp * 0.35;
  }

  if (!hasNpwp && annualTax > 0) {
    annualTax *= 1.2;
  }

  let pph21Monthly = Math.round(annualTax / 12);
  let taxAllowance = 0;

  if (taxMethod === 'Gross Up') {
    // Convergent Gross Up calculation for Progressive Tax
    let currentAllowance = 0;
    for (let iter = 0; iter < 10; iter++) {
      const testGross = grossMonthlyIncome + currentAllowance;
      const testAnnualGross = testGross * 12;
      const testAnnualBiayaJabatan = Math.min(testGross * 0.05, 500000) * 12;
      const testNeto = Math.max(0, testAnnualGross - testAnnualBiayaJabatan);
      const testPkp = Math.max(0, Math.floor((testNeto - ptkp.ptkpAnnual) / 1000) * 1000);
      
      let rem = testPkp;
      let tax = 0;
      const b1 = Math.min(rem, 60000000); tax += b1 * 0.05; rem = Math.max(0, rem - b1);
      const b2 = Math.min(rem, 190000000); tax += b2 * 0.15; rem = Math.max(0, rem - b2);
      const b3 = Math.min(rem, 250000000); tax += b3 * 0.25; rem = Math.max(0, rem - b3);
      const b4 = Math.min(rem, 4500000000); tax += b4 * 0.30; rem = Math.max(0, rem - b4);
      if (rem > 0) tax += rem * 0.35;
      if (!hasNpwp && tax > 0) tax *= 1.2;

      const monthlyTax = Math.round(tax / 12);
      if (Math.abs(monthlyTax - currentAllowance) < 2) {
        currentAllowance = monthlyTax;
        break;
      }
      currentAllowance = monthlyTax;
    }
    pph21Monthly = currentAllowance;
    taxAllowance = currentAllowance;
  }

  const effectiveRate = grossMonthlyIncome > 0 ? (pph21Monthly / grossMonthlyIncome) : 0;
  const effectiveTakeHomeSalary = (taxMethod === 'Gross')
    ? (grossMonthlyIncome - pph21Monthly)
    : grossMonthlyIncome;

  return {
    ptkpCode: ptkp.code,
    terCategory: ptkp.terCategory,
    ptkpAnnual: ptkp.ptkpAnnual,
    taxMethod,
    grossMonthlyIncome,
    terRate: effectiveRate,
    pph21Monthly,
    taxAllowance,
    effectiveTakeHomeSalary,
    isProgressive: true,
    annualNetIncome,
    annualPkp,
    annualTax
  };
}

export function calculateEmployeeTaxSimulation(
  grossMonthlyIncome: number,
  ptkpCode: string = 'TK/0',
  taxMethod: 'Gross' | 'Gross Up' | 'Nett' = 'Gross',
  hasNpwp: boolean = true
): TaxCalculationResult {
  const ptkp = PTKP_DATA.find(p => p.code === ptkpCode) || PTKP_DATA[0];
  const terCategory = ptkp.terCategory;

  let terRate = getMonthlyTerRate(grossMonthlyIncome, terCategory, hasNpwp);
  let pph21Monthly = 0;
  let taxAllowance = 0;

  if (taxMethod === 'Gross') {
    // PPh 21 dipotong langsung dari upah
    pph21Monthly = Math.round(grossMonthlyIncome * terRate);
    taxAllowance = 0;
  } else if (taxMethod === 'Gross Up') {
    // Convergent Gross Up calculation for TER
    let currentAllowance = 0;
    let rate = terRate;
    for (let iter = 0; iter < 10; iter++) {
      rate = getMonthlyTerRate(grossMonthlyIncome + currentAllowance, terCategory, hasNpwp);
      if (rate >= 1) break;
      const nextAllowance = Math.round((grossMonthlyIncome * rate) / (1 - rate));
      if (Math.abs(nextAllowance - currentAllowance) < 2) {
        currentAllowance = nextAllowance;
        break;
      }
      currentAllowance = nextAllowance;
    }
    terRate = rate;
    pph21Monthly = currentAllowance;
    taxAllowance = currentAllowance;
  } else {
    // Nett: Pajak ditanggung perusahaan tanpa tunjangan
    pph21Monthly = Math.round(grossMonthlyIncome * terRate);
    taxAllowance = 0; // Tidak dimasukkan ke slip sebagai tunjangan, ditanggung kantor
  }

  const effectiveTakeHomeSalary = (taxMethod === 'Gross')
    ? (grossMonthlyIncome - pph21Monthly)
    : grossMonthlyIncome;

  return {
    ptkpCode: ptkp.code,
    terCategory,
    ptkpAnnual: ptkp.ptkpAnnual,
    taxMethod,
    grossMonthlyIncome,
    terRate,
    pph21Monthly,
    taxAllowance,
    effectiveTakeHomeSalary
  };
}

export interface BpjsCalculationResult {
  // BPJS Kesehatan
  kesehatan: {
    wageBase: number;
    wageCap: number;
    isActive: boolean;
    employeeRate: number;
    employerRate: number;
    employeeAmount: number;
    employerAmount: number;
    totalAmount: number;
  };
  // BPJS Ketenagakerjaan
  ketenagakerjaan: {
    reportedWage: number;
    isActive: boolean;
    jht: {
      isActive: boolean;
      employeeRate: number;
      employerRate: number;
      employeeAmount: number;
      employerAmount: number;
      totalAmount: number;
    };
    jkk: {
      isActive: boolean;
      riskCategory: string;
      rate: number;
      amount: number;
    };
    jkm: {
      isActive: boolean;
      rate: number;
      amount: number;
    };
    jp: {
      isActive: boolean;
      wageBase: number;
      wageCap: number;
      employeeRate: number;
      employerRate: number;
      employeeAmount: number;
      employerAmount: number;
      totalAmount: number;
    };
    jkp: {
      isActive: boolean;
      rate: number;
      amount: number;
      governmentSubsidized: boolean;
    };
    totalEmployeeDeduction: number;
    totalEmployerContribution: number;
    totalStatutoryPayment: number;
  };
  // Overall Grand Totals
  grandTotalEmployeeDeductions: number;
  grandTotalEmployerContributions: number;
}

export function calculateEmployeeBpjsSimulation(
  basicSalary: number,
  fixedAllowance: number = 0,
  healthProfile?: Partial<BpjsKesehatanProfile>,
  tkProfile?: Partial<BpjsKetenagakerjaanProfile>
): BpjsCalculationResult {
  const standardWage = (basicSalary || 0) + (fixedAllowance || 0);

  // 1. BPJS Kesehatan
  const isMandiri1 = healthProfile?.participantType === 'Mandiri PBPU - Kelas I';
  const isMandiri2 = healthProfile?.participantType === 'Mandiri PBPU - Kelas II';
  const isMandiri3 = healthProfile?.participantType === 'Mandiri PBPU - Kelas III';
  const isKeluargaTambahan = healthProfile?.participantType === 'Keluarga Tambahan';
  const isNonActive = !healthProfile?.participantType || healthProfile?.participantType === 'None' || healthProfile?.participantType === 'Bukan Pekerja' || healthProfile?.activeStatus !== 'Active';
  const kesActive = !isNonActive;

  const kesWage = healthProfile?.useCustomWageBase && healthProfile?.customWageBase !== undefined
    ? healthProfile.customWageBase
    : standardWage;
  const kesCappedWage = Math.min(kesWage, BPJS_CONFIG.KESEHATAN.MAX_WAGE_CAP);

  let kesEeAmount = 0;
  let kesErAmount = 0;
  let kesEeRate = (healthProfile?.employeeRate !== undefined) ? (healthProfile.employeeRate / 100) : BPJS_CONFIG.KESEHATAN.EMPLOYEE_RATE;
  let kesErRate = (healthProfile?.employerRate !== undefined) ? (healthProfile.employerRate / 100) : BPJS_CONFIG.KESEHATAN.EMPLOYER_RATE;

  if (kesActive) {
    if (isMandiri1) {
      kesEeAmount = 150000;
      kesErAmount = 0;
      kesEeRate = 0;
      kesErRate = 0;
    } else if (isMandiri2) {
      kesEeAmount = 100000;
      kesErAmount = 0;
      kesEeRate = 0;
      kesErRate = 0;
    } else if (isMandiri3) {
      kesEeAmount = 35000;
      kesErAmount = 0;
      kesEeRate = 0;
      kesErRate = 0;
    } else if (isKeluargaTambahan) {
      kesEeRate = (healthProfile?.employeeRate !== undefined) ? (healthProfile.employeeRate / 100) : 0.01;
      kesErRate = 0;
      kesEeAmount = Math.round(kesCappedWage * kesEeRate);
      kesErAmount = 0;
    } else {
      kesEeRate = (healthProfile?.employeeRate !== undefined) ? (healthProfile.employeeRate / 100) : BPJS_CONFIG.KESEHATAN.EMPLOYEE_RATE;
      kesErRate = (healthProfile?.employerRate !== undefined) ? (healthProfile.employerRate / 100) : BPJS_CONFIG.KESEHATAN.EMPLOYER_RATE;
      kesEeAmount = Math.round(kesCappedWage * kesEeRate);
      kesErAmount = Math.round(kesCappedWage * kesErRate);
    }
  } else {
    kesEeRate = 0;
    kesErRate = 0;
  }
  const kesTotalAmount = kesEeAmount + kesErAmount;

  // 2. BPJS Ketenagakerjaan
  const tkActive = tkProfile?.activeStatus === 'Active';
  const tkWage = tkProfile?.useCustomReportedWage && tkProfile?.customReportedWage !== undefined
    ? tkProfile.customReportedWage
    : standardWage;

  // JHT
  const hasJht = tkActive && (tkProfile?.hasJht !== false);
  const jhtEeAmount = hasJht ? Math.round(tkWage * BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYEE_RATE) : 0;
  const jhtErAmount = hasJht ? Math.round(tkWage * BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYER_RATE) : 0;

  // JKK
  const hasJkk = tkActive && (tkProfile?.hasJkk !== false);
  const jkkRiskKey = tkProfile?.jkkRiskCategory || 'Very Low';
  let jkkRate = BPJS_CONFIG.KETENAGAKERJAAN.JKK.VERY_LOW.rate;
  if (jkkRiskKey === 'Low') jkkRate = BPJS_CONFIG.KETENAGAKERJAAN.JKK.LOW.rate;
  else if (jkkRiskKey === 'Medium') jkkRate = BPJS_CONFIG.KETENAGAKERJAAN.JKK.MEDIUM.rate;
  else if (jkkRiskKey === 'High') jkkRate = BPJS_CONFIG.KETENAGAKERJAAN.JKK.HIGH.rate;
  else if (jkkRiskKey === 'Very High') jkkRate = BPJS_CONFIG.KETENAGAKERJAAN.JKK.VERY_HIGH.rate;

  const jkkAmount = hasJkk ? Math.round(tkWage * jkkRate) : 0;

  // JKM
  const hasJkm = tkActive && (tkProfile?.hasJkm !== false);
  const jkmAmount = hasJkm ? Math.round(tkWage * BPJS_CONFIG.KETENAGAKERJAAN.JKM.EMPLOYER_RATE) : 0;

  // JP
  const hasJp = tkActive && (tkProfile?.hasJp !== false);
  const jpCappedWage = Math.min(tkWage, BPJS_CONFIG.KETENAGAKERJAAN.JP.MAX_WAGE_CAP);
  const jpEeAmount = hasJp ? Math.round(jpCappedWage * BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYEE_RATE) : 0;
  const jpErAmount = hasJp ? Math.round(jpCappedWage * BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYER_RATE) : 0;

  // JKP
  const hasJkp = tkActive && (tkProfile?.hasJkp !== false);
  const jkpCappedWage = Math.min(tkWage, BPJS_CONFIG.KETENAGAKERJAAN.JKP.MAX_WAGE_CAP);
  const jkpAmount = hasJkp ? Math.round(jkpCappedWage * BPJS_CONFIG.KETENAGAKERJAAN.JKP.RATE) : 0;

  // Totals
  const totalTkEe = jhtEeAmount + jpEeAmount;
  const totalTkEr = jhtErAmount + jkkAmount + jkmAmount + jpErAmount;
  const totalTk = totalTkEe + totalTkEr;

  const grandTotalEmployeeDeductions = kesEeAmount + totalTkEe;
  const grandTotalEmployerContributions = kesErAmount + totalTkEr;

  return {
    kesehatan: {
      wageBase: kesWage,
      wageCap: BPJS_CONFIG.KESEHATAN.MAX_WAGE_CAP,
      isActive: kesActive,
      employeeRate: kesEeRate,
      employerRate: kesErRate,
      employeeAmount: kesEeAmount,
      employerAmount: kesErAmount,
      totalAmount: kesTotalAmount
    },
    ketenagakerjaan: {
      reportedWage: tkWage,
      isActive: tkActive,
      jht: {
        isActive: hasJht,
        employeeRate: BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYEE_RATE,
        employerRate: BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYER_RATE,
        employeeAmount: jhtEeAmount,
        employerAmount: jhtErAmount,
        totalAmount: jhtEeAmount + jhtErAmount
      },
      jkk: {
        isActive: hasJkk,
        riskCategory: jkkRiskKey,
        rate: jkkRate,
        amount: jkkAmount
      },
      jkm: {
        isActive: hasJkm,
        rate: BPJS_CONFIG.KETENAGAKERJAAN.JKM.EMPLOYER_RATE,
        amount: jkmAmount
      },
      jp: {
        isActive: hasJp,
        wageBase: jpCappedWage,
        wageCap: BPJS_CONFIG.KETENAGAKERJAAN.JP.MAX_WAGE_CAP,
        employeeRate: BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYEE_RATE,
        employerRate: BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYER_RATE,
        employeeAmount: jpEeAmount,
        employerAmount: jpErAmount,
        totalAmount: jpEeAmount + jpErAmount
      },
      jkp: {
        isActive: hasJkp,
        rate: BPJS_CONFIG.KETENAGAKERJAAN.JKP.RATE,
        amount: jkpAmount,
        governmentSubsidized: true
      },
      totalEmployeeDeduction: totalTkEe,
      totalEmployerContribution: totalTkEr,
      totalStatutoryPayment: totalTk
    },
    grandTotalEmployeeDeductions,
    grandTotalEmployerContributions
  };
}
