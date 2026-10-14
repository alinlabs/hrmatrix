# Standar Spesifikasi Format Kolom Input & Menu Pop-up Gravitasi (SPEC_INPUT_TYPE)

Dokumen ini merupakan pedoman resmi standarisasi desain visual, tipografi, interaksi pengguna (UX), dan arsitektur data untuk seluruh jenis kolom input formulir di dalam aplikasi **HRMatrix**. Standarisasi ini diadaptasi dari implementasi formulir pembuatan karyawan (`src/pages/employees/`), modul presensi & jadwal, serta komponen dasar antarmuka (`src/components/ui/index.tsx` dan `src/components/ui/ComboboxInput.tsx`).

Tujuan pedoman ini adalah memastikan seluruh formulir di semua modul memiliki konsistensi visual yang rapi, tipografi yang seimbang (tidak terlalu tebal/bold), interaksi klik yang ramah pengguna (termasuk *full-area clickable* untuk tanggal dan jam), serta integrasi **Custom Pop-up Menu dengan Gravitasi Cerdas** yang menyesuaikan posisi secara otomatis terhadap batas layar.

---

## 1. Standar Tipografi & Dimensi Kolom Input (Aturan Umum)

Secara umum, desain form mengedepankan kesederhanaan, keterbacaan tinggi (*high legibility*), dan kerapian visual tanpa ketebalan (*weight*) teks yang berlebihan.

### A. Label di Atas Kolom Input
- **Ukuran Teks**: `text-[11px]` (11 pixel).
- **Bobot Font (Weight)**: `font-normal` (**TIDAK BOLD**, bukan `font-medium`, bukan `font-semibold`).
- **Warna Teks**: `text-slate-600` (atau `text-slate-500` jika berpasangan dengan inner-label).
- **Display & Margin**: `block mb-1`.
- **Kapitalisasi**: Sentence case atau Title case singkat (contoh: "Nomor Induk Kependudukan", "Jam Masuk Kerja", "Jenis Karyawan").

### B. Teks Isi di Dalam Kolom Input
- **Ukuran Teks**: `text-xs` (12 pixel) pada mobile & desktop standar.
- **Bobot Font (Weight)**: `font-normal` (**TIDAK BOLD** untuk input teks standar).
- **Warna Teks**: `text-slate-900` (kontras tinggi, jelas terbaca).
- **Placeholder**: `placeholder:text-slate-400 font-normal`.
- **Perataan (Alignment)**:
  - Teks umum, email, alamat, tanggal, jam, dropdown: **Rata Kiri (`text-left`)**.
  - Nominal uang / mata uang / angka kuantitas: **Rata Kanan (`text-right`)**.

### C. Dimensi Fisik Kontainer Input
- **Tinggi Standar**: `h-9` (`min-h-[36px]`).
- **Radius Sudut**: `rounded-xl` (12px).
- **Border & Background**: `border border-slate-200/90 bg-white`.
- **Padding Horizontal**: `px-3`.
- **Padding Vertikal**: `py-1.5`.
- **Fokus Ring**: `focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`.

```tsx
{/* Contoh Implementasi Kolom Teks Standar */}
<div className="w-full">
  <label className="block text-[11px] font-normal text-slate-600 mb-1">
    Nama Lengkap <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={formData.fullName || ''}
    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
    placeholder="Masukkan nama lengkap"
    className="flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent box-border min-h-[36px] leading-5"
  />
</div>
```

---

## 2. Kolom Input Nomor Telepon (`PhoneInput`)

Kolom nomor telepon dirancang khusus untuk kenyamanan pengguna Indonesia dengan penambahan prefix negara `+62` secara otomatis, pemformatan tanda hubung (*dash formatting*), serta memicu keypad angka/dialer pada perangkat mobile.

### A. Perilaku Khusus (UX Logic)
1. **Otomatisasi Prefix `+62`**:
   - Jika pengguna mengetik awalan `0` (misal: `0812...`), angka `0` langsung diganti dengan `62` sehingga menjadi `+62 812...`.
   - Jika pengguna mengetik langsung angka `812...`, sistem otomatis menyisipkan kode negara `+62`.
2. **Format Spasi & Tanda Hubung Bertahap**:
   - Format standar: `+62 XXX-XXXX-XXXX` (contoh: `+62 812-3456-7890`).
   - Panjang nomor dibatasi hingga 13-15 digit nomor telepon lokal.
3. **Resilient Backspace / Deletion**:
   - Jika input dihapus hingga hanya menyisakan `+6` atau `+`, input langsung direset bersih ke string kosong `''`. Pengguna tidak akan terjebak oleh karakter statis yang tidak bisa dihapus.
4. **Trigger Keyboard Ponsel**:
   - Wajib menggunakan `type="tel"` dan `inputMode="tel"` agar perangkat layar sentuh (iOS dan Android) langsung membuka **Number Pad / Phone Dialer Pad**.

### B. Implementasi Kode Referensi

```tsx
import React from 'react';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Reset bersih jika user menghapus hingga awal
    if (raw === '+6' || raw === '+' || raw === '') {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) onChange(syntheticEvent);
      return;
    }

    // Ambil hanya digit angka murni
    let cleaned = raw.replace(/\D/g, '');

    // Konversi awalan 0 menjadi 62, atau tambahkan 62 jika belum ada
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (cleaned.length > 0 && !cleaned.startsWith('62') && !cleaned.startsWith('6')) {
      cleaned = '62' + cleaned;
    }

    // Format dengan spasi dan tanda minus bertahap
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = '+' + cleaned.substring(0, 2);
      const local = cleaned.substring(2);
      if (local.length > 0) formatted += ' ' + local.substring(0, 3);
      if (local.length > 3) formatted += '-' + local.substring(3, 7);
      if (local.length > 7) formatted += '-' + local.substring(7, 11);
      if (local.length > 11) formatted += '-' + local.substring(11, 15);
    }

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: formatted }
    } as React.ChangeEvent<HTMLInputElement>;

    if (onChange) onChange(syntheticEvent);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label}
        </label>
      )}
      <input
        type="tel"
        inputMode="tel"
        value={value || ''}
        onChange={handleChange}
        placeholder="+62 812-3456-7890"
        className={`flex h-9 w-full rounded-xl border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/90 focus:ring-blue-500'
        } bg-white px-3 py-1.5 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-transparent box-border min-h-[36px] leading-5 ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
```

---

## 3. Kolom & Card Input Tanggal (Ghost Date Picker / Card Click-to-Pick)

Masalah umum pada input tanggal standar `<input type="date">` adalah tampilannya yang kaku, format tanggal default browser (`YYYY-MM-DD` atau `MM/DD/YYYY`) yang tidak ramah, serta pengguna harus mengklik ikon kalender kecil di sisi paling kanan. Selain itu, pada tampilan berbentuk card, badge, atau teks statis, membuka kalender seringkali menimbulkan *bug* di mana tanggal hari ini langsung terpilih otomatis padahal pengguna baru sekadar membuka kalender (*accidental commit*).

Standarisasi ini menggunakan teknik **Ghost Date Picker** dan **Safe Click-to-Pick** yang menyelesaikan masalah tersebut secara elegan.

### A. Perilaku Khusus & UX Logic (Safe Non-Committal Trigger)
1. **Kotak & Card Visual Seragam**:
   - Kolom form menggunakan dimensi seragam (`h-9 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5`).
   - Pada komponen berwujud Card, Badge, atau Teks Statis (misalnya pada jadwal kerja, filter tanggal, atau log presensi), seluruh bidang card dapat diklik untuk memicu picker kalender.
2. **Display Format Bahasa Indonesia**:
   - Nilai tanggal ditampilkan dalam teks yang rapi dan mudah dibaca masyarakat Indonesia, contoh: `17 Agu 1995` atau `05 Okt 2023`.
   - Menggunakan helper `formatDateDisplay(dateStr)`. Jika belum ada tanggal yang dipilih, teks placeholder netral (seperti `Pilih Tanggal`) atau teks kosong ditampilkan.
3. **Full-Area Clickable (Seluruh Area Dapat Diklik)**:
   - Diterapkan menggunakan elemen `<input type="date">` dengan posisi `absolute inset-0 opacity-0 w-full h-full cursor-pointer`, atau memanggil method modern `inputRef.current?.showPicker?.()` pada event `onClick` card/kontainer.
4. **Prinsip Non-Commit Saat Membuka (Tidak Otomatis Tertulis Sebelum Dipilih)**:
   - **DILARANG KERAS** memperbarui nilai state saat pengguna baru sekadar mengklik/membuka pop-up kalender (misal: jangan pasang `onClick={() => setDate(today)}`).
   - Pop-up kalender hanya terbuka sebagai sarana navigasi (*browsing mode*). Nilai state **HANYA BOLEH TERUPDATE** jika pengguna secara eksplisit mengklik tanggal tertentu dan mengonfirmasikannya (*commit confirmation* melalui event `onChange` dengan `e.target.value` yang valid).
   - Jika pengguna membatalkan (*cancel*), menekan Escape, atau mengklik area luar tanpa memilih tanggal, state harus tetap bersih atau mempertahankan nilai lama tanpa ada perubahan data sama sekali.
5. **Penyimpanan Data Standar (ISO Standard)**:
   - State form tetap menerima dan menyimpan format standar `YYYY-MM-DD` (contoh: `"2024-08-17"`) sehingga kompatibel 100% dengan database dan query pengurutan.

### B. Implementasi Kode Referensi

```tsx
import React, { useRef } from 'react';

export const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

interface DatePickerInputProps {
  label?: string;
  value?: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler yang aman: hanya memperbarui state saat ada value hasil pilihan user
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    if (selected) {
      onChange(selected);
    }
  };

  const handleContainerClick = () => {
    if (disabled) return;
    // Pemicu picker modern jika didukung peramban
    if (inputRef.current && typeof inputRef.current.showPicker === 'function') {
      try {
        inputRef.current.showPicker();
      } catch {
        // Fallback otomatis melalui input overlay
      }
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        onClick={handleContainerClick}
        className={`relative flex items-center h-9 w-full rounded-xl border ${
          error ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-200/90 focus-within:ring-blue-500'
        } bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 cursor-pointer ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* Zero-Clean Display: Kotak kosong bersih tanpa teks hint saat belum dipilih */}
        <span className={`flex-1 text-xs truncate select-none ${value ? 'text-slate-900 font-normal' : 'text-transparent font-normal'}`}>
          {value ? formatDateDisplay(value) : ''}
        </span>

        {/* Native Date Input Transparan Menutupi Seluruh Kotak */}
        <input
          ref={inputRef}
          type="date"
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

{/* Contoh Penggunaan pada Elemen Card / Teks Statis Mandiri */}
export const DateCardPickerExample: React.FC<{ value?: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      onClick={() => dateInputRef.current?.showPicker?.()}
      className="relative p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl cursor-pointer transition-all group"
    >
      <span className="text-[11px] text-slate-500 font-normal block mb-1">Tanggal Mulai Berlaku</span>
      <div className="text-xs font-semibold text-slate-900">
        {value ? formatDateDisplay(value) : <span className="text-slate-400 font-normal">Klik untuk atur tanggal...</span>}
      </div>
      
      {/* Input Date Tersembunyi untuk Memicu Dialog Kalender */}
      <input 
        ref={dateInputRef}
        type="date" 
        value={value || ''} 
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none" 
      />
    </div>
  );
};
```

---

## 4. Kolom & Card Input Jam / Waktu (`TimePickerInput` / Ghost Time Picker)

Sama halnya dengan input tanggal, input jam/waktu standar `<input type="time">` bawaan browser seringkali tampil kaku, menggunakan jam 12-jam (AM/PM) yang membingungkan, serta menuntut pengguna mengklik ikon jam kecil. Pada card atau kolom statis, membuka dialog jam tidak boleh langsung menetapkan jam sistem sebelum pengguna mengonfirmasi pilihannya.

Standarisasi ini mempopulerkan teknik **Ghost Time Picker** dan **Safe Time-Selection Mechanism** untuk pemeliharaan jam kerja, jadwal shift, dan presensi.

### A. Perilaku Khusus & UX Logic (Safe Non-Committal Trigger)
1. **Kotak & Card Visual Seragam**:
   - Memiliki bentuk visual yang persis seragam dengan kolom input form (`h-9 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5`) maupun card waktu shift.
2. **Display Format Waktu Indonesia (24-Jam & Suffix WIB)**:
   - Nilai jam ditampilkan dalam format 24-jam terformat rapi dengan opsional penanda zona waktu, contoh: `08:00 WIB`, `17:30 WIB`, atau `08:00`.
   - Menggunakan helper `formatTimeDisplay(timeStr, suffixText)`.
3. **Full-Area Clickable (Seluruh Area Dapat Diklik)**:
   - Elemen `<input type="time">` dipasang secara transparan menutupi seluruh area (`absolute inset-0 opacity-0 w-full h-full cursor-pointer`) atau dipicu via `showPicker()`.
   - Pengguna cukup menyentuh/mengklik **mana saja di area kotak atau card** untuk langsung membuka pop-up pemilih waktu (time dial/wheel).
4. **Prinsip Non-Commit Saat Membuka (Tidak Otomatis Tertulis Sebelum Dipilih)**:
   - Tindakan mengklik kotak/card jam **TIDAK BOLEH** langsung menuliskan jam saat ini ke dalam state sebelum ada konfirmasi dari pengguna.
   - Perubahan nilai hanya diproses ketika event `onChange` menerima string jam valid dari pengguna.
   - Jika pengguna menutup wheel/dial jam tanpa memilih (batal/dismiss), nilai state tetap berada pada kondisi semula.
5. **Data Standard 24-Jam (`HH:mm`)**:
   - State form menerima dan menyimpan string format 24-jam standar ISO `"08:00"`, `"14:30"`, atau `"23:59"`.

### B. Implementasi Kode Referensi

```tsx
import React, { useRef } from 'react';

export const formatTimeDisplay = (timeStr?: string, suffixText: string = 'WIB'): string => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    return `${hh}:${mm}${suffixText ? ` ${suffixText}` : ''}`;
  }
  return timeStr;
};

interface TimePickerInputProps {
  label?: string;
  value?: string; // Format: HH:mm (24-jam)
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  suffixText?: string; // Default: 'WIB'
  className?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  suffixText = 'WIB',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    if (selected) {
      onChange(selected);
    }
  };

  const handleContainerClick = () => {
    if (disabled) return;
    if (inputRef.current && typeof inputRef.current.showPicker === 'function') {
      try {
        inputRef.current.showPicker();
      } catch {
        // Fallback otomatis melalui input overlay
      }
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        onClick={handleContainerClick}
        className={`relative flex items-center h-9 w-full rounded-xl border ${
          error ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-200/90 focus-within:ring-blue-500'
        } bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 cursor-pointer ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* Zero-Clean Display: Kotak kosong bersih tanpa teks hint saat belum dipilih */}
        <span className={`flex-1 text-xs truncate select-none ${value ? 'text-slate-900 font-normal' : 'text-transparent font-normal'}`}>
          {value ? formatTimeDisplay(value, suffixText) : ''}
        </span>

        {/* Native Time Input Transparan Menutupi Seluruh Area Kotak */}
        <input
          ref={inputRef}
          type="time"
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

{/* Contoh Penggunaan pada Elemen Card Waktu Shift */}
export const TimeCardPickerExample: React.FC<{ label: string; value?: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => {
  const timeInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      onClick={() => timeInputRef.current?.showPicker?.()}
      className="relative p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-xs transition-all"
    >
      <span className="text-[11px] text-slate-500 font-normal block mb-1">{label}</span>
      <div className="text-sm font-bold text-slate-800">
        {value ? formatTimeDisplay(value, 'WIB') : <span className="text-slate-400 font-normal text-xs">Pilih Jam...</span>}
      </div>

      <input 
        ref={timeInputRef}
        type="time" 
        value={value || ''} 
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value);
        }}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none" 
      />
    </div>
  );
};
```

---

## 5. Kolom Input Format Mata Uang Rupiah (IDR) Berbasis React & Tailwind (`CurrencyInput`)

Untuk kolom yang berhubungan dengan transaksi atau nominal uang (gaji pokok, upah lembur, tunjangan, potongan, plafon kasbon, klaim medis, dll.), diperlukan standarisasi khusus agar tampilan angka mudah dibaca secara instan (format ribuan Rupiah) sembari menjaga integritas penyimpanan data angka murni (*integer*/*float*) di dalam database maupun state tanpa karakter tambahan.

### A. Spesifikasi Visual & Interaksi (UI/UX Logic)
1. **Prefix Statis `Rp` di Sisi Kiri**:
   - Memiliki badge statis `Rp` di sebelah kiri dengan garis pembatas halus (`border-r border-slate-100`) dan latar belakang abu-abu transparan netral (`bg-slate-50/50`). Ini menegaskan bahwa kolom tersebut adalah nilai keuangan tanpa membebani input utama atau mengharuskan user mengetik "Rp".
2. **Pemisah Ribuan Realtime (Thousand Separator)**:
   - Nilai angka yang diketik diformat secara *realtime* menggunakan tanda titik (`.`) sebagai pemisah ribuan otomatis (Locale `id-ID`).
   - Contoh: Mengetik `5000000` langsung terformat rapi menjadi `5.000.000`.
3. **Keyboard Numerik pada Mobile**:
   - Menggunakan atribut `inputMode="numeric"` untuk memicu *numeric keypad* pada perangkat layar sentuh (iOS dan Android), namun tetap menggunakan `type="text"` agar dapat memproses karakter pemisah titik secara dinamis.
4. **Perataan Teks Wajib Rata Kanan (Right Aligned Text)**:
   - Sesuai kaidah akuntansi dan finansial standar, nilai nominal diratakan ke kanan (`text-right`) agar urutan digit (satuan, ribuan, jutaan) sejajar dan proporsional saat dilihat.
5. **Fokus Harmonis (`focus-within`)**:
   - Menggunakan `focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500` pada kontainer pembungkus luar agar efek border dan ring aktif secara menyeluruh saat pengguna berfokus pada kolom input di dalamnya.
6. **Integritas Penyimpanan State (Pure Number)**:
   - State form hanya menyimpan angka murni bertipe `number` (contoh: `5000000`), **BUKAN** string berformat `"5.000.000"`.
   - Menghilangkan risiko kegagalan kalkulasi matematika (*payroll formula*, pajak, bonus) di backend atau database.

---

### B. Implementasi Kode Referensi (React + Tailwind CSS)

#### 1. Fungsi Helper (Parser & Formatter)

```typescript
// Mengubah angka murni atau teks menjadi format Rupiah berpemisah titik
export const formatRupiah = (num?: number | string | null): string => {
  if (num === undefined || num === null || num === '' || num === 0) return '';
  const clean = String(num).replace(/\D/g, '');
  if (!clean) return '';
  return Number(clean).toLocaleString('id-ID');
};

// Mengubah teks berpemisah titik kembali menjadi angka murni sebelum disimpan ke State
export const parseRupiah = (val: string): number => {
  const clean = val.replace(/\D/g, '');
  return clean ? Number(clean) : 0;
};
```

#### 2. Komponen UI Komprehensif (`CurrencyInput`)

```tsx
import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  label?: string;
  value?: number | string | null;
  onChange: (e: { target: { value: number } }) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '', // Sesuai filosofi Zero Placeholder Hint
  disabled = false,
  required = false,
  error,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  // Sinkronisasi nilai luar (number) ke format tampilan ribuan Indonesia
  useEffect(() => {
    if (value !== undefined && value !== null && value !== '' && value !== 0) {
      const num = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
      } else {
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');

    if (digits === '') {
      setDisplayValue('');
      onChange({ target: { value: 0 } });
    } else {
      const num = parseInt(digits, 10);
      setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
      onChange({ target: { value: num } });
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl border ${
          error ? 'border-red-500 focus-within:ring-red-500' : 'border-slate-200/90 focus-within:ring-blue-500'
        } bg-white focus-within:border-blue-500 focus-within:ring-1 overflow-hidden min-h-[36px] transition-all ${
          disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {/* Prefix Statis Rp */}
        <span className="pl-3 pr-2.5 py-2 text-xs font-semibold text-slate-400 select-none border-r border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-center">
          Rp
        </span>

        {/* Input Formatted Angka Rata Kanan */}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-1.5 text-xs font-normal text-slate-900 focus:outline-none text-right bg-transparent placeholder:text-slate-400 disabled:cursor-not-allowed leading-5"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
```

#### 3. Contoh Pola Pemanggilan Mandiri (Inline Pattern)

```tsx
{/* Kolom Nominal Gaji Pokok Mandiri */}
<div>
  <label className="block text-[11px] font-normal text-slate-600 mb-1">
    Gaji Pokok
  </label>
  <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden min-h-[36px]">
    <span className="pl-3 pr-2.5 py-2 text-xs font-semibold text-slate-400 select-none border-r border-slate-100 bg-slate-50/50">
      Rp
    </span>
    <input
      type="text"
      inputMode="numeric"
      value={formatRupiah(formData.gaji)}
      onChange={(e) => {
        const parsed = parseRupiah(e.target.value);
        setFormData(prev => ({ ...prev, gaji: parsed }));
      }}
      placeholder=""
      className="w-full px-3 py-1.5 text-xs font-normal text-slate-900 focus:outline-none text-right bg-transparent"
    />
  </div>
</div>
```

---

### C. Catatan Penting Penggunaan & Best Practices

1. **State Murni (`number`)**: Pastikan state penampung utama (misalnya `gaji`, `tunjangan`, `potongan`) bertipe data `number`. Jangan pernah menyimpan string berformat pemisah titik di database karena akan mempersulit kalkulasi matematika, aggregasi laporan, dan formula penggajian.
2. **Mitigasi Kursor Melompat**: Pada beberapa versi React, mengganti seluruh nilai text-input secara langsung di `onChange` dapat memicu kursor berpindah ke akhir. Implementasi regex `\D` yang ringkas di atas terbukti sangat stabil untuk pengisian angka konvensional.
3. **Fleksibilitas Kosong & Filosofi Start Clean**: Mengembalikan string kosong `''` ketika bernilai `0` atau `undefined` memudahkan pengguna menghapus seluruh nilai input untuk mengetik ulang dari awal tanpa ada angka nol tersisa di bagian kiri. Pada halaman pembuatan baru, kolom nominal wajib berawal dalam keadaan kosong tanpa menampilkan angka 0 maupun teks placeholder hint.

---

## 6. Kolom Input Pilihan / Select Option & Combobox dengan Gravitasi Cerdas (`Select` / `ComboboxInput`)

Elemen `<select>` bawaan browser memiliki kelemahan mendasar: tampilannya kaku, tidak dapat di-style secara konsisten antar sistem operasi, serta seringkali terpotong oleh batas layar (*viewport overflow*) atau terhalang oleh menu navigasi bawah (*bottom navigation bar*) pada perangkat ponsel.

Aplikasi **HRMatrix** mewajibkan penggunaan **Custom Pop-up Menu Card** yang dilengkapi dengan **Sistem Gravitasi Cerdas (Smart Viewport Auto-Positioning)**.

---

### A. Perilaku Gravitasi Cerdas (Smart Viewport Auto-Positioning)

Sistem gravitasi bekerja dengan mengukur koordinat elemen trigger di dalam layar secara *realtime* (`getBoundingClientRect()`):

```
+-------------------------------------------------------------+
|                          VIEWPORT                           |
|                                                             |
|  [ Input Option di Area Atas ]                              |
|  +-------------------------------------+                    |
|  | Opsi Pilihan A                     v|                    |
|  +-------------------------------------+                    |
|  | Card Pop-up Menu (MUNCUL DI BAWAH)  | <-- GRAVITASI BAWAH |
|  | - Opsi 1                            |     (Dropdown)     |
|  | - Opsi 2                            |                    |
|  +-------------------------------------+                    |
|                                                             |
|  . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  |
|                                                             |
|  +-------------------------------------+                    |
|  | Card Pop-up Menu (MUNCUL DI ATAS)   | <-- GRAVITASI ATAS |
|  | - Opsi 1                            |     (Dropup)       |
|  | - Opsi 2                            |                    |
|  +-------------------------------------+                    |
|  | Opsi Pilihan B                     v|                    |
|  +-------------------------------------+                    |
|  [ Input Option di Area Bawah ]                             |
|                                                             |
| [================== BOTTOM NAVIGATION ==================]   |
+-------------------------------------------------------------+
```

1. **Logika Perhitungan Ruang Layar**:
   - Menghitung sisa jarak dari bagian bawah input ke batas layar (`spaceBelow = viewportHeight - bottomNavHeight - rect.bottom`).
   - Menghitung sisa jarak dari bagian atas input ke batas atas layar (`spaceAbove = rect.top`).
2. **Transformasi Posisi Otomatis**:
   - **Kondisi Dominan di Bawah (Dropup)**: Jika sisa ruang di bawah terbatas (`spaceBelow < 230px`) dan ruang di atas lebih luas (`spaceAbove > spaceBelow`), Card Pop-up Menu otomatis muncul **DI ATAS KOLOM INPUT** (`bottom-full mb-1.5`).
   - **Kondisi Dominan di Atas (Dropdown)**: Jika sisa ruang di bawah mencukupi, Card Pop-up Menu muncul secara normal **DI BAWAH KOLOM INPUT** (`top-full mt-1.5`).
3. **Respektif Terhadap Bottom Navigation**:
   - Perhitungan gravitasi secara otomatis mendeteksi keberadaan elemen `#mobile-bottom-navigation` dan `#mobile-bottom-action-portal` sehingga pop-up menu tidak akan pernah tertutup oleh bar navigasi bawah.

---

### B. Desain Visual & Interaksi Custom Menu Card

1. **Kotak Trigger Input**:
   - Penampilan fisik identik `h-9 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs text-slate-900`.
   - Dilengkapi ikon panah `ChevronDown` di sebelah kanan yang otomatis berputar 180 derajat (`rotate-180 text-blue-500`) saat menu terbuka.
2. **Spesifikasi Card Pop-up Menu**:
   - **Container**: `absolute z-50 left-0 right-0 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100 overflow-y-auto`.
   - **Highlight Item Terpilih**: Item yang sedang aktif diberikan latar belakang `bg-blue-50 text-blue-700 font-semibold` beserta badge centang `Check`.
   - **Sticky Selected Option**: Pada `ComboboxInput`, item yang sedang dipilih dapat dikunci di bagian paling atas (*sticky top*) dengan kaca buram (`bg-white/95 backdrop-blur-xs`) agar pengguna selalu tahu pilihan aktif saat ini.
3. **Pencarian Realtime (Khusus Combobox)**:
   - Pengguna dapat mengetik kata kunci langsung untuk menyaring ribuan data (karyawan, departemen, shift).
   - Menyediakan tombol pembuat opsi kustom jika kata kunci yang diketik belum ada di daftar.
4. **Penanganan Outside Click & Keyboard**:
   - Pop-up menu otomatis menutup ketika pengguna mengklik di luar area input (`mousedown` & `touchstart`).
   - Mendukung navigasi keyboard: `Escape` untuk menutup, `ArrowDown` / `ArrowUp` untuk membuka & navigasi.

---

### C. Implementasi Kode Referensi

#### 1. Custom Hook Gravitasi Placement (`useDropdownPlacement`)

```typescript
import { useState, useLayoutEffect, useEffect, RefObject } from 'react';

interface UseDropdownPlacementOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  defaultMaxHeight?: number;
  minHeight?: number;
}

export function useDropdownPlacement({
  isOpen,
  containerRef,
  defaultMaxHeight = 240,
  minHeight = 120,
}: UseDropdownPlacementOptions) {
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [maxHeight, setMaxHeight] = useState<number>(defaultMaxHeight);

  const calculatePlacement = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Deteksi elemen melayang seperti bottom navigation bar
    const bottomNav = document.getElementById('mobile-bottom-navigation');
    const actionPortal = document.getElementById('mobile-bottom-action-portal');
    
    let bottomNavHeight = 0;
    if (bottomNav && window.getComputedStyle(bottomNav).display !== 'none') {
      bottomNavHeight = Math.max(bottomNavHeight, bottomNav.offsetHeight || 64);
    }
    if (actionPortal && window.getComputedStyle(actionPortal).display !== 'none' && actionPortal.children.length > 0) {
      bottomNavHeight = Math.max(bottomNavHeight, actionPortal.offsetHeight || 64);
    }

    const viewportHeight = window.innerHeight;
    const effectiveBottom = viewportHeight - bottomNavHeight;
    const spaceBelow = effectiveBottom - rect.bottom;
    const spaceAbove = rect.top;

    // Jika ruang bawah terhalang (< 230px) & ruang atas lebih luas -> GRAVITASI ATAS (Dropup)
    if (spaceBelow < 230 && spaceAbove > spaceBelow) {
      setPlacement('top');
      const calculatedMax = Math.min(defaultMaxHeight, Math.max(minHeight, spaceAbove - 16));
      setMaxHeight(calculatedMax);
    } else {
      // GRAVITASI BAWAH (Dropdown)
      setPlacement('bottom');
      const calculatedMax = Math.min(defaultMaxHeight, Math.max(minHeight, spaceBelow - 16));
      setMaxHeight(calculatedMax);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) calculatePlacement();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => calculatePlacement();
    window.addEventListener('resize', handleUpdate, { passive: true });
    window.addEventListener('scroll', handleUpdate, { passive: true, capture: true });

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpen]);

  return {
    placement,
    maxHeight,
    isDropup: placement === 'top',
    dropdownClasses: placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
  };
}
```

#### 2. Custom Select Component (`Select`)

```tsx
import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useDropdownPlacement } from './useDropdownPlacement';

export interface SelectOption {
  value: string | number;
  label: string;
  subLabel?: string;
}

interface SelectProps {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  name?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  value,
  onChange,
  options,
  placeholder = '',
  disabled = false,
  error,
  className,
  name,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement | null>(null);

  const { maxHeight, dropdownClasses } = useDropdownPlacement({
    isOpen,
    containerRef,
    defaultMaxHeight: 240,
  });

  useImperativeHandle(ref, () => nativeSelectRef.current!);

  // Dismiss ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const currentValue = value !== undefined && value !== null ? String(value) : '';
  const selectedOption = options.find(o => String(o.value) === currentValue);
  
  // Zero-Clean Display: jika opsi bernilai kosong atau placeholder dummy, jangan tampilkan teks hint
  const isPlaceholderSelected = !selectedOption || selectedOption.value === '' || selectedOption.label.toLowerCase().startsWith('pilih');
  const displayLabel = !isPlaceholderSelected && selectedOption ? selectedOption.label : '';

  // Bersihkan opsi dropdown dari dummy item "Pilih..."
  const visibleOptions = options.filter(o => o.value !== '' && !o.label.toLowerCase().startsWith('pilih '));

  const handleSelectOption = (optValue: string | number) => {
    if (disabled) return;
    setIsOpen(false);

    const valStr = String(optValue);
    if (nativeSelectRef.current) nativeSelectRef.current.value = valStr;

    if (onChange) {
      const target = nativeSelectRef.current || document.createElement('select');
      target.value = valStr;
      if (name) target.name = name;

      const syntheticEvent = {
        target,
        currentTarget: target,
      } as unknown as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      {label && (
        <label className="block text-[11px] font-normal text-slate-600 mb-1">
          {label}
        </label>
      )}

      {/* Hidden Native Select for Form Accessibility */}
      <select
        ref={nativeSelectRef}
        value={currentValue}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      >
        <option value="" disabled></option>
        {options.map((o, idx) => (
          <option key={idx} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Trigger Button - Zero-Clean Display */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex h-9 w-full items-center justify-between rounded-xl border ${
          error ? 'border-red-500 focus:ring-red-500' : isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200/90'
        } bg-white px-3 py-1.5 text-xs text-left box-border min-h-[36px] transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      >
        <span className={`truncate ${displayLabel ? 'text-slate-900 font-normal' : 'text-transparent font-normal'}`}>
          {displayLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      {/* Custom Card Pop-up Menu dengan Gravitasi Cerdas */}
      {isOpen && (
        <div
          style={{ maxHeight: `${maxHeight}px` }}
          className={`absolute z-50 left-0 right-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100 ${dropdownClasses}`}
        >
          {visibleOptions.map((option, idx) => {
            const isSelected = String(option.value) === currentValue;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option.value)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors my-0.5 ${
                  isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex flex-col text-left min-w-0 flex-1 pr-2">
                  <span className="truncate text-xs font-normal">{option.label}</span>
                  {option.subLabel && (
                    <span className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{option.subLabel}</span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
```

---

## 7. Matriks Perbandingan Tipe Input

| Karakteristik | Teks Standar | Nomor Telepon | Tanggal | Jam / Waktu | Nominal Uang | Custom Select & Combobox |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Label Di Atas** | `text-[11px] font-normal text-slate-600 mb-1` | `text-[11px] font-normal text-slate-600 mb-1` | `text-[11px] font-normal text-slate-600 mb-1` | `text-[11px] font-normal text-slate-600 mb-1` | `text-[11px] font-normal text-slate-600 mb-1` | `text-[11px] font-normal text-slate-600 mb-1` |
| **Teks Isi Input** | `text-xs font-normal text-slate-900` | `text-xs font-normal text-slate-900` | `text-xs font-normal text-slate-900` | `text-xs font-normal text-slate-900` | `text-xs font-normal text-slate-900` | `text-xs font-normal text-slate-900` |
| **Perataan (Align)**| Rata Kiri (`text-left`) | Rata Kiri (`text-left`) | Rata Kiri (`text-left`) | Rata Kiri (`text-left`) | **Rata Kanan (`text-right`)** | Rata Kiri (`text-left`) |
| **Prefix / Suffix** | Tidak ada | Otomatis `+62` | Tidak ada | Suffix `WIB` / Zona | **Statis `Rp` di sisi kiri** | Panah `ChevronDown` di kanan |
| **Interaksi Khusus**| Ketik konvensional | Auto-format dash | **Klik seluruh area buka kalender** | **Klik seluruh area buka time picker** | Ketik angka auto-titik | **Card Pop-up Menu Gravitasi Cerdas** |
| **Tipe Mobile** | Alphanumeric | **Phone Dialer (`inputMode="tel"`)** | Native Date Dial | Native Time Wheel | **Number Pad (`inputMode="numeric"`)** | Custom Menu Card (Atas / Bawah) |
| **Format State** | `string` | `string` (`+62 8XX...`) | `string` (`YYYY-MM-DD`) | `string` (`HH:mm`) | **`number` murni** | `string` / `number` |

---

## 8. Standarisasi Inisialisasi Form Bersih (Strict Start Clean & Zero Hint Policy)

Untuk memberikan keleluasaan penuh bagi pengguna (*full user customization*) serta menciptakan antarmuka formulir yang bersih, elegan, dan terbebas dari clutter visual, seluruh alur pembuatan entitas baru (seperti pembuatan tunjangan, pembuatan pajak, pembuatan jaminan sosial/BPJS, potongan, dan master data lainnya) **WAJIB menganut filosofi "Strict Start Clean" & "Zero Hint Policy"**:

### A. Prinsip Inisialisasi State (Form Pembuatan / Creation Mode)
1. **Input Teks Manual Bersih**:
   - Wajib diinisialisasi sebagai string kosong `''` atau `undefined` (bukan terisi nilai default, teks dummy, atau contoh).
2. **Input Numerik & Nominal Benar-Benar Kosong (No Zero Initial Display)**:
   - Kolom numerik (nominal mata uang `Rp`, persentase `%`, jumlah hari/jam, batas bawah/atas tier tarif) **DILARANG** diinisialisasi dengan angka `0` atau menampilkan `0` / `Rp 0` di layar pada form pembuatan.
   - Tampilan wajib **benar-benar kosong (`''`)** sehingga pengguna tidak perlu menghapus angka `0` terlebih dahulu sebelum mulai mengetik.
   - Fungsi formatter (seperti `formatRupiah`) wajib merender string kosong `''` jika nilai state adalah `0`, `null`, `undefined`, atau `''`.
3. **Dropdown / Combobox / Select 100% Bebas Hint (Zero Hint)**:
   - State awal dropdown harus kosong `''`.
   - Bidang trigger dropdown yang belum dipilih **WAJIB bersih dan kosong** tanpa teks placeholder seperti `"Pilih..."` atau `"Pilih Opsi"`.
   - Daftar opsi pop-up menu hanya berisi pilihan-pilihan valid tanpa opsi dummy bertuliskan `"Pilih..."`.
   - **Dilarang keras menyertakan teks contoh/hint pada label maupun subLabel opsi**. Opsi harus murni mendeskripsikan nama skema/entitas yang sah.
4. **Input Tanggal & Jam Bebas Hint (Zero Hint Date & Time)**:
   - Bidang input tanggal dan jam yang belum dipilih harus kosong bersih tanpa teks hint `"Pilih Tanggal"` atau `"Pilih Jam"`.
   - Interaksi klik membuka kalender/jam dalam mode browsing (non-committal); nilai baru tersimpan hanya jika pengguna secara sadar mengklik tanggal/jam yang diinginkan.
5. **Card / Selector Pilihan Skema Tidak Terpilih Otomatis**:
   - Tidak boleh ada card pilihan skema atau metode perhitungan yang terpilih secara otomatis (`selected = null` / `''`) saat halaman pertama kali dibuka, kecuali jika pengguna secara sadar memuat preset atau mengedit data lama.
6. **Penghapusan Placeholder Hint (Zero Placeholder Hint)**:
   - Seluruh kolom input **TIDAK BOLEH** menyertakan teks placeholder hint yang berupa contoh isian (wajib `placeholder=""`). Penjelasan mengenai fungsi kolom cukup diletakkan pada tooltip informasi icon info circle atau label deskriptif.

### B. Perilaku Mode Edit vs Mode Pembuatan
- **Mode Edit (`id` tersedia)**: Data lama dari database/state dimuat secara presisi sesuai dengan data yang tersimpan sebelumnya (termasuk jika nominal memang bernilai angka tertentu).
- **Mode Pembuatan (`!id`)**: Seluruh kolom benar-benar bersih dan kosong tanpa residu contoh data atau angka nol.
- **Tombol / Icon Preset & Reset Standar**: Jika pengguna menginginkan pengisian otomatis berdasarkan acuan regulasi umum (seperti skema standar TER, Pasal 17 UU HPP, BPJS Ketenagakerjaan/Kesehatan standar pemerintah), opsi tersebut disediakan melalui tombol preset atau icon reset ke standar yang dapat diklik kapan saja secara sadar oleh pengguna.

---

## 9. Checklist Kepatuhan Form (Quality Assurance)

Saat membuat form baru atau melakukan refactoring pada form yang sudah ada di aplikasi **HRMatrix**, pastikan seluruh poin checklist berikut terpenuhi:

- [ ] **Filosofi Strict Start Clean**: Pada halaman pembuatan baru, seluruh input teks, nominal, dropdown, dan card pilihan berawal dalam kondisi kosong (*clean state*) tanpa nilai bawaan otomatis.
- [ ] **Zero Placeholder Hint**: Tidak ada teks contoh/hint pada placeholder input (`placeholder=""`).
- [ ] **Zero Option Hint**: Tidak ada teks contoh/hint pada label dan subLabel dropdown opsi (hanya nama opsi murni dan tanpa opsi dummy `Pilih...`).
- [ ] **Zero Select & Picker Display Hint**: Trigger dropdown, DatePicker, dan TimePicker tidak menampilkan teks `Pilih...` saat kosong, melainkan bersih total.
- [ ] **Numerik & Nominal Benar-Benar Kosong**: Kolom nominal mata uang dan persentase tidak menampilkan angka `0` atau `Rp 0` saat form baru dibuka, melainkan kosong bersih (`''`).
- [ ] **Ukuran Label**: Seluruh label di atas kolom menggunakan class `text-[11px] font-normal text-slate-600 mb-1` (tidak menggunakan font-bold / font-medium).
- [ ] **Ukuran Isi Input**: Seluruh input teks menggunakan class `text-xs font-normal text-slate-900` (tidak menggunakan font-bold).
- [ ] **Telepon**: Input nomor telepon wajib mengonversi awalan `0` menjadi `+62` secara otomatis dan menggunakan `type="tel"` serta `inputMode="tel"`.
- [ ] **Tanggal & Card Tanggal**: Kolom maupun card tanggal wajib menggunakan Ghost Date Picker / `showPicker()` yang mengizinkan klik di **seluruh area kotak/card** untuk membuka kalender, serta menampilkan tanggal terformat bahasa Indonesia (contoh: `17 Agu 1995`). **Dilarang keras melakukan auto-commit saat membuka**; state hanya boleh terisi jika user secara eksplisit memilih tanggal.
- [ ] **Jam / Waktu & Card Jam**: Kolom maupun card jam wajib menggunakan Ghost Time Picker / `showPicker()` yang mengizinkan klik di **seluruh area kotak/card** untuk membuka time dial, serta menampilkan format 24-jam terformat (`08:00 WIB`). **Dilarang keras melakukan auto-commit saat membuka**; jika batal/dismiss, state tidak boleh berubah.
- [ ] **Nominal Uang**: Input nominal uang wajib memiliki badge `Rp` di kiri, teks angka **rata kanan (`text-right`)**, otomatis berpemisah titik ribuan, dan menyimpan state bertipe angka murni (`number`).
- [ ] **Custom Select & Combobox Gravitasi**: Pilihan dropdown **wajib menggunakan Custom Card Pop-up Menu** yang terintegrasi dengan hook `useDropdownPlacement`. Jika kolom input dominan di area bawah viewport, menu card **WAJIB otomatis muncul di atas (`bottom-full mb-1.5`)**, dan jika di atas maka muncul di bawah (`top-full mt-1.5`).
- [ ] **Dimensi Kotak**: Tinggi kontainer input konsisten pada `h-9` (`min-h-[36px]`) dengan kelengkungan sudut `rounded-xl`.
