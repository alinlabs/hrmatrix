<div align="center">

# 🏢 HRMatrix Indonesia
### *Sistem Manajemen Sumber Daya Manusia & Penggajian Mandiri (HRMS & Payroll)*

[![Versi](https://img.shields.io/badge/Versi-1.0.0-0A3273?style=for-the-badge&logo=semver&logoColor=white)](https://github.com)
[![Platform](https://img.shields.io/badge/Arsitektur-Offline--First%20(Local%20IndexedDB)-06204C?style=for-the-badge&logo=pwa&logoColor=white)](https://github.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

<p align="center">
  <b>Sistem HRMS & Penggajian (Payroll) Modern, Mandiri, dan Terintegrasi untuk Bisnis, UMKM, serta Korporasi di Indonesia.</b><br/>
  <i>Tanpa Biaya Berlangganan Server • Data 100% Milik Anda di Perangkat Sendiri • Kepatuhan Pajak PPh 21 TER & BPJS Resmi</i>
</p>

---

</div>

## 💬 Sapaan Hangat dari Pengembang

> *"Halo Rekan-rekan Pemimpin Bisnis, Praktisi HR, dan Pengembang di Indonesia,*
>
> *Perkenalkan, saya **Alvareza Hilka Pratama**, perancang dan pengembang sistem **HRMatrix Indonesia**.*
>
> *HRMatrix lahir dari sebuah kepedulian mendalam: betapa banyaknya UMKM dan organisasi di tanah air yang kesulitan mengelola personalia dan penggajian karena perangkat lunak HR komersial di pasaran umumnya mengenakan biaya langganan bulanan per kepala karyawan yang mahal, serta mewajibkan data sensitif gaji perusahaan diunggah ke server pihak ketiga.*
>
> *HRMatrix kami bangun dengan filosofi **Arsitektur Mandiri (Offline-First Local Architecture)**. Aplikasi ini memberikan kebebasan penuh kepada pemilik usaha untuk mencatat data karyawan, mengelola roster shift kerja bergilir, menilai KPI tim, hingga menghitung slip gaji bersih otomatis sesuai regulasi pajak PPh 21 TER dan iuran BPJS terbaru—**semuanya berjalan cepat, aman, dan tersimpan utuh di dalam browser perangkat Anda sendiri tanpa risiko kebocoran data**.*
>
> *Semoga HRMatrix dapat menjadi mitra terpercaya dalam menumbuhkan efisiensi tim kerja dan memajukan perekonomian Indonesia."*
>
> — **Alvareza Hilka Pratama**  
> *Developer & Creator of HRMatrix Indonesia*

---

## 🌟 Nilai Inti & Keunggulan Sistem

| Keunggulan | Penjelasan Fungsional |
| :--- | :--- |
| 🔒 **Privasi Mutlak (100% Data Lokal)** | Seluruh data induk karyawan, riwayat absensi, dan nominal gaji tersimpan di basis data lokal browser (*IndexedDB* via Dexie.js). Tidak ada pertukaran data gaji ke server luar. |
| 💸 **Bebas Biaya Langganan (Zero Cost)** | Tanpa biaya server bulanan, tanpa batasan jumlah karyawan (*unlimited headcounts*), dan tanpa biaya lisensi per modul. |
| ⚡ **Offline-Ready & PWA Installable** | Dapat diinstal layaknya aplikasi desktop (Windows/macOS) maupun aplikasi ponsel (Android/iOS) via Progressive Web App, dan dapat dijalankan tanpa koneksi internet. |
| ⚖️ **Kepatuhan Pajak & Ketenagakerjaan RI** | Mendukung perhitungan resmi tarif PPh 21 skema **TER (Tarif Efektif Rata-Rata)** Kategori A/B/C, iuran BPJS Kesehatan (1% karyawan, 4% perusahaan), dan 4 program BPJS Ketenagakerjaan (JKK, JKM, JHT, JP). |
| 💾 **Pencadangan Mandiri & Portabel** | Fitur ekspor dan impor basis data lengkap ke dalam satu berkas `.json` terenkripsi lokal kapan saja untuk disimpan di flashdisk atau cloud storage pribadi. |

---

## 🧩 Pilar Modul Fungsional

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        EKOSISTEM MODUL HRMATRIX                        │
├───────────────┬───────────────┬────────────────┬───────────────────────┤
│  PERSONALIA   │  OPERASIONAL  │  KOMPENSASI    │  STRATEGI & BAKAT     │
├───────────────┼───────────────┼────────────────┼───────────────────────┤
│ • Data Induk  │ • Absensi Jam │ • Payroll Bulanan│ • Evaluasi KPI      │
│ • Struktur Org│ • Roster Shift│ • PPh 21 TER   │ • Kamus Job Desk 24+  │
│ • Arsip KTP/KK│ • Cuti & Izin │ • Iuran BPJS   │ • ATS Rekrutmen & CV  │
│ • Riwayat Pos │ • Lembur Kerja│ • Slip Gaji PDF│ • EBook HR 12 Bab     │
└───────────────┴───────────────┴────────────────┴───────────────────────┘
```

### 1. Manajemen Karyawan & Personalia (`/employees`)
- Formulir berbilah intuitif: Data Diri, Alamat Domisili (Wilayah Indonesia terintegrasi), Rekening Bank, Status Kepegawaian, Gaji Pokok, NPWP/PTKP, Kepesertaan BPJS, serta Unggah Dokumen Karyawan.
- Filter pencarian instan berdasarkan departemen, jabatan, dan status kerja (Tetap, Kontrak/PKWT, Magang).

### 2. Presensi & Roster Shift Kerja (`/attendance`)
- Pencatatan absensi harian dengan toleransi keterlambatan (*grace period*) yang dapat disesuaikan.
- Matriks roster multi-shift (Pagi, Siang, Malam, Normal) beserta fitur pertukaran shift kerja (*shift swap*).
- Manajemen saldo kuota cuti tahunan dan persetujuan izin/sakit.

### 3. Penggajian & Otomasi Payroll (`/payroll`)
- Kalkulasi upah kotor, komponen tunjangan tetap dan variabel, upah lembur resmi Depnaker, serta potongan keterlambatan berjenjang.
- Perhitungan akurat iuran BPJS Kesehatan & Ketenagakerjaan serta potongan PPh 21 TER 2024/2026.
- Pratinjau slip gaji interaktif dan cetak slip gaji formal berformat PDF via pustaka `jsPDF`.

### 4. Penilaian Kinerja Karyawan / KPI (`/kpi`)
- Penyusunan periode penilaian berkala (bulanan/triwulanan) dengan pembobotan indikator target.
- Asisten penilaian otomatis (*scoring assistant*) dan katalog indikator kinerja standar per departemen.

### 5. Pustaka Job Deskripsi & Struktur Jabatan (`/job-desk`)
- Kamus kompetensi dan deskripsi jabatan mencakup **24+ sektor industri** di Indonesia (Teknologi, Manufaktur, Ritel, F&B, Logistik, Kesehatan, dsb.).

### 6. Rekrutmen & Pelacak Pelamar / ATS (`/lowongan`)
- Pembuatan lowongan pekerjaan internal dan penerimaan resume pelamar.
- Parser resume PDF berbasis klien (*client-side PDF extraction*) untuk membaca data profil, kontak telepon, dan riwayat pengalaman pelamar secara otomatis.

### 7. EBook HRMatrix Interaktif (`/ebook`)
- Modul edukasi komprehensif **12 Bab** membahas arsitektur HR, hubungan industrial, glosarium terminologi HR, hingga kompendium rumus perhitungan payroll dan pajak.

### 8. Database Manager Mandiri (`/database`)
- Fasilitas pencadangan (*backup*) penuh ke berkas JSON, pemulihan (*restore*), pembuat data sampel demo (*sample data generator*), dan pembersihan database.

---

## 🛠️ Kerangka Arsitektur & Teknologi

Sistem HRMatrix dibangun dengan arsitektur modern berstandar tinggi:

- **Bahasa & Compiler:** [TypeScript 5.8](https://www.typescriptlang.org/) — Menjamin integritas tipe data dan keandalan logika bisnis.
- **Pustaka Utama UI:** [React 19](https://react.dev/) dengan arsitektur komponen modular.
- **Desain & Gaya Antarmuka:** [Tailwind CSS v4](https://tailwindcss.com/) — Tampilan responsif, bersih, dan konsisten dari ponsel hingga layar desktop.
- **Basis Data Lokal:** [Dexie.js (IndexedDB)](https://dexie.com/) — Manajemen transaksi basis data NoSQL lokal di sisi browser klien.
- **Animasi & Interaksi:** [Motion](https://motion.dev/) & [Lottie React](https://github.com/Gamote/lottie-react) — Animasi status, modal dialog, dan kartu interaktif.
- **Ikonografi:** [Lucide React](https://lucide.dev/) — Set ikon SVG seragam dan ringan.
- **Penerbitan Dokumen:** [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) — Pembuatan slip gaji dan dokumen laporan PDF otomatis.
- **Kemampuan PWA:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — Service Worker offline caching dan web manifest.

---

## 🚀 Panduan Memulai & Menjalankan Aplikasi

### Persyaratan Sistem
- **Node.js**: Versi `>= 18.0.0`
- **npm** atau **bun**: Pengelola paket bawaan

### 1. Klon Repositori & Pasang Dependensi
```bash
# Clone repositori proyek
git clone <url-repositori>
cd hrmatrix-indonesia

# Pasang dependensi
npm install
```

### 2. Jalankan Server Pengembangan (Local Dev Server)
```bash
npm run dev
```
Buka peramban (browser) di alamat `http://localhost:3000`.

### 3. Kompilasi untuk Rilis Produksi
```bash
npm run build
```
Hasil berkas kompilasi statis yang siap diunggah ke hosting mana pun (seperti Vercel, Netlify, Cloud Run, atau Nginx) akan berada di direktori `dist/` dan `build/`.

### 4. Pemeriksaan Kode (Linter & Tipe)
```bash
npm run lint
```

---

## 🗺️ Dokumentasi Struktur Berkas
Untuk melihat pemetaan lengkap seluruh berkas kode, silakan merujuk ke dokumen:
👉 **[`STRUKTUR.md`](STRUKTUR.md)**

---

## 🤝 Konsultasi, Kustomisasi, & Dukungan

Apabila perusahaan Anda memerlukan kustomisasi alur kerja, integrasi mesin absensi (*fingerprint/RFID*), atau sinkronisasi database server kantor, silakan hubungi langsung pengembang kami:

* **Nama Pengembang:** Alvareza Hilka Pratama
* **Email Resmi:** [`alvareza.work@gmail.com`](mailto:alvareza.work@gmail.com)
* **WhatsApp Langsung:** [`+62 579-7184-059`](https://wa.me/625797184059)

### ☕ Apresiasi & Donasi Pengembangan Berkelanjutan
Aplikasi HRMatrix dapat digunakan secara mandiri tanpa biaya langganan. Jika sistem ini membantu kelancaran usaha Anda, dukungan sukarela Anda sangat berharga untuk riset dan pembaruan fitur berkelanjutan:
* **Bank Penerima:** Bank Tabungan Negara (Bank BTN)
* **Nomor Rekening:** `3601 6100 1943 0`
* **Peruntukan:** Apresiasi Pengembangan Mandiri HRMatrix

---

<div align="center">
  <p>© 2026 HRMatrix Indonesia. Dikembangkan dengan dedikasi untuk kemajuan manajemen tenaga kerja Indonesia.</p>
</div>
