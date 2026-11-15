export type ContractCategory = 'KONTRAK_BARU' | 'PERPANJANG_KONTRAK' | 'PROMOSI' | 'SURAT_PERINGATAN' | 'PEMBERHENTIAN';

export type ContractType = 
  // 1. Kontrak Baru
  | 'PKWT' 
  | 'PKWTT' 
  | 'INTERNSHIP' 
  | 'FREELANCE'
  // 2. Perpanjangan Kontrak
  | 'RENEWAL_PKWT'
  // 3. SK Promosi Jabatan
  | 'SK_PROMOSI'
  // 4. Surat Peringatan
  | 'SP1'
  | 'SP2'
  | 'SP3'
  // 5. Pemberhentian / Pengakhiran
  | 'END_CONTRACT'
  | 'PHK'
  | 'RESIGN_ACCEPTANCE';

export type ContractLanguageMode = 'id' | 'en' | 'bilingual';

export interface ContractPartyCompany {
  companyName: string;
  legalEntity: string; // PT, CV, Firma, Perorangan
  nibOrNpwp: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  representativeName: string;
  representativePosition: string; // Direktur Utama, HR Director, HR Manager
  representativeIdentityNumber: string; // NIK KTP atau NIP
}

export interface ContractPartyEmployee {
  employeeId?: string; // Reference to internal Employee ID if selected
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  city: string;
  phone: string;
  email: string;
  emergencyContact?: string;
  npwp?: string;
  bpjsKesehatanNo?: string;
  bpjsKetenagakerjaanNo?: string;
}

export interface ContractJobDetails {
  positionTitle: string;
  positionTitleEn?: string;
  department: string;
  departmentEn?: string;
  jobGrade?: string;
  directSupervisor: string; // Atasan Langsung
  directSupervisorEn?: string;
  workLocationType: 'WFO (Kantor)' | 'WFH (Remote)' | 'Hybrid' | 'On-Site Lapangan';
  workLocationAddress: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (Wajib untuk PKWT / Magang / Freelance)
  contractDurationMonths?: number;
  probationDurationMonths?: number; // Khusus PKWTT (Maks 3 bulan)
  workingDaysPerWeek: number; // 5 atau 6 hari
  workingHoursPerDay: number; // 8 jam (5 hari) atau 7 jam (6 hari)
  workingHoursSchedule: string; // Misal: 08:30 - 17:30 WIB
  restHoursSchedule?: string; // Misal: 12:00 - 13:00 WIB (1 jam istirahat)
  workDaysDetail?: string; // Misal: 'Senin s/d Jumat' | 'Senin s/d Sabtu' | 'Jadwal Roster Shift'
  workScheduleType?: '5_HARI' | '6_HARI' | 'SHIFT' | 'FLEKSIBEL' | 'CUSTOM';
  shiftDetails?: string; // Misal: 'Shift 1 (07:00-16:00), Shift 2 (15:00-00:00), Shift 3 (23:00-08:00)'
  isOvertimeApplicable: boolean;
  overtimeNotes?: string;
  noticePeriodDays: number; // Standar 30 hari (One month notice)
}

export interface ContractCompensation {
  basicSalary: number;
  fixedAllowance: number; // Tunjangan Tetap (Jabatan / Keahlian)
  fixedAllowanceDescription?: string;
  variableAllowance: number; // Tunjangan Variabel (Makan / Transport)
  variableAllowanceDescription?: string;
  paydayDate: number; // Tanggal penggajian (misal tgl 25)
  paymentMethod: string; // Transfer Bank
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  hasBpjsKetenagakerjaan: boolean;
  hasBpjsKesehatan: boolean;
  hasThr: boolean; // THR Keagamaan
  hasPkwtCompensation: boolean; // Uang Kompensasi PKWT PP 35/2021
}

// Data spesifik untuk Perpanjangan Kontrak (Addendum)
export interface ContractRenewalDetails {
  previousContractNumber: string; // Nomor Kontrak Awal
  previousStartDate: string; // Mulai Kontrak Awal
  previousEndDate: string; // Akhir Kontrak Awal
  renewalStartDate: string; // Mulai Perpanjangan Baru
  renewalEndDate: string; // Akhir Perpanjangan Baru
  renewalDurationMonths: number; // Durasi Perpanjangan (Bulan)
  isSalaryAdjusted: boolean; // Apakah ada kenaikan gaji
  newBasicSalary?: number;
  renewalReason: string; // Pertimbangan perpanjangan kinerja
}

// Data spesifik untuk Surat Peringatan (SP 1, SP 2, SP 3)
export interface ContractWarningDetails {
  warningLevel: 1 | 2 | 3; // SP 1, SP 2, SP 3
  incidentDate: string; // Tanggal terjadinya pelanggaran
  violationCategory: string; // Keterlambatan, Indisipliner, Kinerja Buruk, Pelanggaran SOP, dll
  violationDescription: string; // Kronologi pelanggaran
  violationClauseReference: string; // Rujukan Pasal PP/PKB (misal Pasal 15 ayat 2)
  previousWarningNumber?: string; // Nomor SP sebelumnya jika SP2/SP3
  previousWarningDate?: string;
  validUntilDate: string; // Masa berlaku SP (Standar 6 Bulan)
  correctiveActions: string; // Arahan tindakan perbaikan
  consequences: string; // Konsekuensi jika mengulangi
}

// Data spesifik untuk Surat Pemberhentian / PHK / Resign / Akhir PKWT
export interface ContractTerminationDetails {
  terminationType: 'SELESAI_PKWT' | 'PHK' | 'RESIGN_ACCEPTANCE';
  terminationReason: string; // Selesai masa kerja, Pengunduran diri, Efisiensi, Pelanggaran berat
  noticeDate: string; // Tanggal surat / pemberitahuan
  effectiveDate: string; // Tanggal efektif berakhirnya hubungan kerja
  lastWorkingDay: string; // Hari kerja terakhir
  // Hak & Kompensasi Finansial
  severancePay: number; // Uang Pesangon (UP)
  serviceAwardPay: number; // Uang Penghargaan Masa Kerja (UPMK)
  rightsCompensationPay: number; // Uang Penggantian Hak (UPH)
  pkwtCompensationPay: number; // Uang Kompensasi PKWT (PP 35/2021)
  totalFinancialSettlement: number;
  paymentReleaseDate: string; // Tanggal pencairan hak
  // Paklaring / Surat Pengalaman Kerja
  includePaklaring: boolean;
  paklaringReferenceNumber: string;
  employmentConductDescription: string; // Penilaian kinerja selama bekerja
  assetHandoverChecklist: string[]; // Laptop, ID Card, Akses Email, Mobil Dinas
}

// Data spesifik untuk Surat Keputusan Promosi Jabatan
export interface ContractPromotionDetails {
  previousPositionTitle: string;
  newPositionTitle: string;
  previousDepartment: string;
  newDepartment: string;
  previousJobGrade?: string;
  newJobGrade?: string;
  effectiveDate: string;
  previousBasicSalary?: number;
  newBasicSalary?: number;
  considerations: string[]; // Menimbang
  legalReferences: string[]; // Mengingat
  observations: string[]; // Memperhatikan
  decisions: string[]; // Menetapkan (KESATU, KEDUA, KETIGA, KEEMPAT)
}

export interface ContractClause {
  id: string;
  articleNumber: number; // Pasal 1, 2, dst.
  titleId: string; // e.g. "KEDUDUKAN DAN TUGAS"
  titleEn: string; // e.g. "POSITION AND RESPONSIBILITIES"
  contentId: string; // Teks isi pasal Bahasa Indonesia
  contentEn: string; // Teks isi pasal Bahasa Inggris
  isMandatory: boolean; // Klausul wajib regulasi vs opsional
  isEnabled: boolean; // Apakah disertakan dalam draf
  category: 'ketentuan_umum' | 'waktu_kerja' | 'upah_benefit' | 'kewajiban_nda' | 'sanksi_disiplin' | 'pengakhiran' | 'penyelesaian_perselisihan' | 'penutup';
}

export interface ContractDocument {
  id: string;
  contractNumber: string; // e.g., 001/HRM-PKWT/X/2026
  contractType: ContractType;
  category: ContractCategory;
  languageMode: ContractLanguageMode; // 'id' | 'en' | 'bilingual'
  titleId: string;
  titleEn: string;
  signingDate: string; // YYYY-MM-DD
  signingCity: string;
  company: ContractPartyCompany;
  employee: ContractPartyEmployee;
  job: ContractJobDetails;
  compensation: ContractCompensation;
  clauses: ContractClause[];
  // Modul Data Khusus
  renewal?: ContractRenewalDetails;
  warning?: ContractWarningDetails;
  termination?: ContractTerminationDetails;
  promotion?: ContractPromotionDetails;
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}
