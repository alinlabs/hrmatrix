export interface PtkpItem {
  code: 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3' | 'K/I/0' | 'K/I/1' | 'K/I/2' | 'K/I/3';
  label: string;
  description: string;
  maritalStatus: 'Single' | 'Married';
  ptkpAnnual: number;
  dependents: number;
  terCategory: 'A' | 'B' | 'C';
}

export type PtkpOption = PtkpItem;

export const PTKP_DATA: PtkpItem[] = [
  { code: 'TK/0', label: 'TK/0', description: 'Tidak Kawin, 0 Tanggungan (Rp 54 Jt/thn)', maritalStatus: 'Single', ptkpAnnual: 54000000, dependents: 0, terCategory: 'A' },
  { code: 'TK/1', label: 'TK/1', description: 'Tidak Kawin, 1 Tanggungan (Rp 58,5 Jt/thn)', maritalStatus: 'Single', ptkpAnnual: 58500000, dependents: 1, terCategory: 'A' },
  { code: 'TK/2', label: 'TK/2', description: 'Tidak Kawin, 2 Tanggungan (Rp 63 Jt/thn)', maritalStatus: 'Single', ptkpAnnual: 63000000, dependents: 2, terCategory: 'B' },
  { code: 'TK/3', label: 'TK/3', description: 'Tidak Kawin, 3 Tanggungan (Rp 67,5 Jt/thn)', maritalStatus: 'Single', ptkpAnnual: 67500000, dependents: 3, terCategory: 'B' },
  { code: 'K/0', label: 'K/0', description: 'Kawin, 0 Tanggungan (Rp 58,5 Jt/thn)', maritalStatus: 'Married', ptkpAnnual: 58500000, dependents: 0, terCategory: 'A' },
  { code: 'K/1', label: 'K/1', description: 'Kawin, 1 Tanggungan (Rp 63 Jt/thn)', maritalStatus: 'Married', ptkpAnnual: 63000000, dependents: 1, terCategory: 'B' },
  { code: 'K/2', label: 'K/2', description: 'Kawin, 2 Tanggungan (Rp 67,5 Jt/thn)', maritalStatus: 'Married', ptkpAnnual: 67500000, dependents: 2, terCategory: 'B' },
  { code: 'K/3', label: 'K/3', description: 'Kawin, 3 Tanggungan (Rp 72 Jt/thn)', maritalStatus: 'Married', ptkpAnnual: 72000000, dependents: 3, terCategory: 'C' },
  { code: 'K/I/0', label: 'K/I/0', description: 'Kawin Penghasilan Digabung, 0 Tanggungan', maritalStatus: 'Married', ptkpAnnual: 112500000, dependents: 0, terCategory: 'B' },
  { code: 'K/I/1', label: 'K/I/1', description: 'Kawin Penghasilan Digabung, 1 Tanggungan', maritalStatus: 'Married', ptkpAnnual: 117000000, dependents: 1, terCategory: 'B' },
  { code: 'K/I/2', label: 'K/I/2', description: 'Kawin Penghasilan Digabung, 2 Tanggungan', maritalStatus: 'Married', ptkpAnnual: 121500000, dependents: 2, terCategory: 'C' },
  { code: 'K/I/3', label: 'K/I/3', description: 'Kawin Penghasilan Digabung, 3 Tanggungan', maritalStatus: 'Married', ptkpAnnual: 126000000, dependents: 3, terCategory: 'C' },
];

export const EMPLOYEE_TAX_TYPES = [
  { value: 'Pegawai Tetap', label: 'Pegawai Tetap (PPh 21 TER / Pasal 17)' },
  { value: 'Pegawai Tidak Tetap', label: 'Pegawai Tidak Tetap / Harian Lepas' },
  { value: 'Tenaga Ahli', label: 'Tenaga Ahli / Freelance Profesional' },
  { value: 'Bukan Pegawai', label: 'Bukan Pegawai' },
  { value: 'Ekspatriat', label: 'Ekspatriat / WNA (PPh 21 / 26)' },
];

export const TAX_METHODS = [
  { value: 'Gross', label: 'Gross (Pajak Ditanggung Karyawan)', badge: 'Dipotong' },
  { value: 'Gross Up', label: 'Gross Up (Tunjangan Pajak Penuh)', badge: 'Ditunjang' },
  { value: 'Nett', label: 'Nett (Pajak Ditanggung Perusahaan)', badge: 'Ditanggung' },
];

export const BPJS_HEALTH_PARTICIPANT_OPTIONS = [
  {
    value: 'PPU Badan Usaha',
    label: 'PPU Badan Usaha (Karyawan Swasta)',
    subtitle: '4% Perusahaan + 1% Pekerja (Maks. Upah Rp 12 Jt)',
    subLabel: '4% Perusahaan + 1% Pekerja (Maks. Upah Rp 12 Jt)',
  },
  {
    value: 'PPU Penyelenggara Negara',
    label: 'PPU Penyelenggara Negara / BUMN',
    subtitle: '4% Pemberi Kerja + 1% Pekerja (Maks. Upah Rp 12 Jt)',
    subLabel: '4% Pemberi Kerja + 1% Pekerja (Maks. Upah Rp 12 Jt)',
  },
  {
    value: 'Keluarga Tambahan',
    label: 'Keluarga Tambahan (Anak ke-4 dst / Orang Tua)',
    subtitle: '+1% Pekerja per jiwa tambahan',
    subLabel: '+1% Pekerja per jiwa tambahan',
  },
  {
    value: 'Mandiri PBPU - Kelas I',
    label: 'Mandiri Kelas I (PBPU)',
    subtitle: 'Iuran Tetap Rp 150.000 / bulan',
    subLabel: 'Iuran Tetap Rp 150.000 / bulan',
  },
  {
    value: 'Mandiri PBPU - Kelas II',
    label: 'Mandiri Kelas II (PBPU)',
    subtitle: 'Iuran Tetap Rp 100.000 / bulan',
    subLabel: 'Iuran Tetap Rp 100.000 / bulan',
  },
  {
    value: 'Mandiri PBPU - Kelas III',
    label: 'Mandiri Kelas III (PBPU)',
    subtitle: 'Iuran Tetap Rp 35.000 / bulan',
    subLabel: 'Iuran Tetap Rp 35.000 / bulan',
  },
  {
    value: 'Bukan Pekerja',
    label: 'Bukan Pekerja (BP)',
    subtitle: 'Kepesertaan mandiri / di luar payroll perusahaan',
    subLabel: 'Kepesertaan mandiri / di luar payroll perusahaan',
  },
  {
    value: 'None',
    label: 'Tidak Diikutsertakan / Non-Aktif',
    subtitle: 'Ditanggung keluarga / asuransi swasta lain',
    subLabel: 'Ditanggung keluarga / asuransi swasta lain',
  },
];

export const JKK_RISK_OPTIONS = [
  { value: 'Very Low', rate: 0.0024, label: 'Tingkat I — Sangat Rendah (0,24%)', subtitle: 'Perkantoran, IT, Bank, Jasa Keuangan & Konsultan' },
  { value: 'Low', rate: 0.0054, label: 'Tingkat II — Rendah (0,54%)', subtitle: 'Ritel, Garmen, Percetakan & Pergudangan Ringan' },
  { value: 'Medium', rate: 0.0089, label: 'Tingkat III — Sedang (0,89%)', subtitle: 'Manufaktur, Pabrik, Bengkel & Logistik Angkutan' },
  { value: 'High', rate: 0.0127, label: 'Tingkat IV — Tinggi (1,27%)', subtitle: 'Konstruksi Sipil, Galangan & Perkayuan Berat' },
  { value: 'Very High', rate: 0.0174, label: 'Tingkat V — Sangat Tinggi (1,74%)', subtitle: 'Pertambangan, Migas & Pekerjaan Bawah Tanah' },
];

export const BPJS_CONFIG = {
  KESEHATAN: {
    EMPLOYEE_RATE: 0.01,
    EMPLOYER_RATE: 0.04,
    MAX_WAGE_CAP: 12000000,
    MIN_WAGE_FLOOR: 0,
  },
  KETENAGAKERJAAN: {
    JHT: {
      EMPLOYEE_RATE: 0.02,
      EMPLOYER_RATE: 0.037,
    },
    JP: {
      EMPLOYEE_RATE: 0.01,
      EMPLOYER_RATE: 0.02,
      MAX_WAGE_CAP: 10042300,
    },
    JKK: {
      DEFAULT_RATE: 0.0024,
      EMPLOYER_RATE: 0.0024,
    },
    JKM: {
      EMPLOYER_RATE: 0.003,
    },
  },
};

// Tarif Efektif Rata-Rata (TER) Bulanan PP No. 58 Tahun 2023 & PMK 168/2023
export const TER_A_BRACKETS: [number, number][] = [
  [5400000, 0],
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
  [26450000, 0.1],
  [28000000, 0.11],
  [30050000, 0.12],
  [32400000, 0.13],
  [35400000, 0.14],
  [39100000, 0.15],
  [43850000, 0.16],
  [47800000, 0.17],
  [51400000, 0.18],
  [56300000, 0.19],
  [62200000, 0.2],
  [68600000, 0.21],
  [77500000, 0.22],
  [89000000, 0.23],
  [103000000, 0.24],
  [125000000, 0.25],
  [157000000, 0.26],
  [206000000, 0.27],
  [337000000, 0.28],
  [454000000, 0.29],
  [550000000, 0.3],
  [695000000, 0.31],
  [910000000, 0.32],
  [1400000000, 0.33],
  [Infinity, 0.34],
];

export const TER_B_BRACKETS: [number, number][] = [
  [6200000, 0],
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
  [27700000, 0.1],
  [29350000, 0.11],
  [31450000, 0.12],
  [33950000, 0.13],
  [37100000, 0.14],
  [41100000, 0.15],
  [45800000, 0.16],
  [49500000, 0.17],
  [53800000, 0.18],
  [58500000, 0.19],
  [64000000, 0.2],
  [71000000, 0.21],
  [80000000, 0.22],
  [93000000, 0.23],
  [109000000, 0.24],
  [129000000, 0.25],
  [163000000, 0.26],
  [211000000, 0.27],
  [374000000, 0.28],
  [459000000, 0.29],
  [555000000, 0.3],
  [704000000, 0.31],
  [957000000, 0.32],
  [1405000000, 0.33],
  [Infinity, 0.34],
];

export const TER_C_BRACKETS: [number, number][] = [
  [6600000, 0],
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
  [28100000, 0.1],
  [30100000, 0.11],
  [32600000, 0.12],
  [35400000, 0.13],
  [38900000, 0.14],
  [43000000, 0.15],
  [47400000, 0.16],
  [51200000, 0.17],
  [55800000, 0.18],
  [60400000, 0.19],
  [66700000, 0.2],
  [74500000, 0.21],
  [83200000, 0.22],
  [95600000, 0.23],
  [110500000, 0.24],
  [134000000, 0.25],
  [169000000, 0.26],
  [221000000, 0.27],
  [390000000, 0.28],
  [463000000, 0.29],
  [561000000, 0.3],
  [709000000, 0.31],
  [965000000, 0.32],
  [1419000000, 0.33],
  [Infinity, 0.34],
];

export function getTerCategory(ptkpStatus?: string): 'A' | 'B' | 'C' {
  const clean = (ptkpStatus || 'TK/0').trim().toUpperCase();
  const found = PTKP_DATA.find((p) => p.code === clean);
  if (found) return found.terCategory;
  if (clean === 'K/3') return 'C';
  if (['TK/2', 'TK/3', 'K/1', 'K/2'].includes(clean)) return 'B';
  return 'A';
}

export function getPtkpAnnual(ptkpStatus?: string): number {
  const clean = (ptkpStatus || 'TK/0').trim().toUpperCase();
  return PTKP_DATA.find((p) => p.code === clean)?.ptkpAnnual || 54000000;
}

function lookupTerRate(grossMonthly: number, category: 'A' | 'B' | 'C'): number {
  const brackets =
    category === 'C' ? TER_C_BRACKETS : category === 'B' ? TER_B_BRACKETS : TER_A_BRACKETS;
  for (const [upper, rate] of brackets) {
    if (grossMonthly <= upper) {
      return rate;
    }
  }
  return 0.34;
}

export interface TaxSimulationResult {
  terCategory: 'A' | 'B' | 'C';
  terRate: number;
  taxAllowance: number;
  pph21Monthly: number;
  ptkpAnnual: number;
}

export function calculateEmployeeTaxSimulation(
  taxableGrossMonthly: number,
  ptkpStatus: string = 'TK/0',
  taxMethod: string = 'Gross',
  hasNpwp: boolean = true
): TaxSimulationResult {
  const gross = Math.max(0, Number(taxableGrossMonthly || 0));
  const terCategory = getTerCategory(ptkpStatus);
  const ptkpAnnual = getPtkpAnnual(ptkpStatus);
  const methodNorm = (taxMethod || 'Gross').toLowerCase().replace(/\s+/g, '_');

  let effectiveGross = gross;
  let taxAllowance = 0;

  if (methodNorm === 'gross_up') {
    // Iterative convergence for TER gross-up so employee receives net gross
    for (let i = 0; i < 12; i++) {
      const rate = lookupTerRate(effectiveGross, terCategory);
      const nextTax = Math.round(effectiveGross * rate);
      const nextGross = gross + nextTax;
      if (Math.abs(nextGross - effectiveGross) < 1) {
        effectiveGross = nextGross;
        taxAllowance = nextTax;
        break;
      }
      effectiveGross = nextGross;
      taxAllowance = nextTax;
    }
  }

  const terRate = lookupTerRate(effectiveGross, terCategory);
  let pph21Monthly = Math.round(effectiveGross * terRate);
  if (!hasNpwp && pph21Monthly > 0) {
    // PMK 168/2023 keeps TER standard rates; keep multiplier 1.0 unless statutory surcharge applied separately
    pph21Monthly = Math.round(pph21Monthly);
  }

  if (methodNorm === 'nett') {
    taxAllowance = 0;
  } else if (methodNorm === 'gross_up') {
    taxAllowance = pph21Monthly;
  }

  return {
    terCategory,
    terRate,
    taxAllowance,
    pph21Monthly,
    ptkpAnnual,
  };
}

function computePasal17AnnualTax(pkpAnnual: number): number {
  if (pkpAnnual <= 0) return 0;
  const roundedPkp = Math.floor(pkpAnnual / 1000) * 1000;
  let remaining = roundedPkp;
  let tax = 0;

  const layers: Array<[number, number]> = [
    [60000000, 0.05],
    [190000000, 0.15], // 60jt - 250jt
    [250000000, 0.25], // 250jt - 500jt
    [4500000000, 0.3], // 500jt - 5M
    [Infinity, 0.35],
  ];

  for (const [span, rate] of layers) {
    if (remaining <= 0) break;
    const portion = Math.min(remaining, span);
    tax += portion * rate;
    remaining -= portion;
  }

  return Math.round(tax);
}

export function calculateEmployeeProgressiveTaxSimulation(
  taxableGrossMonthly: number,
  ptkpStatus: string = 'TK/0',
  taxMethod: string = 'Gross',
  hasNpwp: boolean = true
): TaxSimulationResult {
  const grossMonthly = Math.max(0, Number(taxableGrossMonthly || 0));
  const terCategory = getTerCategory(ptkpStatus);
  const ptkpAnnual = getPtkpAnnual(ptkpStatus);
  const methodNorm = (taxMethod || 'Gross').toLowerCase().replace(/\s+/g, '_');

  const computeMonthlyForGross = (monthlyIn: number) => {
    const annualGross = monthlyIn * 12;
    const biayaJabatan = Math.min(6000000, annualGross * 0.05);
    const netoAnnual = Math.max(0, annualGross - biayaJabatan);
    const pkp = Math.max(0, netoAnnual - ptkpAnnual);
    let annualTax = computePasal17AnnualTax(pkp);
    if (!hasNpwp && annualTax > 0) {
      annualTax = Math.round(annualTax * 1.2);
    }
    return Math.round(annualTax / 12);
  };

  let taxAllowance = 0;
  let pph21Monthly = computeMonthlyForGross(grossMonthly);

  if (methodNorm === 'gross_up') {
    let allowance = 0;
    for (let i = 0; i < 15; i++) {
      const nextTax = computeMonthlyForGross(grossMonthly + allowance);
      if (Math.abs(nextTax - allowance) <= 1) {
        allowance = nextTax;
        break;
      }
      allowance = nextTax;
    }
    taxAllowance = allowance;
    pph21Monthly = allowance;
  }

  const effectiveRate = grossMonthly > 0 ? pph21Monthly / (grossMonthly + taxAllowance) : 0;

  return {
    terCategory,
    terRate: effectiveRate,
    taxAllowance,
    pph21Monthly,
    ptkpAnnual,
  };
}

export interface BpjsSimulationResult {
  kesehatan: {
    wageBase: number;
    cappedWageBase: number;
    employeeAmount: number;
    employerAmount: number;
    totalAmount: number;
  };
  ketenagakerjaan: {
    jht: { employeeAmount: number; employerAmount: number };
    jp: { employeeAmount: number; employerAmount: number; cappedWage: number };
    jkk: { amount: number; rate: number };
    jkm: { amount: number; rate: number };
    totalEmployeeDeduction: number;
    totalEmployerContribution: number;
    totalStatutoryPayment: number;
  };
}

export interface BpjsKesehatanProfileInput {
  participantType?: string;
  activeStatus?: string;
  isParticipant?: boolean;
  useCustomWageBase?: boolean;
  customWageBase?: number;
  wageBase?: number;
  additionalFamilyMembers?: number;
  familyMembersCovered?: number;
  employeeRate?: number;
  employerRate?: number;
  overrideEmployeeRate?: number;
  overrideEmployerRate?: number;
}

export interface BpjsKetenagakerjaanProfileInput {
  activeStatus?: string;
  isParticipant?: boolean;
  hasJht?: boolean;
  hasJp?: boolean;
  hasJkk?: boolean;
  hasJkm?: boolean;
  hasJkp?: boolean;
  jkkRiskCategory?: string;
  includeJht?: boolean;
  includeJp?: boolean;
  includeJkk?: boolean;
  includeJkm?: boolean;
  jkkRiskGrade?: string;
  useCustomReportedWage?: boolean;
  customReportedWage?: number;
  useCustomWageBase?: boolean;
  customWageBase?: number;
  reportedWage?: number;
}

export function calculateEmployeeBpjsSimulation(
  basicSalary: number,
  fixedAllowance: number,
  kesProfile?: BpjsKesehatanProfileInput | null,
  tkProfile?: BpjsKetenagakerjaanProfileInput | null
): BpjsSimulationResult {
  const standardWage = Math.max(0, Number(basicSalary || 0) + Number(fixedAllowance || 0));

  // 1. BPJS Kesehatan
  const kesWageBase =
    kesProfile?.useCustomWageBase && kesProfile.customWageBase !== undefined
      ? Math.max(0, Number(kesProfile.customWageBase))
      : kesProfile?.wageBase !== undefined
        ? Math.max(0, Number(kesProfile.wageBase))
        : standardWage;
  const kesCapped = Math.min(kesWageBase, BPJS_CONFIG.KESEHATAN.MAX_WAGE_CAP);

  let kesEmployee = 0;
  let kesEmployer = 0;

  const isKesActive =
    kesProfile?.isParticipant !== false &&
    kesProfile?.activeStatus !== 'Inactive' &&
    kesProfile?.activeStatus !== 'Suspended';

  if (isKesActive) {
    const pType = kesProfile?.participantType || 'PPU Badan Usaha';
    if (pType === 'None' || pType === 'exempt' || pType === 'Bukan Pekerja') {
      kesEmployee = 0;
      kesEmployer = 0;
    } else if (pType === 'Mandiri PBPU - Kelas I' || pType === 'mandiri_1') {
      kesEmployee = 150000;
    } else if (pType === 'Mandiri PBPU - Kelas II' || pType === 'mandiri_2') {
      kesEmployee = 100000;
    } else if (pType === 'Mandiri PBPU - Kelas III' || pType === 'mandiri_3') {
      kesEmployee = 35000;
    } else {
      const eeRateRaw = kesProfile?.overrideEmployeeRate ?? kesProfile?.employeeRate;
      const erRateRaw = kesProfile?.overrideEmployerRate ?? kesProfile?.employerRate;
      const eeRate =
        eeRateRaw !== undefined ? Number(eeRateRaw) / 100 : BPJS_CONFIG.KESEHATAN.EMPLOYEE_RATE;
      const isFamilyAdd =
        pType === 'Keluarga Tambahan' || pType === 'family_additional';
      const erRate = isFamilyAdd
        ? 0
        : erRateRaw !== undefined
          ? Number(erRateRaw) / 100
          : BPJS_CONFIG.KESEHATAN.EMPLOYER_RATE;
      const extraMembers = Math.max(0, Number(kesProfile?.additionalFamilyMembers || 0));
      kesEmployee = Math.round(kesCapped * (eeRate + extraMembers * 0.01));
      kesEmployer = Math.round(kesCapped * erRate);
    }
  }

  // 2. BPJS Ketenagakerjaan
  const useCustomTkWage = tkProfile?.useCustomReportedWage ?? tkProfile?.useCustomWageBase;
  const customTkWage = tkProfile?.customReportedWage ?? tkProfile?.customWageBase;
  const tkWageBase =
    useCustomTkWage && customTkWage !== undefined
      ? Math.max(0, Number(customTkWage))
      : tkProfile?.reportedWage !== undefined
        ? Math.max(0, Number(tkProfile.reportedWage))
        : standardWage;

  const tkActive =
    tkProfile?.isParticipant !== false && tkProfile?.activeStatus !== 'Inactive';

  const hasJht = tkProfile?.hasJht ?? tkProfile?.includeJht ?? true;
  const hasJp = tkProfile?.hasJp ?? tkProfile?.includeJp ?? true;
  const hasJkk = tkProfile?.hasJkk ?? tkProfile?.includeJkk ?? true;
  const hasJkm = tkProfile?.hasJkm ?? tkProfile?.includeJkm ?? true;

  const jhtEe =
    tkActive && hasJht
      ? Math.round(tkWageBase * BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYEE_RATE)
      : 0;
  const jhtEr =
    tkActive && hasJht
      ? Math.round(tkWageBase * BPJS_CONFIG.KETENAGAKERJAAN.JHT.EMPLOYER_RATE)
      : 0;

  const jpCapped = Math.min(tkWageBase, BPJS_CONFIG.KETENAGAKERJAAN.JP.MAX_WAGE_CAP);
  const jpEe =
    tkActive && hasJp
      ? Math.round(jpCapped * BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYEE_RATE)
      : 0;
  const jpEr =
    tkActive && hasJp
      ? Math.round(jpCapped * BPJS_CONFIG.KETENAGAKERJAAN.JP.EMPLOYER_RATE)
      : 0;

  const rawRisk = String(tkProfile?.jkkRiskCategory || tkProfile?.jkkRiskGrade || 'Very Low');
  const jkkOpt = JKK_RISK_OPTIONS.find(
    (o) =>
      o.value.toLowerCase() === rawRisk.toLowerCase() ||
      String(o.rate * 100) === rawRisk
  );
  const parsedCustomJkk = parseFloat(rawRisk);
  const jkkRate =
    jkkOpt?.rate ??
    (!isNaN(parsedCustomJkk) && parsedCustomJkk > 0
      ? parsedCustomJkk > 1
        ? parsedCustomJkk / 100
        : parsedCustomJkk > 0.05
          ? parsedCustomJkk / 100
          : parsedCustomJkk
      : BPJS_CONFIG.KETENAGAKERJAAN.JKK.DEFAULT_RATE);

  const jkkAmount = tkActive && hasJkk ? Math.round(tkWageBase * jkkRate) : 0;

  const jkmRate = BPJS_CONFIG.KETENAGAKERJAAN.JKM.EMPLOYER_RATE;
  const jkmAmount = tkActive && hasJkm ? Math.round(tkWageBase * jkmRate) : 0;

  const totalTkEe = jhtEe + jpEe;
  const totalTkEr = jhtEr + jpEr + jkkAmount + jkmAmount;

  return {
    kesehatan: {
      wageBase: kesWageBase,
      cappedWageBase: kesCapped,
      employeeAmount: kesEmployee,
      employerAmount: kesEmployer,
      totalAmount: kesEmployee + kesEmployer,
    },
    ketenagakerjaan: {
      jht: { employeeAmount: jhtEe, employerAmount: jhtEr },
      jp: { employeeAmount: jpEe, employerAmount: jpEr, cappedWage: jpCapped },
      jkk: { amount: jkkAmount, rate: jkkRate },
      jkm: { amount: jkmAmount, rate: jkmRate },
      totalEmployeeDeduction: totalTkEe,
      totalEmployerContribution: totalTkEr,
      totalStatutoryPayment: totalTkEe + totalTkEr,
    },
  };
}
