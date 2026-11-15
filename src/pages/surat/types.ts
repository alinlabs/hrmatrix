export type LetterType = 
  | 'SK_PROMOSI'
  | 'SK_DEMOSI'
  | 'SK_MUTASI'
  | 'SK_PENGANGKATAN'
  | 'SP1'
  | 'SP2'
  | 'SP3'
  | 'PAKLARING'
  | 'PHK'
  | 'RESIGN_ACCEPTANCE'
  | 'SURAT_TUGAS';

export type LetterCategory = 
  | 'SK_KEPUTUSAN' 
  | 'PERINGATAN' 
  | 'PENGAKHIRAN' 
  | 'KETERANGAN' 
  | 'PENUGASAN';

export interface LetterCompanyInfo {
  companyName: string;
  legalEntity: string; // PT, CV, Firma, Perorangan
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  representativeName: string;
  representativePosition: string; // Direktur Utama, HR Director, HR Manager
  representativeIdentityNumber?: string;
}

export interface LetterEmployeeInfo {
  employeeId?: string;
  fullName: string;
  nik: string;
  positionTitle: string;
  department: string;
  jobGrade?: string;
  startDate?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Data spesifik untuk SK Promosi / Demosi / Mutasi / Pengangkatan
export interface LetterCareerChangeData {
  previousPosition: string;
  newPosition: string;
  previousDepartment: string;
  newDepartment: string;
  previousJobGrade?: string;
  newJobGrade?: string;
  previousSalary?: number;
  newSalary?: number;
  previousAllowance?: number;
  newAllowance?: number;
  effectiveDate: string;
  locationOrigin?: string;
  locationDestination?: string;
  probationDurationMonths?: number;
  considerations: string[]; // Menimbang
  legalReferences: string[]; // Mengingat
  observations: string[]; // Memperhatikan
  decisions: string[]; // Menetapkan / Memutuskan
}

// Data spesifik untuk Surat Peringatan (SP 1, SP 2, SP 3)
export interface LetterWarningData {
  warningLevel: 1 | 2 | 3;
  incidentDate: string;
  violationCategory: string; // Indisipliner, Keterlambatan, Kinerja, Pelanggaran SOP
  violationDescription: string; // Kronologi pelanggaran
  violationClauseReference: string; // Rujukan PP / PKB (Pasal X ayat Y)
  validUntilDate: string; // Standar 6 bulan sejak diterbitkan
  previousWarningNumber?: string;
  correctiveActions: string; // Tindakan perbaikan yang harus dilakukan
  consequences: string; // Sanksi lanjutan bila tidak ada perbaikan
}

// Data spesifik untuk Surat Pengalaman Kerja / Paklaring & Resign
export interface LetterCertificateData {
  employmentStartDate: string;
  employmentEndDate: string;
  lastPosition: string;
  lastDepartment: string;
  conductRating: 'Sangat Baik' | 'Baik' | 'Cukup';
  reasonForLeaving: 'Selesai Masa Kontrak' | 'Pengunduran Diri Sukarela' | 'Pensiun';
  recommendationNote: string;
  certificateNumber: string;
}

// Data spesifik untuk Surat PHK
export interface LetterTerminationData {
  terminationReason: string; // Efisiensi, Pelanggaran Berat, Tutup Usaha, dll
  effectiveDate: string;
  lastWorkingDay: string;
  severancePay: number; // Pesangon
  serviceAwardPay: number; // UPMK
  rightsCompensationPay: number; // UPH
  pkwtCompensationPay: number; // Kompensasi PKWT PP 35/2021
  totalSettlement: number;
  paymentDate: string;
  returnedAssets: string[]; // Laptop, ID Card, Akses Email, Kendaraan
}

// Data spesifik untuk Surat Tugas / Perjalanan Dinas
export interface LetterAssignmentData {
  destinationCity: string;
  destinationCompanyOrPlace: string;
  purposeOfDuty: string; // Keperluan / Agenda Tugas
  departureDate: string;
  returnDate: string;
  transportationType: 'Pesawat' | 'Kereta Api' | 'Mobil Dinas' | 'Operasional Kantor';
  accommodation: string;
  dailyAllowance: number; // Uang saku harian
  specialInstructions?: string;
}

export interface OfficialLetterDocument {
  id: string;
  letterNumber: string; // e.g. 018/SK-HRM/DIR/X/2026
  letterType: LetterType;
  category: LetterCategory;
  title: string;
  subtitle?: string;
  issuingDate: string; // YYYY-MM-DD
  issuingCity: string;
  company: LetterCompanyInfo;
  employee: LetterEmployeeInfo;
  
  // Dynamic Content Modules
  careerChange?: LetterCareerChangeData;
  warning?: LetterWarningData;
  certificate?: LetterCertificateData;
  termination?: LetterTerminationData;
  assignment?: LetterAssignmentData;

  customNotes?: string;
  signatoryTitle: string; // e.g. "Direktur Utama", "Head of People & HR"
  signatoryName: string;
  createdAt: string;
  updatedAt: string;
}
