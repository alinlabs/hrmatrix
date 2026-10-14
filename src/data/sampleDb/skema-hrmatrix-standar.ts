export default {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "HRMatrix Data Bundle Specification",
  "description": "Format standar JSON acuan untuk Backup, Export, Import, dan Seeding Data HRMatrix",
  "version": "2.2.0",
  "entityStructure": {
    "company": "Object - Profil perusahaan (nama, alamat, kontak, periode payroll, mata uang)",
    "departments": "Array<Object> - Daftar divisi/departemen (id, name, description)",
    "positions": "Array<Object> - Daftar jabatan/posisi (id, name, departmentId)",
    "attendanceConfig": "Object - Master shifts, toleransi keterlambatan, batas maksimal terlambat, skema denda, lembur, dan pola roster",
    "employees": "Array<Object> - Profil lengkap 18 karyawan beserta rincian PPh 21 TER, BPJS Kesehatan, dan BPJS Ketenagakerjaan",
    "kpiTemplates": "Array<Object> - Master template indikator kinerja utama (KPI)",
    "leaves": "Array<Object> - Riwayat dan pengajuan cuti",
    "extraShifts": "Array<Object> - Penugasan shift tambahan & lembur",
    "shiftSwaps": "Array<Object> - Permohonan dan persetujuan pertukaran shift",
    "shiftSchedules": "Array<Object> - Override jadwal & jadwal khusus karyawan",
    "attendance": "Array<Object> - Log presensi harian (check-in, check-out, status, durasi, lembur)",
    "payrollPeriods": "Array<Object> - Periode penggajian aktif dan historis",
    "payrollRecords": "Array<Object> - Rekapitulasi slip gaji & rincian komponen gaji per karyawan",
    "salaryHistory": "Array<Object> - Riwayat penyesuaian gaji"
  },
  "datePlaceholderTokens": {
    "{{TODAY}}": "Resolves to YYYY-MM-DD of current local date",
    "{{TODAY±N}}": "Resolves to YYYY-MM-DD with day offset N (e.g. {{TODAY-1}}, {{TODAY+2}})",
    "{{MONDAY_ANCHOR}}": "Resolves to YYYY-MM-DD of the anchor Monday 2 weeks ago",
    "{{ISO_NOW}}": "Resolves to current ISO timestamp string (e.g. 2026-08-28T08:50:00.000Z)",
    "{{NOW±MS}}": "Resolves to ISO timestamp with millisecond offset (e.g. {{NOW-86400000}})"
  }
};
