# Standarisasi Header Modal Terkait Karyawan

Dokumen ini menjadi acuan baku dan konsisten untuk seluruh komponen Modal yang menampilkan identitas Karyawan di seluruh sistem HRMatrix.

---

## 1. Komponen Avatar Profil
- **Wajib menggunakan komponen:** `<EmployeeAvatar employee={employee} size="md" />`
- **Mekanisme Tampilan:**
  1. **Jika Foto Ada:** Menampilkan foto profil asli dari dokumen karyawan atau link drive yang tersimpan.
  2. **Jika Foto Kosong / Gagal Dimuat:** Menggunakan desain placeholder baku yang identik dengan daftar list karyawan:
     - Latar belakang: `bg-slate-100/90` dengan border halus `border-slate-200/80`
     - Teks inisial: 2 huruf inisial kapital berwarna **Biru** (`text-blue-600 font-extrabold`)
     - Ukuran standar: `size="md"` (`w-10 h-10 rounded-[12px]`)

---

## 2. Struktur Teks Header Modal
Header modal karyawan **HANYA** menampilkan:
1. **Nama Lengkap Karyawan** (`h3` font-bold text-slate-900).
2. **Posisi / Jabatan Karyawan** (text-[11px] atau text-xs text-slate-500).

### Aturan Larangan (Strict Rules):
- ❌ **DILARANG** menampilkan badge nomor ID karyawan / NIK di judul header modal.
- ❌ **DILARANG** menggunakan avatar kotak biru polos dengan teks putih yang tidak terstandarisasi.
- ❌ **DILARANG** menumpuk teks berlebihan yang membuat header sesak.

---

## 3. Contoh Implementasi Kode Baku

```tsx
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import { X } from 'lucide-react';

<div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
  <div className="flex items-center gap-3 min-w-0">
    {/* Avatar Foto / Inisial Terstandarisasi */}
    <EmployeeAvatar employee={employee} size="md" />

    {/* Nama & Posisi */}
    <div className="min-w-0">
      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
        {employee.fullName}
      </h3>
      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
        {posName || 'Staff'}
      </p>
    </div>
  </div>

  {/* Tombol Tutup Header */}
  <button 
    type="button"
    onClick={onClose}
    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0 ml-2"
    title="Tutup"
  >
    <X className="w-5 h-5" />
  </button>
</div>
```
