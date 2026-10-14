export type EducationDegreeLevel = 
  | 'SLTA / SMA / SMK'
  | 'D1 / D2 / D3'
  | 'S1 / D4'
  | 'S2'
  | 'S3'
  | 'Tanpa Minimal Pendidikan';

export interface StructuredEducationConfig {
  tingkatPendidikan: EducationDegreeLevel;
  jurusan: string[]; // List/combobox jurusan atau bidang studi yang relevan
  deskripsiPendidikan?: string;
}

export interface StructuredExperienceItem {
  id: string;
  lamaPengalaman: string; // e.g. '1 - 2 Tahun' | '3 - 5 Tahun' | '> 5 Tahun'
  posisi: string; // e.g. 'Senior Frontend Developer'
  bidangIndustri: string; // e.g. 'Teknologi Informasi & Perangkat Lunak'
}

export type CertificationTypeCategory = 'BNSP' | 'ISO' | 'Profesional Umum' | 'Lisensi Resmi / SIM';

export interface StructuredCertificationItem {
  id: string;
  jenisSertifikasi: CertificationTypeCategory;
  namaSertifikasi: string; // e.g. 'Certified Human Resources Professional (CHRP)'
  bidangSertifikasi: string; // e.g. 'Manajemen SDM'
}

export type SkillProficiencyLevel = 'Dasar' | 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli';

export interface StructuredSkillItem {
  id: string;
  namaSkill: string; // e.g. 'React.js / TypeScript' | 'Leadership'
  tingkatKemahiran: SkillProficiencyLevel; // 'Dasar' | 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli'
  kategori?: 'Teknis' | 'Non-Teknis';
}

export interface KPIItem {
  id: string;
  nama: string;
  deskripsi: string;
  minimumSkor?: number;
  bobot: number;
  dasarUkur?: string;
  target?: string;
  satuan?: string;
  periode?: string;
  caraPengukuran?: string;
}

export interface KPIGroup {
  id: string;
  namaKelompok: string;
  deskripsi?: string;
  bobot?: number;
  indikator: KPIItem[];
}

export interface AdministrativeRequirements {
  wajib: string[];
  pendukung: string[];
  khusus: string[];
}

export interface CompensationStructure {
  gajiPokok: {
    minimal: number;
    standar: number;
    maksimal: number;
  };
  tunjangan: string[];
  bpjs: string[];
  pajak?: string[];
  pajakRuleId?: string;
  fasilitas: string[];
  tunjanganTetap?: string[];
  tunjanganTidakTetap?: string[];
  insentif?: string[];
  bonus?: string[];
}

export interface IndexJobTemplate {
  id: string;
  nama: string;
  kategori?: string;
  atasanLangsung?: string;
  departemen: string;
  divisi?: string;
  level: string;
  tujuanJabatan: string;
  sourceFile: string;
  jumlahTugas: number;
  jumlahKpi: number;
}

export interface JobTemplate {
  id: string;
  // 1. Informasi Posisi
  nama: string;
  kategori: string;
  departemen: string;
  divisi: string;
  level: string;
  atasanLangsung: string;
  
  // 2. Deskripsi Posisi
  tujuanJabatan: string;
  fungsiUtama: string[];
  
  // 3. Tanggung Jawab, Tugas Harian & Wewenang
  tanggungJawab: string[];
  tugasHarian?: string[]; // Rutinitas & Checklist Kerja Harian (Daily Work)
  wewenang: string[];
  
  // 4. KPI
  kpi: KPIItem[];
  
  // 5. Kualifikasi & Kompetensi
  kualifikasi: {
    pendidikan: string;
    pengalaman: string;
    sertifikasi: string[];
    syaratKhusus: string[];
    // Structured intensive fields for ATS & evaluation sync
    detailPendidikan?: StructuredEducationConfig;
    detailPengalaman?: StructuredExperienceItem[];
    detailSertifikasi?: StructuredCertificationItem[];
  };
  kompetensi: {
    teknis: string[];
    nonTeknis: string[];
    // Structured intensive skill levels for ATS & evaluation sync
    detailTeknis?: StructuredSkillItem[];
    detailNonTeknis?: StructuredSkillItem[];
  };
  
  // 6. Hubungan Kerja & Output
  hubunganKerja: {
    internal: string[];
    eksternal: string[];
  };
  outputDiharapkan: string[];
  
  // 7. Kompensasi (Standard Range)
  kompensasi: CompensationStructure;
  
  // 8. Persyaratan Administratif
  dokumenAdministrasi: AdministrativeRequirements;

  // 9. Waktu Kerja & Pola Shift (Integrasi Kontrak & Dokumen Resmi)
  waktuKerja?: WorkScheduleConfig;
}

export type WorkPatternType = 'Non Shift' | 'Shift';
export type WorkDaysOption = '5 Hari' | '6 Hari' | '7 Hari';
export type WorkScheduleType = '5_HARI' | '6_HARI' | 'SHIFT' | 'FLEKSIBEL' | 'CUSTOM';
export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export interface WorkScheduleConfig {
  polaKerja: WorkPatternType; // 'Shift' | 'Non Shift'
  hariKerja: WorkDaysOption; // '5 Hari' | '6 Hari' | '7 Hari'
  hariKerjaList?: string[]; // e.g. ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
  jamMasuk?: string; // e.g. '08:30' (format 24 jam)
  jamPulang?: string; // e.g. '17:30' (format 24 jam)
  jamIstirahatMulai?: string; // e.g. '12:00' (format 24 jam)
  jamIstirahatSelesai?: string; // e.g. '13:00' (format 24 jam)
  jamIstirahat?: string; // e.g. '12:00 - 13:00'
  waktuIstirahatMenit: number; // Angka dalam satuan menit (misal: 60 menit)
  totalJamKerja: number; // Total jam kerja per minggu (Maksimal legal: 40 jam)
  scheduleType?: WorkScheduleType;
  workDays?: string; // e.g. 'Senin s/d Jumat (5 Hari Kerja per Minggu)'
  workingHours?: string; // e.g. '08:30 - 17:30 WIB'
  restHours?: string; // e.g. '12:00 - 13:00 WIB (60 Menit)'
  totalHoursPerWeek?: number; // legacy alias for totalJamKerja
  overtimeEligible?: boolean;
  overtimeClause?: string;
  overtimeRateMultiplier?: number; // Multiplier kompensasi lembur (misal: 1.5x, 2.0x)
  shiftDescription?: string;
  jamKerjaShift?: number; // Durasi jam kerja per shift untuk sistem rotasi shift (contoh: 7, 8, 12)
  polaShiftId?: string; // ID Pola Shift yang tersinkron dari Pengaturan Jadwal
  polaShiftName?: string; // Nama Pola Shift (contoh: Pola 4 Regu 3 Shift Pabrik)
  polaShiftCycle?: string[]; // Siklus rotasi shift (contoh: ['shift-1-pagi', 'shift-2-siang', ...])
}

export type ModalTab = 'seputar' | 'tugas' | 'kpi' | 'kualifikasi' | 'kompensasi' | 'waktu_kerja';
