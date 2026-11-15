/**
 * Standar Master Data & Template Opsi Struktur Organisasi
 * Terdiri dari: Jenis Kategori Pekerjaan, Departemen, dan Divisi.
 * Sumber acuan baku untuk dropdown, filter, dan pembuatan Jobdesk/Posisi Baru.
 */

export interface MasterOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
}

/**
 * 1. TEMPLATE OPSI JENIS KATEGORI (Job Categories)
 */
export const TEMPLATE_CATEGORIES = [
  'Alat Kesehatan',
  'Arsitektur',
  'Asuransi',
  'E Commerce',
  'Elektronik',
  'Energi',
  'Farmasi',
  'Fesyen',
  'Fnb',
  'Hiburan',
  'Hukum',
  'Investasi',
  'Jasa Profesional',
  'Keamanan',
  'Kecantikan',
  'Kehutanan',
  'Kesehatan',
  'Konstruksi',
  'Konsultasi',
  'Konsumsi',
  'Kreatif',
  'Logistik',
  'Manufaktur',
  'Maritim Pelayaran',
  'Media',
  'Nirlaba',
  'Otomotif',
  'Pangan',
  'Pemerintahan',
  'Pendidikan',
  'Penerbangan',
  'Pengembangan',
  'Penjualan',
  'Perbankan',
  'Perhotelan',
  'Perikanan',
  'Perkantoran',
  'Perkebunan',
  'Pertambangan',
  'Pertanian',
  'Peternakan',
  'Properti',
  'Rantai Pasok',
  'Riset',
  'Ritel',
  'Sdm',
  'Teknologi',
  'Telekomunikasi',
  'Transportasi',
  'Utilitas'
] as const;

export const STANDARD_JOB_CATEGORIES = [
  'Office',
  'Operational',
  'Field (Lapangan / Site)',
  'Technology & IT',
  'Sales & Commercial',
  'Creative & Marketing',
  'Finance & Accounting',
  'Factory & Manufacturing',
  'Customer Support & Service',
  'Logistics & Supply Chain',
  'Medical & Healthcare',
  'Legal & Compliance',
  'Research & Development',
  'Executive & Management'
] as const;

export const JOB_CATEGORIES = Array.from(
  new Set([...TEMPLATE_CATEGORIES, ...STANDARD_JOB_CATEGORIES])
).sort();

export type JobCategory = string;

export const JOB_CATEGORY_OPTIONS: MasterOption[] = JOB_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat
}));

/**
 * 2. TEMPLATE OPSI DEPARTEMEN (Departments)
 */
export const TEMPLATE_DEPARTMENTS = [
  'Alat Department',
  'Arsitektur Department',
  'Asuransi Department',
  'E Department',
  'Elektronik Department',
  'Energi Department',
  'Farmasi Department',
  'Fesyen Department',
  'Fnb Department',
  'Hiburan Department',
  'Hukum Department',
  'Investasi Department',
  'Jasa Department',
  'Keamanan Department',
  'Kecantikan Department',
  'Kehutanan Department',
  'Kesehatan Department',
  'Konstruksi Department',
  'Konsultasi Department',
  'Konsumsi Department',
  'Kreatif Department',
  'Logistik Department',
  'Manufaktur Department',
  'Maritim Department',
  'Media Department',
  'Nirlaba Department',
  'Otomotif Department',
  'Pangan Department',
  'Pemerintahan Department',
  'Pendidikan Department',
  'Penerbangan Department',
  'Pengembangan Department',
  'Penjualan Department',
  'Perbankan Department',
  'Perhotelan Department',
  'Perikanan Department',
  'Perkantoran Department',
  'Perkebunan Department',
  'Pertambangan Department',
  'Pertanian Department',
  'Peternakan Department',
  'Properti Department',
  'Rantai Department',
  'Riset Department',
  'Ritel Department',
  'Sdm Department',
  'Teknologi Department',
  'Telekomunikasi Department',
  'Transportasi Department',
  'Utilitas Department'
] as const;

export const STANDARD_DEPARTMENTS = [
  'General Affairs',
  'Human Resources',
  'Information Technology',
  'Finance & Accounting',
  'Marketing & Communications',
  'Sales & Business Development',
  'Operations',
  'Supply Chain & Logistics',
  'Production & Manufacturing',
  'Quality Assurance & Control',
  'Legal & Compliance',
  'Research & Development',
  'Customer Support & Service',
  'Secretarial & Executive',
  'Health, Safety & Environment (HSE)'
] as const;

export const DEPARTMENTS = Array.from(
  new Set([...STANDARD_DEPARTMENTS, ...TEMPLATE_DEPARTMENTS])
).sort();

export type DepartmentName = string;

export const DEPARTMENT_OPTIONS: MasterOption[] = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept
}));

/**
 * 3. TEMPLATE OPSI DIVISI BERDASARKAN DEPARTEMEN (Divisions Mapping)
 */
export const DIVISIONS_BY_DEPARTMENT: Record<string, string[]> = {
  'General Affairs': [
    'General Affairs',
    'Asset & Facility Management',
    'Building Maintenance & Utilities',
    'Vehicle & Driver Fleet',
    'Office Procurement & Services'
  ],
  'Human Resources': [
    'HR Operations & Admin',
    'Talent Acquisition & Recruitment',
    'People & Organizational Development',
    'Compensation & Benefits',
    'Industrial & Employee Relations'
  ],
  'Information Technology': [
    'IT Infrastructure & Network',
    'Software Engineering & Development',
    'Product & UI/UX Design',
    'Data & Business Analytics',
    'IT Security & Cyber Governance',
    'IT Support & Helpdesk'
  ],
  'Finance & Accounting': [
    'Accounting & Financial Reporting',
    'Taxation & Tax Compliance',
    'Financial Planning & Analysis (FP&A)',
    'Treasury & Cashier Management',
    'Internal Audit & Risk Assessment'
  ],
  'Marketing & Communications': [
    'Digital Marketing & Performance',
    'Brand Management & Public Relations',
    'Content & Creative Production',
    'Product Marketing & Promotions'
  ],
  'Sales & Business Development': [
    'Direct Sales & Field Sales',
    'B2B & Enterprise Account Management',
    'Business Development & Partnerships',
    'Telemarketing & Inside Sales',
    'Retail Sales Operations'
  ],
  'Operations': [
    'Core Operations',
    'Project Management Office (PMO)',
    'Branch Operations Management',
    'Field Services & Deployment'
  ],
  'Supply Chain & Logistics': [
    'Warehouse & Inventory Management',
    'Procurement & Purchasing',
    'Logistics & Fleet Distribution',
    'Customs & Freight Forwarding'
  ],
  'Production & Manufacturing': [
    'Production Line & Assembly',
    'Plant Maintenance & Utility Engineering',
    'Tooling & Machinery Operations',
    'Process Optimization'
  ],
  'Quality Assurance & Control': [
    'Quality Control (QC Inspections)',
    'Quality Assurance (QA Systems)',
    'Standardization & ISO Certification'
  ],
  'Legal & Compliance': [
    'Legal Advisory & Contract Review',
    'Corporate Licensing & Permitting',
    'Corporate Governance & Legal Risk'
  ],
  'Research & Development': [
    'Product R&D & Prototyping',
    'Recipe & Formulation Development',
    'Technical Research & Testing'
  ],
  'Customer Support & Service': [
    'Customer Care & Call Center',
    'Technical Support & Troubleshooting',
    'Customer Success & Retention'
  ],
  'Secretarial & Executive': [
    'Corporate Secretary',
    'Executive Assistant & Protocol'
  ],
  'Health, Safety & Environment (HSE)': [
    'K3 Safety & Field Operations',
    'Environmental Compliance & Waste Management',
    'Occupational Health'
  ]
};

/**
 * Daftar Seluruh Opsi Divisi Gabungan (Flat List)
 */
export const ALL_DIVISIONS: string[] = Array.from(
  new Set([
    'Operational Division',
    'Management Division',
    ...Object.values(DIVISIONS_BY_DEPARTMENT).flat()
  ])
).sort();

export const DIVISION_OPTIONS: MasterOption[] = ALL_DIVISIONS.map((div) => ({
  value: div,
  label: div
}));

/**
 * Helper function untuk mengambil daftar opsi divisi berdasarkan departemen yang dipilih.
 * Jika departemen belum dipilih atau tidak ditemukan di mapping, mengembalikan seluruh daftar divisi.
 */
export const getDivisionOptionsByDepartment = (departmentName?: string): MasterOption[] => {
  if (!departmentName) {
    return DIVISION_OPTIONS;
  }

  // Exact match
  if (DIVISIONS_BY_DEPARTMENT[departmentName]) {
    const list = Array.from(new Set(['Operational Division', ...DIVISIONS_BY_DEPARTMENT[departmentName]]));
    return list.map(div => ({ value: div, label: div }));
  }

  // Check normalized mapping (e.g. "Sdm Department" -> "Human Resources", "Teknologi Department" -> "Information Technology")
  const norm = departmentName.toLowerCase().replace(/\s+department$/i, '').trim();
  const matchedKey = Object.keys(DIVISIONS_BY_DEPARTMENT).find(k => {
    const kNorm = k.toLowerCase().replace(/\s+department$/i, '').trim();
    return kNorm === norm || 
      (norm === 'sdm' && k.includes('Human Resources')) ||
      (norm === 'teknologi' && k.includes('Information Technology')) ||
      (norm === 'perkantoran' && k.includes('General Affairs')) ||
      (norm === 'keuangan' && k.includes('Finance')) ||
      (norm === 'pemasaran' && k.includes('Marketing')) ||
      (norm === 'penjualan' && k.includes('Sales')) ||
      (norm === 'manufaktur' && k.includes('Production'));
  });

  if (matchedKey && DIVISIONS_BY_DEPARTMENT[matchedKey]) {
    const list = Array.from(new Set(['Operational Division', ...DIVISIONS_BY_DEPARTMENT[matchedKey]]));
    return list.map(div => ({ value: div, label: div }));
  }

  return DIVISION_OPTIONS;
};
