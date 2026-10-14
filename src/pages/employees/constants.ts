export const DEFAULT_EMPLOYEE_DOCUMENTS = [
  { name: 'KTP (Kartu Tanda Penduduk)', url: '', category: 'Identitas' },
  { name: 'Ijazah & Transkrip Nilai Terakhir', url: '', category: 'Pendidikan' },
  { name: 'Kartu Keluarga (KK)', url: '', category: 'Identitas' },
  { name: 'NPWP (Nomor Pokok Wajib Pajak)', url: '', category: 'Perpajakan' },
  { name: 'CV / Resume & Portofolio', url: '', category: 'Karier' },
  { name: 'Pas Foto Karyawan (Terbaru)', url: '', category: 'Identitas' },
  { name: 'Buku Tabungan / Rekening Bank', url: '', category: 'Payroll' },
  { name: 'Surat Perjanjian Kerja / Kontrak (PKWT/PKWTT)', url: '', category: 'Legalitas' },
  { name: 'Kartu BPJS Kesehatan & Ketenagakerjaan', url: '', category: 'Jaminan Sosial' },
  { name: 'SKCK (Surat Keterangan Catatan Kepolisian)', url: '', category: 'Legalitas' },
  { name: 'Sertifikat Pelatihan / Keahlian', url: '', category: 'Kompetensi' }
];

import { BANK_PROVIDERS, EWALLET_PROVIDERS } from '../../data/master';

export const BANK_OPTIONS = BANK_PROVIDERS.map(b => ({
  value: b.value,
  label: b.label
}));

export const EWALLET_OPTIONS = EWALLET_PROVIDERS.map(w => ({
  value: w.value,
  label: w.label
}));

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'Transfer Bank', label: 'Transfer Rekening Bank' },
  { value: 'Tunai (Cash)', label: 'Tunai / Kas Langsung' },
  { value: 'E-Wallet / Digital', label: 'E-Wallet / Dompet Digital' },
  { value: 'Cek / Bilyet Giro', label: 'Cek / Bilyet Giro' }
];

export const RESIDENCE_STATUS_OPTIONS = [
  { value: 'Milik Sendiri', label: 'Rumah Milik Sendiri' },
  { value: 'Kontrak / Sewa', label: 'Kontrak / Sewa Rumah' },
  { value: 'Rumah Keluarga / Orang Tua', label: 'Tinggal Bersama Orang Tua / Keluarga' },
  { value: 'Mess / Asrama Perusahaan', label: 'Mess / Asrama Perusahaan' },
  { value: 'Kost', label: 'Kost / Kosan' },
  { value: 'Lainnya', label: 'Lainnya' }
];

export const PROVINCE_OPTIONS = [
  { value: 'DKI Jakarta', label: 'DKI Jakarta' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Banten', label: 'Banten' },
  { value: 'Jawa Tengah', label: 'Jawa Tengah' },
  { value: 'DI Yogyakarta', label: 'DI Yogyakarta' },
  { value: 'Jawa Timur', label: 'Jawa Timur' },
  { value: 'Bali', label: 'Bali' },
  { value: 'Sumatera Utara', label: 'Sumatera Utara' },
  { value: 'Sumatera Barat', label: 'Sumatera Barat' },
  { value: 'Riau', label: 'Riau' },
  { value: 'Kepulauan Riau', label: 'Kepulauan Riau' },
  { value: 'Sumatera Selatan', label: 'Sumatera Selatan' },
  { value: 'Lampung', label: 'Lampung' },
  { value: 'Kalimantan Barat', label: 'Kalimantan Barat' },
  { value: 'Kalimantan Timur', label: 'Kalimantan Timur' },
  { value: 'Kalimantan Selatan', label: 'Kalimantan Selatan' },
  { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
  { value: 'Sulawesi Utara', label: 'Sulawesi Utara' },
  { value: 'Nusa Tenggara Barat', label: 'Nusa Tenggara Barat' },
  { value: 'Nusa Tenggara Timur', label: 'Nusa Tenggara Timur' },
  { value: 'Papua', label: 'Papua' },
  { value: 'Lainnya', label: 'Provinsi Lainnya' }
];

export const DEFAULT_DEPARTMENT_OPTIONS = [
  'Teknologi Informasi (IT)',
  'Human Resources (HRD)',
  'Keuangan & Akuntansi (Finance)',
  'Pemasaran & Penjualan (Marketing & Sales)',
  'Operasional (Operations)',
  'Pengembangan Produk (Product)',
  'Layanan Pelanggan (Customer Support)',
  'Hukum & Kepatuhan (Legal)',
  'Umum & Rumah Tangga (General Affairs)'
];

export const DEFAULT_POSITION_OPTIONS = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Product Manager',
  'HR Specialist',
  'HR Manager',
  'Accountant',
  'Finance Executive',
  'Marketing Specialist',
  'Sales Representative',
  'Operations Staff',
  'Administrative Assistant',
  'General Manager'
];

export {
  PTKP_DATA,
  EMPLOYEE_TAX_TYPES,
  TAX_METHODS,
  BPJS_CONFIG,
  JKK_RISK_OPTIONS,
  BPJS_HEALTH_PARTICIPANT_OPTIONS
} from '../../services/taxBpjsService';

export {
  EMPLOYEE_TYPE_OPTIONS,
  mapEmployeeTypeToTaxType,
  mapContractTypeToEmployeeType
} from '../../data/master';

