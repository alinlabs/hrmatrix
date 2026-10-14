# Panduan & Spesifikasi Baku Animasi Gradasi Kartu (Living Ambient Card)

Dokumen ini adalah **standar baku arsitektur visual dan implementasi animasi kartu dinamis** di aplikasi HRMatrix. Standar ini mendokumentasikan teknik penerapan efek gradasi bergerak yang hidup (*living ambient breathing gradient*), di mana kartu mempertahankan warna dasar yang konsisten namun memiliki perpindahan sudut cahaya, siklus timbul-redup alami, serta rotasi ambience sehingga tidak terlihat kaku, datar (*flat*), maupun membosankan.

---

## 📌 Daftar Isi
1. [Filosofi Desain: Living Ambient Card & Flat Gradient Card](#1-filosofi-desain-living-ambient-card--flat-gradient-card)
2. [Penerapan: Kartu Hero Beranimasi vs Kartu List Flat Gradasi](#2-penerapan-kartu-hero-beranimasi-vs-kartu-list-flat-gradasi)
3. [Palet Warna Bertema (Theme Palettes)](#3-palet-warna-bertema-theme-palettes)
4. [Anatomi Lapisan Efek (3-Layer Architecture untuk Hero Cards)](#4-anatomi-lapisan-efek-3-layer-architecture-untuk-hero-cards)
5. [Teknik Desinkronisasi Animasi (Organic Non-Uniform Randomization)](#5-teknik-desinkronisasi-animasi-organic-non-uniform-randomization)
6. [Spesifikasi Keyframes & CSS Engine](#6-spesifikasi-keyframes--css-engine)
7. [Struktur Kode Komponen (JSX / TSX Pattern)](#7-struktur-kode-komponen-jsx--tsx-pattern)
8. [Prinsip Aksesibilitas & Performa GPU](#8-prinsip-aksesibilitas--performa-gpu)
9. [Checklist Verifikasi Implementasi](#9-checklist-verifikasi-implementasi)

---

## 1. Filosofi Desain: Living Ambient Card & Flat Gradient Card

### Masalah pada Desain Kartu Konvensional:
Kartu dengan satu warna datar monokrom tanpa aksen gradasi terasa monoton, sedangkan animasi dinamis yang terlalu banyak di dalam satu halaman daftar (*card list*) dengan puluhan item dapat menyebabkan kelelahan visual (*visual fatigue*) bagi pengguna.

### Solusi Desain HRMatrix:
1. **Hero / Featured Card (Misal: Atur Penilaian KPI Umum)**: Menerapkan **Living Ambient Card** lengkap dengan pergeseran cahaya bernapas dan ambient orbs untuk memberikan kesan pusat kontrol yang prestisius.
2. **Dense List Cards (Daftar Card Kompensasi)**: Menerapkan **Flat Static Gradient Card**. Kartu tetap memiliki paduan warna gradasi tematik yang elegan dan kaya (tidak kaku), namun tanpa animasi pergerakan terus menerus (*flat/static*). Hal ini membuat daftar item nyaman ditelaah, tidak berkedip, dan hemat konsumsi GPU perangkat.

---

## 2. Penerapan: Kartu Hero Beranimasi vs Kartu List Flat Gradasi

| Aspek | Hero Card (Penilaian KPI) | List Card (Aturan Kompensasi) |
| :--- | :--- | :--- |
| **Sifat Tampilan** | Dinamis, Bernapas (*Living Ambient*) | Statis / Flat Bergradasi (*Clean Flat Gradient*) |
| **Animasi Gradasi** | Aktif (`cardGradientShift 12s`) | Nonaktif (0s / Statis) |
| **Ambient Orbs** | Aktif (2 titik cahaya timbul-redup) | Ditiadakan |
| **Sheen Sweep** | Aktif (sapuan kilau kaca) | Ditiadakan |
| **Glassmorphism Detail** | Badge semi-transparan | Kontainer parameter frosted glass (`bg-black/15 border-white/20`) |
| **Tujuan** | Focal point halaman & identitas visual | Keterbacaan data tinggi & kenyamanan membaca list |

---

## 2. Anatomi Lapisan Efek (3-Layer Architecture)

Komponen kartu disusun atas beberapa layer z-index:

```text
┌─────────────────────────────────────────────────────────────┐
│  [Z-10] Konten Utama (Icon Box, Judul, Frosted Detail Panel)│ <- Tajam, kontras tinggi
├─────────────────────────────────────────────────────────────┤
│  [Z-0]  Layer 3: Ambient Sheen Sweep (Sinar Kilau Miring)   │ <- Opacity 0.1 - 0.25
│  [Z-0]  Layer 2: Dual Breathing Glow Orbs (Timbul & Redup)  │ <- Blur 2xl, radial light
│  [Z-0]  Layer 1: Base Animated Multi-Stop Gradient Canvas   │ <- Background-size 260%
└─────────────────────────────────────────────────────────────┘
```

1. **Base Canvas (`.gradient-card-*`)**:
   Kanvas gradasi berdimensi 260% dari ukuran kartu yang posisinya digeser dari sudut 0% ke 100% secara berulang.
2. **Orb Cahaya 1 (Kiri Atas / Luminous Highlight)**:
   Titik sinar lingkaran lembut dengan `blur-2xl` yang mengalami animasi `cardAmbientPulse1` (bergerak sedikit ke kanan-bawah sambil bernapas timbul-redup dengan opacity 0.30 s.d. 0.75).
3. **Orb Cahaya 2 (Kanan Bawah / Deep Counter Glow)**:
   Titik sinar pelengkap di sudut sebaliknya yang mengalami animasi `cardAmbientPulse2` (siklus terbalik: saat Orb 1 redup, Orb 2 timbul menerangi kartu).
4. **Ambient Sheen Sweep**:
   Garis cahaya miring yang sangat tipis menyapu kartu untuk mempertegas tekstur kaca.

---

## 3. Palet Warna Bertema & Aturan Identifikasi Berdasarkan Nama

Agar pengguna dapat dengan cepat dan mudah membedakan jenis kartu kompensasi tanpa ada warna yang jomplang atau bertabrakan, gradasi dirancang dengan nuansa serumpun yang mulus dan elegan:

1. **Tunjangan (Default Allowance)**:
   - **Gradasi**: **Biru ke Biru Agak Muda** (`#1e40af` → `#2563eb` → `#3b82f6` → `#60a5fa`)
   - **Karakter**: Biru korporat optimis dengan transisi mulus dan kontras seimbang.
   - **Ikon**: Label Tag (`Tag`), `text-blue-600`
2. **Bonus**: Jika nama aturan mengandung kata `"Bonus ...."` atau `"Reward ...."`
   - **Gradasi**: **Lavender ke Ungu Muda** (`#581c87` → `#6d28d9` → `#7c3aed` → `#9333ea` → `#a855f7`)
   - **Karakter**: Serumpun lavender-violet lembut tanpa benturan spektrum warna lain.
   - **Ikon**: Gift Box (`Gift`), `text-purple-600`
3. **Insentif**: Jika nama aturan mengandung kata `"Komisi ...."` atau `"Insentif ...."`
   - **Gradasi**: **Merah ke Merah Muda** (`#991b1b` → `#b91c1c` → `#dc2626` → `#ef4444` → `#f87171`)
   - **Karakter**: Transisi merah tua/ruby ke merah muda cerah yang dinamis dan serasi.
   - **Ikon**: Persen (`Percent`), `text-red-600`
4. **BPJS**: Kategori Jaminan Sosial Ketenagakerjaan / Kesehatan
   - **Gradasi**: **Hijau Resmi BPJS ke Toska** (`#064e3b` → `#065f46` → `#047857` → `#059669` → `#0d9488`)
   - **Karakter**: Mengadaptasi identitas warna resmi BPJS Kesehatan (hijau) dan BPJS Ketenagakerjaan (biru-toska).
   - **Ikon**: Perisai Centang (`ShieldCheck`), `text-emerald-700`
5. **Pajak**: Kategori Pajak PPh 21 / PPh 26
   - **Gradasi**: **Biru Gelap Gradasi (Navy DJP)** (`#091224` → `#0f1e40` → `#162f68` → `#1e3a8a` → `#1e40af`)
   - **Karakter**: Terinspirasi warna biru navy DJP, bernuansa formal, kredibel, dan berwibawa.
   - **Ikon**: Kalkulator (`Calculator`), `text-blue-900`

### Spesifikasi Pembungkus Ikon (Icon Badge Box):
- **Wadah (Badge)**: Menggunakan fill putih penuh **100% opacity (`bg-white`)**, tanpa border/outline putih (`border-none`), dan bayangan halus (`shadow-xs`).
- **Warna Ikon**: Ikon di dalam badge memiliki warna yang disesuaikan dengan tema kartu (`text-blue-600`, `text-purple-600`, `text-red-600`, dsb.) untuk menghasilkan kontras maksimal yang elegan dan mudah dibaca.

| Tipe Kompensasi | Kriteria Identifikasi | Paduan Warna Gradasi | Ikon | Warna Ikon |
| :--- | :--- | :--- | :--- | :--- |
| **Tunjangan** | Default Allowance | **Biru ke Biru Agak Muda** (`#1e40af` → `#60a5fa`) | `Tag` (🏷️) | `text-blue-600` |
| **Bonus** | Nama mengandung `"Bonus"`, `"Reward"` | **Lavender ke Ungu Muda** (`#581c87` → `#a855f7`) | `Gift` (🎁) | `text-purple-600` |
| **Insentif** | Nama mengandung `"Komisi"`, `"Insentif"` | **Merah ke Merah Muda** (`#991b1b` → `#f87171`) | `Percent` (%) | `text-red-600` |
| **BPJS** | Kategori BPJS / Jaminan | **Hijau Resmi BPJS ke Toska** (`#064e3b` → `#0d9488`) | `ShieldCheck` (🛡️) | `text-emerald-700` |
| **Pajak** | Kategori Tax / PPh | **Biru Gelap Navy DJP** (`#091224` → `#1e40af`) | `Calculator` (🧮) | `text-blue-900` |

---

## 4. Teknik Desinkronisasi Animasi (Organic Non-Uniform Randomization)

Untuk mencegah kartu dalam grid bergerak serempak (*in-sync*), gunakan fungsi hash deterministik berbasis ID:

```ts
function getCardDynamicAnimation(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const angles = [135, 142, 128, 150, 138, 145];
  const angle = angles[seed % angles.length];

  // Durasi acak dan delay negatif agar kartu langsung berada di fase yang berbeda
  const gradDuration = 11 + (seed % 7); // 11s s.d. 17s
  const gradDelay = -(((seed % 13) * 1.25) % gradDuration);

  const orb1Duration = 7 + ((seed >> 2) % 6); // 7s s.d. 12s
  const orb1Delay = -(((seed >> 1) % 9) * 1.1);

  const orb2Duration = 8 + ((seed >> 3) % 7); // 8s s.d. 14s
  const orb2Delay = -(((seed >> 2) % 8) * 1.3);

  const sheenDuration = 8 + ((seed >> 4) % 5); // 8s s.d. 12s
  const sheenDelay = -(((seed >> 3) % 7) * 1.4);

  return {
    angle,
    gradDuration,
    gradDelay,
    orb1Duration,
    orb1Delay,
    orb2Duration,
    orb2Delay,
    sheenDuration,
    sheenDelay,
    orb1Position: seed % 2 === 0 ? '-top-12 -left-10' : '-top-8 -left-14',
    orb2Position: seed % 2 === 0 ? '-bottom-12 -right-10' : '-bottom-8 -right-14'
  };
}
```

**Keunggulan Teknik Ini:**
1. **Deterministik**: Nilai acak tetap konsisten per kartu saat komponen mengalami *re-render* atau *filtering*, sehingga animasi tidak tersentak (*no layout thrashing*).
2. **Negative Delay (`-delay`)**: Animasi kartu langsung berjalan di tengah siklus saat halaman pertama kali dimuat tanpa jeda tunggu awal.
3. **Multi-Tempo**: Kecepatan pergeseran gradasi (11-17s) dan orbs (7-14s) tidak seragam, menciptakan dinamika visual alami layaknya pencahayaan atmosferik.

---

## 5. Spesifikasi Keyframes & CSS Engine

Aturan animasi ini didefinisikan secara terpusat di `src/index.css`:

```css
/* =========================================================
   ANIMATED AMBIENT CARD GRADIENT (LIVING CARD EFFECT)
   ========================================================= */

/* 1. Perpindahan Titik Koordinat Gradasi Dasar */
@keyframes cardGradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 2. Siklus Bernapas Cahaya Utama (Timbul - Redup) */
@keyframes cardAmbientPulse1 {
  0% {
    opacity: 0.35;
    transform: translate(0%, 0%) scale(1);
  }
  33% {
    opacity: 0.75;
    transform: translate(12%, 8%) scale(1.15);
  }
  66% {
    opacity: 0.45;
    transform: translate(-8%, 15%) scale(0.95);
  }
  100% {
    opacity: 0.35;
    transform: translate(0%, 0%) scale(1);
  }
}

/* 3. Siklus Bernapas Cahaya Pembalas (Counter-Orb) */
@keyframes cardAmbientPulse2 {
  0% {
    opacity: 0.65;
    transform: translate(0%, 0%) scale(1.1);
  }
  40% {
    opacity: 0.25;
    transform: translate(-15%, -10%) scale(0.9);
  }
  75% {
    opacity: 0.8;
    transform: translate(10%, -12%) scale(1.2);
  }
  100% {
    opacity: 0.65;
    transform: translate(0%, 0%) scale(1.1);
  }
}

/* 4. Sapuan Kilau Lembut Kaca */
@keyframes cardSheenSweep {
  0% {
    transform: translateX(-120%) rotate(25deg);
    opacity: 0;
  }
  20% {
    opacity: 0.25;
  }
  50% {
    transform: translateX(160%) rotate(25deg);
    opacity: 0.2;
  }
  100% {
    transform: translateX(200%) rotate(25deg);
    opacity: 0;
  }
}

/* Utilitas Kelas */
.animate-card-gradient {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 28%, #3b82f6 52%, #4338ca 78%, #1d4ed8 100%);
  background-size: 260% 260%;
  animation: cardGradientShift 12s ease infinite;
}

.animate-ambient-pulse-1 {
  animation: cardAmbientPulse1 9s ease-in-out infinite;
  will-change: transform, opacity;
}

.animate-ambient-pulse-2 {
  animation: cardAmbientPulse2 11s ease-in-out infinite;
  will-change: transform, opacity;
}

.animate-sheen-sweep {
  animation: cardSheenSweep 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform, opacity;
}

/* Preferensi Aksesibilitas (Matikan jika pengguna memilih reduce motion) */
@media (prefers-reduced-motion: reduce) {
  .animate-card-gradient,
  .animate-ambient-pulse-1,
  .animate-ambient-pulse-2,
  .animate-sheen-sweep {
    animation: none !important;
  }
}
```

---

## 4. Struktur Kode Komponen (JSX / TSX Pattern)

Berikut pola penerapan standar pada komponen kartu:

```tsx
import { Target, ArrowUpRight } from 'lucide-react';

export function LivingGradientCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white cursor-pointer select-none shadow-md shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 animate-card-gradient border border-white/20"
    >
      {/* 1. Luminous Highlight Kiri Atas (Timbul-Redup) */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-12 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(147,197,253,0.22)_40%,transparent_70%)] blur-2xl pointer-events-none animate-ambient-pulse-1"
      />

      {/* 2. Deep Counter Glow Kanan Bawah (Bergantian Terang-Redup) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -right-12 w-52 h-52 sm:w-68 sm:h-68 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.38)_0%,rgba(59,130,246,0.20)_45%,transparent_70%)] blur-2xl pointer-events-none animate-ambient-pulse-2"
      />

      {/* 3. Sapuan Ambient Kilau Kaca */}
      <div
        aria-hidden="true"
        className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-sheen-sweep"
      />

      {/* Indikator Panah Kanan Atas */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 group-hover:text-white transition-colors duration-200 z-10">
        <ArrowUpRight className="w-5 h-5 stroke-[1.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 pr-7 sm:pr-8">
        {/* Box Icon Transparan Glassmorphism */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:bg-white/25 transition-colors duration-200 shadow-xs">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Teks Informasi */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-xs">
            Atur Penilaian KPI Umum
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed max-w-2xl line-clamp-2 drop-shadow-2xs">
            Kamus &amp; master indikator kinerja baku, bobot evaluasi, dan dasar ukur standar perusahaan.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Prinsip Aksesibilitas & Performa GPU

1. **Hardware Acceleration (`will-change`)**:
   - Seluruh animasi memanfaatkan akselerasi GPU murni melalui `transform` dan `opacity`.
   - Menghindari animasi properti berat seperti `filter: blur(...)` atau `box-shadow` secara terus menerus agar tidak memicu CPU repaint pada perangkat mobile.
2. **Tidak Mengganggu Interaksi Pointer**:
   - Semua elemen dekoratif latar belakang wajib menyertakan `pointer-events-none` dan `aria-hidden="true"`.
3. **Keterbacaan Teks (WCAG Compliance)**:
   - Teks menggunakan warna putih solid (`text-white`) dengan `drop-shadow-xs` dan kontras rasio di atas `4.5:1` terhadap seluruh area gradasi biru tua.
4. **Pengurangan Gerakan (Reduced Motion)**:
   - Sesuai standar web modern, jika pengguna mengaktifkan mode hemat gerak (*prefers-reduced-motion*), seluruh animasi otomatis dinonaktifkan tanpa merusak tampilan gradasi awal.

---

## 6. Checklist Verifikasi Implementasi

- [x] Kartu tetap menggunakan spektrum warna primer aplikasi (Blue/Indigo), tanpa warna asing.
- [x] Sumber arah cahaya gradasi bergeser secara mulus dan tidak tersentak.
- [x] Efek timbul dan redup (*breathing pulse*) terjadi secara gradual dan berlawanan fase antara sudut atas dan sudut bawah.
- [x] Teks judul dan deskripsi tetap terbaca sangat jelas (kontras tinggi).
- [x] Pada mobile, kartu tetap responsif, tidak menyebabkan horizontal overflow (`overflow-hidden`), dan deskripsi dibatasi rapi (maksimal 2 baris).
- [x] Transisi hover mulus meningkatkan bayangan dan mengangkat panah indikator.
