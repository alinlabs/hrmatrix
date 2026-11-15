# Standar Spesifikasi Header Halaman & Mekanisme Expanded Searchbar (SPEC_HEADER_PAGE)

Dokumen ini merupakan pedoman resmi standarisasi UI/UX, arsitektur Portal Header, dan panduan kode untuk **Header Halaman (Top Header non-modal)** serta **Expanded Inline Header Searchbar** di dalam aplikasi **HRMatrix**.

Standarisasi ini mencakup:
1. Formulasi judul utama & subjudul halaman yang ringkas, padat, dan *to the point*.
2. Arsitektur Top Header morphing tanpa card wrapper kaku.
3. Dua mekanisme pencarian cerdas terpadu:
   - **Tipe A**: *Live Exhaustive Card List Filtering* (memfilter seluruh unsur elemen setiap card).
   - **Tipe B**: *In-Page Section Search dengan Custom Pop-up Menu & Smart Smooth Scroll* untuk halaman form, detail, dan dashboard konten.

---

## 1. Standarisasi & Batasan Ketat Judul Utama & Subjudul Halaman (Top Header)

Header halaman bertindak sebagai penunjuk konteks visual tercepat bagi pengguna. Oleh karena itu, perumusan judul dan subjudul wajib mematuhi **batasan karakter yang sangat ketat (STRICT CHARACTER LIMITS)** dan keterbacaan tinggi (*high scannability*) tanpa wrapping/overflow.

```
+----------------------------------------------------------------------------------------------------+
|  [Back/Logo]   JUDUL UTAMA (Max 20 Karakter, 1-3 Kata)                      [Action Buttons /      |
|                SUBJUDUL (STRICT MAX 30 KARAKTER, 1 Baris Truncate)          Search / Filter]       |
+----------------------------------------------------------------------------------------------------+
```

### A. Judul Utama Halaman (Title)
- **Batas Maksimal Karakter**: **MAKSIMAL 20 KARAKTER** (1 sampai 3 kata kunci esensial).
- **Tipografi Desktop**: `text-base font-extrabold tracking-tight text-slate-900 leading-tight truncate`.
- **Tipografi Mobile**: `text-base font-extrabold tracking-tight text-slate-900 leading-tight truncate`.
- **Aturan Layout**: Wajib menggunakan `truncate` dan `min-w-0` agar judul tidak mendorong elemen tombol aksi header saat layar sempit.
- **Contoh Standar yang Benar (<= 20 Karakter)**:
  - `Karyawan` (8 char) — *bukan: "Daftar Seluruh Karyawan dan Pegawai Aktif Perusahaan"*
  - `Tunjangan` (9 char) — *bukan: "Manajemen Aturan Komponen Upah Tunjangan"*
  - `Jaminan Sosial` (14 char) — *bukan: "Regulasi Iuran BPJS Kesehatan dan Ketenagakerjaan"*
  - `Pajak PPh 21` (12 char) — *bukan: "Pengaturan Tarif PPh 21 dan Skema TER Resmi"*
  - `Presensi & Jadwal` (17 char) — *bukan: "Pusat Rekapitulasi Presensi Kehadiran dan Shift"*
  - `Katalog KPI` (11 char) — *bukan: "Koleksi Indikator Penilaian Kinerja Karyawan"*
  - `Penggajian` (10 char) — *bukan: "Kalkulasi dan Pemrosesan Payroll Gaji Bulanan"*

### B. Subjudul Halaman (Subtitle) — STRICT MAX 30 KARAKTER
- **Batas Maksimal Karakter**: **STRICT MAKSIMAL 30 KARAKTER** (termasuk huruf, angka, spasi, dan tanda baca).
- **Tipografi Desktop**: `text-[11px] font-medium text-slate-500 leading-none mt-1 truncate max-w-[30ch]`.
- **Tipografi Mobile**: `text-[11px] font-medium text-slate-500 leading-none mt-1 truncate max-w-[30ch]`.
- **Format**: 1 frasa deskriptif ultra-singkat, to-the-point, 1 baris (tanpa wrapping/multi-line).
- **Contoh Standar yang Benar (Strict <= 30 Karakter)**:
  - `Aturan tunjangan & insentif` (26 char)
  - `Regulasi iuran BPJS Kes & TK` (28 char)
  - `Regulasi tarif PPh 21 & TER` (27 char)
  - `Kelola data & kontrak kerja` (27 char)
  - `Rekap harian & shift kerja` (26 char)
  - `Kamus target & capaian KPI` (26 char)
  - `Hitung gaji bersih & PPh 21` (26 char)

### C. Standarisasi Header Formulir (Form Header Title & Subtitle)
- **Judul Form**: Max 20 karakter (misal: `Buat Tunjangan`, `Edit Pajak`, `Buat BPJS`).
- **Subjudul Form**: **STRICT MAKSIMAL 30 KARAKTER**.
  - Form Tunjangan: `Upah & tunjangan karyawan` (25 char)
  - Form Jaminan Sosial: `Regulasi BPJS Kes & TK` (22 char)
  - Form Pajak PPh 21: `Tarif TER & PPh 21 Pasal 17` (27 char)

### D. Matriks Batasan Ketat Karakter & Ukuran Visual Header

| Elemen Header | Maksimal Karakter | Ukuran Font Mobile | Ukuran Font Desktop | Kelas Styling Wajib |
| :--- | :--- | :--- | :--- | :--- |
| **Judul Utama** | **Max 20 Karakter** | `text-base` (16px) | `text-base` (16px) | `font-extrabold text-slate-900 leading-tight truncate min-w-0` |
| **Subjudul Header** | **STRICT MAX 30 CHAR** | `text-[11px]` (11px) | `text-[11px]` (11px) | `font-medium text-slate-500 leading-none truncate max-w-[30ch]` |
| **Judul Form** | **Max 20 Karakter** | `text-base` (16px) | `text-base` (16px) | `font-extrabold text-slate-900 leading-tight truncate min-w-0` |
| **Subjudul Form** | **STRICT MAX 30 CHAR** | `text-[11px]` (11px) | `text-[11px]` (11px) | `font-medium text-slate-500 leading-none truncate max-w-[30ch]` |
| **Search Placeholder**| **Max 50 Karakter** | `text-xs` (12px) | `text-sm` (14px) | `placeholder:text-slate-400 bg-transparent border-none` |

### E. Larangan Keras (Banned Practices)
- ❌ **DILARANG BUBUR TEKS / WRAPPING**: Subjudul TIDAK BOLEH lebih dari 1 baris. Karakter yang Melebihi 30 karakter DILARANG KERAS.
- ❌ **DILARANG MENGGUNAKAN KALIMAT PANJANG**: Dilarang memakai kata pelengkap/bunga-bunga seperti *"Aturan tunjangan, bonus, dan insentif karyawan"* (44 char - **REJECTED**), gunakan *"Aturan tunjangan & insentif"* (26 char - **APPROVED**).
- ❌ **DILARANG OVERFLOW LAYOUT**: Kontainer header wajib memiliki `min-w-0` dan `truncate` agar tombol aksi kanan tidak terdorong keluar viewport.

---

## 2. Arsitektur Top Header & React Portal Navigation

Top Header menggunakan teknik **React Portal** yang merender judul, tombol aksi, dan searchbar langsung ke elemen kontainer root pada `AppLayout.tsx`. Teknik ini menjamin:
- Nol *infinite re-render loop*.
- Transisi halaman yang instan tanpa *flicker*.
- Kemampuan *Full Header Morphing* saat mode pencarian aktif.

### Dimensi & Styling Fisik Header
- **Tinggi Desktop**: `h-16` (64px) dengan padding horizontal `px-8`.
- **Tinggi Mobile**: `h-14` (56px) dengan padding horizontal `px-3.5`.
- **Latar Belakang**: `bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs`.
- **Z-Index**: `z-30` (tetap di atas konten scrollable, di bawah modal dialog `z-50`).

---

## 3. Mekanisme Searchbar Mode Expand (Top Header & Modal Header)

Ketika pengguna mengklik icon pencarian (`Search`) pada header action (baik pada Halaman Utama maupun pada Modal Dialog), header bertransformasi (*morphing*) menjadi satu baris penuh **Expanded Inline Searchbar**.

### A. Standarisasi Searchbar Header Modal (Modal Header Morphing Searchbar)
Khusus untuk **Header Modal**, mekanisme searchbar wajib mematuhi aturan berikut:
1. **Langsung pada Latar Putih & TANPA IKON SEARCH INTERNAL**:
   - Input pencarian duduk langsung di atas latar belakang putih header (`bg-white`).
   - **DILARANG** menggunakan kontainer card/box background (`bg-slate-50`, `border`, atau `rounded-xl`).
   - **DILARANG** memasukkan ikon `<Search />` di dalam area input teks saat searchbar aktif.
   - Input menggunakan kelas frameless: `bg-transparent border-none outline-none ring-0 text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:ring-0 p-0`.
2. **Ikon Kiri (`ChevronLeft`)**:
   - Berada di posisi paling kiri header modal saat mode pencarian aktif.
   - Berfungsi sebagai **Tombol Kembali (Back)** untuk membatalkan/menutup mode pencarian dan mengembalikan header ke tampilan judul utama modal normal.
3. **Ikon Kanan (`X`) — HANYA MUNCUL KETIKA ADA TEKS**:
   - Berada di posisi paling kanan searchbar.
   - **HANYA DITAMPILKAN** jika terdapat kata kunci teks di dalam searchbar (`searchQuery !== ''`). Jika teks kosong (`searchQuery === ''`), ikon `X` **TIDAK DITAMPILKAN** (sembunyi / tidak dirender).
   - Berfungsi khusus untuk **menghapus/membersihkan isi teks dari searchbar** (`setSearchQuery('')`).
4. **Stabilitas Tinggi Modal (Fixed / Stable Height)**:
   - Saat searchbar aktif maupun saat hasil pencarian disaring (termasuk kondisi *empty state* / 0 hasil), tinggi modal **WAJIB TETAP STABIL** (menggunakan `h-[85vh] sm:h-[620px] flex flex-col`). Tinggi modal **DILARANG MENGECIL ATAU MENGUNCUT**.

```
+----------------------------------------------------------------------------------------------------+
|  [< ChevronLeft]   Input Cari Template (Frameless, No Search Icon, Direct White)...    [X (if text)]|
+----------------------------------------------------------------------------------------------------+
```

---

### B. Dua Tipe Mekanisme Pencarian Terpadu
Sistem pencarian dibagi menjadi **2 Tipe Mekanisme** tergantung sifat halaman:

```
                    +-------------------------------------------------------------------+
                    |                        MODE EXPANDED SEARCH                       |
                    +-------------------------------------------------------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
             [ TIPE A: CARD / DATA LIST ]                              [ TIPE B: NORMAL / FORM / DETAIL ]
     - Filter list secara Realtime                             - Membuka Custom Pop-up Menu di bawah searchbar
     - Deep Exhaustive Search ke SEMUA unsur elemen card       - Menampilkan seksi, label input, atau parameter
     - Card tidak cocok langsung disembunyikan                 - Klik item -> Auto Smooth Scroll + Visual Flash Highlight
```

---

### TIPE A: Halaman Card List / Grid List (Live Exhaustive Deep Filtering)

Diterapkan pada halaman yang menyajikan kumpulan data berulang berupa kartu (*cards*), baris tabel, atau grid item (contoh: Daftar Karyawan, Daftar Kompensasi/Tunjangan, Daftar Jobdesk, Katalog KPI).

#### Aturan & Perilaku:
1. **Penyaringan Realtime (Live Filter)**:
   - Setiap karakter yang diketik langsung menyaring daftar card seketika tanpa menekan tombol enter/submit.
2. **Exhaustive Deep Search (Semua Unsur Elemen Card)**:
   - Pencarian **TIDAK BOLEH** hanya mencocokkan judul/nama utama saja.
   - Sistem **WAJIB** memeriksa seluruh data dan atribut yang ada pada card:
     - **Pada Card Karyawan**: NIK, Nama Lengkap, Nama Panggilan, Email, No. Telepon, Divisi, Jabatan, Status Kerja (Tetap/Kontrak/Probation), Grade/Level, Nama Bank, Nomor Rekening.
     - **Pada Card Kompensasi (Tunjangan/Pajak/BPJS)**: Nama aturan, Kategori (Tetap/Tidak Tetap/THR), Metode Perhitungan (Nominal/Persentase/Prorata/TER/Pasal 17), Nilai Nominal/Persentase, Dasar Hukum/Regulasi, Status (Aktif/Non-Aktif), Tag, Catatan Keterangan.
     - **Pada Card Presensi**: Tanggal, Nama Karyawan, Jam Masuk, Jam Pulang, Status Presensi (Hadir/Terlambat/Cuti/Izin/Alpha), Catatan Lokasi.
     - **Pada Card KPI**: Kode KPI, Nama Indikator, Satuan Ukur, Tipe Target, Departemen Acuan, Rumus Perhitungan.
3. **Empty State Bersih**:
   - Jika tidak ada card yang cocok, tampilkan ilustrasi atau pesan kosong ramah: *"Tidak ada data yang cocok dengan kata kunci '{keyword}'"*.

---

### TIPE B: Halaman Normal / Formulir / Detail / Dashboard (In-Page Content Popup & Smooth Scroll)

Diterapkan pada halaman yang **bukan berupa card list**, seperti Formulir Pembuatan/Edit (Form Tunjangan, Form Pajak, Form BPJS, Form Karyawan), Halaman Detail Profil Karyawan, Halaman Pengaturan/Konfigurasi, atau Dashboard Analitik.

#### Aturan & Perilaku:
1. **Custom Pop-up Menu di Bawah Searchbar**:
   - Saat pengguna mengetik kata kunci di header searchbar, sistem mencocokkan kata kunci terhadap daftar seksi, grup formulir, label input, parameter aturan, atau widget yang ada di halaman tersebut.
   - Menu *pop-up* melayang (*floating card*) muncul tepat di bawah searchbar dengan posisi absolut:
     `absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-2 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150`.
2. **Isi Menu Pop-up**:
   - Setiap item menampilkan:
     - **Judul Bagian / Nama Input**: `text-xs font-bold text-slate-800`.
     - **Kategori / Lokasi Seksi**: Badge `text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md`.
     - **Deskripsi Ringkas**: `text-[11px] text-slate-500 mt-0.5`.
3. **Set Scroll Cerdas (Smart Smooth Scroll + Visual Flash Highlight)**:
   - Ketika pengguna mengklik salah satu item hasil pencarian di pop-up:
     1. Searchbar dan pop-up menu otomatis tertutup (`onClose()`).
     2. Kontainer halaman (`#main-content-scroll` atau viewport) secara otomatis melakukan **Smooth Scrolling** presisi ke target elemen tersebut (memperhitungkan tinggi fixed header 64px/56px).
     3. Elemen target diberikan efek visual **Highlight Ring Flash** selama 2 detik (`ring-2 ring-blue-500 bg-blue-50/50 transition-all duration-500`) sehingga pandangan mata pengguna langsung tertuju ke kolom/seksi tersebut.
     4. Jika elemen target adalah elemen interaktif (`input`, `select`, `textarea`, `button`), sistem langsung memberikan **Auto-Focus** ke dalam elemen tersebut.

---

## 4. Arsitektur Kode & Source Code Referensi

### A. Komponen Universal Header Search (`src/context/MobileNavContext.tsx`)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, X, Filter } from 'lucide-react';
import { useMobileNav } from './MobileNavContext';

export interface InPageSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  targetId?: string;
  onSelect?: () => void;
}

/**
 * Utility untuk melakukan scroll halus dan efek highlight visual ke elemen halaman
 */
export const scrollToElementWithHighlight = (targetId: string) => {
  const el = document.getElementById(targetId);
  if (!el) return;

  const scrollContainer = document.getElementById('main-content-scroll');
  if (scrollContainer) {
    const elRect = el.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const scrollTop = scrollContainer.scrollTop + (elRect.top - containerRect.top) - 80;
    scrollContainer.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Efek visual highlight flash
  el.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50/50', 'transition-all', 'duration-500');
  setTimeout(() => {
    el.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50/50');
  }, 2000);

  // Fokus jika elemen adalah input/tombol
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') {
    el.focus();
  } else {
    const focusable = el.querySelector<HTMLElement>('input, select, textarea, button, [tabindex="0"]');
    if (focusable) focusable.focus();
  }
};

/**
 * PageHeaderSearch Component
 * Mendukung Tipe A (Live filter) dan Tipe B (In-page popup search)
 */
export const PageHeaderSearch: React.FC<{
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClose: () => void;
  placeholder?: string;
  onFilterClick?: () => void;
  isFilterActive?: boolean;
  results?: InPageSearchResult[];
  onSelectResult?: (result: InPageSearchResult) => void;
}> = ({
  searchQuery,
  onSearchChange,
  onClose,
  placeholder = "Ketik kata kunci...",
  onFilterClick,
  isFilterActive = false,
  results,
  onSelectResult,
}) => {
  const { setIsHeaderSearchActive } = useMobileNav();
  const [mobileNode, setMobileNode] = useState<HTMLElement | null>(null);
  const [desktopNode, setDesktopNode] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsHeaderSearchActive(true);
    setMobileNode(document.getElementById('mobile-header-search-portal'));
    setDesktopNode(document.getElementById('desktop-header-search-portal'));

    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => {
      setIsHeaderSearchActive(false);
      clearTimeout(timer);
    };
  }, [setIsHeaderSearchActive]);

  const handleResultClick = (item: InPageSearchResult) => {
    if (item.targetId) {
      scrollToElementWithHighlight(item.targetId);
    }
    if (item.onSelect) {
      item.onSelect();
    }
    if (onSelectResult) {
      onSelectResult(item);
    }
    onClose();
  };

  const hasPopupResults = results !== undefined;
  const showResultsPopup = hasPopupResults && searchQuery.trim().length > 0;

  const searchContent = (
    <div className="relative w-full flex items-center gap-2.5 sm:gap-3 py-1 animate-in fade-in duration-150">
      {/* 1. Icon Back di posisi Hamburger (Frameless) */}
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
        aria-label="Kembali & Tutup Pencarian"
        title="Kembali"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
      </button>

      {/* 2. Kolom Input Search Frameless */}
      <div className="relative flex-1 flex items-center min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-8 sm:h-9 p-0 text-xs sm:text-sm bg-transparent border-none outline-none ring-0 text-slate-900 font-medium placeholder:text-slate-400 focus:ring-0"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1"
            title="Hapus pencarian"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* 3. Icon Filter Corong (Kondisional) */}
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer shrink-0 relative ${
            isFilterActive
              ? 'text-blue-600 font-semibold bg-blue-50/80'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Filter Data"
          aria-label="Filter"
        >
          <Filter className="w-5 h-5" />
          {isFilterActive && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>
      )}

      {/* 4. Type B In-Page Search Popup Menu */}
      {showResultsPopup && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 p-2 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
          {results && results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleResultClick(item)}
                className="w-full text-left p-3 hover:bg-blue-50/60 rounded-xl transition-colors cursor-pointer flex flex-col group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  {item.category && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <span className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                    {item.subtitle}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 font-normal">
              Tidak ditemukan bagian atau data yang cocok dengan "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileNode && createPortal(searchContent, mobileNode)}
      {desktopNode && createPortal(searchContent, desktopNode)}
    </>
  );
};
```

---

### B. Contoh Penggunaan TIPE A: Halaman Card List (`EmployeeList.tsx`)

```tsx
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions, PageHeaderSearch } from '../../context/MobileNavContext';

export function EmployeeListPage() {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Contoh data card list
  const employees = [/* data list karyawan */];

  // Exhaustive Deep Filtering ke seluruh komponen/unsur card
  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const query = search.toLowerCase();

    return employees.filter(emp => {
      return (
        emp.name?.toLowerCase().includes(query) ||
        emp.nik?.toLowerCase().includes(query) ||
        emp.nickname?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.phone?.toLowerCase().includes(query) ||
        emp.position?.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query) ||
        emp.employmentStatus?.toLowerCase().includes(query) ||
        emp.bankName?.toLowerCase().includes(query) ||
        emp.bankAccount?.toLowerCase().includes(query)
      );
    });
  }, [employees, search]);

  return (
    <div className="space-y-4">
      {/* 1. Header Title Standar */}
      <PageHeaderTitle 
        title="Karyawan" 
        subtitle="Kelola data master dan kontrak kerja" 
      />

      {/* 2. Tombol Search di Header Actions Normal */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Cari Karyawan"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          </DesktopHeaderActions>
          <MobileHeaderActions>
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Cari Karyawan"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>
          </MobileHeaderActions>
        </>
      )}

      {/* 3. Mode Expanded Search (Tipe A) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => {
            setIsSearchOpen(false);
            setSearch('');
          }}
          placeholder="Cari nama, NIK, jabatan, divisi, bank, nomor HP..."
          onFilterClick={() => setIsFilterOpen(true)}
        />
      )}

      {/* 4. Render Card List Terfilter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredEmployees.map(emp => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
}
```

---

### C. Contoh Penggunaan TIPE B: Halaman Form / Normal (`FormTunjangan.tsx`)

```tsx
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions, PageHeaderSearch, InPageSearchResult } from '../../context/MobileNavContext';

export function FormTunjanganPage() {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Kamus Index Bagian/Seksi Form Halaman
  const formSections = useMemo<InPageSearchResult[]>(() => [
    {
      id: 'section-info-dasar',
      title: 'Informasi Dasar Tunjangan',
      subtitle: 'Nama tunjangan, kategori, kode komponen, dan dasar hukum',
      category: 'Identitas Aturan',
      targetId: 'form-section-info-dasar'
    },
    {
      id: 'field-kategori-komponen',
      title: 'Kategori Komponen Tunjangan',
      subtitle: 'Tunjangan Tetap, Tidak Tetap, atau Bonus & Insentif',
      category: 'Kategori',
      targetId: 'form-field-kategori'
    },
    {
      id: 'section-metode-perhitungan',
      title: 'Metode & Skema Perhitungan',
      subtitle: 'Nominal tetap, persentase gaji pokok, kehadiran harian, atau prorata',
      category: 'Kalkulasi Gaji',
      targetId: 'form-section-metode'
    },
    {
      id: 'section-masa-kerja',
      title: 'Tabel Tiering Masa Kerja / Jenjang Level',
      subtitle: 'Aturan batas masa kerja dan nominal bertingkat',
      category: 'Tiering Level',
      targetId: 'form-section-tiering'
    },
    {
      id: 'field-pajak-bpjs',
      title: 'Perlakuan Pajak PPh 21 & BPJS',
      subtitle: 'Pengaturan objek pajak dan dasar upah BPJS',
      category: 'Kepatuhan Regulasi',
      targetId: 'form-field-pajak-bpjs'
    }
  ], []);

  // Filter hasil pencarian pop-up berdasarkan kata kunci
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return formSections.filter(sec => 
      sec.title.toLowerCase().includes(q) ||
      sec.subtitle?.toLowerCase().includes(q) ||
      sec.category?.toLowerCase().includes(q)
    );
  }, [formSections, search]);

  return (
    <div className="space-y-6">
      {/* 1. Header Title Standar */}
      <PageHeaderTitle 
        title="Pembuatan Tunjangan" 
        subtitle="Konfigurasi komponen upah dan tunjangan karyawan" 
      />

      {/* 2. Tombol Search di Header Actions Normal */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Cari Seksi Form"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          </DesktopHeaderActions>
          <MobileHeaderActions>
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Cari Seksi Form"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>
          </MobileHeaderActions>
        </>
      )}

      {/* 3. Mode Expanded Search (Tipe B dengan Menu Pop-up & Set Scroll) */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => {
            setIsSearchOpen(false);
            setSearch('');
          }}
          placeholder="Cari bagian form, parameter, nominal, atau pajak..."
          results={searchResults}
        />
      )}

      {/* 4. Konten Formulir dengan ID Target yang Jelas */}
      <section id="form-section-info-dasar" className="space-y-4">
        {/* Isian Form Dasar */}
      </section>

      <section id="form-field-kategori" className="space-y-4">
        {/* Pilihan Kategori */}
      </section>

      <section id="form-section-metode" className="space-y-4">
        {/* Skema Perhitungan */}
      </section>

      <section id="form-section-tiering" className="space-y-4">
        {/* Tabel Tiering */}
      </section>

      <section id="form-field-pajak-bpjs" className="space-y-4">
        {/* Checkbox Pajak & BPJS */}
      </section>
    </div>
  );
}
```

---

## 5. Matriks Perbandingan Tipe Pencarian Header

| Karakteristik | TIPE A: Halaman Card / Data List | TIPE B: Halaman Normal / Form / Detail |
| :--- | :--- | :--- |
| **Karakter Halaman** | Kumpulan kartu (*cards*), baris data, atau tabel berulang | Formulir input, halaman detail multi-seksi, dashboard analitik |
| **Aksi Saat Mengetik** | Menyaring (*live filter*) daftar kartu secara langsung | Menampilkan menu pop-up hasil pencarian di bawah searchbar |
| **Cakupan Pencarian** | **Exhaustive Deep Search**: seluruh elemen/komponen setiap card | Seluruh seksi, grup form, label input, parameter, dan deskripsi |
| **Aksi Saat Item Diklik** | Tidak ada pop-up (kartu langsung terfilter di layar) | **Set Scroll**: smooth scroll + visual highlight ring flash ke target elemen |
| **Target Scroll** | N/A | ID elemen target (`id="section-xyz"`) |
| **Tombol Filter Corong** | Ditampilkan jika ada opsi filter tambahan | Disembunyikan (`onFilterClick` tidak dipasang) |
| **Auto-Focus Target** | N/A | Otomatis meletakkan kursor ke input/field yang dituju |

---

## 6. Checklist Kepatuhan QA (Header & Searchbar Standard)

Pastikan seluruh pengujian berikut lolos sebelum melakukan *pull request* atau *deployment*:

- [ ] **Judul Halaman To The Point**: Judul utama ringkas (1–3 kata), subjudul padat (1 kalimat deskriptif pendek), tidak bertele-tele.
- [ ] **Header Morphing**: Saat searchbar dibuka, seluruh elemen header normal (hamburger, judul, logo, icon actions) disembunyikan sementara.
- [ ] **Frameless Back Button**: Tombol kembali di sisi kiri menyatu pada layout header tanpa dibungkus card/border kaku.
- [ ] **Frameless Search Input**: Kolom input pencarian tidak dibungkus box card terpisah dan tidak menggunakan icon search di dalam kolom.
- [ ] **Filter Corong Kondisional**: Icon filter di paling kanan berbentuk corong segitiga terbalik (`Filter`) dan hanya muncul jika halaman memiliki opsi filter data.
- [ ] **Exhaustive Card List Search (Tipe A)**: Pada halaman list card, pencarian memfilter dari **SEMUA UNSUR ELEMEN CARD** (bukan cuma judul utama, tapi juga NIK, status, nominal, deskripsi, departemen, tag, dsb).
- [ ] **In-Page Popup Search (Tipe B)**: Pada halaman form/detail/dashboard, pencarian memunculkan menu pop-up custom di bawah searchbar.
- [ ] **Smart Set Scroll (Tipe B)**: Mengklik item pop-up secara otomatis menutup searchbar, melakukan smooth scroll ke elemen target, memberikan visual ring highlight selama 2 detik, dan memfokuskan input target.
