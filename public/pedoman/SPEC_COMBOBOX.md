# Standar Spesifikasi & Panduan Desain UX: Smart Combobox (Clean & Resilient)

Dokumen ini merupakan panduan arsitektur antarmuka, spesifikasi interaksi, state machine, dan **Prompt Template** siap pakai untuk implementasi komponen **Combobox / Searchable Select** di seluruh aplikasi.

---

## 🎯 Filosofi Desain (Anti-Clutter & Intuitive)

1. **Clean & Minimalis:** Tidak pernah menampilkan multi-ikon atau tombol yang bertumpuk (*no icon clutter*). Maksimal hanya ada **1 ikon** di sebelah kanan kolom input pada setiap kondisi.
2. **Instant Search & Real-Time Filtering:** Pencarian responsif tanpa mengunci atau menduplikasi opsi yang tidak cocok dengan keyword.
3. **Resilient UX (Zero Frustration Deletion):** Nilai yang tidak sengaja dihapus dapat dipulihkan (*undo / restore*) dalam 1 ketukan tanpa merusak layout atau data form.
4. **Data Isolation:** Nilai riwayat (*history*) murni hidup di lapisan UI komponen dan tidak pernah bocor ke form submission, payload database, maupun validasi schema.

---

## 📐 State Machine & Perilaku Interaksi

### 1. State Input & Dinamika Ikon (Clean Switch)

| Status Input | Kondisi Internal | Ikon di Kanan Input | Perilaku Saat Diklik |
| :--- | :--- | :---: | :--- |
| **Tidak Aktif / Idle** (`!isOpen`) | Memiliki nilai terpilih atau kosong | `ChevronDown` (`v`) | Membuka dropdown dan fokus ke input |
| **Aktif dengan Nilai** (`isOpen && value`) | Kolom diklik / fokus, ada nilai | `X` (Clear) | Mengosongkan nilai, menyimpan ke temporary history, membuka list normal |
| **Aktif dalam Mode History** (`isOpen && historyOption`) | Nilai baru saja dihapus, belum ada opsi baru dipilih | `RotateCcw` (`↶`) | Memulihkan opsi sebelumnya secara instan, mengubah ikon kembali ke `X` |
| **Aktif Mengetik dengan History** | User mengetik keyword pencarian baru saat history aktif | `RotateCcw` (`↶`) | History tetap dipertahankan sampai opsi baru dipilih dari dropdown |
| **Aktif Mengetik (Tanpa History)** | User mengetik query pencarian baru | `X` (Clear Search) | Menghapus teks query pencarian yang sedang diketik |
| **Aktif Kosong (Murni)** | `isOpen`, tidak ada nilai, tidak ada history, tidak ada teks | *Tidak Ada Ikon* | Tampilan bersih dan fokus |

---

### 2. State Dropdown List

#### A. SELECTED State (Ada Nilai Terpilih)
- Opsi yang sedang terpilih berada di posisi **paling atas (Sticky)** saat list di-scroll.
- Memiliki latar belakang highlight lembut (misal: `bg-blue-50 text-blue-900 font-medium`).
- Memiliki ikon **Check (`✓`)** di sisi paling kanan opsi.
- Opsi lainnya ditampilkan di bawahnya tanpa ikon kosong (*no empty checkboxes*).
- Tidak menggunakan label badge berlebih (misal: *"Pilihan saat ini"* dihilangkan).

#### B. CLEARED / HISTORY State (Setelah Dihapus)
- Nilai terpilih langsung dikosongkan dari form state (`value = ''`).
- Nilai lama disimpan sementara di `historyOption` internal.
- **Dropdown menampilkan seluruh daftar opsi normal** dari awal tanpa item sticky buatan di dalam dropdown list.
- Pemulihan history sepenuhnya diakses melalui tombol ikon `RotateCcw` (`↶`) di dalam kolom input.

#### C. SEARCH / FILTER State (Saat Mengetik Keyword)
- Daftar opsi dropdown langsung difilter secara real-time berdasarkan label / sublabel.
- Jika item terpilih cocok dengan kata kunci pencarian, item tersebut tampil di paling atas.
- Jika item terpilih / history **tidak cocok** dengan kata kunci, item tersebut **tidak dipaksakan masuk** ke hasil pencarian.
- Saat kolom pencarian dikosongkan kembali, daftar opsi kembali ke urutan normal.

#### D. SELECTION EVENT (Memilih Opsi Baru)
- Nilai baru langsung dimasukkan ke `onChange(newVal)`.
- `historyOption` di-reset menjadi `null`.
- Kolom pencarian di-reset ke string kosong `""`.
- Dropdown tertutup, dan ikon kembali ke mode aktif/idle sesuai kondisi.

---

## 💻 Struktur TypeScript Props

```typescript
export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  amount?: number;
}

export interface ComboboxInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}
```

---

## 📋 Copy-Paste Prompt Template (Siap Digunakan)

Gunakan prompt di bawah ini untuk menginstruksikan AI saat ingin mengimplementasikan atau merefaktor komponen Combobox:

```markdown
Tolong buatkan / refactor komponen Combobox (Searchable Select) dengan standar UX "Clean & Resilient" berikut:

### 1. Perilaku Ikon di Dalam Input (Maksimal 1 Ikon):
- **Saat Tidak Aktif / Idle (!isOpen):**
  - Hanya tampilkan 1 ikon panah dropdown (ChevronDown).
  - JANGAN tampilkan ikon 'X' maupun ikon 'History' saat idle agar tampilan clean.
- **Saat Aktif / Fokus (isOpen):**
  - Sembunyikan ikon ChevronDown.
  - Jika ada history (nilai yang baru saja dihapus): Tampilkan ikon History/Restore (RotateCcw / ↶).
  - Jika ada nilai terpilih atau sedang mengetik teks pencarian (tanpa history): Tampilkan ikon 'X' (Clear/Delete).
  - Jika field kosong murni: Tidak perlu ada ikon tambahan di kanan.

### 2. Mekanisme Delete & History:
- Saat user menghapus pilihan (via ikon X atau tombol Backspace):
  - Langsung kosongkan nilai dari form, dan simpan nilai lama sebagai temporary UI history (`historyOption`).
  - Dropdown list menampilkan seluruh opsi normal kembali dari atas (tanpa membuat item history sticky di dalam list).
  - Ikon di dalam input berubah menjadi ikon History (RotateCcw).
  - Ketika user mulai mengetik pencarian baru, ikon History tetap bertahan di input sampai user secara eksplisit memilih opsi baru dari list dropdown.
  - Mengklik ikon History akan memulihkan nilai sebelumnya secara instan dan mengembalikan ikon menjadi 'X'.

### 3. Tampilan Dropdown List:
- Ketika ada nilai terpilih aktif (Selected): Tampilkan opsi terpilih di posisi paling atas (Sticky saat scroll) dengan highlight dan ikon Check (✓) di sebelah kanan. Opsi lainnya tampil normal tanpa ikon kosong.
- Ketika field kosong / history: Tampilkan seluruh daftar opsi normal.
- Pencarian (Search): Filter daftar opsi secara real-time. Jika keyword tidak cocok dengan item terpilih/history, jangan paksakan muncul di hasil pencarian.
- Mengklik di luar komponen (outside click) menutup dropdown dan membersihkan temporary search query.

Pastikan implementasi menggunakan TypeScript, Tailwind CSS, lucide-react icons, dan terisolasi dari form payload.
```

---

## 🧩 Referensi Kode Implementasi Inti (React + Tailwind)

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, RotateCcw } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  amount?: number;
}

export interface ComboboxInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export const ComboboxInput: React.FC<ComboboxInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Pilih atau cari...',
  className = '',
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [historyOption, setHistoryOption] = useState<ComboboxOption | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close & reset search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSearching(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || (value ? { value, label: value } : null);

  const currentDisplayLabel = selectedOption ? selectedOption.label : '';
  const inputDisplay = isSearching ? searchQuery : currentDisplayLabel;

  const cleanQuery = isSearching ? searchQuery.trim().toLowerCase() : '';

  // Filter & Top Selected Option
  let topSelectedOption: ComboboxOption | null = null;
  let listOptions: ComboboxOption[] = [];

  if (!isSearching || cleanQuery === '') {
    if (selectedOption) {
      topSelectedOption = selectedOption;
      listOptions = options.filter((opt) => opt.value !== selectedOption.value);
    } else {
      topSelectedOption = null;
      listOptions = options;
    }
  } else {
    const matched = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(cleanQuery) ||
        opt.value.toLowerCase().includes(cleanQuery) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(cleanQuery))
    );

    if (
      selectedOption &&
      (selectedOption.label.toLowerCase().includes(cleanQuery) ||
        selectedOption.value.toLowerCase().includes(cleanQuery) ||
        (selectedOption.sublabel && selectedOption.sublabel.toLowerCase().includes(cleanQuery)))
    ) {
      topSelectedOption = selectedOption;
      listOptions = matched.filter((o) => o.value !== selectedOption.value);
    } else {
      topSelectedOption = null;
      listOptions = matched;
    }
  }

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value);
    setHistoryOption(null);
    setIsSearching(false);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClearToHistory = () => {
    if (selectedOption) {
      setHistoryOption(selectedOption);
    }
    onChange('');
    setIsSearching(false);
    setSearchQuery('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleRestoreHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (historyOption) {
      handleSelect(historyOption);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsSearching(false);
      setSearchQuery('');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (!isSearching && (value || currentDisplayLabel)) {
        e.preventDefault();
        handleClearToHistory();
      }
    }
  };

  // Action Icons Logic (At most 1 icon)
  const showRestoreHistory = isOpen && historyOption !== null;
  const showClearSelected = isOpen && !showRestoreHistory && !isSearching && Boolean(value || currentDisplayLabel);
  const showClearSearch = isOpen && !showRestoreHistory && !showClearSelected && isSearching && searchQuery.length > 0;

  return (
    <div ref={containerRef} className="w-full relative">
      {label && (
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputDisplay}
          onChange={(e) => {
            setIsSearching(true);
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => { if (!isOpen) setIsOpen(true); }}
          onClick={() => { if (!isOpen) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 pr-9 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        />

        <div className="absolute right-0 top-0 bottom-0 pr-1.5 flex items-center justify-center">
          {showClearSearch && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showClearSelected && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handleClearToHistory();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Hapus pilihan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showRestoreHistory && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleRestoreHistory}
              className="p-1 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
              title={`Kembalikan pilihan: ${historyOption?.label}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {!isOpen && (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(true);
                  inputRef.current?.focus();
                }
              }}
              className="p-1.5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* POPUP DROPDOWN */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl text-sm divide-y divide-slate-100">
          {topSelectedOption && (
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => handleSelect(topSelectedOption!)}
                className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs sm:text-sm bg-blue-50 text-blue-900 font-medium transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="truncate block">{topSelectedOption.label}</span>
                  {topSelectedOption.sublabel && (
                    <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                      {topSelectedOption.sublabel}
                    </p>
                  )}
                </div>
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
              </button>
            </div>
          )}

          <div className="p-1 space-y-0.5">
            {listOptions.length > 0 ? (
              listOptions.map((opt, idx) => (
                <button
                  key={`${opt.value}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="truncate block">{opt.label}</span>
                    {opt.sublabel && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {opt.sublabel}
                      </p>
                    )}
                  </div>
                  {opt.amount !== undefined && opt.amount > 0 && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      Rp {new Intl.NumberFormat('id-ID').format(opt.amount)}
                    </span>
                  )}
                </button>
              ))
            ) : !topSelectedOption ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                Tidak ada opsi yang cocok.
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
```
