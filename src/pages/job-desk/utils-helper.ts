import { IndexJobTemplate, JobTemplate, WorkScheduleConfig, WorkDaysOption } from './types';
import { AttendanceConfig, WorkShift, ShiftPattern, SavedSchedulePattern } from '../../types';
import sampleScheduleConfig from '../../data/sampleDb/pengaturan-jadwal';

export interface ShiftPatternOption {
  id: string;
  name: string;
  description: string;
  cycle: string[];
  cycleShort: string;
  defaultHariKerja: WorkDaysOption;
  defaultDays: string[];
  jamMasuk: string;
  jamPulang: string;
  jamIstirahatMulai: string;
  jamIstirahatSelesai: string;
  shiftDescription: string;
  workingHours: string;
  workDays: string;
  source: 'database' | 'pengaturan_jadwal' | 'template';
  isCustom?: boolean;
}

export const STANDARD_SHIFT_PATTERN_OPTIONS: ShiftPatternOption[] = [
  {
    id: 'pat-3shift-4group',
    name: 'Pola 4 Regu 3 Shift Pabrik (2P-2S-2M-2OFF)',
    description: 'Siklus rotasi 8 hari standar industri manufaktur/pabrik 24 jam (2 Pagi, 2 Siang, 2 Malam, 2 Libur)',
    cycle: [
      'shift-1-pagi',
      'shift-1-pagi',
      'shift-2-siang',
      'shift-2-siang',
      'shift-3-malam',
      'shift-3-malam',
      'shift-off',
      'shift-off'
    ],
    cycleShort: '2 Pagi • 2 Siang • 2 Malam • 2 Libur',
    defaultHariKerja: '6 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    jamMasuk: '07:00',
    jamPulang: '16:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift 1 (Pagi): 07.00 - 16.00 WIB | Shift 2 (Siang): 15.00 - 00.00 WIB | Shift 3 (Malam): 23.00 - 08.00 WIB',
    workingHours: 'Rotasi Shift 8 Jam Kerja (Pagi: 07:00-16:00 / Siang: 15:00-00:00 / Malam: 23:00-08:00)',
    workDays: 'Roster Bergilir 8 Hari (6 Hari Kerja / 2 Hari Libur Siklus)',
    source: 'template'
  },
  {
    id: 'pat-2shift-1off',
    name: 'Pola Rotasi 2 Shift 1 Off (2P-2S-1OFF)',
    description: 'Siklus rotasi 5 hari untuk Produksi, Gudang, Logistik & Dispatch (2 Pagi, 2 Siang, 1 Libur)',
    cycle: [
      'shift-1-pagi',
      'shift-1-pagi',
      'shift-2-siang',
      'shift-2-siang',
      'shift-off'
    ],
    cycleShort: '2 Pagi • 2 Siang • 1 Libur',
    defaultHariKerja: '5 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    jamMasuk: '07:00',
    jamPulang: '16:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift 1 (Pagi): 07.00 - 16.00 WIB | Shift 2 (Siang): 15.00 - 00.00 WIB',
    workingHours: 'Rotasi 2 Shift (Pagi: 07:00-16:00 / Siang: 15:00-00:00)',
    workDays: 'Roster Rotasi 5 Hari (4 Hari Kerja / 1 Hari Libur Siklus)',
    source: 'template'
  },
  {
    id: 'pat-3shift-continuous',
    name: 'Pola Rotasi 3 Shift Kontinu (3P-3S-3M-3OFF)',
    description: 'Siklus rotasi 12 hari untuk tim pemeliharaan mesin, teknisi & utilitas pabrik',
    cycle: [
      'shift-1-pagi',
      'shift-1-pagi',
      'shift-1-pagi',
      'shift-2-siang',
      'shift-2-siang',
      'shift-2-siang',
      'shift-3-malam',
      'shift-3-malam',
      'shift-3-malam',
      'shift-off',
      'shift-off',
      'shift-off'
    ],
    cycleShort: '3 Pagi • 3 Siang • 3 Malam • 3 Libur',
    defaultHariKerja: '6 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    jamMasuk: '07:00',
    jamPulang: '16:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift 1 (Pagi): 07.00 - 16.00 WIB | Shift 2 (Siang): 15.00 - 00.00 WIB | Shift 3 (Malam): 23.00 - 08.00 WIB',
    workingHours: 'Rotasi Shift 8 Jam Kerja (Pagi: 07:00-16:00 / Siang: 15:00-00:00 / Malam: 23:00-08:00)',
    workDays: 'Roster Rotasi 12 Hari Kontinu Pemeliharaan',
    source: 'template'
  },
  {
    id: 'pat-security-12h',
    name: 'Pola 2 Shift 12 Jam Satpam / Keamanan (2 Siang - 2 Malam - 2 Libur)',
    description: 'Rotasi shift 12 jam pengamanan 24 jam dengan jeda libur pemulihan terstruktur',
    cycle: [
      'shift-2-siang',
      'shift-2-siang',
      'shift-3-malam',
      'shift-3-malam',
      'shift-off',
      'shift-off'
    ],
    cycleShort: '2 Siang (12 Jam) • 2 Malam (12 Jam) • 2 Libur',
    defaultHariKerja: '6 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    jamMasuk: '08:00',
    jamPulang: '20:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift Siang: 08.00 - 20.00 WIB | Shift Malam: 20.00 - 08.00 WIB (Kompensasi Lembur Terintegrasi)',
    workingHours: 'Shift 12 Jam (Siang: 08:00 - 20:00 / Malam: 20:00 - 08:00 WIB)',
    workDays: 'Rotasi 6 Hari Siklus Keamanan (4 Hari Bertugas / 2 Hari Libur)',
    source: 'template'
  },
  {
    id: 'pat-hospital-3shift',
    name: 'Pola 3 Shift Pelayanan 24 Jam (Medis / Helpdesk / Care)',
    description: 'Rotasi shift cepat 4 hari operasional layanan nonstop dan darurat',
    cycle: [
      'shift-1-pagi',
      'shift-2-siang',
      'shift-3-malam',
      'shift-off'
    ],
    cycleShort: '1 Pagi • 1 Siang • 1 Malam • 1 Libur',
    defaultHariKerja: '6 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    jamMasuk: '07:00',
    jamPulang: '16:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift Pagi: 07.00 - 16.00 WIB | Shift Siang: 15.00 - 00.00 WIB | Shift Malam: 23.00 - 08.00 WIB',
    workingHours: 'Rotasi 3 Shift 8 Jam (07:00-16:00 / 15:00-00:00 / 23:00-08:00)',
    workDays: 'Rotasi Roster Bergilir Pelayanan 24 Jam',
    source: 'template'
  },
  {
    id: 'pat-custom',
    name: 'Kustomisasi Pola Shift Mandiri',
    description: 'Konfigurasi pembagian jam kerja shift, jam masuk, jam istirahat, dan deskripsi secara manual',
    cycle: [],
    cycleShort: 'Kustomisasi Bebas',
    defaultHariKerja: '6 Hari',
    defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    jamMasuk: '07:00',
    jamPulang: '16:00',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    shiftDescription: 'Shift 1: 07.00 - 16.00 WIB | Shift 2: 15.00 - 00.00 WIB | Shift 3: 23.00 - 08.00 WIB',
    workingHours: 'Rotasi Shift 8 Jam Kerja',
    workDays: 'Jadwal Kerja Shift Bergilir',
    source: 'template',
    isCustom: true
  }
];

export interface ShiftBadgeMeta {
  label: string;
  code: string;
  timeRange: string;
  colorClass: string;
  isOff: boolean;
}

export const getShiftBadgeInfo = (shiftIdOrCode: string): ShiftBadgeMeta => {
  const s = (shiftIdOrCode || '').toLowerCase();
  if (s.includes('off') || s.includes('libur')) {
    return {
      label: 'OFF',
      code: 'OFF',
      timeRange: 'Libur',
      colorClass: 'bg-rose-100 text-rose-800 border-rose-200',
      isOff: true
    };
  }
  if (s.includes('1') || s.includes('pagi')) {
    return {
      label: 'Pagi',
      code: 'PAGI',
      timeRange: '07:00 - 16:00',
      colorClass: 'bg-blue-100 text-blue-800 border-blue-200',
      isOff: false
    };
  }
  if (s.includes('2') || s.includes('siang') || s.includes('sore')) {
    return {
      label: 'Siang',
      code: 'SIANG',
      timeRange: '15:00 - 00:00',
      colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
      isOff: false
    };
  }
  if (s.includes('3') || s.includes('malam')) {
    return {
      label: 'Malam',
      code: 'MALAM',
      timeRange: '23:00 - 08:00',
      colorClass: 'bg-purple-100 text-purple-800 border-purple-200',
      isOff: false
    };
  }
  if (s.includes('reguler') || s.includes('kantor') || s.includes('non shift')) {
    return {
      label: 'Reguler',
      code: 'REGULER',
      timeRange: '08:00 - 17:00',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      isOff: false
    };
  }
  if (s.includes('middle')) {
    return {
      label: 'Middle',
      code: 'MIDDLE',
      timeRange: '10:00 - 19:00',
      colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      isOff: false
    };
  }
  return {
    label: shiftIdOrCode,
    code: shiftIdOrCode,
    timeRange: 'Operasional',
    colorClass: 'bg-slate-100 text-slate-800 border-slate-200',
    isOff: false
  };
};

/**
 * Returns merged and deduplicated shift pattern options combining:
 * 1. Live config from attendanceConfig (Pengaturan Jadwal Shift)
 * 2. Sample DB config (sampleScheduleConfig)
 * 3. Standard built-in templates
 */
export const getAvailableShiftPatterns = (activeConfig?: AttendanceConfig | null): ShiftPatternOption[] => {
  const result: ShiftPatternOption[] = [];
  const addedIds = new Set<string>();

  const isOfficePattern = (name: string, desc: string = '', id: string = '') => {
    const n = (name || '').toLowerCase();
    const d = (desc || '').toLowerCase();
    const i = (id || '').toLowerCase();
    return (
      n.includes('kantor') || 
      n.includes('office') || 
      n.includes('reguler') ||
      n.includes('non shift') ||
      n.includes('non-shift') ||
      d.includes('jam kantor') || 
      d.includes('kerja kantor') ||
      d.includes('non-shift') ||
      i.includes('kantor') || 
      i.includes('office') || 
      i.includes('reguler') ||
      i.includes('non-shift')
    );
  };

  // 1. Add from activeConfig shiftPatterns if available
  if (activeConfig?.shiftPatterns && activeConfig.shiftPatterns.length > 0) {
    activeConfig.shiftPatterns.forEach(sp => {
      if (sp.id && !addedIds.has(sp.id) && !isOfficePattern(sp.name, sp.description, sp.id)) {
        addedIds.add(sp.id);
        const cycleShort = sp.cycle && sp.cycle.length > 0
          ? sp.cycle.map(c => getShiftBadgeInfo(c).label).join(' • ')
          : 'Rotasi Khusus';
        result.push({
          id: sp.id,
          name: sp.name,
          description: sp.description || 'Pola Shift dari Pengaturan Jadwal Perusahaan',
          cycle: sp.cycle || [],
          cycleShort,
          defaultHariKerja: sp.cycle?.length && sp.cycle.length > 6 ? '7 Hari' : '6 Hari',
          defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
          jamMasuk: '07:00',
          jamPulang: '16:00',
          jamIstirahatMulai: '12:00',
          jamIstirahatSelesai: '13:00',
          shiftDescription: `Pola ${sp.name}: ${cycleShort}`,
          workingHours: 'Rotasi Shift Sesuai Jadwal Pengaturan',
          workDays: 'Roster Jadwal Shift Bergilir',
          source: 'pengaturan_jadwal'
        });
      }
    });
  }

  // 2. Add from sampleScheduleConfig.shiftPatterns
  if (sampleScheduleConfig?.shiftPatterns && sampleScheduleConfig.shiftPatterns.length > 0) {
    sampleScheduleConfig.shiftPatterns.forEach(sp => {
      if (sp.id && !addedIds.has(sp.id) && !isOfficePattern(sp.name, sp.description, sp.id)) {
        addedIds.add(sp.id);
        const matchTemplate = STANDARD_SHIFT_PATTERN_OPTIONS.find(t => t.id === sp.id);
        if (matchTemplate) {
          result.push({ ...matchTemplate, source: 'pengaturan_jadwal' });
        } else {
          const cycleShort = sp.cycle && sp.cycle.length > 0
            ? sp.cycle.map(c => getShiftBadgeInfo(c).label).join(' • ')
            : 'Rotasi Khusus';
          result.push({
            id: sp.id,
            name: sp.name,
            description: sp.description || 'Pola Shift dari Master Roster',
            cycle: sp.cycle || [],
            cycleShort,
            defaultHariKerja: '6 Hari',
            defaultDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            jamMasuk: '07:00',
            jamPulang: '16:00',
            jamIstirahatMulai: '12:00',
            jamIstirahatSelesai: '13:00',
            shiftDescription: `Pola ${sp.name}: ${cycleShort}`,
            workingHours: 'Rotasi Shift 8 Jam Kerja',
            workDays: 'Roster Jadwal Shift Bergilir',
            source: 'pengaturan_jadwal'
          });
        }
      }
    });
  }

  // 3. Add any remaining standard template patterns
  STANDARD_SHIFT_PATTERN_OPTIONS.forEach(opt => {
    if (!addedIds.has(opt.id) && !isOfficePattern(opt.name, opt.description, opt.id)) {
      addedIds.add(opt.id);
      result.push(opt);
    }
  });

  return result;
};

/**
 * Return resolved WorkScheduleConfig for a job position
 */
export const resolveJobWorkSchedule = (template: Partial<JobTemplate>): WorkScheduleConfig => {
  if (template.waktuKerja) {
    const existing = template.waktuKerja;
    const pola = existing.polaKerja || (existing.scheduleType === 'SHIFT' ? 'Shift' : 'Non Shift');
    const hari = existing.hariKerja || (existing.scheduleType === '6_HARI' ? '6 Hari' : existing.scheduleType === 'SHIFT' ? '6 Hari' : '5 Hari');
    const defDays = hari === '7 Hari' 
      ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      : hari === '6 Hari'
      ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    const rawRest = existing.jamIstirahat || '';
    let defMulai = existing.jamIstirahatMulai || (pola === 'Shift' ? '12:00' : '12:00');
    let defSelesai = existing.jamIstirahatSelesai || (pola === 'Shift' ? '13:00' : '13:00');

    if (!existing.jamIstirahatMulai && rawRest.includes('-')) {
      const parts = rawRest.split('-').map(s => s.trim().replace(/[^0-9:]/g, ''));
      if (parts[0]) defMulai = parts[0];
      if (parts[1]) defSelesai = parts[1];
    }

    const defaultShiftPattern = STANDARD_SHIFT_PATTERN_OPTIONS[0];

    return {
      ...existing,
      polaKerja: pola,
      hariKerja: hari,
      hariKerjaList: existing.hariKerjaList && existing.hariKerjaList.length > 0 ? existing.hariKerjaList : defDays,
      jamMasuk: existing.jamMasuk || (pola === 'Shift' ? '07:00' : hari === '6 Hari' ? '08:00' : '08:30'),
      jamPulang: existing.jamPulang || (pola === 'Shift' ? '16:00' : hari === '6 Hari' ? '16:00' : '17:30'),
      jamIstirahatMulai: defMulai,
      jamIstirahatSelesai: defSelesai,
      jamIstirahat: existing.jamIstirahat || `${defMulai} - ${defSelesai}`,
      waktuIstirahatMenit: existing.waktuIstirahatMenit ?? 60,
      totalJamKerja: existing.totalJamKerja ?? existing.totalHoursPerWeek ?? 40,
      polaShiftId: existing.polaShiftId || (pola === 'Shift' ? defaultShiftPattern.id : undefined),
      polaShiftName: existing.polaShiftName || (pola === 'Shift' ? defaultShiftPattern.name : undefined),
      polaShiftCycle: existing.polaShiftCycle || (pola === 'Shift' ? defaultShiftPattern.cycle : undefined)
    };
  }

  const dept = (template.departemen || '').toLowerCase();
  const title = (template.nama || '').toLowerCase();
  const level = (template.level || '').toLowerCase();

  const isShift = 
    dept.includes('produksi') || 
    dept.includes('operasional') || 
    dept.includes('pabrik') || 
    dept.includes('keamanan') || 
    dept.includes('security') || 
    dept.includes('medis') || 
    dept.includes('kesehatan') || 
    dept.includes('hotel') || 
    dept.includes('f&b') || 
    dept.includes('restoran') ||
    title.includes('operator') || 
    title.includes('satpam') || 
    title.includes('security') || 
    title.includes('perawat') || 
    title.includes('barista') || 
    title.includes('driver') ||
    title.includes('kurir') ||
    title.includes('teknisi');

  const is6Days = 
    dept.includes('ritel') || 
    dept.includes('toko') || 
    dept.includes('logistik') ||
    title.includes('kasir') ||
    title.includes('sales toko') ||
    title.includes('pramusaji');

  const isManagerial = 
    level.includes('director') || 
    level.includes('direktur') || 
    level.includes('manager') || 
    level.includes('head') || 
    level.includes('c-level');

  if (isShift) {
    const defaultShiftPattern = STANDARD_SHIFT_PATTERN_OPTIONS[0];
    return {
      polaKerja: 'Shift',
      hariKerja: '6 Hari',
      hariKerjaList: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      jamMasuk: '07:00',
      jamPulang: '16:00',
      jamIstirahatMulai: '12:00',
      jamIstirahatSelesai: '13:00',
      jamIstirahat: '12:00 - 13:00',
      waktuIstirahatMenit: 60,
      totalJamKerja: 40,
      scheduleType: 'SHIFT',
      workDays: 'Roster Jadwal Shift Bergilir (6 Hari Kerja / 1 Hari Libur Roster)',
      workingHours: 'Rotasi Shift 8 Jam Kerja (Pagi: 07:00-16:00 / Siang: 15:00-00:00 / Malam: 23:00-08:00)',
      restHours: '12:00 - 13:00 WIB (60 Menit)',
      totalHoursPerWeek: 40,
      overtimeEligible: true,
      overtimeRateMultiplier: 1.5,
      overtimeClause: 'Dapat ditugaskan lembur operasional sesuai instruksi atasan dengan kompensasi resmi PP 35/2021',
      shiftDescription: 'Shift 1: 07.00 - 16.00 WIB | Shift 2: 15.00 - 00.00 WIB | Shift 3: 23.00 - 08.00 WIB',
      polaShiftId: defaultShiftPattern.id,
      polaShiftName: defaultShiftPattern.name,
      polaShiftCycle: defaultShiftPattern.cycle
    };
  }

  if (is6Days) {
    return {
      polaKerja: 'Non Shift',
      hariKerja: '6 Hari',
      hariKerjaList: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      jamMasuk: '08:00',
      jamPulang: '16:00',
      jamIstirahatMulai: '12:00',
      jamIstirahatSelesai: '13:00',
      jamIstirahat: '12:00 - 13:00',
      waktuIstirahatMenit: 60,
      totalJamKerja: 40,
      scheduleType: '6_HARI',
      workDays: 'Senin s/d Sabtu (6 Hari Kerja per Minggu)',
      workingHours: '08:00 - 16:00 WIB (Senin - Jumat: 7 Jam, Sabtu: 5 Jam)',
      restHours: '12:00 - 13:00 WIB (60 Menit)',
      totalHoursPerWeek: 40,
      overtimeEligible: true,
      overtimeClause: 'Kerja melebihi batas jam kerja harian dihitung sebagai lembur sesuai PP 35/2021',
      shiftDescription: 'Non-Shift (Jadwal Kerja 6 Hari)'
    };
  }

  // Default: 5 Days Standard Office Schedule
  return {
    polaKerja: 'Non Shift',
    hariKerja: '5 Hari',
    hariKerjaList: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    jamMasuk: '08:30',
    jamPulang: '17:30',
    jamIstirahatMulai: '12:00',
    jamIstirahatSelesai: '13:00',
    jamIstirahat: '12:00 - 13:00',
    waktuIstirahatMenit: 60,
    totalJamKerja: 40,
    scheduleType: '5_HARI',
    workDays: 'Senin s/d Jumat (5 Hari Kerja per Minggu)',
    workingHours: '08:30 - 17:30 WIB (8 Jam Kerja Efektif per Hari)',
    restHours: '12:00 - 13:00 WIB (60 Menit - Tidak Dihitung Jam Kerja)',
    totalHoursPerWeek: 40,
    overtimeEligible: !isManagerial,
    overtimeClause: isManagerial 
      ? 'Tingkat Manajerial / Non-Overtime (Kompensasi melekat pada Tunjangan Jabatan)'
      : 'Dapat diperintahkan lembur bila ada kepentingan mendesak dengan kompensasi upah lembur PP 35/2021',
    shiftDescription: 'Non-Shift (Reguler Office Hours)'
  };
};

/**
 * Format number to Indonesian Rupiah currency format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Filter job templates based on search query
 */
export const filterJobTemplates = (
  templates: IndexJobTemplate[],
  search: string
): IndexJobTemplate[] => {
  if (!search.trim()) return templates;
  const q = search.toLowerCase();
  return templates.filter(tpl =>
    tpl.nama.toLowerCase().includes(q) ||
    tpl.departemen.toLowerCase().includes(q) ||
    tpl.divisi?.toLowerCase().includes(q) ||
    tpl.kategori?.toLowerCase().includes(q) ||
    tpl.atasanLangsung?.toLowerCase().includes(q)
  );
};

/**
 * Return color badge classes based on job level & color psychology
 * - Director / Executive / C-Level: Rose/Red (Keputusan krusial & pimpinan tertinggi, penting & tegas)
 * - Manager / Head: Purple (Arah strategis & kepemimpinan manajerial)
 * - Supervisor / Lead / Coordinator: Amber/Orange (Pengawasan operasional & koordinasi lapangan)
 * - Staff / Officer / Specialist: Emerald/Green (Eksekusi operasional utama & produktivitas)
 * - Supporting / Assistant / Intern: Sky/Blue (Pendukung operasional & alur bantuan)
 */
export const getLevelBadgeStyle = (level: string): string => {
  if (!level) return 'bg-slate-100 text-slate-700 border-slate-200';
  const l = level.toLowerCase();
  
  if (
    l.includes('director') || 
    l.includes('direktur') || 
    l.includes('chief') || 
    l.includes('c-level') || 
    l.includes('executive') || 
    l.includes('vp') || 
    l.includes('president')
  ) {
    return 'bg-rose-50 text-rose-700 border-rose-200/80';
  }
  
  if (
    l.includes('manager') || 
    l.includes('manajer') || 
    l.includes('head') || 
    l.includes('general manager') || 
    l.includes('kepala')
  ) {
    return 'bg-purple-50 text-purple-700 border-purple-200/80';
  }
  
  if (
    l.includes('supervisor') || 
    l.includes('spv') || 
    l.includes('lead') || 
    l.includes('koordinator') || 
    l.includes('coordinator')
  ) {
    return 'bg-amber-50 text-amber-800 border-amber-200/80';
  }
  
  if (
    l.includes('staff') || 
    l.includes('officer') || 
    l.includes('specialist') || 
    l.includes('spesialis') || 
    l.includes('analyst') || 
    l.includes('analis')
  ) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  }
  
  if (
    l.includes('supporting') || 
    l.includes('support') || 
    l.includes('pendukung') || 
    l.includes('assistant') || 
    l.includes('asisten') || 
    l.includes('intern') || 
    l.includes('magang')
  ) {
    return 'bg-sky-50 text-sky-700 border-sky-200/80';
  }
  
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

/**
 * Automatically enriches a JobTemplate with structured qualification & competency fields
 * (detailPendidikan, detailPengalaman, detailSertifikasi, detailTeknis, detailNonTeknis)
 */
export const enrichJobTemplate = (template: JobTemplate): JobTemplate => {
  if (!template) return template;

  const clone: JobTemplate = JSON.parse(JSON.stringify(template));

  // 1. Enrich detailPendidikan
  if (!clone.kualifikasi?.detailPendidikan) {
    const rawEdu = (clone.kualifikasi?.pendidikan || '').toLowerCase();
    let degreeLevel: any = 'S1 / D4';
    if (rawEdu.includes('s3') || rawEdu.includes('doktor')) degreeLevel = 'S3';
    else if (rawEdu.includes('s2') || rawEdu.includes('magister') || rawEdu.includes('master')) degreeLevel = 'S2';
    else if (rawEdu.includes('d3') || rawEdu.includes('d1') || rawEdu.includes('diploma')) degreeLevel = 'D1 / D2 / D3';
    else if (rawEdu.includes('sma') || rawEdu.includes('smk') || rawEdu.includes('slta')) degreeLevel = 'SLTA / SMA / SMK';

    const titleLower = (clone.nama || '').toLowerCase();
    const deptLower = (clone.departemen || '').toLowerCase();
    let majors: string[] = ['Semua Jurusan (Terbuka Semua Jurusan Relevan)'];

    if (titleLower.includes('software') || titleLower.includes('tech') || titleLower.includes('developer') || deptLower.includes('teknologi')) {
      majors = ['Teknik Informatika / Ilmu Komputer', 'Sistem Informasi / Manajemen Informatika'];
    } else if (titleLower.includes('hr') || titleLower.includes('sdm') || deptLower.includes('sdm')) {
      majors = ['Psikologi / Manajemen SDM (HR)', 'Manajemen / Administrasi Bisnis'];
    } else if (titleLower.includes('akuntan') || titleLower.includes('keuangan') || deptLower.includes('keuangan')) {
      majors = ['Akuntansi / Keuangan / Perpajakan', 'Ekonomi Pembangunan / Perbankan'];
    } else if (titleLower.includes('legal') || titleLower.includes('hukum') || deptLower.includes('hukum')) {
      majors = ['Hukum / Legal Affairs'];
    } else if (titleLower.includes('pemasaran') || titleLower.includes('marketing') || titleLower.includes('sales')) {
      majors = ['Manajemen / Administrasi Bisnis', 'Ilmu Komunikasi / Public Relations / Marcom'];
    }

    clone.kualifikasi = {
      ...clone.kualifikasi,
      detailPendidikan: {
        tingkatPendidikan: degreeLevel,
        jurusan: majors
      }
    };
  }

  // 2. Enrich detailPengalaman
  if (!clone.kualifikasi?.detailPengalaman || clone.kualifikasi.detailPengalaman.length === 0) {
    const rawExp = clone.kualifikasi?.pengalaman || 'Minimal 1-3 tahun pengalaman';
    let duration = '1 - 2 Tahun';
    if (rawExp.includes('3-5') || rawExp.includes('3 - 5') || rawExp.includes('3 s/d 5')) duration = '3 - 5 Tahun';
    else if (rawExp.includes('5-8') || rawExp.includes('5 - 8') || rawExp.includes('5+')) duration = '5 - 8 Tahun';
    else if (rawExp.includes('10+')) duration = 'Lebih dari 10 Tahun (Senior Executive)';

    clone.kualifikasi = {
      ...clone.kualifikasi,
      detailPengalaman: [{
        id: `exp-${clone.id || '1'}`,
        lamaPengalaman: duration,
        posisi: clone.nama || 'Posisi Relevan',
        bidangIndustri: clone.kategori || clone.departemen || 'Industri Relevan'
      }]
    };
  }

  // 3. Enrich detailSertifikasi
  if (!clone.kualifikasi?.detailSertifikasi || clone.kualifikasi.detailSertifikasi.length === 0) {
    const rawCerts = clone.kualifikasi?.sertifikasi || [];
    const certItems = rawCerts.map((c, idx) => {
      const cLower = c.toLowerCase();
      let jenis: any = 'Profesional Umum';
      if (cLower.includes('bnsp')) jenis = 'BNSP';
      else if (cLower.includes('iso')) jenis = 'ISO';
      else if (cLower.includes('sim') || cLower.includes('str')) jenis = 'Lisensi Resmi / SIM';

      return {
        id: `cert-${idx}`,
        jenisSertifikasi: jenis,
        namaSertifikasi: c,
        bidangSertifikasi: clone.kategori || clone.departemen
      };
    });

    clone.kualifikasi = {
      ...clone.kualifikasi,
      detailSertifikasi: certItems
    };
  }

  // 4. Enrich detailTeknis (Hard Skills)
  if (!clone.kompetensi?.detailTeknis || clone.kompetensi.detailTeknis.length === 0) {
    const rawTech = clone.kompetensi?.teknis || [];
    const lvlLower = (clone.level || '').toLowerCase();
    const defaultLevel = (lvlLower.includes('c-level') || lvlLower.includes('director') || lvlLower.includes('manager'))
      ? 'Ahli'
      : (lvlLower.includes('supervisor') || lvlLower.includes('senior') || lvlLower.includes('specialist'))
      ? 'Mahir'
      : 'Menengah';

    const techItems = rawTech.map((skill, idx) => ({
      id: `tech-${idx}`,
      namaSkill: skill,
      tingkatKemahiran: defaultLevel as any,
      kategori: 'Teknis' as const
    }));

    clone.kompetensi = {
      ...clone.kompetensi,
      detailTeknis: techItems
    };
  }

  // 5. Enrich detailNonTeknis (Soft Skills)
  if (!clone.kompetensi?.detailNonTeknis || clone.kompetensi.detailNonTeknis.length === 0) {
    const rawSoft = clone.kompetensi?.nonTeknis || [];
    const lvlLower = (clone.level || '').toLowerCase();
    const defaultLevel = (lvlLower.includes('c-level') || lvlLower.includes('director') || lvlLower.includes('manager'))
      ? 'Ahli'
      : 'Mahir';

    const softItems = rawSoft.map((skill, idx) => ({
      id: `soft-${idx}`,
      namaSkill: skill,
      tingkatKemahiran: defaultLevel as any,
      kategori: 'Non-Teknis' as const
    }));

    clone.kompetensi = {
      ...clone.kompetensi,
      detailNonTeknis: softItems
    };
  }

  return clone;
};

