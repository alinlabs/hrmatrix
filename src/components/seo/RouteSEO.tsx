import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteSEOItem {
  title: string;
  description: string;
  keywords?: string;
}

const DEFAULT_KEYWORDS = "aplikasi hrd, aplikasi ga, tools ga, tools hr, aplikasi hrd gratis, software hrd, software hrd indonesia, tools hrd gratis, tools hr gratis, tools ga kantor, software ga, software general affair, aplikasi general affair indonesia, sistem general affair, manajemen ga, ga tools, software payroll, software payroll indonesia, aplikasi payroll, aplikasi penggajian, kalkulator gaji, hitung gaji online, pph 21 ter 2024, pph 21 ter 2025, kalkulator bpjs ketenagakerjaan, kalkulator bpjs kesehatan, aplikasi absensi online, aplikasi absensi gps, absensi qr code, jadwal shift kerja, roster shift karyawan, tukar shift online, manajemen cuti online, aplikasi cuti karyawan, manajemen aset kantor, inventaris aset perusahaan, pengadaan atk kantor, form purchase requisition pr, pemeliharaan fasilitas gedung, direktori vendor rekanan, buku tamu digital resepsionis, buku ekspedisi surat online, aplikasi ats indonesia, applicant tracking system, tes asesmen online disc tpa, template kpi karyawan, format surat pkwt pp 35, alvareza hilka pratama, dibuat oleh alvareza hilka pratama, karya alvareza hilka pratama, founder alvareza hilka pratama, hrmatrix";

const GA_KEYWORDS = "aplikasi ga, tools ga, tools ga kantor, software ga, software general affair, aplikasi general affair indonesia, sistem general affair, manajemen ga, ga tools, aplikasi operasional kantor, manajemen aset kantor, inventaris aset perusahaan, aplikasi pengadaan atk, formulir purchase requisition pr, sistem kartu stok atk, pemeliharaan fasilitas kantor, maintenance request ga kantor, servis ac listrik gedung, direktori vendor rekanan, buku tamu digital resepsionis, buku ekspedisi surat keluar masuk, agenda surat kantor digital, alvareza hilka pratama, hrmatrix";

const HR_PAYROLL_KEYWORDS = "software payroll, software payroll indonesia, aplikasi payroll, aplikasi payroll gratis, aplikasi penggajian karyawan, kalkulator gaji online, hitung gaji bersih, pph 21 ter 2024, pph 21 ter 2025, tarif efektif pph 21 pp 58 2023, kalkulator bpjs ketenagakerjaan, kalkulator bpjs kesehatan, aplikasi slip gaji, cetak slip gaji pdf, perhitungan lembur depnaker, upah lembur pp 35 2021, tools hr payroll, software hrd penggajian, alvareza hilka pratama, hrmatrix";

const HR_ATTENDANCE_KEYWORDS = "aplikasi absensi online, aplikasi presensi gps, absensi barcode qr code, absensi online gratis, aplikasi absensi karyawan gratis, jadwal shift kerja, roster shift kerja, tukar shift kerja online, manajemen jadwal kerja, aplikasi cuti karyawan, manajemen cuti online, permohonan izin sakit cuti, tools hr, aplikasi hrd gratis, software hrd indonesia, alvareza hilka pratama, hrmatrix";

const HR_RECRUITMENT_KEYWORDS = "aplikasi ats, applicant tracking system indonesia, software rekrutmen karyawan, portal lowongan kerja, asesmen tes online karyawan, psikotes online disc, tes penalaran kognitif tpa, situational judgement test sjt, tes bahasa inggris kerja, generator surat perjanjian kerja pkwt, contoh kontrak pkwt pp 35, format kontrak magang, tools hr rekrutmen, alvareza hilka pratama, hrmatrix";

const HR_KPI_KEYWORDS = "aplikasi kpi karyawan, software penilaian kinerja, template kpi gratis, indikator kpi perusahaan, review kinerja berkala, standarisasi job description, uraian jabatan hrd, kamus kompetensi kerja, tools hrd kpi, alvareza hilka pratama, hrmatrix";

const CHECKING_KEYWORDS = "checking tools, tools background checking, verifikasi karyawan, cek ijazah sivil pddikti, cek sertifikasi bnsp, cek slik ojk, cek ktp dukcapil, cek npwp djp, cek skck polri, sipp mahkamah agung, str kemenkes, background check indonesia, screening kandidat, verifikasi rekrutmen hrd, alvareza hilka pratama, hrmatrix";

const EPORTAL_KEYWORDS = "e-portal, eportal hrd, portal kemnaker wlkp, sipp bpjstk, edabu bpjs kesehatan, djp online pajak, oss rba bkpm, simpel klhk, festronik limbah b3, simbg pupr slf, teman k3 kemnaker, karirhub siapkerja, pelaporan hrd, kepatuhan legal ga, alvareza hilka pratama, hrmatrix";

interface RouteSEOMap {
  [path: string]: RouteSEOItem;
}

const routeSeoData: RouteSEOMap = {
  '/': {
    title: 'Aplikasi HRIS, Software Payroll & General Affair (GA) Indonesia | HRMatrix',
    description: 'Aplikasi HRIS, payroll & General Affair (GA) Indonesia terpadu. Hitung gaji, PPh 21 TER, BPJS, absensi GPS, KPI, kelola aset kantor, ATK, fasilitas, & vendor resmi.',
  },
  '/daftar': {
    title: 'Daftar HRMatrix - Form Pendaftaran Software HRIS & Payroll',
    description: 'Daftarkan perusahaan Anda secara gratis di HRMatrix Indonesia. Nikmati kemudahan mengelola absensi karyawan, database HRD, dan proses payroll instan.',
  },
  '/my-presensi': {
    title: 'My Presensi Karyawan - Absensi Online & GPS QR Code | HRMatrix',
    description: 'Sistem presensi mandiri karyawan online. Lakukan absensi masuk/pulang, verifikasi lokasi GPS, scan QR Code, dan lihat riwayat kehadiran harian.',
  },
  '/employees': {
    title: 'Database Karyawan & Struktur Organisasi Perusahaan | HRMatrix',
    description: 'Software HRD untuk mengelola database karyawan lengkap, struktur organisasi perusahaan, jabatan, dokumen kepegawaian, dan rekening bank.',
  },
  '/attendance': {
    title: 'Aplikasi Absensi Karyawan Online & Rekap Kehadiran | HRMatrix',
    description: 'Sistem absensi online gratis. Monitor kehadiran, shift kerja, izin, cuti, rekap otomatis, dan perhitungan lembur (overtime) sesuai PP 35/2021.',
  },
  '/presensi': {
    title: 'Presensi Harian & Rekapitulasi Kehadiran Karyawan | HRMatrix',
    description: 'Aplikasi presensi online dan rekap absensi harian karyawan. Monitor absensi masuk/pulang, scan QR code, dan rekapitulasi kehadiran bulanan.',
  },
  '/jadwal': {
    title: 'Manajemen Jadwal Kerja, Shift & Tukar Shift | HRMatrix',
    description: 'Kelola kalender jadwal kerja, matriks shift karyawan bergilir, permohonan tukar shift, dan jadwal lembur operasional secara otomatis.',
  },
  '/cuti': {
    title: 'Manajemen Cuti Karyawan, Saldo & Kebijakan Izin | HRMatrix',
    description: 'Aplikasi pengelolaan cuti karyawan. Cek saldo kuota cuti tahunan, form pengajuan cuti & sakit online, serta penetapan kebijakan cuti perusahaan.',
  },
  '/payroll': {
    title: 'Sistem Penggajian & Aplikasi Payroll PPh 21 TER | HRMatrix',
    description: 'Aplikasi payroll Indonesia gratis. Proses penggajian otomatis dengan potongan PPh 21 skema TER (PP 58/2023), kalkulator BPJS, dan cetak slip gaji PDF.',
  },
  '/payroll_detail': {
    title: 'Detail Laporan Payroll & Ringkasan Gaji Karyawan | HRMatrix',
    description: 'Rincian lengkap perhitungan payroll bulanan, komponen gaji pokok, tunjangan, lembur, potongan PPh 21 TER, BPJS, dan cetak slip gaji.',
  },
  '/payroll_employees': {
    title: 'Daftar Slip Gaji Karyawan & Export Slip Gaji PDF | HRMatrix',
    description: 'Kelola dan cetak slip gaji karyawan untuk periode penggajian aktif secara massal atau individual dengan format resmi PDF.',
  },
  '/payroll/tunjangan': {
    title: 'Manajemen Komponen Tunjangan & Insentif Karyawan | HRMatrix',
    description: 'Atur tunjangan tetap, tunjangan tidak tetap, bonus kinerja, dan insentif karyawan dalam sistem payroll HRMatrix.',
  },
  '/payroll/bpjs': {
    title: 'Regulasi Iuran BPJS Kesehatan & Ketenagakerjaan | HRMatrix',
    description: 'Konfigurasi tarif dan formula iuran BPJS Kesehatan dan BPJS Ketenagakerjaan (JKK, JKM, JHT, JP) resmi pemerintah.',
  },
  '/payroll/pajak': {
    title: 'Regulasi Pajak PPh 21, Tarif TER & PTKP | HRMatrix',
    description: 'Kelola perhitungan pajak penghasilan PPh 21 dengan tarif efektif rata-rata (TER) bulanan, harian, dan Pasal 17.',
  },
  '/kompensasi': {
    title: 'Manajemen Kompensasi, Tunjangan & Lembur HRD | HRMatrix',
    description: 'Kelola aturan lembur karyawan, tunjangan tetap & tidak tetap, bonus, THR (Tunjangan Hari Raya), dan kepatuhan undang-undang ketenagakerjaan.',
  },
  '/kompensasi_add': {
    title: 'Form Pengaturan Kompensasi & Kebijakan Tunjangan | HRMatrix',
    description: 'Tambah dan sesuaikan aturan kompensasi karyawan, tunjangan jabatan, insentif kinerja, serta komponen pemotong gaji perusahaan.',
  },
  '/regulation': {
    title: 'Regulasi Ketenagakerjaan & Kebijakan HR Indonesia | HRMatrix',
    description: 'Pedoman lengkap regulasi ketenagakerjaan UU Cipta Kerja, PP 35/2021, PP 58/2023, serta kebijakan upah minimum dan lembur untuk HRD.',
  },
  '/kpi': {
    title: 'Aplikasi Penilaian Kinerja & Evaluasi KPI Karyawan | HRMatrix',
    description: 'Software penilaian kinerja karyawan. Pantau pencapaian KPI (Key Performance Indicator) bulanan, target departemen, dan evaluasi tim.',
  },
  '/kpi/katalog-umum': {
    title: 'Katalog Template Indikator KPI Nasional Gratis | HRMatrix',
    description: 'Download ratusan template indikator KPI siap pakai gratis untuk berbagai industri, divisi, dan level jabatan di perusahaan Indonesia.',
  },
  '/settings/kpi-umum': {
    title: 'Katalog Template Indikator KPI Nasional Gratis | HRMatrix',
    description: 'Download ratusan template indikator KPI siap pakai gratis untuk berbagai industri, divisi, dan level jabatan di perusahaan Indonesia.',
  },
  '/job-desk': {
    title: 'Contoh Job Description & Uraian Tugas Karyawan | HRMatrix',
    description: 'Katalog standarisasi uraian jabatan (Job Description), kualifikasi kandidat, tugas utama, dan KPI posisi kerja untuk mempermudah HRD.',
  },
  '/lowongan': {
    title: 'Aplikasi ATS & Software Rekrutmen Karyawan | HRMatrix',
    description: 'Aplikasi Applicant Tracking System (ATS) gratis. Buat lowongan kerja, kelola lamaran masuk, seleksi CV kandidat, dan atur rekrutmen.',
  },
  '/lowongan_detail': {
    title: 'Detail Lowongan Kerja & Seleksi Pelamar ATS | HRMatrix',
    description: 'Pantau progres pelamar kerja, kualifikasi kandidat, jadwalkan wawancara, dan proses penawaran kerja (offering letter) dalam satu sistem.',
  },
  '/ats': {
    title: 'Sistem Seleksi Pelamar & Applicant Tracking System | HRMatrix',
    description: 'Software ATS Indonesia. Tracking progres kandidat dan pelamar kerja dari tahap screening CV, wawancara, hingga penawaran kerja.',
  },
  '/assessment': {
    title: 'Assessment Hub & Tes Online Kandidat (DISC, TPA, SJT, English) | HRMatrix',
    description: 'Platform asesmen psikotes online, penalaran kognitif TPA, etika kerja SJT, dan tes bahasa Inggris bisnis siap dibagikan ke kandidat dengan penskoran otomatis.',
  },
  '/kontrak': {
    title: 'Generator Dokumen Kontrak Kerja (PKWT, PKWTT, Magang) | HRMatrix',
    description: 'Generator surat perjanjian kerja karyawan resmi sesuai regulasi UU Ketenagakerjaan & PP 35/2021. Buat kontrak PKWT, PKWTT, magang, dan freelance presisi.',
  },
  '/reports': {
    title: 'Laporan HR Analytics & Biaya Payroll Perusahaan | HRMatrix',
    description: 'Dashboard analitik HR. Pantau headcount karyawan, turnover rate, distribusi gaji bulanan, dan total pengeluaran payroll perusahaan.',
  },
  '/database': {
    title: 'Pusat Data HRIS & Backup Database Encrypted | HRMatrix',
    description: 'Cadangkan (backup) data karyawan, riwayat payroll, presensi online, dan pulihkan data dengan enkripsi lokal IndexedDB yang aman.',
  },
  '/settings': {
    title: 'Pengaturan Sistem HRIS & Profil Perusahaan | HRMatrix',
    description: 'Konfigurasi profil perusahaan, NPWP badan, logo bisnis, preferensi tanggal cut-off penggajian, dan pengaturan kebijakan presensi.',
  },
  '/ebook': {
    title: 'Download E-Book & Modul Panduan HRD Indonesia | HRMatrix',
    description: 'Download e-book HRD gratis dan modul panduan manajemen SDM, penggajian (payroll), serta kepatuhan hukum tenaga kerja untuk UMKM.',
  },
  '/navigasi-cepat': {
    title: 'Navigasi Cepat & Peta Seluruh Fitur HRMatrix | HRMatrix',
    description: 'Peta navigasi seluruh modul HRMatrix. Temukan fitur penggajian, absensi online, database karyawan, ATS, dan laporan HRD dengan cepat.',
  },
  '/navigasi': {
    title: 'Navigasi Cepat & Peta Seluruh Fitur HRMatrix | HRMatrix',
    description: 'Peta navigasi seluruh modul HRMatrix. Temukan fitur penggajian, absensi online, database karyawan, ATS, dan laporan HRD dengan cepat.',
  },
  '/faq': {
    title: 'FAQ Aplikasi HRIS & Tanya Jawab Payroll | HRMatrix',
    description: 'Kumpulan pertanyaan yang sering diajukan mengenai cara kerja software HRIS HRMatrix, rumus PPh 21 TER, kalkulator BPJS, dan akses PWA.',
  },
  '/bantuan': {
    title: 'Pusat Bantuan & Tutorial Cara Menggunakan HRMatrix',
    description: 'Panduan lengkap dan tutorial langkah demi langkah cara menggunakan seluruh fitur sistem HRIS & Payroll HRMatrix Indonesia.',
  },
  '/tentang': {
    title: 'Tentang HRMatrix Indonesia - Diciptakan oleh Alvareza Hilka Pratama | HRIS & Payroll',
    description: 'Mengenal sistem HRMatrix Indonesia, platform HRIS, Payroll & GA ciptaan Alvareza Hilka Pratama yang didedikasikan untuk digitalisasi manajemen SDM di Indonesia.',
  },
  '/about': {
    title: 'Tentang HRMatrix Indonesia - Diciptakan oleh Alvareza Hilka Pratama | HRIS & Payroll',
    description: 'Mengenal sistem HRMatrix Indonesia, platform HRIS, Payroll & GA ciptaan Alvareza Hilka Pratama yang didedikasikan untuk digitalisasi manajemen SDM di Indonesia.',
  },
  '/prompt': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/prompts': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/poster': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/posters': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/prompt-poster': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/prompts-poster': {
    title: 'Direktori Prompt Poster Promosi & Mockup 3D | HRMatrix',
    description: 'Katalog rincian seluruh halaman aplikasi HRMatrix beserta prompt pembuatan poster promosi rasio 4:5 portrait dengan visual mockup 3D.',
  },
  '/promo': {
    title: 'Paket Promosi & Harga Lisensi Server HRMatrix Indonesia',
    description: 'Daftar harga promo software HRIS & Payroll HRMatrix. Opsi sewa cloud tahunan minimal 12 bulan dan paket White Label beli putus server sendiri.',
  },
  '/promosi': {
    title: 'Paket Promosi & Harga Lisensi Server HRMatrix Indonesia',
    description: 'Daftar harga promo software HRIS & Payroll HRMatrix. Opsi sewa cloud tahunan minimal 12 bulan dan paket White Label beli putus server sendiri.',
  },
  '/pricing': {
    title: 'Daftar Harga & Paket Langganan Server HRMatrix Indonesia',
    description: 'Pilihan paket harga Startup, Growth, dan Enterprise HRMatrix. Sewa cloud tahunan dan lisensi white label on-premise.',
  },
  '/ga': {
    title: 'Overview General Affair (GA) & Manajemen Operasional Kantor | HRMatrix',
    description: 'Pusat manajemen operasional General Affair (GA) perusahaan: kontrol inventaris aset, pengadaan ATK & PR, servis fasilitas, vendor, dan buku tamu kantor.',
  },
  '/ga/dashboard': {
    title: 'Overview General Affair (GA) & Manajemen Operasional Kantor | HRMatrix',
    description: 'Pusat manajemen operasional General Affair (GA) perusahaan: kontrol inventaris aset, pengadaan ATK & PR, servis fasilitas, vendor, dan buku tamu kantor.',
  },
  '/ga/aset': {
    title: 'Manajemen Aset & Inventaris Perusahaan (General Affair) | HRMatrix',
    description: 'Aplikasi pencatatan aset kantor, pelacakan inventaris, nomor barcode/SKU, kondisi aset, depresiasi, dan penanggung jawab inventaris perusahaan.',
  },
  '/ga/asset': {
    title: 'Manajemen Aset & Inventaris Perusahaan (General Affair) | HRMatrix',
    description: 'Aplikasi pencatatan aset kantor, pelacakan inventaris, nomor barcode/SKU, kondisi aset, depresiasi, dan penanggung jawab inventaris perusahaan.',
  },
  '/ga/atk': {
    title: 'Pengadaan ATK, Purchase Requisition (PR) & Stok Kantor | HRMatrix',
    description: 'Sistem pengadaan alat tulis kantor (ATK), formulir purchase requisition (PR), alur persetujuan, dan kontrol kartu stok perlengkapan operasional.',
  },
  '/ga/supplies': {
    title: 'Pengadaan ATK, Purchase Requisition (PR) & Stok Kantor | HRMatrix',
    description: 'Sistem pengadaan alat tulis kantor (ATK), formulir purchase requisition (PR), alur persetujuan, dan kontrol kartu stok perlengkapan operasional.',
  },
  '/ga/fasilitas': {
    title: 'Pemeliharaan Fasilitas, Service Request & Maintenance GA | HRMatrix',
    description: 'Kelola pemeliharaan gedung, perbaikan AC/listrik/perangkat kerja, jadwal inspeksi rutin fasilitas kantor, dan tiket maintenance karyawan.',
  },
  '/ga/vendor': {
    title: 'Direktori Vendor Rekanan & Manajemen Perizinan Operasional | HRMatrix',
    description: 'Database vendor resmi perusahaan, kontrak kerja sama rekanan, masa berlaku izin gedung/SLF/PBG, dan kepatuhan perizinan instansi pemerintah.',
  },
  '/ga/buku-tamu': {
    title: 'Buku Tamu Digital & Ekspedisi Surat Masuk / Keluar | HRMatrix',
    description: 'Pencatatan buku tamu resepsionis kantor digital, log kunjungan visitor, manifest penerimaan paket, dan buku ekspedisi surat keluar/masuk.',
  },
  '/candidate': {
    title: 'Daftar Kandidat Rekrutmen & Matriks Evaluasi Skor | HRMatrix',
    description: 'Daftar pelamar kerja terintegrasi hasil Screening ATS, Assessment Tes Online, dan Checklist Wawancara untuk penetapan hiring decision.',
  },
  '/kandidat': {
    title: 'Daftar Kandidat Rekrutmen & Matriks Evaluasi Skor | HRMatrix',
    description: 'Daftar pelamar kerja terintegrasi hasil Screening ATS, Assessment Tes Online, dan Checklist Wawancara untuk penetapan hiring decision.',
  },
  '/checking-tools': {
    title: 'Background Checking Tools - Verifikasi Rekrutmen Karyawan Resmi Indonesia | HRMatrix',
    description: 'Tools background checking & verifikasi pelamar kerja terintegrasi ke sistem resmi pemerintah: Ijazah Dikti SIVIL, BNSP, SLIK OJK, Dukcapil, NPWP, SKCK, & Putusan MA.',
  },
  '/checkingtools': {
    title: 'Background Checking Tools - Verifikasi Rekrutmen Karyawan Resmi Indonesia | HRMatrix',
    description: 'Tools background checking & verifikasi pelamar kerja terintegrasi ke sistem resmi pemerintah: Ijazah Dikti SIVIL, BNSP, SLIK OJK, Dukcapil, NPWP, SKCK, & Putusan MA.',
  },
  '/checking': {
    title: 'Background Checking Tools - Verifikasi Rekrutmen Karyawan Resmi Indonesia | HRMatrix',
    description: 'Tools background checking & verifikasi pelamar kerja terintegrasi ke sistem resmi pemerintah: Ijazah Dikti SIVIL, BNSP, SLIK OJK, Dukcapil, NPWP, SKCK, & Putusan MA.',
  },
  '/e-portal': {
    title: 'e-Portal Instansi Pemerintah - Integrasi Pelaporan HRD & General Affair Resmi | HRMatrix',
    description: 'Pusat akses dan panduan pelaporan wajib instansi pemerintah untuk HRD & GA: Kemnaker WLKP, SIPP BPJSTK, e-Dabu BPJS Kesehatan, DJP Pajak, OSS RBA, SIMPEL, Festronik, & SIMBG.',
  },
  '/eportal': {
    title: 'e-Portal Instansi Pemerintah - Integrasi Pelaporan HRD & General Affair Resmi | HRMatrix',
    description: 'Pusat akses dan panduan pelaporan wajib instansi pemerintah untuk HRD & GA: Kemnaker WLKP, SIPP BPJSTK, e-Dabu BPJS Kesehatan, DJP Pajak, OSS RBA, SIMPEL, Festronik, & SIMBG.',
  },
  '/portal': {
    title: 'e-Portal Instansi Pemerintah - Integrasi Pelaporan HRD & General Affair Resmi | HRMatrix',
    description: 'Pusat akses dan panduan pelaporan wajib instansi pemerintah untuk HRD & GA: Kemnaker WLKP, SIPP BPJSTK, e-Dabu BPJS Kesehatan, DJP Pajak, OSS RBA, SIMPEL, Festronik, & SIMBG.',
  },
  '/sitemap': {
    title: 'Sitemap XML & Peta Situs Resmi | HRMatrix Indonesia',
    description: 'Peta situs XML resmi sistem HRMatrix Indonesia untuk pengindeksan Googlebot, Bingbot, dan panduan seluruh rute fitur HRIS, Payroll, GA, dan Dokumen.',
  },
  '/sitemap.xml': {
    title: 'sitemap.xml — Peta Situs XML Terverifikasi | HRMatrix Indonesia',
    description: 'Peta situs XML standar Sitemaps.org 0.9 HRMatrix Indonesia dengan metadata protokol penjelajahan mesin pencari.',
  },
  '/robots.txt': {
    title: 'robots.txt — Aturan Perayapan Mesin Pencari | HRMatrix Indonesia',
    description: 'Direktif robots.txt resmi HRMatrix Indonesia yang mengizinkan perayapan halaman utama serta integrasi tautan sitemap.xml.',
  },
  '/404': {
    title: 'Halaman Tidak Ditemukan (404) | HRMatrix Indonesia',
    description: 'Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan. Kembali ke beranda HRMatrix Indonesia untuk mengakses sistem HRIS & GA.',
  },
};

function getKeywordsForPath(cleanPath: string): string {
  if (cleanPath.startsWith('/checking')) {
    return CHECKING_KEYWORDS;
  }
  if (cleanPath.startsWith('/e-portal') || cleanPath.startsWith('/eportal') || cleanPath.startsWith('/portal')) {
    return EPORTAL_KEYWORDS;
  }
  if (cleanPath.startsWith('/ga')) {
    return GA_KEYWORDS;
  }
  if (
    cleanPath.startsWith('/payroll') || 
    cleanPath.startsWith('/kompensasi') || 
    cleanPath.startsWith('/regulation') || 
    cleanPath === '/reports'
  ) {
    return HR_PAYROLL_KEYWORDS;
  }
  if (
    cleanPath.startsWith('/presensi') || 
    cleanPath.startsWith('/attendance') || 
    cleanPath.startsWith('/jadwal') || 
    cleanPath.startsWith('/cuti') || 
    cleanPath.startsWith('/my-presensi')
  ) {
    return HR_ATTENDANCE_KEYWORDS;
  }
  if (
    cleanPath.startsWith('/lowongan') || 
    cleanPath.startsWith('/ats') || 
    cleanPath.startsWith('/candidate') || 
    cleanPath.startsWith('/kandidat') || 
    cleanPath.startsWith('/assessment') || 
    cleanPath.startsWith('/kontrak')
  ) {
    return HR_RECRUITMENT_KEYWORDS;
  }
  if (cleanPath.startsWith('/kpi') || cleanPath.startsWith('/job-desk') || cleanPath.includes('kpi-umum')) {
    return HR_KPI_KEYWORDS;
  }
  return DEFAULT_KEYWORDS;
}

function resolveSeo(pathname: string): RouteSEOItem {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const autoKeywords = getKeywordsForPath(cleanPath);

  let item: RouteSEOItem;
  if (routeSeoData[cleanPath]) {
    item = { ...routeSeoData[cleanPath] };
  } else if (cleanPath.startsWith('/payroll/')) {
    item = cleanPath.endsWith('/employees')
      ? { ...routeSeoData['/payroll_employees'] }
      : { ...routeSeoData['/payroll_detail'] };
  } else if (cleanPath.startsWith('/lowongan/')) {
    item = { ...routeSeoData['/lowongan_detail'] };
  } else if (cleanPath.startsWith('/kandidat/') || cleanPath.startsWith('/candidate/')) {
    item = {
      title: 'Detail Evaluasi & Profil Kandidat | HRMatrix',
      description: 'Detail kualifikasi, riwayat berkas, hasil tes online, dan lembar kerja penilaian wawancara kandidat rekrutmen.',
    };
  } else if (cleanPath.startsWith('/kompensasi/') || cleanPath.startsWith('/regulation/')) {
    item = { ...routeSeoData['/kompensasi_add'] };
  } else {
    item = {
      title: 'HRMatrix Indonesia - Solusi Terpadu Aplikasi HRD, Tools GA & Software Payroll',
      description: 'Aplikasi terpadu HRD, tools General Affair (GA), absensi GPS, administrasi SDM, aset kantor, dan payroll PPh 21 TER untuk perusahaan Indonesia.',
    };
  }

  if (!item.keywords) {
    item.keywords = autoKeywords;
  }
  return item;
}

export const RouteSEO: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.replace(/\/$/, '') || '/';
    const seo = resolveSeo(currentPath);

    // Update document title
    document.title = seo.title;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Update Meta Description, Title & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[name="title"]', 'name', 'title', seo.title);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seo.keywords || DEFAULT_KEYWORDS);

    // Attribution & Author Meta Tags for Google Indexing & Knowledge Graph
    setMetaTag('meta[name="author"]', 'name', 'author', 'Alvareza Hilka Pratama');
    setMetaTag('meta[name="creator"]', 'name', 'creator', 'Alvareza Hilka Pratama');
    setMetaTag('meta[name="publisher"]', 'name', 'publisher', 'HRMatrix Indonesia - Alvareza Hilka Pratama');
    setMetaTag('meta[name="developer"]', 'name', 'developer', 'Alvareza Hilka Pratama');
    setMetaTag('meta[name="DC.creator"]', 'name', 'DC.creator', 'Alvareza Hilka Pratama');
    setMetaTag('meta[name="DC.contributor"]', 'name', 'DC.contributor', 'Alvareza Hilka Pratama');
    setMetaTag('meta[name="DC.publisher"]', 'name', 'DC.publisher', 'HRMatrix Indonesia');

    // Base domain configuration
    const currentOrigin = typeof window !== 'undefined' && (window.location.hostname.includes('hrmatrix.my.id'))
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://hrmatrix.my.id';
    const canonicalBase = 'https://hrmatrix.my.id';

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${canonicalBase}${location.pathname}`);

    // Shared social meta image requirement: /gambar/metatag.webp
    const sharedMetaImage = `${currentOrigin}/gambar/metatag.webp`;

    // Update Open Graph tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', `${currentOrigin}${location.pathname}`);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', sharedMetaImage);

    // Update Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', sharedMetaImage);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', `${currentOrigin}${location.pathname}`);

    // Dynamic JSON-LD Injection
    let structuredDataScript = document.getElementById('dynamic-json-ld');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      structuredDataScript.setAttribute('id', 'dynamic-json-ld');
      document.head.appendChild(structuredDataScript);
    }

    const creatorPersonSchema = {
      "@type": "Person",
      "@id": `${canonicalBase}/#creator`,
      "name": "Alvareza Hilka Pratama",
      "alternateName": ["Alvareza HP", "Hilka Pratama", "Alvareza Hilka"],
      "jobTitle": "Founder & Lead Software Architect",
      "description": "Pendiri, pencipta, dan arsitek pengembang sistem HRMatrix Indonesia (Aplikasi HRIS, Payroll, dan General Affair terpadu)",
      "nationality": {
        "@type": "Country",
        "name": "Indonesia"
      },
      "url": `${canonicalBase}/tentang`,
      "sameAs": [
        "https://github.com/alvarezahilka",
        "https://www.linkedin.com/in/alvareza-hilka-pratama"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "HRMatrix Indonesia",
        "url": canonicalBase
      }
    };

    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Beranda",
          "item": `${canonicalBase}/`
        },
        currentPath !== '/' ? {
          "@type": "ListItem",
          "position": 2,
          "name": seo.title.split('|')[0].trim(),
          "item": `${canonicalBase}${currentPath}`
        } : null
      ].filter(Boolean)
    };

    let additionalSchema = null;
    if (currentPath === '/faq') {
      additionalSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apakah HRMatrix gratis digunakan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, HRMatrix 100% gratis, berjalan offline (local-first) menggunakan teknologi PWA dan browser IndexedDB Anda."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara hitung PPh 21 TER di aplikasi ini?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sistem kami secara otomatis mendeteksi PTKP karyawan dan mencocokkannya dengan tabel TER (Kategori A, B, C) sesuai aturan pemerintah terbaru."
            }
          }
        ]
      };
    } else if (currentPath === '/ebook') {
      additionalSchema = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": "Panduan Praktis HR Indonesia",
        "author": {
          "@type": "Person",
          "name": "Alvareza Hilka Pratama"
        },
        "publisher": {
          "@type": "Organization",
          "name": "HRMatrix Indonesia"
        },
        "url": `${canonicalBase}${currentPath}`
      };
    } else if (currentPath === '/tentang' || currentPath === '/about') {
      additionalSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Tentang HRMatrix Indonesia",
        "description": "Profil sistem HRMatrix Indonesia yang dirancang dan diciptakan oleh Alvareza Hilka Pratama.",
        "creator": creatorPersonSchema,
        "mainEntity": creatorPersonSchema
      };
    }

    const schemasToInject = additionalSchema 
      ? [breadcrumbList, creatorPersonSchema, additionalSchema] 
      : [breadcrumbList, creatorPersonSchema];
    structuredDataScript.textContent = JSON.stringify(schemasToInject);
    structuredDataScript.textContent = JSON.stringify(schemasToInject);

    // Google Analytics (GA4) Page View Tracking on SPA route change
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', 'G-HS3VBZ330E', {
        page_title: seo.title,
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }

  }, [location.pathname]);

  return null;
};

