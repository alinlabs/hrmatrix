# Panduan & Spesifikasi Baku Card Awal (Empty State Onboarding Card)

Dokumen ini adalah **standar resmi desain, arsitektur tata letak (*layout*), aturan penulisan (*copywriting*), dan integrasi komponen visual untuk Card Awal (Empty State)** di seluruh modul aplikasi HRMatrix. Standar ini mendokumentasikan prinsip transformasi dari tampilan kosong yang kaku dan pasif menjadi **kartu ajakan interaktif (*actionable onboarding card*)** yang bersahabat, minimalis, dan memotivasi pengguna untuk memulai aksi pertamanya.

---

## 📌 Daftar Isi
1. [Filosofi Desain: Dari Status Kosong ke Ajakan Bertindak](#1-filosofi-desain-dari-status-kosong-ke-ajakan-bertindak)
2. [Anatomi & Struktur Visual Kontainer](#2-anatomi--struktur-visual-kontainer)
3. [Aturan Typography & Copywriting (Singkat, Padat & Hangat)](#3-aturan-typography--copywriting-singkat-padat--hangat)
4. [Aturan Desain Tombol Call-To-Action (Anti-Redundansi Simbol)](#4-aturan-desain-tombol-call-to-action-anti-redundansi-simbol)
5. [Posisi & Peran Animasi Lottie (Visual Anchor di Bawah Tombol)](#5-posisi--peran-animasi-lottie-visual-anchor-di-bawah-tombol)
6. [Integrasi dengan Pedoman Lottie (`SPEC_LOTTIE_CREATOR.md`) & Formula Prompt](#6-integrasi-dengan-pedoman-lottie-spec_lottie_creatormd--formula-prompt)
7. [Matriks Konteks Antar-Halaman (Daftar Halaman Lain)](#7-matriks-konteks-antar-halaman-daftar-halaman-lain)
8. [Standar Kode Komponen React (Reusable Pattern)](#8-standar-kode-komponen-react-reusable-pattern)
9. [Checklist Quality Assurance (QA)](#9-checklist-quality-assurance-qa)

---

## 1. Filosofi Desain: Dari Status Kosong ke Ajakan Bertindak

### ❌ Masalah pada Desain Empty State Konvensional:
- **Pesan Pasif & Kaku**: Teks seperti *"Tidak ada data ditemukan"* atau *"Data kosong"* membuat pengguna merasa menghadapi jalan buntu (*dead-end*) dan seolah sistem mengalami kegagalan.
- **Visual Clutter / Over-decoration**: Memberikan terlalu banyak badge/pill di bagian atas judul membuat pengguna bingung membedakan mana pesan utama dan mana status pendukung.
- **Redundansi Elemen**: Menuliskan teks `+ Tambah...` padahal tombol sudah memuat ikon `+` atau `UserPlus`.
- **Hierarki Terbalik**: Meletakkan gambar/animasi besar di atas teks sehingga menenggelamkan tombol tindakan utama (*CTA*) ke bagian bawah layar.

###  Prinsip HRMatrix untuk Card Awal:
1. **Action-First Hierarchy**: Judul ajakan, deskripsi manfaat, dan tombol CTA diletakkan di **bagian atas**, sehingga mata pengguna langsung menangkap aksi yang harus dilakukan dalam 1 detik pertama.
2. **Minimalis & Bersih**: Dilarang menggunakan badge/pill di atas judul. Cukup langsung ke inti pesan.
3. **Micro-Delight di Bawah Tombol**: Animasi Lottie ditempatkan di bawah tombol CTA sebagai *visual anchor* yang hidup, lembut, dan menghibur tanpa mendistraksi pengguna dari tombol utama.

---

## 2. Anatomi & Struktur Visual Kontainer

Komponen Card Awal dibungkus dalam kontainer putih modern dengan efek pencahayaan latar belakang (*ambient glow*) yang halus:

```text
┌─────────────────────────────────────────────────────────────┐
│  [Ambient Glow Kanan Atas: blue-50/70 blur-3xl]            │
│                                                             │
│  [H3] Judul Singkat & Hangat                                │ <- text-xl / text-2xl font-extrabold text-slate-900
│  [P]  Deskripsi Padat 1-2 Baris                             │ <- text-xs / text-sm text-slate-500 max-w-sm
│                                                             │
│  [BUTTON CTA] (Ikon + Label Tanpa Simbol Ganda)             │ <- px-5 py-2.5 rounded-xl bg-blue-600 font-bold
│                                                             │
│  [LOTTIE ANIMATION] (Looping Vektor Halus 300x300)          │ <- w-48 h-48 s.d. w-60 h-60 (Center)
│                                                             │
│  [Caption / Trust Note] (Kecil & Lembut)                    │ <- text-[11px] text-slate-400 font-medium
│  [Ambient Glow Kiri Bawah: indigo-50/70 blur-3xl]           │
└─────────────────────────────────────────────────────────────┘
```

### Spesifikasi Token CSS Kontainer:
- **Background**: `bg-white` dengan radius `rounded-3xl` (24px).
- **Border**: `border border-slate-200/90` yang bertransisi halus ke `hover:border-slate-300`.
- **Shadow**: `shadow-xs` lembut, tidak menggunakan drop shadow pekat.
- **Padding**: `p-6 sm:p-10` dengan pembatas lebar konten `max-w-lg mx-auto`.
- **Ambient Glow**:
  - Sisi Kanan Atas: `absolute -top-16 -right-16 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none`
  - Sisi Kiri Bawah: `absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none`

---

## 3. Aturan Typography & Copywriting (Singkat, Padat & Hangat)

### A. Aturan Judul (`H3`):
- **Gaya Bahasa**: Ramah, menggunakan kata ajakan aktif (*"Ayo..."*, *"Mulai..."*, *"Siapkan..."*).
- **Panjang Kalimat**: Maksimal **4 sampai 6 kata** (1 baris pada layar desktop/tablet).
- **Styling**: `text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-center`.
- **Contoh**: *"Ayo, Mulai Bangun Team Hebat!"*

### B. Aturan Deskripsi (`P`):
- **Panjang Kalimat**: Maksimal **1 sampai 2 kalimat pendek** (di bawah 15 kata).
- **Konten**: Menjelaskan **manfaat langsung** yang diperoleh pengguna setelah menekan tombol, bukan sekadar menyatakan data kosong.
- **Styling**: `text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto text-center`.
- **Contoh**: *"Tambahkan karyawan pertama Anda untuk memulai pengelolaan data dan penggajian tim."*

### C. Tabel Komparasi Copywriting:

| Modul Halaman | Copywriting Pasif Lama ❌ | Copywriting Baku Card Awal  |
| :--- | :--- | :--- |
| **Karyawan** | *"Tidak ada data karyawan ditemukan. Klik Tambah..."* | **"Ayo, Mulai Bangun Team Hebat!"**<br>Tambahkan karyawan pertama Anda untuk memulai pengelolaan data dan penggajian tim. |
| **Penggajian (Payroll)** | *"Belum ada riwayat penggajian pada periode ini."* | **"Siapkan Penggajian Perdana Tim!"**<br>Hitung dan proses slip gaji bulanan karyawan dengan cepat dan akurat. |
| **Kompensasi & Tunjangan**| *"Aturan tunjangan masih kosong."* | **"Rancang Struktur Tunjangan Karyawan!"**<br>Buat aturan bonus, komisi, dan tunjangan tetap secara transparan. |
| **Dokumen & Berkas** | *"Tidak ada dokumen tersimpan."* | **"Mulai Arsipkan Berkas Tim Anda!"**<br>Unggah kontrak kerja, sertifikat, dan identitas karyawan dalam satu tempat aman. |

---

## 4. Aturan Desain Tombol Call-To-Action (Anti-Redundansi Simbol)

### Prinsip Anti-Redundansi Simbol:
> **PENTING**: Jika tombol telah menggunakan ikon `UserPlus`, `Plus`, `FilePlus`, atau sejenisnya, **DILARANG** menambahkan karakter tanda tambah `"+"` di dalam teks label tombol.

### Spesifikasi Tombol CTA:
- **Ikon Kiri**: Ikon representatif dari `lucide-react` dengan ukuran `w-4 h-4` (misal: `UserPlus`, `PlusCircle`, `FilePlus`). Dilengkapi efek hover `group-hover:scale-110`.
- **Teks Label**: Jelas, singkat, diawali kata kerja (misal: `Tambah Karyawan Pertama`).
- **Ikon Kanan (Opsional)**: Tanda panah arah `ArrowRight` (`w-3.5 h-3.5`) dengan opacity halus `opacity-80` dan animasi `group-hover:translate-x-0.5`.
- **Padding Rasio 2:1**: Horizontal padding adalah 2x vertical padding (`px-5 py-2.5`).
- **Warna & Efek**:
  - Normal: `bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20`
  - Hover: `hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30`
  - Active: `active:scale-[0.98]`
  - Margin: `mt-5 mb-2`

---

## 5. Posisi & Peran Animasi Lottie (Visual Anchor di Bawah Tombol)

### Mengapa Lottie di Bawah Tombol?
1. **Fokus Tidak Terpecah**: Tombol CTA dapat segera diakses tanpa perlu menggulir (*scroll*).
2. **Efek Relaksasi Visual**: Mata pengguna yang telah membaca judul dan tombol akan beristirahat secara alami pada animasi mengapung (*floating micro-animation*) di bagian tengah bawah.
3. **Keseimbangan Komposisi (Visual Weight)**: Lottie dengan bayangan lantai lembut (*ground shadow*) berfungsi sebagai tumpuan visual (*pedestal*) dari keseluruhan kartu.

### Standar Pembungkus Lottie:
- **Ukuran Wadah**: `w-48 h-48 sm:w-60 sm:h-60 mx-auto -mt-2 -mb-2 flex items-center justify-center`.
- **Atribut Interaksi**: Wajib menyertakan `pointer-events-none select-none` agar tidak mengganggu klik atau seleksi pada perangkat sentuh.
- **Drop Shadow**: Menggunakan `drop-shadow-xs` yang sangat tipis.

---

## 6. Integrasi dengan Pedoman Lottie (`SPEC_LOTTIE_CREATOR.md`) & Formula Prompt

Seluruh animasi yang dipakai pada Card Awal harus mengikuti standar teknis di `SPEC_LOTTIE_CREATOR.md`:
- **Format**: File JSON Bodymovin 5.7+ di `/src/assets/animations/*.json`.
- **Frame Rate & Durasi**: 60 fps, 180 frame (3.0 detik looping mulus).
- **Palet Warna Lottie**: Menggunakan nilai desimal ternormalisasi `[0.0 s.d. 1.0]`:
  - Biru Utama (`#2563eb`): `[0.145, 0.388, 0.922, 1]`
  - Biru Aksen (`#60a5fa`): `[0.376, 0.647, 0.980, 1]`
  - Bayangan Lantai (`#64748b`): `[0.550, 0.620, 0.720, 1]`
  - Kilauan Bintang (`#f59e0b`): `[0.961, 0.620, 0.043, 1]`

### Formula Prompt untuk Membuat Animasi Lottie Baru:
Saat meminta pembuatan atau membuat animasi Lottie baru untuk Card Awal, gunakan formula prompt terstruktur berikut:

```text
[PERAN & OBJEK UTAMA]:
"Buatkan animasi Lottie 300x300 px bertema [Nama Objek: Misal Slip Gaji / Kotak Hadiah / Folder Berkas]."

[KARAKTERISTIK WARNA]:
"Warna dasar mengikuti palet resmi HRMatrix: Putih bersih, aksen garis slate-200, warna primer Blue-600 ([0.145, 0.388, 0.922]), aksen biru muda Blue-400, dan partikel sparkle gold amber-500."

[GERAKAN & TIMING]:
"Durasi tepat 180 frame pada 60 fps (3 detik per loop). Objek utama melayang naik turun lembut (posisi Y 142 -> 128 -> 142 dengan kurva Bezier i:[0.65,1], o:[0.35,0])."

[LAYER PENDUKUNG]:
"1. Piringan ambient glow di latar belakang (opacity 40% -> 65% -> 40%).
 2. Bayangan lantai elips (ground shadow) di posisi Y 240 yang mengecil saat objek naik.
 3. Partikel bintang sparkle di sudut kiri-atas dan kanan-bawah yang berotasi perlahan."
```

---

## 7. Matriks Konteks Antar-Halaman (Daftar Halaman Lain)

Gunakan tabel acuan ini ketika menerapkan Card Awal pada modul-modul lain di aplikasi HRMatrix:

| Modul Halaman | Subjek Animasi Lottie | Judul Singkat | Deskripsi Manfaat | Label Tombol CTA (Tanpa `+`) | Ikon Lucide |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Daftar Karyawan** | `empty-employees.json` (ID Card & Avatar) | Ayo, Mulai Bangun Team Hebat! | Tambahkan karyawan pertama Anda untuk memulai pengelolaan data dan penggajian tim. | Tambah Karyawan Pertama | `UserPlus` |
| **Penggajian (Payroll)** | `empty-payroll.json` (Slip Gaji & Koin) | Siapkan Penggajian Perdana Tim! | Proses gaji bulanan dan buat slip otomatis secara rapi dan akurat. | Buat Penggajian Pertama | `CreditCard` |
| **Kompensasi & Tunjangan** | `empty-compensation.json` (Gift Box & Ribbon) | Rancang Struktur Kompensasi! | Tentukan tunjangan tetap, bonus, dan insentif kerja untuk apresiasi tim. | Tambah Aturan Pertama | `Gift` |
| **Manajemen Dokumen** | `empty-documents.json` (Folder & Kontrak) | Mulai Arsipkan Dokumen Tim! | Simpan kontrak kerja, KTP, dan surat keputusan dalam satu wadah terpusat. | Unggah Dokumen Pertama | `UploadCloud` |
| **KPI & Evaluasi Kinerja** | `empty-kpi.json` (Grafik Target & Medali) | Susun Target Kinerja Tim! | Buat indikator penilaian KPI untuk memantau produktivitas karyawan. | Buat Target KPI Pertama | `Target` |
| **Profil & Pengaturan Perusahaan** | `empty-company.json` (Gedung Kantor HQ & Emblem) | Daftarkan Profil Perusahaan Anda | Lengkapi identitas organisasi dan akun pengelola untuk mengaktifkan pengaturan profil resmi. | Daftarkan Perusahaan Sekarang | `Building2` |

---

## 8. Standar Kode Komponen React (Reusable Pattern)

Template standar komponen Card Awal yang siap digunakan pada halaman apapun:

```tsx
import React from 'react';
import { Lottie } from 'lottie-react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface InitialEmptyCardProps {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  ButtonIcon: LucideIcon;
  onAction: () => void;
  animationData: object;
  trustNote?: string;
}

export const InitialEmptyCard: React.FC<InitialEmptyCardProps> = ({
  id = 'initial-empty-card',
  title,
  description,
  buttonText,
  ButtonIcon,
  onAction,
  animationData,
  trustNote = 'Proses cepat & praktis • Data tersimpan aman',
}) => {
  return (
    <div
      id={id}
      className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center transition-all duration-300 hover:border-slate-300"
    >
      {/* Soft Decorative Ambient Background */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Main Heading (Singkat & Hangat) */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>

        {/* Supporting Narrative (Singkat & To-The-Point) */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>

        {/* Primary Call-To-Action Button */}
        <div className="mt-5 mb-2 flex justify-center">
          <button
            type="button"
            onClick={onAction}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer"
          >
            <ButtonIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 opacity-80" />
          </button>
        </div>

        {/* Lottie Animation Display (Tepat di Bawah Ajakan) */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto -mt-2 -mb-2 flex items-center justify-center">
          <Lottie
            src={animationData}
            loop={true}
            autoplay={true}
            className="w-full h-full drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        {/* Trust Note Caption */}
        {trustNote && (
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {trustNote}
          </p>
        )}
      </div>
    </div>
  );
};
```

---

## 9. Checklist Quality Assurance (QA)

Sebelum menyetujui penerapan Card Awal pada suatu halaman, pastikan seluruh pertanyaan berikut dijawab **YA**:

- [ ] **Tanpa Badge Berlebihan**: Apakah area di atas judul bersih dari badge/pill berlebihan?
- [ ] **Judul Singkat**: Apakah judul terdiri dari maksimal 4–6 kata dan bernada ajakan bersahabat?
- [ ] **Deskripsi Padat**: Apakah deskripsi maksimal 1–2 kalimat pendek berorientasi manfaat?
- [ ] **Anti-Redundansi Simbol**: Apakah teks tombol terbebas dari simbol `+` jika ikon tombol sudah memuat simbol tambah?
- [ ] **Posisi Lottie**: Apakah animasi Lottie terletak **di bawah** tombol CTA, bukan di atasnya?
- [ ] **Warna Lottie**: Apakah warna animasi Lottie selaras dengan palet dasar HRMatrix (`SPEC_LOTTIE_CREATOR.md`) tanpa warna neon yang jomplang?
- [ ] **Responsif & Aman**: Apakah elemen Lottie dilengkapi `pointer-events-none select-none` dan tidak mengganggu klik di layar sentuh mobile?

---
*Dokumen ini dibuat dan dikelola oleh Tim Desain & Frontend Arsitektur HRMatrix.*
