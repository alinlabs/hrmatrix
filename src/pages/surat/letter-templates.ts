import { 
  OfficialLetterDocument, 
  LetterType, 
  LetterCategory 
} from './types';

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export function getCategoryForLetterType(type: LetterType): LetterCategory {
  switch (type) {
    case 'SK_PROMOSI':
    case 'SK_DEMOSI':
    case 'SK_MUTASI':
    case 'SK_PENGANGKATAN':
      return 'SK_KEPUTUSAN';
    case 'SP1':
    case 'SP2':
    case 'SP3':
      return 'PERINGATAN';
    case 'PAKLARING':
      return 'KETERANGAN';
    case 'PHK':
    case 'RESIGN_ACCEPTANCE':
      return 'PENGAKHIRAN';
    case 'SURAT_TUGAS':
      return 'PENUGASAN';
    default:
      return 'SK_KEPUTUSAN';
  }
}

export function createInitialLetterDraft(type: LetterType = 'SK_PROMOSI'): OfficialLetterDocument {
  const today = new Date().toISOString().split('T')[0];
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const sixMonthsLaterStr = sixMonthsLater.toISOString().split('T')[0];

  const currentYear = new Date().getFullYear();
  const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
  const randomNum = Math.floor(100 + Math.random() * 900);

  const category = getCategoryForLetterType(type);

  const titles: Record<LetterType, string> = {
    SK_PROMOSI: 'SURAT KEPUTUSAN DIREKSI TENTANG PROMOSI JABATAN & PENYESUAIAN UPAH',
    SK_DEMOSI: 'SURAT KEPUTUSAN DIREKSI TENTANG PENYESUAIAN JABATAN (DEMOSI)',
    SK_MUTASI: 'SURAT KEPUTUSAN DIREKSI TENTANG MUTASI & ROTASI INTERNAL KARYAWAN',
    SK_PENGANGKATAN: 'SURAT KEPUTUSAN DIREKSI TENTANG PENGANGKATAN KARYAWAN TETAP (PKWTT)',
    SP1: 'SURAT PERINGATAN PERTAMA (SP 1)',
    SP2: 'SURAT PERINGATAN KEDUA (SP 2)',
    SP3: 'SURAT PERINGATAN KETIGA & TERAKHIR (SP 3)',
    PAKLARING: 'SURAT KETERANGAN PENGALAMAN KERJA (PAKLARING)',
    PHK: 'SURAT KEPUTUSAN PEMUTUSAN HUBUNGAN KERJA (PHK)',
    RESIGN_ACCEPTANCE: 'SURAT KETERANGAN PENERIMAAN PENGUNDURAN DIRI (RESIGN)',
    SURAT_TUGAS: 'SURAT PERINTAH TUGAS & PERJALANAN DINAS RESMI'
  };

  const prefixes: Record<LetterType, string> = {
    SK_PROMOSI: 'SK-PROMOSI',
    SK_DEMOSI: 'SK-DEMOSI',
    SK_MUTASI: 'SK-MUTASI',
    SK_PENGANGKATAN: 'SK-TETAP',
    SP1: 'HRD-SP1',
    SP2: 'HRD-SP2',
    SP3: 'HRD-SP3',
    PAKLARING: 'SKK-EXP',
    PHK: 'SK-PHK',
    RESIGN_ACCEPTANCE: 'SK-RESIGN',
    SURAT_TUGAS: 'ST-DINAS'
  };

  const base: OfficialLetterDocument = {
    id: `letter-${Date.now()}`,
    letterNumber: `${randomNum}/${prefixes[type]}/${currentMonthRoman}/${currentYear}`,
    letterType: type,
    category,
    title: titles[type],
    issuingDate: today,
    issuingCity: 'Jakarta',
    company: {
      companyName: 'PT MATRIX CORPORA NUSANTARA',
      legalEntity: 'PT',
      address: 'Jl. Jenderal Sudirman Kav. 52-53, Kawasan SCBD Lot 9',
      city: 'Jakarta Selatan 12190',
      phone: '(021) 5299-8800',
      email: 'legal@matrixcorpora.co.id',
      representativeName: 'Ir. Hendra Gunawan, M.M.',
      representativePosition: 'Direktur Utama'
    },
    employee: {
      fullName: 'Budi Santoso, S.Kom.',
      nik: 'EMP-2024-089',
      positionTitle: 'Senior Software Engineer',
      department: 'Engineering & Technology',
      jobGrade: 'Grade 7 (Senior)',
      startDate: '2024-01-15',
      address: 'Jl. Tebet Barat Dalam Raya No. 45, Jakarta Selatan',
      phone: '0812-8899-7722',
      email: 'budi.santoso@email.com'
    },
    signatoryName: 'Ir. Hendra Gunawan, M.M.',
    signatoryTitle: 'Direktur Utama',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Specific initial payloads
  if (type === 'SK_PROMOSI') {
    base.careerChange = {
      previousPosition: 'Software Engineer',
      newPosition: 'Lead Software Engineer',
      previousDepartment: 'Engineering & Technology',
      newDepartment: 'Engineering & Technology',
      previousJobGrade: 'Grade 6',
      newJobGrade: 'Grade 8 (Lead Specialist)',
      previousSalary: 12000000,
      newSalary: 16500000,
      previousAllowance: 1500000,
      newAllowance: 2500000,
      effectiveDate: today,
      considerations: [
        'Bahwa berdasarkan hasil evaluasi kinerja tahunan (KPI) Saudara/i yang bersangkutan telah menunjukkan dedikasi, integritas, dan kompetensi teknis yang melampaui target yang ditetapkan perusahaan;',
        'Bahwa untuk memenuhi kebutuhan struktur kepemimpinan teknis dalam rangka akselerasi proyek strategis korporasi, dipandang perlu untuk melakukan promosi jabatan.'
      ],
      legalReferences: [
        'Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan jo. UU No. 6 Tahun 2023;',
        'Peraturan Perusahaan (PP) PT Matrix Corpora Nusantara Bab IV tentang Pola Karier dan Promosi Jabatan;',
        'Surat Rekomendasi Promosi dari Division Head Engineering tertanggal ' + formatIndonesianDate(today) + '.'
      ],
      observations: [
        'Hasil penilaian komite penilai kinerja (Performance Appraisal Committee) periode berjalan.'
      ],
      decisions: [
        'Mengangkat Saudara/i yang namanya tercantum dalam surat ini dari posisi semula menjadi posisi baru sebagaimana tercantum dalam rincian surat keputusan ini.',
        'Memberikan hak kompensasi berupa kenaikan upah pokok dan tunjangan jabatan yang disesuaikan dengan standar struktur dan skala upah pada grade jabatan baru.',
        'Keputusan ini berlaku efektif terhitung sejak tanggal penetapan dan apabila di kemudian hari terdapat kekeliruan akan dilakukan perbaikan sebagaimana mestinya.'
      ]
    };
  } else if (type === 'SK_DEMOSI') {
    base.careerChange = {
      previousPosition: 'Operational Supervisor',
      newPosition: 'Operational Staff Specialist',
      previousDepartment: 'Operations & Logistics',
      newDepartment: 'Operations & Logistics',
      previousJobGrade: 'Grade 6',
      newJobGrade: 'Grade 5',
      previousSalary: 9500000,
      newSalary: 8000000,
      previousAllowance: 1200000,
      newAllowance: 600000,
      effectiveDate: today,
      considerations: [
        'Bahwa berdasarkan hasil audit operasional dan evaluasi berkala penilaian kinerja (Performance Improvement Plan) Saudara/i belum memenuhi standar kompetensi manajerial yang disyaratkan pada jabatan pengawas;',
        'Bahwa langkah penyesuaian posisi ini diambil demi menjaga efektivitas operasional divisi dan memberikan kesempatan pembinaan kompetensi kerja yang lebih sesuai.'
      ],
      legalReferences: [
        'Peraturan Perusahaan (PP) Bab VI tentang Evaluasi Kinerja dan Sanksi Penurunan Golongan/Jabatan;',
        'Laporan Hasil Evaluasi PIP Triwulan terakhir.'
      ],
      observations: [
        'Berita Acara Pembinaan dan Konseling Internal Departemen SDM.'
      ],
      decisions: [
        'Menetapkan penyesuaian posisi (demosi) kepada karyawan yang bersangkutan ke jabatan baru.',
        'Menyesuaikan komponen upah dan tunjangan jabatan sesuai dengan standar grade jabatan yang baru.'
      ]
    };
  } else if (type === 'SK_MUTASI') {
    base.careerChange = {
      previousPosition: 'HR Generalist Specialist',
      newPosition: 'HR & GA Branch Coordinator',
      previousDepartment: 'Human Resources (Head Office)',
      newDepartment: 'HR & Operations (Branch Surabaya)',
      locationOrigin: 'Kantor Pusat - Jakarta',
      locationDestination: 'Kantor Cabang - Surabaya',
      effectiveDate: today,
      considerations: [
        'Bahwa guna mendukung ekspansi operasional cabang dan pemerataan kapabilitas tata kelola SDM di unit kerja daerah, dipandang perlu melakukan rotasi penugasan.',
        'Bahwa Saudara/i yang bersangkutan dinilai memiliki kecakapan yang memadai untuk mengemban tugas koordinasi di kantor cabang.'
      ],
      legalReferences: [
        'Peraturan Perusahaan (PP) Bab III tentang Hak Manajemen dalam Penempatan dan Rotasi Kerja;',
        'Surat Kebutuhan Formasi Cabang Surabaya No. 044/BR-SBY/2026.'
      ],
      observations: [
        'Kesiapan operasional dan proses serah terima jabatan (handover).'
      ],
      decisions: [
        'Memindahkan (mutasi) wilayah kerja karyawan dari kantor asal ke kantor tujuan.',
        'Memberikan fasilitas relokasi dan penyesuaian tunjangan penempatan sesuai ketentuan kebijakan operasional perusahaan.'
      ]
    };
  } else if (type === 'SK_PENGANGKATAN') {
    base.careerChange = {
      previousPosition: 'Probationary Product Designer',
      newPosition: 'Product Designer (Karyawan Tetap)',
      previousDepartment: 'Product & Design',
      newDepartment: 'Product & Design',
      previousJobGrade: 'Grade 5 (Probation)',
      newJobGrade: 'Grade 6 (Permanent)',
      effectiveDate: today,
      probationDurationMonths: 3,
      considerations: [
        'Bahwa Saudara/i telah menjalani masa percobaan kerja (probation period) selama 3 (tiga) bulan dengan capaian kerja dan kedisiplinan yang memenuhi standar kelulusan evaluasi;',
        'Bahwa perusahaan bermaksud mengukuhkan status hubungan kerja menjadi Karyawan Tetap (PKWTT).'
      ],
      legalReferences: [
        'Pasal 63 UU No. 13 Tahun 2003 tentang Ketenagakerjaan jo. UU No. 6 Tahun 2023;',
        'Perjanjian Kerja Awal Masa Percobaan tertanggal 3 bulan lalu.'
      ],
      observations: [
        'Lembar Form Evaluasi Masa Percobaan yang disetujui Atasan Langsung dan HR Manager.'
      ],
      decisions: [
        'Mengangkat secara resmi Saudara/i sebagai Karyawan Tetap (PKWTT) terhitung sejak tanggal penetapan.',
        'Memberikan seluruh hak dan fasilitas kepegawaian permanen sesuai regulasi Peraturan Perusahaan.'
      ]
    };
  } else if (type === 'SP1' || type === 'SP2' || type === 'SP3') {
    const levelNum = type === 'SP1' ? 1 : type === 'SP2' ? 2 : 3;
    base.warning = {
      warningLevel: levelNum,
      incidentDate: today,
      violationCategory: 'Pelanggaran Kedisiplinan & Keterlambatan Kerja',
      violationDescription: 'Berdasarkan rekapitulasi data presensi dan laporan pengawas, Saudara/i tercatat melakukan keterlambatan hadir lebih dari 5 (lima) kali berturut-turut tanpa keterangan tertulis yang sah dalam periode bulan berjalan, serta meninggalkan area kerja sebelum jam kerja operasional berakhir tanpa izin tertulis dari atasan langsung.',
      violationClauseReference: 'Peraturan Perusahaan (PP) Bab VII Pasal 18 ayat (3) butir b perihal Kewajiban Kehadiran dan Ketertiban Jam Kerja.',
      validUntilDate: sixMonthsLaterStr,
      correctiveActions: 'Wajib hadir tepat waktu sesuai jadwal roster kerja, melaporkan izin resmi kepada atasan, dan meningkatkan disiplin kerja secara konsisten selama 6 bulan ke depan.',
      consequences: 'Apabila dalam masa berlaku surat peringatan ini (6 bulan) Saudara/i mengulangi pelanggaran serupa atau melakukan pelanggaran disiplin lainnya, maka perusahaan akan menerbitkan sanksi Surat Peringatan tingkat berikutnya atau Pemutusan Hubungan Kerja (PHK).'
    };
  } else if (type === 'PAKLARING') {
    base.certificate = {
      certificateNumber: `${randomNum}/HRD-PAKLARING/${currentMonthRoman}/${currentYear}`,
      employmentStartDate: '2022-03-01',
      employmentEndDate: today,
      lastPosition: 'Senior Digital Marketing Specialist',
      lastDepartment: 'Growth Marketing',
      conductRating: 'Sangat Baik',
      reasonForLeaving: 'Pengunduran Diri Sukarela',
      recommendationNote: 'Selama bekerja di perusahaan kami, Saudara/i telah menunjukkan dedikasi, kepemimpinan, inisiatif, dan loyalitas yang sangat baik. Kami mengucapkan terima kasih atas segala kontribusi yang telah diberikan dan mendoakan kesuksesan dalam karier di masa mendatang.'
    };
  } else if (type === 'PHK') {
    base.termination = {
      terminationReason: 'Efisiensi Operasional & Restrukturisasi Unit Bisnis (Sesuai PP 35/2021 Pasal 43 ayat 1)',
      effectiveDate: today,
      lastWorkingDay: today,
      severancePay: 24000000,
      serviceAwardPay: 8000000,
      rightsCompensationPay: 2500000,
      pkwtCompensationPay: 0,
      totalSettlement: 34500000,
      paymentDate: today,
      returnedAssets: [
        'Laptop Macbook Pro & Charger',
        'ID Card Karyawan & Kartu Akses Gedung',
        'Email Perusahaan & Akun Akses Server',
        'Dokumen Berkas Kerja & Inventaris Kantor'
      ]
    };
  } else if (type === 'RESIGN_ACCEPTANCE') {
    base.certificate = {
      certificateNumber: `${randomNum}/HRD-RESIGN/${currentMonthRoman}/${currentYear}`,
      employmentStartDate: '2023-01-10',
      employmentEndDate: today,
      lastPosition: 'Account Executive Specialist',
      lastDepartment: 'Business Development & Sales',
      conductRating: 'Baik',
      reasonForLeaving: 'Pengunduran Diri Sukarela',
      recommendationNote: 'Perusahaan secara resmi menerima surat permohonan pengunduran diri yang diajukan oleh Saudara/i dengan masa pemberitahuan (one month notice) yang telah dipenuhi dengan baik.'
    };
  } else if (type === 'SURAT_TUGAS') {
    base.assignment = {
      destinationCity: 'Surabaya & Bali',
      destinationCompanyOrPlace: 'PT Graha Nusantara & Area Project Site',
      purposeOfDuty: 'Audit Implementasi Sistem Kepegawaian dan Pelatihan Standar Operasional Prosedur (SOP) Lapangan',
      departureDate: today,
      returnDate: sixMonthsLaterStr,
      transportationType: 'Pesawat',
      accommodation: 'Hotel Bintang 4 Sesuai Plafon Dinas',
      dailyAllowance: 450000,
      specialInstructions: 'Wajib menyerahkan laporan hasil kunjungan dinas dan bukti pengeluaran akomodasi (reimbursement) maksimal 3 hari kerja setelah kembali ke kantor pusat.'
    };
  }

  return base;
}
