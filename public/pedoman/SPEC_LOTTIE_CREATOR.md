# Panduan & Spesifikasi Baku Pembuatan Animasi Lottie (HRMatrix Lottie Creator Guide)

Dokumen ini adalah **standar resmi pembuatan, integrasi, dan arsitektur visual animasi Lottie** di lingkungan aplikasi HRMatrix. Standar ini mendokumentasikan prinsip estetika, detail palet warna dasar (*soft & smooth*), formula struktur data JSON Bodymovin, pola penyesuaian visual berbasis konteks informasi, serta implementasi teknis pada komponen React.

---

## 📌 Daftar Isi
1. [Filosofi & Peran Animasi Lottie dalam HRMatrix](#1-filosofi--peran-animasi-lottie-dalam-hrmatrix)
2. [Standar Palet Warna Dasar (Soft, Smooth, & Cohesive Tone)](#2-standar-palet-warna-dasar-soft-smooth--cohesive-tone)
3. [Mekanisme & Anatomi Struktur JSON Lottie (Bodymovin 5.7+)](#3-mekanisme--anatomi-struktur-json-lottie-bodymovin-57)
4. [Spesifikasi Berdasarkan Konteks Informasi (Context-Driven Guide)](#4-spesifikasi-berdasarkan-konteks-informasi-context-driven-guide)
5. [Standar Copywriting Pendamping (Human-Centric & Engaging)](#5-standar-copywriting-pendamping-human-centric--engaging)
6. [Implementasi Kode React (`lottie-react` Integration)](#6-implementasi-kode-react-lottie-react-integration)
7. [Checklist Verifikasi & Quality Assurance](#7-checklist-verifikasi--quality-assurance)

---

## 1. Filosofi & Peran Animasi Lottie dalam HRMatrix

### Masalah pada Empty State & Ilustrasi Konvensional:
1. **Pesan Kaku & Hambar**: Menggunakan kotak abu-abu bertuliskan *"Data tidak ditemukan"* membuat pengguna merasa menghadapi jalan buntu (*dead-end*) dan terkesan kaku.
2. **Visual Clashing**: Menggunakan aset animasi pihak ketiga dengan warna cerah mencolok (*neon/harsh*) merusak keanggunan antarmuka korporat HRMatrix.
3. **Ukuran File Berat**: Format GIF atau video MP4 menghasilkan artefak piksel dan membebani transfer data jaringan.

### Solusi Desain HRMatrix:
- **Zero Pixelation (100% Vector)**: Lottie dirender secara matematis menggunakan SVG atau Canvas sehingga selalu tajam sempurna di layar Retina/4K.
- **Harmonious Tone**: Menggunakan kurasi warna dasar *soft*, *smooth*, dan *cool corporate slate/blue* yang menyatu alami dengan sistem desain Tailwind.
- **Micro-Delight & Action-Oriented**: Gerakan animasi tidak sekadar pemanis, melainkan memandu mata pengguna ke tombol tindakan (*Call to Action*).

---

## 2. Standar Palet Warna Dasar (Soft, Smooth, & Cohesive Tone)

Format Lottie JSON menggunakan nilai warna ternormalisasi antara **`0.0` sampai `1.0`** untuk masing-masing kanal `[Red, Green, Blue, Alpha]`. Rumus konversi dari sRGB (0-255) ke Lottie adalah:

$$\text{Nilai Lottie} = \frac{\text{Nilai sRGB}}{255}$$

### Tabel Palet Warna Standar HRMatrix

| Peran Warna | Hex / Tailwind | Nilai Lottie `[R, G, B, A]` | Karakteristik Visual |
| :--- | :--- | :--- | :--- |
| **Primary Brand Blue** | `#2563eb` (`blue-600`) | `[0.145, 0.388, 0.922, 1]` | Warna aksen utama, lencana tombol (+), avatar |
| **Accent Sky Blue** | `#60a5fa` (`blue-400`) | `[0.376, 0.647, 0.980, 1]` | Lapisan sekunder, pakaian avatar, sorotan |
| **Ambient Soft Glow** | `#e0e7ff` (`indigo-100`) | `[0.910, 0.940, 0.990, 1]` | Piringan halo lembut di latar belakang |
| **Card Surface Clean** | `#ffffff` (`white`) | `[1.000, 1.000, 1.000, 1]` | Dasar kartu, kertas slip, dokumen kerja |
| **Card Border Stroke** | `#e2e8f0` (`slate-200`) | `[0.886, 0.910, 0.941, 1]` | Garis batas kartu & slot lanyard |
| **Card Text Mockup 1** | `#334155` (`slate-700`) | `[0.200, 0.255, 0.333, 1]` | Garis dummy nama karyawan / judul |
| **Card Text Mockup 2** | `#94a3b8` (`slate-400`) | `[0.580, 0.639, 0.722, 1]` | Garis dummy jabatan / departemen |
| **Ground Shadow Soft** | `#64748b` (`slate-500`) | `[0.550, 0.620, 0.720, 1]` | Bayangan lantai elips dengan opacity dinamis |
| **Sparkle Gold Warm** | `#f59e0b` (`amber-500`) | `[0.961, 0.620, 0.043, 1]` | Kilauan bintang keemasan bernapas |
| **Sparkle Blue Accent** | `#3b82f6` (`blue-500`) | `[0.231, 0.510, 0.961, 1]` | Partikel sekunder pemanis sudut kartu |

---

## 3. Mekanisme & Anatomi Struktur JSON Lottie (Bodymovin 5.7+)

Setiap file Lottie animasi di HRMatrix dirancang dengan parameter baku:
- **Canvas Size**: `300 x 300` px (koordinat pusat `[150, 150]`).
- **Frame Rate (`fr`)**: `60` fps untuk kehalusan tingkat tinggi (*ultra-smooth*).
- **Duration**: `180` frame (tepat **3.0 detik** per siklus perputaran).
- **Looping Guarantee**: Nilai posisi, rotasi, dan skala pada frame `0` **wajib identik** dengan frame `180` sehingga siklus berjalan terus menerus tanpa patah (*seamless infinite loop*).

### Anatomi Hirarki Layer (Z-Stack dari Bawah ke Atas)

```text
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Sparkle Top-Left & Bottom-Right (Partikel Bintang) │ <- Rotasi 0° s.d. 180°, Opacity 20% - 100%
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Floating Plus Badge (Tanda Tambah Membal)          │ <- Posisi Y 108 -> 94 -> 108, Rotasi -6° ke 8°
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Main Subject (Kartu ID / Dokumen / Gift Box)       │ <- Posisi Y 142 -> 128 -> 142, Rotasi -1.5° ke 1.5°
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Ground Shadow (Bayangan Lantai Bernapas)           │ <- Posisi Y 240, Skala 100% -> 75% -> 100%
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Ambient Glow (Piringan Halo Latar Belakang)        │ <- Posisi Y 135, Opacity 40% -> 65% -> 40%
└─────────────────────────────────────────────────────────────┘
```

### Formula Bezier Easing untuk Gerakan Alami (Natural Sine Wave)
Untuk menciptakan efek melayang (*organic floating*) tanpa hentakan kaku, gunakan koordinat bezier berikut pada *in-tangent* (`i`) dan *out-tangent* (`o`):

```json
"i": { "x": [0.65], "y": [1.00] },
"o": { "x": [0.35], "y": [0.00] }
```

Kombinasi nilai ini menghasilkan percepatan lambat di puncak (*apex*) dan deselerasi halus saat kembali ke posisi awal.

---

## 4. Spesifikasi Berdasarkan Konteks Informasi (Context-Driven Guide)

Setiap halaman memiliki tujuan komunikasi yang unik. Lottie harus mencerminkan konteks tersebut dengan tetap mempertahankan palet warna dasar HRMatrix:

### 1. Data Karyawan (*Employee Directory*)
- **Subjek Animasi**: Kartu ID Card vertikal dengan avatar siluet biru (`#2563eb`), slot tali gantungan lanyard, dan baris data dummy rapi.
- **Aksen Aksi**: Lencana bulat tanda tambah (`+`) yang mengapung ceria di sisi kanan atas kartu.
- **Pesan Visual**: Menumbuhkan semangat untuk menyusun dan menambah anggota tim baru.

### 2. Riwayat Gaji & Penggajian (*Payroll Empty State*)
- **Subjek Animasi**: Lembaran slip gaji terlipat rapi dengan seal stempel terverifikasi biru safir, disertai koin bundar melayang lembut (*floating coin*).
- **Palet Warna**: Dominan putih (`#ffffff`), garis batas slate (`#e2e8f0`), aksen biru korporat (`#2563eb`), dan koin berbayang lembut.
- **Pesan Visual**: Menunjukkan keteraturan finansial, akurasi, dan kesiapan sistem untuk memproses penggajian pertama.

### 3. Kompensasi, Bonus & Insentif (*Compensation Rules*)
- **Subjek Animasi**: Kotak hadiah bergaya minimalis elegan (*clean gift box*) dengan pita aksen ungu lavender (`#7c3aed`) atau merah ruby (`#dc2626`) yang bergoyang halus (*gentle tilt*).
- **Palet Warna**: Selaras dengan skema warna kartu kompensasi (Lavender-Violet atau Red-Rose).
- **Pesan Visual**: Mengapresiasi kontribusi karyawan dan kejelasan sistem reward perusahaan.

### 4. Berkas & Kontrak Kerja (*Document Management*)
- **Subjek Animasi**: Folder berkas (*manila folder*) berwarna biru lembut dengan lembaran kertas kontrak yang terselip rapi dan ikon centang mikro di sudutnya.
- **Pesan Visual**: Manajemen dokumen yang terpusat, terarsip aman, dan bebas dari kertas berserakan.

### 5. Log Aktivitas & Riwayat Audit (*Audit Trail & Logs*)
- **Subjek Animasi**: Jam pasir modern atau piringan kalender minimalis dengan jarum rotasi lembut (tanpa pergerakan cepat yang memusingkan).
- **Pesan Visual**: Catatan waktu yang transparan, akuntabel, dan terlindungi.

### 6. Profil & Pengaturan Perusahaan (*Company Profile & Settings Empty State*)
- **Subjek Animasi**: Gedung kantor pusat korporat modern (*Corporate HQ Tower*) dengan sayap arsitektur simetris, jendela kaca biru bergradasi, kanopi pintu masuk berputar (*grand glass entrance*), papan nama entitas usaha, dan lambang monogram korporat di puncak gedung.
- **Aksen Aksi**: Lencana bulat lambang korporat/gedung terverifikasi (*verified enterprise emblem*) yang mengapung lembut di sudut kanan atas.
- **Pesan Visual**: Membangun fondasi identitas organisasi yang profesional, kredibel, dan siap beroperasi.

---

## 5. Standar Copywriting Pendamping (Human-Centric & Engaging)

Lottie **tidak boleh diletakkan sendirian** tanpa panduan kontekstual. Struktur penyajian wajib mengikuti formula 5 tingkat berikut:

```text
1. [Badge Langkah]        -> "✨ Langkah Awal Membangun Tim"
2. [Judul Ajakan Hangat]  -> "Yuk, Mulai Bangun & Kelola Tim Hebat Anda!"
3. [Deskripsi Nilai/Value]-> "Tambahkan anggota tim pertama Anda untuk memudahkan pengelolaan..."
4. [Tombol Tindakan Cepat]-> "[ + Tambah Karyawan Pertama ]"
5. [Lottie Vector Canvas] -> [ Animasi Mengapung Halus Berputar Mulus ]
6. [Trust Microcopy]      -> "Proses cepat & praktis • Data tersimpan aman"
```

### Panduan Transformasi Kalimat:

| Kalimat Kaku Lama ❌ | Kalimat Ajakan Human-Centric Baru  |
| :--- | :--- |
| *"Tidak ada data karyawan ditemukan."* | *"Yuk, Mulai Bangun & Kelola Tim Hebat Anda!"* |
| *"Data penggajian masih kosong."* | *"Siapkan Penggajian Perdana Tim Anda dengan Rapi!"* |
| *"Belum ada aturan kompensasi dibuat."* | *"Tentukan Struktur Tunjangan & Reward Terbaik untuk Karyawan!"* |
| *"Belum ada berkas tersimpan."* | *"Arsipkan Dokumen & Kontrak Kerja dalam Satu Tempat Aman"* |

---

## 6. Implementasi Kode React (`lottie-react` Integration)

HRMatrix menggunakan library resmi `lottie-react` untuk merender animasi secara native ke dalam elemen SVG.

### Kode Template Standar:

```tsx
import React from 'react';
import { Lottie } from 'lottie-react';
import { UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import emptyEmployeeAnimation from '@/assets/animations/empty-employees.json';

interface EmptyStateCardProps {
  onAction: () => void;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ onAction }) => {
  return (
    <div
      id="empty-state-invitation-card"
      className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center transition-all duration-300 hover:border-slate-300"
    >
      {/* Decorative Ambient Background */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Step Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-semibold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Langkah Awal Membangun Tim</span>
        </div>

        {/* Engaging Headline */}
        <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Yuk, Mulai Bangun & Kelola Tim Hebat Anda!
        </h3>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
          Tambahkan anggota tim pertama Anda untuk memudahkan pengelolaan struktur jabatan, 
          tunjangan kompensasi, penggajian, dan berkas kerja karyawan secara rapi dan otomatis.
        </p>

        {/* Call to Action Button */}
        <div className="mt-5 mb-3 flex justify-center">
          <button
            type="button"
            onClick={onAction}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>+ Tambah Karyawan Pertama</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 opacity-80" />
          </button>
        </div>

        {/* Lottie Vector Canvas (Sits Seamlessly Below Call-To-Action) */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto -mt-2 -mb-2 flex items-center justify-center">
          <Lottie
            src={emptyEmployeeAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full drop-shadow-xs pointer-events-none select-none"
          />
        </div>

        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          Proses cepat & praktis • Data tersimpan aman
        </p>
      </div>
    </div>
  );
};
```

---

## 7. Checklist Verifikasi & Quality Assurance

Sebelum animasi Lottie diterapkan ke dalam produksi, pastikan seluruh kriteria berikut terpenuhi:

- [ ] **Validitas Format JSON**: File JSON lolos parsing `JSON.parse()` dan mematuhi skema Bodymovin 5.7+.
- [ ] **Palet Warna**: Tidak menggunakan warna saturasi tinggi (*neon/harsh*). Menggunakan nilai desimal `[R, G, B, A]` sesuai tabel standar warna HRMatrix.
- [ ] **Looping Mulus**: Transisi dari frame akhir (`180`) ke frame awal (`0`) berjalan kontinu tanpa patahan sudut, lonjakan posisi, atau kedipan (*flicker*).
- [ ] **Efisiensi Layer**: Maksimal 6–8 shape layer per animasi agar render SVG tetap ringan dan tidak menguras daya baterai pengguna perangkat seluler.
- [ ] **Accessibility & Reduced Motion**: Elemen Lottie dibungkus dengan `pointer-events-none` agar tidak menghalangi gestur sentuh atau seleksi teks pada perangkat mobile.
- [ ] **Copywriting Ramah**: Judul dan deskripsi berorientasi ajakan bertindak (*actionable delight*), bukan pesan negatif atau kaku.

---
*Dokumen ini dibuat dan dikelola oleh Tim Desain & Frontend Arsitektur HRMatrix.*
