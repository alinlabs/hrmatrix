# Panduan & Spesifikasi Baku Implementasi Modal & Bottom Sheet (Mobile-First)

Dokumen ini adalah **standar baku arsitektur dan antarmuka (UI/UX)** untuk seluruh komponen Modal dan Pop-up di aplikasi HRMatrix. Standar ini dirancang khusus untuk menjamin konsistensi antara **Modal Dialog di layar Desktop** dan **Bottom Sheet di layar Mobile**, mencegah bug tata letak (khususnya tabrakan dengan Bottom Navigation), serta memastikan animasi dan interaksi penutupan berjalan sempurna.

---

## 📌 Daftar Isi
1. [Aturan Inti & Lifecycle Modal](#1-aturan-inti--lifecycle-modal)
2. [Metode Penutupan Modal (Close Methods)](#2-metode-penutupan-modal-close-methods)
3. [Aturan Khusus: Preservasi Bottom Navigation (Mobile Mode)](#3-aturan-khusus-preservasi-bottom-navigation-mobile-mode)
4. [Anatomi Standar Modal (Header, Body, Footer)](#4-anatomi-standar-modal-header-body-footer)
5. [Penguncian Scroll & Form State Lifecycle](#5-penguncian-scroll--form-state-lifecycle)
6. [Rekomendasi Template Kode Best Practice](#6-rekomendasi-template-kode-best-practice)
7. [Checklist Verifikasi Implementasi Modal](#7-checklist-verifikasi-implementasi-modal)

---

## 1. Aturan Inti & Lifecycle Modal

### ❌ DILARANG: Pemotongan Render Instan (`if (!isOpen) return null;`)
- **JANGAN PERNAH** menuliskan `if (!isOpen) return null;` di parent component atau di dalam komponen modal kustom Anda.
- **Penyebab**: Menghilangkan siklus *unmounting* animasi yang dikelola oleh `<AnimatePresence>` dari library `motion/react`. Akibatnya, animasi penutup (*exit animation* seperti slide down / fade out) terputus seketika dan modal menghilang secara kasar/patah (*flicker*).
- **Solusi**: Selalu bungkus konten dengan komponen `<Modal>` dari `src/components/ui/Modal.tsx`. Komponen `<Modal>` sudah otomatis mengelola `<AnimatePresence>` dan kondisi `isOpen`.

```tsx
// ❌ SALAH: Memotong siklus AnimatePresence
export function ModalKustom({ isOpen, onClose }) {
  if (!isOpen) return null; // Animasi exit akan rusak!
  return <Modal isOpen={isOpen} onClose={onClose}>...</Modal>;
}

// ✅ BENAR: Biarkan <Modal> menangani transisi masuk & keluar
export function ModalKustom({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-lg">
      ...
    </Modal>
  );
}
```

---

## 2. Metode Penutupan Modal (Close Methods)

Penutupan modal harus ramah pengguna, konsisten di seluruh aplikasi, dan mendukung aksesibilitas keyboard maupun sentuhan.

### Terdapat 4 Jalur Resmi Penutupan Modal:
1. **Tombol Silang (X Close Icon) di Kanan Atas Header (Wajib):**
   - Berada di posisi paling kanan dalam grup tombol aksi header.
   - Menggunakan ikon `<X className="w-4 h-4" />` dari `lucide-react`.
   - Styling baku:
     ```tsx
     <button
       type="button"
       onClick={onClose}
       className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
       title="Tutup"
       aria-label="Tutup Modal"
     >
       <X className="w-4 h-4" />
     </button>
     ```

2. **Klik Latar Belakang (Backdrop Click):**
   - Mengklik area buram (*backdrop overlay*) di luar kontainer modal otomatis memanggil `onClose()`.
   - **Spesifikasi Efek Gelap & Blur**: Standar baku overlay adalah **`bg-slate-900/30 backdrop-blur-sm`** (tingkat kegelapan 30% dengan efek blur lembut/soft 4px).
   - **Catatan Penting saat Submitting**: Saat proses pengiriman formulir sedang berlangsung (`isSubmitting === true`), cegah penutupan tidak sengaja dengan mengabaikan klik backdrop atau menonaktifkan tombol close sementara.

3. **Tombol Escape Keyboard (`Esc`):**
   - Pengguna desktop dapat menekan tombol `Escape` di keyboard untuk menutup modal secara instan. Fitur ini sudah terintegrasi langsung di dalam komponen `<Modal />`.

4. **Penutupan Pasca-Submit Berhasil (Programmatic Close):**
   - Setelah aksi simpan / ubah / hapus berhasil dieksekusi, fungsi `onClose()` atau `setIsOpen(false)` dipanggil.
   - Panggil penutupan hanya di blok `try` setelah operasi database/API selesai (bukan di `finally` jika terjadi error validasi).

### ⛔ ATURAN KERAS: DILARANG TOMBOL "BATAL" DI FOOTER!
- **DILARANG KERAS** menambahkan tombol `"Batal"`, `"Cancel"`, atau tombol sekunder berdampingan di bagian footer modal.
- Footer modal dicadangkan **HANYA untuk 1 Tombol Aksi Utama** (contoh: *"Simpan"*, *"Buat Periode"*, *"Terapkan"*).
- Alur pembatalan sepenuhnya didelegasikan ke tombol **X Close di header**, klik backdrop, atau tombol Escape.

---

## 3. Aturan Khusus: Preservasi Bottom Navigation (Mobile Mode)

### ⚠️ Masalah Umum yang Sering Terjadi
Pada beberapa halaman aplikasi (misalnya: **Halaman Detail Karyawan**, **Detail Payroll**, **Formulir Pengaturan**, **Katalog KPI Umum**, atau **Sub-tab Tertentu**), bilah navigasi bawah (*Bottom Navigation Bar*) **secara sengaja disembunyikan** sejak awal (`hideBottomNav = true`).

Ketika pengguna membuka modal di halaman tersebut, modal menyembunyikan bottom navigation. Namun ketika modal **DITUTUP**, navigasi bawah **MUNCUL KEMBALI SECARA TIBA-TIBA**. Ini adalah cacat UI yang merusak tata letak mobile!

### 🔍 Akar Masalah Teknis
Dahulu, komponen modal atau penutup memanggil `setHideBottomNav(false)` secara langsung saat unmount. Pemanggilan ini menimpa (*overwrite*) status asli halaman pemanggil yang sebenarnya ingin tetap menyembunyikan navigasi.

### 🛡️ Solusi & Standar Arsitektur (Token-Based / Stack Registry)
Komponen `<Modal>` dan `<HideBottomNav>` di `MobileNavContext.tsx` kini menggunakan mekanisme **Pendaftaran Token Unik (Reference Counting)**:
1. **Pendaftaran Saat Buka (Mount)**: Ketika modal dibuka, modal mendaftarkan token unik ke dalam Set `hideBottomNavTokens`.
2. **Pencabutan Saat Tutup (Unmount)**: Ketika modal ditutup, modal **HANYA mencabut token miliknya sendiri**.
3. **Hasil**:
   - Jika halaman pemanggil aslinya **memiliki bottom nav** (misal: Dashboard utama), bottom nav akan kembali tampil saat modal ditutup.
   - Jika halaman pemanggil aslinya **TIDAK memiliki bottom nav** (misal menggunakan `<HideBottomNav />` atau `setHideBottomNav(true)`), status halaman tersebut tetap aktif dan bottom nav **TETAP TERSEMBUNYI**!

### 📋 Panduan Bagi Developer:
- Selalu gunakan wrapper baku `<Modal isOpen={...} onClose={...}>`.
- Jangan pernah memanggil `setHideBottomNav(false)` secara manual di dalam handler `onClose()` atau `handleSubmit()` Anda! Biarkan konteks global yang mengelolanya secara otomatis.
- Pada halaman yang memang tidak boleh memiliki bottom nav (seperti halaman form bertingkat atau sub-halaman wizard), pasang komponen `<HideBottomNav />` di level halaman tersebut:
  ```tsx
  import { HideBottomNav } from '@/context/MobileNavContext';

  export function HalamanDetail() {
    return (
      <div className="p-4">
        {/* Pastikan halaman ini selalu menyembunyikan bottom nav */}
        <HideBottomNav />
        {/* Konten & Modal Anda */}
      </div>
    );
  }
  ```

---

## 4. Anatomi Standar Modal (Header, Body, Footer)

Struktur modal harus menggunakan tata letak *flex-col* yang kaku dengan pembagian zona jelas:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER (Shrink-0, Border-b)                              │
│ [Icon Card] Judul Modal                  [Del] [Edit] [ X ] │
│             Sub Judul Keterangan                            │
├─────────────────────────────────────────────────────────────┤
│ 2. BODY (Flex-1, Scrollable overflow-y-auto, p-4 sm:p-6)    │
│                                                             │
│ Form Input, Kartu Pilihan, Rentang Tanggal, Informasi dsb   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 3. FOOTER (Shrink-0, Border-t, Single Action, Full Width)   │
│ [=================== TOMBOL AKSI UTAMA ===================] │
└─────────────────────────────────────────────────────────────┘
```

### 1. Zona Header Modal
- **Card Icon (Opsional)**: Ikon representatif di kiri judul dengan kontainer:
  `w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0`
- **Judul**: `font-bold text-sm sm:text-base text-slate-900 leading-tight truncate`
- **Sub Judul**: `text-xs text-slate-500 font-medium mt-0.5 truncate`
- **Grup Aksi Kanan (Header Actions)**: Menggunakan `flex items-center gap-1 shrink-0 ml-2`. Urutan baku tombol dari kiri ke kanan:
  1. Tombol Search (opsional): Ikon `Search`, hover blue-50 & text-blue-600.
  2. Tombol Hapus (opsional): Ikon `Trash2`, hover rose-50 & text-rose-600.
  3. Tombol Edit (opsional): Ikon `Pencil`, hover blue-50 & text-blue-600.
  4. Tombol Tutup Silang (Wajib): Ikon `X`, hover slate-100 & text-slate-600.

#### 🔍 Mekanisme Modal Header Morphing Searchbar (Aturan Baku)
Jika modal memiliki fitur pencarian di header (seperti Modal Pilih Template Tunjangan), saat ikon `<Search />` diklik, header modal bertransformasi (*morphing*) menjadi **Inline Searchbar Frameless**:
1. **Langsung pada Latar Putih Header (`bg-white`) & TANPA IKON SEARCH INTERNAL**: TANPA card/box background abu-abu, TANPA border/outline kaku, dan **TANPA ikon `<Search />` internal** di area input. Input teks berukuran `text-xs sm:text-sm font-medium` menggunakan `bg-transparent border-none outline-none ring-0 focus:ring-0 p-0`.
2. **Ikon Kiri (`<ChevronLeft />`)**: Berfungsi sebagai tombol **Kembali (Back)** untuk membatalkan/menutup mode pencarian dan mengembalikan tampilan ke header judul utama normal.
3. **Ikon Kanan (`<X />`) — HANYA MUNCUL KETIKA ADA TEKS**: Berfungsi khusus untuk **menghapus/delete isi teks pencarian** (`setSearchQuery('')`). **HANYA DITAMPILKAN KETIKA ADA TEKS** (`searchQuery !== ''`). Jika teks pencarian kosong, ikon `X` **TIDAK DITAMPILKAN** (sembunyi/tidak dirender).
4. **Stabilitas Tinggi Kontainer Modal (Fixed Height)**: Ketika modal mengaktifkan searchbar atau melakukan penyaringan data (termasuk kondisi *empty state* / 0 hasil), tinggi modal **WAJIB TETAP STABIL** (menggunakan `contentClassName="sm:max-w-2xl h-[85vh] sm:h-[620px] max-h-[90vh] flex flex-col"`). Tinggi modal **DILARANG MENGECIL ATAU MENGUNCUT**.

### 2. Zona Body Modal
- Padding seragam: `p-4 sm:p-6`
- Scroll mandiri: `overflow-y-auto min-h-0 space-y-4 text-xs`
- **Tinggi Maksimal di Layar Mobile**: Menggunakan batas `max-h-[calc(100dvh-4rem)]` yang memastikan modal tidak akan pernah menabrak atau menimpa header atas aplikasi.

### 3. Zona Footer Modal (Single Action, Full Width)
- Padding: `p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white`
- Tombol: Membentang penuh (`w-full`), tebal (`font-bold text-sm py-2.5 rounded-xl`), warna solid (`bg-blue-600 hover:bg-blue-700 text-white`), tanpa icon, dan tanpa tombol Batal.
- Indikator Loading: Saat `isSubmitting`, tombol di-disable dan teks berubah (misal: `"Menyimpan Data..."`).

---

## 5. Penguncian Scroll & Form State Lifecycle

1. **Penguncian Scroll Halaman Belakang (Scroll Lock)**:
   - Komponen `<Modal>` sudah otomatis mengaktifkan `useScrollLock(isOpen)` sehingga saat modal terbuka, latar belakang halaman tidak dapat digulir (*anti-scroll bleeding*).
2. **Inisialisasi & Reset Form State**:
   - Inisialisasi data form **harus dilakukan saat modal terbuka** (`if (isOpen)` di dalam `useEffect`), **BUKAN** saat modal ditutup.
   - Mengosongkan form saat modal ditutup akan menyebabkan *flicker* visual di mana teks form menghilang sebelum animasi penutup selesai meluncur turun.

---

## 6. Rekomendasi Template Kode Best Practice

Gunakan template baku ini untuk pembuatan modal form baru:

```tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Pencil, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui';

interface ModalContohProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: any) => Promise<void> | void;
  initialData?: any;
}

export function ModalContoh({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData
}: ModalContohProps) {
  const [formData, setFormData] = useState({ nama: '', keterangan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi nilai form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ nama: initialData.nama || '', keterangan: initialData.keterangan || '' });
      } else {
        setFormData({ nama: '', keterangan: '' });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Nama wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitSuccess(formData);
      onClose(); // Tutup modal hanya setelah sukses
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg" // Lebar responsif di desktop
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Card Icon Opsional */}
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Judul Periode Baru
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Buat kelompok data evaluasi baru
              </p>
            </div>
          </div>

          {/* Grup Aksi Kanan (Urutan: Delete -> Edit -> Close X) */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Nama Item <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
              placeholder="Masukkan nama..."
              className="w-full h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* 3. Modal Footer (Single Action, Full Width, Tanpa Tombol Batal) */}
        <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>

      </form>
    </Modal>
  );
}
```

---

## 7. Checklist Verifikasi Implementasi Modal

Gunakan checklist ini sebelum menyelesaikan pembuatan atau pengubahan modal:

- [ ] Menggunakan wrapper `<Modal>` dari `src/components/ui/Modal.tsx`.
- [ ] **TIDAK ADA** kode `if (!isOpen) return null;` di luar modal.
- [ ] Header memiliki tombol tutup silang (`X`) di paling kanan.
- [ ] Tombol Escape keyboard berfungsi menutup modal.
- [ ] Klik backdrop di luar modal menutup modal.
- [ ] **Footer HANYA SATU tombol utama full width (`w-full`) tanpa icon**.
- [ ] **TIDAK ADA tombol "Batal" di footer**.
- [ ] **Khusus Mobile Mode**: Ketika modal ditutup pada halaman yang aslinya tidak punya bottom nav, bilah navigasi bawah **TETAP TIDAK MUNCUL**.
- [ ] Form state di-reset saat `isOpen === true`, bukan saat modal ditutup.
- [ ] Body modal memiliki batas tinggi dan scrollable (`overflow-y-auto`).
- [ ] State loading / submit menonaktifkan tombol dan mencegah penutupan prematur.
