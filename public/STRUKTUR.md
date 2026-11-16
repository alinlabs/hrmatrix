# 🗺️ Struktur Direktori & Berkas — HRMatrix Indonesia
> **Versi Proyek:** 1.0.0 • **Lingkungan:** React 19 + TypeScript + Vite + Tailwind CSS + Dexie (IndexedDB)

Dokumen ini menyajikan peta arsitektur dan hierarki berkas menyeluruh pada proyek sistem HRMatrix, dilengkapi penjelasan fungsi ringkas untuk setiap direktori, modul, dan berkas utama.

---

## 🌳 Pohon Direktori Utama

```text
├── public/                       # Berkas statis publik yang disajikan langsung oleh web server
│   ├── assets/animations/        # Animasi Lottie JSON untuk status kosong/ilustrasi
│   ├── gambar/                   # Aset gambar, banner, ikon PWA & favicon (.webp, .png)
│   ├── pedoman/                  # Spesifikasi teknis UI/UX dan pedoman arsitektur sistem
│   ├── README.md                 # Dokumentasi profil utama sistem HRMatrix Indonesia
│   ├── STRUKTUR.md               # Peta struktur direktori & berkas lengkap (berkas ini)
│   ├── manifest.json             # Konfigurasi Progressive Web App (PWA)
│   ├── manifest-presensi.json    # Konfigurasi PWA khusus aplikasi My Presensi
│   ├── sw.js                     # Service Worker untuk dukungan offline-ready
│   └── icon.svg & icon-3people.svg # Ikon vector SVG identitas aplikasi
│
├── src/                          # Berkas sumber kode aplikasi (TypeScript & React)
│   ├── App.tsx                   # Komponen akar: router, error boundary, splash, layout
│   ├── main.tsx                  # Titik masuk utama aplikasi (entry-point React DOM)
│   ├── index.css                 # Konfigurasi gaya global & Tailwind CSS (@import "tailwindcss")
│   │
│   ├── assets/                   # Aset media internal (ikon animasi Lottie)
│   ├── components/               # Komponen UI modular yang dapat digunakan kembali
│   │   ├── company/              # Bottom sheet & pemilih profil entitas perusahaan
│   │   ├── layout/               # Header mobile, bottom navigation, overlay desktop
│   │   ├── payroll/              # Komponen pembantu visualisasi slip & aturan gaji
│   │   ├── pwa/                  # Indikator offline dan tombol install PWA
│   │   ├── splash/               # Animasi splashscreen pembuka aplikasi
│   │   └── ui/                   # Pustaka komponen UI dasar (Modal, Input, Card, Logo)
│   │
│   ├── context/                  # Penyedia status global (React Context)
│   │   ├── CompanyContext.tsx    # State entitas perusahaan & status pendaftaran aktif
│   │   └── MobileNavContext.tsx  # Kontrol dinamis judul header & tombol aksi atas
│   │
│   ├── data/                     # Basis data awal, master data HR, dan sample data generator
│   │   ├── jobs/                 # Kamus puluhan job deskripsi berdasarkan sektor industri
│   │   ├── master/               # Master tarif PPh 21 TER, BPJS, jenis karyawan, tunjangan
│   │   └── sampleDb/             # Generator data demo (karyawan, absensi, KPI, payroll)
│   │
│   ├── db/                       # Konfigurasi basis data lokal browser
│   │   └── database.ts           # Definisi tabel IndexedDB via Dexie.js (19+ tabel)
│   │
│   ├── hooks/                    # Kumpulan custom React hooks
│   │   ├── useCompanySetup.ts    # Verifikasi status setup profil organisasi
│   │   ├── useMediaQuery.ts      # Deteksi ukuran viewport layar (responsif)
│   │   ├── usePWAInstall.ts      # Penangan event prompt instalasi aplikasi PWA
│   │   ├── useScrollLock.ts      # Kunci scroll layar saat modal terbuka
│   │   └── useWilayah.ts         # Integrasi data wilayah administratif Indonesia
│   │
│   ├── pages/                    # Komponen tampilan halaman aplikasi sesuai rute navigasi
│   │   ├── attendance/           # Modul presensi, roster shift kerja, dan cuti karyawan
│   │   ├── daftar/               # Wizard setup pendaftaran awal perusahaan
│   │   ├── dashboard/            # Beranda ringkasan statistik metrik utama HR
│   │   ├── database/             # Pengelola backup/restore file JSON & reset data
│   │   ├── ebook/                # EBook HRMatrix interaktif (12 Bab pedoman praktis)
│   │   ├── employees/            # Manajemen data induk karyawan lengkap (KTP, BPJS, Pajak)
│   │   ├── faq/                  # Pusat bantuan, tanya jawab (FAQ), & kontak developer
│   │   ├── job-desk/             # Eksplorasi katalog kompetensi & struktur jabatan
│   │   ├── kompensasi/           # Aturan tunjangan, skema BPJS, & ketentuan PPh 21
│   │   ├── kpi/                  # Penilaian kinerja karyawan, bobot, & scoring otomatis
│   │   ├── lowongan/             # Modul ATS rekrutmen & parser berkas resume PDF
│   │   ├── navigasi-cepat/       # Direktori pintasan cepat ke seluruh fitur sistem
│   │   ├── payroll/              # Kalkulasi penggajian bulanan & penerbitan slip gaji
│   │   ├── reports/              # Laporan rekapitulasi penggajian & ekspor dokumen
│   │   ├── settings/             # Pengaturan profil perusahaan & kontak kustomisasi
│   │   └── tentang/              # Visi sistem, privasi, kontak pengembang, & donasi BTN
│   │
│   ├── services/                 # Logika bisnis & mesin kalkulasi modular
│   │   ├── allowanceDataService.ts     # Pengelolaan alokasi tunjangan karyawan
│   │   ├── attendanceCalculator.ts    # Kalkulator keterlambatan & jam kerja efektif
│   │   ├── attendanceConfigService.ts # Konfigurasi jam masuk/pulang & toleransi
│   │   ├── kpiService.ts              # Logika kalkulasi skor bobot KPI bulanan
│   │   ├── leaveService.ts            # Validasi kuota & pengajuan cuti
│   │   ├── payrollCalculator.ts       # Mesin hitung gaji bersih, BPJS, & PPh 21 TER
│   │   ├── positionService.ts         # Hirarki posisi & departemen organisasi
│   │   ├── rosterService.ts           # Penjadwalan matriks shift & tukar shift
│   │   ├── shiftService.ts            # CRUD master jam kerja shift
│   │   ├── taxBpjsService.ts          # Perhitungan iuran BPJS & tarif TER pajak
│   │   └── tunjanganJabatanService.ts # Pemetaan tunjangan otomatis per jabatan
│   │
│   ├── types/                    # Definisi tipe & antarmuka global TypeScript
│   │   └── index.ts              # Skema data karyawan, payroll, shift, KPI, dll.
│   │
│   └── utils/                    # Utilitas pembantu umum
│       ├── allowanceCalculator.ts       # Perhitungan rincian tunjangan tetap & tidak tetap
│       ├── allowanceClassification.ts   # Klasifikasi tunjangan sesuai UU Cipta Kerja
│       ├── cn.ts                        # Helper tailwind-merge dan clsx
│       ├── lateDeductionCalculator.ts   # Skema potongan keterlambatan berjenjang
│       ├── lazyWithRetry.ts             # Lazy loading komponen dengan auto-retry
│       ├── pdfGenerator.ts              # Generator unduhan slip gaji PDF via jsPDF
│       ├── pdf-parser.ts                # Ekstraksi teks berkas PDF untuk ATS CV
│       ├── polyfills.ts                 # Dukungan kompatibilitas browser lawas
│       ├── sampleDataGenerator.ts       # Pembuat data dummy siap uji
│       └── useDropdownPlacement.ts      # Penempatan posisi dropdown/popover
│
├── package.json                  # Dependensi, pustaka eksternal, dan skrip npm
├── tsconfig.json                 # Konfigurasi compiler TypeScript
├── vite.config.ts                # Konfigurasi bundler Vite dan integrasi PWA
└── metadata.json                 # Metadata nama & kapabilitas aplikasi
```

---

## 📂 Rincian Fungsi Direktori Utama

### 1. `/src/db/` (Basis Data Lokal Browser)
Menangani persistensi data aplikasi menggunakan **IndexedDB** yang dikelola melalui pustaka **Dexie.js**.
- `database.ts`: Mendefinisikan kelas `HRMatrixDB` dengan lebih dari 19 tabel relasional lokal, meliputi:
  - `companies`: Data profil entitas perusahaan.
  - `employees`: Data induk karyawan lengkap (personal, alamat, bank, BPJS, pajak).
  - `attendance`: Log presensi harian (jam masuk, jam pulang, durasi kerja, status).
  - `shifts`: Konfigurasi jam shift (Pagi, Siang, Malam, Normal).
  - `rosterSchedule`: Penugasan jadwal shift karyawan per tanggal kalender.
  - `leaveRequests` & `leaveBalances`: Data pengajuan cuti dan saldo cuti tahunan.
  - `payrolls`: Arsip penggajian bulanan karyawan beserta rincian potongan.
  - `kpiPeriods` & `kpiEmployeeScores`: Evaluasi target kerja dan skor pencapaian.
  - `jobVacancies` & `candidates`: Data lowongan dan pelamar pada modul rekrutmen.

---

### 2. `/src/services/` (Mesin Kalkulasi & Logika Bisnis)
Memisahkan logika perhitungan kompleks dari komponen visual untuk menjamin kepatuhan regulasi dan akurasi data:
- `payrollCalculator.ts`: Menghitung gaji kotor, iuran BPJS Kesehatan (1% karyawan, 4% perusahaan), BPJS Ketenagakerjaan (JKK, JKM, JHT, JP), pemotongan PPh 21 dengan skema Tarif Efektif Rata-Rata (TER) Kategori A/B/C, upah lembur resmi Depnaker, serta potongan keterlambatan.
- `attendanceCalculator.ts`: Mengkalkulasi selisih menit keterlambatan terhadap batas toleransi (*grace period*), jam kerja riil, dan status ketepatan waktu.
- `kpiService.ts`: Menghitung nilai terbobot indikator kinerja individu dan departemen.
- `rosterService.ts`: Mengelola matriks pertukaran shift (*shift swap*) dan pola jadwal kerja bergilir.

---

### 3. `/src/pages/` (Rute & Modul Layanan)
Setiap folder di dalam `pages` mewakili modul fungsional lengkap:
| Direktori Halaman | Deskripsi Fungsional |
| :--- | :--- |
| `dashboard/` | Statistik ringkasan karyawan aktif, absensi hari ini, pengingat kontrak kerja, dan pintasan tindakan cepat. |
| `employees/` | Formulir data karyawan berbilah (*tabbed form*): Informasi Pribadi, Alamat, Kepegawaian, Gaji Pokok, Rekening Bank, Profil Pajak PTKP, BPJS, dan Unggah Dokumen. |
| `attendance/` | Pengelolaan presensi harian, kalender roster shift, perizinan cuti/sakit/izin, dan rekapitulasi kehadiran bulanan. |
| `payroll/` | Pembuatan periode penggajian, penyesuaian gaji manual (*bonus/potongan*), verifikasi batch, dan pratinjau/cetak slip gaji resmi. |
| `kompensasi/` | Konfigurasi komponen tunjangan tetap/variabel, batas upah BPJS, dan penyesuaian regulasi pajak. |
| `kpi/` | Pengaturan periode evaluasi KPI, input realisasi target kerja, asisten penilaian skor otomatis, dan katalog indikator standar. |
| `job-desk/` | Pustaka deskripsi jabatan mencakup 24+ sektor industri di Indonesia (tujuan jabatan, tanggung jawab, kualifikasi, KPI bawaan). |
| `lowongan/` | Modul pelacak pelamar (ATS) lokal dengan fitur unggah resume PDF dan ekstraksi otomatis data kontak & pengalaman. |
| `ebook/` | Buku panduan digital interaktif 12 Bab yang mengulas tuntas arsitektur sistem, regulasi ketenagakerjaan, rumus payroll, dan glosarium HR. |
| `database/` | Manajemen data lokal: ekspor cadangan (.json), impor pemulihan (.json), pembuatan data sampel uji, dan pembersihan database. |
| `reports/` | Laporan analitik penggajian bulanan, slip gaji massal, dan rekapitulasi data siap ekspor. |
| `settings/` | Pengaturan identitas perusahaan (logo, alamat, kontak) dan kartu penawaran kustomisasi pengembangan lanjutan. |
| `tentang/` | Visi arsitektur mandiri, pilar fungsional, tombol kontak langsung developer (Email/WA), serta kartu apresiasi/donasi Bank BTN. |
| `faq/` | Tanya jawab seputar penggunaan fitur, rumus gaji, pemecahan masalah teknis, dan tautan bantuan. |

---

### 4. `/src/components/ui/` (Komponen Antarmuka)
Komponen UI terstandarisasi dengan aksesibilitas tinggi dan gaya Tailwind CSS:
- `BtnDonationCard.tsx`: Kartu rekening apresiasi Bank BTN dengan tampilan visual menyerupai kartu ATM debit asli (gradasi navy-gold, chip EMV, dan tombol salin nomor rekening instan).
- `ContactDeveloperSection.tsx`: Tombol kontak langsung 1-baris menghubungkan ke aplikasi Email (Gmail) dan WhatsApp resmi developer.
- `CustomDevInquirySection.tsx`: Kartu penawaran enterprise di halaman pengaturan untuk kebutuhan kustomisasi sistem khusus perusahaan.
- `Modal.tsx` & `BaseModal.tsx`: Dialog modal responsif dengan animasi pegas, penguncian scroll latar belakang, dan aksesibilitas ramah ponsel.
- `ComboboxInput.tsx`: Dropdown input dengan fungsi pencarian langsung (*searchable select*).
- `WilayahForm.tsx`: Pemilih bertingkat Provinsi, Kota/Kabupaten, Kecamatan, dan Kelurahan se-Indonesia.
- `EmployeeAvatar.tsx`: Avatar foto karyawan dengan fallback inisial nama bergradasi warna kontras.

---

### 5. `/public/` & PWA Assets
- Berkas statis yang di-*cache* oleh Service Worker (`sw.js`) untuk memastikan aplikasi tetap dapat dibuka dan berfungsi penuh secara **100% offline** tanpa memerlukan jaringan internet setelah instalasi pertama kali.

---
*Dokumen ini dirancang sebagai acuan pemeliharaan, audit arsitektur, dan pengembangan berkelanjutan sistem HRMatrix Indonesia.*
