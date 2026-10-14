import { Attendance, Leave, LeaveCategory, Employee } from '../../types';
import rawEmployees from './karyawan';

const sampleEmployees = rawEmployees as unknown as Employee[];

/**
 * SISTEM AUTO-GENERASI DATA PRESENSI MODE DEMO
 * 
 * Sistem ini secara dinamis memeriksa tanggal & jam saat pengguna menekan "Masuk Mode Demo":
 * - Menghasilkan data presensi HANYA dari tanggal 1 bulan lalu hingga TANGGAL & JAM SAAT INI (baseDate).
 *   (Contoh: Jika diklik 23 Juli 2026 pukul 14:30, maka presensi digenerasi dari 1 Juni 2026 - 23 Juli 2026 14:30)
 * - Hari ini (baseDate):
 *   * Shift yang belum dimulai -> Belum ada catatan (belum clock-in) agar user dapat mencoba presensi manual.
 *   * Shift yang sedang berjalan -> Sudah Check-In, Check-Out masih kosong/pending (--:--).
 *   * Shift yang sudah selesai -> Check-In dan Check-Out tercatat dan tidak melebihi jam saat tombol diklik.
 * - Tanggal masa depan (setelah baseDate) -> TIDAK digenerasi catatan presensi.
 * 
 * Seluruh data diselaraskan dengan:
 * - Toleransi keterlambatan (15 menit) & kalkulasi lateMinutes akurat
 * - Status kehadiran & jenis ketidakhadiran resmi web (Present, Late, Sick, Leave, Absent [Izin & Alpa], WFH)
 * - Jam kerja & shift kerja pabrik/kantor (Non-Shift, Shift 1 Pagi, Shift 2 Siang, Shift 3 Malam, Shift Middle)
 * - Overtime / lembur terverifikasi
 */

export interface DemoMonthWindow {
  baseDate: Date;
  baseYear: number;
  baseMonth: number; // 0 - 11
  prevMonthYear: number;
  prevMonth: number; // 0 - 11
  currMonthYear: number;
  currMonth: number; // 0 - 11
  nextMonthYear: number;
  nextMonth: number; // 0 - 11
  startDate: Date;
  endDate: Date;
  startDateStr: string; // YYYY-MM-DD
  endDateStr: string; // YYYY-MM-DD
  totalDays: number;
}

/**
 * Menghitung jendela 3 bulan (1 bulan lalu, bulan ini, 1 bulan mendatang)
 */
export function getDemoMonthWindow(baseDate = new Date()): DemoMonthWindow {
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();

  // Tanggal 1 bulan lalu
  const startDate = new Date(baseYear, baseMonth - 1, 1);
  // Tanggal terakhir bulan mendatang (hari ke-0 dari 2 bulan ke depan)
  const endDate = new Date(baseYear, baseMonth + 2, 0);

  const prevMonthDate = new Date(baseYear, baseMonth - 1, 1);
  const nextMonthDate = new Date(baseYear, baseMonth + 1, 1);

  const formatDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return {
    baseDate,
    baseYear,
    baseMonth,
    prevMonthYear: prevMonthDate.getFullYear(),
    prevMonth: prevMonthDate.getMonth(),
    currMonthYear: baseYear,
    currMonth: baseMonth,
    nextMonthYear: nextMonthDate.getFullYear(),
    nextMonth: nextMonthDate.getMonth(),
    startDate,
    endDate,
    startDateStr,
    endDateStr,
    totalDays,
  };
}

// Deterministic PRNG berdasarkan string hash
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Shift definitions matching sampleAttendanceConfig
interface ShiftMeta {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  startMins: number;
  endMins: number;
  breakMins: number;
  tolerance: number;
  crossDay?: boolean;
}

const SHIFT_MAP: Record<string, ShiftMeta> = {
  'shift-reguler': {
    id: 'shift-reguler',
    name: 'NON SHIFT (Kantor)',
    startTime: '08:30',
    endTime: '17:30',
    startMins: 8 * 60 + 30, // 510
    endMins: 17 * 60 + 30, // 1050
    breakMins: 60,
    tolerance: 15,
  },
  'shift-1-pagi': {
    id: 'shift-1-pagi',
    name: 'Shift 1 (Pagi)',
    startTime: '07:00',
    endTime: '16:00',
    startMins: 7 * 60, // 420
    endMins: 16 * 60, // 960
    breakMins: 60,
    tolerance: 15,
  },
  'shift-2-siang': {
    id: 'shift-2-siang',
    name: 'Shift 2 (Siang / Sore)',
    startTime: '15:00',
    endTime: '00:00',
    startMins: 15 * 60, // 900
    endMins: 24 * 60, // 1440
    breakMins: 60,
    tolerance: 15,
    crossDay: true,
  },
  'shift-3-malam': {
    id: 'shift-3-malam',
    name: 'Shift 3 (Malam)',
    startTime: '23:00',
    endTime: '08:00',
    startMins: 23 * 60, // 1380
    endMins: 8 * 60, // 480
    breakMins: 60,
    tolerance: 15,
    crossDay: true,
  },
  'shift-middle': {
    id: 'shift-middle',
    name: 'Shift Middle',
    startTime: '10:00',
    endTime: '19:00',
    startMins: 10 * 60, // 600
    endMins: 19 * 60, // 1140
    breakMins: 60,
    tolerance: 15,
  },
};

function formatMinsToHHMM(mins: number): string {
  const norm = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * AUTO GENERATOR PRESENSI MODE DEMO
 * Menghasilkan daftar presensi lengkap 3 bulan yang dinamis dan berbobot realistis.
 */
export function generateDemoAttendance(baseDate = new Date()): Attendance[] {
  const windowInfo = getDemoMonthWindow(baseDate);
  const { startDate } = windowInfo;

  const formatDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDate(baseDate);
  const currentHour = baseDate.getHours();
  const currentMinute = baseDate.getMinutes();
  const currentMins = currentHour * 60 + currentMinute;

  // Rentang presensi: HANYA dari tanggal 1 bulan lalu hingga HARI INI (baseDate)
  // Tidak ada presensi yang digenerasi untuk tanggal di masa depan (> todayStr)
  const attendanceEndDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

  const dates: { dateStr: string; dateObj: Date; dayOfWeek: number; isToday: boolean }[] = [];
  const cur = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  while (cur <= attendanceEndDate) {
    const curStr = formatDate(cur);
    dates.push({
      dateStr: curStr,
      dateObj: new Date(cur),
      dayOfWeek: cur.getDay(), // 0 = Minggu, 6 = Sabtu
      isToday: curStr === todayStr,
    });
    cur.setDate(cur.getDate() + 1);
  }

  const attendanceRecords: Attendance[] = [];

  // Looping seluruh karyawan
  for (const emp of sampleEmployees) {
    const isExecutive = emp.id === 'emp-001'; // Alvareza Hilka Pratama (President Director)
    const isOffice =
      emp.departmentId === 'dept-direksi' ||
      emp.departmentId === 'dept-sdm' ||
      emp.departmentId === 'dept-perkantoran' ||
      emp.departmentId === 'dept-teknologi';

    // Shift default karyawan
    const defaultShiftId = emp.shift || (isOffice ? 'shift-reguler' : 'shift-1-pagi');
    const assignedShift = SHIFT_MAP[defaultShiftId] || SHIFT_MAP['shift-reguler'];

    for (let dayIdx = 0; dayIdx < dates.length; dayIdx++) {
      const { dateStr, dayOfWeek, isToday } = dates[dayIdx];

      // Tentukan apakah hari ini hari kerja bagi karyawan
      let isWorkDay = true;
      let activeShift = assignedShift;

      if (isOffice || isExecutive) {
        // Kantor: Senin s/d Jumat bekerja, Sabtu & Minggu libur (OFF)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          isWorkDay = false;
        }
      } else {
        // Karyawan Shift Operasional (Pabrik / Maintenance / Logistik / QA)
        // Pola rotasi shift: 6 hari kerja, 1 hari libur (atau rotasi shift)
        const empSeed = stringHash(`${emp.id}-shift-rot-${dayIdx}`);
        const rotVal = (empSeed + dayIdx) % 7;
        if (rotVal === 6) {
          isWorkDay = false; // Hari libur roster
        } else {
          // Rotasi shift berkala
          const shiftCycle = (empSeed + Math.floor(dayIdx / 7)) % 3;
          if (shiftCycle === 0) activeShift = SHIFT_MAP['shift-1-pagi'];
          else if (shiftCycle === 1) activeShift = SHIFT_MAP['shift-2-siang'];
          else activeShift = SHIFT_MAP['shift-middle'];
        }
      }

      // Jika hari libur, tidak ada presensi kerja (OFF)
      if (!isWorkDay) {
        continue;
      }

      // Seed deterministic untuk status & presensi hari ini
      const daySeed = stringHash(`${emp.id}-${dateStr}`);
      const rand1 = pseudoRandom(daySeed);
      const rand2 = pseudoRandom(daySeed + 100);
      const rand3 = pseudoRandom(daySeed + 200);

      // --- 1. SPECIAL CASE: EXECUTIVE DIREKSI (emp-001) ---
      if (isExecutive) {
        if (!isToday) {
          const checkInMins = activeShift.startMins - Math.floor(rand2 * 20) - 5; // 08:05 - 08:25
          const checkOutMins = activeShift.endMins + Math.floor(rand3 * 45) + 15; // 17:45 - 18:30
          const checkInStr = formatMinsToHHMM(checkInMins);
          const checkOutStr = formatMinsToHHMM(checkOutMins);
          const workDurationMinutes = checkOutMins - checkInMins;

          const execNotes = [
            'Kehadiran Eksekutif Direksi - Agenda RUPS & Operasional',
            'Supervisi Operasional Pabrik & Review Bisnis Kuartal',
            'Rapat Koordinasi Dewan Direksi & Strategic Planning',
            'Peninjauan Lini Fasilitas Manufaktur Cikarang',
            'Penandatanganan Dokumen Kerjasama Strategis Korporasi',
          ];
          const note = execNotes[daySeed % execNotes.length];

          attendanceRecords.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            status: 'Present',
            checkIn: checkInStr,
            checkOut: checkOutStr,
            clockIn: `${dateStr}T${checkInStr}:00.000Z`,
            clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
            shiftId: activeShift.id,
            shiftName: activeShift.name,
            workHours: 8.5,
            workDurationMinutes,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            overtimeMinutes: 0,
            overtimeHours: 0,
            notes: note,
          });
        } else {
          // Hari Ini: Perhatikan jam saat tombol diklik (currentMins)
          if (currentMins < 480) {
            // Sebelum jam 08:00 -> Belum hadir / belum clock in
            continue;
          } else if (currentMins < activeShift.endMins) {
            // Sedang bertugas di kantor -> Sudah Check In, belum Check Out
            const checkInMins = Math.min(currentMins, 480 + 10 + Math.floor(rand2 * 15));
            const checkInStr = formatMinsToHHMM(checkInMins);
            const workDurationMinutes = Math.max(0, currentMins - checkInMins);
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Kehadiran Eksekutif Direksi - Sedang bertugas (Belum checkout)',
            });
          } else {
            // Sudah melewati jam pulang -> Lengkap Check In & Check Out (tidak melebihi currentMins)
            const checkInMins = 480 + 10 + Math.floor(rand2 * 15);
            const checkOutMins = Math.min(currentMins, activeShift.endMins + Math.floor(rand3 * 30) + 10);
            const checkInStr = formatMinsToHHMM(checkInMins);
            const checkOutStr = formatMinsToHHMM(checkOutMins);
            const workDurationMinutes = checkOutMins - checkInMins;
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              checkOut: checkOutStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Kehadiran Eksekutif Direksi - Agenda RUPS & Operasional',
            });
          }
        }
        continue;
      }

      // --- 2. DISTRIBUSI REGULER KARYAWAN LAIN ---
      // Pembagian Persentase Realistis:
      // - 0.00 - 0.77: Hadir Tepat Waktu (Present) ~77%
      // - 0.77 - 0.85: Terlambat (Late) ~8%
      // - 0.85 - 0.88: Sakit (Sick) ~3%
      // - 0.88 - 0.91: Cuti (Leave) ~3%
      // - 0.91 - 0.93: Izin (Absent / Izin) ~2%
      // - 0.93 - 0.94: Alpa (Absent / Alpa Mangkir) ~1%
      // - 0.94 - 0.96: WFH (Work From Home untuk kantor) ~2%
      // - 0.96 - 1.00: Lembur Terjadwal (Present + Overtime) ~4%

      if (rand1 < 0.77) {
        // [HADIR TEPAT WAKTU]
        if (!isToday) {
          const checkInMins = activeShift.startMins - Math.floor(rand2 * 20) - 5;
          const checkOutMins = activeShift.endMins + Math.floor(rand3 * 15);
          const checkInStr = formatMinsToHHMM(checkInMins);
          const checkOutStr = formatMinsToHHMM(checkOutMins);
          const workDurationMinutes = checkOutMins - checkInMins;

          attendanceRecords.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            status: 'Present',
            checkIn: checkInStr,
            checkOut: checkOutStr,
            clockIn: `${dateStr}T${checkInStr}:00.000Z`,
            clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
            shiftId: activeShift.id,
            shiftName: activeShift.name,
            workHours: 8,
            workDurationMinutes,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            overtimeMinutes: 0,
            overtimeHours: 0,
            notes: 'Tepat waktu',
          });
        } else {
          // Hari Ini: perhatikan jam saat ini (currentMins)
          const checkInThreshold = activeShift.startMins - 20;
          if (currentMins < checkInThreshold) {
            // Shift belum mulai hari ini -> belum ada presensi (bisa dicoba manual oleh user)
            continue;
          } else if (currentMins < activeShift.endMins) {
            // Shift sedang berlangsung saat ini -> Check In sudah, Check Out pending
            const checkInMins = Math.min(currentMins, activeShift.startMins - Math.floor(rand2 * 15) - 5);
            const checkInStr = formatMinsToHHMM(checkInMins);
            const workDurationMinutes = Math.max(0, currentMins - checkInMins);
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Tepat waktu - Sedang bertugas (Belum checkout)',
            });
          } else {
            // Shift sudah selesai hari ini -> Check In dan Check Out selesai
            const checkInMins = activeShift.startMins - Math.floor(rand2 * 20) - 5;
            const checkOutMins = Math.min(currentMins, activeShift.endMins + Math.floor(rand3 * 15));
            const checkInStr = formatMinsToHHMM(checkInMins);
            const checkOutStr = formatMinsToHHMM(checkOutMins);
            const workDurationMinutes = checkOutMins - checkInMins;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              checkOut: checkOutStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours: 8,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Tepat waktu',
            });
          }
        }
      } else if (rand1 < 0.85) {
        // [TERLAMBAT / LATE]
        const lateMinutes = 16 + Math.floor(rand2 * 45); // 16 - 60 menit
        const lateReasons = [
          `Terlambat ${lateMinutes} menit - kemacetan padat di jalur arteri Cikarang`,
          `Terlambat ${lateMinutes} menit - ban kendaraan bocor di perjalanan`,
          `Terlambat ${lateMinutes} menit - hujan lebat & genangan air pagi hari`,
          `Terlambat ${lateMinutes} menit - gangguan jadwal angkutan / shuttle jemputan`,
          `Terlambat ${lateMinutes} menit - mengantar anggota keluarga periksa ke klinik`,
          `Terlambat ${lateMinutes} menit - kendala teknis mesin sepeda motor`,
        ];
        const reason = lateReasons[daySeed % lateReasons.length];

        if (!isToday) {
          const checkInMins = activeShift.startMins + lateMinutes;
          const checkOutMins = activeShift.endMins + Math.floor(rand3 * 20);
          const checkInStr = formatMinsToHHMM(checkInMins);
          const checkOutStr = formatMinsToHHMM(checkOutMins);
          const workDurationMinutes = Math.max(0, checkOutMins - checkInMins);

          attendanceRecords.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            status: 'Late',
            checkIn: checkInStr,
            checkOut: checkOutStr,
            clockIn: `${dateStr}T${checkInStr}:00.000Z`,
            clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
            shiftId: activeShift.id,
            shiftName: activeShift.name,
            workHours: Math.max(0, Math.round(((workDurationMinutes - 60) / 60) * 10) / 10),
            workDurationMinutes,
            lateMinutes,
            earlyLeaveMinutes: 0,
            overtimeMinutes: 0,
            overtimeHours: 0,
            notes: reason,
          });
        } else {
          // Hari Ini
          const checkInMins = activeShift.startMins + lateMinutes;
          if (currentMins < checkInMins) {
            // Belum tiba di lokasi kerja -> belum tercatat
            continue;
          } else if (currentMins < activeShift.endMins) {
            // Sedang bekerja saat ini -> Check In tercatat (Late), Check Out pending
            const checkInStr = formatMinsToHHMM(checkInMins);
            const workDurationMinutes = Math.max(0, currentMins - checkInMins);
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Late',
              checkIn: checkInStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: `${reason} - Sedang bertugas (Belum checkout)`,
            });
          } else {
            // Sudah selesai hari ini
            const checkInStr = formatMinsToHHMM(checkInMins);
            const checkOutMins = Math.min(currentMins, activeShift.endMins + Math.floor(rand3 * 20));
            const checkOutStr = formatMinsToHHMM(checkOutMins);
            const workDurationMinutes = Math.max(0, checkOutMins - checkInMins);

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Late',
              checkIn: checkInStr,
              checkOut: checkOutStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours: Math.max(0, Math.round(((workDurationMinutes - 60) / 60) * 10) / 10),
              workDurationMinutes,
              lateMinutes,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: reason,
            });
          }
        }
      } else if (rand1 < 0.88) {
        // [SAKIT / SICK]
        if (isToday && currentMins < 360) {
          // Terlalu pagi sebelum jam operasional
          continue;
        }
        const sickReasons = [
          'Sakit - Surat Keterangan Dokter (SKD) terlampir dari Klinik Pratama',
          'Sakit demam tinggi & flu berat (SKD RS Siloam Lippo Cikarang)',
          'Sakit migrain kronis & vertigo - anjuran istirahat dokter 1 hari',
          'Sakit gangguan pencernaan akut / maag (SKD terverifikasi)',
        ];
        const note = sickReasons[daySeed % sickReasons.length];

        attendanceRecords.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          status: 'Sick',
          shiftId: activeShift.id,
          shiftName: activeShift.name,
          workHours: 0,
          workDurationMinutes: 0,
          lateMinutes: 0,
          earlyLeaveMinutes: 0,
          overtimeMinutes: 0,
          overtimeHours: 0,
          notes: note,
        });
      } else if (rand1 < 0.91) {
        // [CUTI / LEAVE]
        const leaveReasons = [
          'Cuti - Cuti Tahunan (Disetujui HR & Atasan Langsung)',
          'Cuti - Keperluan keluarga & mudik terencana',
          'Cuti - Menghadiri pernikahan saudara kandung di luar kota',
          'Cuti Tahunan - Istirahat & agenda keluarga',
        ];
        const note = leaveReasons[daySeed % leaveReasons.length];

        attendanceRecords.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          status: 'Leave',
          shiftId: activeShift.id,
          shiftName: activeShift.name,
          workHours: 0,
          workDurationMinutes: 0,
          lateMinutes: 0,
          earlyLeaveMinutes: 0,
          overtimeMinutes: 0,
          overtimeHours: 0,
          notes: note,
        });
      } else if (rand1 < 0.93) {
        // [IZIN / ABSENT DENGAN IZIN]
        if (isToday && currentMins < 360) {
          continue;
        }
        const izinReasons = [
          'Izin - Keperluan keluarga mendesak (Disetujui Dept Head)',
          'Izin - Pengurusan dokumen kependudukan & akta di Disdukcapil',
          'Izin - Menghadiri prosesi pemakaman kerabat dekat di luar kota',
          'Izin - Renovasi darurat atap rumah pasca angin puting beliung',
        ];
        const note = izinReasons[daySeed % izinReasons.length];

        attendanceRecords.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          status: 'Absent',
          shiftId: activeShift.id,
          shiftName: activeShift.name,
          workHours: 0,
          workDurationMinutes: 0,
          lateMinutes: 0,
          earlyLeaveMinutes: 0,
          overtimeMinutes: 0,
          overtimeHours: 0,
          notes: note,
        });
      } else if (rand1 < 0.94) {
        // [ALPA / MANGKIR TANPA KETERANGAN]
        if (isToday && currentMins < activeShift.startMins + 120) {
          // Hari ini: Alpa baru dicatat jika telah melewati minimal 2 jam dari jam masuk shift
          continue;
        }
        const alpaReasons = [
          'Alpa - Tanpa keterangan resmi (tidak ada laporan ke supervisor/HR)',
          'Alpa - Mangkir kerja hari kerja tanpa pemberitahuan dan telepon tidak aktif',
          'Alpa - Tidak hadir berturut-turut tanpa surat izin resmi',
        ];
        const note = alpaReasons[daySeed % alpaReasons.length];

        attendanceRecords.push({
          id: `att-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          status: 'Absent',
          shiftId: activeShift.id,
          shiftName: activeShift.name,
          workHours: 0,
          workDurationMinutes: 0,
          lateMinutes: 0,
          earlyLeaveMinutes: 0,
          overtimeMinutes: 0,
          overtimeHours: 0,
          notes: note,
        });
      } else if (rand1 < 0.96 && isOffice) {
        // [WORK FROM HOME / WFH]
        if (!isToday) {
          const checkInMins = activeShift.startMins - Math.floor(rand2 * 10);
          const checkOutMins = activeShift.endMins + Math.floor(rand3 * 10);
          const checkInStr = formatMinsToHHMM(checkInMins);
          const checkOutStr = formatMinsToHHMM(checkOutMins);

          attendanceRecords.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            status: 'WFH',
            checkIn: checkInStr,
            checkOut: checkOutStr,
            clockIn: `${dateStr}T${checkInStr}:00.000Z`,
            clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
            shiftId: activeShift.id,
            shiftName: activeShift.name,
            workHours: 8,
            workDurationMinutes: 480,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            overtimeMinutes: 0,
            overtimeHours: 0,
            notes: 'Work From Home (WFH) - Disetujui Head of Dept',
          });
        } else {
          // Hari Ini
          if (currentMins < activeShift.startMins - 20) {
            continue;
          } else if (currentMins < activeShift.endMins) {
            const checkInMins = Math.min(currentMins, activeShift.startMins - Math.floor(rand2 * 10));
            const checkInStr = formatMinsToHHMM(checkInMins);
            const workDurationMinutes = Math.max(0, currentMins - checkInMins);
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'WFH',
              checkIn: checkInStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Work From Home (WFH) - Sedang bertugas (Belum checkout)',
            });
          } else {
            const checkInMins = activeShift.startMins - Math.floor(rand2 * 10);
            const checkOutMins = Math.min(currentMins, activeShift.endMins + Math.floor(rand3 * 10));
            const checkInStr = formatMinsToHHMM(checkInMins);
            const checkOutStr = formatMinsToHHMM(checkOutMins);

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'WFH',
              checkIn: checkInStr,
              checkOut: checkOutStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours: 8,
              workDurationMinutes: 480,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              overtimeHours: 0,
              notes: 'Work From Home (WFH) - Disetujui Head of Dept',
            });
          }
        }
      } else {
        // [LEMBUR / OVERTIME RESMI]
        const overtimeHours = [1.5, 2, 2.5, 3][daySeed % 4];
        const overtimeMinutes = overtimeHours * 60;
        const overtimeNotes = [
          `Lembur ${overtimeHours} jam - Kejar target batch produksi & persiapan audit ISO`,
          `Lembur ${overtimeHours} jam - Stock opname akhir bulan material pergudangan`,
          `Lembur ${overtimeHours} jam - Penanganan darurat pemeliharaan mesin conveyor lini utama`,
          `Lembur ${overtimeHours} jam - Rekonsiliasi penutupan buku & laporan keuangan bulanan`,
        ];
        const note = overtimeNotes[daySeed % overtimeNotes.length];

        if (!isToday) {
          const checkInMins = activeShift.startMins - Math.floor(rand2 * 15) - 5;
          const checkOutMins = activeShift.endMins + overtimeMinutes;
          const checkInStr = formatMinsToHHMM(checkInMins);
          const checkOutStr = formatMinsToHHMM(checkOutMins);
          const workDurationMinutes = checkOutMins - checkInMins;

          attendanceRecords.push({
            id: `att-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            status: 'Present',
            checkIn: checkInStr,
            checkOut: checkOutStr,
            clockIn: `${dateStr}T${checkInStr}:00.000Z`,
            clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
            shiftId: activeShift.id,
            shiftName: activeShift.name,
            workHours: 8 + overtimeHours,
            workDurationMinutes,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            overtimeMinutes,
            overtimeHours,
            notes: note,
          });
        } else {
          // Hari Ini
          if (currentMins < activeShift.startMins - 20) {
            continue;
          } else if (currentMins < activeShift.endMins + overtimeMinutes) {
            const checkInMins = Math.min(currentMins, activeShift.startMins - Math.floor(rand2 * 15) - 5);
            const checkInStr = formatMinsToHHMM(checkInMins);
            const workDurationMinutes = Math.max(0, currentMins - checkInMins);
            const workHours = Math.round((workDurationMinutes / 60) * 10) / 10;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: currentMins > activeShift.endMins ? currentMins - activeShift.endMins : 0,
              overtimeHours: currentMins > activeShift.endMins ? Math.round(((currentMins - activeShift.endMins) / 60) * 10) / 10 : 0,
              notes: `${note} (Sedang bertugas)`,
            });
          } else {
            const checkInMins = activeShift.startMins - Math.floor(rand2 * 15) - 5;
            const checkOutMins = Math.min(currentMins, activeShift.endMins + overtimeMinutes);
            const checkInStr = formatMinsToHHMM(checkInMins);
            const checkOutStr = formatMinsToHHMM(checkOutMins);
            const workDurationMinutes = checkOutMins - checkInMins;

            attendanceRecords.push({
              id: `att-${emp.id}-${dateStr}`,
              employeeId: emp.id,
              date: dateStr,
              status: 'Present',
              checkIn: checkInStr,
              checkOut: checkOutStr,
              clockIn: `${dateStr}T${checkInStr}:00.000Z`,
              clockOut: `${dateStr}T${checkOutStr}:00.000Z`,
              shiftId: activeShift.id,
              shiftName: activeShift.name,
              workHours: 8 + overtimeHours,
              workDurationMinutes,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes,
              overtimeHours,
              notes: note,
            });
          }
        }
      }
    }
  }

  return attendanceRecords;
}

/**
 * AUTO GENERATOR CUTI & SAKIT MODE DEMO
 * Menghasilkan data Cuti yang selaras 100% dengan data kehadiran (status Leave & Sick)
 */
export function generateDemoLeaves(attendanceList: Attendance[]): Leave[] {
  const leaves: Leave[] = [];
  let leaveCounter = 1;

  // Filter presensi yang berstatus Leave (Sakit merupakan data ketidakhadiran di Attendance, bukan cuti)
  const absenceAttendance = attendanceList.filter(
    (att) => att.status === 'Leave'
  );

  for (const att of absenceAttendance) {
    const leaveType: LeaveCategory = 'Tahunan';
    const reason = att.notes || 'Cuti Tahunan';

    leaves.push({
      id: `leave-demo-${leaveCounter++}`,
      employeeId: att.employeeId,
      leaveType,
      startDate: att.date,
      endDate: att.date,
      duration: 1,
      reason,
      status: 'Approved',
      approvedBy: 'Alvareza Hilka Pratama, S.Kom., M.M.',
      approvedAt: `${att.date}T08:00:00.000Z`,
      createdAt: `${att.date}T07:30:00.000Z`,
    });
  }

  return leaves;
}
