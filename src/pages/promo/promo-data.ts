import { 
  CompanySizeTier, 
  ModuleItem, 
  PricingMatrix, 
  TierCardTexts, 
  PromoTabItem, 
  PromoModalTextConfig, 
  ComparisonRow, 
  TrainingCardItem, 
  FaqItem 
} from './types';

/**
 * 1. TAB PENAGIHAN & MODE PROMO
 */
export const PROMO_BILLING_TABS: PromoTabItem[] = [
  { id: 'trial', label: 'Uji Coba (3 Bulan)', shortLabel: 'Uji Coba', iconName: 'Clock' },
  { id: 'annual', label: 'Sewa Cloud Tahunan', shortLabel: 'Sewa Cloud', iconName: 'Tag' },
  { id: 'whitelabel', label: 'White Label (Source Code)', shortLabel: 'White Label', iconName: 'Shield' },
  { id: 'agent', label: 'Dedicated Agent (Hybrid)', shortLabel: 'Agent Hybrid', iconName: 'UserCheck' },
];

/**
 * 2. MODUL INTI HRMATRIX BERDASARKAN TIER (14 MODUL RESMI)
 */
export const PROMO_MODULE_NAMES_ALL: string[] = [
  'Data Karyawan',
  'Legal & Administrasi',
  'Presensi & Jadwal',
  'Manajemen Cuti',
  'Kinerja & KPI',
  'Payroll',
  'Rekrutmen & Asesmen',
  'Background Check',
  'Inventaris & Aset',
  'Pengadaan & ATK',
  'Fasilitas & Servis',
  'Vendor & Perizinan',
  'Buku Tamu & Surat',
  'Pelaporan HR & GA'
];

export const PROMO_MODULE_NAMES: string[] = PROMO_MODULE_NAMES_ALL;

// Tier Startup & UMKM (6 Modul Inti HR, Legal & Operasional Esensial)
export const STARTUP_MODULE_NAMES: string[] = [
  'Data Karyawan',
  'Legal & Administrasi',
  'Presensi & Jadwal',
  'Manajemen Cuti',
  'Payroll',
  'Pelaporan HR & GA'
];

// Tier Growth & Menengah (10 Modul Inti: Operasional + ATS & Target KPI + GA Inventaris & Pengadaan)
export const GROWTH_MODULE_NAMES: string[] = [
  'Data Karyawan',
  'Legal & Administrasi',
  'Presensi & Jadwal',
  'Manajemen Cuti',
  'Payroll',
  'Pelaporan HR & GA',
  'Kinerja & KPI',
  'Rekrutmen & Asesmen',
  'Inventaris & Aset',
  'Pengadaan & ATK'
];

// Tier Enterprise (14 Modul Lengkap All-in-One: Termasuk Background Check, Fasilitas, Vendor & Buku Tamu)
export const ENTERPRISE_MODULE_NAMES: string[] = PROMO_MODULE_NAMES_ALL;

/**
 * 3. E-PORTAL INTEGRASI RESMI PEMERINTAH BERDASARKAN TIER
 */
export const PROMO_EPORTAL_NAMES_ALL: string[] = [
  'BPJS Ketenagakerjaan (SIPP Online & EPS)',
  'BPJS Kesehatan (e-Dabu Badan Usaha)',
  'DJP Online / CoreTax (Pajak PPh 21 TER)',
  'Kemenaker RI (WLKP Online)',
  'Bapenda Pajak Daerah (Pajak & Retribusi)',
  'SIAPkerja / Karirhub Kemnaker RI',
  'Portal e-PP & e-PKB Kemnaker RI',
  'Teman K3 Kemnaker (P2K3 & Insiden)',
  'PPHI / SIMASNAKER Kemnaker (Hub Industrial)',
  'TKA Online Kemnaker (Tenaga Kerja Asing)',
  'OSS RBA BKPM (Perizinan Berusaha & LKPM)',
  'SIMPEL KLHK (Lingkungan Hidup & Fasilitas)',
  'FESTRONIK KLHK (Manifest Elektronik Limbah B3)',
  'SIMBG PUPR (PBG & Sertifikat Laik Fungsi)'
];

export const PROMO_EPORTAL_NAMES: string[] = PROMO_EPORTAL_NAMES_ALL;

// Tier Startup & UMKM (5 E-Portal Wajib Lapor Ketenagakerjaan & Pajak UMKM)
export const STARTUP_EPORTAL_NAMES: string[] = [
  'BPJS Ketenagakerjaan (SIPP Online & EPS)',
  'BPJS Kesehatan (e-Dabu Badan Usaha)',
  'DJP Online / CoreTax (Pajak PPh 21 TER)',
  'Kemenaker RI (WLKP Online)',
  'Bapenda Pajak Daerah (Pajak & Retribusi)'
];

// Tier Growth & Menengah (10 E-Portal Ketenagakerjaan, K3, Hub Industrial & Rekrutmen Resmi)
export const GROWTH_EPORTAL_NAMES: string[] = [
  'BPJS Ketenagakerjaan (SIPP Online & EPS)',
  'BPJS Kesehatan (e-Dabu Badan Usaha)',
  'DJP Online / CoreTax (Pajak PPh 21 TER)',
  'Kemenaker RI (WLKP Online)',
  'Bapenda Pajak Daerah (Pajak & Retribusi)',
  'SIAPkerja / Karirhub Kemnaker RI',
  'Portal e-PP & e-PKB Kemnaker RI',
  'Teman K3 Kemnaker (P2K3 & Insiden)',
  'PPHI / SIMASNAKER Kemnaker (Hub Industrial)',
  'TKA Online Kemnaker (Tenaga Kerja Asing)'
];

// Tier Enterprise (14 E-Portal Lengkap: Termasuk Perizinan Berusaha, Bangunan & Lingkungan Hidup)
export const ENTERPRISE_EPORTAL_NAMES: string[] = PROMO_EPORTAL_NAMES_ALL;

/**
 * 4. DETAIL SPESIFIKASI MODUL (KATALOG LENGKAP 14 MODUL RESMI)
 */
export const ALL_MODULES: ModuleItem[] = [
  {
    id: 'data_karyawan',
    name: 'Data Karyawan',
    category: 'HR Master & Data',
    normalPricePerMonth: 110000,
    promoPricePerMonth: 55000,
    whitelabelNormalPrice: 7500000,
    whitelabelPromoPrice: 3900000,
    description: 'Pusat pangkalan data induk karyawan, rekam profil terpadu, riwayat karir, serta pustaka template jobdesk standar industri siap pakai.',
    features: ['Database Karyawan', 'Template Jobdesk']
  },
  {
    id: 'legal_administrasi',
    name: 'Legal & Administrasi',
    category: 'Legal & Compliance',
    normalPricePerMonth: 120000,
    promoPricePerMonth: 60000,
    whitelabelNormalPrice: 8500000,
    whitelabelPromoPrice: 4400000,
    description: 'Kepatuhan regulasi ketenagakerjaan, standar ISO, Peraturan Perusahaan (PP), tata kelola surat menyurat resmi, kontrak kerja PKWT/PKWTT, dan SK dinas.',
    features: ['Regulasi Hukum', 'ISO', 'PP', 'Administrasi Surat', 'Kontrak', 'SK']
  },
  {
    id: 'presensi_jadwal',
    name: 'Presensi & Jadwal',
    category: 'Time & Attendance',
    normalPricePerMonth: 180000,
    promoPricePerMonth: 90000,
    whitelabelNormalPrice: 9500000,
    whitelabelPromoPrice: 4900000,
    description: 'Pencatatan absensi mandiri real-time, rekap kehadiran otomatis, kalender jadwal kerja, kalkulator lembur PP 35/2021, serta approval tukar shift fleksibel.',
    features: ['Presensi', 'Rekap Presensi', 'Kalender Jadwal', 'Lembur', 'Tukar Shift']
  },
  {
    id: 'manajemen_cuti',
    name: 'Manajemen Cuti',
    category: 'Leave Management',
    normalPricePerMonth: 110000,
    promoPricePerMonth: 55000,
    whitelabelNormalPrice: 7000000,
    whitelabelPromoPrice: 3600000,
    description: 'Otomasi saldo cuti tahunan, pengajuan cuti berjenjang, penegakan regulasi cuti resmi pemerintah, serta perhitungan klaim atau konversi saldo cuti.',
    features: ['Saldo', 'Pengajuan', 'Regulasi', 'Perhitungan Klaim atau Konversi Cuti']
  },
  {
    id: 'kinerja_kpi',
    name: 'Kinerja & KPI',
    category: 'Performance',
    normalPricePerMonth: 150000,
    promoPricePerMonth: 75000,
    whitelabelNormalPrice: 9000000,
    whitelabelPromoPrice: 4700000,
    description: 'Penyusunan target kerja KPI karyawan, katalog indikator kinerja standar industri, evaluasi kinerja periodik, dan scoring penilaian objektif.',
    features: ['Manajemen KPI', 'Evaluasi Kinerja']
  },
  {
    id: 'payroll',
    name: 'Payroll',
    category: 'Finance & Compensation',
    normalPricePerMonth: 210000,
    promoPricePerMonth: 105000,
    whitelabelNormalPrice: 11500000,
    whitelabelPromoPrice: 5900000,
    description: 'Sistem penggajian otomatis, tunjangan tetap & dinamis, kalkulator potongan kehadiran/kasbon, integrasi iuran BPJS TK & Kesehatan, serta pajak PPh 21 skema TER.',
    features: ['Sistem Payroll', 'Tunjangan', 'Potongan', 'BPJS', 'Pajak PPh 21']
  },
  {
    id: 'rekrutmen_asesmen',
    name: 'Rekrutmen & Asesmen',
    category: 'Talent Acquisition',
    normalPricePerMonth: 180000,
    promoPricePerMonth: 90000,
    whitelabelNormalPrice: 10500000,
    whitelabelPromoPrice: 5400000,
    description: 'Penyaringan CV cerdas berbasis ATS, psikotes/DISC, tes logika, etika kerja, bahasa, asesmen kepemimpinan, scorecard wawancara & pemetaan kesesuaian multi-dimensi.',
    features: [
      'Screening CV (ATS)',
      'Psikotes/DISC',
      'Logika',
      'Etika',
      'Bahasa',
      'Leadership',
      'Interview',
      'Job Fit',
      'Value Fit',
      'Culture Fit',
      'Leader Fit',
      'Team Fit'
    ]
  },
  {
    id: 'background_check',
    name: 'Background Check',
    category: 'Security & Verification',
    normalPricePerMonth: 140000,
    promoPricePerMonth: 70000,
    whitelabelNormalPrice: 9500000,
    whitelabelPromoPrice: 4900000,
    description: 'Verifikasi keaslian ijazah resmi pendidikan tinggi/sekolah, pemeriksaan rekam jejak riwayat kandidat, verifikasi kriminalitas, serta cek riwayat kredit perbankan SLIK OJK.',
    features: ['Verifikasi Ijazah', 'Pemeriksaan Riwayat Kandidat', 'Pemeriksaan Kriminalitas', 'SLIK']
  },
  {
    id: 'inventaris_aset',
    name: 'Inventaris & Aset',
    category: 'General Affairs',
    normalPricePerMonth: 110000,
    promoPricePerMonth: 55000,
    whitelabelNormalPrice: 7500000,
    whitelabelPromoPrice: 3900000,
    description: 'Pendataan inventaris kantor terintegrasi, pelabelan QR code/barcode aset, pelacakan penanggung jawab, serta manajemen siklus hidup aset perusahaan.',
    features: ['Pendataan Inventaris', 'Manajemen Aset']
  },
  {
    id: 'pengadaan_atk',
    name: 'Pengadaan & ATK',
    category: 'General Affairs',
    normalPricePerMonth: 100000,
    promoPricePerMonth: 50000,
    whitelabelNormalPrice: 7000000,
    whitelabelPromoPrice: 3600000,
    description: 'Katalog stok alat tulis kantor (ATK), pemantauan persediaan pantry & konsumsi kerja, serta alur form pengajuan purchase requisition dengan approval berjenjang.',
    features: ['Katalog Stok', 'Pantry', 'Pengajuan Pengadaan']
  },
  {
    id: 'fasilitas_servis',
    name: 'Fasilitas & Servis',
    category: 'Facility Management',
    normalPricePerMonth: 100000,
    promoPricePerMonth: 50000,
    whitelabelNormalPrice: 7000000,
    whitelabelPromoPrice: 3600000,
    description: 'Reservasi jadwal pemakaian ruang meeting, penjadwalan pemeliharaan & servis berkala (AC, mesin, kendaraan), serta helpdesk penanganan keluhan kerusakan fasilitas.',
    features: ['Jadwal Ruangan', 'Jadwal Servis', 'Keluhan Kerusakan']
  },
  {
    id: 'vendor_perizinan',
    name: 'Vendor & Perizinan',
    category: 'Corporate Legal & GA',
    normalPricePerMonth: 110000,
    promoPricePerMonth: 55000,
    whitelabelNormalPrice: 8000000,
    whitelabelPromoPrice: 4100000,
    description: 'Pangkalan data rekanan vendor eksternal, pemantauan masa berlaku Sertifikat Laik Fungsi (SLF) gedung perkantoran, dan tata kelola perizinan berusaha.',
    features: ['Daftar Vendor', 'Legalitas SLF', 'Perizinan']
  },
  {
    id: 'buku_tamu_surat',
    name: 'Buku Tamu & Surat',
    category: 'Office Administration',
    normalPricePerMonth: 90000,
    promoPricePerMonth: 45000,
    whitelabelNormalPrice: 6500000,
    whitelabelPromoPrice: 3400000,
    description: 'Buku tamu digital resepsionis pencatat kunjungan tamu, serta log terpadu surat masuk, surat keluar dan pencatatan tanda terima ekspedisi kurir.',
    features: ['Daftar Tamu', 'Log Surat']
  },
  {
    id: 'pelaporan_hr_ga',
    name: 'Pelaporan HR & GA',
    category: 'Reporting & Compliance',
    normalPricePerMonth: 130000,
    promoPricePerMonth: 65000,
    whitelabelNormalPrice: 8500000,
    whitelabelPromoPrice: 4400000,
    description: 'Penyusunan laporan operasional manual fleksibel, generate instan dokumen laporan format PDF eksekutif, serta sinkronisasi pelaporan online ke sistem pemerintahan.',
    features: ['Laporan Manual', 'Generate Laporan PDF', 'Pelaporan Online ke Sistem Pemerintahan']
  }
];

/**
 * 5. DATA HARGA & DETAIL MATRIKS PROMOSI (STARTUP, GROWTH, ENTERPRISE)
 */
export const PRICING_DATA: PricingMatrix = {
  startup: {
    name: 'Startup & UMKM',
    badge: 'Skala Kecil',
    karyawan: 'Maks. 50 Karyawan',
    maxUser: 50,
    costAnalysis: {
      perEmployeeMonth: 'Rp 10.980',
      perEmployeeDay: 'Rp 366',
      marketBenchmark: 'Rp 25.000 - Rp 35.000 / user di pasaran'
    },
    serverSpecs: {
      cpu: '2 vCPU Dedicated Cloud Compute',
      ram: '4 GB High-Speed RAM',
      storage: '20 GB Cloud SSD Document Storage',
      bandwidth: 'Unlimited Bandwidth',
      backup: 'Daily Automated Cloud Backup',
      sla: '99.5% Uptime SLA Guarantee'
    },
    trial: {
      contractMonths: 3,
      isOneTimeOnly: true,
      normalPricePerMonth: 1250000,
      promoPricePerMonth: 749000,
      totalBilled: 2247000,
      discountPercent: '40%',
      savingsAmount: 1503000,
      discountLabel: 'HEMAT 40% (Rp 1.503.000)',
      costAnalysis: {
        perEmployeeMonth: 'Rp 14.980',
        perEmployeeDay: 'Rp 499'
      },
      note: 'Hanya bisa kontrak 1 kali untuk masa percobaan (durasi 3 bulan). Tarif per bulan sedikit lebih tinggi agar mendorong komitmen minimal tahunan.'
    },
    annual: {
      normalPricePerMonth: 1250000,
      promoPricePerMonth: 549000,
      normalAnnualBilled: 15000000,
      promoAnnualBilled: 6588000,
      discountPercent: '56%',
      savingsAmount: 8412000,
      discountLabel: 'HEMAT 56% (Rp 8.412.000)'
    },
    whitelabel: {
      normalPrice: 45000000,
      promoPrice: 24500000,
      discountPercent: '46%',
      savingsAmount: 20500000,
      description: 'Beli Putus / Source Code Standar. Deploy di server VPS / On-Premise milik Anda sendiri.',
      maintenanceFreeMonths: 6
    },
    agent: {
      normalPricePerMonth: 3600000,
      promoPricePerMonth: 1850000,
      discountPercent: '49%',
      savingsAmount: 1750000,
      discountLabel: 'HEMAT 49% (Rp 1.750.000/bln)',
      visitFrequency: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan)',
      scope: 'Hybrid: Daily Online Penuh + 1x Kunjungan Offline / Minggu',
      inhouseBenchmarkMonthly: 6500000,
      inhouseSavingsMonthly: 4650000,
      benefits: [
        '1 Dedicated Agent HR & GA resmi dari HRMatrix',
        'Daily Online: Kelola presensi, cuti, lembur & slip gaji',
        'Offline: Kunjungan on-site 1 minggu 1 kali ke kantor',
        'Administrasi kontrak kerja PKWT/PKWTT & surat resmi HR',
        'Inventaris ATK kantor & koordinasi fasilitas GA dasar',
        'Perusahaan tidak perlu merekrut staf HR/GA internal sendiri',
        'Bebas biaya pesangon, THR staf HR, & risiko turnover'
      ],
      note: 'Sudah mencakup lisensi cloud HRMatrix + 1 Dedicated Agent Hybrid.'
    },
    highlights: [
      'Kapasitas s/d 50 karyawan aktif',
      '6 Modul Inti HR, Legal & Operasional Esensial',
      'Akses 5 E-Portal Pelaporan Wajib Pemerintah',
      '3 Fitur Exclusive (Presensi QR GPS, TER, Slip PDF)',
      'Modul Panduan & E-Book Lengkap SOP HR',
      'Support Teknis via Chat & WhatsApp'
    ],
    classifiedDetails: {
      kapasitas: {
        label: 'Maks. 50 Karyawan',
        description: 'Dihitung otomatis untuk kapasitas s/d 50 karyawan aktif kantor rintisan / UMKM.',
        maxCount: 50
      },
      modulDanEPortal: {
        modulesCount: 6,
        moduleNames: STARTUP_MODULE_NAMES,
        eportalsCount: 5,
        eportalNames: STARTUP_EPORTAL_NAMES,
        tagline: '6 Modul Inti Esensial + Akses 5 E-Portal Wajib Lapor Ketenagakerjaan & Pajak'
      },
      fiturExclusive: [
        'Presensi Mandiri QR Code & Deteksi Lokasi GPS',
        'Hitung Otomatis Slip Gaji & PPh 21 TER 2025 (PP 58/2023)',
        'Export Slip Gaji PDF & Rekap Presensi Excel'
      ],
      layananDanBantuan: [
        'E-Book Lengkap Modul Panduan & Standar SOP HR Siap Pakai',
        'Bantuan Teknis Fast-Response via Chat & WhatsApp'
      ]
    }
  },
  growth: {
    name: 'Growth & Menengah',
    badge: 'Paling Populer',
    isPopular: true,
    karyawan: 'Maks. 250 Karyawan',
    maxUser: 250,
    costAnalysis: {
      perEmployeeMonth: 'Rp 5.400 / user (basis 250)',
      perEmployeeDay: 'Rp 180',
      marketBenchmark: 'Rp 30.000 - Rp 45.000 / user di pasaran'
    },
    serverSpecs: {
      cpu: '4 vCPU High-Performance Cluster',
      ram: '8 GB High-Speed RAM Dedicated',
      storage: '80 GB NVMe Cloud Document Storage',
      bandwidth: 'Unlimited High-Speed Bandwidth & CDN',
      backup: 'Realtime Automated Cloud Backup',
      sla: '99.9% High Uptime SLA Guarantee'
    },
    trial: {
      contractMonths: 3,
      isOneTimeOnly: true,
      normalPricePerMonth: 3400000,
      promoPricePerMonth: 1690000,
      totalBilled: 5070000,
      discountPercent: '50%',
      savingsAmount: 5130000,
      discountLabel: 'HEMAT 50% (Rp 5.130.000)',
      costAnalysis: {
        perEmployeeMonth: 'Rp 6.760 / user (basis 250)',
        perEmployeeDay: 'Rp 225'
      },
      note: 'Hanya bisa kontrak 1 kali untuk masa percobaan (durasi 3 bulan). Tarif per bulan sedikit lebih tinggi agar mendorong komitmen minimal tahunan.'
    },
    annual: {
      normalPricePerMonth: 3400000,
      promoPricePerMonth: 1350000,
      normalAnnualBilled: 40800000,
      promoAnnualBilled: 16200000,
      discountPercent: '60%',
      savingsAmount: 24600000,
      discountLabel: 'HEMAT 60% (Rp 24.600.000)'
    },
    whitelabel: {
      normalPrice: 90000000,
      promoPrice: 46500000,
      discountPercent: '48%',
      savingsAmount: 43500000,
      description: 'Source Code Lengkap + Panduan Instalasi & Bantuan Konfigurasi Domain Sendiri.',
      maintenanceFreeMonths: 12
    },
    agent: {
      normalPricePerMonth: 7200000,
      promoPricePerMonth: 3650000,
      discountPercent: '49%',
      savingsAmount: 3550000,
      discountLabel: 'HEMAT 49% (Rp 3.550.000/bln)',
      visitFrequency: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan)',
      scope: 'Hybrid: Senior Agent Dedicated + Standby Fast Response',
      inhouseBenchmarkMonthly: 11000000,
      inhouseSavingsMonthly: 7350000,
      benefits: [
        'Senior Dedicated Agent HR & GA resmi dari HRMatrix',
        'Daily Online: Proses Payroll PPh 21 TER, BPJS, & Rekrutmen ATS',
        'Offline: Kunjungan terjadwal 1 minggu 1 kali ke kantor/cabang',
        'Penyusunan & evaluasi target KPI karyawan multi-divisi',
        'Audit berkas fisik, SP, verifikasi kontrak kerja, & arsip GA',
        'Supervisi inventaris aset kantor & purchase request ATK',
        'Hemat ~Rp 7,3 Juta/bulan dibanding gaji 1 HR Spv + 1 GA Staff',
        'Full digitalisasi langsung dieksekusi tanpa training lag'
      ],
      note: 'Pilihan paling ideal untuk perusahaan berkembang tanpa repot kelola HR.'
    },
    highlights: [
      'Kapasitas s/d 250 karyawan aktif',
      '10 Modul Inti (+ ATS Rekrutmen, KPI & GA Inventaris)',
      'Akses 10 E-Portal Pelaporan Pemerintah',
      '5 Fitur Exclusive (+ Multi-Cabang & Screening ATS)',
      'Pelatihan Online Terjadwal Tim HR & Finance (Live Zoom)',
      'Asistensi Penuh Migrasi & Setup Data Karyawan',
      'Support Prioritas via WhatsApp Khusus'
    ],
    classifiedDetails: {
      kapasitas: {
        label: 'Maks. 250 Karyawan',
        description: 'Dihitung otomatis untuk kapasitas s/d 250 karyawan aktif multi-divisi & cabang.',
        maxCount: 250
      },
      modulDanEPortal: {
        modulesCount: 10,
        moduleNames: GROWTH_MODULE_NAMES,
        eportalsCount: 10,
        eportalNames: GROWTH_EPORTAL_NAMES,
        tagline: '10 Modul Inti Komprehensif + Akses 10 E-Portal Pelaporan Resmi'
      },
      fiturExclusive: [
        'Multi-Cabang, Multi-Departemen & Alur Approval Bertingkat',
        'ATS AI Parser CV Otomatis & Peringkat Skor Kandidat',
        'Manajemen Target & Evaluasi 100+ Katalog KPI Terstruktur',
        'Kalkulator Lembur Otomatis Standar PP 35/2021',
        'Generator Template Kontrak PKWT/PKWTT Sesuai UU Ciptaker'
      ],
      layananDanBantuan: [
        'Pelatihan Online Terjadwal untuk Tim HR, GA & Finance (Live Zoom)',
        'Asistensi Penuh Migrasi & Setup Data Karyawan Awal',
        'Support Teknis Prioritas via Jalur WhatsApp Khusus'
      ]
    }
  },
  enterprise: {
    name: 'Enterprise & Korporasi',
    badge: 'Bisnis Besar',
    karyawan: 'Maks. 500 Karyawan',
    maxUser: 500,
    costAnalysis: {
      perEmployeeMonth: 'Rp 5.300 / user (basis 500 user)',
      perEmployeeDay: 'Rp 176 / user',
      marketBenchmark: 'Rp 50.000+ / user di pasaran',
      addonPrice: '+Rp 4.000 / karyawan / bulan jika melebihi 500 orang'
    },
    serverSpecs: {
      cpu: '8+ vCPU Dedicated Enterprise Cluster',
      ram: '16+ GB RAM Dedicated High-Throughput',
      storage: '300+ GB Scalable Cloud Storage',
      bandwidth: 'Enterprise Grade Bandwidth & Custom Firewall',
      backup: 'Hourly Multi-Region Replication Backup',
      sla: '99.99% Enterprise Uptime SLA Guarantee'
    },
    trial: {
      contractMonths: 3,
      isOneTimeOnly: true,
      normalPricePerMonth: 6800000,
      promoPricePerMonth: 3250000,
      totalBilled: 9750000,
      discountPercent: '52%',
      savingsAmount: 10650000,
      discountLabel: 'HEMAT 52% (Rp 10.650.000)',
      costAnalysis: {
        perEmployeeMonth: 'Rp 6.500 / user (basis 500)',
        perEmployeeDay: 'Rp 216'
      },
      note: 'Hanya bisa kontrak 1 kali untuk masa percobaan (durasi 3 bulan). Kapasitas dasar maks. 500 karyawan (kelebihan dihitung beban tambahan per orang).'
    },
    annual: {
      normalPricePerMonth: 6800000,
      promoPricePerMonth: 2650000,
      normalAnnualBilled: 81600000,
      promoAnnualBilled: 31800000,
      discountPercent: '61%',
      savingsAmount: 49800000,
      discountLabel: 'HEMAT 61% (Rp 49.800.000)'
    },
    whitelabel: {
      normalPrice: 165000000,
      promoPrice: 85000000,
      discountPercent: '48%',
      savingsAmount: 80000000,
      description: 'Full Whitelist & Kepemilikan 100%. Bebas modifikasi, custom branding, & konsultasi arsitektur.',
      maintenanceFreeMonths: 24
    },
    agent: {
      normalPricePerMonth: 13500000,
      promoPricePerMonth: 6750000,
      discountPercent: '50%',
      savingsAmount: 6750000,
      discountLabel: 'HEMAT 50% (Rp 6.750.000/bln)',
      visitFrequency: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan) + On-Demand',
      scope: 'Hybrid: Dedicated HR & GA Officer Lead + Tim Pendamping Backup',
      inhouseBenchmarkMonthly: 18000000,
      inhouseSavingsMonthly: 11250000,
      benefits: [
        'Dedicated Senior HR & GA Lead Officer + Backup Specialist',
        'Daily Online: Full End-to-End People & GA Management di Cloud',
        'Offline: Kunjungan mingguan 1x/minggu ke HQ / operasional pabrik',
        'Mitigasi regulasi ketenagakerjaan, UU Ciptaker, & kepatuhan Disnaker',
        'Audit payroll PPh 21 TER, formulir 1721-A1, BPJS TK & KS',
        'Tata kelola logistik GA, vendor SLA, kontrak sewa & aset',
        'Hemat hingga >Rp 11 Juta/bulan dibanding divisi HR in-house',
        'Kapasitas dasar s/d 500 karyawan (+fleksibel jika >500)'
      ],
      note: 'Tata kelola HR & GA kelas korporasi secara profesional dan terukur.'
    },
    highlights: [
      'Kapasitas dasar s/d 500 karyawan aktif (+add-on fleksibel)',
      'Semua 14 Modul HRMatrix Lengkap (+ Background Check, SLIK & Fasilitas)',
      'Akses 14 E-Portal Pelaporan Pemerintah Lengkap',
      '7 Fitur Exclusive (+ Dedicated Cluster & API/Webhook)',
      'Dedicated Account Manager & Senior HR Specialist Pribadi',
      'Workshop Onboarding & Pendampingan On-site',
      'Garansi SLA 99.99% & Backup Multi-Region'
    ],
    classifiedDetails: {
      kapasitas: {
        label: 'Maks. 500 Karyawan',
        description: 'Dihitung untuk kapasitas dasar s/d 500 karyawan aktif.',
        maxCount: 500,
        extraNote: 'Lebih dari 500 karyawan diperhitungkan biaya beban tambahan per orang saja (+Rp 4.000/karyawan/bln).'
      },
      modulDanEPortal: {
        modulesCount: 14,
        moduleNames: ENTERPRISE_MODULE_NAMES,
        eportalsCount: 14,
        eportalNames: ENTERPRISE_EPORTAL_NAMES,
        tagline: '14 Modul Lengkap All-in-One + Akses 14 E-Portal Pelaporan Resmi (High-Capacity)'
      },
      fiturExclusive: [
        'Dedicated Enterprise Cluster & Subdomain/Domain Perusahaan',
        'Full General Affairs (GA): Aset QR Tagging & Purchase Requisition ATK',
        'Modul Assessment Online, Psikotes & Interview Scorecard',
        'Kustomisasi Matrix Approval, Format Surat & Slip Gaji Custom',
        'Akses Database Privat & Integrasi Webhook / API Eksternal',
        'Skalabilitas Fleksibel (>500 User hanya dihitung beban per orang)',
        'Audit Log Aktivitas Keamanan & Kontrol Hak Akses Berjenjang (RBAC)'
      ],
      layananDanBantuan: [
        'Dedicated Account Manager & Senior HR Specialist Pribadi',
        'Pendampingan Onboarding On-site & Sesi Workshop Eksklusif',
        'Garansi Ketersediaan Layanan (SLA 99.99%) & Replikasi Multi-Region',
        'Konsultasi Kepatuhan Regulasi Ketenagakerjaan & Audit Dokumen'
      ]
    }
  }
};

/**
 * 6. STRUKTUR TEKS LENGKAP CARD TIER (DESKRIPSI, BADGE, TOMBOL & KETENTUAN)
 * Seluruh teks yang tampil pada card promosi sebelum tombol lihat selengkapnya
 */
export const TIER_CARD_TEXTS: Record<CompanySizeTier, TierCardTexts> = {
  startup: {
    tierKey: 'startup',
    regularName: 'Startup & UMKM',
    agentName: 'Agent Starter (HR & GA)',
    regularBadge: 'Skala Kecil',
    agentBadge: 'Managed Agent HR & GA',
    karyawan: 'Maks. 50 Karyawan',
    regularDescription: 'Ideal untuk kantor rintisan, UMKM berkembang, dan startup dengan kapasitas maks 50 karyawan.',
    agentDescription: 'Dedicated Agent resmi HRMatrix untuk kantor rintisan & UMKM maks 50 orang. Daily online + visit 1x/minggu.',
    claimButtons: {
      trial: 'Klaim Uji Coba Startup (3 Bulan)',
      annual: 'Klaim Promo Startup',
      whitelabel: 'Klaim White Label Startup',
      agent: 'Klaim Agent Starter Hybrid'
    },
    fourElements: {
      headline: '6 Modul Inti | 3 Fitur Exclusive | 5 ePortal ID | 2 Layanan & Bantuan',
      modulesSummary: 'Data Karyawan, Legal, Presensi, Cuti, Payroll & Pelaporan',
      exclusiveSummary: 'Presensi QR GPS, PPh 21 TER, Slip PDF',
      eportalsSummary: 'BPJS TK & Kes, DJP, WLKP, Bapenda',
      servicesSummary: 'E-Book SOP HR & WA Support Standar',
      regularSummary: 'Paket esensial efisien untuk UMKM: fokus data karyawan, kepatuhan legal, kehadiran online, cuti, penggajian PPh 21 TER & pelaporan.',
      agentSummary: 'Dikelola Dedicated Agent Starter: operasional absensi harian, slip gaji, kepatuhan BPJS & 1x kunjungan on-site/minggu.'
    },
    ketentuan: {
      agent: {
        badge: 'Managed Agent HR & GA',
        scheduleLabel: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan)',
        onlineScope: 'Daily Online: Standby jam kerja kelola sistem HR & GA di cloud.',
        offlineScope: 'Offline Visit: 1x seminggu tatap muka audit berkas & mediasi.',
        savingsPrefix: 'Hemat vs Rekrut HR:'
      },
      trial: {
        badge: 'Uji Coba 3 Bulan',
        billingPeriodLabel: 'Ditagihkan 3 bln (1x kontrak):',
        termTitle: 'Ketentuan: 1x Kontrak Uji Coba (3 Bulan)',
        termNote: 'Tarif evaluasi 3 bulan. Est. Rp 499 / user / hari.'
      },
      annual: {
        badge: 'Sewa Tahunan',
        billingPeriodLabel: 'Ditagihkan 12 bln:',
        termTitle: 'Ketentuan: Komitmen 12 Bulan',
        termNote: 'Est. Hanya Rp 366 / Karyawan / Hari'
      },
      whitelabel: {
        badge: 'White Label',
        billingPeriodLabel: 'one-time',
        termTitle: 'Ketentuan:',
        termNote: 'Lisensi source code & instalasi di VPS privat milik Anda.'
      }
    }
  },
  growth: {
    tierKey: 'growth',
    regularName: 'Growth & Menengah',
    agentName: 'Agent Growth (HR & GA Pro)',
    regularBadge: 'Paling Populer',
    agentBadge: 'Managed Agent HR & GA',
    karyawan: 'Maks. 250 Karyawan',
    popularBadgeRegular: 'Paling Populer',
    popularBadgeAgent: 'Paling Populer',
    regularDescription: 'Solusi komprehensif untuk perusahaan berkembang dengan kapasitas maks 250 karyawan.',
    agentDescription: 'Senior Agent HR & GA untuk perusahaan berkembang maks 250 orang. Kelola payroll, ATS, & pengadaan GA.',
    claimButtons: {
      trial: 'Klaim Uji Coba Growth (3 Bulan)',
      annual: 'Klaim Promo Paket Growth',
      whitelabel: 'Klaim White Label Growth',
      agent: 'Klaim Agent Growth Hybrid'
    },
    fourElements: {
      headline: '10 Modul Inti | 5 Fitur Exclusive | 10 ePortal ID | 3 Layanan & Bantuan',
      modulesSummary: '+ Kinerja & KPI, Rekrutmen & Asesmen, Inventaris, Pengadaan',
      exclusiveSummary: 'Multi-Cabang, ATS Parser CV, KPI Matrix',
      eportalsSummary: '+ Karirhub, e-PP/PKB, K3, PPHI, TKA',
      servicesSummary: 'Pelatihan Live Zoom & Asistensi Migrasi',
      regularSummary: 'Paket ekspansi bisnis berkembang: dilengkapi ATS screening pelamar, penilaian KPI karyawan, inventaris aset, pengadaan ATK & multi-cabang.',
      agentSummary: 'Dikelola Senior Dedicated Agent HR: proses payroll bulanan, filter CV pelamar baru, evaluasi target KPI & visit 1x/minggu.'
    },
    ketentuan: {
      agent: {
        badge: 'Managed Agent HR & GA',
        scheduleLabel: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan)',
        onlineScope: 'Daily Online: Standby jam kerja kelola sistem HR & GA di cloud.',
        offlineScope: 'Offline Visit: 1x seminggu tatap muka audit berkas & mediasi.',
        savingsPrefix: 'Hemat vs Rekrut HR:'
      },
      trial: {
        badge: 'Uji Coba 3 Bulan',
        billingPeriodLabel: 'Ditagihkan 3 bln (1x kontrak):',
        termTitle: 'Ketentuan: 1x Kontrak Uji Coba (3 Bulan)',
        termNote: 'Tarif evaluasi 3 bulan. Est. Rp 225 / user / hari.'
      },
      annual: {
        badge: 'Sewa Tahunan',
        billingPeriodLabel: 'Ditagihkan 12 bln:',
        termTitle: 'Ketentuan: Komitmen 12 Bulan',
        termNote: 'Est. Hanya Rp 180 / Karyawan / Hari'
      },
      whitelabel: {
        badge: 'White Label',
        billingPeriodLabel: 'one-time',
        termTitle: 'Ketentuan:',
        termNote: 'Full Source Code + Bantuan Deployment & Setup Domain Perusahaan.'
      }
    }
  },
  enterprise: {
    tierKey: 'enterprise',
    regularName: 'Enterprise & Korporasi',
    agentName: 'Agent Enterprise (Lead & GA)',
    regularBadge: 'Bisnis Besar',
    agentBadge: 'Managed Agent HR & GA',
    karyawan: 'Maks. 500 Karyawan',
    regularDescription: 'Kapasitas maksimal 500 karyawan. Jika lebih dari 500 karyawan, diperhitungkan biaya beban tambahan per orang.',
    agentDescription: 'Dedicated Senior HR Lead & GA Support untuk korporasi maks 500 karyawan. Menangani kepatuhan & operasional penuh.',
    claimButtons: {
      trial: 'Klaim Uji Coba Enterprise (3 Bulan)',
      annual: 'Klaim Promo Enterprise',
      whitelabel: 'Klaim White Label Enterprise',
      agent: 'Klaim Agent Enterprise Hybrid'
    },
    fourElements: {
      headline: '14 Modul Lengkap | 7 Fitur Exclusive | 14 ePortal ID | 4 Layanan & Bantuan',
      modulesSummary: '14 Modul Lengkap All-in-One (+ Background Check, Fasilitas, Vendor & Surat)',
      exclusiveSummary: 'Dedicated Cluster, API Webhook, SLA 99.99%',
      eportalsSummary: '14 Portal Lengkap (+ OSS, SIMPEL, FESTRONIK, SIMBG)',
      servicesSummary: 'Dedicated Account Manager & On-site Workshop',
      regularSummary: 'Solusi korporasi menyeluruh: infrastruktur dedicated cluster, seluruh 14 modul operasional HR & GA terpadu, Background Check, API, & dedicated consultant.',
      agentSummary: 'Dikelola Senior HR Lead & GA Support: mitigasi regulasi, audit kepatuhan, tata kelola logistik aset & pendampingan intensif.'
    },
    ketentuan: {
      agent: {
        badge: 'Managed Agent HR & GA',
        scheduleLabel: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan) + On-Demand',
        onlineScope: 'Daily Online: Standby jam kerja kelola sistem HR & GA di cloud.',
        offlineScope: 'Offline Visit: 1x seminggu tatap muka audit berkas & mediasi.',
        savingsPrefix: 'Hemat vs Rekrut HR:'
      },
      trial: {
        badge: 'Uji Coba 3 Bulan',
        billingPeriodLabel: 'Ditagihkan 3 bln (1x kontrak):',
        termTitle: 'Ketentuan: 1x Kontrak Uji Coba (3 Bulan)',
        termNote: 'Limit dasar maks 500 karyawan selama uji coba. Beban tambahan jika melebihi 500.'
      },
      annual: {
        badge: 'Sewa Tahunan',
        billingPeriodLabel: 'Ditagihkan 12 bln:',
        termTitle: 'Ketentuan: Limit Maks. 500 Karyawan',
        termNote: 'Kelebihan >500 karyawan dihitung fleksibel per orang (+Rp 4.000/karyawan/bln).'
      },
      whitelabel: {
        badge: 'White Label',
        billingPeriodLabel: 'one-time',
        termTitle: 'Ketentuan:',
        termNote: 'Full Whitelist & Kepemilikan 100%. Custom branding & integrasi database.'
      }
    }
  }
};

/**
 * 7. TEKS STRUKTUR & JUDUL MODAL DETAIL (4 KLASIFIKASI RESMI)
 */
export const PROMO_MODAL_TEXT_CONFIG: PromoModalTextConfig = {
  labels: {
    trial: 'Uji Coba (3 Bulan)',
    annual: 'Sewa Cloud Tahunan',
    whitelabel: 'White Label (Source Code)',
    agent: 'Dedicated Agent (Hybrid)'
  },
  headerBadgeInitials: {
    startup: 'ST',
    growth: 'GW',
    enterprise: 'EP'
  },
  sectionTitles: {
    kapasitas: {
      number: '1',
      title: '1. Kapasitas Pengguna & Karyawan'
    },
    modulDanEPortal: {
      number: '2',
      title: '2. Modul Sistem & Integrasi E-Portal',
      modulesSubheading: '14 Modul Inti HR, GA & Kepatuhan Regulasi HRMatrix:',
      modulesBadge: 'Akses Penuh',
      eportalsSubheading: '14 E-Portal Eksternal Pelaporan Regulasi & Kepatuhan Pemerintah:',
      toggleClose: 'Tutup Daftar',
      toggleOpen: 'Tampilkan 14 Portal'
    },
    fiturExclusive: {
      number: '3',
      title: '3. Fitur Exclusive & Kemampuan Sistem'
    },
    layananDanBantuan: {
      number: '4',
      title: '4. Fasilitas Layanan & Pendampingan Bantuan'
    }
  },
  actions: {
    closeBtn: 'Tutup',
    claimBtn: 'Masuk ke Halaman Pesanan & Invoice'
  }
};

/**
 * 8. DATA PERBANDINGAN LISENSI LENGKAP (TABEL PERBANDINGAN)
 */
export const PROMO_COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Operator & Eksekutor Sistem',
    trial: 'Dikelola Staf Internal Anda',
    annual: 'Dikelola Staf Internal Anda',
    whitelabel: 'Dikelola Tim Internal / IT Anda',
    agent: 'Tenaga Ahli Profesional HRMatrix (Tidak Perlu Rekrut HR Sendiri)',
    agentHighlight: true
  },
  {
    feature: 'Sistem Kehadiran & Operasional',
    trial: 'Full Cloud (Online Support)',
    annual: 'Full Cloud (Online Support)',
    whitelabel: 'On-Premise / Cloud Sendiri',
    agent: 'Hybrid: Daily Online Standby + 1x Kunjungan Fisik / Minggu (4x/bln)',
    agentHighlight: true
  },
  {
    feature: 'Efisiensi Biaya Staf & Risiko HR',
    trial: 'Gaji internal HR & risiko turnover tetap ada',
    annual: 'Gaji internal HR & risiko turnover tetap ada',
    whitelabel: 'Gaji internal HR & risiko turnover tetap ada',
    agent: 'Hemat ~60-70% vs Gaji HR In-House, Tanpa Beban THR/BPJS Internal',
    agentHighlight: true
  },
  {
    feature: 'Ketentuan & Durasi Kontrak',
    trial: 'Khusus 1x Kontrak (3 Bulan Percobaan)',
    annual: 'Perpanjangan Tahunan (Min. 12 Bulan)',
    whitelabel: 'One-time payment (Beli putus seumur hidup)',
    agent: 'Retainer Bulanan Fleksibel / Tahunan Hemat',
    agentHighlight: false
  },
  {
    feature: 'Skema Tarif',
    trial: 'Tarif evaluasi (Sedikit lebih tinggi/bln)',
    annual: 'Tarif Termurah Promo (Hemat s/d 57%)',
    whitelabel: 'Investasi Aset (Tanpa biaya bulanan)',
    agent: 'All-in-One: Software Cloud + Gaji Agent Dedicated',
    agentHighlight: true
  },
  {
    feature: 'Kapasitas Karyawan',
    trial: 'Sesuai tier (Enterprise maks. 500 karyawan)',
    annual: 'Sesuai tier (Enterprise maks. 500 + add-on)',
    whitelabel: 'Bebas / Unlimited (Sesuai server privat)',
    agent: 'Tersedia 15 s/d 500+ karyawan (Skala custom)',
    agentHighlight: false
  },
  {
    feature: 'Infrastruktur Server',
    trial: 'Managed Cloud HRMatrix',
    annual: 'Managed Cloud HRMatrix (Dikelola penuh)',
    whitelabel: 'Server pribadi / Private VPS perusahaan Anda',
    agent: 'Managed Cloud HRMatrix (Sudah Termasuk)',
    agentHighlight: true
  },
  {
    feature: 'Kustomisasi Modul & Headcount',
    trial: 'Ya, Tersedia di Kalkulator',
    annual: 'Ya, Tersedia di Kalkulator',
    whitelabel: 'Ya, Tersedia di Kalkulator',
    agent: 'Ya, Pilih modul yang dikelola Agent',
    agentHighlight: true
  },
  {
    feature: 'Akses Source Code',
    trial: 'Tidak (Akses via Web App)',
    annual: 'Tidak (Akses via Web App)',
    whitelabel: 'Ya, Full Source Code diberikan',
    agent: 'Tidak (Managed Service)',
    agentHighlight: false
  }
];

/**
 * 9. DATA KURIKULUM & LAYANAN ONBOARDING / EDUKASI
 */
export const PROMO_TRAINING_CARDS: TrainingCardItem[] = [
  {
    id: 'online',
    badge: 'GRATIS & SUDAH TERMASUK',
    title: 'Pelatihan Intensif Online & E-Book Panduan SOP',
    description: 'Sesi onboarding interaktif via Zoom / Google Meet bersama tim spesialis implementasi HRMatrix.',
    points: [
      {
        bold: 'E-Book Manual & SOP Digital:',
        text: 'Panduan langkah demi langkah setup PPh 21 TER, jam kerja, absensi, dan master formula.'
      },
      {
        bold: 'Sesi Pelatihan Live Interaktif:',
        text: 'Simulasi proses payroll, ATS rekrutmen, dan evaluasi KPI bersama tim HR & Finance.'
      },
      {
        bold: 'Bimbingan Migrasi Data:',
        text: 'Pendampingan upload data massal karyawan dari file Excel lama perusahaan.'
      },
      {
        bold: 'Group Konsultasi WhatsApp:',
        text: 'Saluran tanya jawab cepat selama masa aktif penggunaan aplikasi.'
      }
    ],
    footerNote: 'Otomatis didapatkan pada semua paket Sewa & White Label'
  },
  {
    id: 'onsite',
    badge: 'ADD-ON OPSIONAL • IN-HOUSE',
    title: 'Pelatihan Tatap Muka Langsung di Kantor (On-Site Training)',
    description: 'Konsultan & trainer senior HR hadir langsung ke lokasi kantor perusahaan Anda untuk workshop intensif.',
    points: [
      {
        bold: 'Hands-On Workshop di Kantor:',
        text: 'Pelatihan tatap muka langsung untuk admin HR, payroll specialist, dan manajemen.'
      },
      {
        bold: 'Pendampingan Go-Live Periode Pertama:',
        text: 'Pengawasan langsung proses hitung gaji & absensi pertama kali di lokasi.'
      },
      {
        bold: 'Audit & Penyelarasan Kebijakan:',
        text: 'Review kepatuhan formula PPh 21, BPJS, dan Peraturan Perusahaan (PP).'
      },
      {
        bold: 'Durasi Fleksibel & Custom:',
        text: 'Paket workshop 1 s/d 3 hari kerja sesuai kebutuhan perusahaan.'
      }
    ],
    footerNote: 'Biaya disesuaikan dengan lokasi kota & durasi workshop.',
    actionLabel: 'Konsultasi On-Site'
  }
];

/**
 * 10. TANYA JAWAB (FAQ) PROMO & LISENSI
 */
export const FAQS_DATA: FaqItem[] = [
  {
    q: 'Apa itu Layanan Dedicated Agent (HR & GA Hybrid) dan mengapa perusahaan tidak perlu rekrut HR sendiri?',
    a: 'Layanan Dedicated Agent adalah solusi di mana HRMatrix menugaskan tenaga ahli profesional (Person-in-Charge) khusus untuk mengelola seluruh urusan HR dan General Affairs (GA) di perusahaan Anda. Anda tidak perlu repot membuka lowongan, mewawancarai, menggaji staf HR/GA internal (Rp 6jt - 15jt/bulan), membayar BPJS tenaga kerja kantor, maupun risiko turnover karyawan HR. Sistem digitalisasi HRMatrix langsung dioperasikan oleh ahlinya sehingga operasional langsung berjalan rapi sejak hari pertama.'
  },
  {
    q: 'Bagaimana sistem kerja Hybrid pada Dedicated Agent HR & GA (Online harian & Kunjungan 1x seminggu)?',
    a: 'Kerja tim Agent berlangsung secara Hybrid:\n1. Daily Online (Senin - Jumat jam kerja): Agent standby memproses absensi harian karyawan, approval cuti/izin/lembur, kalkulasi payroll & slip gaji, screening pelamar baru lewat ATS, pembuatan draft surat/kontrak PKWT, serta administrasi pengadaan ATK/GA via cloud HRMatrix.\n2. Offline Visit (1 Minggu 1 Kali / 4x Sebulan): Agent hadir langsung secara fisik ke kantor perusahaan Anda untuk memeriksa operasional fisik, mediasi karyawan tatap muka, verifikasi tanda tangan berkas fisik, audit inventaris aset GA kantor, dan konsultasi berkala dengan pimpinan perusahaan.'
  },
  {
    q: 'Apakah paket Dedicated Agent juga bisa dikustomisasi berdasarkan modul dan jumlah karyawan?',
    a: 'Ya, tentu! Anda bisa memilih secara fleksibel di Kalkulator Kustomisasi kami. Anda dapat menentukan kapasitas jumlah karyawan dan memilih modul apa saja yang ditugaskan kepada Agent (misal: hanya ingin Agent mengelola Payroll & Absensi, atau komprehensif mencakup ATS Rekrutmen, Evaluasi KPI, dan General Affairs). Biaya akan terhitung secara otomatis dan transparan sesuai ruang lingkup yang Anda tentukan.'
  },
  {
    q: 'Bagaimana jaminan kerahasiaan data karyawan & data finansial perusahaan (NDA)?',
    a: 'Setiap Dedicated Agent dan pihak HRMatrix Indonesia terikat secara hukum oleh Non-Disclosure Agreement (NDA) ketat. Seluruh data penggajian, data pribadi karyawan, kontrak bisnis, dan aset perusahaan dienkripsi dengan standar keamanan tinggi dan hanya dapat diakses oleh pihak yang berwenang di perusahaan Anda.'
  },
  {
    q: 'Bagaimana ketentuan Paket Uji Coba (Pilot 3 Bulan) dan mengapa hanya bisa kontrak 1 kali?',
    a: 'Paket Uji Coba (Pilot 3 Bulan) disediakan untuk perusahaan yang ingin mengevaluasi kecocokan sistem HRMatrix secara penuh selama masa percobaan 3 bulan. Kontrak ini hanya dapat diambil 1 kali per perusahaan (tidak dapat diperpanjang berulang dengan tarif uji coba). Tarif per bulannya sedikit lebih tinggi dibanding sewa tahunan agar mendorong perusahaan beralih ke komitmen minimal 12 bulan yang jauh lebih hemat. Setelah 3 bulan evaluasi, data perusahaan tetap tersimpan utuh dan dapat langsung dilanjutkan ke Sewa Cloud Tahunan atau White Label.'
  },
  {
    q: 'Bagaimana ketentuan kuota maksimal 500 karyawan pada paket Enterprise?',
    a: 'Paket Enterprise dirancang dengan kapasitas cluster server tinggi untuk kuota dasar hingga maksimal 500 karyawan aktif. Apabila di kemudian hari karyawan perusahaan Anda berkembang melebihi 500 orang, Anda tidak perlu membeli lisensi paket baru; kelebihan di atas 500 karyawan akan diperhitungkan dengan biaya beban tambahan per orang saja secara fleksibel (+Rp 4.000 / karyawan / bulan).'
  },
  {
    q: 'Bagaimana sistem kustomisasi modul dan jumlah karyawan (Pay-Per-Module & Headcount)?',
    a: 'Fitur kustomisasi kami memungkinkan Anda memilih hanya modul yang benar-benar dibutuhkan dengan jumlah karyawan riil saat ini. Modul dasar mencakup hingga 25 karyawan. Setiap penambahan karyawan dihitung dengan skema volume discount yang semakin murah per kepala seiring bertambahnya tim (mulai Rp 1.000 hingga Rp 200 per karyawan per modul). Sebagai patokan standar, pemilihan 8 Modul Inti HR untuk kapasitas 50 karyawan hanya Rp 20.000 / karyawan / bulan pada masa uji coba 3 bulan (dan jauh lebih hemat lagi pada komitmen tahunan). Anda bisa memilih skema Uji Coba (3 bln), Sewa Cloud Tahunan (12 bln), White Label Beli Putus, maupun Managed HR & GA Agent.'
  },
  {
    q: 'Apakah pembelian paket custom sudah termasuk panduan dan pelatihan intensif?',
    a: 'Ya, seluruh pembelian modul custom tetap mendapatkan fasilitas penuh E-Book Modul Panduan Lengkap SOP HR, video tutorial, serta sesi Pelatihan Online Intensif (Live Interactive Training via Zoom/Google Meet) untuk modul-modul yang Anda aktifkan.'
  },
  {
    q: 'Seberapa hemat jika dibandingkan dengan merekrut staf HR dan GA sendiri?',
    a: 'Merekrut 1 orang staf HR in-house rata-rata membutuhkan gaji Rp 4.500.000 - Rp 6.000.000/bulan, ditambah staf GA Rp 3.500.000 - Rp 5.000.000/bulan, belum termasuk tunjangan BPJS, pesangon, THR, dan biaya rekrutmen. Dengan Managed Agent HRMatrix yang sudah mencakup sistem software cloud dan personil hybrid, biaya mulai dari Rp 1.850.000/bulan, menghemat anggaran operasional perusahaan hingga 60-70% setiap bulan.'
  }
];
