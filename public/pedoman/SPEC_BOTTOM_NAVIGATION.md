# PEDOMAN SPESIFIKASI DOKUMENTASI: BOTTOM NAVIGATION & APP SHELL LAYOUT SYSTEM

Dokumen ini berisi spesifikasi arsitektur, panduan teknis, dan prompt standar untuk implementasi sistem **Bottom Navigation** serta **App Shell Layout** pada aplikasi web/mobile responsive.

---

## 1. PENDAHULUAN & FILOSOFI DESAIN

### 🔍 Masalah Utama Pada Layout Mobile Konvensional (Root Cause)
Secara tradisional, aplikasi web mobile sering menggunakan `position: fixed; bottom: 0;` untuk meletakkan Bottom Navigation Bar di bagian bawah layar. 
Pendekatan ini memiliki kelemahan struktural mendasar:
1. **Keluar dari Document Flow:** Elemen `fixed` mengambang di atas konten utama, sehingga bagian paling bawah dari area scroll konten akan tertutup/tenggelam di balik bar navigasi.
2. **Workaround Padding Manual (`pb-20`, `pb-24`):** Developer terpaksa menyuntikkan padding bawah buatan pada setiap halaman. Hal ini rapuh (*fragile*), menyebabkan *whitespace* berlebih ketika navigasi disembunyikan atau saat halaman tidak memiliki Bottom Navigation, serta menyulitkan pemeliharaan kode.

### 🛠️ Solusi: Standard Flexbox Grid Flow (App Shell Layout)
Sistem ini membuang pendekatan `fixed overlay` dan menggantinya dengan **Flexbox Grid Flow Terstruktur**. Bottom Navigation dijadikan sebagai **elemen struktural bawaan (`shrink-0`)** yang hidup di dalam kontainer utama berukuran `100dvh` (`h-dvh`).

---

## 2. STRUKTUR KONSEPTUAL APP SHELL (`AppLayout.tsx`)

Layout aplikasi dibangun menggunakan rantai Flexbox vertikal yang dikunci (*viewport-clamped*) pada tinggi layar penuh `100dvh`:

```
┌─────────────────────────────────────────────────────────────┐
│ [ App Container ]  (h-dvh / 100dvh flex flex-col overflow-hidden) │
├─────────────────────────────────────────────────────────────┤
│ ├── [ Top Header & Subbar Portal ] (shrink-0 z-30)          │
│ │   ├── Mobile Header / Desktop Header                      │
│ │   └── PageHeaderSubbar Portal (Inline Tab Header)         │
│ │                                                           │
│ ├── [ Main Content Scroll Container ] (#main-content-scroll)│
│ │   ├── class: flex-1 min-h-0 overflow-y-auto p-3.5 pb-8    │
│ │   └── <Outlet /> (Tempat Halaman Dirender)                │
│ │                                                           │
│ └── [ Bottom Navigation / Action Portal Container ]         │
│     └── class: md:hidden shrink-0 w-full relative z-40      │
│         ├── <BottomNavigation /> (Daftar 5 Tab Standar)     │
│         └── <MobileBottomBar /> (Action Bar Khusus Halaman) │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. MEKANISME & PRINSIP KERJA UTAMA

### A. Kontainer Scroll Terisolasi (`flex-1 min-h-0 overflow-y-auto`)
* **`flex-1 min-h-0`**: Memaksa kontainer scroll `#main-content-scroll` secara fleksibel memakan *seluruh sisa ruang vertikal* yang tersedia di antara Header atas dan Navigasi bawah.
* **`overflow-y-auto`**: Menjadikan kontainer utama sebagai satu-satunya area yang menangani *vertical scrolling*. Body dokumen (`window`) tidak pernah di-scroll.

### B. Padding Bawah Otomatis & Konsisten (`pb-8 sm:pb-10 md:pb-12`)
* Kontainer `#main-content-scroll` dikonfigurasi dengan padding bawah terpusat: `pb-8` (32px) di mobile, `sm:pb-10` (40px), dan `md:pb-12` (48px) di desktop.
* **Bebas Overhead Workaround:** Karena Bottom Navigation memotong batas bawah kontainer scroll (bukan menimpanya), padding `pb-8` ini murni berfungsi sebagai *breathing space* (jarak nafas) yang elegan. Konten paling bawah tidak akan pernah menempel pas di batas navigasi maupun batas viewport, baik ketika Bottom Navigation tampil maupun tersembunyi.

### C. Portal Action Bar Khusus Halaman (`MobileBottomBar`)
* Apabila sebuah halaman membutuhkan tombol aksi khusus di bagian bawah (misalnya: *Button "Simpan Perubahan"*, *Action Portal Filter*), halaman dapat memanggil komponen `<MobileBottomBar>` dari `MobileNavContext`.
* Secara otomatis, `MobileBottomBar` akan mengaktifkan portal `mobile-bottom-action-portal` dan **menyembunyikan 5-tab Bottom Navigation standar** dengan transisi yang mulus.
* Saat pengguna berpindah halaman, state akan secara otomatis di-reset oleh `MobileNavContext`, dan 5-tab Bottom Navigation akan kembali tampil normal.

### D. Penanganan Safe Area iOS & Android (`pb-safe`)
* Komponen Bottom Navigation dilengkapi utility `pb-safe` (memanfaatkan `env(safe-area-inset-bottom)`) untuk memastikan tombol tab tidak tertutup oleh gestur *Home Indicator* pada perangkat iOS atau bar gestur Android.

### E. Responsive Desktop Behavior (`md:hidden`)
* Seluruh wrapper Bottom Navigation dibungkus kelas `md:hidden`. Pada layar desktop (`>= 768px`), Bottom Navigation otomatis lenyap tanpa menyisakan ruang kosong, dan navigasi utama beralih ke Desktop Sidebar secara seamless.

---

## 4. ATURAN PENGEMBANGAN (DO'S & DON'TS)

### ✅ HARUS DILAKUKAN (DO'S):
1. **Gunakan `MobileBottomBar` untuk Action Bar:** Selalu gunakan komponen `<MobileBottomBar>` dari `@/context/MobileNavContext` jika ingin membuat bar aksi bawah khusus di mobile.
2. **Gunakan `<HideBottomNav />` jika Halaman Perlu Tampilan Penuh:** Jika suatu halaman khusus (seperti Job Desk / Fullscreen Canvas) tidak boleh menampilkan Bottom Navigation, panggil komponen `<HideBottomNav />`.
3. **Biarkan Layout Utama Mengatur Padding:** Percayakan padding area bawah pada kontainer `#main-content-scroll` di `AppLayout.tsx`.

### ❌ DILARANG KERAS (DON'TS):
1. **DILARANG memakai `position: fixed; bottom: 0;`** pada Bottom Navigation atau elemen bar bawah global baru.
2. **DILARANG menyuntikkan padding bottom buatan (`pb-20`, `pb-24`, `pb-32`)** di dalam kode halaman individual hanya untuk menghindari Bottom Navigation.
3. **DILARANG mengatur `overflow: hidden` atau `height: 100vh` pada body/root** secara paksa yang merusak struktur `100dvh` di `AppLayout.tsx`.

---

## 5. REUSABLE PROMPT UNTUK PENGEMBANGAN DI KEMUDIAN HARI

Apabila Anda meminta AI Agent atau Developer untuk membuat halaman baru atau memperbaiki masalah layout mobile, gunakan templat prompt standar berikut:

### 📋 Templat Prompt (Bahasa Indonesia):
```text
Ikuti pedoman arsitektur App Shell & Bottom Navigation yang tercantum dalam public/pedoman/SPEC_BOTTOM_NAVIGATION.md:

1. DILARANG menggunakan position: fixed bottom-0 pada navigasi bawah atau bar aksi global.
2. DILARANG menambahkan padding bottom buatan (seperti pb-20, pb-24, pb-32) pada komponen halaman. Kontainer utama (#main-content-scroll) di AppLayout.tsx secara otomatis mengatur ruang scroll dan padding bawah (pb-8 sm:pb-10 md:pb-12) secara struktural menggunakan Flexbox Grid Flow (shrink-0).
3. Jika halaman membutuhkan tombol aksi khusus di bagian bawah pada layar mobile, gunakan komponen <MobileBottomBar> dari '@/context/MobileNavContext'. Komponen ini akan menyuntikkan tombol ke portal secara otomatis dan menyembunyikan 5-tab Bottom Nav standar secara bersih.
4. Jika halaman harus menyembunyikan Bottom Nav, gunakan komponen <HideBottomNav /> dari '@/context/MobileNavContext'.
5. Pastikan layout mobile menggunakan kelas Tailwind yang responsif (sm:, md:, lg:) dan mendukung pb-safe untuk gesture area iOS/Android.
```

### 📋 Standard Prompt Template (English):
```text
Adhere strictly to the App Shell & Bottom Navigation architecture guidelines specified in public/pedoman/SPEC_BOTTOM_NAVIGATION.md:

1. DO NOT use `position: fixed bottom-0` for global bottom navigation or custom action bars.
2. DO NOT add hardcoded bottom padding workarounds (e.g., pb-20, pb-24, pb-32) inside individual page components. The layout container (#main-content-scroll) in AppLayout.tsx centrally handles scroll bounds and bottom spacing (pb-8 sm:pb-10 md:pb-12) via Standard Flexbox Grid Flow (shrink-0).
3. If a page requires a custom mobile bottom action bar (e.g. "Save" or "Apply" buttons), wrap the actions inside <MobileBottomBar> from '@/context/MobileNavContext'. This automatically portals the actions and hides the default 5-tab Bottom Navigation bar smoothly.
4. To hide the bottom navigation bar on specific pages, mount the <HideBottomNav /> component from '@/context/MobileNavContext'.
5. Ensure mobile layouts respect iOS/Android gesture safe area insets via `pb-safe`.
```

---
*Spesifikasi ini berlaku untuk seluruh komponen halaman dan modul dalam aplikasi.*
