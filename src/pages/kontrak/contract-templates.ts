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
 * Generator Klausul Pasal Resmi Komprehensif Standar Regulasi Ketenagakerjaan Indonesia
 * (UU No. 13/2003 jo. UU No. 6/2023 Cipta Kerja, PP No. 35/2021, PP No. 36/2021, UU PDP No. 27/2022)
 */
export function generateDefaultClauses(type: ContractType, doc: ContractDocument): ContractClause[] {
  const comp = doc.compensation;
  const job = doc.job;
  const company = doc.company;
  const employee = doc.employee;
  const totalMonthlyFixed = (comp.basicSalary || 0) + (comp.fixedAllowance || 0);
  const totalMonthlyGross = totalMonthlyFixed + (comp.variableAllowance || 0);

  const workDaysTextId =
    job.workDaysDetail ||
    (job.workingDaysPerWeek === 6 ? 'Senin s/d Sabtu (6 hari kerja)' : 'Senin s/d Jumat (5 hari kerja)');
  const workDaysTextEn =
    job.workDaysDetail ||
    (job.workingDaysPerWeek === 6 ? 'Monday through Saturday (6 working days)' : 'Monday through Friday (5 working days)');
  const workHoursText =
    job.workingHoursSchedule ||
    (job.workingDaysPerWeek === 6 ? '08:00 - 16:00 WIB' : '08:30 - 17:30 WIB');
  const restHoursTextId =
    job.restHoursSchedule || 'Pukul 12.00 WIB s/d 13.00 WIB (1 jam istirahat, tidak dihitung sebagai jam kerja efektif)';
  const restHoursTextEn =
    job.restHoursSchedule || '12:00 to 13:00 WIB (1 hour break, excluded from effective working hours)';

  // 1. KONTRAK KERJA BARU (PKWT, PKWTT, MAGANG, FREELANCE)
  if (type === 'PKWT' || type === 'PKWTT' || type === 'INTERNSHIP' || type === 'FREELANCE') {
    const isPkwtt = type === 'PKWTT';
    const isPkwt = type === 'PKWT';
    const isIntern = type === 'INTERNSHIP';
    const isFreelance = type === 'FREELANCE';

    const statusArticleId = isPkwtt
      ? `1. Hubungan kerja antara PIHAK PERTAMA dan PIHAK KEDUA adalah Perjanjian Kerja Waktu Tidak Tertentu (PKWTT / Karyawan Tetap) yang berlaku efektif terhitung sejak tanggal ${formatIndonesianDate(job.startDate)}.\n2. PIHAK KEDUA wajib menjalani masa percobaan kerja (probation period) selama ${job.probationDurationMonths || 3} (${terbilang(job.probationDurationMonths || 3).replace(' rupiah', '')}) bulan terhitung sejak tanggal mulai bekerja, sebagaimana diatur dalam Pasal 60 Undang-Undang No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023.\n3. Selama masa percobaan berlangsung, PIHAK PERTAMA berhak melakukan evaluasi menyeluruh terhadap kompetensi teknis, integritas perilaku, adaptasi budaya kerja, serta kehadiran PIHAK KEDUA, dan masing-masing pihak berhak mengakhiri hubungan kerja secara tertulis tanpa kewajiban membayar uang pesangon ataupun ganti rugi dalam bentuk apapun.\n4. Apabila PIHAK KEDUA dinyatakan lulus evaluasi masa percobaan secara tertulis oleh Atasan Langsung dan Departemen SDM, maka status PIHAK KEDUA dikukuhkan menjadi Karyawan Tetap penuh dengan masa kerja dihitung sejak hari pertama masa percobaan.`
      : isIntern
        ? `1. Perjanjian Pemagangan ini berlaku untuk jangka waktu ${job.contractDurationMonths || 3} (${terbilang(job.contractDurationMonths || 3).replace(' rupiah', '')}) bulan terhitung sejak tanggal ${formatIndonesianDate(job.startDate)} dan berakhir secara otomatis pada tanggal ${formatIndonesianDate(job.endDate || '')}.\n2. Hubungan antara PIHAK PERTAMA dan PIHAK KEDUA merupakan hubungan pemagangan berbasis pembelajaran praktik kerja sesuai Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2020 tentang Penyelenggaraan Pemagangan di Dalam Negeri, bukan merupakan hubungan kerja karyawan tetap maupun PKWT.\n3. PIHAK PERTAMA menunjuk mentor/pembimbing lapangan untuk memantau kurikulum kompetensi PIHAK KEDUA, dan setelah menyelesaikan seluruh program dengan baik, PIHAK PERTAMA berhak menerbitkan Sertifikat Pemagangan resmi.`
        : isFreelance
          ? `1. Perjanjian Kerja Sama Jasa Profesional (SPK Freelance / Mitra Lepas) ini berlaku untuk jangka waktu ${job.contractDurationMonths || 6} (${terbilang(job.contractDurationMonths || 6).replace(' rupiah', '')}) bulan atau hingga terselesaikannya seluruh lingkup deliverables pekerjaan, terhitung sejak tanggal ${formatIndonesianDate(job.startDate)} sampai dengan ${formatIndonesianDate(job.endDate || '')}.\n2. Para Pihak memahami dan menyepakati bahwa hubungan hukum yang timbul berdasarkan Perjanjian ini adalah hubungan kemitraan penyedia jasa independen (independent contractor) berdasarkan Pasal 1338 dan Pasal 1601 KUHPerdata, sehingga PIHAK KEDUA tidak berstatus sebagai karyawan tetap maupun PKWT milik PIHAK PERTAMA.\n3. Perpanjangan jangka waktu kerja sama jasa hanya sah apabila disetujui secara tertulis melalui addendum resmi yang ditandatangani oleh Para Pihak sebelum tanggal berakhirnya Perjanjian ini.`
          : `1. Hubungan kerja antara PIHAK PERTAMA dan PIHAK KEDUA adalah Perjanjian Kerja Waktu Tertentu (PKWT) berdasarkan jangka waktu sesuai Pasal 56 s/d Pasal 59 Undang-Undang No. 13 Tahun 2003 sebagaimana diubah dalam UU No. 6 Tahun 2023 dan Peraturan Pemerintah No. 35 Tahun 2021.\n2. Perjanjian Kerja Waktu Tertentu ini berlaku selama ${job.contractDurationMonths || 12} (${terbilang(job.contractDurationMonths || 12).replace(' rupiah', '')}) bulan penuh, terhitung mulai tanggal ${formatIndonesianDate(job.startDate)} dan akan berakhir demi hukum pada tanggal ${formatIndonesianDate(job.endDate || '')}.\n3. Sesuai Pasal 58 ayat (1) UU Ketenagakerjaan jo. Pasal 12 PP No. 35 Tahun 2021, Perjanjian PKWT ini tidak mensyaratkan masa percobaan (probation) dalam bentuk apapun.\n4. Selambat-lambatnya 7 (tujuh) hari kalender sebelum berakhirnya jangka waktu PKWT, PIHAK PERTAMA akan menyampaikan pemberitahuan tertulis mengenai berakhirnya kontrak atau penawaran perpanjangan kontrak baru yang total akumulasinya tidak melebihi batas maksimal 5 (lima) tahun sesuai PP No. 35 Tahun 2021.`;

    const statusArticleEn = isPkwtt
      ? `1. The employment relationship between the FIRST PARTY and the SECOND PARTY constitutes a Permanent Employment Agreement (PKWTT) effective as of ${formatEnglishDate(job.startDate)}.\n2. The SECOND PARTY shall undergo a probationary period of ${job.probationDurationMonths || 3} months from the commencement date pursuant to Article 60 of Law No. 13/2003 as amended by Law No. 6/2023.\n3. During the probationary period, the FIRST PARTY shall evaluate technical competence, integrity, cultural alignment, and attendance, and either party may terminate the engagement upon written notice without severance or penalty.\n4. Upon passing the written probationary evaluation issued by the Direct Supervisor and HR Department, the SECOND PARTY shall be formally confirmed as a Permanent Employee with seniority recognized from day one.`
      : isIntern
        ? `1. This Apprenticeship Agreement is valid for ${job.contractDurationMonths || 3} months commencing on ${formatEnglishDate(job.startDate)} and automatically expiring on ${formatEnglishDate(job.endDate || '')}.\n2. This relationship constitutes a structured vocational training arrangement pursuant to Ministry of Manpower Regulation No. 6/2020 and does not establish permanent or fixed-term employee status.\n3. The FIRST PARTY shall assign a designated mentor to supervise learning objectives and issue an official Certificate of Completion upon satisfactory fulfillment of the internship curriculum.`
        : isFreelance
          ? `1. This Independent Contractor Agreement is effective for ${job.contractDurationMonths || 6} months or until full completion of agreed deliverables, starting on ${formatEnglishDate(job.startDate)} and ending on ${formatEnglishDate(job.endDate || '')}.\n2. Both Parties expressly acknowledge that the SECOND PARTY operates as an independent professional service provider pursuant to Articles 1338 and 1601 of the Indonesian Civil Code and shall not be deemed an employee of the FIRST PARTY.\n3. Any extension or scope expansion shall require a formal written addendum executed by both Parties prior to expiration.`
          : `1. The employment relationship constitutes a Fixed-Term Employment Agreement (PKWT) governed by Articles 56–59 of Law No. 13/2003 as amended by Law No. 6/2023 and Government Regulation No. 35/2021.\n2. This Agreement is valid for a fixed period of ${job.contractDurationMonths || 12} months commencing on ${formatEnglishDate(job.startDate)} and automatically terminating by operation of law on ${formatEnglishDate(job.endDate || '')}.\n3. Pursuant to Article 58 of the Labor Law and Article 12 of GR No. 35/2021, no probationary period applies to this Fixed-Term Agreement.\n4. No later than 7 (seven) calendar days prior to the expiration date, the FIRST PARTY shall notify the SECOND PARTY in writing regarding contract completion or a renewal offer within the statutory 5-year cumulative limit.`;

    const compensationArticle7Id = isPkwt
      ? `1. Sesuai Pasal 15 sampai dengan Pasal 17 Peraturan Pemerintah No. 35 Tahun 2021, pada saat berakhirnya jangka waktu PKWT ini (atau perpanjangannya), PIHAK PERTAMA wajib memberikan Uang Kompensasi kepada PIHAK KEDUA yang telah mempunyai masa kerja paling sedikit 1 (satu) bulan secara terus-menerus.\n2. Besaran Uang Kompensasi dihitung secara proporsional berdasarkan rumus resmi: (Masa Kerja dalam bulan / 12) x 1 (satu) bulan Upah Pokok ditambah Tunjangan Tetap (dasar perhitungan saat kontrak ditandatangani sebesar ${formatRupiah(totalMonthlyFixed)}).\n3. Uang Kompensasi dibayarkan pada saat berakhirnya masa kontrak dan/atau setelah PIHAK KEDUA menuntaskan seluruh kewajiban serah terima pekerjaan serta pengembalian aset perusahaan.\n4. Apabila salah satu pihak mengakhiri hubungan kerja sebelum berakhirnya jangka waktu yang ditetapkan dalam PKWT ini, pihak yang mengakhiri tetap wajib memperhatikan ketentuan pembayaran ganti rugi sebagaimana dimaksud dalam Pasal 62 UU Ketenagakerjaan serta hak kompensasi masa kerja yang telah dijalani sesuai PP No. 35 Tahun 2021.`
      : `1. Setelah menjalani masa kerja selama 12 (dua belas) bulan secara terus-menerus, PIHAK KEDUA berhak atas istirahat/cuti tahunan selama 12 (dua belas) hari kerja dengan tetap menerima upah penuh sesuai Pasal 79 UU Ketenagakerjaan jo. UU No. 6 Tahun 2023.\n2. Pengajuan cuti tahunan wajib diajukan melalui sistem HRIS perusahaan sekurang-kurangnya 7 (tujuh) hari kerja sebelumnya dan mendapatkan persetujuan Atasan Langsung guna menjamin kelancaran operasional.\n3. Selain cuti tahunan, PIHAK KEDUA berhak atas izin meninggalkan pekerjaan dengan upah penuh sesuai Pasal 93 ayat (4) UU Ketenagakerjaan, meliputi:\n   a. Pernikahan pekerja sendiri: 3 (tiga) hari kerja;\n   b. Menikahkan, mengkhitankan, atau membaptiskan anak: 2 (dua) hari kerja;\n   c. Istri melahirkan atau mengalami keguguran kandungan: 2 (dua) hari kerja;\n   d. Suami/istri, orang tua/mertua, atau anak/menantu meninggal dunia: 2 (dua) hari kerja;\n   e. Anggota keluarga dalam satu rumah meninggal dunia: 1 (satu) hari kerja;\n   f. Cuti melahirkan bagi pekerja perempuan: 1,5 bulan sebelum dan 1,5 bulan sesudah melahirkan (total 3 bulan) sesuai surat keterangan dokter kandungan.\n4. Ketidakhadiran karena sakit harus dibuktikan dengan Surat Keterangan Dokter resmi yang sah dan diunggah pada sistem presensi maksimal 1x24 jam.`;

    const compensationArticle7En = isPkwt
      ? `1. Pursuant to Articles 15–17 of Government Regulation No. 35/2021, upon expiration of this PKWT (or each extension thereof), the FIRST PARTY shall pay End-of-Contract Compensation to the SECOND PARTY provided continuous service is at least 1 (one) month.\n2. Compensation is calculated proportionally: (Tenure in months / 12) x 1 (one) month Fixed Wage (Basic Salary + Fixed Allowance, currently ${formatRupiah(totalMonthlyFixed)}).\n3. Payment shall be disbursed upon contract completion following fulfillment of formal job handover and company asset clearance.\n4. Early unilateral termination shall remain subject to indemnity provisions under Article 62 of the Labor Law and accrued tenure compensation rules under GR No. 35/2021.`
      : `1. Upon completing 12 consecutive months of service, the SECOND PARTY is entitled to 12 (twelve) paid working days of annual leave per year under Article 79 of the Labor Law.\n2. Annual leave requests must be submitted through the HRIS portal at least 7 working days in advance and approved by the Direct Supervisor.\n3. The SECOND PARTY is additionally entitled to statutory paid special leave under Article 93(4) of the Labor Law (employee marriage: 3 days; child marriage/circumcision/baptism: 2 days; spouse childbirth/miscarriage: 2 days; immediate family bereavement: 2 days; household member bereavement: 1 day; statutory maternity leave: 3 months with physician certification).\n4. Sick leave requires an official medical certificate submitted within 24 hours.`;

    return [
      {
        id: 'cl-1',
        articleNumber: 1,
        titleId: 'KETENTUAN UMUM, DEFINISI DAN RUANG LINGKUP PERJANJIAN',
        titleEn: 'GENERAL PROVISIONS, DEFINITIONS AND SCOPE OF AGREEMENT',
        contentId: `1. Dalam Perjanjian Kerja ini, istilah-istilah berikut memiliki arti sebagai berikut:\n   a. "Perusahaan" atau "PIHAK PERTAMA" adalah ${company.legalEntity ? `${company.legalEntity} ` : ''}${company.companyName}, badan usaha yang bergerak di bidang usaha resmi sesuai Akta Pendirian dan NIB/NPWP ${company.nibOrNpwp || '-'}, berkedudukan di ${company.address}, ${company.city}.\n   b. "Karyawan" atau "PIHAK KEDUA" adalah ${employee.fullName} (NIK KTP: ${employee.nik}), subjek hukum cakap bertindak atas nama diri sendiri yang mengikatkan diri untuk melaksanakan pekerjaan bagi PIHAK PERTAMA.\n   c. "Peraturan Perusahaan (PP)" adalah seluruh pedoman tertulis, Standard Operating Procedure (SOP), kebijakan tata kelola SDM, kode etik, dan keputusan manajemen yang berlaku di lingkungan PIHAK PERTAMA.\n   d. "Informasi Rahasia" adalah seluruh data, kode sumber, arsitektur sistem, strategi komersial, laporan keuangan, daftar pelanggan/mitra, dan data pribadi yang dimiliki atau dikelola oleh PIHAK PERTAMA.\n2. Perjanjian ini dibuat dengan itikad baik, sukarela, tanpa paksaan dari pihak manapun, dan tunduk pada ketentuan Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan sebagaimana diubah oleh Undang-Undang No. 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja, Peraturan Pemerintah No. 35 Tahun 2021, serta peraturan pelaksana lainnya di Republik Indonesia.`,
        contentEn: `1. For the purposes of this Agreement, the following capitalized terms shall have the meanings set forth below:\n   a. "Company" or "FIRST PARTY" means ${company.companyName} (Registration/NIB: ${company.nibOrNpwp || '-'}), domiciled at ${company.address}, ${company.city}.\n   b. "Employee" or "SECOND PARTY" means ${employee.fullName} (National ID/NIK: ${employee.nik}), who legally binds themselves to perform professional duties for the FIRST PARTY.\n   c. "Company Regulations" means all official written HR policies, Standard Operating Procedures (SOPs), codes of conduct, and management directives issued by the FIRST PARTY.\n   d. "Confidential Information" encompasses all proprietary data, source code, system architecture, business strategies, financial records, client/vendor lists, and personal data.\n2. This Agreement is executed voluntarily in good faith and governed by Law No. 13/2003 as amended by Law No. 6/2023, Government Regulation No. 35/2021, and prevailing labor laws of the Republic of Indonesia.`,
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'cl-2',
        articleNumber: 2,
        titleId: 'KEDUDUKAN, JABATAN, TUGAS POKOK DAN PENEMPATAN KERJA',
        titleEn: 'POSITION, TITLE, CORE RESPONSIBILITIES AND WORKPLACE',
        contentId: `1. PIHAK PERTAMA mempekerjakan PIHAK KEDUA dan PIHAK KEDUA menerima penunjukan tersebut dalam kedudukan/jabatan sebagai ${job.positionTitle} pada Departemen ${job.department}${job.jobGrade ? ` (${job.jobGrade})` : ''}.\n2. Dalam menjalankan tugas sehari-hari, PIHAK KEDUA bertanggung jawab serta melapor langsung secara hierarkis kepada ${job.directSupervisor}.\n3. Lokasi pelaksanaan tugas ditetapkan di ${job.workLocationAddress} dengan pengaturan skema kerja ${job.workLocationType}.\n4. Lingkup tugas dan tanggung jawab pokok PIHAK KEDUA meliputi:\n   a. Melaksanakan seluruh uraian jabatan (Job Description) dan sasaran kerja utama (KPI/OKR) posisi ${job.positionTitle} secara profesional, akurat, dan tepat waktu;\n   b. Menyusun laporan kemajuan pekerjaan berkala, dokumentasi operasional, serta berkoordinasi aktif lintas departemen;\n   c. Menjaga standar kualitas layanan, kepatuhan prosedur, serta efisiensi biaya dan sumber daya operasional perusahaan;\n   d. Melaksanakan tugas tambahan lain yang relevan atas instruksi wajar Atasan Langsung atau Direksi.\n5. Demi kepentingan pengembangan organisasi atau kebutuhan bisnis, PIHAK PERTAMA berwenang menugaskan perjalanan dinas luar kota/luar negeri maupun melakukan rotasi, mutasi, atau penempatan ulang dengan pemberitahuan tertulis yang patut kepada PIHAK KEDUA.`,
        contentEn: `1. The FIRST PARTY hereby employs the SECOND PARTY, and the SECOND PARTY accepts employment as ${job.positionTitleEn || job.positionTitle} in the ${job.departmentEn || job.department} Department${job.jobGrade ? ` (${job.jobGrade})` : ''}.\n2. The SECOND PARTY shall report directly to ${job.directSupervisorEn || job.directSupervisor}.\n3. The primary workplace is ${job.workLocationAddress} under a ${job.workLocationType} working model.\n4. Core duties and responsibilities include:\n   a. Executing all Job Description obligations and Key Performance Indicators (KPIs) professionally, accurately, and on schedule;\n   b. Preparing periodic operational reports, documentation, and collaborating across functional teams;\n   c. Upholding service quality standards, compliance protocols, and operational efficiency;\n   d. Performing additional reasonable work assignments requested by management.\n5. The FIRST PARTY reserves the right to assign business travel, job rotation, transfer, or relocation across business units with reasonable written notice based on operational requirements.`,
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'cl-3',
        articleNumber: 3,
        titleId: isPkwtt ? 'STATUS KARYAWAN TETAP (PKWTT) DAN MASA PERCOBAAN' : 'STATUS HUBUNGAN KERJA DAN JANGKA WAKTU PERJANJIAN',
        titleEn: isPkwtt ? 'PERMANENT STATUS (PKWTT) AND PROBATIONARY PERIOD' : 'EMPLOYMENT STATUS AND TERM OF AGREEMENT',
        contentId: statusArticleId,
        contentEn: statusArticleEn,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'cl-4',
        articleNumber: 4,
        titleId: 'HARI KERJA, WAKTU KERJA, ISTIRAHAT, PRESENSI DAN LEMBUR',
        titleEn: 'WORKING DAYS, HOURS, REST PERIODS, ATTENDANCE AND OVERTIME',
        contentId: `1. Jam kerja normal ditetapkan maksimal 7 (tujuh) jam sehari atau 8 (delapan) jam sehari dan 40 (empat puluh) jam dalam 1 (satu) minggu sesuai Pasal 77 UU Ketenagakerjaan jo. Pasal 21 PP No. 35 Tahun 2021, dengan rincian:\n   a. Pola Hari Kerja    : ${workDaysTextId};\n   b. Jadwal Jam Kerja   : ${workHoursText};\n   c. Waktu Istirahat    : ${restHoursTextId}.\n2. Bagi unit kerja dengan operasional berkesinambungan (shift), jadwal kerja mengikuti daftar shift (roster) resmi yang diterbitkan manajemen setiap bulan tanpa melampaui batas maksimal 40 jam kerja normal per minggu.\n3. PIHAK KEDUA wajib melakukan pencatatan presensi masuk (clock-in) dan pulang (clock-out) setiap hari melalui aplikasi atau perangkat presensi resmi PIHAK PERTAMA secara jujur dan akurat. Manipulasi data kehadiran atau titip absen dikategorikan sebagai pelanggaran disiplin berat.\n4. Kerja lembur hanya sah apabila terdapat Surat Perintah Lembur (SPL) tertulis atau persetujuan digital resmi dari Atasan Langsung sebelum atau saat pelaksanaan lembur. ${job.isOvertimeApplicable ? `Perhitungan upah lembur dibayarkan sesuai tarif peraturan perundang-undangan PP No. 35 Tahun 2021 (${job.overtimeNotes || 'mengikuti perhitungan lembur normatif HRIS'}).` : 'Untuk jabatan manajerial/profesional tertentu dengan struktur kompensasi inklusif sesuai golongan jabatan, penugasan di luar jam normal diatur berdasarkan kebijakan kompensasi internal dan PP No. 35 Tahun 2021.'}`,
        contentEn: `1. Standard working hours are capped at 40 (forty) hours per week in compliance with Article 77 of the Labor Law and GR No. 35/2021:\n   a. Working Days   : ${workDaysTextEn};\n   b. Daily Schedule : ${workHoursText};\n   c. Rest Break     : ${restHoursTextEn}.\n2. For rotational shift operations, the SECOND PARTY shall follow the monthly shift roster issued by management within the statutory 40-hour weekly cap.\n3. The SECOND PARTY must accurately record daily clock-in and clock-out attendance via the Company HRIS. Attendance falsification or buddy-punching constitutes a major disciplinary breach.\n4. Overtime requires prior written or electronic Overtime Order approval from the Direct Supervisor. ${job.isOvertimeApplicable ? `Overtime shall be compensated strictly per statutory rates under GR No. 35/2021 (${job.overtimeNotes || 'calculated via HRIS payroll rules'}).` : 'For exempt specialist/managerial grades, extended hours are governed by internal compensation policy in compliance with statutory guidelines.'}`,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'cl-5',
        articleNumber: 5,
        titleId: 'STRUKTUR UPAH, TUNJANGAN, TATA CARA PEMBAYARAN DAN PAJAK',
        titleEn: 'COMPENSATION STRUCTURE, PAYMENT MECHANISM AND TAXATION',
        contentId: `1. Sebagai imbalan atas pelaksanaan pekerjaan, PIHAK PERTAMA memberikan paket remunerasi bulanan kepada PIHAK KEDUA dengan rincian sebagai berikut:\n   a. Gaji Pokok (Basic Salary): ${formatRupiah(comp.basicSalary)} (${terbilang(comp.basicSalary)}) per bulan;\n   b. Tunjangan Tetap (${comp.fixedAllowanceDescription || 'Tunjangan Jabatan & Keahlian'}): ${formatRupiah(comp.fixedAllowance)} (${terbilang(comp.fixedAllowance)}) per bulan;\n   c. Total Upah Tetap (Gaji Pokok + Tunjangan Tetap): ${formatRupiah(totalMonthlyFixed)} (${terbilang(totalMonthlyFixed)}) per bulan;\n   d. Tunjangan Tidak Tetap / Variabel (${comp.variableAllowanceDescription || 'Tunjangan Kehadiran, Makan & Transport'}): maksimal ${formatRupiah(comp.variableAllowance)} (${terbilang(comp.variableAllowance)}) per bulan yang dibayarkan secara proporsional berdasarkan hari kerja aktif;\n   e. Total Paket Penghasilan Bruto Bulanan: ${formatRupiah(totalMonthlyGross)} (${terbilang(totalMonthlyGross)}).\n2. Pembayaran upah dilaksanakan 1 (satu) kali setiap bulan pada setiap tanggal ${comp.paydayDate || 25} (atau hari kerja sebelumnya apabila jatuh pada hari libur nasional/akhir pekan) melalui metode ${comp.paymentMethod || 'Transfer Bank'} ke rekening terdaftar PIHAK KEDUA:\n   Bank: ${comp.bankName || '-'} | Nomor Rekening: ${comp.bankAccountNumber || '-'} | Atas Nama: ${comp.bankAccountHolder || employee.fullName}.\n3. Apabila PIHAK KEDUA mulai bekerja atau mengakhiri hubungan kerja di pertengahan periode penggajian, upah bulan berjalan dihitung secara proporsional (prorate) berdasarkan jumlah hari kerja aktual.\n4. Pemotongan Pajak Penghasilan (PPh Pasal 21) termasuk skema Tarif Efektif Rata-Rata (TER) sesuai PP No. 58 Tahun 2023 dan PMK terkait dilakukan oleh PIHAK PERTAMA dan disetorkan ke kas negara dengan bukti potong tahunan (Formulir 1721-A1) diserahkan kepada PIHAK KEDUA.`,
        contentEn: `1. In consideration of services rendered, the FIRST PARTY shall pay monthly remuneration to the SECOND PARTY as follows:\n   a. Basic Salary: ${formatRupiah(comp.basicSalary)} (${terbilangEn(comp.basicSalary)}) per month;\n   b. Fixed Allowance (${comp.fixedAllowanceDescription || 'Position Allowance'}): ${formatRupiah(comp.fixedAllowance)} (${terbilangEn(comp.fixedAllowance)}) per month;\n   c. Total Fixed Monthly Wage: ${formatRupiah(totalMonthlyFixed)} (${terbilangEn(totalMonthlyFixed)});\n   d. Variable Allowance (${comp.variableAllowanceDescription || 'Attendance, Meal & Transport'}): up to ${formatRupiah(comp.variableAllowance)} (${terbilangEn(comp.variableAllowance)}) prorated by actual attendance;\n   e. Total Gross Monthly Package: ${formatRupiah(totalMonthlyGross)} (${terbilangEn(totalMonthlyGross)}).\n2. Salaries are paid monthly on the ${comp.paydayDate || 25}th (or the preceding business day if falling on a weekend/holiday) via ${comp.paymentMethod || 'Bank Transfer'} to:\n   Bank: ${comp.bankName || '-'} | Account No: ${comp.bankAccountNumber || '-'} | Holder: ${comp.bankAccountHolder || employee.fullName}.\n3. Partial first or final months shall be prorated based on active working days.\n4. Income tax (PPh 21 under prevailing TER/DJP regulations) shall be withheld and remitted by the FIRST PARTY with annual tax certificates (Form 1721-A1) provided.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-6',
        articleNumber: 6,
        titleId: 'JAMINAN SOSIAL (BPJS) DAN TUNJANGAN HARI RAYA (THR)',
        titleEn: 'STATUTORY SOCIAL SECURITY (BPJS) AND RELIGIOUS HOLIDAY ALLOWANCE (THR)',
        contentId: `1. ${comp.hasBpjsKetenagakerjaan ? 'PIHAK PERTAMA wajib mengikutsertakan PIHAK KEDUA dalam program BPJS Ketenagakerjaan meliputi Jaminan Kecelakaan Kerja (JKK), Jaminan Kematian (JKM), Jaminan Hari Tua (JHT), Jaminan Pensiun (JP), dan Jaminan Kehilangan Pekerjaan (JKP) sesuai PP No. 44/2015, PP No. 46/2015, PP No. 45/2015, dan PP No. 37/2021.' : 'Kepesertaan program jaminan sosial ketenagakerjaan mengikuti ketentuan status kemitraan dan peraturan perundang-undangan yang berlaku.'}\n2. ${comp.hasBpjsKesehatan ? 'PIHAK PERTAMA mengikutsertakan PIHAK KEDUA beserta keluarga inti yang memenuhi syarat dalam program Jaminan Kesehatan Nasional (BPJS Kesehatan) sesuai Perpres No. 82 Tahun 2018 beserta pembagian iuran 4% ditanggung Perusahaan dan 1% dipotong dari upah Karyawan.' : 'Fasilitas jaminan kesehatan diatur tersendiri sesuai kebijakan paket kompensasi yang disepakati.'}\n3. ${comp.hasThr ? 'PIHAK KEDUA berhak memperoleh Tunjangan Hari Raya (THR) Keagamaan sesuai Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016: bagi karyawan dengan masa kerja 12 bulan atau lebih sebesar 1 (satu) bulan upah tetap, sedangkan masa kerja antara 1 bulan sampai kurang dari 12 bulan dibayarkan proporsional sebesar (Masa Kerja / 12) x 1 bulan upah tetap, selambat-lambatnya 7 (tujuh) hari sebelum hari raya keagamaan masing-masing.' : 'Untuk status perjanjian kemitraan/pemagangan ini, komponen THR mengikuti ketentuan regulasi kemitraan yang berlaku.'}`,
        contentEn: `1. ${comp.hasBpjsKetenagakerjaan ? 'The FIRST PARTY shall enroll the SECOND PARTY in mandatory BPJS Employment programs (Work Accident JKK, Death JKM, Old-Age JHT, Pension JP, and Job Loss JKP) with statutory employer-employee contribution splits.' : 'Social security enrollment follows applicable contractor/apprenticeship regulations.'}\n2. ${comp.hasBpjsKesehatan ? 'The FIRST PARTY shall register the SECOND PARTY under BPJS Healthcare with statutory contributions (4% employer, 1% employee deduction) pursuant to Presidential Regulation No. 82/2018.' : 'Healthcare coverage follows the specific benefits arrangement agreed.'}\n3. ${comp.hasThr ? 'The SECOND PARTY is entitled to Religious Holiday Allowance (THR) under Minister of Manpower Regulation No. 6/2016: 1 full month fixed wage after 12 months service, or prorated (Months / 12) x 1 month fixed wage for 1–11 months tenure, paid at least 7 days before the relevant religious holiday.' : 'Holiday allowance follows non-permanent engagement terms.'}`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-7',
        articleNumber: 7,
        titleId: isPkwt ? 'UANG KOMPENSASI PKWT (PP 35/2021) DAN HAK CUTI' : 'HAK CUTI TAHUNAN, CUTI KHUSUS DAN IZIN SAKIT',
        titleEn: isPkwt ? 'PKWT END COMPENSATION (GR 35/2021) AND LEAVE RIGHTS' : 'ANNUAL LEAVE, SPECIAL STATUTORY LEAVE AND SICK LEAVE',
        contentId: isPkwt
          ? `${compensationArticle7Id}\n5. PIHAK KEDUA tetap berhak atas izin sakit dengan surat dokter resmi, izin khusus sesuai Pasal 93 ayat (4) UU Ketenagakerjaan, serta hak cuti tahunan proporsional sesuai ketentuan Peraturan Perusahaan apabila masa kerja telah mencapai 12 bulan.`
          : compensationArticle7Id,
        contentEn: isPkwt
          ? `${compensationArticle7En}\n5. The SECOND PARTY remains entitled to medically certified sick leave, statutory special leave under Article 93(4), and annual leave upon reaching 12 consecutive months of service.`
          : compensationArticle7En,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'cl-8',
        articleNumber: 8,
        titleId: 'FASILITAS KERJA, INVENTARIS ASET DAN KEAMANAN SISTEM TI',
        titleEn: 'WORK FACILITIES, COMPANY ASSETS AND IT SECURITY',
        contentId: `1. Untuk menunjang kelancaran pelaksanaan tugas jabatan ${job.positionTitle}, PIHAK PERTAMA dapat meminjamkan perangkat kerja, kartu akses gedung, akun email korporat, lisensi perangkat lunak, atau aset operasional lainnya kepada PIHAK KEDUA.\n2. Seluruh aset dan perangkat kerja tersebut tetap merupakan hak milik mutlak PIHAK PERTAMA. PIHAK KEDUA wajib memelihara, menggunakan secara patut hanya untuk kepentingan tugas perusahaan, dan dilarang memindahtangankan, menyewakan, atau menginstal perangkat lunak ilegal pada aset tersebut.\n3. PIHAK KEDUA wajib mematuhi seluruh kebijakan keamanan siber (Cybersecurity Policy), termasuk menjaga kerahasiaan kata sandi, mengaktifkan autentikasi dua faktor (2FA), serta dilarang menghubungkan aset perusahaan ke jaringan atau media penyimpanan eksternal yang tidak terotorisasi.\n4. Apabila terjadi kehilangan atau kerusakan berat atas aset perusahaan akibat kelalaian yang terbukti dilakukan oleh PIHAK KEDUA, PIHAK KEDUA wajib bertanggung jawab mengganti kerugian sesuai nilai wajar aset dan prosedur berita acara aset.\n5. Pada saat hubungan kerja berakhir karena sebab apapun, PIHAK KEDUA wajib menyerahkan kembali seluruh fasilitas dan inventaris kerja dalam keadaan baik beserta bukti berita acara serah terima aset.`,
        contentEn: `1. To support execution of duties as ${job.positionTitleEn || job.positionTitle}, the FIRST PARTY may provide laptops, building access cards, corporate email accounts, software licenses, or operational equipment.\n2. All assigned facilities remain the sole property of the FIRST PARTY. The SECOND PARTY shall safeguard them exclusively for authorized work and shall not transfer, lend, or install unlicensed software.\n3. The SECOND PARTY must strictly follow Corporate IT & Cybersecurity Policies, maintain password hygiene, enforce 2FA, and refrain from unauthorized external data transfers.\n4. Loss or severe damage arising from proven gross negligence may render the SECOND PARTY liable for replacement costs per company asset audit procedures.\n5. Upon termination for any reason, all company assets and credentials must be returned intact prior to final settlement.`,
        isMandatory: true,
        isEnabled: true,
        category: 'kewajiban_nda'
      },
      {
        id: 'cl-9',
        articleNumber: 9,
        titleId: 'EVALUASI KINERJA (KPI), KOMPETENSI DAN PEMBINAAN',
        titleEn: 'PERFORMANCE EVALUATION (KPI), COMPETENCY AND COACHING',
        contentId: `1. PIHAK PERTAMA melakukan penilaian kinerja berkala (triwulanan, semesteran, dan tahunan) terhadap PIHAK KEDUA berdasarkan pencapaian Key Performance Indicators (KPI), mutu hasil kerja, kedisiplinan, inisiatif, serta kerja sama tim.\n2. Hasil evaluasi kinerja menjadi dasar pertimbangan objektif bagi PIHAK PERTAMA dalam penentuan penyesuaian remunerasi, bonus kinerja, promosi jabatan, perpanjangan kontrak, maupun program pengembangan pelatihan karyawan.\n3. Apabila pencapaian kinerja PIHAK KEDUA dinilai berada di bawah standar minimal yang dipersyaratkan, PIHAK PERTAMA berhak menempatkan PIHAK KEDUA ke dalam Program Peningkatan Kinerja (Performance Improvement Plan / PIP) terukur selama 30–90 hari dengan pendampingan Atasan Langsung.\n4. PIHAK KEDUA wajib mengikuti pelatihan wajib (mandatory training), sertifikasi kompetensi, dan program keselamatan kerja (K3) yang diselenggarakan oleh PIHAK PERTAMA.`,
        contentEn: `1. The FIRST PARTY conducts periodic performance appraisals (quarterly, semi-annual, and annual) evaluating KPI attainment, work quality, discipline, initiative, and team collaboration.\n2. Appraisal outcomes serve as the objective basis for merit increments, performance bonuses, promotions, contract renewals, and training plans.\n3. Should performance fall below required standards, the FIRST PARTY may place the SECOND PARTY on a structured 30–90 day Performance Improvement Plan (PIP) under direct supervisory coaching.\n4. The SECOND PARTY shall participate in mandatory training, competency certifications, and workplace safety (OHS/K3) briefings organized by the Company.`,
        isMandatory: false,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'cl-10',
        articleNumber: 10,
        titleId: 'KERAHASIAAN INFORMASI (NDA) DAN PELINDUNGAN DATA PRIBADI',
        titleEn: 'NON-DISCLOSURE OBLIGATION (NDA) AND PERSONAL DATA PROTECTION',
        contentId: `1. PIHAK KEDUA menyadari sepenuhnya bahwa selama bekerja akan memperoleh akses terhadap Informasi Rahasia perusahaan, meliputi namun tidak terbatas pada: rahasia dagang, kode sumber perangkat lunak, algoritma, database pelanggan dan karyawan, struktur penggajian, kontrak komersial, harga penawaran, dokumen keuangan, serta rencana bisnis strategis PIHAK PERTAMA.\n2. PIHAK KEDUA dilarang keras menyalin, membocorkan, mengunggah ke layanan cloud publik/AI pihak ketiga yang tidak disetujui, menjual, atau memanfaatkan Informasi Rahasia tersebut untuk kepentingan pribadi maupun pihak ketiga manapun.\n3. Sehubungan dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), PIHAK KEDUA wajib memproses seluruh data pribadi karyawan, kandidat, atau pelanggan hanya sesuai tujuan kerja yang sah dan menjaga integritas keamanannya.\n4. Kewajiban menjaga kerahasiaan informasi ini tetap berlaku mengikat secara hukum selama hubungan kerja berlangsung dan terus bertahan selama jangka waktu sekurang-kurangnya 5 (lima) tahun setelah berakhirnya hubungan kerja.\n5. Pelanggaran terhadap pasal kerahasiaan ini memberi hak kepada PIHAK PERTAMA untuk melakukan pemutusan hubungan kerja seketika serta menempuh tuntutan hukum perdata (ganti rugi materiil & immateriil) maupun pidana sesuai UU Rahasia Dagang No. 30 Tahun 2000 dan UU ITE.`,
        contentEn: `1. The SECOND PARTY acknowledges access to Confidential Information including trade secrets, source code, algorithms, client/employee databases, payroll data, commercial contracts, pricing, financial statements, and strategic roadmaps.\n2. The SECOND PARTY shall strictly refrain from copying, disclosing, uploading to unauthorized third-party cloud/AI services, or exploiting Confidential Information for personal gain or third parties.\n3. In compliance with Law No. 27/2022 on Personal Data Protection (PDP Law), personal data encountered during employment shall be processed solely for authorized business purposes.\n4. Confidentiality obligations survive termination of employment and remain legally binding for at least 5 (five) years post-termination.\n5. Any breach entitles the FIRST PARTY to immediate termination and civil/criminal remedies under Indonesian Trade Secret Law No. 30/2000 and Electronic Information laws.`,
        isMandatory: true,
        isEnabled: true,
        category: 'kewajiban_nda'
      },
      {
        id: 'cl-11',
        articleNumber: 11,
        titleId: 'HAK KEKAYAAN INTELEKTUAL (HAKI / INTELLECTUAL PROPERTY)',
        titleEn: 'INTELLECTUAL PROPERTY RIGHTS (IPR OWNERSHIP)',
        contentId: `1. Segala hasil karya cipta, perangkat lunak, source code, dokumentasi teknis, desain antarmuka, merek, konsep kampanye, modul pelatihan, paten, maupun inovasi teknologi dan bisnis yang dibuat atau dikembangkan oleh PIHAK KEDUA — baik sendiri maupun bersama tim — selama jam kerja atau menggunakan fasilitas, data, maupun biaya PIHAK PERTAMA sepenuhnya merupakan Hak Kekayaan Intelektual milik eksklusif PIHAK PERTAMA (work made for hire).\n2. PIHAK KEDUA dengan ini melepaskan segala klaim royalti tambahan selain upah yang diperjanjikan serta bersedia menandatangani dokumen pengalihan hak yang diperlukan apabila dimintakan oleh PIHAK PERTAMA guna pendaftaran HAKI ke Direktorat Jenderal Kekayaan Intelektual.`,
        contentEn: `1. All works of authorship, software, source code, technical specifications, UI designs, trademarks, training modules, inventions, and innovations conceived or created by the SECOND PARTY during working hours or utilizing Company resources belong exclusively to the FIRST PARTY as work made for hire.\n2. The SECOND PARTY waives any claims for additional royalties beyond agreed compensation and agrees to execute all instruments necessary to register or enforce Company IP rights.`,
        isMandatory: true,
        isEnabled: true,
        category: 'kewajiban_nda'
      },
      {
        id: 'cl-12',
        articleNumber: 12,
        titleId: 'BENTURAN KEPENTINGAN (CONFLICT OF INTEREST) DAN ANTI-SUAP',
        titleEn: 'CONFLICT OF INTEREST AND ANTI-BRIBERY COMPLIANCE',
        contentId: `1. Selama terikat dalam hubungan kerja (khususnya karyawan penuh waktu), PIHAK KEDUA tidak diperkenankan bekerja rangkap (moonlighting), menjadi konsultan, pengurus, atau pemegang saham pengendali pada perusahaan kompetitor atau mitra usaha yang berpotensi menimbulkan benturan kepentingan tanpa izin tertulis terlebih dahulu dari Direksi PIHAK PERTAMA.\n2. PIHAK KEDUA dilarang keras meminta, menerima, atau menjanjikan suap, komisi ilegal (kickback), gratifikasi, atau hadiah bernilai ekonomis dari vendor, pemasok, klien, maupun instansi manapun yang memengaruhi objektivitas keputusan bisnis.\n3. Apabila terdapat hubungan keluarga atau afiliasi bisnis dengan calon vendor/kandidat karyawan, PIHAK KEDUA wajib melaporkan secara tertulis kepada Departemen SDM untuk menghindari benturan kepentingan.`,
        contentEn: `1. During active full-time employment, the SECOND PARTY shall not engage in secondary employment, consulting, directorship, or conflicting business ventures with competitors or vendors without prior written approval from Management.\n2. The SECOND PARTY is strictly prohibited from soliciting, offering, or accepting bribes, kickbacks, or improper gratuities from clients, suppliers, or third parties.\n3. Any familial or financial affiliation with prospective vendors or candidates must be disclosed promptly in writing to HR.`,
        isMandatory: true,
        isEnabled: true,
        category: 'kewajiban_nda'
      },
      {
        id: 'cl-13',
        articleNumber: 13,
        titleId: 'TATA TERTIB KERJA, PELANGGARAN DISIPLIN DAN SANKSI',
        titleEn: 'CODE OF CONDUCT, DISCIPLINARY BREACHES AND SANCTIONS',
        contentId: `1. PIHAK KEDUA wajib menjunjung tinggi etika profesi, berpakaian rapi dan sopan sesuai standar perusahaan, menjaga kerukunan lingkungan kerja, bebas dari narkotika/alkohol, serta menaati seluruh Peraturan Perusahaan dan SOP Keselamatan Kesehatan Kerja (K3).\n2. Terhadap pelanggaran disiplin kerja, keterlambatan berulang, atau kelalaian tugas, PIHAK PERTAMA berhak memberikan pembinaan dan sanksi berjenjang berupa:\n   a. Teguran Lisan / Tertulis terdokumentasi;\n   b. Surat Peringatan Pertama (SP 1), Surat Peringatan Kedua (SP 2), atau Surat Peringatan Ketiga/Terakhir (SP 3), masing-masing berlaku efektif selama 6 (enam) bulan sejak tanggal diterbitkan.\n3. Untuk pelanggaran yang bersifat mendesak atau berat sebagaimana diatur dalam Pasal 52 ayat (2) PP No. 35 Tahun 2021 — seperti penipuan, pencurian/penggelapan aset, pemalsuan dokumen, penganiayaan/intimidasi, penyalahgunaan wewenang/suap, atau pembocoran rahasia perusahaan — PIHAK PERTAMA berhak menjatuhkan Surat Peringatan Ketiga secara langsung atau melakukan Pemutusan Hubungan Kerja tanpa melalui jenjang SP1/SP2 sebelumnya.`,
        contentEn: `1. The SECOND PARTY shall uphold professional ethics, workplace attire standards, mutual respect, a drug-free workplace, and OHS/K3 safety rules.\n2. Disciplinary infractions, repeated tardiness, or operational negligence may incur progressive sanctions:\n   a. Documented verbal or written reprimand;\n   b. First (SP 1), Second (SP 2), or Third/Final (SP 3) Warning Letters, each remaining active for 6 (six) months.\n3. For urgent or gross misconduct under Article 52(2) of GR No. 35/2021 (fraud, theft, forgery, harassment/assault, bribery, or trade secret leaks), the FIRST PARTY may issue immediate SP 3 or terminate employment directly.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'cl-14',
        articleNumber: 14,
        titleId: 'PENGAKHIRAN HUBUNGAN KERJA, HANDOVER DAN KEADAAN KAHAR',
        titleEn: 'TERMINATION, HANDOVER OBLIGATIONS AND FORCE MAJEURE',
        contentId: `1. Hubungan kerja berakhir apabila:\n   a. Berakhirnya jangka waktu yang diperjanjikan dalam PKWT ini (atau perpanjangannya);\n   b. PIHAK KEDUA mengajukan pengunduran diri secara sukarela atas kemauan sendiri dengan pemberitahuan tertulis sekurang-kurangnya ${job.noticePeriodDays || 30} (${terbilang(job.noticePeriodDays || 30).replace(' rupiah', '')}) hari kalender sebelum tanggal efektif pengunduran diri (one month notice) sesuai Pasal 81 angka 42 UU Cipta Kerja;\n   c. PIHAK KEDUA meninggal dunia atau memasuki usia pensiun sesuai peraturan perusahaan;\n   d. Terjadi pemutusan hubungan kerja akibat pelanggaran disiplin berat, efisiensi operasional, atau alasan sah lainnya sesuai PP No. 35 Tahun 2021.\n2. Dalam setiap peristiwa pengakhiran hubungan kerja, PIHAK KEDUA wajib menuntaskan seluruh proses serah terima pekerjaan (handover memorandum), menyerahkan akses akun/dokumen kerja, melunasi kewajiban pinjaman/kasbon (jika ada), serta mengembalikan seluruh inventaris perusahaan paling lambat pada hari kerja terakhir sebagai syarat penyelesaian administrasi (clearance) sebelum penerbitan Paklaring dan pencairan hak final.\n3. Dalam hal terjadi Keadaan Kahar (Force Majeure) di luar kendali wajar Para Pihak (bencana alam, perang, pandemi nasional, kebijakan darurat pemerintah), masing-masing pihak tidak dapat menuntut ganti rugi atas keterlambatan kewajiban yang semata-mata disebabkan oleh kejadian tersebut, dan Para Pihak wajib bermusyawarah mencari solusi terbaik sesuai regulasi ketenagakerjaan.`,
        contentEn: `1. Employment terminates upon:\n   a. Natural expiration of the agreed fixed term (if PKWT);\n   b. Voluntary resignation with at least ${job.noticePeriodDays || 30} calendar days prior written notice (one month notice);\n   c. Employee demise or attainment of statutory retirement age;\n   d. Lawful termination for cause, redundancy, or restructuring under GR No. 35/2021.\n2. Upon termination, the SECOND PARTY must complete a written Work Handover Memorandum, surrender credentials, settle any outstanding employee loans, and return all Company assets by the final working day as a prerequisite for clearance, Certificate of Employment (Paklaring), and final settlement.\n3. Neither party shall be liable for delays caused strictly by Force Majeure (natural disasters, war, national emergency, or mandatory government orders), subject to good-faith consultation.`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'cl-15',
        articleNumber: 15,
        titleId: 'PENYELESAIAN PERSELISIHAN, KETERPISAHAN DAN KETENTUAN PENUTUP',
        titleEn: 'DISPUTE RESOLUTION, SEVERABILITY AND CLOSING PROVISIONS',
        contentId: `1. Apabila timbul perbedaan penafsiran atau perselisihan hubungan industrial sehubungan dengan pelaksanaan Perjanjian ini, Para Pihak sepakat menyelesaikannya terlebih dahulu melalui musyawarah untuk mufakat secara Bipartit paling lama 30 (tiga puluh) hari kerja sesuai Undang-Undang No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial (PPHI).\n2. Apabila penyelesaian Bipartit tidak mencapai kesepakatan, perselisihan diselesaikan melalui mediasi/konsiliasi pada Dinas Ketenagakerjaan setempat dan apabila masih belum terselesaikan dapat diajukan ke Pengadilan Hubungan Industrial (PHI) pada Pengadilan Negeri yang berwenang di wilayah hukum ${doc.signingCity}.\n3. Apabila terdapat satu atau lebih ketentuan dalam Perjanjian ini yang dinyatakan tidak sah atau batal demi hukum oleh peraturan terbaru, ketentuan lainnya tetap berlaku penuh dan mengikat Para Pihak (Severability).\n4. Setiap perubahan, penambahan, atau pembaruan atas ketentuan Perjanjian ini hanya sah dan mengikat apabila dituangkan dalam Addendum tertulis yang ditandatangani oleh kedua belah pihak.\n5. Perjanjian Kerja ini dibuat dalam rangkap 2 (dua) asli yang bermaterai cukup (Rp 10.000,-), masing-masing memiliki kekuatan hukum pembuktian yang sama, 1 (satu) rangkap dipegang oleh PIHAK PERTAMA dan 1 (satu) rangkap dipegang oleh PIHAK KEDUA.`,
        contentEn: `1. Any dispute arising out of or in connection with this Agreement shall first be resolved amicably through Bipartite Negotiations within 30 (thirty) working days pursuant to Law No. 2/2004 on Industrial Relations Dispute Settlement.\n2. Failing bipartite settlement, the dispute shall be referred to Manpower Office mediation and, if unresolved, submitted to the Industrial Relations Court (PHI) having jurisdiction over ${doc.signingCity}.\n3. If any provision herein is held invalid under applicable law, the remaining provisions shall remain in full force and effect (Severability).\n4. Any amendment or modification to this Agreement shall only be valid if executed in a written Addendum signed by both Parties.\n5. Executed in 2 (two) duly stamped original counterparts (IDR 10,000 duty stamp) with equal legal force, one retained by each Party.`,
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
      renewalReason: 'Pencapaian Key Performance Indicator (KPI) tahunan yang sangat memuaskan dan kebutuhan kesinambungan proyek strategis.'
    };

    const newBasic = ren.isSalaryAdjusted && ren.newBasicSalary ? ren.newBasicSalary : comp.basicSalary;
    const newTotalFixed = newBasic + (comp.fixedAllowance || 0);
    const newTotalGross = newTotalFixed + (comp.variableAllowance || 0);

    return [
      {
        id: 'ren-1',
        articleNumber: 1,
        titleId: 'DASAR HUKUM, RUJUKAN KONTRAK INDUK DAN PERTIMBANGAN',
        titleEn: 'LEGAL BASIS, PRINCIPAL AGREEMENT REFERENCE AND RATIONALE',
        contentId: `1. Addendum Perpanjangan PKWT ini merupakan satu kesatuan dokumen yang tidak terpisahkan dari Perjanjian Kerja Waktu Tertentu (PKWT) Induk Nomor: ${ren.previousContractNumber} tertanggal ${formatIndonesianDate(ren.previousStartDate)} yang berlaku sampai dengan ${formatIndonesianDate(ren.previousEndDate)}.\n2. Berdasarkan hasil evaluasi kinerja objektif dan kebutuhan operasional perusahaan, PIHAK PERTAMA memutuskan memperpanjang hubungan kerja dengan PIHAK KEDUA dengan pertimbangan: ${ren.renewalReason}.\n3. Perpanjangan PKWT ini dilaksanakan sesuai ketentuan Pasal 59 UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023 dan Pasal 8 Peraturan Pemerintah No. 35 Tahun 2021.`,
        contentEn: `1. This Renewal Addendum forms an integral part of Principal Fixed-Term Employment Agreement No: ${ren.previousContractNumber} dated ${formatEnglishDate(ren.previousStartDate)} expiring on ${formatEnglishDate(ren.previousEndDate)}.\n2. Based on formal performance evaluation and business continuity needs, the FIRST PARTY extends employment with the SECOND PARTY for the following rationale: ${ren.renewalReason}.\n3. This extension is executed in compliance with Article 59 of the Labor Law and Article 8 of Government Regulation No. 35/2021.`,
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'ren-2',
        articleNumber: 2,
        titleId: 'MASA PERPANJANGAN KONTRAK KERJA BARU DAN BATAS AKUMULASI',
        titleEn: 'NEW EXTENSION PERIOD AND CUMULATIVE STATUTORY CAP',
        contentId: `1. Para Pihak sepakat memperpanjang jangka waktu hubungan kerja PKWT selama ${ren.renewalDurationMonths} (${terbilang(ren.renewalDurationMonths).replace(' rupiah', '')}) bulan penuh, terhitung mulai tanggal ${formatIndonesianDate(ren.renewalStartDate)} dan berakhir secara otomatis pada tanggal ${formatIndonesianDate(ren.renewalEndDate)}.\n2. Total keseluruhan akumulasi jangka waktu PKWT awal beserta perpanjangannya tidak melampaui batas maksimal 5 (lima) tahun sebagaimana ditetapkan dalam Pasal 8 ayat (1) PP No. 35 Tahun 2021.\n3. Perpanjangan kontrak ini tidak memberlakukan masa percobaan (probation).`,
        contentEn: `1. Both Parties agree to extend the fixed-term employment for ${ren.renewalDurationMonths} months commencing on ${formatEnglishDate(ren.renewalStartDate)} and automatically expiring on ${formatEnglishDate(ren.renewalEndDate)}.\n2. Combined tenure under the original PKWT and this extension remains strictly within the 5-year statutory maximum under Article 8(1) of GR No. 35/2021.\n3. No probationary period applies to this extension.`,
        isMandatory: true,
        isEnabled: true,
        category: 'waktu_kerja'
      },
      {
        id: 'ren-3',
        articleNumber: 3,
        titleId: 'JABATAN, PENEMPATAN DAN PENYESUAIAN STRUKTUR REMUNERASI',
        titleEn: 'POSITION, WORKPLACE AND REMUNERATION ADJUSTMENT',
        contentId: `1. Selama masa perpanjangan, PIHAK KEDUA tetap memangku jabatan sebagai ${job.positionTitle} pada Departemen ${job.department}, melapor langsung kepada ${job.directSupervisor}, dengan lokasi kerja di ${job.workLocationAddress} (${job.workLocationType}).\n2. Terhitung sejak tanggal ${formatIndonesianDate(ren.renewalStartDate)}, PIHAK KEDUA berhak atas paket remunerasi bulanan sebagai berikut:\n   a. Gaji Pokok: ${formatRupiah(newBasic)} (${terbilang(newBasic)});\n   b. Tunjangan Tetap (${comp.fixedAllowanceDescription || 'Jabatan'}): ${formatRupiah(comp.fixedAllowance)} (${terbilang(comp.fixedAllowance)});\n   c. Total Upah Tetap Bulanan: ${formatRupiah(newTotalFixed)} (${terbilang(newTotalFixed)});\n   d. Tunjangan Variabel (${comp.variableAllowanceDescription || 'Transport & Makan'}): ${formatRupiah(comp.variableAllowance)} (${terbilang(comp.variableAllowance)});\n   e. Total Penghasilan Bruto Bulanan: ${formatRupiah(newTotalGross)} (${terbilang(newTotalGross)}).\n3. Upah dibayarkan setiap tanggal ${comp.paydayDate || 25} melalui transfer ke ${comp.bankName} No. Rek ${comp.bankAccountNumber} a.n. ${comp.bankAccountHolder || employee.fullName}, setelah pemotongan PPh 21 TER dan iuran BPJS sesuai ketentuan.`,
        contentEn: `1. During this extension, the SECOND PARTY continues serving as ${job.positionTitleEn || job.positionTitle} in the ${job.departmentEn || job.department} Department, reporting to ${job.directSupervisorEn || job.directSupervisor} at ${job.workLocationAddress} (${job.workLocationType}).\n2. Effective ${formatEnglishDate(ren.renewalStartDate)}, monthly compensation is established at:\n   a. Basic Salary: ${formatRupiah(newBasic)} (${terbilangEn(newBasic)});\n   b. Fixed Allowance: ${formatRupiah(comp.fixedAllowance)} (${terbilangEn(comp.fixedAllowance)});\n   c. Total Fixed Monthly Wage: ${formatRupiah(newTotalFixed)} (${terbilangEn(newTotalFixed)});\n   d. Variable Allowance: ${formatRupiah(comp.variableAllowance)} (${terbilangEn(comp.variableAllowance)});\n   e. Total Monthly Gross: ${formatRupiah(newTotalGross)}.\n3. Paid monthly on the ${comp.paydayDate || 25}th via ${comp.bankName} Acc. ${comp.bankAccountNumber}, subject to PPh 21 and BPJS deductions.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'ren-4',
        articleNumber: 4,
        titleId: 'KETENTUAN UANG KOMPENSASI PKWT (PASAL 15–17 PP 35/2021)',
        titleEn: 'PKWT COMPENSATION SETTLEMENT (ARTICLES 15–17 GR 35/2021)',
        contentId: `1. Sesuai Pasal 15 ayat (3) dan Penjelasan PP No. 35 Tahun 2021, uang kompensasi atas masa kerja PKWT periode pertama (sebelum perpanjangan ini) wajib dibayarkan atau diperhitungkan pada saat selesainya jangka waktu PKWT awal.\n2. Selanjutnya, pada saat berakhirnya masa perpanjangan PKWT ini tanggal ${formatIndonesianDate(ren.renewalEndDate)}, PIHAK PERTAMA wajib kembali membayarkan uang kompensasi periode perpanjangan yang dihitung proporsional: (${ren.renewalDurationMonths}/12) x 1 bulan Upah Tetap (${formatRupiah(newTotalFixed)}).`,
        contentEn: `1. Pursuant to Article 15(3) of GR No. 35/2021, statutory end-of-contract compensation for the initial PKWT term is payable upon completion of the initial contract period.\n2. Upon expiration of this extended term on ${formatEnglishDate(ren.renewalEndDate)}, the FIRST PARTY shall pay extension compensation calculated proportionally: (${ren.renewalDurationMonths}/12) x 1 month Fixed Wage (${formatRupiah(newTotalFixed)}).`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'ren-5',
        articleNumber: 5,
        titleId: 'KEBERLAKUAN PASAL LAINNYA, NDA, HAKI DAN PENUTUP',
        titleEn: 'CONTINUITY OF NDA, IPR, OTHER CLAUSES AND CLOSING',
        contentId: `1. Seluruh ketentuan lain mengenai Hari dan Jam Kerja, Jaminan Sosial BPJS, Tunjangan Hari Raya (THR), Perlindungan Data Pribadi, Kerahasiaan Informasi (NDA), Hak Kekayaan Intelektual (HAKI), Benturan Kepentingan, Tata Tertib Sanksi, serta Penyelesaian Perselisihan yang tercantum dalam PKWT Induk Nomor: ${ren.previousContractNumber} dinyatakan tetap berlaku penuh dan mengikat sepanjang tidak diubah secara tegas dalam Addendum ini.\n2. Addendum Perpanjangan ini dibuat dalam rangkap 2 (dua) bermaterai cukup (Rp 10.000,-) dan memiliki kekuatan hukum yang sama bagi kedua belah pihak.`,
        contentEn: `1. All other terms regarding Working Hours, BPJS, THR, Confidentiality (NDA), Intellectual Property Rights, Conflict of Interest, Discipline, and Dispute Resolution set forth in Principal Agreement No: ${ren.previousContractNumber} remain in full force unless expressly amended herein.\n2. Executed in 2 (two) duly stamped counterparts with equal legal validity.`,
        isMandatory: true,
        isEnabled: true,
        category: 'penutup'
      }
    ];
  }

  // 3. SK PROMOSI JABATAN (KONSIDERAN: MENIMBANG, MENGINGAT, MEMPERHATIKAN, MENETAPKAN)
  if (type === 'SK_PROMOSI') {
    const newPositionTitle = doc.promotion?.newPositionTitle || 'Senior Software Engineer';
    const newBasicSalary = doc.promotion?.newBasicSalary || comp.basicSalary + 3000000;
    const promo = doc.promotion || {
      previousPositionTitle: job.positionTitle || 'Software Engineer',
      newPositionTitle,
      previousDepartment: job.department || 'Engineering & Technology',
      newDepartment: job.department || 'Engineering & Technology',
      previousJobGrade: 'Grade 5',
      newJobGrade: 'Grade 7',
      effectiveDate: doc.signingDate,
      previousBasicSalary: comp.basicSalary,
      newBasicSalary,
      considerations: [
        `Bahwa berdasarkan hasil evaluasi kinerja tahunan, pencapaian Key Performance Indicators (KPI), dedikasi, serta integritas kerja Sdr/i ${employee.fullName}, Perusahaan memandang perlu memberikan penghargaan berupa promosi jabatan.`,
        'Bahwa karyawan yang bersangkutan dinilai telah memenuhi seluruh standar kompetensi teknis, kepemimpinan, serta kesiapan mengemban tanggung jawab manajerial/spesialis pada jenjang jabatan yang lebih tinggi.'
      ],
      legalReferences: [
        'Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan jo. Undang-Undang No. 6 Tahun 2023 tentang Cipta Kerja.',
        'Peraturan Pemerintah No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan Pemutusan Hubungan Kerja.',
        `Peraturan Perusahaan / PKB ${company.companyName} Bab Pola Karier, Evaluasi Kinerja dan Skala Upah.`
      ],
      observations: [
        'Hasil penilaian Komite Penilai Kinerja (Performance Appraisal Committee) dan rekam jejak presensi.',
        'Surat Rekomendasi tertulis dari Kepala Departemen terkait serta persetujuan Direksi dan Departemen Human Resources.'
      ],
      decisions: [
        `KESATU: Mengangkat dan mempromosikan Sdr/i ${employee.fullName} (NIK: ${employee.nik}) dari jabatan semula ${job.positionTitle || 'Software Engineer'} menjadi ${newPositionTitle} pada Departemen ${job.department}.`,
        `KEDUA: Menetapkan penyesuaian Gaji Pokok Baru sebesar ${formatRupiah(newBasicSalary)} (${terbilang(newBasicSalary)}) per bulan beserta tunjangan jabatan sesuai struktur skala upah baru, berlaku efektif sejak tanggal ${formatIndonesianDate(doc.signingDate)}.`,
        `KETIGA: Karyawan yang bersangkutan bertanggung jawab langsung kepada ${job.directSupervisor} serta wajib melaksanakan seluruh kewenangan, target KPI, dan uraian jabatan baru secara penuh tanggung jawab.`,
        'KEEMPAT: Segala hak kepegawaian, jaminan sosial BPJS, dan perpajakan PPh 21 menyesuaikan secara otomatis dengan status dan penghasilan baru.',
        'KELIMA: Surat Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan administratif akan dilakukan pembetulan sebagaimana mestinya.'
      ]
    };

    return [
      {
        id: 'promo-1',
        articleNumber: 1,
        titleId: 'MENIMBANG (KONSIDERAN PENILAIAN)',
        titleEn: 'CONSIDERATIONS',
        contentId: promo.considerations.map((item, idx) => `${idx + 1}. ${item}`).join('\n\n'),
        contentEn: promo.considerations.map((item, idx) => `${idx + 1}. ${item}`).join('\n\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'ketentuan_umum'
      },
      {
        id: 'promo-2',
        articleNumber: 2,
        titleId: 'MENGINGAT (LANDASAN HUKUM & PERATURAN)',
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
        titleId: 'MEMPERHATIKAN (REKOMENDASI & HASIL EVALUASI)',
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
        titleId: 'MEMUTUSKAN DAN MENETAPKAN',
        titleEn: 'DECISIONS AND RESOLUTIONS',
        contentId: promo.decisions.join('\n\n'),
        contentEn: promo.decisions.join('\n\n'),
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      }
    ];
  }

  // 4. SURAT PERINGATAN (SP 1, SP 2, SP 3)
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
        titleId: 'DASAR HUKUM DAN KEWENANGAN PENERBITAN SANKSI',
        titleEn: 'LEGAL GROUNDS AND DISCIPLINARY AUTHORITY',
        contentId: `1. Berdasarkan hasil pengawasan operasional, audit catatan presensi/kinerja, serta Berita Acara Pemeriksaan (BAP) Disiplin yang dilakukan oleh Manajemen PIHAK PERTAMA terhadap PIHAK KEDUA (${employee.fullName}, NIK: ${employee.nik}, Jabatan: ${job.positionTitle}, Departemen: ${job.department}).\n2. Penerbitan Surat Peringatan ini dilaksanakan berdasarkan Pasal 161 Undang-Undang No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023 serta Peraturan Pemerintah No. 35 Tahun 2021.\n3. Rujukan Ketentuan Internal yang dilanggar: Peraturan Perusahaan ${company.companyName} (${warn.violationClauseReference}).\n4. Kategori Pelanggaran: ${warn.violationCategory}.`,
        contentEn: `1. Based on operational supervision, attendance/performance records, and the Disciplinary Examination Report conducted by Management regarding the SECOND PARTY (${employee.fullName}, NIK: ${employee.nik}, Position: ${job.positionTitle}).\n2. Issued pursuant to Article 161 of Law No. 13/2003 as amended by Law No. 6/2023 and GR No. 35/2021.\n3. Internal Rule Breached: Company Regulations (${warn.violationClauseReference}).\n4. Violation Category: ${warn.violationCategory}.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-2',
        articleNumber: 2,
        titleId: 'URAIAN FAKTA, KRONOLOGI DAN DAMPAK PELANGGARAN',
        titleEn: 'FACTS, CHRONOLOGY AND OPERATIONAL IMPACT',
        contentId: `1. Pada tanggal ${formatIndonesianDate(warn.incidentDate)}, PIHAK KEDUA terbukti secara sah dan meyakinkan telah melakukan pelanggaran disiplin sebagai berikut:\n   "${warn.violationDescription}"\n${warn.previousWarningNumber ? `2. Sebelum surat peringatan ini diterbitkan, PIHAK KEDUA sebelumnya telah menerima Surat Peringatan Nomor: ${warn.previousWarningNumber}${warn.previousWarningDate ? ` tertanggal ${formatIndonesianDate(warn.previousWarningDate)}` : ''}.\n3. ` : '2. '}Perbuatan tersebut secara nyata mengganggu kelancaran alur kerja departemen, menurunkan standar kualitas layanan, serta bertentangan dengan komitmen kedisiplinan dalam Perjanjian Kerja.`,
        contentEn: `1. On ${formatEnglishDate(warn.incidentDate)}, the SECOND PARTY was conclusively found to have committed the following infraction:\n   "${warn.violationDescription}"\n${warn.previousWarningNumber ? `2. Prior to this warning, the SECOND PARTY previously received Warning Letter No: ${warn.previousWarningNumber}.\n3. ` : '2. '}Said conduct has disrupted departmental workflows and breached contractual discipline obligations.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-3',
        articleNumber: 3,
        titleId: 'PENJATUHAN SANKSI DAN MASA BERLAKU EFEKTIF',
        titleEn: 'DISCIPLINARY SANCTION AND EFFECTIVE VALIDITY PERIOD',
        contentId: `1. Sehubungan dengan fakta pelanggaran pada Pasal 2 di atas, Manajemen PIHAK PERTAMA dengan ini menjatuhkan sanksi disiplin resmi berupa:\n   SURAT PERINGATAN KE-${level} (${type}) kepada PIHAK KEDUA.\n2. Sesuai dengan ketentuan Pasal 52 PP No. 35 Tahun 2021, Surat Peringatan ke-${level} ini berlaku efektif selama 6 (enam) bulan kalender, terhitung sejak tanggal ${formatIndonesianDate(doc.signingDate)} sampai dengan tanggal ${formatIndonesianDate(warn.validUntilDate)}.\n3. Apabila selama kurun waktu masa berlaku 6 (enam) bulan tersebut PIHAK KEDUA menunjukkan perbaikan perilaku nyata dan tidak melakukan pelanggaran disiplin apapun, maka Surat Peringatan ini gugur secara administratif pada akhir masa berlaku.`,
        contentEn: `1. In view of the established breach, the FIRST PARTY hereby formally issues:\n   WARNING LETTER LEVEL ${level} (${type}) to the SECOND PARTY.\n2. Pursuant to GR No. 35/2021, this Warning Letter remains valid for 6 (six) consecutive months from ${formatEnglishDate(doc.signingDate)} until ${formatEnglishDate(warn.validUntilDate)}.\n3. If the SECOND PARTY maintains full compliance throughout the 6-month validity period, this warning shall lapse automatically upon expiration.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      },
      {
        id: 'sp-4',
        articleNumber: 4,
        titleId: 'KEWAJIBAN TINDAKAN PERBAIKAN (CORRECTIVE PLAN) DAN KONSEKUENSI',
        titleEn: 'MANDATORY CORRECTIVE PLAN AND ESCALATION CONSEQUENCES',
        contentId: `1. Selama masa pembinaan berlangsung, PIHAK KEDUA wajib melaksanakan langkah perbaikan konkrit berikut:\n   ${warn.correctiveActions}\n2. Konsekuensi Hukum Disiplin Lanjutan:\n   ${warn.consequences}\n3. Selain sanksi administratif, penerbitan Surat Peringatan dapat dipertimbangkan dalam penilaian kinerja (KPI), kelayakan bonus/kenaikan upah tahunan, maupun promosi jabatan sesuai kebijakan Manajemen.\n4. Penandatanganan surat ini merupakan bukti telah diterimanya pemberitahuan resmi oleh PIHAK KEDUA guna dilaksanakan dengan penuh tanggung jawab.`,
        contentEn: `1. During the corrective monitoring period, the SECOND PARTY is mandated to execute:\n   ${warn.correctiveActions}\n2. Legal & Escalation Consequences:\n   ${warn.consequences}\n3. This disciplinary record may affect annual KPI ratings, bonus eligibility, and promotion reviews under Company policy.\n4. Signature below acknowledges official receipt and commitment to immediate improvement.`,
        isMandatory: true,
        isEnabled: true,
        category: 'sanksi_disiplin'
      }
    ];
  }

  // 5. PEMBERHENTIAN / PHK / SELESAI KONTRAK / RESIGN
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
        titleEn: 'OFFICIAL TERMINATION & SEPARATION DECLARATION',
        contentId: `1. PIHAK PERTAMA dan PIHAK KEDUA (${employee.fullName}, NIK: ${employee.nik}, Jabatan: ${job.positionTitle}, Departemen: ${job.department}) secara resmi mengakhiri hubungan kerja terhitung efektif sejak tanggal ${formatIndonesianDate(term.effectiveDate)}.\n2. Hari kerja aktif terakhir (Last Working Day) ditetapkan pada tanggal ${formatIndonesianDate(term.lastWorkingDay)}.\n3. Dasar dan Alasan Pengakhiran Hubungan Kerja:\n   "${term.terminationReason}"\n4. Pengakhiran hubungan kerja ini dilaksanakan sesuai tata cara peraturan perundang-undangan ketenagakerjaan berdasarkan UU No. 6 Tahun 2023 dan Peraturan Pemerintah No. 35 Tahun 2021.`,
        contentEn: `1. The FIRST PARTY and the SECOND PARTY (${employee.fullName}, NIK: ${employee.nik}, Position: ${job.positionTitle}) formally conclude their employment relationship effective ${formatEnglishDate(term.effectiveDate)}.\n2. The Last Working Day is designated as ${formatEnglishDate(term.lastWorkingDay)}.\n3. Basis for Separation:\n   "${term.terminationReason}"\n4. Separation is administered in full compliance with Law No. 6/2023 and Government Regulation No. 35/2021.`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'term-2',
        articleNumber: 2,
        titleId: 'RINCIAN PENYELESAIAN HAK FINANSIAL DAN KOMPENSASI',
        titleEn: 'FINAL FINANCIAL SETTLEMENT AND STATUTORY COMPENSATION',
        contentId: `1. Sesuai perhitungan peraturan perundang-undangan ketenagakerjaan (UU No. 13/2003 jo. PP No. 35/2021), PIHAK PERTAMA menyelesaikan seluruh hak finansial PIHAK KEDUA dengan rincian:\n   a. Uang Pesangon (UP): ${formatRupiah(term.severancePay)};\n   b. Uang Penghargaan Masa Kerja (UPMK): ${formatRupiah(term.serviceAwardPay)};\n   c. Uang Penggantian Hak (UPH — sisa cuti/fasilitas): ${formatRupiah(term.rightsCompensationPay)};\n   d. Uang Kompensasi Berakhirnya PKWT (PP 35/2021): ${formatRupiah(term.pkwtCompensationPay)};\n   TOTAL PENYELESAIAN HAK FINANSIAL: ${formatRupiah(term.totalFinancialSettlement)} (${terbilang(term.totalFinancialSettlement)}).\n2. Seluruh hak finansial di atas dibayarkan oleh PIHAK PERTAMA melalui transfer ke rekening bank terdaftar PIHAK KEDUA (${comp.bankName} No. Rek ${comp.bankAccountNumber}) pada tanggal ${formatIndonesianDate(term.paymentReleaseDate)} setelah pemotongan pajak penghasilan PPh 21 sesuai ketentuan (PP No. 68 Tahun 2009 / TER).\n3. Kepesertaan BPJS Kesehatan dan BPJS Ketenagakerjaan (termasuk hak pencairan JHT dan JKP jika memenuhi syarat) akan diproses penonaktifan sesuai tanggal efektif agar PIHAK KEDUA dapat melakukan klaim saldo secara mandiri.`,
        contentEn: `1. Pursuant to statutory Indonesian labor regulations (GR No. 35/2021), the FIRST PARTY settles all final financial entitlements to the SECOND PARTY as follows:\n   a. Severance Pay (UP): ${formatRupiah(term.severancePay)};\n   b. Service Award Pay (UPMK): ${formatRupiah(term.serviceAwardPay)};\n   c. Compensation of Rights (UPH): ${formatRupiah(term.rightsCompensationPay)};\n   d. PKWT End Compensation (GR 35/2021): ${formatRupiah(term.pkwtCompensationPay)};\n   TOTAL FINANCIAL SETTLEMENT: ${formatRupiah(term.totalFinancialSettlement)} (${terbilangEn(term.totalFinancialSettlement)}).\n2. Net settlement shall be wired to ${comp.bankName} Acc. ${comp.bankAccountNumber} on ${formatEnglishDate(term.paymentReleaseDate)}, subject to applicable PPh 21 withholding.\n3. BPJS Employment & Healthcare de-registration shall be processed promptly to facilitate the SECOND PARTY's JHT/JKP claims.`,
        isMandatory: true,
        isEnabled: true,
        category: 'upah_benefit'
      },
      {
        id: 'term-3',
        articleNumber: 3,
        titleId: 'SERAH TERIMA TUGAS, PENGEMBALIAN ASET DAN KEBERLAKUAN NDA',
        titleEn: 'DUTY HANDOVER, ASSET RETURN AND SURVIVING NDA',
        contentId: `1. PIHAK KEDUA wajib menuntaskan serah terima seluruh berkas pekerjaan, akses proyek, dan tanggung jawab operasional kepada Atasan Langsung atau pejabat pengganti yang ditunjuk.\n2. Daftar inventaris dan aset perusahaan yang wajib dikembalikan dalam kondisi lengkap dan baik:\n   ${term.assetHandoverChecklist.map((item) => `• ${item}`).join('\n   ')}\n3. Berakhirnya hubungan kerja tidak menghapuskan kewajiban PIHAK KEDUA untuk tetap menjaga kerahasiaan seluruh data dagang, source code, data pelanggan, maupun informasi internal PIHAK PERTAMA (Pasal Kerahasiaan / NDA & UU PDP No. 27/2022) setelah tanggal efektif berakhir.`,
        contentEn: `1. The SECOND PARTY shall complete formal duty and documentation handovers to the designated supervisor.\n2. Mandatory company assets and credentials to be returned intact:\n   ${term.assetHandoverChecklist.map((item) => `• ${item}`).join('\n   ')}\n3. Termination does not extinguish post-employment Confidentiality (NDA) and Personal Data Protection obligations regarding proprietary data, code, and trade secrets.`,
        isMandatory: true,
        isEnabled: true,
        category: 'pengakhiran'
      },
      {
        id: 'term-4',
        articleNumber: 4,
        titleId: 'SURAT PENGALAMAN KERJA (PAKLARING) DAN PELEPASAN TUNTUTAN',
        titleEn: 'CERTIFICATE OF EMPLOYMENT (PAKLARING) AND FULL RELEASE',
        contentId: `1. ${term.includePaklaring ? `Bersamaan dengan penyelesaian administrasi ini, PIHAK PERTAMA menerbitkan Surat Keterangan Pengalaman Kerja (Paklaring) resmi Nomor: ${term.paklaringReferenceNumber} untuk PIHAK KEDUA.` : 'Penerbitan surat keterangan kerja diatur tersendiri oleh Departemen SDM setelah proses clearance selesai.'}\n2. Pernyataan Rekomendasi Kinerja: "${term.employmentConductDescription}"\n3. Dengan diterimanya seluruh hak penyelesaian finansial sebagaimana tercantum dalam Pasal 2, Para Pihak saling membebaskan dan menyatakan tidak ada tuntutan hukum maupun klaim finansial lanjutan dalam bentuk apapun di kemudian hari terkait hubungan kerja ini (Release & Discharge).`,
        contentEn: `1. ${term.includePaklaring ? `The FIRST PARTY issues an official Certificate of Employment (Paklaring) Reference No: ${term.paklaringReferenceNumber}.` : 'Employment reference issuance follows final HR clearance.'}\n2. Conduct Statement: "${term.employmentConductDescription}"\n3. Upon receipt of full settlement under Article 2, both Parties execute mutual Release & Discharge waiving any further claims arising from this employment.`,
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

