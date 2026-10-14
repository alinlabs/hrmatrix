export interface DeletedEntityId {
  id: string;
  entityType: string;
  deletedAt: string;
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  currentYear: number;
  currency: string;
  payrollFormat: string;
  payrollPeriod: string;
  // Data Pengguna (PIC Administrator)
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  // Data Perusahaan Tambahan
  legalEntity?: string;
  industry?: string;
  employeeCount?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  url: string;
  category?: string;
  notes?: string;
}

export interface TaxHistoryRecord {
  id: string;
  year: number;
  period: string; // e.g. '2024-01' or 'Tahunan 2023'
  taxableIncome: number;
  taxPaid: number;
  taxMethod: 'Gross' | 'Gross Up' | 'Nett';
  notes?: string;
  proofDocumentUrl?: string; // Link Bukti Potong 1721-A1 / Bukti Setor
}

export interface TaxProfile {
  ruleId?: string;
  nik: string; // 16 digit NIK e-KTP (Validasi & NPWP Baru)
  npwp: string; // 15 digit format lama atau 16 digit format baru
  ptkpStatus: string; // e.g., 'TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3', 'K/I/0', 'K/I/1', 'K/I/2', 'K/I/3'
  terCategory?: 'A' | 'B' | 'C'; // Kategori TER (PP 58/2023)
  dependents: number; // 0, 1, 2, 3
  employeeType: 'Pegawai Tetap' | 'Pegawai Tidak Tetap' | 'Tenaga Ahli' | 'Bukan Pegawai' | 'Ekspatriat';
  taxMethod: 'Gross' | 'Gross Up' | 'Nett'; // PPh 21 Ditanggung Karyawan, Ditunjang Perusahaan, Ditanggung Perusahaan
  hasNpwp: boolean; // Flag apakah memiliki NPWP (jika tidak, tarif TER / PPh 21 disesuaikan)
  taxHistory?: TaxHistoryRecord[];
}

export interface BpjsKesehatanProfile {
  ruleId?: string;
  participantNumber: string; // 13 digit nomor kartu BPJS Kesehatan
  participantType: 'PPU Badan Usaha' | 'PPU Penyelenggara Negara' | 'Keluarga Tambahan' | 'Mandiri PBPU - Kelas I' | 'Mandiri PBPU - Kelas II' | 'Mandiri PBPU - Kelas III' | 'PBPU Mandiri' | 'Bukan Pekerja' | 'None';
  activeStatus: 'Active' | 'Inactive' | 'Suspended';
  effectiveDate?: string; // Tanggal Mulai Efektif / Terdaftar
  wageBase?: number; // Dasar perhitungan upah (default: Gaji Pokok + Tunjangan Tetap)
  useCustomWageBase?: boolean;
  customWageBase?: number;
  employeeRate: number; // 1% (Standar)
  employerRate: number; // 4% (Standar)
  familyMembersCovered?: number; // Standar 5 anggota keluarga (1 pekerja + 1 suami/istri + 3 anak)
  notes?: string;
}

export interface BpjsKetenagakerjaanProfile {
  ruleId?: string;
  kpjNumber: string; // 11 digit nomor KPJ / BPJSTK
  activeStatus: 'Active' | 'Inactive';
  effectiveDate?: string; // Tanggal Mulai Efektif Kepesertaan
  reportedWage?: number; // Upah yang dilaporkan ke BPJSTK
  useCustomReportedWage?: boolean;
  customReportedWage?: number;
  
  // Program Partisipasi
  hasJht: boolean; // Jaminan Hari Tua: Pekerja 2%, Perusahaan 3.7%
  hasJkk: boolean; // Jaminan Kecelakaan Kerja: Perusahaan 100%
  jkkRiskCategory: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'; // Sangat Rendah (0.24%), Rendah (0.54%), Sedang (0.89%), Tinggi (1.27%), Sangat Tinggi (1.74%)
  hasJkm: boolean; // Jaminan Kematian: Perusahaan 0.30%
  hasJp: boolean;  // Jaminan Pensiun: Pekerja 1%, Perusahaan 2% (Ada Batas Maksimal Upah)
  hasJkp: boolean; // Jaminan Kehilangan Pekerjaan: Program perlindungan PHK (PP 37/2021)
  notes?: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g., EMP-001
  nik: string;
  fullName: string;
  nickname: string;
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Male' | 'Female';
  
  // Alamat & Tempat Tinggal
  address: string; // Alamat Jalan, Nomor Rumah
  rt?: string; // RT
  rw?: string; // RW
  village?: string; // Kelurahan/Desa
  district?: string; // Kecamatan
  city: string; // Kota / Kabupaten
  province?: string; // Provinsi
  postalCode?: string; // Kode Pos
  residenceStatus?: 'Milik Sendiri' | 'Kontrak / Sewa' | 'Rumah Keluarga / Orang Tua' | 'Mess / Asrama Perusahaan' | 'Kost' | 'Lainnya'; // Status Tempat Tinggal
  
  phone: string;
  email: string;
  instagram?: string;
  linkedin?: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  dependents: number;
  emergencyContact: string;
  emergencyContactName?: string; // Nama Kontak Darurat
  emergencyContactRelation?: string; // Hubungan / Sebagai Apa (Istri, Suami, Orang Tua, dll)
  emergencyContactPhone?: string; // Nomor Telepon Kontak Darurat

  // Employment
  departmentId: string;
  positionId: string;
  level: string;
  category?: string;
  division?: string;
  jobGrade: string;
  managerId?: string;
  status: 'Active' | 'Inactive' | 'Probation' | 'Terminated';
  joinDate: string;
  endDate?: string;
  employeeType?: string;
  contractType: 'Permanent' | 'Contract' | 'Internship' | 'Freelance';
  workLocation: string;
  shift: string;

  // Payroll Config & Metode Pembayaran Gaji
  basicSalary: number;
  fixedAllowance: number;
  paymentMethod?: 'Transfer Bank' | 'Tunai (Cash)' | 'E-Wallet / Digital' | 'Cek / Bilyet Giro' | string;
  bankName: string;
  bankAccount: string;
  bankAccountHolder?: string; // Nama Pemilik Rekening / Atas Nama
  bankBranch?: string; // Kantor Cabang Bank
  bpjsKesehatan?: string;
  bpjsKetenagakerjaan?: string;
  npwp?: string;

  allowances?: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string; // If tied to a template
    aturan?: any[]; // For tiered / tenure allowances
  }[];

  deductions?: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string; // If tied to a template
  }[];

  overtimeRatePerHour?: number;

  // Regulatory & Indonesian Tax / BPJS Profiles
  taxStatus?: string; // e.g., 'TK/0', 'K/1'
  bpjsHealthParticipant?: 'PPU' | 'PBPU' | 'None';
  jkkRisk?: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

  taxProfile?: TaxProfile;
  isTaxActive?: boolean;
  bpjsKesehatanProfile?: BpjsKesehatanProfile;
  bpjsKetenagakerjaanProfile?: BpjsKetenagakerjaanProfile;

  // Documents & Drive Links
  documents?: EmployeeDocument[];
  photoUrl?: string;
  avatarUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
}

export interface WorkShift {
  id: string;
  code: string; // e.g., 'PAGI', 'SIANG', 'MALAM'
  name: string; // e.g., 'Shift 1 (Pagi)', 'Shift 2 (Siang)'
  startTime: string; // HH:mm e.g. '07:00'
  endTime: string; // HH:mm e.g. '15:00'
  breakStartTime?: string; // HH:mm
  breakEndTime?: string; // HH:mm
  crossDay?: boolean; // True if shift passes midnight (e.g. 23:00 - 07:00)
  lateToleranceMinutes?: number; // Override general config if set
  earlyLeaveToleranceMinutes?: number; // Override general config if set
  isOff?: boolean; // Flag to indicate if this is an OFF shift (hari libur)
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo' | 'slate' | 'gray';
  description?: string;
  isDefault?: boolean;
}

export interface ShiftPattern {
  id: string;
  name: string;
  description?: string;
  cycle: string[]; // Array of shift IDs or 'OFF', e.g., ['shift-1', 'shift-1', 'shift-2', 'shift-2', 'OFF']
}

export interface EmployeeScheduleAssignment {
  employeeId: string;
  mode?: 'normal' | 'shift' | 'mixed';
  shiftPatternId?: string;
  anchorDate?: string; // YYYY-MM-DD
}

export interface DepartmentScheduleAssignment {
  departmentId: string;
  mode: 'normal' | 'shift';
  shiftPatternId?: string;
  anchorDate?: string;
}

export interface ShiftGroup {
  id: string;
  name: string;
  employeeIds: string[];
  description?: string;
  color?: string;
}

export interface ShiftGroupAssignment {
  id: string;
  name: string;
  employeeIds: string[];
  shiftPatternId: string;
  anchorDate: string;
  description?: string;
  color?: string;
}

export interface SavedSchedulePattern {
  id: string;
  name: string;
  description?: string;
  departmentAssignments?: DepartmentScheduleAssignment[];
  groupAssignments?: ShiftGroupAssignment[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export type LateDeductionScheme = 'duration' | 'tiered' | 'static' | 'uniform' | 'hourly' | 'daily_wage';
export type TieredDeductionSubMethod = 'nominal' | 'percentage';
export type StaticDeductionSubMethod = 'nominal' | 'percentage';
export type HourlyLateDeductionMode = 'flat_per_hour' | 'tiered';
export type DailyWageLateDeductionMode = 'pro_rata_hours' | 'percentage' | 'fixed_fraction';

export interface TieredLateRate {
  hour: number; // e.g. 1 (Jam ke-1), 2 (Jam ke-2), 3 (Jam ke-3), 4 (Jam ke-4), dst.
  amount?: number; // Nominal Rp (jika subMethod = 'nominal')
  percentage?: number; // Persentase % upah harian (jika subMethod = 'percentage')
}

export interface LateDeductionConfig {
  enabled: boolean;
  scheme: LateDeductionScheme; // 'duration' (Durasi) | 'tiered' (Bertingkat) | 'static' (Statis)
  
  // Konfigurasi umum konversi gaji
  workingDaysPerMonth: number; // e.g. 21 hari (5 hari kerja) atau 25/26 hari
  workingHoursPerDay: number; // e.g. 8 jam (480 menit/hari)

  // 1. Skema Durasi
  // Menghitung otomatis: Total Menit Terlambat × Nilai Upah per Menit

  // 2. Skema Bertingkat
  tieredSubMethod?: TieredDeductionSubMethod; // 'nominal' | 'percentage'
  tieredRates?: TieredLateRate[];

  // 3. Skema Statis
  staticSubMethod?: StaticDeductionSubMethod; // 'nominal' | 'percentage'
  staticAmount?: number; // Nominal Rp (e.g. 25000)
  staticPercentage?: number; // % upah harian (e.g. 5)

  // Legacy compatibility fields
  uniformAmount?: number;
  hourlyMode?: HourlyLateDeductionMode;
  ratePerHour?: number;
  dailyWageMode?: DailyWageLateDeductionMode;
  dailyWagePercentage?: number;
  fixedFraction?: number;
}

export interface LateDeductionSyncRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  period: string; // e.g. 'Agustus 2026'
  attendanceDate: string; // YYYY-MM-DD
  lateMinutes: number; // Durasi terlambat (menit)
  scheme: LateDeductionScheme; // 'duration' | 'tiered' | 'static'
  subMethod: 'per_minute' | 'nominal' | 'percentage';
  calculationBasis: string; // Detail formula (misal "30 mnt × Rp 694,44/mnt (Gaji Rp 7.000.000 ÷ 10.080 mnt)")
  monthlyBasicSalary: number; // Dasar Gaji Pokok
  dailyWage: number; // Upah harian
  perMinuteWage?: number; // Upah per menit
  nominalDeduction: number; // Nominal denda hasil kalkulasi presensi
  syncedToPayroll: boolean;
  syncedAt?: string;
}

export interface LateDeductionPayrollSummary {
  employeeId: string;
  employeeName: string;
  period: string;
  totalLateIncidents: number;
  totalLateMinutes: number;
  totalNominalDeduction: number;
  records: LateDeductionSyncRecord[];
}

export type AbsenceDeductionType = 'fixed_nominal' | 'full_day' | 'daily_percentage';

export interface AbsenceReasonConfig {
  id: string;
  name: string;
  description?: string;
  deductionEnabled: boolean;
  deductionType?: AbsenceDeductionType; // 'fixed_nominal' | 'full_day' | 'daily_percentage'
  deductionNominal?: number; // Nominal Rupiah jika 'fixed_nominal'
  deductionPercentage?: number; // Persentase upah harian (1-100%) jika 'daily_percentage'
}

export interface AttendanceConfig {
  id: string; // 'attendanceConfig'
  systemType: 'normal' | 'shift' | 'mixed'; // 'mixed' = Hierarchy based
  
  // Normal / Regular System Config
  normalWorkDays: number; // 5 (Senin-Jumat) or 6 (Senin-Sabtu)
  normalStartTime: string; // e.g. '08:00'
  normalEndTime: string; // e.g. '17:00'
  normalBreakStartTime: string; // e.g. '12:00'
  normalBreakEndTime: string; // e.g. '13:00'
  targetDailyHours?: number; // Target jam kerja harian, default 8
  normalDailySchedules?: Record<string, {
    active: boolean;
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
  }>;
  
  // Toleransi & Deteksi
  lateToleranceMinutes: number; // e.g. 15 menit
  earlyLeaveToleranceMinutes?: number; // e.g. 10 menit
  autoLateDetection: boolean;
  
  // Maksimal Terlambat (Input dalam Jam, hitungan dalam Menit)
  // Misal jika 4 jam (240 menit), selama <= 4 jam masih dianggap Masuk (Terlambat), jika > 4 jam dianggap Alpa / Tidak Hadir
  maxLateHours?: number; // e.g. 4 (jam)
  maxLateMinutes?: number; // e.g. 240 (menit)

  // Konfigurasi Denda Terlambat (Potongan Gaji Pokok)
  lateDeductionConfig?: LateDeductionConfig;

  // Aturan Lembur (Overtime Rules & Wage Settings)
  minimumOvertimeMinutes?: number; // Batas minimal lembur (misal 60 menit)
  autoOvertime?: boolean;
  overtimeConfig?: OvertimeConfig;

  // Alasan Ketidakhadiran Custom
  absenceReasons?: (string | AbsenceReasonConfig)[];
  
  // Master Shifts & Patterns
  shifts: WorkShift[];
  shiftPatterns?: ShiftPattern[];
  
  // Assignments (Mixed Mode)
  departmentAssignments?: DepartmentScheduleAssignment[];
  groupAssignments?: ShiftGroupAssignment[];
  employeeAssignments?: EmployeeScheduleAssignment[];
  
  // Pola Jadwal Tersimpan
  shiftGroups?: ShiftGroup[];
  savedSchedulePatterns?: SavedSchedulePattern[];
  
  updatedAt?: string;
}

export type OvertimeCalculationBasis = 'salary_hourly' | 'government' | 'manual_divider' | 'nominal' | 'salary';

export interface OvertimeCategoryConfig {
  calculationType: 'multiplier' | 'static'; // 'multiplier' (Kelipatan / Bertingkat) | 'static' (Statis / Nominal Tetap)
  calculationBasis?: OvertimeCalculationBasis; // 'salary_hourly' (Gaji Pokok Per Jam) | 'government' (Peraturan Pemerintah) | 'manual_divider' (Pembagian Manual) | 'nominal' (Tarif Nominal)
  ratePerHour: number; // Nominal Rp per jam jika static nominal
  baseDivider: number; // Basis pembagi jam kerja (default 173 untuk 1/173 x Gaji Pokok)
  multiplierFirstHour: number; // e.g. 1.5x upah per jam pada jam ke-1 hari kerja
  multiplierNextHours: number; // e.g. 2.0x upah per jam pada jam ke-2 dst
  flatMultiplier: number; // e.g. 2.0x upah per jam untuk offday/libur
  staticFirstHourRate?: number; // Nominal Rp untuk jam ke-1 jika bertingkat nominal
  staticNextHoursRate?: number; // Nominal Rp untuk jam ke-2 dst jika bertingkat nominal
  flatSalaryMultiplier?: number; // Kelipatan flat berdasarkan gaji pokok (statis + gaji pokok)
  tieredMultipliers?: number[]; // Array of multipliers per tier [Jam 1, Jam 2, ..., Jam N dst] (min 2, max 8)
  tieredNominals?: number[]; // Array of nominal rates per tier [Jam 1, Jam 2, ..., Jam N dst] (min 2, max 8)
}

export interface OvertimeConfig {
  dayMode?: 'separate' | 'unified'; // Mode Tarif: 'separate' (Normal & Offday Terpisah) | 'unified' (Tarif Seragam)
  minimumOvertimeMinutes: number; // Batas minimal lembur (menit), default 60
  autoOvertime: boolean; // Otomatis deteksi lembur dari presensi
  normalWorkday: OvertimeCategoryConfig; // Kategori Lembur Hari Kerja (Normal)
  offday: OvertimeCategoryConfig; // Kategori Lembur Hari Libur / Istirahat (Offday)
  updatedAt?: string;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  shiftId: string; // 'OFF' or WorkShift.id
  shiftName: string;
  startTime?: string;
  endTime?: string;
  isOvershift?: boolean;
  isExtraShift?: boolean;
  isSwapResult?: boolean;
  notes?: string;
  updatedAt?: string;
}

export type ShiftSwapType = 'ganti_shift' | 'tukar_shift' | 'tukar_off' | 'peer_to_peer' | 'self_date_swap' | 'direct_shift_change';
export type ShiftSwapInitiator = 'Employee' | 'Company';

export interface ShiftSwap {
  id: string;
  requestDate?: string; // YYYY-MM-DD (Tanggal Permohonan)
  swapType?: ShiftSwapType; // 'peer_to_peer' | 'self_date_swap' | 'direct_shift_change'
  initiator?: ShiftSwapInitiator; // 'Employee' (Pengajuan Karyawan) | 'Company' (Instruksi Perusahaan)
  requesterEmployeeId: string;
  targetEmployeeId?: string; // Diisi jika peer_to_peer
  requesterDate: string; // YYYY-MM-DD (Tanggal Karyawan 1 / Tanggal Awal)
  requesterShiftId: string; // Shift Asal / Semula
  targetDate?: string; // YYYY-MM-DD (Tanggal Karyawan 2 / Tanggal Tujuan)
  targetShiftId: string; // Shift Baru / Shift Dituju
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ExtraShift {
  id: string;
  employeeId: string;
  workDate: string; // YYYY-MM-DD
  shiftId: string;
  shiftName: string;
  extraType?: 'full_shift' | 'half_shift' | 'custom_hours' | 'hourly';
  durationHours?: number;
  mandatoryShiftId?: string;
  mandatoryShiftName?: string;
  wageCategory?: 'NORMAL' | 'OFFDAY' | 'SERAGAM' | string; // Kategori Upah Lembur
  customStartTime?: string;
  customEndTime?: string;
  isNonShiftEmployee?: boolean;
  compensatoryOffDate?: string; // YYYY-MM-DD
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Late' | 'Sick' | 'Leave' | 'Absent' | 'WFH' | 'Holiday';
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  clockIn?: string; // ISO string / placeholder token
  clockOut?: string; // ISO string / placeholder token
  shiftId?: string; // ID shift yang digunakan
  shiftName?: string; // Nama shift e.g. 'Shift 1 (Pagi)'
  notes?: string;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  overtimeHours?: number;
  workHours?: number;
  workDurationMinutes?: number;
  photoUrl?: string;
  location?: string;
}

export interface PayrollPeriod {
  id: string;
  name?: string;
  month: string;
  year: number;
  status: 'Draft' | 'Calculating' | 'Reviewed' | 'Approved' | 'Paid' | 'Closed';
  startDate: string;
  endDate: string;
  disabledRuleIds?: string[]; // Rule IDs that are disabled (OFF) specifically for this payroll period
}

export interface PayrollRecord {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  basicSalary: number;
  fixedAllowance: number;
  variableAllowance: number;
  overtime: number;
  bonus: number;
  commission: number;
  otherIncome: number;
  grossSalary: number;
  
  absenceDeduction: number;
  lateDeduction: number;
  loan: number;
  advance: number;
  bpjs: number;
  tax: number;
  otherDeduction: number;
  totalDeduction: number;
  
  // Attendance snapshots
  attendanceDays?: number;
  absentDays?: number;
  leaveDays?: number;
  sickDays?: number;
  overtimeHours?: number;

  allowancesBreakdown?: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string;
    isCustom?: boolean;
  }[];
  deductionsBreakdown?: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string;
    isCustom?: boolean;
  }[];

  netSalary: number;
  status: 'Draft' | 'Paid';
}

export interface Settings {
  id: string; // typically just one record with id 'global'
  theme: 'light' | 'dark' | 'system';
}

export type LeaveCategory = 
  | 'Tahunan' 
  | 'Khusus' 
  | 'Melahirkan' 
  | 'Menikah' 
  | 'Berduka' 
  | 'Diluar Tanggungan' 
  | 'Lainnya';

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: LeaveCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  documentUrl?: string;
  createdAt?: string;
}

export type LeaveUnusedAction = 'carry_forward' | 'forfeit' | 'cashout' | 'none';
export type LeavePeriodType = '1_year' | 'custom' | 'entire_tenure' | 'conditional';
export type LeavePeriodUnit = 'months' | 'years';

export interface LeaveTypePolicy {
  id: string;
  code: string;
  name: string;
  defaultQuota: number; // hari per tahun/kejadian
  isPaid: boolean;
  periodType?: LeavePeriodType; // '1_year' | 'custom' | 'entire_tenure' | 'conditional'
  periodValue?: number; // e.g. 6 or 2
  periodUnit?: LeavePeriodUnit; // 'months' | 'years'
  unusedBalanceAction?: LeaveUnusedAction; // 'carry_forward' | 'forfeit' | 'cashout' | 'none'
  isAnnualQuotaDeducted?: boolean; // deprecated / optional
  maxConsecutiveDays?: number;
  genderEligibility?: 'All' | 'Male' | 'Female';
  description?: string;
}

export interface EmployeeLeaveQuota {
  id: string; // `${employeeId}_${year}`
  employeeId: string;
  year: number;
  annualQuota: number; // Hak Cuti Tahunan (default 12 hari)
  carryForward: number; // Kuota Cuti Bawaan Tahun Lalu
  adjustedQuota?: number; // Penyesuaian / bonus kuota khusus
  notes?: string;
  updatedAt?: string;
}

export interface KPIPeriod {
  id: string; // e.g. "2026-09" or uuid
  name: string; // "KPI September 2026"
  month: string; // "September"
  year: number; // 2026
  startDate: string; // "2026-09-01"
  endDate: string; // "2026-09-30"
  status: 'Draft' | 'In_Progress' | 'Completed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KPITemplate {
  id: string;
  name: string; // Nama KPI
  description: string; // Deskripsi & Tata Cara Penilaian
  minimumScore?: number; // Minimum Skor Standar (1-100)
  weight: number; // Bobot KPI (%)
  measurementBase?: string; // Dasar Ukur
  // Legacy / optional fields
  code?: string;
  category?: 'Umum' | 'Bidang' | 'Khusus';
  unit?: string;
  targetDefault?: number;
  isGeneral?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface KPIGradeRule {
  grade: 'A' | 'B' | 'C' | 'D';
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
}

export interface KPIRuleConfig {
  id: string; // 'kpiConfig'
  evaluationCycle: 'Bulanan' | 'Triwulanan' | 'Semester' | 'Tahunan';
  generalWeightPercentage: number; // default 40
  departmentWeightPercentage: number; // default 60
  passingScore: number; // default 75
  autoAttendanceKPI: boolean; // default true
  grades: KPIGradeRule[];
  notes?: string;
  updatedAt: string;
}

export interface KPIItemResult {
  templateId: string;
  kpiName: string;
  category: 'Umum' | 'Bidang' | 'Khusus';
  weight: number;
  unit: string;
  target: number;
  actual: number;
  score: number;
  weightedScore: number;
}

export interface KPIResult {
  id: string;
  employeeId: string;
  periodId: string; // YYYY-MM
  templateId?: string;
  items?: KPIItemResult[];
  target?: number;
  actual?: number;
  score: number; // Final weighted score
  grade?: 'A' | 'B' | 'C' | 'D';
  gradeLabel?: string;
  generalScore?: number;
  departmentScore?: number;
  evaluatorId: string;
  notes?: string;
  evaluatedAt?: string;
}

export type KPIScoringInputType = 'MANUAL' | 'SEEKBAR' | 'LIKERT' | 'GRADE';
export type KPIGradeStrategy = 'MAX' | 'MIN' | 'MEDIAN';

export interface KPIScoringAssistantConfig {
  inputType: KPIScoringInputType;
  gradeStrategy: KPIGradeStrategy;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  previousSalary: number;
  newSalary: number;
  effectiveDate: string; // YYYY-MM-DD
  increase: number;
  percentage: number;
  reason: string;
  approvedBy: string;
}

export interface RegulatorySource {
  id: string;
  title: string;
  regulationNumber: string;
  institution: string;
  sourceUrl: string;
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Needs Verification' | 'Expired';
}

export interface RuleTierContributor {
  id: string;
  name: string;
  share: number;
  fixedAmount?: number;
}

export interface RuleTier {
  id: string;
  name: string;
  employeeShare: number;
  employerShare: number;
  fixedAmount?: number;
  description?: string;
  contributors?: RuleTierContributor[];
  rateType?: 'Percentage' | 'Fixed';
}

export interface TenureTier {
  id?: string;
  minYears: number;
  maxYears?: number; // undefined / null means and above (e.g. > 5 years)
  rateType: 'Fixed' | 'Percentage';
  amount: number;
  description?: string;
}

export interface PaymentRuleTier {
  min?: number | string | null;
  max?: number | string | null;
  nilai?: number | null;
  level?: string;
  namaJenjang?: string;
  nominal?: number;
  persentaseGaji?: number;
  tipeNilai?: string;
  keterangan?: string;
}

export interface PayrollRule {
  id: string;
  name: string;
  category: 'Tax' | 'BPJS Health' | 'BPJS Employment' | 'Wage' | 'Allowance' | 'Deduction' | 'Other';
  description: string;
  ruleType: 'Fixed' | 'Percentage' | 'DailyWage' | 'PercentageWithMax' | 'Formula' | 'Tiered';
  fixedAmount?: number; // Nominal tetap
  workingDaysPerMonth?: number; // Jumlah hari kerja per bulan untuk tipe DailyWage (misal 25 atau 21 hari)
  employeeShare: number; // For percentage
  employerShare: number; // For percentage
  maximumBase?: number; // E.g., max wage for JP or BPJS Kes
  minimumBase?: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  regulatorySourceId?: string;
  origin: string;
  status: 'Active' | 'Needs Verification' | 'Expired';
  version: string;
  isMultiTier?: boolean;
  tiers?: RuleTier[];
  contributors?: RuleTierContributor[];
  paymentPeriod?: 'Monthly' | 'Quarterly' | 'Annually' | string;
  
  // Skema Tunjangan & Apresiasi Terpadu (General & Manual Configuration):
  allowanceGroup?: 'tunjangan' | 'insentif' | 'bonus' | string;
  allowanceType?: 'fixed' | 'thr_religious' | 'tenure_based' | 'attendance' | 'prorata_tenure' | 'tiered_tenure' | 'threshold_tenure' | 'per_year_tenure' | 'attendance_unit' | 'performance_hr' | 'bonus_overtime' | 'bonus_attendance' | string;
  calculationModel?: 'fixed' | 'percentage' | 'prorata' | 'tiered' | 'threshold' | 'multiplier' | 'unit_based' | 'appreciation';
  subCategory?: 'fixed_allowance' | 'variable_allowance' | 'bonus_appreciation' | 'religious_allowance' | string;
  
  // Unified Payment Component Fields (Konfigurasi Tunjangan Baru)
  nama?: string;
  kategori?: 'Tunjangan Tetap' | 'Tunjangan Tidak Tetap' | 'Bonus & Insentif' | string;
  frekuensi_pembayaran?: 'bulanan' | 'triwulanan' | 'tahunan' | 'insidental' | string;
  metode_perhitungan?: 'tetap' | 'persentase' | 'harian' | 'berjenjang' | 'prorata' | 'kelipatan' | 'apresiasi' | string;
  dasar_perhitungan?: 'Gaji Pokok' | 'Nominal' | string;
  nilai?: number | null;
  satuan_nilai?: string | null;
  jenis_jenjang?: 'masa_kerja' | 'custom_level' | string;
  parameter_jenjang?: { parameter: string; satuan: string } | null; // masa_kerja
  periode_dasar?: number | null;
  aturan?: PaymentRuleTier[];
  daftarJenjang?: any[];

  // Parameter Perhitungan Manual & General:
  prorataDivisorMonths?: number; // Pembagi masa kerja dalam bulan (cth: 12 untuk tahunan, 6 untuk semester)
  prorataBasePercent?: number; // Persentase basis (cth: 100% upah pokok)
  prorataFixedBase?: number; // Nominal basis tetap jika bukan persentase upah
  
  tenureCalculationType?: 'prorata_permenaker' | 'tiered' | 'per_year' | 'minimum_service' | 'custom_prorata';
  tenureTiers?: TenureTier[];
  minServiceMonths?: number; // Syarat minimal masa kerja (dalam bulan)
  amountPerYearService?: number; // Nominal kelipatan per 1 tahun pengabdian
  
  // Unit Attendance / Shift / Lembur:
  unitRate?: number; // Tarif per satuan (hari hadir, shift malam, event lembur)
  unitType?: 'day' | 'shift' | 'overtime_event' | 'overtime_hour' | 'custom';
  
  // Ketentuan & Kriteria Evaluasi HR:
  criteriaDescription?: string; // Kriteria pemenuhan syarat HR
  isTaxable?: boolean;
  isBpjsBase?: boolean;
}
