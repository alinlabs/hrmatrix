# Standarisasi Card & List Karyawan (Identitas Karyawan)

Dokumen ini adalah acuan baku dan konsisten untuk seluruh komponen **Card List Karyawan**, **Quick List Karyawan**, dan **Tabel Baris Karyawan** di seluruh sistem HRMatrix.

---

## 1. Komponen Avatar Foto Profil (`<EmployeeAvatar />`)

Seluruh tampilan yang memuat foto/avatar profil karyawan **WAJIB** menggunakan komponen terstandarisasi:
```tsx
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';

<EmployeeAvatar employee={employee} size="md" />
```

### A. Mekanisme Pengambilan Data (Fetch URL)
1. **Direct Photo URL:** Membaca properti `employee.photoUrl` atau `employee.avatarUrl` jika ada.
2. **Dokumen Karyawan:** Menelusuri array `employee.documents` mencari dokumen yang namanya atau kategorinya mengandung kata `'foto'`, `'photo'`, atau `'avatar'` (misal: `"Pas Foto Terbaru (Foto Profil)"`).
3. **Google Drive Link Resolver:** Jika link berasal dari Google Drive (`drive.google.com/file/d/...` atau `drive.google.com/open?id=...`), sistem secara otomatis mengubahnya menjadi URL thumbnail gambar beresolusi optimal (`https://drive.google.com/thumbnail?id=...&sz=w500`).
4. **URL Gambar Langsung:** Jika menggunakan link langsung (CDN, Cloudinary, AWS S3, Firebase, dll.), gambar dimuat secara langsung dengan `referrerPolicy="no-referrer"`.

### B. Desain & Warna Placeholder (Ketika Foto Kosong / Gagal Dimuat)
Jika foto belum diunggah atau link gagal dimuat:
- **Latar Belakang:** `bg-slate-100/90` dengan border halus `border-slate-200/80`
- **Sudut Lengkung (Corner Radius):**
  - `size="sm"`: `w-8 h-8 rounded-[10px]`
  - `size="md"`: `w-10 h-10 rounded-[12px]` *(Ukuran standar card list)*
  - `size="lg"`: `w-12 h-12 rounded-[14px]`
  - `size="xl"`: `w-16 h-16 rounded-[18px]`
- **Warna Teks & Tipografi Inisial:**
  - Teks berwarna **Biru** (`text-blue-600 font-extrabold`)
  - Format 2 Huruf Inisial Kapital:
    - Jika nama lebih dari 1 kata: Mengambil huruf pertama kata ke-1 dan kata ke-2 (contoh: *"Agus Santoso"* &rarr; `AS`).
    - Jika nama 1 kata: Mengambil 2 huruf pertama (contoh: *"Budi"* &rarr; `BU`).
    - Jika nama kosong: Fallback `HR`.

---

## 2. Struktur Teks Identitas Karyawan (3 Baris Baku)

Blok teks identitas karyawan pada kartu list terdiri dari **3 baris terstruktur secara vertikal**:

```
[ Baris 1: Departemen ]  -> text-[11px] text-slate-400 font-medium leading-tight truncate
[ Baris 2: Nama Lengkap ] -> font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate
[ Baris 3: Posisi/Jabatan] -> text-[11px] text-slate-400 font-medium leading-tight truncate
```

### Aturan Tipografi & Styling Teks:
1. **Baris 1 (Departemen):** 
   - Ditampilkan paling atas sebelum nama.
   - Menggunakan warna abu-abu lembut `text-slate-400`, ukuran `text-[11px] font-medium`, `leading-tight truncate`.
   - Resolusi data: `employee.departmentId || 'Umum'`.
2. **Baris 2 (Nama Lengkap):** 
   - Ditampilkan di tengah dengan penekanan utama.
   - Menggunakan `font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate`.
   - Ditambahkan efek hover interaktif `group-hover:text-blue-600 transition-colors`.
3. **Baris 3 (Posisi / Jabatan):** 
   - Ditampilkan paling bawah.
   - Menggunakan warna abu-abu lembut `text-slate-400`, ukuran `text-[11px] font-medium`, `leading-tight truncate`.
   - Resolusi data: Wajib menggunakan helper `getPositionName(employee.positionId)` atau nama posisi langsung, dengan fallback `'Staff'`.

---

## 3. Struktur Card Standar (Template Siap Pakai)

```tsx
import React from 'react';
import { Employee } from '@/types';
import { getPositionName } from '@/services/positionService';
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';

interface StandardEmployeeCardProps {
  employee: Employee;
  rightAction?: React.ReactNode;
  onClick?: () => void;
}

export const StandardEmployeeCard: React.FC<StandardEmployeeCardProps> = ({
  employee,
  rightAction,
  onClick
}) => {
  const positionDisplay = getPositionName(employee.positionId) || 'Staff';
  const deptDisplay = employee.departmentId || 'Umum';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 flex items-center justify-between gap-2.5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
    >
      {/* Sisi Kiri: Avatar Terstandarisasi + 3 Baris Info Karyawan */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Avatar Foto / Inisial Terstandarisasi */}
        <EmployeeAvatar employee={employee} size="md" />

        {/* 3 Baris Identitas Karyawan */}
        <div className="min-w-0 flex-1">
          {/* Baris 1: Departemen */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={deptDisplay}>
            {deptDisplay}
          </div>
          {/* Baris 2: Nama Karyawan */}
          <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate group-hover:text-blue-600 transition-colors" title={employee.fullName}>
            {employee.fullName}
          </div>
          {/* Baris 3: Posisi / Jabatan */}
          <div className="text-[11px] text-slate-400 font-medium leading-tight truncate" title={positionDisplay}>
            {positionDisplay}
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Area Aksi Kontekstual */}
      {rightAction && (
        <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {rightAction}
        </div>
      )}
    </div>
  );
};
```

---

## 4. Checklist Penerapan Standarisasi
- [x] Menggunakan `<EmployeeAvatar employee={employee} size="md" />`
- [x] Tidak lagi menggunakan inisial 1 huruf pada lingkaran bulat biru solid
- [x] Menyusun urutan 3 baris: **Departemen &rarr; Nama Karyawan &rarr; Posisi/Jabatan**
- [x] Menggunakan helper `getPositionName(...)` agar nama jabatan tampil manusiawi dan tidak berantakan
- [x] Menggunakan container rounded-2xl dengan border `border-slate-200/90` dan hover border biru
