# Panduan Refactoring Arsitektur Halaman Modular (Standard Directory Pattern)
## Standard Operating Procedure (SOP) Arsitektur Modul Halaman

Dokumen ini adalah standar arsitektur dan pedoman refactoring resmi untuk memecah halaman monolitik (*god component*) menjadi struktur modular yang rapi, berkinerja tinggi, mudah dirawat, mematuhi seluruh spesifikasi desain (`SPEC_*.md`), dan ramah pemrosesan AI (*token limit safety*).

---

## 1. Prinsip Utama: Single Flat Directory per Halaman

> [!IMPORTANT]
> **Aturan Mutlak (Zero Nested Folders Rule):**
> Seluruh file komponen, form, seksi, modal, kartu, view, utilitas, combobox, dan tipe data yang berkaitan dengan satu modul halaman **WAJIB berada langsung di dalam 1 direktori datar (single flat directory)**:
>
> `src/pages/[nama-halaman]/*.ts` atau `src/pages/[nama-halaman]/*.tsx`
>
> **DILARANG KERAS** membuat sub-direktori bersarang (seperti `forms/`, `modals/`, `components/`, `tabs/`, `sub/`, dll.) di dalam folder halaman tersebut.

### Alasan & Keuntungan:
1. **Navigasi Kode yang Bersih & Cepat**: Pengembang dan AI agent dapat langsung menemukan seluruh file pendukung fitur tanpa harus menelusuri hierarki subfolder yang dalam.
2. **Impor Sederhana (`./`)**: Semua file modular dalam satu modul halaman saling mengimpor secara langsung via `./[nama-file]` tanpa variasi kedalaman relative path (`../../../` vs `../../`).
3. **Mencegah Fragmentasi**: Tidak ada duplikasi file `index.ts` re-export di setiap sub-folder yang memperumit dependensi sirkular.

---

## 1.1. Aturan Emas Refactoring: Preservasi UI & Non-Regresi

> [!WARNING]
> **1. Preservasi UI Mutlak (Strict UI Preservation):**
> Refactoring **TIDAK BOLEH** mengubah tampilan visual (UI), tata letak layout, skema warna, margin, padding, tipografi, rounded corners, atau transisi/animasi estetika yang sudah ada, kecuali diperintahkan secara eksplisit. Tampilan visual sebelum dan sesudah refactoring wajib dipertahankan 100% identik dan konsisten.
>
> **2. Non-Regresi Fungsional (Non-Regression Rule):**
> Lakukan analisis dependensi dengan sangat hati-hati agar **tidak mengubah, merusak, atau menghilangkan fungsi, aliran data, state internal, logika query database, atau mekanisme pendukung lainnya**. Seluruh fitur aplikasi harus berjalan persis sama dan bebas regresi.

---

## 1.2. Protokol Audit & Analisis Pra-Refaktorisasi (Pre-Refactoring Deep Analysis Mandate)

Sebelum menulis atau memecah satu baris kode pun, AI Coding Agent **WAJIB membaca dan menganalisis file target secara menyeluruh** dari baris pertama hingga baris terakhir. Lakukan 4 tahapan audit ini:

### A. Analisis State, Dead State & Ref Usang
1. **Inventarisasi State:** Catat semua variabel state (`useState`), referensi DOM (`useRef`), kalkulasi memoized (`useMemo`), dan callback (`useCallback`).
2. **Identifikasi Dead State (State Yatim):** Cari state yang nilainya diset tapi tidak pernah dibaca di JSX, atau state sisa fitur eksperimen masa lalu. Hapus seluruh *dead state* ini agar tidak terbawa ke file pecahan baru.
3. **Pembersihan Side Effect Liar (`useEffect`):** Analisis dependency array pada setiap `useEffect`. Pastikan tidak ada dependensi objek/array mentah yang memicu re-render berulang tanpa batas (*infinite loops*), dan bersihkan effect yang sudah tidak relevan.

### B. Bug Double Crosscheck & Verifikasi Edge Cases
1. **Pemeriksaan Silang Ganda (Double Crosscheck):** Telusuri setiap fungsi handler logika bisnis sebanyak minimal 2 kali:
   - *Crosscheck 1:* Aliran input valid (data normal).
   - *Crosscheck 2:* Aliran edge cases (data kosong, `null`, `undefined`, NaN pada kalkulasi numerik, id tidak ditemukan di database, atau format tanggal tidak valid).
2. **Pembersihan Bug Latent:** Perbaiki kelemahan logika lama, hilangkan penggunaan tipe data `any` yang berbahaya, dan pastikan fallback error-handling berjalan aman (`try-catch` pada operasi database asynchronous).

### C. Eliminasi Redundansi & Konsolidasi Logika
1. **Hapus Duplikasi Kode:** Jika ditemukan blok format mata uang Rupiah, parser tanggal, mapping label badge, atau kalkulasi pajak/lembur yang ditulis berulang kali di berbagai baris, **cabut dan satukan** ke dalam file `utils-helper.ts`.
2. **Bersihkan Komentar Mati (*Commented-Out Code*):** Hapus semua baris kode lama yang dikomentari agar file hasil pecahan bersih, ringkas, dan mudah dibaca.

### D. Resolusi Konflik Kode & Inkonsistensi Tipe
1. **Konflik Tipe Data:** Identifikasi dan selesaikan tipe data yang ambigu (misal: variabel `id` yang di satu baris diperlakukan sebagai `string` namun di baris lain sebagai `number`). Selaraskan sesuai schema di `src/types/index.ts` atau `src/db/database.ts`.
2. **Resolusi Shadowing & Bentrok Variabel:** Perbaiki variabel lokal yang menimpa nama variabel global atau impor lain dengan nama yang sama.

---

## 1.3. Analisis Jalur Routing & Pemetaan Sinkronisasi (Routing & Dependency Sync Audit)

Refactoring modul halaman tidak berdiri sendiri; ia terhubung ke ekosistem navigasi dan state global aplikasi. Sebelum dan sesudah refactoring, AI **WAJIB menganalisis dan memverifikasi sinkronisasi jalur berikut:**

```
[src/App.tsx (Routing)] ⟷ [AppLayout.tsx & BottomNavigation.tsx (Nav Shell)]
                                  ↕
                  [src/pages/[nama-halaman]/index.tsx]
                                  ↕
     [MobileNavContext] ⟷ [CompanyContext] ⟷ [Dexie Database (db.*)]
```

### A. Pemeriksaan Jalur Routing di `src/App.tsx`
1. **Inventarisasi Rute Terkait:** Buka dan periksa `src/App.tsx`. Cari seluruh rute `<Route>` yang mengarah ke modul yang sedang direfactor, termasuk rute bersarang atau parameter:
   - Contoh: `/payroll`, `/payroll/:id`, `/employees/add`, `/employees/edit/:id`.
2. **Validasi Impor Rute:** Pastikan nama ekspor komponen (misal: `export function EmployeesPage()`) dan path impor di `App.tsx` tetap cocok 100%. Jangan sampai ada rute yang putus atau menghasilkan halaman kosong (*blank screen*).
3. **Penanganan Rute Form Standalone:** Jika modul memiliki rute formulir mandiri (misal: `page-form-kompensasi.tsx`), pastikan rute tersebut terdaftar dengan benar di `App.tsx` dan memasang komponen `<HideBottomNav />` agar bilah navigasi bawah disembunyikan saat input data.

### B. Sinkronisasi Navigasi Shell (`AppLayout.tsx` & `BottomNavigation.tsx`)
1. **Sidebar Desktop:** Periksa daftar `NAV_ITEMS` di `src/components/layout/AppLayout.tsx`. Pastikan `path` dan logika `isActive` tetap menyala dengan benar saat pengguna berada di halaman modul atau sub-rutenya.
2. **Bottom Navigation Mobile:** Periksa `src/components/layout/BottomNavigation.tsx`. Pastikan tab navigasi mobile tetap menunjukkan indikator aktif yang sesuai dan tidak tertutup elemen halaman.

### C. Sinkronisasi Header Portal (`src/context/MobileNavContext.tsx`)
Setiap halaman modul berinteraksi dengan shell melalui portal konteks navigasi:
- `<PageHeaderTitle title="..." subtitle="..." />`: Mengisi judul di header desktop dan mobile.
- `<PageHeaderSearch value={...} onChange={...} placeholder="..." />`: Menghubungkan input pencarian header ke state filter modul.
- `<DesktopHeaderActions>` & `<MobileHeaderActions>`: Meletakkan tombol aksi (seperti "+ Tambah Data" atau "Filter") di posisi header yang tepat tanpa merusak layout.
- `<PageHeaderSubbar>`: Digunakan jika modul memiliki tab sub-navigasi sticky.

### D. Sinkronisasi Konteks Global & Relasi Database Dexie
1. **`CompanyContext` (`activeCompanyId`):** Pastikan query data Dexie di modul selalu menyaring atau memvalidasi data berdasarkan perusahaan yang aktif, agar data antar-entitas perusahaan tidak tercampur.
2. **Reaktivitas `useLiveQuery`:** Pastikan operasi penambahan (`add`), pengubahan (`update`), dan penghapusan (`delete`) langsung memicu pembaruan UI secara reaktif tanpa perlu refresh browser.
3. **Kepatuhan Relasi & Integritas Data:** Saat menghapus data entitas (misal karyawan atau aturan payroll), pastikan relasi pendukung (seperti data jadwal shift atau slip gaji) ditangani dengan aman sesuai panduan `GUIDE_DATABASE.md` (menggunakan *tombstone* atau pengecekan dependensi sebelum hapus).

---

## 1.4. Matriks Integrasi Spesifikasi Resmi (Cross-Reference Matrix)

Setiap komponen yang diekstrak selama proses refactoring **wajib mematuhi dokumen spesifikasi resmi** yang berlaku di proyek ini (`public/pedoman/`):

| Spesifikasi | File Pedoman | Aturan Refactoring Wajib |
| :--- | :--- | :--- |
| **Modal & Dialog** | `SPEC_MODAL.md` | • Gunakan wrapper standar `<Modal>` dari `src/components/ui/Modal.tsx`.<br>• **Dilarang** menulis `if (!isOpen) return null;` di komponen anak agar animasi exit tetap berjalan.<br>• Jangan buat scroll-lock manual (sudah diatur oleh `<Modal>`). |
| **Bottom Navigation & Shell** | `SPEC_BOTTOM_NAVIGATION.md` | • **DILARANG** menambahkan padding buatan (`pb-20`, `pb-24`) pada kontainer halaman (padding bawah sudah dihandle oleh `#main-content-scroll` di `AppLayout.tsx`).<br>• Gunakan `<MobileBottomBar>` untuk tombol aksi mobile tetap menempel di bawah.<br>• Gunakan `<HideBottomNav />` pada form/halaman edit mandiri. |
| **Header, Toolbar & Search** | `SPEC_HEADER_SEARCHBAR_EXPAND.md` | • Ekstrak header ke `[fitur]-header.tsx`.<br>• Hubungkan ke portal header global (`PageHeaderTitle`, `PageHeaderSearch`, `DesktopHeaderActions`, `MobileHeaderActions`).<br>• Gunakan ikon `Filter` corong segitiga dari `lucide-react`. |
| **Pencarian Combobox** | `SPEC_COMBOBOX.md` | • Gunakan `ComboboxInput` dari `src/components/ui/ComboboxInput.tsx` untuk pilihan data master/relasi.<br>• Maksimal 1 ikon di sisi kanan, dukung riwayat pencarian (`RotateCcw`), dan cegah clutter visual. |
| **Input Nominal Rupiah** | `SPEC_CURRENCY_INPUT.md` | • Gunakan format titik ribuan realtime pada input gaji, tunjangan, dan nominal.<br>• Simpan sebagai `number` murni ke IndexedDB (Dexie), bukan string berformat Rupiah. |
| **Form Bertahap / Tabs** | `SPEC_FORM_TABS_NAVIGATION.md` | • Untuk form panjang bertahap, gunakan navigasi tab sticky (`PageHeaderSubbar`) dan integrasi toggle expand/collapse. |
| **Database & Penyimpanan** | `GUIDE_DATABASE.md` | • Bedakan data seeder bawaan (`src/data/master/*.ts`, `jobs/*.ts`) dengan state hidup di Dexie DB (`src/db/database.ts`).<br>• Terapkan mekanisme *tombstone* (`deletedEntityIds`) agar data yang dihapus user tidak muncul kembali saat re-seed. |

---

## 2. Perbandingan Struktur: Benar vs Salah

### ❌ SALAH (Anti-Pattern: Subfolder Bersarang)
```text
src/pages/kompensasi/
├── forms/                           <-- DILARANG!
│   ├── form-jaminan-sosial.tsx
│   ├── form-pajak.tsx
│   └── index.ts
├── modals/                          <-- DILARANG!
│   ├── modal-bpjs-detail.tsx
│   ├── modal-pajak-detail.tsx
│   └── index.ts
├── components/                      <-- DILARANG!
│   └── stats-summary.tsx
└── index.tsx
```

### ✅ BENAR (Single Flat Directory: Satu Direktori, Beda Nama File)
```text
src/pages/kompensasi/
├── card-kompensasi-item.tsx        # Komponen kartu item individual
├── form-jaminan-sosial.tsx         # Form input BPJS Kesehatan & Ketenagakerjaan
├── form-pajak.tsx                  # Form regulasi Pajak PPh 21 (TER & Pasal 17)
├── form-tunjangan.tsx              # Form tunjangan, bonus, dan formula insentif
├── index.tsx                       # Orchestrator utama & entry point halaman
├── kompensasi-card-view.tsx        # Tampilan grid kartu kompensasi
├── kompensasi-header.tsx           # Toolbar navigasi tab, pencarian, & filter
├── kompensasi-table-view.tsx       # Tampilan tabel kompensasi
├── modal-add-kompensasi-menu.tsx   # Modal menu pilihan jenis penambahan
├── modal-bpjs-detail.tsx           # Modal detail komprehensif aturan BPJS
├── modal-pajak-detail.tsx          # Modal detail regulasi pajak TER & PPh 21
├── modal-rule-detail.tsx           # Router/dispatcher modal detail
├── modal-tunjangan-detail.tsx      # Modal detail tunjangan & insentif
├── page-form-kompensasi.tsx        # Dispatcher halaman rute formulir (/kompensasi/add, /kompensasi/edit/:id)
├── stats-summary.tsx               # Komponen KPI ringkasan metrik statistik
├── types.ts                        # Deklarasi TypeScript interface & types modul
└── utils-helper.ts                 # Utilitas kalkulasi formula, formatters, & grouping
```

---

## 3. Konvensi Penamaan File (`kebab-case`)

Pembeda peran file murni ditentukan melalui prefix nama file yang deskriptif dan konsisten menggunakan format **`kebab-case`**:

| Jenis File | Pola Penamaan | Contoh Nyata | Peran / Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| **Entry Point** | `index.tsx` | `index.tsx` | Main orchestrator, sinkronisasi live query Dexie DB, kontrol modal & filter global. |
| **Types & Schema** | `types.ts` | `types.ts` | Tipe data, interface props, dan enum spesifik modul halaman. |
| **Utilitas & Helper** | `utils-helper.ts` atau `utils.ts` | `utils-helper.ts` | Fungsi kalkulasi data, format currency/tanggal Indo, parser query, dsb. |
| **Header / Toolbar** | `[nama]-header.tsx` | `kompensasi-header.tsx`, `presensi-header.tsx` | Input filter, tab navigasi, searchbar, switch mode tampilan. |
| **Stats / KPI** | `stats-summary.tsx` / `[nama]-stats.tsx` | `stats-summary.tsx` | Kartu indikator metrik kuantitatif dan statistik modul. |
| **Views / Layouts** | `[nama]-[mode]-view.tsx` | `kompensasi-card-view.tsx`, `kompensasi-table-view.tsx` | Presentational wrapper untuk mode tampilan (card grid vs data table). |
| **Atom Card Item** | `card-[nama]-item.tsx` | `card-kompensasi-item.tsx`, `card-karyawan-item.tsx` | Render visual untuk 1 unit data pada card view. |
| **Modal Dialog** | `modal-[nama].tsx` | `modal-bpjs-detail.tsx`, `modal-add-kompensasi-menu.tsx` | Komponen popup interaktif, pratinjau detail, dan konfirmasi. |
| **Formulir Input** | `form-[nama].tsx` | `form-pajak.tsx`, `form-tunjangan.tsx` | Input fields, validasi, dan logika penyimpanan database. |
| **Seksi Form Panjang** | `section-[nama].tsx` | `section-personal-info.tsx`, `section-salary.tsx` | Potongan seksi input untuk formulir multi-langkah/panjang. |
| **Combobox Khusus** | `combobox-[nama].tsx` | `combobox-karyawan.tsx` | Dropdown pencarian entitas khusus modul (karyawan, departemen, dsb). |
| **Page Wrapper** | `page-[nama].tsx` | `page-form-kompensasi.tsx` | Halaman standalone yang dipasang pada Route terpisah di `App.tsx`. |

---

## 4. Standar Kode, Ekspor & Batas Ukuran File

### A. Wajib Menggunakan Named Exports (Bukan Default Export)
Untuk menjaga konsistensi refactoring dan kemudahan *find & replace* otomatis:
```typescript
// ✅ BENAR (Named Export)
export function KompensasiCardView({ rules, viewMode }: KompensasiCardViewProps) { ... }
export const calculateTotalDeduction = (...) => { ... };

// ❌ HINDARI (Default Export untuk Komponen Modular Internal)
export default function KompensasiCardView(...) { ... }
```

### B. Batas Ukuran File (Token Safety Guard)
- **Target Ideal:** 150 – 350 baris per file.
- **Batas Maksimum Toleransi:** Maksimal 600 baris per file.
- Jika sebuah komponen form atau modal mendekati 500–600 baris, **pecah menjadi beberapa seksi** dengan prefix `section-[nama].tsx` dan letakkan di direktori flat yang sama.

### C. Pembagian Tanggung Jawab State (State Scoping)
- **State Global Halaman (`index.tsx`):** Hanya memegang state filter global (`searchQuery`, `activeTab`), mode tampilan (`card` vs `table`), trigger buka modal (`activeModal`, `selectedId`), dan langganan database Dexie (`useLiveQuery`).
- **State Lokal (`modal-[nama].tsx` / `form-[nama].tsx`):** State input form (`formData`), status validasi lokal, dan animasi submit wajib diisolasi di dalam komponen masing-masing. Hindari *prop drilling* puluhan setter fungsi dari `index.tsx`.
- **Reset State:** Pastikan form me-reset nilai inputnya ketika modal ditutup atau saat properti `isOpen` berubah menjadi `true`.

---

## 5. Aturan Impor & Jalur Relatif (Import Pathing Rules)

1. **Impor Antar-File dalam Modul yang Sama**:
   Gunakan path flat `./[nama-file]`:
   ```typescript
   // ✅ Benar
   import { ModalBpjsDetail } from './modal-bpjs-detail';
   import { formatCurrency } from './utils-helper';
   import { KompensasiTab } from './types';
   ```

2. **Impor Komponen Global & Shared**:
   Akses langsung ke folder shared root melalui relative path tingkat 2 (`../../`):
   ```typescript
   // ✅ Benar
   import { db } from '../../db/database';
   import { Button, Input } from '../../components/ui';
   import { Modal } from '../../components/ui/Modal';
   import { ComboboxInput } from '../../components/ui/ComboboxInput';
   import { PayrollRule } from '../../types';
   import { PageHeaderTitle, PageHeaderSearch, HideBottomNav } from '../../context/MobileNavContext';
   ```

3. **Dilarang Import dari Subdirektori Lokal yang Dihapus**:
   ```typescript
   // ❌ Dilarang (karena tidak ada subfolder)
   import { FormPajak } from './forms/form-pajak';
   import { ModalDetail } from './modals/index';
   ```

---

## 6. Rincian Isi & Contoh Konteks Tiap File

### A. `types.ts`
Hanya berisi deklarasi tipe murni. Tidak ada kode eksekutif atau JSX.

```typescript
import { PayrollRule, Employee } from '../../types';

export type ViewMode = 'card' | 'table';
export type KompensasiTab = 'tunjangan' | 'jaminan' | 'pajak' | 'semua';

export interface KompensasiStats {
  totalRules: number;
  totalTunjangan: number;
  totalBpjs: number;
  totalTax: number;
}
```

### B. `utils-helper.ts`
Fungsi murni dan konstanta terpusat agar tidak diduplikasi di komponen.

```typescript
export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
```

### C. `modal-[fungsi].tsx`
Setiap modal adalah komponen mandiri yang menggunakan `<Modal>` standar dari `src/components/ui/Modal.tsx`.

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button, Input } from '../../components/ui';

interface ModalContohProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function ModalContoh({ isOpen, onClose, onSave, initialData }: ModalContohProps) {
  // PENTING: JANGAN gunakan `if (!isOpen) return null;` di sini!
  // Biarkan wrapper Modal mengontrol mounting agar transisi exit berjalan smooth.

  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
    }
  }, [isOpen, initialData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-lg p-4 sm:p-6">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Judul Modal</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
      </div>
      <form onSubmit={async (e) => { e.preventDefault(); await onSave({ name }); onClose(); }} className="space-y-4 pt-3">
        <Input label="Nama Aturan" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit" className="w-full">Simpan</Button>
      </form>
    </Modal>
  );
}
```

### D. `index.tsx` (Main Orchestrator)
Hanya merangkai alur data tanpa detail styling elemen kecil. **Perhatikan:** Bebas dari padding manual berlebih (`pb-20`) sesuai `SPEC_BOTTOM_NAVIGATION.md`.

```tsx
import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { PageHeaderTitle, PageHeaderSearch } from '../../context/MobileNavContext';
import { KompensasiHeader } from './kompensasi-header';
import { KompensasiCardView } from './kompensasi-card-view';
import { KompensasiTableView } from './kompensasi-table-view';
import { StatsSummary } from './stats-summary';
import { ViewMode, KompensasiTab } from './types';

export function KompensasiCenter() {
  // 1. Data Subscriptions (Dexie / LiveQuery)
  const rules = useLiveQuery(() => db.payrollRules.toArray(), []) || [];

  // 2. Local State (Filter, Search, Active Modal)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<KompensasiTab>('semua');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // 3. Declarative Component Layout (Bebas dari pb-20 buatan)
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeaderTitle title="Kompensasi & Benefit" subtitle="Master template payroll" />
      <PageHeaderSearch value={searchQuery} onChange={setSearchQuery} placeholder="Cari tunjangan, bonus, pajak..." />

      <StatsSummary stats={stats} />
      <KompensasiHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {viewMode === 'card' ? (
        <KompensasiCardView rules={filteredRules} />
      ) : (
        <KompensasiTableView rules={filteredRules} />
      )}
    </div>
  );
}
```

---

## 7. Prosedur Refaktorisasi 10 Langkah Baku

Saat Anda menerima tugas untuk merefactor halaman monolitik (misalnya `Payroll.tsx`, `Rekapitulasi.tsx`, `Employees.tsx`), ikuti 10 langkah terstruktur ini:

```
[Langkah 1: Audit File & Inventarisasi State, Dead State, dan Dependencies]
                                  ↓
[Langkah 2: Bug Double Crosscheck, Eliminasi Redundansi & Resolusi Konflik]
                                  ↓
[Langkah 3: Audit Jalur Routing App.tsx, Nav Shell & Sinkronisasi Ekosistem]
                                  ↓
[Langkah 4: Ekstraksi Types ke types.ts]
                                  ↓
[Langkah 5: Ekstraksi Logika & Kalkulasi ke utils-helper.ts]
                                  ↓
[Langkah 6: Isolasi Modal ke modal-*.tsx dengan Wrapper <Modal>]
                                  ↓
[Langkah 7: Ekstraksi Item & Views (Card View, Table View, Header, Combobox, Seksi)]
                                  ↓
[Langkah 8: Susun Ulang index.tsx Menjadi Murni Orchestrator]
                                  ↓
[Langkah 9: Pastikan SEMUA File Berada di 1 Flat Directory (Zero Subfolders)]
                                  ↓
[Langkah 10: Verifikasi Kompilasi & Sinkronisasi (compile_applet & lint_applet)]
```

---

## 8. Template Prompt AI untuk Eksekusi Refaktorisasi

Gunakan template prompt di bawah ini saat meminta AI Coding Agent untuk merefactor halaman:

```markdown
### INSTRUKSI REFACTORING HALAMAN KE FORMAT STANDAR MODULAR (SINGLE FLAT DIRECTORY)

Tolong lakukan refactoring menyeluruh pada halaman monolitik `[MASUKKAN_PATH_FILE_CONTOH: src/pages/payroll/index.tsx]` mengikuti standar resmi di `public/pedoman/GUIDE_REFACTORING.md`.

Ikuti seluruh tahapan berikut dengan disiplin tinggi:

1. **FASE 1: AUDIT & ANALISIS PRA-REFAKTORISASI (WAJIB DILAKUKAN SEBELUM MEMECAH KODE)**
   - **Analisa State & Dead State:** Telusuri seluruh `useState`, `useRef`, dan `useEffect`. Hapus variabel state lama yang sudah tidak terpakai (*dead state*), event handler usang, dan side effect liar.
   - **Bug Double Crosscheck:** Lakukan pemeriksaan silang ganda (minimal 2x) pada logika bisnis utama (aliran data normal dan aliran edge cases: null/undefined/angka NaN/id hilang). Perbaiki bug laten dan tipe data yang tidak aman.
   - **Eliminasi Redundansi:** Satukan semua helper duplikat (format currency, parser tanggal, mapping status) ke `utils-helper.ts`. Hapus baris kode yang dikomentari (*commented-out code*).
   - **Resolusi Konflik Kode:** Selesaikan konflik tipe data (string vs number), variabel bertabrakan, atau event handler yang berkonflik.

2. **FASE 2: AUDIT JALUR ROUTING & SINKRONISASI EKOSISTEM**
   - **Cek Routing `src/App.tsx`:** Periksa seluruh rute yang mengarah ke file ini atau sub-rute formulirnya. Pastikan impor komponen dan path URL tetap terhubung 100% tanpa ada rute putus.
   - **Cek Navigasi Shell (`AppLayout.tsx` & `BottomNavigation.tsx`):** Pastikan link navigasi dan status menu aktif tetap sinkron.
   - **Cek Portal Header (`MobileNavContext`):** Sambungkan `PageHeaderTitle`, `PageHeaderSearch`, dan aksi header dengan benar.
   - **Cek Sinkronisasi DB & Context:** Pastikan filter `activeCompanyId` dari `CompanyContext` dan query Dexie DB tetap reaktif dan konsisten.

3. **FASE 3: EKSEKUSI PEMISAHAN KE 1 DIREKTORI DATAR (SINGLE FLAT DIRECTORY)**
   Seluruh file hasil pecahan WAJIB diletakkan langsung di dalam 1 direktori datar (`src/pages/[nama-halaman]/*.ts` atau `*.tsx`) TANPA subfolder:
   - `types.ts`: Interface data tampilan, form payload, props, dan union view mode.
   - `utils-helper.ts`: Fungsi kalkulasi murni, pemformat mata uang/tanggal Indonesia, dan kamus mapping status.
   - `card-[entity]-item.tsx`: Representasi 1 baris kartu atomik dengan avatar inisial dan aksi instan.
   - `[fitur]-card-view.tsx` & `[fitur]-table-view.tsx`: Kontainer responsif grid kartu & tabel desktop.
   - `[fitur]-header.tsx` & `stats-summary.tsx`: Kontrol filter dan kartu KPI ringkasan.
   - `modal-[nama].tsx`: Modal mandiri dibungkus `<Modal>` standar (Dilarang `if (!isOpen) return null;` sesuai `SPEC_MODAL.md`).
   - `section-[nama].tsx`: Pecah seksi formulir jika formulir sangat panjang agar ukuran file tetap < 500 baris.
   - `index.tsx`: Orchestrator utama yang bersih (< 500 baris kode). DILARANG menambahkan padding buatan (`pb-20`, `pb-24`) pada kontainer halaman sesuai `SPEC_BOTTOM_NAVIGATION.md`.

4. **FASE 4: PRESERVASI UI & VERIFIKASI AKHIR**
   - **Preservasi UI Mutlak:** Tampilan visual (UI), layout, skema warna, margin, padding, tipografi, dan animasi WUJUD 100% IDENTIK sebelum dan sesudah refactoring.
   - **Non-Regresi:** Tidak ada fungsi bisnis atau query database yang hilang atau rusak.
   - **Named Exports:** Seluruh komponen menggunakan named export (`export function [Nama]`).
   - **Verifikasi Build:** Jalankan `compile_applet` dan pastikan build selesai dengan sukses dan hijau.
```

---

## 9. Checklist Verifikasi Standar

Sebelum menyelesaikan refaktorisasi modul halaman, pastikan seluruh kriteria berikut terpenuhi:

- [ ] **Audit Pra-Refaktorisasi Selesai:** Seluruh kode monolitik telah dibaca dan dianalisis secara menyeluruh dari awal hingga akhir sebelum dipecah.
- [ ] **Dead State & Variabel Usang Bersih:** Semua state tak terpakai, React refs usang, dan variabel sisa telah dihapus.
- [ ] **Bug Double Crosscheck Lolos:** Logika bisnis telah diuji silang 2x untuk data normal dan edge cases (`null`, `undefined`, NaN, dsb).
- [ ] **Redundansi & Kode Mati Tereliminasi:** Duplikasi fungsi format/kalkulasi disatukan ke `utils-helper.ts` dan baris komentar mati dihapus.
- [ ] **Konflik Kode Terselesaikan:** Inkonsistensi tipe data dan variabel yang bertabrakan telah diselaraskan.
- [ ] **Jalur Routing Sinkron (`App.tsx`):** Semua rute yang menuju ke modul dan sub-halamannya tetap valid dan terhubung.
- [ ] **Navigasi Shell & Header Sinkron:** Tautan di `AppLayout.tsx`, `BottomNavigation.tsx`, serta portal di `MobileNavContext` terhubung rapi.
- [ ] **Database & Context Sinkron:** Query Dexie DB (`useLiveQuery`) dan filter `CompanyContext` berjalan konsisten.
- [ ] **Zero Subfolders:** Semua file modul berada langsung di bawah `src/pages/[nama-halaman]/` tanpa subfolder.
- [ ] **Kebab-Case Naming:** Semua nama file menggunakan format `kebab-case` yang deskriptif.
- [ ] **Orchestrator Ramping:** File `index.tsx` bertindak sebagai orchestrator utama yang bersih (< 500 baris kode).
- [ ] **Named Exports:** Semua ekspor komponen menggunakan **Named Export** (bukan `export default`).
- [ ] **Bebas Padding Berlebih:** Tidak ada padding manual berlebih (`pb-20`, `pb-24`) pada kontainer halaman modul (`SPEC_BOTTOM_NAVIGATION.md`).
- [ ] **Modal Standar:** Semua modal menggunakan `<Modal>` standar tanpa `if (!isOpen) return null;` (`SPEC_MODAL.md`).
- [ ] **Preservasi UI 100%:** Tampilan visual (UI), layout, margin, padding, tipografi, dan gaya 100% identik sebelum dan sesudah refactoring.
- [ ] **Non-Regresi Fungsional:** Tidak ada fitur, kalkulasi, atau mekanisme database lama yang berubah, hilang, atau rusak.
- [ ] **Linter & Build Sukses:** `compile_applet` dan `lint_applet` lulus tanpa error.
