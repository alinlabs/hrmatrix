import { 
  ContractClause, 
  ContractType, 
  ContractCategory, 
  ContractDocument 
} from './types';

/**
 * Format angka ke mata uang Rupiah
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Konversi angka ke terbilang bahasa Indonesia (misal: 5.000.000 -> lima juta rupiah)
 */
export function terbilang(n: number): string {
  if (isNaN(n) || n === null || n === undefined || n === 0) return 'nol rupiah';
  
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  
  function angkaKeKata(num: number): string {
    num = Math.floor(Math.abs(num));
    if (num < 12) {
      return satuan[num] || '';
    } else if (num < 20) {
      return (satuan[num - 10] || '') + ' belas';
    } else if (num < 100) {
      const p = Math.floor(num / 10);
      const s = num % 10;
      return (satuan[p] || '') + ' puluh ' + (satuan[s] || '');
    } else if (num < 200) {
      return 'seratus ' + angkaKeKata(num - 100);
    } else if (num < 1000) {
      const r = Math.floor(num / 100);
      return (satuan[r] || '') + ' ratus ' + angkaKeKata(num % 100);
    } else if (num < 2000) {
      return 'seribu ' + angkaKeKata(num - 1000);
    } else if (num < 1000000) {
      return angkaKeKata(Math.floor(num / 1000)) + ' ribu ' + angkaKeKata(num % 1000);
    } else if (num < 1000000000) {
      return angkaKeKata(Math.floor(num / 1000000)) + ' juta ' + angkaKeKata(num % 1000000);
    } else if (num < 1000000000000) {
      return angkaKeKata(Math.floor(num / 1000000000)) + ' milyar ' + angkaKeKata(num % 1000000000);
    } else if (num < 1000000000000000) {
      return angkaKeKata(Math.floor(num / 1000000000000)) + ' triliun ' + angkaKeKata(num % 1000000000000);
    }
    return '';
  }

  const raw = String(angkaKeKata(n) || '');
  const hasil = raw.replace(/\s+/g, ' ').trim();
  return (hasil ? hasil + ' rupiah' : 'nol rupiah');
}

/**
 * Konversi angka ke terbilang bahasa Inggris (e.g. 5,000,000 -> five million Indonesian Rupiah)
 */
export function terbilangEn(n: number): string {
  if (isNaN(n) || n === null || n === undefined || n === 0) return 'zero Indonesian Rupiah';

  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertGroup(num: number): string {
    let result = '';
    if (num >= 100) {
      result += (units[Math.floor(num / 100)] || '') + ' hundred ';
      num %= 100;
    }
    if (num >= 20) {
      result += (tens[Math.floor(num / 10)] || '') + ' ';
      num %= 10;
    }
    if (num > 0) {
      result += (units[num] || '') + ' ';
    }
    return result.trim();
  }

  const billion = Math.floor(n / 1000000000);
  const million = Math.floor((n % 1000000000) / 1000000);
  const thousand = Math.floor((n % 1000000) / 1000);
  const remainder = Math.floor(n % 1000);

  let output = '';
  if (billion) output += convertGroup(billion) + ' billion ';
  if (million) output += convertGroup(million) + ' million ';
  if (thousand) output += convertGroup(thousand) + ' thousand ';
  if (remainder) output += convertGroup(remainder) + ' ';

  const raw = String(output || '');
  const res = raw.replace(/\s+/g, ' ').trim();
  return res ? res + ' Indonesian Rupiah' : 'zero Indonesian Rupiah';
}

/**
 * Format tanggal ke format resmi Bahasa Indonesia (e.g. 18 Oktober 2026)
 */
export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format tanggal ke format resmi Bahasa Inggris (e.g. October 18, 2026)
 */
export function formatEnglishDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Mendapatkan nama hari dalam Bahasa Indonesia
 */
export function getIndonesianDayName(dateString: string): string {
  if (!dateString) return 'Hari';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Hari';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  } catch {
    return 'Hari';
  }
}

/**
 * Mendapatkan nama hari dalam Bahasa Inggris
 */
export function getEnglishDayName(dateString: string): string {
  if (!dateString) return 'Day';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Day';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  } catch {
    return 'Day';
  }
}

/**
 * Map ContractType ke ContractCategory
 */
export function getCategoryForType(type: ContractType): ContractCategory {
  switch (type) {
    case 'PKWT':
    case 'PKWTT':
    case 'INTERNSHIP':
    case 'FREELANCE':
      return 'KONTRAK_BARU';
    case 'RENEWAL_PKWT':
      return 'PERPANJANG_KONTRAK';
    case 'SK_PROMOSI':
      return 'PROMOSI';
    case 'SP1':
    case 'SP2':
    case 'SP3':
      return 'SURAT_PERINGATAN';
    case 'END_CONTRACT':
    case 'PHK':
    case 'RESIGN_ACCEPTANCE':
      return 'PEMBERHENTIAN';
    default:
      return 'KONTRAK_BARU';
  }
}

/**
 * Inisialisasi draf dokumen awal sesuai tipe
 */
export function createInitialContractDraft(type: ContractType = 'PKWT'): ContractDocument {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().split('T')[0];

  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const sixMonthsLaterStr = sixMonthsLater.toISOString().split('T')[0];

  const currentYear = new Date().getFullYear();
  const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
  const randomNum = Math.floor(100 + Math.random() * 900);

  const category = getCategoryForType(type);

  const titlesId: Record<ContractType, string> = {
    PKWT: 'SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)',
    PKWTT: 'SURAT PERJANJIAN KERJA WAKTU TIDAK TERTENTU (PKWTT)',
    INTERNSHIP: 'SURAT PERJANJIAN PEMAGANGAN (INTERNSHIP AGREEMENT)',
    FREELANCE: 'SURAT PERJANJIAN KERJASAMA JASA KONTRAK LEPAS (SPK FREELANCE)',
    RENEWAL_PKWT: 'SURAT PERJANJIAN PERPANJANGAN MASA KERJA PKWT (ADDENDUM)',
    SK_PROMOSI: 'SURAT KEPUTUSAN PROMOSI JABATAN & PENYESUAIAN UPAH',
    SP1: 'SURAT PERINGATAN PERTAMA (SP 1)',
    SP2: 'SURAT PERINGATAN KEDUA (SP 2)',
    SP3: 'SURAT PERINGATAN KETIGA & TERAKHIR (SP 3)',
    END_CONTRACT: 'SURAT PEMBERITAHUAN BERAKHIRNYA MASA KONTRAK KERJA (PKWT)',
    PHK: 'SURAT PEMUTUSAN HUBUNGAN KERJA (PHK)',
    RESIGN_ACCEPTANCE: 'SURAT PENERIMAAN PENGUNDURAN DIRI & PENGALAMAN KERJA (PAKLARING)'
  };

  const titlesEn: Record<ContractType, string> = {
    PKWT: 'FIXED-TERM EMPLOYMENT AGREEMENT (PKWT)',
    PKWTT: 'PERMANENT EMPLOYMENT AGREEMENT (PKWTT)',
    INTERNSHIP: 'APPRENTICESHIP & INTERNSHIP AGREEMENT',
    FREELANCE: 'INDEPENDENT CONTRACTOR & PROFESSIONAL SERVICES AGREEMENT',
    RENEWAL_PKWT: 'AMENDMENT & EMPLOYMENT EXTENSION AGREEMENT (ADDENDUM)',
    SK_PROMOSI: 'DECREE OF JOB PROMOTION AND SALARY ADJUSTMENT',
    SP1: 'FIRST WARNING LETTER (SP 1)',
    SP2: 'SECOND WARNING LETTER (SP 2)',
    SP3: 'THIRD & FINAL WARNING LETTER (SP 3)',
    END_CONTRACT: 'NOTICE OF CONTRACT COMPLETION & COMPENSATION (PKWT)',
    PHK: 'EMPLOYMENT TERMINATION NOTICE (PHK)',
    RESIGN_ACCEPTANCE: 'RESIGNATION ACCEPTANCE & CERTIFICATE OF EMPLOYMENT'
  };

  const prefixes: Record<ContractType, string> = {
    PKWT: 'PKWT',
    PKWTT: 'PKWTT',
    INTERNSHIP: 'MAGANG',
    FREELANCE: 'SPK-FL',
    RENEWAL_PKWT: 'ADD-PKWT',
    SK_PROMOSI: 'SK-PROMOSI',
    SP1: 'SP-1',
    SP2: 'SP-2',
    SP3: 'SP-3',
    END_CONTRACT: 'END-PKWT',
    PHK: 'PHK',
    RESIGN_ACCEPTANCE: 'SKK-RESIGN'
  };

  const baseDoc: ContractDocument = {
    id: `doc-${Date.now()}`,
    contractNumber: `${randomNum}/HRM-${prefixes[type]}/${currentMonthRoman}/${currentYear}`,
    contractType: type,
    category,
    languageMode: 'id',
    titleId: titlesId[type],
    titleEn: titlesEn[type],
    signingDate: today,
    signingCity: 'Jakarta Selatan',
    company: {
      companyName: 'PT INOVASI DIGITAL NUSANTARA',
      legalEntity: 'PT',
      nibOrNpwp: '9120001234567',
      address: 'Gedung Cyber 2 Tower Lantai 18, Jl. H.R. Rasuna Said Blok X-5',
      city: 'Jakarta Selatan, DKI Jakarta 12950',
      phone: '(021) 555-8900',
      email: 'hr@inovasidigital.co.id',
      representativeName: 'Bambang Sudarmono, S.H., M.M.',
      representativePosition: 'Direktur Utama',
      representativeIdentityNumber: '3174091203800001'
    },
    employee: {
      fullName: 'Ahmad Rizki Pratama, S.Kom',
      nik: '3276012408950003',
      birthPlace: 'Bandung',
      birthDate: '1995-08-24',
      gender: 'Laki-laki',
      address: 'Jl. Melati Raya No. 42, RT 003 / RW 008, Kel. Baktijaya, Kec. Sukmajaya',
      city: 'Depok, Jawa Barat 16418',
      phone: '0812-3456-7890',
      email: 'ahmad.rizki.p@gmail.com',
      emergencyContact: 'Siti Aminah (Ibu Kandung) - 0813-9876-5432',
      npwp: '84.123.456.7-412.000',
      bpjsKesehatanNo: '0001234567890',
      bpjsKetenagakerjaanNo: '21098765432'
    },
    job: {
      positionTitle: 'Senior Fullstack Software Engineer',
      positionTitleEn: 'Senior Fullstack Software Engineer',
      department: 'Engineering & Technology',
      departmentEn: 'Engineering & Technology',
      jobGrade: 'Grade 7 (Specialist)',
      directSupervisor: 'Head of Technology & Product',
      directSupervisorEn: 'Head of Technology & Product',
      workLocationType: 'Hybrid',
      workLocationAddress: 'Kantor Pusat Jakarta & Remote Terjadwal',
      startDate: today,
      endDate: type === 'PKWTT' ? undefined : nextYearStr,
      contractDurationMonths: type === 'INTERNSHIP' ? 3 : 12,
      probationDurationMonths: type === 'PKWTT' ? 3 : 0,
      workingDaysPerWeek: 5,
      workingHoursPerDay: 8,
      workingHoursSchedule: '08:30 - 17:30 WIB (Istirahat 12:00 - 13:00 WIB)',
      isOvertimeApplicable: false,
      noticePeriodDays: 30
    },
    compensation: {
      basicSalary: 12500000,
      fixedAllowance: 2500000,
      fixedAllowanceDescription: 'Tunjangan Keahlian & Posisi',
      variableAllowance: 1000000,
      variableAllowanceDescription: 'Tunjangan Komunikasi & Transport',
      paydayDate: 25,
      paymentMethod: 'Transfer Rekening Bank',
      bankName: 'Bank Central Asia (BCA)',
      bankAccountNumber: '542-019-8821',
      bankAccountHolder: 'Ahmad Rizki Pratama',
      hasBpjsKetenagakerjaan: true,
      hasBpjsKesehatan: true,
      hasThr: true,
      hasPkwtCompensation: type === 'PKWT'
    },
    clauses: [],
    // Modul Data Khusus
    renewal: {
      previousContractNumber: `042/HRM-PKWT/X/${currentYear - 1}`,
      previousStartDate: `${currentYear - 1}-10-01`,
      previousEndDate: today,
      renewalStartDate: today,
      renewalEndDate: nextYearStr,
      renewalDurationMonths: 12,
      isSalaryAdjusted: true,
      newBasicSalary: 14000000,
      renewalReason: 'Pencapaian Key Performance Indicator (KPI) tahunan yang melampaui target dan kontribusi strategis pada proyek sistem enterprise.'
    },
    warning: {
      warningLevel: 1,
      incidentDate: today,
      violationCategory: 'Keterlambatan Masuk Kerja & Indisipliner Presensi',
      violationDescription: 'Tercatat melakukan keterlambatan hadir lebih dari 30 menit sebanyak 6 (enam) kali dalam kurun waktu 1 (satu) bulan tanpa pemberitahuan atau izin tertulis resmi kepada atasan langsung.',
      violationClauseReference: 'Pasal 18 ayat 3 Peraturan Perusahaan mengenai Disiplin Jam Kerja',
      validUntilDate: sixMonthsLaterStr,
      correctiveActions: 'Wajib hadir tepat waktu sesuai jadwal kerja operasional, memperbaiki kedisiplinan presensi harian, dan melaporkan kehadiran secara konsisten kepada atasan langsung.',
      consequences: 'Apabila dalam kurun waktu masa berlaku SP 1 karyawan kembali melakukan pelanggaran disiplin kerja, maka Manajemen akan menerbitkan Surat Peringatan Kedua (SP 2) atau sanksi yang lebih berat.'
    },
    termination: {
      terminationType: type === 'END_CONTRACT' ? 'SELESAI_PKWT' : (type === 'PHK' ? 'PHK' : 'RESIGN_ACCEPTANCE'),
      terminationReason: type === 'END_CONTRACT' 
        ? 'Telah berakhirnya jangka waktu Perjanjian Kerja Waktu Tertentu (PKWT) sesuai dengan kesepakatan kontrak kerja.'
        : (type === 'PHK' 
          ? 'Efisiensi restrukturisasi organisasi operasional divisi perusahaan.'
          : 'Atas permohonan pengunduran diri sukarela karyawan untuk melanjutkan pengembangan karier di tempat lain.'),
      noticeDate: today,
      effectiveDate: today,
      lastWorkingDay: today,
      severancePay: 0,
      serviceAwardPay: 0,
      rightsCompensationPay: 1500000,
      pkwtCompensationPay: 12500000,
      totalFinancialSettlement: 14000000,
      paymentReleaseDate: today,
      includePaklaring: true,
      paklaringReferenceNumber: `SKK-${randomNum}/HRD-EXT/${currentMonthRoman}/${currentYear}`,
      employmentConductDescription: 'Selama masa kerja yang bersangkutan telah menunjukkan dedikasi, integritas, loyalitas, dan kontribusi kerja yang sangat baik bagi kemajuan perusahaan.',
      assetHandoverChecklist: ['Unit Laptop MacBook Pro & Charger', 'Kartu Akses Gedung & ID Card Karyawan', 'Email Korporat & Akses Akun Sistem', 'Penyerahan Seluruh Berkas & Dokumentasi Proyek']
    },
    promotion: {
      previousPositionTitle: 'Software Engineer',
      newPositionTitle: 'Senior Software Engineer',
      previousDepartment: 'Engineering & Technology',
      newDepartment: 'Engineering & Technology',
      previousJobGrade: 'Grade 5',
      newJobGrade: 'Grade 7',
      effectiveDate: today,
      previousBasicSalary: 10000000,
      newBasicSalary: 14000000,
      considerations: [
        'Bahwa berdasarkan hasil evaluasi kinerja, dedikasi, serta pencapaian KPI Sdr/i Ahmad Rizki Pratama, S.Kom, Perusahaan memandang perlu untuk melakukan promosi jabatan.',
        'Bahwa karyawan yang bersangkutan dinilai memenuhi kualifikasi, kompetensi, dan kepemimpinan yang dipersyaratkan untuk mengemban wewenang pada posisi jabatan baru.'
      ],
      legalReferences: [
        'Undang-Undang No. 6 Tahun 2023 tentang Cipta Kerja.',
        'Peraturan Pemerintah No. 35 Tahun 2021 tentang PKWT, Waktu Kerja, dan Pemutusan Hubungan Kerja.',
        'Peraturan Perusahaan / PKB PT INOVASI DIGITAL NUSANTARA.'
      ],
      observations: [
        'Rekomendasi tertulis dari Head of Technology & Product.',
        'Persetujuan Direksi dan Departemen Human Resources.'
      ],
      decisions: [
        'KESATU: Mengangkat / Mempromosikan Sdr/i Ahmad Rizki Pratama, S.Kom dari posisi Software Engineer menjadi Senior Software Engineer pada Departemen Engineering & Technology.',
        'KEDUA: Menetapkan penyesuaian Gaji Pokok Baru sebesar Rp 14.000.000,- (Empat Belas Juta Rupiah) per bulan beserta tunjangan jabatan yang berlaku efektif sejak tanggal ' + formatIndonesianDate(today) + '.',
        'KETIGA: Sdr/i Ahmad Rizki Pratama, S.Kom bertanggung jawab langsung kepada Head of Technology & Product dan wajib melaksanakan wewenang serta tugas pekerjaan sesuai deskripsi jabatan baru.',
        'KEEMPAT: Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan, akan dilakukan perbaikan sebagaimana mestinya.'
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  baseDoc.clauses = generateDefaultClauses(type, baseDoc);
  return baseDoc;
}

/**
 * Generator Klausul Pasal Resmi Standar Regulasi Tenaga Kerja Indonesia
 */
export function generateDefaultClauses(type: ContractType, doc: ContractDocument): ContractClause[] {
  const comp = doc.compensation;
  const job = doc.job;
  const totalMonthlyWage = comp.basicSalary + comp.fixedAllowance;

  // 1. KONTRAK KERJA BARU (PKWT, PKWTT, MAGANG, FREELANCE)
  if (type === 'PKWT' || type === 'PKWTT' || type === 'INTERNSHIP' || type === 'FREELANCE') {
    return [
      {
        id: 'cl-1',
        articleNumber: 1,
        titleId: 'KEDUDUKAN, JABATAN DAN PENEMPATAN KERJA',
        titleEn: 'POSITION, TITLE AND WORK ASSIGNMENT',
        contentId: `1. PIHAK PERTAMA mempekerjakan PIHAK KEDUA dan PIHAK KEDUA menyatakan sepakat menerima pekerjaan dari PIHAK PERTAMA dalam jabatan sebagai ${job.positionTitle} pada Departemen ${job.department}.\n2. PIHAK KEDUA bertanggung jawab dan melapor langsung kepada atasan langsung dengan jabatan ${job.directSupervisor}.\n3. Lokasi pelaksanaan kerja bertempat di ${job.workLocationAddress} dengan skema kerja ${job.workLocationType}.\n4. PIHAK PERTAMA berhak melakukan rotasi, mutasi, atau penugasan dinas bagi PIHAK KEDUA ke divisi atau lokasi cabang lain sesuai dengan kebutuhan operasional perusahaan.`,
        contentEn: `1. The FIRST PARTY employs the SECOND PARTY, and the SECOND PARTY agrees to accept employment with the FIRST PARTY in the position of ${job.positionTitleEn || job.positionTitle} within the ${job.departmentEn || job.department} Department.\n2. The SECOND PARTY shall report directly to ${job.directSupervisorEn || job.directSupervisor}.\n3. The work location shall be at ${job.workLocationAddress} under the ${job.workLocationType} arrangement.\n4. The FIRST PARTY reserves the right to rotate, transfer, or assign the SECOND PARTY to other departments or branches based on operational needs.`,
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'cl-2',
        articleNumber: 2,
        titleId: type === 'PKWTT' ? 'MASA PERCOBAAN DAN HUBUNGAN KERJA TETAP' : 'JANGKA WAKTU PERJANJIAN KERJA',
        titleEn: type === 'PKWTT' ? 'PROBATIONARY PERIOD AND PERMANENT EMPLOYMENT' : 'DURATION OF EMPLOYMENT AGREEMENT',
        contentId: type === 'PKWTT'
          ? `1. Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini berlaku sejak tanggal ${formatIndonesianDate(job.startDate)}.\n2. PIHAK KEDUA wajib menjalani masa percobaan (probation) selama ${job.probationDurationMonths || 3} (tiga) bulan terhitung sejak tanggal mulai kerja.\n3. Selama masa percobaan, masing-masing pihak berhak mengakhiri hubungan kerja sewaktu-waktu dengan pemberitahuan tertulis tanpa kewajiban membayar uang ganti rugi.\n4. Setelah lulus masa percobaan dengan evaluasi memuaskan, PIHAK KEDUA diangkat secara resmi sebagai Karyawan Tetap.`
          : `1. Perjanjian Kerja Waktu Tertentu (PKWT) ini berlaku untuk jangka waktu ${job.contractDurationMonths || 12} (${terbilang(job.contractDurationMonths || 12).replace(' rupiah', '')}) bulan, terhitung mulai tanggal ${formatIndonesianDate(job.startDate)} dan akan berakhir dengan sendirinya pada tanggal ${formatIndonesianDate(job.endDate || '')}.\n2. Hubungan kerja PKWT ini dibuat sesuai dengan ketentuan Peraturan Pemerintah No. 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja.\n3. PKWT ini tidak mensyaratkan masa percobaan (probation).`,
        contentEn: type === 'PKWTT'
          ? `1. This Permanent Employment Agreement takes effect on ${formatEnglishDate(job.startDate)}.\n2. The SECOND PARTY shall undergo a probationary period of ${job.probationDurationMonths || 3} months.\n3. During the probationary period, either party may terminate employment with written notice without penalty.\n4. Upon satisfactory completion of probation, the SECOND PARTY shall be appointed as a Permanent Employee.`
          : `1. This Fixed-Term Employment Agreement is valid for ${job.contractDurationMonths || 12} months, commencing on ${formatEnglishDate(job.startDate)} and automatically expiring on ${formatEnglishDate(job.endDate || '')}.\n2. This agreement complies with Government Regulation No. 35/2021 regarding Fixed-Term Employment.\n3. This agreement contains no probationary period.`,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'cl-3',
        articleNumber: 3,
        titleId: 'HARI KERJA, WAKTU KERJA DAN ISTIRAHAT',
        titleEn: 'WORKING DAYS, WORKING HOURS AND REST PERIODS',
        contentId: `1. Waktu kerja normal bagi PIHAK KEDUA ditetapkan sebanyak 40 (empat puluh) jam dalam 1 (satu) minggu, dengan ketentuan:\n   a. Pola Hari Kerja : ${job.workDaysDetail || (job.workingDaysPerWeek === 6 ? 'Senin s/d Sabtu (6 hari kerja)' : 'Senin s/d Jumat (5 hari kerja)')}\n   b. Jam Kerja Harian : ${job.workingHoursSchedule || (job.workingDaysPerWeek === 6 ? '08:00 - 16:00 WIB' : '08:30 - 17:30 WIB')}\n   c. Waktu Istirahat  : ${job.restHoursSchedule || 'Pukul 12.00 WIB s/d 13.00 WIB (1 jam istirahat, tidak diperhitungkan sebagai jam kerja)'}\n2. Bagi posisi yang membutuhkan sistem kerja bergilir (shift), hari dan jam kerja diatur tersendiri melalui Roster/Jadwal Shift yang ditetapkan oleh PIHAK PERTAMA dengan tetap mematuhi batas maksimal 40 jam per minggu.\n3. Pekerjaan yang dilakukan melebihi batas jam kerja normal sebagaimana dimaksud pada ayat (1) atas instruksi tertulis atasan dihitung sebagai kerja lembur sesuai ketentuan Peraturan Pemerintah No. 35 Tahun 2021.`,
        contentEn: `1. Standard working hours for the SECOND PARTY are set at 40 (forty) hours per week, with the following schedule:\n   a. Working Days  : ${job.workDaysDetail || (job.workingDaysPerWeek === 6 ? 'Monday to Saturday (6 working days)' : 'Monday to Friday (5 working days)')}\n   b. Working Hours : ${job.workingHoursSchedule || (job.workingDaysPerWeek === 6 ? '08:00 - 16:00 WIB' : '08:30 - 17:30 WIB')}\n   c. Rest Period   : ${job.restHoursSchedule || '12:00 to 13:00 WIB (1 hour break, not counted as working hours)'}\n2. For roles requiring rotational shift work, daily working hours shall follow the shift roster established by the FIRST PARTY within the statutory limit of 40 hours per week.\n3. Work performed exceeding standard hours upon written instruction shall be compensated as overtime in accordance with Government Regulation No. 35/2021.`,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'cl-4',
        articleNumber: 4,
        titleId: 'UPAH, TUNJANGAN DAN PEMBAYARAN',
        titleEn: 'SALARY, ALLOWANCES AND REMUNERATION',
        contentId: `1. PIHAK PERTAMA memberikan upah bulanan kepada PIHAK KEDUA dengan rincian:\n   a. Gaji Pokok: ${formatRupiah(comp.basicSalary)} (${terbilang(comp.basicSalary)})\n   b. Tunjangan Tetap (${comp.fixedAllowanceDescription || 'Jabatan'}): ${formatRupiah(comp.fixedAllowance)} (${terbilang(comp.fixedAllowance)})\n   c. Tunjangan Variabel (${comp.variableAllowanceDescription || 'Makan/Transport'}): ${formatRupiah(comp.variableAllowance)} (${terbilang(comp.variableAllowance)})\n   Total Penghasilan Bruto Bulanan: ${formatRupiah(totalMonthlyWage + comp.variableAllowance)} (${terbilang(totalMonthlyWage + comp.variableAllowance)})\n2. Pembayaran upah dilakukan setiap tanggal ${comp.paydayDate} setiap bulannya melalui ${comp.paymentMethod} ke rekening:\n   Bank: ${comp.bankName} | No. Rek: ${comp.bankAccountNumber} | A.n: ${comp.bankAccountHolder}\n3. Pemotongan pajak penghasilan (PPh Pasal 21) dan iuran jaminan sosial dilakukan oleh PIHAK PERTAMA sesuai dengan regulasi perpajakan yang berlaku.`,
        contentEn: `1. The FIRST PARTY shall pay a monthly salary to the SECOND PARTY consisting of:\n   a. Basic Salary: ${formatRupiah(comp.basicSalary)} (${terbilangEn(comp.basicSalary)})\n   b. Fixed Allowance (${comp.fixedAllowanceDescription || 'Position'}): ${formatRupiah(comp.fixedAllowance)} (${terbilangEn(comp.fixedAllowance)})\n   c. Variable Allowance (${comp.variableAllowanceDescription || 'Transport'}): ${formatRupiah(comp.variableAllowance)} (${terbilangEn(comp.variableAllowance)})\n2. Remuneration shall be paid on the ${comp.paydayDate}th of each month via ${comp.paymentMethod} to account: ${comp.bankName} - Acc No: ${comp.bankAccountNumber} - Name: ${comp.bankAccountHolder}.\n3. Income tax (PPh 21) and statutory social security deductions shall be withheld in accordance with tax laws.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-5',
        articleNumber: 5,
        titleId: 'JAMINAN SOSIAL KESEHATAN DAN KETENAGAKERJAAN (BPJS)',
        titleEn: 'SOCIAL SECURITY AND HEALTHCARE BENEFITS (BPJS)',
        contentId: `1. PIHAK PERTAMA mendaftarkan PIHAK KEDUA dalam program BPJS Ketenagakerjaan (JKK, JKM, JHT, JP) dan BPJS Kesehatan sesuai dengan ketentuan perundang-undangan.\n2. Pembayaran iuran BPJS menjadi beban bersama antara PIHAK PERTAMA dan PIHAK KEDUA dengan persentase sesuai aturan yang berlaku.\n3. PIHAK KEDUA berhak atas Tunjangan Hari Raya (THR) Keagamaan yang dibayarkan 1 (satu) kali dalam setahun sesuai dengan masa kerja proporsional.`,
        contentEn: `1. The FIRST PARTY shall enroll the SECOND PARTY into the BPJS Employment and BPJS Healthcare programs in accordance with statutory regulations.\n2. Contribution payments shall be shared between the parties as required by law.\n3. The SECOND PARTY is entitled to Religious Holiday Allowance (THR) paid once a year proportionally based on service tenure.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-6',
        articleNumber: 6,
        titleId: type === 'PKWT' ? 'UANG KOMPENSASI BERAKHIRNYA PKWT (PP 35/2021)' : 'HAK CUTI TAHUNAN DAN ISTIRAHAT',
        titleEn: type === 'PKWT' ? 'PKWT END-OF-CONTRACT COMPENSATION (PP 35/2021)' : 'ANNUAL LEAVE AND REST PERIODS',
        contentId: type === 'PKWT'
          ? `1. Sesuai Pasal 15 s/d 17 Peraturan Pemerintah No. 35 Tahun 2021, pada saat berakhirnya jangka waktu PKWT, PIHAK PERTAMA wajib memberikan uang kompensasi kepada PIHAK KEDUA.\n2. Besaran uang kompensasi dihitung secara proporsional: (Masa Kerja dalam bulan / 12) x 1 (satu) bulan upah pokok + tunjangan tetap (${formatRupiah(totalMonthlyWage)}).\n3. Uang kompensasi dibayarkan pada saat hubungan kerja PKWT resmi berakhir.`
          : `1. PIHAK KEDUA berhak atas cuti tahunan sebanyak 12 (dua belas) hari kerja setelah menjalani masa kerja selama 12 (dua belas) bulan secara terus menerus.\n2. Selain cuti tahunan, PIHAK KEDUA berhak atas cuti resmi lainnya (cuti melahirkan, cuti menikah, cuti duka) sesuai dengan Peraturan Perusahaan.`,
        contentEn: type === 'PKWT'
          ? `1. In accordance with Articles 15-17 of Government Regulation No. 35/2021, upon the expiration of this fixed-term agreement, the FIRST PARTY shall pay end-of-contract compensation to the SECOND PARTY.\n2. The compensation is calculated proportionally: (Tenure in months / 12) x 1 month wage (${formatRupiah(totalMonthlyWage)}).\n3. Compensation shall be disbursed upon the official completion of the contract.`
          : `1. The SECOND PARTY is entitled to 12 working days of paid annual leave after 12 consecutive months of service.\n2. The employee is also entitled to statutory special leaves in accordance with the Company Regulations.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-7',
        articleNumber: 7,
        titleId: 'KERAHASIAAN INFORMASI DAN HAK KEKAYAAN INTELEKTUAL (NDA)',
        titleEn: 'CONFIDENTIALITY (NDA) AND INTELLECTUAL PROPERTY',
        contentId: `1. PIHAK KEDUA wajib menjaga kerahasiaan seluruh data rahasia, source code, data klien, strategi bisnis, rahasia dagang, dan informasi internal PIHAK PERTAMA baik selama masa kerja maupun setelah hubungan kerja berakhir.\n2. Seluruh hasil karya, ciptaan, kode pemrograman, desain, dan inovasi yang dibuat oleh PIHAK KEDUA dalam lingkup penugasan kerja merupakan Hak Kekayaan Intelektual (HAKI) milik eksklusif PIHAK PERTAMA.`,
        contentEn: `1. The SECOND PARTY shall maintain strict confidentiality over all proprietary data, source code, client records, and trade secrets during and after employment.\n2. All intellectual property, software, designs, and innovations produced within the scope of employment belong exclusively to the FIRST PARTY.`,
        isMandatory: true,
        isEnabled: true,
        category: 'kewajiban_nda'
      },
      {
        id: 'cl-8',
        articleNumber: 8,
        titleId: 'TATA TERTIB, DISIPLIN DAN SANKSI',
        titleEn: 'CODE OF CONDUCT, DISCIPLINE AND WARNINGS',
        contentId: `1. PIHAK KEDUA wajib menaati seluruh tata tertib, SOP kerja, kode etik, dan Peraturan Perusahaan yang berlaku.\n2. Pelanggaran terhadap tata tertib dapat dikenakan sanksi berupa Surat Peringatan Pertama (SP 1), Surat Peringatan Kedua (SP 2), atau Surat Peringatan Ketiga/Terakhir (SP 3) dengan masa berlaku masing-masing 6 (enam) bulan.\n3. Pelanggaran berat dapat mengakibatkan pemutusan hubungan kerja seketika sesuai ketentuan ketenagakerjaan.`,
        contentEn: `1. The SECOND PARTY shall adhere to company policies, SOPs, and employee code of conduct.\n2. Violations may result in disciplinary actions including First, Second, or Third Warning Letters with a validity period of 6 months each.\n3. Gross misconduct may result in immediate termination in accordance with labor laws.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'cl-9',
        articleNumber: 9,
        titleId: 'PENGAKHIRAN HUBUNGAN KERJA (TERMINATION)',
        titleEn: 'TERMINATION OF EMPLOYMENT',
        contentId: `1. Pengakhiran hubungan kerja dapat terjadi karena: berakhirnya masa kontrak, pengunduran diri sukarela dengan pemberitahuan tertulis 30 (tiga puluh) hari sebelumnya (one month notice), meninggal dunia, atau pemutusan hubungan kerja sesuai regulasi.\n2. Pada saat berakhirnya hubungan kerja, PIHAK KEDUA wajib melakukan serah terima seluruh tugas (handover) dan mengembalikan seluruh inventaris aset milik PIHAK PERTAMA dalam keadaan baik.`,
        contentEn: `1. Employment may terminate upon: expiration of contract, voluntary resignation with 30 days written notice, demise, or termination under prevailing laws.\n2. Upon termination, the SECOND PARTY shall complete duty handovers and return all company assets in good condition.`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'cl-10',
        articleNumber: 10,
        titleId: 'PENYELESAIAN PERSELISIHAN DAN PENUTUP',
        titleEn: 'DISPUTE RESOLUTION AND CLOSING',
        contentId: `1. Segala perselisihan yang timbul dari perjanjian ini akan diselesaikan terlebih dahulu secara musyawarah untuk mufakat (Bipartit).\n2. Apabila musyawarah tidak tercapai, perselisihan akan diselesaikan melalui jalur mediasi Dinas Tenaga Kerja dan Pengadilan Hubungan Industrial (PHI) pada Pengadilan Negeri ${doc.signingCity}.\n3. Perjanjian ini dibuat dalam rangkap 2 (dua) bermaterai cukup dan memiliki kekuatan hukum yang sama bagi kedua belah pihak.`,
        contentEn: `1. Any dispute arising from this agreement shall first be settled amicably through bipartite negotiations.\n2. If no settlement is reached, the dispute shall be resolved through industrial relations mediation and the Industrial Relations Court (PHI) in ${doc.signingCity}.\n3. This agreement is executed in 2 (two) counterparts with equal legal validity.`,
        isMandatory: true,
        isEnabled: true,
        category: 'penyelesaian_perselisihan'
      }
    ];
  }

  // 2. PERPANJANGAN KONTRAK (ADDENDUM PKWT)
  if (type === 'RENEWAL_PKWT') {
    const ren = doc.renewal || {
      previousContractNumber: '001/HRM-PKWT/X/2025',
      previousStartDate: '2025-10-01',
      previousEndDate: '2026-09-30',
      renewalStartDate: '2026-10-01',
      renewalEndDate: '2027-09-30',
      renewalDurationMonths: 12,
      isSalaryAdjusted: true,
      newBasicSalary: 14000000,
      renewalReason: 'Kinerja kerja yang sangat memuaskan dan pencapaian target proyek strategis.'
    };

    const newBasic = ren.isSalaryAdjusted && ren.newBasicSalary ? ren.newBasicSalary : comp.basicSalary;
    const newTotal = newBasic + comp.fixedAllowance;

    return [
      {
        id: 'ren-1',
        articleNumber: 1,
        titleId: 'DASAR HUKUM DAN PERTIMBANGAN PERPANJANGAN',
        titleEn: 'LEGAL BASIS AND RATIONALE FOR EXTENSION',
        contentId: `1. Addendum Perpanjangan ini merujuk pada Surat Perjanjian Kerja Waktu Tertentu (PKWT) sebelumnya Nomor: ${ren.previousContractNumber} tertanggal ${formatIndonesianDate(ren.previousStartDate)}.\n2. Berdasarkan hasil evaluasi kinerja tahunan, PIHAK KEDUA dinilai berkinerja sangat baik dengan alasan pertimbangan: ${ren.renewalReason}.\n3. Para Pihak sepakat untuk memperpanjang hubungan kerja PKWT sesuai dengan ketentuan Pasal 8 Peraturan Pemerintah No. 35 Tahun 2021.`,
        contentEn: `1. This Extension Amendment refers to the previous Fixed-Term Employment Agreement No: ${ren.previousContractNumber} dated ${formatEnglishDate(ren.previousStartDate)}.\n2. Based on performance evaluation, the SECOND PARTY has shown outstanding results with rationale: ${ren.renewalReason}.\n3. Both Parties agree to extend the fixed-term employment in accordance with Government Regulation No. 35/2021.`,
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'ren-2',
        articleNumber: 2,
        titleId: 'MASA PERPANJANGAN KONTRAK KERJA BARU',
        titleEn: 'NEW CONTRACT EXTENSION PERIOD',
        contentId: `1. Jangka waktu perpanjangan PKWT ini disepakati selama ${ren.renewalDurationMonths} (${terbilang(ren.renewalDurationMonths).replace(' rupiah', '')}) bulan, terhitung mulai tanggal ${formatIndonesianDate(ren.renewalStartDate)} dan akan berakhir dengan sendirinya pada tanggal ${formatIndonesianDate(ren.renewalEndDate)}.\n2. Total akumulasi masa kerja PKWT awal dan perpanjangan tidak melebihi batas maksimal 5 (lima) tahun sebagaimana diatur dalam PP No. 35 Tahun 2021.`,
        contentEn: `1. The fixed-term extension period is agreed for ${ren.renewalDurationMonths} months, commencing on ${formatEnglishDate(ren.renewalStartDate)} and automatically expiring on ${formatEnglishDate(ren.renewalEndDate)}.\n2. Total accumulated fixed-term service tenure shall not exceed the 5-year statutory limit under PP No. 35/2021.`,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'ren-3',
        articleNumber: 3,
        titleId: 'JABATAN, TUGAS DAN PENYESUAIAN REMUNERASI',
        titleEn: 'POSITION, RESPONSIBILITIES AND REMUNERATION ADJUSTMENT',
        contentId: `1. PIHAK KEDUA tetap memangku jabatan sebagai ${job.positionTitle} pada Departemen ${job.department}.\n2. Terhitung sejak dimulainya masa perpanjangan ini, PIHAK KEDUA berhak menerima penghasilan bulanan yang disesuaikan menjadi:\n   a. Gaji Pokok: ${formatRupiah(newBasic)} (${terbilang(newBasic)})\n   b. Tunjangan Tetap: ${formatRupiah(comp.fixedAllowance)} (${terbilang(comp.fixedAllowance)})\n   Total Upah Pokok & Tunjangan Tetap: ${formatRupiah(newTotal)} (${terbilang(newTotal)})\n   c. Tunjangan Variabel: ${formatRupiah(comp.variableAllowance)} (${terbilang(comp.variableAllowance)})\n3. Pembayaran upah dilakukan setiap tanggal ${comp.paydayDate} setiap bulannya.`,
        contentEn: `1. The SECOND PARTY continues in the position of ${job.positionTitleEn || job.positionTitle} in the ${job.departmentEn || job.department} Department.\n2. Effective from this extension date, monthly remuneration is adjusted to:\n   a. Basic Salary: ${formatRupiah(newBasic)} (${terbilangEn(newBasic)})\n   b. Fixed Allowance: ${formatRupiah(comp.fixedAllowance)} (${terbilangEn(comp.fixedAllowance)})\n   Total Fixed Monthly Wage: ${formatRupiah(newTotal)} (${terbilangEn(newTotal)})\n   c. Variable Allowance: ${formatRupiah(comp.variableAllowance)} (${terbilangEn(comp.variableAllowance)})\n3. Remuneration is disbursed on the ${comp.paydayDate}th of each month.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'ren-4',
        articleNumber: 4,
        titleId: 'UANG KOMPENSASI PKWT PERPANJANGAN',
        titleEn: 'EXTENSION PKWT COMPENSATION RIGHTS',
        contentId: `1. Hak uang kompensasi PKWT periode pertama telah diselesaikan dan/atau akan diperhitungkan secara tuntas sesuai dengan regulasi PP No. 35 Tahun 2021.\n2. Pada akhir masa perpanjangan PKWT ini tanggal ${formatIndonesianDate(ren.renewalEndDate)}, PIHAK PERTAMA wajib membayarkan uang kompensasi periode perpanjangan sebesar: (${ren.renewalDurationMonths}/12) x 1 bulan upah (${formatRupiah(newTotal)}).`,
        contentEn: `1. PKWT compensation for the initial period has been settled or accounted for in accordance with PP No. 35/2021.\n2. Upon expiration of this extension on ${formatEnglishDate(ren.renewalEndDate)}, the FIRST PARTY shall pay extension compensation: (${ren.renewalDurationMonths}/12) x 1 month wage (${formatRupiah(newTotal)}).`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'ren-5',
        articleNumber: 5,
        titleId: 'KEVERLAKUAN PASAL-PASAL LAINNYA DAN PENUTUP',
        titleEn: 'VALIDITY OF OTHER PROVISIONS AND CLOSING',
        contentId: `1. Seluruh ketentuan, pasal, kerahasiaan informasi (NDA), dan tata tertib yang tercantum dalam PKWT Nomor: ${ren.previousContractNumber} yang tidak diubah dalam Addendum ini dinyatakan tetap berlaku sah dan mengikat.\n2. Addendum ini menjadi satu kesatuan dokumen yang tidak terpisahkan dari Perjanjian Kerja induk sebelumnya.\n3. Perjanjian Addendum ini dibuat dalam rangkap 2 (dua) bermaterai cukup dan memiliki kekuatan hukum yang sama.`,
        contentEn: `1. All other terms, confidentiality obligations (NDA), and provisions in Employment Agreement No: ${ren.previousContractNumber} not modified by this Amendment remain in full force.\n2. This Amendment constitutes an integral and inseparable part of the principal Employment Agreement.\n3. Executed in 2 (two) counterparts with equal legal validity.`,
        isMandatory: true,
        isEnabled: true,
        category: 'penutup'
      }
    ];
  }

  // 3. SK PROMOSI JABATAN (KONSIDERAN: MENIMBANG, MENGINGAT, MEMPERHATIKAN, MENETAPKAN)
  if (type === 'SK_PROMOSI') {
    const promo = doc.promotion || {
      previousPositionTitle: job.positionTitle || 'Software Engineer',
      newPositionTitle: 'Senior Software Engineer',
      previousDepartment: job.department || 'Engineering & Technology',
      newDepartment: job.department || 'Engineering & Technology',
      previousJobGrade: 'Grade 5',
      newJobGrade: 'Grade 7',
      effectiveDate: doc.signingDate,
      previousBasicSalary: comp.basicSalary,
      newBasicSalary: comp.basicSalary + 3000000,
      considerations: [
        `Bahwa berdasarkan hasil evaluasi kinerja, dedikasi, serta pencapaian KPI Sdr/i ${doc.employee.fullName}, Perusahaan memandang perlu melakukan promosi jabatan.`,
        'Bahwa karyawan yang bersangkutan dinilai memenuhi kualifikasi, kompetensi, dan kepemimpinan yang dipersyaratkan untuk mengemban wewenang pada posisi jabatan baru.'
      ],
      legalReferences: [
        'Undang-Undang No. 6 Tahun 2023 tentang Cipta Kerja.',
        'Peraturan Pemerintah No. 35 Tahun 2021 tentang PKWT, Waktu Kerja, dan Pemutusan Hubungan Kerja.',
        `Peraturan Perusahaan / PKB ${doc.company.companyName}.`
      ],
      observations: [
        'Rekomendasi tertulis dari Head of Department & Atasan Langsung.',
        'Persetujuan Direksi dan Departemen Human Resources.'
      ],
      decisions: [
        `KESATU: Mengangkat / Mempromosikan Sdr/i ${doc.employee.fullName} dari posisi ${job.positionTitle || 'Software Engineer'} menjadi ${doc.promotion?.newPositionTitle || 'Senior Software Engineer'} pada Departemen ${job.department}.`,
        `KEDUA: Menetapkan penyesuaian Gaji Pokok Baru sebesar ${formatRupiah(doc.promotion?.newBasicSalary || comp.basicSalary + 3000000)} per bulan beserta tunjangan jabatan yang berlaku efektif sejak tanggal ${formatIndonesianDate(doc.signingDate)}.`,
        'KETIGA: Karyawan bertanggung jawab langsung kepada Atasan Langsung dan wajib melaksanakan wewenang serta tugas pekerjaan sesuai deskripsi jabatan baru.',
        'KEEMPAT: Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan akan dilakukan perbaikan sebagaimana mestinya.'
      ]
    };

    return [
      {
        id: 'promo-1',
        articleNumber: 1,
        titleId: 'MENIMBANG (CONSIDERATIONS)',
        titleEn: 'CONSIDERATIONS',
        contentId: promo.considerations.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        contentEn: promo.considerations.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'promo-2',
        articleNumber: 2,
        titleId: 'MENGINGAT (LEGAL REFERENCES)',
        titleEn: 'LEGAL REFERENCES',
        contentId: promo.legalReferences.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        contentEn: promo.legalReferences.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'promo-3',
        articleNumber: 3,
        titleId: 'MEMPERHATIKAN (OBSERVATIONS)',
        titleEn: 'OBSERVATIONS',
        contentId: promo.observations.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        contentEn: promo.observations.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'promo-4',
        articleNumber: 4,
        titleId: 'MEMUTUSKAN DAN MENETAPKAN (DECISIONS & RESOLUTIONS)',
        titleEn: 'DECISIONS AND RESOLUTIONS',
        contentId: promo.decisions.join('\n\n'),
        contentEn: promo.decisions.join('\n\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      }
    ];
  }

  // 3. SURAT PERINGATAN (SP 1, SP 2, SP 3)
  if (type === 'SP1' || type === 'SP2' || type === 'SP3') {
    const level = type === 'SP1' ? 1 : (type === 'SP2' ? 2 : 3);
    const warn = doc.warning || {
      warningLevel: level as (1 | 2 | 3),
      incidentDate: doc.signingDate,
      violationCategory: 'Indisipliner Kerja & Pelanggaran SOP',
      violationDescription: 'Tidak mematuhi prosedur kerja standar operasional dan melakukan kelalaian berulang dalam penuntasan tugas.',
      violationClauseReference: 'Pasal 12 Peraturan Perusahaan',
      validUntilDate: '2027-04-18',
      correctiveActions: 'Memperbaiki kedisiplinan kerja dan meningkatkan ketelitian pelaporan harian.',
      consequences: 'Diberikan sanksi lebih berat hingga pemutusan hubungan kerja jika mengulangi kesalahan.'
    };

    return [
      {
        id: 'sp-1',
        articleNumber: 1,
        titleId: 'DASAR PENERBITAN SURAT PERINGATAN',
        titleEn: 'LEGAL GROUNDS FOR WARNING LETTER',
        contentId: `1. Berdasarkan hasil pengawasan, evaluasi kinerja, dan berita acara pemeriksaan disiplin yang dilakukan oleh Manajemen PIHAK PERTAMA terhadap PIHAK KEDUA (${doc.employee.fullName}, Jabatan: ${doc.job.positionTitle}).\n2. Penerbitan Surat Peringatan ini merujuk pada ketentuan Pasal 161 UU No. 13/2003 tentang Ketenagakerjaan jo. UU No. 6/2023 serta Peraturan Perusahaan ${doc.company.companyName} ${warn.violationClauseReference}.\n3. Kategori Pelanggaran: ${warn.violationCategory}.`,
        contentEn: `1. Based on disciplinary supervision and performance review conducted by the Management of FIRST PARTY regarding the SECOND PARTY (${doc.employee.fullName}, Position: ${doc.job.positionTitle}).\n2. This Warning Letter is issued in accordance with Article 161 of Indonesian Labor Law and Company Regulations ${warn.violationClauseReference}.\n3. Violation Category: ${warn.violationCategory}.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-2',
        articleNumber: 2,
        titleId: 'FAKTA DAN KRONOLOGI PELANGGARAN',
        titleEn: 'FACTS AND CHRONOLOGY OF VIOLATION',
        contentId: `1. Bahwa pada tanggal ${formatIndonesianDate(warn.incidentDate)}, PIHAK KEDUA telah terbukti melakukan pelanggaran sebagai berikut:\n   "${warn.violationDescription}"\n2. Tindakan tersebut telah mengganggu kelancaran operasional kerja divisi dan melanggar komitmen disiplin kerja yang telah disepakati bersama.`,
        contentEn: `1. On ${formatEnglishDate(warn.incidentDate)}, the SECOND PARTY was proven to have committed the following violation:\n   "${warn.violationDescription}"\n2. Said action has disrupted operational workflows and breached mutually agreed employment standards.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-3',
        articleNumber: 3,
        titleId: 'SANKSI DAN MASA BERLAKU SURAT PERINGATAN',
        titleEn: 'SANCTION AND VALIDITY PERIOD',
        contentId: `1. Sehubungan dengan pelanggaran di atas, Manajemen PIHAK PERTAMA secara resmi menjatuhkan sanksi disiplin berupa:\n   **SURAT PERINGATAN KE-${level} (${type})** kepada PIHAK KEDUA.\n2. Sesuai dengan ketentuan perundang-undangan, Surat Peringatan ini berlaku efektif selama 6 (enam) bulan terhitung sejak tanggal ${formatIndonesianDate(doc.signingDate)} sampai dengan tanggal ${formatIndonesianDate(warn.validUntilDate)}.\n3. Apabila selama masa berlaku 6 bulan ini PIHAK KEDUA tidak melakukan pelanggaran disiplin baru, maka Surat Peringatan ini akan gugur dengan sendirinya.`,
        contentEn: `1. In connection with the above breach, the Management of FIRST PARTY hereby officially imposes disciplinary sanction: **WARNING LETTER ${level} (${type})** upon the SECOND PARTY.\n2. In accordance with statutory labor regulations, this Warning Letter is effective for 6 (six) months from ${formatEnglishDate(doc.signingDate)} until ${formatEnglishDate(warn.validUntilDate)}.\n3. If no further disciplinary violations occur during this 6-month period, this warning shall expire automatically.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-4',
        articleNumber: 4,
        titleId: 'KEWAJIBAN TINDAKAN PERBAIKAN DAN KONSEKUENSI',
        titleEn: 'MANDATORY CORRECTIVE ACTIONS AND CONSEQUENCES',
        contentId: `1. Selama masa berlakunya Surat Peringatan ini, PIHAK KEDUA diwajibkan untuk:\n   ${warn.correctiveActions}\n2. Konsekuensi: ${warn.consequences}\n3. Diharapkan Surat Peringatan ini dapat menjadi bahan introspeksi dan evaluasi sungguh-sungguh bagi PIHAK KEDUA untuk memperbaiki performa dan loyalitas kerja ke depan.`,
        contentEn: `1. During the validity of this Warning Letter, the SECOND PARTY is mandated to:\n   ${warn.correctiveActions}\n2. Consequences: ${warn.consequences}\n3. This letter serves as serious notification for the employee to reflect, rectify conduct, and restore professional performance.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      }
    ];
  }

  // 4. PEMBERHENTIAN / PHK / SELESAI KONTRAK / RESIGN
  if (type === 'END_CONTRACT' || type === 'PHK' || type === 'RESIGN_ACCEPTANCE') {
    const term = doc.termination || {
      terminationType: 'SELESAI_PKWT',
      terminationReason: 'Telah berakhirnya masa perjanjian kerja PKWT sesuai jadwal.',
      noticeDate: doc.signingDate,
      effectiveDate: doc.signingDate,
      lastWorkingDay: doc.signingDate,
      severancePay: 0,
      serviceAwardPay: 0,
      rightsCompensationPay: 1500000,
      pkwtCompensationPay: 12500000,
      totalFinancialSettlement: 14000000,
      paymentReleaseDate: doc.signingDate,
      includePaklaring: true,
      paklaringReferenceNumber: 'SKK-001/HRD/X/2026',
      employmentConductDescription: 'Menunjukkan dedikasi dan kinerja yang sangat baik selama bekerja.',
      assetHandoverChecklist: ['Laptop & Charger', 'Kartu Akses Gedung', 'Email Akun Korporat', 'Dokumentasi Kerja']
    };

    return [
      {
        id: 'term-1',
        articleNumber: 1,
        titleId: 'PERNYATAAN RESMI PENGAKHIRAN HUBUNGAN KERJA',
        titleEn: 'OFFICIAL NOTICE OF EMPLOYMENT TERMINATION',
        contentId: `1. PIHAK PERTAMA dan PIHAK KEDUA (${doc.employee.fullName}, Jabatan: ${doc.job.positionTitle}, NIK: ${doc.employee.nik}) menyatakan sepakat mengakhiri hubungan kerja terhitung efektif sejak tanggal ${formatIndonesianDate(term.effectiveDate)}.\n2. Hari kerja terakhir (Last Working Day) ditetapkan pada tanggal ${formatIndonesianDate(term.lastWorkingDay)}.\n3. Alasan Pengakhiran Hubungan Kerja:\n   "${term.terminationReason}"`,
        contentEn: `1. The FIRST PARTY and the SECOND PARTY (${doc.employee.fullName}, Position: ${doc.job.positionTitle}, NIK: ${doc.employee.nik}) mutually agree to terminate employment effective as of ${formatEnglishDate(term.effectiveDate)}.\n2. The Last Working Day is designated as ${formatEnglishDate(term.lastWorkingDay)}.\n3. Reason for Termination:\n   "${term.terminationReason}"`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'term-2',
        articleNumber: 2,
        titleId: 'HAK PENYELESAIAN FINANSIAL DAN KOMPENSASI',
        titleEn: 'FINANCIAL SETTLEMENT AND SEVERANCE RIGHTS',
        contentId: `1. Sesuai dengan ketentuan Undang-Undang Ketenagakerjaan No. 13/2003 jo. PP No. 35/2021, PIHAK PERTAMA membayarkan hak penyelesaian finansial kepada PIHAK KEDUA dengan rincian:\n   a. Uang Pesangon (UP): ${formatRupiah(term.severancePay)}\n   b. Uang Penghargaan Masa Kerja (UPMK): ${formatRupiah(term.serviceAwardPay)}\n   c. Uang Penggantian Hak (UPH - Cuti dll): ${formatRupiah(term.rightsCompensationPay)}\n   d. Uang Kompensasi Selesai PKWT (PP 35/2021): ${formatRupiah(term.pkwtCompensationPay)}\n   TOTAL HAK FINANSIAL BERSIH: ${formatRupiah(term.totalFinancialSettlement)} (${terbilang(term.totalFinancialSettlement)})\n2. Hak finansial tersebut ditransfer ke rekening bank PIHAK KEDUA pada tanggal ${formatIndonesianDate(term.paymentReleaseDate)}.\n3. Dengan diterimanya hak finansial ini, PIHAK KEDUA menyatakan tidak memiliki tuntutan finansial lanjutan apapun kepada PIHAK PERTAMA.`,
        contentEn: `1. In accordance with Indonesian Labor Law and Government Regulation No. 35/2021, the FIRST PARTY shall pay full financial settlement to the SECOND PARTY consisting of:\n   a. Severance Pay (UP): ${formatRupiah(term.severancePay)}\n   b. Service Award Pay (UPMK): ${formatRupiah(term.serviceAwardPay)}\n   c. Compensation of Rights (UPH): ${formatRupiah(term.rightsCompensationPay)}\n   d. PKWT End Compensation (PP 35/2021): ${formatRupiah(term.pkwtCompensationPay)}\n   TOTAL NET SETTLEMENT: ${formatRupiah(term.totalFinancialSettlement)} (${terbilangEn(term.totalFinancialSettlement)})\n2. Settlement shall be transferred on ${formatEnglishDate(term.paymentReleaseDate)}.\n3. Upon receipt of this payment, the SECOND PARTY releases the FIRST PARTY from any further claims.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'term-3',
        articleNumber: 3,
        titleId: 'SERAH TERIMA PEKERJAAN DAN PENGEMBALIAN ASET PERUSAHAAN',
        titleEn: 'JOB HANDOVER AND COMPANY ASSET RETURN',
        contentId: `1. PIHAK KEDUA telah menyelesaikan seluruh proses serah terima tanggung jawab pekerjaan (Handover of Duties) kepada atasan langsung / pejabat yang ditunjuk.\n2. PIHAK KEDUA telah mengembalikan seluruh inventaris aset milik PIHAK PERTAMA dalam keadaan baik dan lengkap, meliputi:\n   ${term.assetHandoverChecklist.map((item, idx) => `• ${item}`).join('\n   ')}\n3. PIHAK PERTAMA menyatakan serah terima inventaris telah tuntas dan selesai secara sah.`,
        contentEn: `1. The SECOND PARTY has fully completed the handover of duties to the designated supervisor.\n2. The SECOND PARTY has returned all company assets in good condition, including:\n   ${term.assetHandoverChecklist.map((item, idx) => `• ${item}`).join('\n   ')}\n3. The FIRST PARTY confirms the asset return is formally finalized.`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'term-4',
        articleNumber: 4,
        titleId: 'SURAT PENGALAMAN KERJA (PAKLARING) DAN REKOMENDASI',
        titleEn: 'CERTIFICATE OF EMPLOYMENT (PAKLARING) AND CONDUCT',
        contentId: `1. PIHAK PERTAMA menerbitkan Surat Keterangan / Pengalaman Kerja (Paklaring) resmi Nomor: ${term.paklaringReferenceNumber} untuk PIHAK KEDUA.\n2. Pernyataan Kinerja: "${term.employmentConductDescription}"\n3. Manajemen Perusahaan menyampaikan apresiasi dan terima kasih setinggi-tingginya atas seluruh dedikasi dan sumbangsih PIHAK KEDUA selama masa pengabdian, serta mendoakan kesuksesan dalam perjalanan karier berikutnya.`,
        contentEn: `1. The FIRST PARTY issues an official Certificate of Employment (Paklaring) Reference No: ${term.paklaringReferenceNumber} to the SECOND PARTY.\n2. Performance Conduct Statement: "${term.employmentConductDescription}"\n3. The Company expresses sincere gratitude for the SECOND PARTY's contributions and wishes them every success in their future career endeavors.`,
        isMandatory: true,
        isEnabled: true,
        category: 'penutup'
      }
    ];
  }

  return [];
}

/**
 * Metadata Kategori Template Dokumen Kontrak & Personalia
 */
export interface ContractCategoryMeta {
  id: ContractCategory;
  name: string;
  badge: string;
  description: string;
  defaultType: ContractType;
  types: { type: ContractType; label: string; desc: string }[];
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
}

export const CONTRACT_CATEGORIES: ContractCategoryMeta[] = [
  {
    id: 'KONTRAK_BARU',
    name: 'Template Kontrak Baru',
    badge: '4 Tipe Kontrak',
    description: 'Surat perjanjian kerja awal karyawan baru & pengangkatan dari PKWT ke Karyawan Tetap (PKWTT).',
    defaultType: 'PKWT',
    color: 'blue',
    types: [
      { type: 'PKWT', label: 'PKWT (Waktu Tertentu)', desc: 'Kontrak dengan batas waktu tertentu sesuai PP 35/2021' },
      { type: 'PKWTT', label: 'Pengangkatan Tetap (PKWTT)', desc: 'Surat Pengangkatan & Perjanjian Karyawan Tetap' },
      { type: 'INTERNSHIP', label: 'Magang (Internship)', desc: 'Perjanjian pemagangan mahasiswa / fresh graduate' },
      { type: 'FREELANCE', label: 'SPK Freelance', desc: 'Surat perjanjian kerja sama jasa lepas / profesional' },
    ]
  },
  {
    id: 'PERPANJANG_KONTRAK',
    name: 'Template Perpanjang Kontrak',
    badge: 'Addendum PKWT',
    description: 'Khusus perpanjangan masa kerja kontrak PKWT (Addendum) berdasarkan capaian KPI.',
    defaultType: 'RENEWAL_PKWT',
    color: 'emerald',
    types: [
      { type: 'RENEWAL_PKWT', label: 'Addendum Perpanjangan PKWT', desc: 'Perpanjangan masa kontrak PKWT yang sudah ada sebelumnya' }
    ]
  },
  {
    id: 'PROMOSI',
    name: 'Template SK Promosi',
    badge: 'SK Resmi',
    description: 'Surat Keputusan (SK) Promosi Jabatan resmi dengan konsideran Menimbang, Mengingat, & Menetapkan.',
    defaultType: 'SK_PROMOSI',
    color: 'purple',
    types: [
      { type: 'SK_PROMOSI', label: 'SK Promosi Jabatan', desc: 'Surat Keputusan Promosi Jabatan & Penyesuaian Upah Baru' }
    ]
  },
  {
    id: 'SURAT_PERINGATAN',
    name: 'Template Surat Peringatan (SP)',
    badge: 'SP 1 / 2 / 3',
    description: 'Surat peringatan resmi tingkat 1, 2, atau 3 untuk sanksi indisipliner dan pelanggaran SOP.',
    defaultType: 'SP1',
    color: 'amber',
    types: [
      { type: 'SP1', label: 'SP 1 (Peringatan Pertama)', desc: 'Teguran awal indisipliner presensi / keterlambatan kerja' },
      { type: 'SP2', label: 'SP 2 (Peringatan Kedua)', desc: 'Eskalasi sanksi pengulangan pelanggaran SOP / kinerja' },
      { type: 'SP3', label: 'SP 3 (Peringatan Terakhir)', desc: 'Peringatan terakhir dan final sebelum pemutusan kerja' },
    ]
  },
  {
    id: 'PEMBERHENTIAN',
    name: 'Template Pemberhentian / PHK',
    badge: '3 Jenis Surat',
    description: 'Surat berakhirnya kontrak PKWT, pemutusan hubungan kerja (PHK), dan penerimaan resign + paklaring.',
    defaultType: 'END_CONTRACT',
    color: 'rose',
    types: [
      { type: 'END_CONTRACT', label: 'Selesai Masa Kontrak PKWT', desc: 'Pengakhiran PKWT dengan uang kompensasi PP 35/2021' },
      { type: 'PHK', label: 'Surat PHK Perusahaan', desc: 'Pemutusan hubungan kerja dengan pesangon UP/UPMK/UPH' },
      { type: 'RESIGN_ACCEPTANCE', label: 'Penerimaan Resign & Paklaring', desc: 'Penerimaan pengunduran diri dan surat pengalaman kerja' },
    ]
  }
];

/**
 * Contoh Presets Dokumen untuk Pengisian Cepat HR
 */
export interface ContractPreset {
  id: string;
  name: string;
  category: ContractCategory;
  type: ContractType;
  description: string;
}

export const CONTRACT_PRESETS: ContractPreset[] = [
  {
    id: 'preset_sk_promosi',
    name: 'Contoh SK Promosi Jabatan & Penyesuaian Upah',
    category: 'PROMOSI',
    type: 'SK_PROMOSI',
    description: 'Surat Keputusan (SK) Promosi Jabatan resmi dengan konsideran Menimbang, Mengingat, & Menetapkan.'
  },
  {
    id: 'preset_sk_pengangkatan',
    name: 'Contoh SK Pengangkatan Karyawan Tetap (PKWTT)',
    category: 'KONTRAK_BARU',
    type: 'PKWTT',
    description: 'Surat Keputusan pengangkatan resmi dari status PKWT menjadi Karyawan Tetap (PKWTT).'
  },
  {
    id: 'preset_pkwt_dev',
    name: 'Contoh PKWT Software Engineer (1 Tahun)',
    category: 'KONTRAK_BARU',
    type: 'PKWT',
    description: 'Kontrak PKWT posisi Developer, gaji Rp 12.5jt, tunjangan, dan kompensasi PP 35/2021.'
  },
  {
    id: 'preset_pkwtt_manager',
    name: 'Contoh PKWTT HR Manager (Karyawan Tetap)',
    category: 'KONTRAK_BARU',
    type: 'PKWTT',
    description: 'Kontrak permanen PKWTT dengan klausul masa percobaan 3 bulan.'
  },
  {
    id: 'preset_intern_marketing',
    name: 'Contoh Surat Pemagangan (Internship 3 Bulan)',
    category: 'KONTRAK_BARU',
    type: 'INTERNSHIP',
    description: 'Perjanjian magang Digital Marketing dengan uang saku dan mentor.'
  },
  {
    id: 'preset_freelance_ui',
    name: 'Contoh SPK Freelance UI/UX Designer',
    category: 'KONTRAK_BARU',
    type: 'FREELANCE',
    description: 'Perjanjian jasa lepas berbasis milestone proyek dan deliverables.'
  },
  {
    id: 'preset_renewal_addendum',
    name: 'Contoh Perpanjangan Kontrak PKWT (Naik Gaji)',
    category: 'PERPANJANG_KONTRAK',
    type: 'RENEWAL_PKWT',
    description: 'Addendum perpanjangan 1 tahun karena capaian KPI dan penyesuaian upah.'
  },
  {
    id: 'preset_sp1_lateness',
    name: 'Contoh SP 1 - Keterlambatan & Indisipliner',
    category: 'SURAT_PERINGATAN',
    type: 'SP1',
    description: 'Surat Peringatan Pertama untuk keterlambatan hadir berulang tanpa izin.'
  },
  {
    id: 'preset_sp2_sop',
    name: 'Contoh SP 2 - Pelanggaran Prosedur Operasional',
    category: 'SURAT_PERINGATAN',
    type: 'SP2',
    description: 'Surat Peringatan Kedua atas pengabaian SOP keselamatan dan kualitas.'
  },
  {
    id: 'preset_sp3_final',
    name: 'Contoh SP 3 - Peringatan Terakhir & Final',
    category: 'SURAT_PERINGATAN',
    type: 'SP3',
    description: 'Surat Peringatan Terakhir sebelum proses pemutusan hubungan kerja.'
  },
  {
    id: 'preset_end_pkwt_comp',
    name: 'Contoh Selesai PKWT + Kompensasi PP 35/2021',
    category: 'PEMBERHENTIAN',
    type: 'END_CONTRACT',
    description: 'Pengakhiran kontrak normal + perhitungan uang kompensasi 1 bulan upah.'
  },
  {
    id: 'preset_phk_efficiency',
    name: 'Contoh Surat PHK Restrukturisasi / Efisiensi',
    category: 'PEMBERHENTIAN',
    type: 'PHK',
    description: 'Surat PHK dengan penyelesaian pesangon, penghargaan masa kerja, dan UPH.'
  },
  {
    id: 'preset_resign_paklaring',
    name: 'Contoh Penerimaan Resign & Paklaring',
    category: 'PEMBERHENTIAN',
    type: 'RESIGN_ACCEPTANCE',
    description: 'Penerimaan pengunduran diri sukarela dan surat pengalaman kerja resmi.'
  }
];

