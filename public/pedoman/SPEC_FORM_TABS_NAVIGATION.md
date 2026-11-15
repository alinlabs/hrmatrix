# Template UI/UX: Tab Navigation Bar Sticky dengan Subbar Portal & Flexible Padding

Dokumen ini mendefinisikan standar formulasi UI/UX dan arsitektur kode untuk **Tab Navigation Bar Sticky (dengan Toggle Collapse/Expand & Portal Header)** yang digunakan pada halaman pembuatan/edit posisi baru manual (Job Desk Form).

---

## 1. Konsep & Formulasi UI/UX

1. **Integrated Sticky Header Subbar (PageHeaderSubbar)**:
   - Tab navigasi ditempatkan secara melayang/sticky tepat di bawah *Page Header* utama menggunakan komponen portal (`PageHeaderSubbar`).
   - Memberikan impresi visual yang *clean*, tidak memakan tempat di *body content*, dan selalu dapat diakses oleh pengguna saat menyeleksi seksi form.

2. **Toggle Sembunyi/Tampilkan (Collapse/Expand Control)**:
   - Tombol toggle Chevron (`ChevronDown`) diletakkan di Portal Action Header (`MobileHeaderActions` & `DesktopHeaderActions`).
   - Memungkinkan pengguna menyembunyikan Tab Bar (`showTabs = false`) agar area kerja formulir menjadi lebih luas, terutama di layar seluler (mobile).

3. **In-Page Smooth Step State (Tanpa Page Reload)**:
   - Perpindahan tab hanya mengubah state `activeStep` tanpa melakukan *route navigation* atau *page reload*.
   - Seluruh data formulir disimpan dalam satu objek *state* tunggal (`formData`), sehingga pengguna bebas berpindah antar-tab tanpa takut kehilangan input data pada tab lain.

4. **Keseimbangan Proporsional & Responsif**:
   - Tab Bar menggunakan distribusi proporsional (`justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto`).
   - Setiap tab memiliki `shrink-0`, padding responsif (`px-1.5 sm:px-3`), dan ukuran font seragam (`text-xs font-semibold`).
   - Teks indikator menggunakan huruf kecil/kapitalisasi bersih (`seputar`, `tugas`, `KPI`, `kualifikasi`, `kompensasi`).

5. **Indikator Active State Melayang (Absolute Bottom Bar)**:
   - Tab aktif disorot dengan warna utama aplikasi (`text-blue-600 font-bold`).
   - Dilengkapi indikator kustom garis bawah bulat (`<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />`).

6. **Adaptive Top Padding Dinamis**:
   - Kontainer isi form utama secara otomatis menyesuaikan *top padding* (`pt-12 sm:pt-14` saat tab tampil, dan `pt-2 sm:pt-4` saat tab disembunyikan) untuk mencegah konten tertutup oleh header *sticky*.
   - Setiap panel tab dirender dengan animasi lembut Tailwind (`animate-in fade-in duration-150`).

---

## 2. Implementasi Kode & Source Code Referensi

### A. Tipe Data & State Handling

```typescript
// Define Step Types
type StepType = 'posisi' | 'tugas' | 'kpi' | 'kualifikasi' | 'kompensasi';

// State di dalam Komponen
const [activeStep, setActiveStep] = useState<StepType>('posisi');
const [showTabs, setShowTabs] = useState<boolean>(true);
const [formData, setFormData] = useState<JobTemplate>({ ...INITIAL_FORM_DATA });
```

### B. Header Actions Toggle Button (Mobile & Desktop Portal)

```tsx
{/* Tombol Toggle Chevron di Header Action */}
<button
  type="button"
  onClick={() => setShowTabs(!showTabs)}
  className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-200/80 border border-slate-200/60 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
  title={showTabs ? "Sembunyikan Tab Navigasi" : "Tampilkan Tab Navigasi"}
  aria-label="Toggle Tab Navigasi"
>
  <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${!showTabs ? 'rotate-180' : ''}`} />
</button>
```

### C. Portal Subbar Navigasi Tab (`PageHeaderSubbar`)

```tsx
{showTabs && (
  <PageHeaderSubbar>
    <div className="flex items-center justify-between w-full px-3 sm:px-8 max-w-7xl mx-auto">
      {([
        { id: 'posisi' as StepType, label: 'seputar' },
        { id: 'tugas' as StepType, label: 'tugas' },
        { id: 'kpi' as StepType, label: 'KPI' },
        { id: 'kualifikasi' as StepType, label: 'kualifikasi' },
        { id: 'kompensasi' as StepType, label: 'kompensasi' },
      ]).map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveStep(tab.id)}
          className={`py-2.5 text-xs font-semibold capitalize transition-all relative cursor-pointer px-1.5 sm:px-3 text-center shrink-0 ${
            activeStep === tab.id
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{tab.label}</span>
          {activeStep === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-2xs" />
          )}
        </button>
      ))}
    </div>
  </PageHeaderSubbar>
)}
```

### D. Adaptive Layout Container & Step Panel Switching

```tsx
{/* Container Utama dengan Adaptive Top Padding */}
<div className={`max-w-4xl mx-auto pb-8 transition-all duration-200 ${showTabs ? 'pt-12 sm:pt-14 md:pt-14' : 'pt-2 sm:pt-3 md:pt-4'}`}>
  <form onSubmit={handleSubmit} className="space-y-6">
    
    {/* STEP 1: SEPUTAR POSISI */}
    {activeStep === 'posisi' && (
      <div className="space-y-4 animate-in fade-in duration-150 px-3 sm:px-0">
        {/* Form Fields Step Posisi */}
      </div>
    )}

    {/* STEP 2: TUGAS */}
    {activeStep === 'tugas' && (
      <div className="space-y-4 animate-in fade-in duration-150 px-3 sm:px-0">
        {/* Form Fields Step Tugas */}
      </div>
    )}

    {/* STEP 3: KPI */}
    {activeStep === 'kpi' && (
      <div className="space-y-4 animate-in fade-in duration-150 px-3 sm:px-0">
        {/* Form Fields Step KPI */}
      </div>
    )}

    {/* STEP 4: KUALIFIKASI */}
    {activeStep === 'kualifikasi' && (
      <div className="space-y-4 animate-in fade-in duration-150 px-3 sm:px-0">
        {/* Form Fields Step Kualifikasi */}
      </div>
    )}

    {/* STEP 5: KOMPENSASI */}
    {activeStep === 'kompensasi' && (
      <div className="space-y-4 animate-in fade-in duration-150 px-3 sm:px-0">
        {/* Form Fields Step Kompensasi */}
      </div>
    )}

  </form>
</div>
```

---

## 3. Catatan Penting Penggunaan

1. **Aksesibilitas & Keyboard Navigation**: Tombol tab menggunakan `type="button"` agar tidak memicu pembacaan submit formulir saat ditekan kursor/enter.
2. **Global Single Form State**: Selalu gunakan `formData` di tingkat parent komponen, jangan pisahkan state per tab agar proses validasi dan pengiriman akhir tetap utuh.
3. **Portal Reusability**: Komponen `PageHeaderSubbar` meletakkan DOM tab langsung ke area header aplikasi, sehingga tidak menghalangi aliran layout dokumen utama.
