import { ContractDocument, ContractType } from './types';
import { createInitialContractDraft, generateDefaultClauses } from './contract-templates';

const STORAGE_KEY = 'hr_matrix_saved_contracts_v1';

/**
 * Generate high-quality realistic initial contracts
 */
export function getInitialSeedContracts(): ContractDocument[] {
  // 1. Dokumen PKWT
  const doc1 = createInitialContractDraft('PKWT');
  doc1.id = 'doc_pkwt_001';
  doc1.contractNumber = '042/HRM-PKWT/X/2026';
  doc1.signingDate = '2026-10-01';
  doc1.signingCity = 'Jakarta Selatan';
  doc1.employee = {
    fullName: 'Budi Pratama, S.Kom.',
    nik: '3174051208940003',
    birthPlace: 'Jakarta',
    birthDate: '1994-08-12',
    gender: 'Laki-laki',
    address: 'Jl. Tebet Barat Dalam No. 18, RT 04/RW 02',
    city: 'Jakarta Selatan',
    phone: '081288991234',
    email: 'budi.pratama@example.com',
    emergencyContact: '081299887766 (Istri)',
    npwp: '82.412.345.6-015.000',
    bpjsKesehatanNo: '0001234567891',
    bpjsKetenagakerjaanNo: '21098765432'
  };
  doc1.job = {
    positionTitle: 'Senior Full Stack Developer',
    positionTitleEn: 'Senior Full Stack Developer',
    department: 'Teknologi Informasi & Rekayasa Perangkat Lunak',
    departmentEn: 'Information Technology & Software Engineering',
    directSupervisor: 'Head of Engineering',
    workLocationType: 'Hybrid',
    workLocationAddress: 'Kantor Pusat & Remote',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    contractDurationMonths: 12,
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8,
    workingHoursSchedule: '09:00 - 18:00 WIB',
    isOvertimeApplicable: false,
    noticePeriodDays: 30
  };
  doc1.compensation = {
    basicSalary: 14500000,
    fixedAllowance: 2500000,
    fixedAllowanceDescription: 'Tunjangan Keahlian Khusus (Tech Stack Allowance)',
    variableAllowance: 1000000,
    variableAllowanceDescription: 'Tunjangan Kuota & Komunikasi',
    paydayDate: 25,
    paymentMethod: 'Transfer Bank',
    bankName: 'Bank Central Asia (BCA)',
    bankAccountNumber: '8720192831',
    bankAccountHolder: 'Budi Pratama',
    hasBpjsKetenagakerjaan: true,
    hasBpjsKesehatan: true,
    hasThr: true,
    hasPkwtCompensation: true
  };
  doc1.clauses = generateDefaultClauses('PKWT', doc1);
  doc1.createdAt = '2026-10-01T09:00:00.000Z';
  doc1.updatedAt = '2026-10-01T09:00:00.000Z';

  // 2. Dokumen Perpanjangan (Addendum PKWT)
  const doc2 = createInitialContractDraft('RENEWAL_PKWT');
  doc2.id = 'doc_addendum_002';
  doc2.contractNumber = '018/HRM-ADD-PKWT/X/2026';
  doc2.signingDate = '2026-09-20';
  doc2.signingCity = 'Jakarta Selatan';
  doc2.employee = {
    fullName: 'Siti Rahmawati, S.M.',
    nik: '3276025506960002',
    birthPlace: 'Bandung',
    birthDate: '1996-06-15',
    gender: 'Perempuan',
    address: 'Jl. Margonda Raya No. 45, Beji',
    city: 'Depok',
    phone: '081377889900',
    email: 'siti.rahmawati@example.com',
    emergencyContact: '081399001122 (Orang Tua)',
    npwp: '73.912.456.1-012.000'
  };
  doc2.job = {
    positionTitle: 'Digital Marketing & Growth Specialist',
    positionTitleEn: 'Digital Marketing & Growth Specialist',
    department: 'Pemasaran & Pertumbuhan Bisnis',
    departmentEn: 'Marketing & Business Growth',
    directSupervisor: 'Marketing Manager',
    workLocationType: 'WFO (Kantor)',
    workLocationAddress: 'Kantor Pusat',
    startDate: '2025-10-01',
    endDate: '2027-09-30',
    contractDurationMonths: 12,
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8,
    workingHoursSchedule: '08:30 - 17:30 WIB',
    isOvertimeApplicable: false,
    noticePeriodDays: 30
  };
  doc2.renewal = {
    previousContractNumber: '088/HRM-PKWT/IX/2025',
    previousStartDate: '2025-10-01',
    previousEndDate: '2026-09-30',
    renewalStartDate: '2026-10-01',
    renewalEndDate: '2027-09-30',
    renewalDurationMonths: 12,
    isSalaryAdjusted: true,
    newBasicSalary: 9500000,
    renewalReason: 'Pencapaian KPI triwulanan kategori Sangat Baik (A) dan kontribusi pertumbuhan kampanye digital perusahaan.'
  };
  doc2.compensation = {
    basicSalary: 9500000,
    fixedAllowance: 1500000,
    fixedAllowanceDescription: 'Tunjangan Kinerja Jabatan',
    variableAllowance: 800000,
    variableAllowanceDescription: 'Tunjangan Transportasi',
    paydayDate: 25,
    paymentMethod: 'Transfer Bank',
    bankName: 'Bank Mandiri',
    bankAccountNumber: '1570008899123',
    bankAccountHolder: 'Siti Rahmawati',
    hasBpjsKetenagakerjaan: true,
    hasBpjsKesehatan: true,
    hasThr: true,
    hasPkwtCompensation: true
  };
  doc2.clauses = generateDefaultClauses('RENEWAL_PKWT', doc2);
  doc2.createdAt = '2026-09-20T10:30:00.000Z';
  doc2.updatedAt = '2026-09-20T10:30:00.000Z';

  // 3. Dokumen Surat Peringatan (SP 1)
  const doc3 = createInitialContractDraft('SP1');
  doc3.id = 'doc_sp1_003';
  doc3.contractNumber = '005/HRM-SP-1/X/2026';
  doc3.signingDate = '2026-09-15';
  doc3.signingCity = 'Jakarta Selatan';
  doc3.employee = {
    fullName: 'Dimas Aditya',
    nik: '3175081903970004',
    birthPlace: 'Bekasi',
    birthDate: '1997-03-19',
    gender: 'Laki-laki',
    address: 'Jl. Raya Jatiwaringin No. 102',
    city: 'Bekasi',
    phone: '085712345678',
    email: 'dimas.aditya@example.com'
  };
  doc3.job = {
    positionTitle: 'Staff Operasional Gudang & Logistik',
    department: 'Operasional & Rantai Pasok',
    directSupervisor: 'Supervisor Logistik',
    workLocationType: 'WFO (Kantor)',
    workLocationAddress: 'Pusat Distribusi Pergudangan',
    startDate: '2025-05-01',
    workingDaysPerWeek: 6,
    workingHoursPerDay: 7,
    workingHoursSchedule: '08:00 - 16:00 WIB',
    isOvertimeApplicable: true,
    noticePeriodDays: 30
  };
  doc3.warning = {
    warningLevel: 1,
    incidentDate: '2026-09-12',
    violationCategory: 'Keterlambatan Hadir & Tidak Mengisi Absensi Tanpa Keterangan',
    violationDescription: 'Terhitung terlambat hadir lebih dari 45 menit sebanyak 6 (enam) kali dalam 1 bulan tanpa surat keterangan atau izin resmi atasan.',
    violationClauseReference: 'Pasal 18 Ayat (2) Huruf b Peraturan Perusahaan',
    validUntilDate: '2027-03-15',
    correctiveActions: 'Wajib hadir tepat waktu pukul 08:00 WIB dan melakukan pembinaan disiplin berkala bersama HRD.',
    consequences: 'Apabila mengulangi pelanggaran serupa selama masa berlaku SP 1, maka Perusahaan akan menerbitkan Surat Peringatan Kedua (SP 2).'
  };
  doc3.clauses = generateDefaultClauses('SP1', doc3);
  doc3.createdAt = '2026-09-15T14:00:00.000Z';
  doc3.updatedAt = '2026-09-15T14:00:00.000Z';

  // 4. Dokumen Pengakhiran Kontrak PKWT + Kompensasi
  const doc4 = createInitialContractDraft('END_CONTRACT');
  doc4.id = 'doc_end_004';
  doc4.contractNumber = '012/HRM-END-PKWT/X/2026';
  doc4.signingDate = '2026-09-28';
  doc4.signingCity = 'Jakarta Selatan';
  doc4.employee = {
    fullName: 'Rian Hidayat, S.T.',
    nik: '3171011504950001',
    birthPlace: 'Tangerang',
    birthDate: '1995-04-15',
    gender: 'Laki-laki',
    address: 'Jl. Cendrawasih No. 22',
    city: 'Tangerang Selatan',
    phone: '081290908877',
    email: 'rian.hidayat@example.com'
  };
  doc4.job = {
    positionTitle: 'Quality Assurance Specialist',
    department: 'Kualitas & Pengujian Sistem',
    directSupervisor: 'QA Lead',
    workLocationType: 'WFO (Kantor)',
    workLocationAddress: 'Kantor Pusat',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    contractDurationMonths: 12,
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8,
    workingHoursSchedule: '09:00 - 18:00 WIB',
    isOvertimeApplicable: false,
    noticePeriodDays: 30
  };
  doc4.termination = {
    terminationType: 'SELESAI_PKWT',
    terminationReason: 'Berakhirnya jangka waktu Perjanjian Kerja Waktu Tertentu (PKWT) selama 12 bulan penuh.',
    noticeDate: '2026-09-15',
    effectiveDate: '2026-09-30',
    lastWorkingDay: '2026-09-30',
    severancePay: 0,
    serviceAwardPay: 0,
    rightsCompensationPay: 0,
    pkwtCompensationPay: 8500000,
    totalFinancialSettlement: 8500000,
    paymentReleaseDate: '2026-10-05',
    includePaklaring: true,
    paklaringReferenceNumber: '012/HRM-SKK/X/2026',
    employmentConductDescription: 'Menunjukkan dedikasi, integritas, dan hasil kerja yang sangat baik selama menjalankan tugas pengujian mutu perangkat lunak.',
    assetHandoverChecklist: ['Laptop Kerja ThinkPad X1', 'ID Card & Access Key Card', 'Akses Akun Email & Jira/GitHub', 'Peralatan Uji Perangkat']
  };
  doc4.clauses = generateDefaultClauses('END_CONTRACT', doc4);
  doc4.createdAt = '2026-09-28T16:00:00.000Z';
  doc4.updatedAt = '2026-09-28T16:00:00.000Z';

  return [doc1, doc2, doc3, doc4];
}

/**
 * Get all saved contracts from localStorage with fallback to initial seed
 */
export function getSavedContracts(): ContractDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedContracts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSeedContracts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Failed to load saved contracts from storage', err);
    return getInitialSeedContracts();
  }
}

/**
 * Save or update a contract document in storage
 */
export function saveContractToStorage(doc: ContractDocument): ContractDocument[] {
  try {
    const list = getSavedContracts();
    const existingIndex = list.findIndex(c => c.id === doc.id);
    const now = new Date().toISOString();
    
    const docToSave: ContractDocument = {
      ...doc,
      updatedAt: now,
      createdAt: doc.createdAt || now
    };

    let updatedList: ContractDocument[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = docToSave;
    } else {
      updatedList = [docToSave, ...list];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (err) {
    console.error('Failed to save contract to storage', err);
    return getSavedContracts();
  }
}

/**
 * Delete a contract document from storage
 */
export function deleteContractFromStorage(docId: string): ContractDocument[] {
  try {
    const list = getSavedContracts();
    const filtered = list.filter(c => c.id !== docId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete contract from storage', err);
    return getSavedContracts();
  }
}

/**
 * Duplicate a contract document as a new draft
 */
export function duplicateContractInStorage(docId: string): { list: ContractDocument[]; newDoc?: ContractDocument } {
  try {
    const list = getSavedContracts();
    const target = list.find(c => c.id === docId);
    if (!target) return { list };

    const randomNum = Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();
    const newDoc: ContractDocument = {
      ...JSON.parse(JSON.stringify(target)),
      id: `doc_copy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      contractNumber: target.contractNumber.replace(/^\d+/, String(randomNum)),
      createdAt: now,
      updatedAt: now
    };

    const updatedList = [newDoc, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return { list: updatedList, newDoc };
  } catch (err) {
    console.error('Failed to duplicate contract', err);
    return { list: getSavedContracts() };
  }
}
