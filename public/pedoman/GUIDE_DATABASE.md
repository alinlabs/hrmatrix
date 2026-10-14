# LOCAL DATABASE ARCHITECTURE & EXPORT-IMPORT GUIDELINES (RULES DATABASE)

Dokumen ini menjadi standar arsitektur dan pedoman sistem database lokal (*Local-First Architecture*), siklus hidup data, serta mekanisme Export/Import (JSON/CSV) untuk seluruh entitas sistem di aplikasi ini (Pajak, BPJS, Karyawan, Payroll, Shift, Departemen, Posisi, KPI, Absensi, Pengaturan, dsb.).

Dokumen ini ditujukan sebagai **panduan operasional teknis** sekaligus **prompt referensi AI** agar setiap agen atau pengembang mempertahankan konsistensi arsitektur yang sama di masa mendatang.

---

## 1. Prinsip Utama: Dual-Layer Data Storage (Local-First)

Aplikasi ini menggunakan pendekatan **Local-First Architecture** berbasis dua lapisan (*dual-layer*):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       ARSITEKTUR PENYIMPANAN DATA                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [LAPISAN 1: Statis / Type-Safe Source Code]                            │
│  File: src/data/*.ts (misal: defaultPayrollRules.ts, bpjsPrograms.ts)   │
│  - Peran: Blueprints / Seeder Awal Pabrik (Factory Defaults)            │
│  - Karakteristik: Read-Only di browser, Type-Safe, kebal syntax error   │
│                                                                         │
│                                │ (Auto-Seed saat tabel kosong / init)   │
│                                ▼                                        │
│                                                                         │
│  [LAPISAN 2: Operasional & Persisten Dinamis]                           │
│  IndexedDB Browser (via Dexie.js - LocalHRISDB)                         │
│  - Peran: Single Source of Truth saat aplikasi berjalan                 │
│  - Karakteristik: CRUD aktif, persisten antar-refresh (F5), offline-ok  │
│                                                                         │
│                                ▲                                        │
│                                │ (Sinkronisasi Antar-Perangkat/Backup)  │
│                                ▼                                        │
│                                                                         │
│  [LAPISAN 3: Portabilitas & Migrasi Eksternal]                          │
│  File: *.json (Utama) & *.csv (Tabular Tambahan)                        │
│  - Peran: Backup data, migrasi antar-PC / browser, profil per cabang    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mengapa File Master Tetap `.ts` dan Bukan `.json`?

1. **Type-Safety & IntelliSense:**
   - File `.ts` mencegah *human error* (salah ketik nama field, tipe data terbalik string/number).
   - Mendukung tipe data khusus seperti `Infinity` (digunakan pada lapis tarif pajak atas tanpa batas).
2. **Keterbatasan Front-End Browser:**
   - Mengubah file ke `.json` di source code tidak membuatnya otomatis bisa ditulis oleh browser. Browser di sisi klien tidak memiliki hak akses menulis ke filesystem server/repo secara langsung.
3. **Pemisahan Tanggung Jawab:**
   - File `.ts` = **Cetak Biru Awal (Default Blueprint)**.
   - IndexedDB = **Data Hidup (Live State)** yang bebas diedit oleh user.

---

## 3. Struktur Tabel & Entitas Database Lokal (`src/db/database.ts`)

Aplikasi menggunakan **Dexie.js** dengan database `LocalHRISDB`. Seluruh modul baru harus didaftarkan di sini:

| Nama Tabel Dexie | Entitas Data | Index Kunci | Deskripsi |
|---|---|---|---|
| `company` | Data Perusahaan | `id` | Profil perusahaan, logo, konfigurasi umum |
| `employees` | Karyawan | `id, employeeId, departmentId, positionId, status` | Master karyawan, gaji, profil pajak, BPJS |
| `departments` | Departemen | `id` | Struktur departemen |
| `positions` | Posisi / Jabatan | `id, departmentId` | Master jabatan, rentang gaji, tunjangan, dokumen |
| `payrollRules` | Regulasi Pajak & BPJS | `id, category, status, origin` | Aturan PPh 21, BPJS Kesehatan, Ketenagakerjaan |
| `payrollPeriods`| Periode Gaji | `id, month, year, status` | Kalender periode penggajian bulanan/mingguan |
| `payrollRecords`| Riwayat Slip Gaji | `id, payrollPeriodId, employeeId, status` | Rincian gaji, take-home-pay, potongan pajak & BPJS |
| `attendance` | Presensi / Absensi | `id, employeeId, date, status` | Log kehadiran, jam masuk/keluar, denda keterlambatan |
| `leaves` | Cuti / Izin | `id, employeeId, leaveType, status` | Pengajuan cuti, saldo cuti tahunan |
| `shiftSchedules`| Jadwal Shift Kerja | `id, employeeId, date, shiftId` | Penugasan shift harian karyawan |
| `shiftSwaps` | Tukar Shift | `id, requesterEmployeeId, targetEmployeeId, status` | Permohonan dan persetujuan tukar shift |
| `extraShifts` | Lembur / Extra Shift | `id, employeeId, workDate, status` | Pengajuan lembur & kompensasi ekstra |
| `kpiTemplates` | Template Penilaian | `id, name` | Indikator kinerja utama |
| `kpiResults` | Hasil Evaluasi KPI | `id, employeeId, periodId, templateId` | Skor kinerja bulanan/tahunan |
| `salaryHistory` | Riwayat Kenaikan Gaji| `id, employeeId, effectiveDate` | Log historis penyesuaian gaji pokok |
| `settings` | Pengaturan Sistem | `id` | Preferensi aplikasi, tema, metode kalkulasi |
| `deletedEntityIds` | Registry Item Terhapus | `id, entityType, deletedAt` | Tombstone registry untuk mencegah kembalinya template default yang dihapus |

---

## 4. Mekanisme Siklus Hidup Data & Penanganan Penghapusan Template (Tombstone Pattern)

### A. Masalah Fundamental Penghapusan Data Bawaan
Ketika template bawaan (seperti `BPJS JP` atau `PPh 21 Tertentu`) berasal dari file `.ts` statis, browser tidak dapat menghapus item tersebut dari file source code. Jika sistem hanya mengandalkan seeding sederhana, ada risiko item yang sudah dihapus oleh pengguna akan muncul kembali (*resurrect*) saat halaman di-refresh (F5), atau ikut terbawa saat konfigurasi diekspor.

### B. Solusi: "Tombstone / Deleted Registry" Pattern
Untuk mengatasi hal ini, sistem menerapkan pola **Deleted Registry (Tombstone)** pada IndexedDB (`db.deletedEntityIds`).

#### 1. Saat Pengguna Menghapus Template / Data Bawaan:
Ketika tombol "Hapus" ditekan:
```typescript
// Langkah 1: Hapus data fisik dari tabel utama IndexedDB
await db.payrollRules.delete(ruleId);

// Langkah 2: Catat ID yang dihapus ke registry "deletedEntityIds"
await db.deletedEntityIds.put({
  id: ruleId,
  entityType: 'payrollRules',
  deletedAt: new Date().toISOString()
});
```

#### 2. Saat Aplikasi Melakukan Seeding / Booting (Proteksi Refresh F5):
Fungsi inisialisasi / seeding menyaring template bawaan `.ts` terhadap registry item yang pernah dihapus:
```typescript
async function seedDefaultRulesWithTombstoneProtection(): Promise<void> {
  // Ambil semua ID yang pernah sengaja dihapus oleh pengguna
  const deletedRecords = await db.deletedEntityIds
    .where('entityType')
    .equals('payrollRules')
    .toArray();
  const deletedIdSet = new Set(deletedRecords.map(d => d.id));

  // Ambil data yang saat ini sudah ada di IndexedDB
  const existingRecords = await db.payrollRules.toArray();
  const existingIdSet = new Set(existingRecords.map(r => r.id));

  // Filter template bawaan dari file .ts:
  // HANYA seed jika: BELUM ada di IndexedDB DAN BELUM PERNAH dihapus pengguna
  const rulesToSeed = defaultPayrollRules.filter(defaultRule => 
    !existingIdSet.has(defaultRule.id) && !deletedIdSet.has(defaultRule.id)
  );

  if (rulesToSeed.length > 0) {
    await db.payrollRules.bulkAdd(rulesToSeed);
    console.info(`[Database] Aman diseed: ${rulesToSeed.length} rules.`);
  }
}
```

**Hasil Proteksi:**
- ✅ **Anti-Resurrection:** Item yang dihapus tidak akan pernah muncul kembali saat refresh (F5).
- ✅ **Eksport Bersih:** Karena item telah dihapus dari tabel `payrollRules`, fungsi `exportToJsonFile` otomatis hanya mengekspor data yang masih aktif. Item terhapus **tidak akan ikut tereksport**.
- ✅ **Restore Capability:** Jika pengguna di kemudian hari ingin membatalkan penghapusan, sistem cukup menghapus ID dari `deletedEntityIds` dan memanggil fungsi seed ulang.

---

## 5. Standar Format & Mekanisme Export / Import

Karena data lokal tersimpan di browser perangkat, mekanisme Export & Import menjadi **jembatan wajib** untuk portabilitas, migrasi, dan perlindungan kehilangan data (*disaster recovery*).

### A. Format File yang Didukung
1. **JSON (`.json`) - Standar Utama (Wajib):**
   - Mendukung relasi bertingkat (*nested objects*, *arrays*, *tiers*).
   - Menjaga integritas tipe data (boolean, number, string, array).
   - Format wajib untuk backup penuh (*full-system backup*) atau konfigurasi kompleks (aturan pajak, BPJS, template jabatan).
2. **CSV (`.csv`) - Standar Sekunder (Pelengkap):**
   - Digunakan untuk data tabel datar (*flat table*) seperti: Daftar Karyawan, Rekap Absensi, dan Ringkasan Payroll.
   - Cocok untuk dibuka di Excel atau Google Sheets oleh divisi HR/Finance.

---

### B. Spesifikasi Struktur Payload Ekspor JSON

Setiap file ekspor JSON harus memiliki pembungkus metadata (*envelope schema*) untuk menjamin kompatibilitas versi saat diimpor kembali:

```json
{
  "app": "LocalHRIS",
  "schemaVersion": 1,
  "exportedAt": "2026-09-05T04:00:00.000Z",
  "scope": "payrollRules", 
  "data": [
    {
      "id": "pajak-pph21-ter",
      "name": "PPh 21 (Tarif Efektif Rata-Rata)",
      "category": "Tax",
      "ruleType": "Formula",
      "status": "Active",
      "tiers": [...]
    }
  ]
}
```

* Nilai `scope` dapat berupa:
  - Spesifik tabel: `"payrollRules"`, `"employees"`, `"positions"`, dll.
  - Penuh (*Full Database*): `"all"` (berisi objek dengan key untuk setiap tabel).

---

### C. Alur Validasi Impor (Import Safety Protocol)

Ketika mengimpor file JSON ke dalam database lokal, aplikasi WAJIB menjalankan tahapan berikut:

1. **Validasi File & Schema:**
   - Periksa apakah file berformat JSON valid (`JSON.parse`).
   - Periksa kecocokan `app` dan `scope` untuk menghindari salah unggah file (misal file absensi diimpor ke tabel pajak).
2. **Mode Impor (Pilihan Pengguna di UI):**
   - **Mode Merge / Update (Default):** Memperbarui data jika `id` sudah ada (`table.put()`), dan menambahkan data baru jika `id` belum ada. Data lain yang tidak ada di file import tetap aman.
   - **Mode Replace / Overwrite:** Mengosongkan tabel target terlebih dahulu (`table.clear()`), kemudian mengisi dengan data dari file impor (`table.bulkAdd()`). Wajib meminta konfirmasi peringatan di UI.
3. **Sanitasi Data:**
   - Pastikan setiap rekaman memiliki `id` yang unik dan bukan string kosong.
   - Nilai angka (*numbers*) harus valid (cegah `NaN`).
4. **Notifikasi & Refresh State:**
   - Tampilkan pesan sukses dengan rincian: *"Berhasil mengimpor X data ke tabel [Nama Tabel]"*.
   - Refresh state React context / query agar UI langsung menampilkan data terbaru tanpa harus me-reload browser.

---

## 6. Template Utilitas Reusable (Code Blueprint)

Gunakan pola helper berikut di modul utility sistem (`src/utils/databaseExportImport.ts`):

```typescript
// 1. HELPER EXPORT KE JSON
export function exportToJsonFile<T>(filename: string, scope: string, data: T[]): void {
  const payload = {
    app: 'LocalHRIS',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    scope,
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 2. HELPER IMPORT DARI JSON
export async function parseImportJsonFile<T>(file: File, expectedScope?: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (expectedScope && parsed.scope && parsed.scope !== expectedScope && parsed.scope !== 'all') {
          return reject(new Error(`Scope file tidak sesuai. Diharapkan: ${expectedScope}, ditemukan: ${parsed.scope}`));
        }
        const data = Array.isArray(parsed) ? parsed : parsed.data;
        if (!Array.isArray(data)) {
          return reject(new Error('Format data di dalam file JSON tidak valid (harus array).'));
        }
        resolve(data);
      } catch (err) {
        reject(new Error('Gagal membaca file JSON: Format rusak atau tidak valid.'));
      }
    };
    reader.onerror = () => reject(new Error('Terjadi kesalahan saat membaca file.'));
    reader.readAsText(file);
  });
}
```

---

## 7. Aturan untuk AI Assistant / Developer (Prompt Rulebook)

Bagi agen AI atau developer yang mengembangkan fitur baru di proyek ini:
1. **Jangan Menyimpan State Penting Hanya di React Memory (`useState` tanpa persistensi):**
   Setiap perubahan data master yang berbobot harus ditulis ke Dexie IndexedDB.
2. **Jangan Mengubah Master `.ts` Menjadi `.json`:**
   Pertahankan file seeder di folder `src/data/` sebagai TypeScript (`.ts`) demi kelengkapan tipe dan konsistensi kompilasi.
3. **Sediakan Kontrol Export/Import:**
   Saat membuat modul master data baru (contoh: Master Tunjangan, Master Shift, Master Vendor), pertimbangkan untuk menyertakan tombol Export/Import JSON di toolbar tabel.
4. **Respek User Customization:**
   Jangan membuat kode yang secara sepihak mereset tabel database lokal kembali ke data awal tanpa persetujuan eksplisit dari pengguna.
