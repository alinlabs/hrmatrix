# Standar Regulasi Mekanisme Hapus Melalui Modal (Modal Delete Regulation)

Dokumen ini menjelaskan standar desain dan fungsionalitas ketika pengguna melakukan tindakan penghapusan (delete) data/aturan melalui antarmuka modal di sistem HRMatrix. Standar ini diciptakan untuk meminimalkan risiko kesalahan klik tidak sengaja (*accidental click*) oleh pengguna, sekaligus memberikan pengalaman pengguna (*user experience*) yang aman, fokus, dan interaktif.

---

## 1. Prinsip Dasar & Alur Kerja (Workflow)

Mekanisme penghapusan dalam modal dirancang dengan alur konfirmasi bertingkat langsung di dalam modal yang bersangkutan (*in-place modal confirmation*), tanpa menampilkan dialog peringatan tambahan atau browser alert baru.

### Langkah Alur Kerja:
1. **Inisiasi Awal**: Pengguna mengklik ikon Hapus (ikon sampah `Trash2` merah/slate) yang berada pada area header modal.
2. **Perubahan Keadaan (State Change)**:
   - Sistem masuk ke dalam keadaan konfirmasi hapus (`isConfirmingDelete = true`).
   - Area konten utama modal (*modal body/context*) mengalami peredupan (*dimming*).
   - Footer konfirmasi baru meluncur masuk di bagian paling bawah modal.
3. **Pilihan Pengguna**:
   - Jika pengguna memilih **Batalkan**: Modal kembali ke tampilan normal (seluruh informasi terlihat jelas kembali).
   - Jika pengguna memilih **Hapus**: Eksekusi fungsi penghapusan dilakukan secara permanen.

---

## 2. Spesifikasi Desain & Visual

### A. Peredupan Area Konteks (Body Dimming)
Ketika sistem memasuki mode konfirmasi hapus, seluruh area tubuh modal (*modal body*) harus dikurangi opasitasnya untuk menegaskan bahwa fokus saat ini berpindah ke tindakan krusial di bawah modal:
- **Opacity**: `opacity-30` atau `opacity-40` (transisi halus `transition-all duration-300`).
- **Interaktivitas**: Seluruh elemen di dalam tubuh modal dinonaktifkan (`pointer-events-none select-none`) untuk mencegah klik atau input data tidak disengaja sewaktu konfirmasi aktif.
- **Pengecualian**: Header modal (judul, ikon, tombol tutup) dan footer konfirmasi di bawahnya **tetap beropasitas 100%** untuk memberikan navigasi pembatalan/penutupan yang tegap dan tepercaya.

### B. Desain Tombol Konfirmasi (Confirm Buttons)
Tombol konfirmasi diletakkan dalam bar footer konfirmasi khusus yang meluncur lembut dari bawah (`animate-in fade-in slide-in-from-bottom-2`):
- **Isi Tombol**: Terdiri dari tombol **Batalkan** dan tombol **Hapus**.
- **Tanpa Ikon**: Tombol dirancang murni sebagai *card* tombol dengan teks saja, tanpa ikon hiasan apa pun untuk memisahkan fokus kognitif dari ikon di header.
- **Styling Tombol Batalkan**:
  - Teks: Abu-abu gelap (`text-slate-600 font-semibold`).
  - Latar Belakang: Putih dengan border tipis (`bg-white border border-slate-200 hover:bg-slate-50`).
  - Radius: `rounded-lg`.
- **Styling Tombol Hapus**:
  - Teks: Putih tebal (`text-white font-bold`).
  - Latar Belakang: Merah pekat/solid (`bg-rose-600 hover:bg-rose-700`).
  - Radius: `rounded-lg` dengan bayangan bayangan mikro (`shadow-2xs`).

---

## 3. Implementasi Kode Referensi (React / Tailwind)

Berikut adalah struktur baku yang diimplementasikan di halaman-halaman detail kompensasi:

```tsx
import React, { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const ModalDetailKompensasi = ({ isOpen, onClose, rule, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-0 overflow-hidden">
      {/* 1. HEADER (Tetap Terang & Aktif) */}
      <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100">
        <div>...</div>
        <div className="flex items-center space-x-1 shrink-0">
          <button onClick={() => setIsConfirmingDelete(true)} title="Hapus">
            <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-600" />
          </button>
          <button onClick={onClose} title="Tutup">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. AREA KONTEKS / BODY (Meredup & Tidak Bisa Diklik saat isConfirmingDelete = true) */}
      <div className={`p-4 sm:p-6 space-y-4 transition-all duration-300 ${
        isConfirmingDelete ? 'opacity-30 pointer-events-none select-none' : 'opacity-100'
      }`}>
        {/* Informasi Utama Kompensasi */}
      </div>

      {/* 3. FOOTER KONFIRMASI (Tanpa Ikon, Card & Teks Saja) */}
      {isConfirmingDelete && (
        <div className="p-4 bg-rose-50 border-t border-rose-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="text-xs text-rose-700 font-semibold">Yakin ingin menghapus aturan ini?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={() => onDelete(rule.id)}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-2xs"
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
```

---

## 4. Keuntungan Mekanisme Ini

1. **Keamanan Maksimal**: Mengurangi potensi hilangnya data penting akibat sentuhan atau klik yang tidak disengaja.
2. **Fokus Kognitif**: Dengan meredupkan bagian tengah modal, pandangan pengguna secara alami diarahkan ke tindakan konfirmasi di bagian bawah.
3. **Konsistensi Platform**: Semua modal detail di dalam modul kompensasi dan tunjangan mengikuti regulasi seragam ini untuk membangun habituasi pengguna yang konsisten.
