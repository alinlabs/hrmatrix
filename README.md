<div align="center">

# 🏢 HRMatrix Indonesia
### *Sistem Manajemen Sumber Daya Manusia (HRIS/HRMS), Penggajian (Payroll PPh 21 TER), Rekrutmen ATS, Legal Ketenagakerjaan & General Affairs (GA) Terpadu*

[![Versi](https://img.shields.io/badge/Versi-1.0.0-0A3273?style=for-the-badge&logo=semver&logoColor=white)](https://hrmatrix.my.id)
[![Platform](https://img.shields.io/badge/Arsitektur-Local--First%20PWA%20(IndexedDB)-06204C?style=for-the-badge&logo=pwa&logoColor=white)](https://hrmatrix.my.id)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

<p align="center">
  <b>Ekosistem HRIS, Payroll, Legal Affairs, dan General Affairs Mandiri untuk Bisnis, UMKM, dan Korporasi di Indonesia.</b><br/>
  <i>Tanpa Biaya Langganan Server • 100% Privasi Data Lokal di Perangkat • Kepatuhan PPh 21 TER, BPJS, UU Cipta Kerja & PP 35/2021</i>
</p>

**🌐 Situs Resmi:** [hrmatrix.my.id](https://hrmatrix.my.id) • [www.hrmatrix.my.id](https://www.hrmatrix.my.id) • [hrmatrix.vercel.app](https://hrmatrix.vercel.app)  
**🚀 Coba Mode Demo Instan:** [`/demo`](https://hrmatrix.my.id/demo) (`https://hrmatrix.my.id/demo` atau `https://hrmatrix.vercel.app/demo`)

</div>

---

## 💬 Sapaan Hangat dari Pencipta & Pengembang

> *"Halo Rekan-rekan Pemimpin Bisnis, Praktisi HR & GA, dan Pengembang di Indonesia,*
>
> *Perkenalkan, saya **Alvareza Hilka Pratama**, pencipta, arsitek sistem, dan pengembang **HRMatrix Indonesia**.*
>
> *HRMatrix lahir dari kepedulian nyata terhadap tantangan banyak UMKM maupun perusahaan berkembang di tanah air yang sering terbebani biaya langganan software HR per kepala karyawan serta kekhawatiran privasi saat mengunggah data sensitif penggajian ke server pihak ketiga.*
>
> *Karena itu, HRMatrix dirancang dengan filosofi **Arsitektur Local-First PWA (Offline-First Local Architecture)**. Mulai dari pengelolaan data induk karyawan, absensi GPS/QR mandiri, roster shift, evaluasi KPI, penggajian otomatis PPh 21 TER & BPJS, ATS rekrutmen & psikotes online, pembuatan kontrak kerja 15 pasal & SK resmi, hingga manajemen aset dan fasilitas General Affairs (GA)—**semuanya berjalan cepat, presisi standar retina saat pratinjau/cetak PDF, mendukung mode offline penuh, serta menyimpan seluruh data 100% di browser perangkat Anda sendiri**.*
>
> *Semoga HRMatrix menjadi mitra tepercaya dalam menumbuhkan tata kelola SDM yang tertib, adil, dan modern di Indonesia."*
>
> — **Alvareza Hilka Pratama**  
> *Founder, Creator & Lead Software Architect — HRMatrix Indonesia*

---

## 🌟 Nilai Inti & Keunggulan Arsitektur

| Keunggulan | Penjelasan Fungsional & Teknis |
| :--- | :--- |
| 🔒 **Privasi Mutlak (100% Data Lokal)** | Seluruh data induk karyawan, presensi, dokumen kontrak, penilaian KPI, nominal gaji, hingga inventaris kantor disimpan di basis data lokal browser (*IndexedDB* via Dexie.js 4). Tidak ada transmisi data gaji ke server luar. |
| 💸 **Bebas Biaya Langganan (Zero Cost)** | Tanpa biaya server bulanan, tanpa batas jumlah karyawan (*unlimited headcounts*), dan seluruh modul dapat diaktifkan atau dinonaktifkan sesuai kebutuhan perusahaan. |
| ⚡ **Offline-Ready & Dual PWA Installable** | Menggunakan custom Service Worker (`vite-plugin-pwa` + Workbox) dengan dukungan navigasi SPA offline penuh, serta tersedia dua manifest PWA: aplikasi utama (`/manifest.json`) dan portal absensi mandiri (`/manifest-presensi.json`). |
| 🖨️ **Pratinjau & Cetak PDF Standar Retina** | Mesin `UnifiedPdfPreviewViewer` memadukan `jsPDF` dan `pdfjs-dist` dengan resolusi Retina (`2x–3x DPR`), scroll vertikal kontinu yang bersih, kontrol zoom terpusat di header modal, serta akurasi tata letak **100% identik** antara tampilan layar dan hasil cetak PDF. |
| ⚖️ **Kepatuhan Regulasi & Pajak Resmi RI** | Kalkulasi resmi **PPh 21 skema TER** (Kategori A, B, C sesuai PP 58/2023 & PMK 168/2023 + Pasal 17), BPJS Kesehatan (1% / 4%) & Ketenagakerjaan (JKK, JKM, JHT, JP), lembur & kontrak kerja sesuai UU Cipta Kerja & PP 35/2021. |
| 💾 **Portabilitas Penuh (Backup JSON)** | Ekspor dan impor seluruh database ke berkas `.json` portabel kapan saja melalui menu Database Manager, lengkap dengan Mode Demo Instan terintegrasi melalui tautan tunggal `/demo`. |

---

## 🚀 Akses Mode Demo Instan (`/demo`)

HRMatrix menyediakan **satu tautan resmi Mode Demo**:
- `https://hrmatrix.my.id/demo`
- `https://www.hrmatrix.my.id/demo`
- `https://hrmatrix.vercel.app/demo`

Saat URL `/demo` dibuka, sistem secara otomatis menutup popup sambutan, mengisi seluruh basis data demo yang tersinkronisasi penuh ke IndexedDB, lalu mengarahkan pengguna langsung ke **Dashboard (`/`)**:
1. **Profil Pimpinan & Tim Demo**: Memuat struktur perusahaan dan daftar karyawan dengan **Alvareza Hilka Pratama, S.M., M.M.** (*HR Operations*) selalu berada pada urutan pertama.
2. **Sinkronisasi Jobdesk 1-to-1**: Setiap jabatan karyawan pada data demo otomatis memiliki dokumen Job Description & KPI yang sesuai dengan pustaka jabatan HRMatrix.
3. **Riwayat 6 Bulan Terintegrasi**: Data **6 periode Payroll** dan **6 periode KPI** ke belakang telah disinkronkan secara konsisten dengan catatan presensi, jadwal shift, lembur, serta cuti karyawan, ditambah data awal modul General Affairs.

---

## 🧩 Ekosistem Lengkap Modul Fungsional

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                            EKOSISTEM TERPADU HRMATRIX                             │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│  CORE & HRIS     │  TIME & PERF     │  REKRUTMEN ATS   │  LEGAL & REGULASI        │
├──────────────────┼──────────────────┼──────────────────┼──────────────────────────┤
│ • Dashboard (/)  │ • Presensi       │ • Screening ATS  │ • Kontrak Kerja 15 Pasal │
│ • Mode Demo      │ • My Presensi    │ • Assessment Hub │ • Surat & SK Resmi PDF   │
│ • Karyawan       │ • Jadwal & Shift │ • Bank Soal Tes  │ • Peraturan Perusahaan   │
│ • Jobdesk 50 Sek │ • Manajemen Cuti │ • Evaluasi Kand. │ • UU Ketenagakerjaan     │
│                  │ • KPI 6+ Periode │ • 9 Check Tools  │ • Referensi Standar ISO  │
├──────────────────┴──────────────────┴──────────────────┴──────────────────────────┤
│  PAYROLL & PAJAK     │  GENERAL AFFAIRS (GA)     │  LAPORAN, PORTAL & SISTEM      │
├──────────────────────┼───────────────────────────┼────────────────────────────────┤
│ • Siklus Payroll     │ • Overview GA             │ • Laporan Analitik (/reports)  │
│ • Tunjangan & Potong │ • Inventaris Aset & SKU   │ • 14 e-Portal Pemerintah HR/GA │
│ • BPJS Kes & TK      │ • Stok ATK/Pantry & PR    │ • Pengaturan Akun & Modul      │
│ • PPh 21 TER PP58/23 │ • Ruangan, Servis & Tiket │ • Database JSON Backup/Restore │
│ • Slip Gaji Retina   │ • Vendor, Izin SLF/PBG/OSS│ • EBook 12 Bab, FAQ & Tentang  │
│                      │ • Buku Tamu & Log Surat   │                                │
└──────────────────────┴───────────────────────────┴────────────────────────────────┘
```

### 1. Inti Sistem, Onboarding & Dashboard Eksekutif
- **Dashboard Eksekutif (`/`)**: Ringkasan statistik real-time meliputi total karyawan aktif, komposisi departemen/status kerja/gender, metrik absensi harian, alokasi anggaran payroll, tren KPI, pengingat masa kontrak berakhir, dan akses cepat modul.
- **Mode Demo Tunggal (`/demo`)**: Pembuat data sampel lengkap lintas 6 periode dan pengalihan otomatis ke Dashboard.
- **Pendaftaran Perusahaan (`/daftar`)**: Wizard penyiapan identitas entitas, struktur departemen, dan koordinat kantor (GPS). Modal sambutan awal dirancang bersih dan dapat ditutup langsung lewat tombol `X` di pojok kanan atas atau klik area luar modal.

### 2. Data Induk Karyawan & Kamus Jobdesk (`50` Sektor Industri)
- **Daftar Karyawan (`/employees`)**: Formulir multi-tab mencakup biodata, alamat wilayah Indonesia terintegrasi, rekening bank, jabatan, status kerja (PKWTT/PKWT/Magang/Freelance), PTKP, BPJS Kesehatan & Ketenagakerjaan, unggah arsip dokumen, serta **QR Code unik presensi mandiri**.
- **Kamus Job Description (`/job-desk`)**: Katalog struktur jabatan, tanggung jawab utama, kualifikasi terstruktur, kompetensi, dan KPI per posisi yang mencakup **50 sektor industri** di Indonesia (Perkantoran, Teknologi, Telekomunikasi, Kreatif, Manufaktur, F&B, Konstruksi, Kesehatan, Farmasi, Logistik, Perbankan, Energi, Pertambangan, Ritel, E-Commerce, Maritim, Pemerintahan, dan lainnya).

### 3. Presensi, My Presensi Mandiri, Jadwal Shift & Cuti
- **Presensi Harian & Rekapitulasi (`/presensi`)**: Tab **Daily** (`?tab=daily`) dan **Rekap** (`?tab=rekap`) dengan penghitungan jam kerja efektif, toleransi keterlambatan (*grace period*), pulang cepat, dan ketidakhadiran.
- **My Presensi Karyawan Mandiri (`/my-presensi`)**: Portal khusus absensi karyawan (*installable PWA* terpisah via `/manifest-presensi.json`) yang mendukung validasi **radius GPS kantor**, pemindaian **QR Code dinamis** (`html5-qrcode`), dan pengambilan foto selfie.
- **Jadwal, Matriks Shift & Lembur (`/jadwal`)**: Kalender kerja & matriks multi-shift (`?tab=kalender`), pengajuan tukar shift (`?tab=tukar-shift`), serta pencatatan dan kalkulasi upah lembur resmi (`?tab=lembur`).
- **Manajemen Cuti & Izin (`/cuti`)**: Pemantauan saldo kuota cuti tahunan (`?tab=saldo`), pengajuan serta persetujuan cuti/sakit/izin (`?tab=pengajuan`), dan konfigurasi kebijakan cuti perusahaan (`?tab=kebijakan`).

### 4. KPI & Manajemen Kinerja
- **Laporan & Evaluasi KPI (`/kpi`)**: Pengelolaan periode penilaian kinerja (mendukung 6+ periode historis), pembobotan indikator individu & departemen, kalkulator skor otomatis, serta konfigurasi bobot/skala (`?view=config`).
- **Katalog KPI Umum (`/kpi/katalog-umum`)**: Pustaka template indikator KPI siap pakai lintas departemen lengkap dengan satuan dan rumus pengukuran.

### 5. Payroll, Tunjangan, BPJS & Pajak PPh 21 TER
- **Periode & Detail Payroll (`/payroll`, `/payroll/:id`, `/payroll/:id/employees`)**: Proses penggajian bulanan terhubung otomatis dengan absensi, lembur, keterlambatan, tunjangan, iuran BPJS, potongan pajak, dan skor KPI, serta pencetakan **Slip Gaji PDF standar Retina** individual maupun massal.
- **Tunjangan & Komponen Upah (`/payroll/tunjangan`)**: Konfigurasi gaji pokok, tunjangan tetap/variabel, THR, bonus kinerja, dan potongan.
- **BPJS Kesehatan & Ketenagakerjaan (`/payroll/bpjs`)**: Simulasi dan rincian tarif iuran resmi BPJS Kesehatan (1% / 4%) serta 4 program BPJS TK (JKK, JKM, JHT, JP).
- **Pajak PPh 21 TER (`/payroll/pajak`)**: Kalkulator dan ketentuan tarif PPh 21 skema **Tarif Efektif Rata-Rata (TER)** Kategori A, B, dan C sesuai PP 58/2023 & PMK 168/2023 serta perhitungan akhir tahun Pasal 17.

### 6. Rekrutmen ATS, Assessment Psikometri & Checking Tools
- **Screening & Lowongan ATS (`/screening`, `/lowongan`)**: Manajemen lowongan kerja, pipeline pelamar, dan **client-side PDF CV parser** untuk mengekstrak biodata dan riwayat kandidat langsung di browser.
- **Assessment Hub & Bank Soal (`/assessment`, `/assessment/bank-soal`)**: Paket soal terkurasi dan bank soal tes online dengan penskoran otomatis mencakup **Psikotes DISC, Tes Penalaran Kognitif (TPA), Situational Judgement Test (SJT), dan Tes Bahasa Inggris Bisnis**.
- **Evaluasi Kandidat (`/candidate`)**: Scorecard wawancara, rekapitulasi skor tes, hingga keputusan rekrutmen (*hiring decision*).
- **Checking Tools Latar Belakang (9 Portal Resmi Indonesia)**:
  - *Akademik & Profesi:* PDDikti Kemdiktisaintek, NISN Kemdikbud, Sertifikasi BNSP.
  - *Finansial & Kredit:* SLIK OJK (`iDebKu`).
  - *Identitas & Pajak:* Cek KTP Dukcapil Kemendagri, Cek NPWP DJP.
  - *Integritas Hukum & Profesi:* SKCK Online Polri, SIPP Mahkamah Agung, STR/SIP SatuSehat Kemenkes.

### 7. Legal Affairs, Dokumen Kontrak 15 Pasal & Regulasi Interaktif
- **Generator Kontrak Kerja (`/kontrak`)**: Pembuatan dan pratinjau PDF Retina Perjanjian Kerja **PKWT, PKWTT, Magang, dan Freelance/Konsultan** dengan struktur **15 Pasal Hukum** yang panjang, detail, dan spesifik sesuai UU Cipta Kerja & PP No. 35 Tahun 2021.
- **Generator Surat & SK Resmi (`/surat`)**: Pembuatan SK Pengangkatan, Promosi, Mutasi, Demosi, Surat Peringatan (SP1–SP3), Paklaring, Surat Tugas, dan Undangan Resmi siap cetak PDF.
- **Regulasi Berbasis Modal Bersih**:
  - **Peraturan Perusahaan (`/legal/peraturan-perusahaan`)**
  - **Undang-Undang Ketenagakerjaan (`/legal/undang-undang`)**
  - **Referensi Standar ISO (`/legal/standar-iso`)** — ISO 9001, ISO 27001, ISO 45001, ISO 30414, dll.  
  *Seluruh daftar regulasi menggunakan tampilan kartu minimalis berbasis pasal yang membuka modal detail interaktif saat diklik.*

### 8. General Affairs (GA) & Manajemen Fasilitas Kantor
- **Overview GA (`/ga`)**: Dashboard ringkas operasional kantor non-SDM (aset, stok, fasilitas, izin, tamu & ekspedisi).
- **Inventaris & Aset Kantor (`/ga/aset`)**: Registrasi aset perusahaan, pembuatan kode SKU/barcode, pelacakan kondisi, nilai perolehan & depresiasi, serta penanggung jawab aset.
- **Pengadaan & Stok ATK/Pantry (`/ga/atk`)**: Katalog kartu stok (`?tab=stok`) dan alur pengajuan pembelian / *Purchase Requisition* (`?tab=pengadaan`).
- **Fasilitas & Servis Gedung (`/ga/fasilitas`)**: Jadwal pemakaian ruang rapat (`?tab=ruangan`), penjadwalan servis preventif (`?tab=servis`), dan tiket keluhan kerusakan (`?tab=kerusakan`).
- **Vendor & Perizinan (`/ga/vendor`)**: Direktori rekanan vendor (`?tab=vendor`) serta pelacakan masa berlaku izin legalitas gedung & usaha seperti SLF, PBG, OSS, dan dokumen lingkungan (`?tab=izin`).
- **Buku Tamu & Log Surat (`/ga/buku-tamu`)**: Resepsionis digital tamu & paket kurir (`?tab=tamu`) dan agenda ekspedisi surat masuk/keluar (`?tab=surat`).

### 9. Laporan Analitik & 14 e-Portal Pelaporan Pemerintah
- **Laporan Eksekutif (`/reports`)**: Rekapitulasi komprehensif SDM, kehadiran, KPI, dan penggajian siap ekspor PDF/CSV.
- **e-Portal Pelaporan Resmi (14 Portal Terkurasi)**:
  - **9 e-Portal HR:** Kemenaker (WLKP), BPJSTK (SIPP), EDABU (BPJS Kes), DJP Online Pajak, E-PP & PKB, Teman K3 (P2K3), TKA Online (RPTKA), Karirhub (SIAPkerja), PPHI (Hubungan Industrial).
  - **5 e-Portal GA:** OSS RBA (LKPM), SIMPEL KLHK, Festronik (Limbah B3), SIMBG PUPR (PBG/SLF), Pajak Daerah (Bapenda).

### 10. Pengaturan Sistem, Kontrol Modul & Database Manager
- **Pengaturan Akun (`/settings?tab=akun`)**: Profil perusahaan, jam kerja, dan konfigurasi pengelola.
- **Manajemen Modul & e-Portal (`/settings?tab=modul`)**: Aktivasi/nonaktif modul opsional (*Rekrutmen & ATS*, *General Affairs*, serta masing-masing e-Portal di sidebar).
- **Database Manager (`/settings?tab=database`)**: Ekspor/impor backup `.json`, muat data demo, dan reset data lokal IndexedDB.

### 11. Edukasi, Bantuan & Identitas Sistem
- **E-Book HRMatrix (`/ebook`)**: Panduan praktis multi-bab seputar HRIS, administrasi kepegawaian, payroll PPh 21 TER, KPI, dan regulasi Indonesia.
- **FAQ & Bantuan (`/faq`)**: Tanya jawab terstruktur seputar fitur, keamanan data lokal, pajak/BPJS, dan PWA offline.
- **Navigasi Cepat (`/navigasi-cepat`)**: Peta direktori seluruh halaman sistem.
- **Tentang HRMatrix (`/tentang`)**: Visi sistem, profil **Alvareza Hilka Pratama**, serta dokumentasi arsitektur privasi lokal.

---

## 🛠️ Kerangka Arsitektur & Teknologi

| Lapisan | Teknologi & Pustaka |
| :--- | :--- |
| **Core UI & Language** | [React 19.3](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) + [React Router 7](https://reactrouter.com/) |
| **Styling & Design System** | [Tailwind CSS v4.3](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Local Database** | [Dexie.js 4.4](https://dexie.org/) + `dexie-react-hooks` (IndexedDB Browser Storage) |
| **PDF Engine (Retina)** | [jsPDF 4.2](https://github.com/parallax/jsPDF) + `jspdf-autotable` (Generator) & [pdfjs-dist 6.5](https://mozilla.github.io/pdf.js/) (Retina Preview & CV Parser) |
| **PWA & Offline Engine** | [vite-plugin-pwa 2.0](https://vite-pwa-org.netlify.app/) (`injectManifest`, Workbox custom `src/sw.ts`, offline SPA `NavigationRoute`) |
| **Charts, QR & Utilities** | [Recharts 3](https://recharts.org/), `html5-qrcode`, `qrcode.react`, `qr-code-styling`, `papaparse`, `date-fns` |
| **Motion & Icons** | [Motion 12](https://motion.dev/), [Lottie React 3](https://github.com/Gamote/lottie-react), [Lucide React](https://lucide.dev/) |
| **Build Tool & Hosting** | [Vite 6.4](https://vite.dev/) (`es2022`) & Konfigurasi Produksi Vercel (`vercel.json`, region `sin1`) |

---

## ⚙️ Panduan Pengembangan, Build & Deployment Vercel

### Persyaratan Sistem
- **Node.js**: Versi `>= 18.0.0` (direkomendasikan Node 20/22)
- **npm** atau **bun**

### 1. Instalasi & Pengembangan Lokal
```bash
# Klon repositori proyek
git clone <url-repositori>
cd hrmatrix-indonesia

# Pasang seluruh dependensi
npm install

# Jalankan Vite dev server pada port 3000
npm run dev
```
Aplikasi dapat diakses melalui `http://localhost:3000` (atau `http://localhost:3000/demo` untuk langsung memuat data demo).

### 2. Pemeriksaan Tipe, Build Produksi & Preview
```bash
# Validasi TypeScript tanpa emit
npm run lint

# Kompilasi aplikasi produksi (Vite + Service Worker PWA + Pdf Worker)
npm run build

# Pratinjau hasil build produksi secara lokal
npm run preview
```
Seluruh hasil kompilasi produksi statis disimpan ke direktori **`dist/`** (termasuk `dist/sw.js`, `dist/registerSW.js`, worker `pdf.worker.min-*.mjs`, serta file crawler statis).

### 3. Konfigurasi Deployment Vercel & SEO / AI Crawler Discovery
Proyek telah dikonfigurasi penuh melalui `vercel.json` dan `vite.config.ts` untuk deployment instan ke Vercel dengan dukungan multi-domain:
- **Domain Bawaan Vercel:** `https://hrmatrix.vercel.app`
- **Domain Kustom Resmi:** `https://hrmatrix.my.id` & `https://www.hrmatrix.my.id` (konsolidasi kanonikal `<link rel="canonical">` ke `https://hrmatrix.my.id`).
- **Routing SPA & Header Cache:** `vercel.json` mengatur rewrites SPA ke `/index.html` (kecuali aset statis & endpoint XML/TXT), cache immutable 1 tahun untuk `/assets/*`, serta revalidasi instan (`max-age=0, must-revalidate`) untuk `index.html`, `sw.js`, `registerSW.js`, dan file manifest PWA.
- **Metadata Mesin Pencari & AI Crawler:**
  - `index.html`: Dilengkapi tag Dublin Core, metadata OpenGraph/Twitter, Schema.org JSON-LD (`Person`, `WebSite`, `Organization`, `SoftwareApplication`, `ItemList`), dan fallback konten `<noscript>` komprehensif.
  - `/sitemap.xml`: Peta seluruh URL rute aplikasi HRMatrix.
  - `/robots.txt`: Panduan akses perayap mesin pencari & agen AI ke seluruh halaman publik dan `sitemap.xml`.
  - `/llms.txt`: Spesifikasi teknis terstruktur berformat Markdown untuk pembacaan oleh asisten AI dan LLM.

---

## 🗺️ Dokumentasi Struktur Berkas
Untuk melihat pemetaan direktori dan berkas kode lebih lanjut, silakan merujuk ke:
👉 **[`STRUKTUR.md`](STRUKTUR.md)**

---

## 🤝 Konsultasi, Kustomisasi & Dukungan Pengembang

Apabila perusahaan Anda membutuhkan kustomisasi modul, integrasi mesin absensi (*fingerprint/RFID/face recognition*), atau sinkronisasi database server internal kantor, silakan hubungi langsung pencipta & pengembang utama:

* **Nama Pengembang:** Alvareza Hilka Pratama
* **Email Developer:** [`alvareza.work@gmail.com`](mailto:alvareza.work@gmail.com)
* **Email Resmi HRMatrix:** [`hrmatrix.id@gmail.com`](mailto:hrmatrix.id@gmail.com)

---

<div align="center">
  <p>© 2026 HRMatrix Indonesia — Diciptakan & Dikembangkan oleh <b>Alvareza Hilka Pratama</b>.</p>
</div>
