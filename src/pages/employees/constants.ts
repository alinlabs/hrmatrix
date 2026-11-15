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

