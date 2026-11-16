import { Leave, LeaveCategory, EmployeeLeaveQuota, Attendance, Employee } from '../../types';
import rawEmployees from './karyawan';
import { getDemoMonthWindow } from './generator-presensi-demo';

const sampleEmployees = rawEmployees as unknown as Employee[];

/**
 * SISTEM AUTO-GENERASI DATA CUTI & SALDO CUTI MODE DEMO
 * 
 * Mekanisme:
 * 1. Mendeteksi tanggal tombol ditekan (baseDate, default new Date())
 * 2. Menghitung rentang 3 bulan penuh:
 *    - 1 bulan yang lalu (mulai tanggal 1)
 *    - Bulan berjalan saat ini
 *    - 1 bulan mendatang (hingga akhir bulan)
 * 3. Menghasilkan:
 *    a. Pengajuan Cuti (Leave[]) yang tersebar di ketiga bulan tersebut,
 *       tersinkronisasi 100% dengan data absensi berstatus Leave (catatan: sakit/Sick
 *       merupakan data ketidakhadiran, bukan jenis cuti), ditambah pengajuan cuti
 *       multi-hari dan cuti terjadwal bulan depan.
 *    b. Penyesuaian Saldo Cuti (EmployeeLeaveQuota[]), termasuk penyesuaian
 *       tanggal awal perhitungan saldo cuti (updatedAt per awal tahun/periode),
 *       hak tahunan (12 hari), saldo bawaan lalu (carry forward), bonus penyesuaian,
 *       dan catatan riwayat kuota resmi.
 */

// Helper tanggal YYYY-MM-DD
function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function addDaysToDateStr(dateStr: string, days: number): string {
  const d = parseYMD(dateStr);
  d.setDate(d.getDate() + days);
  return formatYMD(d);
}

/**
 * GENERATOR PENGAJUAN CUTI DINAMIS (LEAVE)
 */
export function generateDemoLeaves(
  attendanceList: Attendance[] = [],
  baseDate = new Date()
): Leave[] {
  const window = getDemoMonthWindow(baseDate);
  const leaves: Leave[] = [];
  const processedLeaveDates = new Set<string>(); // key: `${employeeId}_${date}`
  let leaveCounter = 1;

  // 1. Sinkronisasi dari log Presensi (HANYA status 'Leave')
  // Catatan: Sakit (status 'Sick') dicatat sebagai data ketidakhadiran (Attendance), BUKAN data cuti!
  const leaveAttendance = attendanceList
    .filter((att) => att.status === 'Leave')
    .sort((a, b) => {
      if (a.employeeId !== b.employeeId) return a.employeeId.localeCompare(b.employeeId);
      return a.date.localeCompare(b.date);
    });

  // Gabungkan tanggal berurutan untuk karyawan yang sama menjadi satu pengajuan multi-hari
  let currentGroup: Attendance[] = [];

  const flushGroup = (group: Attendance[]) => {
    if (group.length === 0) return;
    const first = group[0];
    const last = group[group.length - 1];
    const leaveType: LeaveCategory = 'Tahunan';
    const reason = first.notes || 'Cuti Tahunan Reguler';

    group.forEach((att) => {
      processedLeaveDates.add(`${att.employeeId}_${att.date}`);
    });

    const approvedDate = first.date;
    leaves.push({
      id: `leave-demo-${leaveCounter++}`,
      employeeId: first.employeeId,
      leaveType,
      startDate: first.date,
      endDate: last.date,
      duration: group.length,
      reason,
      status: 'Approved',
      approvedBy: first.employeeId === 'emp-001' ? 'Dewan Komisaris' : 'Budi Santoso (HR Manager)',
      approvedAt: `${approvedDate}T08:00:00.000Z`,
      createdAt: `${approvedDate}T07:30:00.000Z`,
    });
  };

  for (let i = 0; i < leaveAttendance.length; i++) {
    const current = leaveAttendance[i];
    if (currentGroup.length === 0) {
      currentGroup.push(current);
    } else {
      const prev = currentGroup[currentGroup.length - 1];
      const prevDate = parseYMD(prev.date);
      const currDate = parseYMD(current.date);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      // Jika karyawan sama, status sama, dan berurutan (jarak 1-3 hari kalender mencakup weekend)
      if (prev.employeeId === current.employeeId && prev.status === current.status && diffDays <= 3) {
        currentGroup.push(current);
      } else {
        flushGroup(currentGroup);
        currentGroup = [current];
      }
    }
  }
  flushGroup(currentGroup);

  // 2. Tambahkan Pengajuan Cuti Tematik Terstruktur di 3 Bulan Penuh
  // Mencakup: 1 bulan lalu, bulan ini, dan 1 bulan mendatang
  // dengan kategori beragam: Tahunan, Menikah, Istri Melahirkan, Berduka, Khusus, Diluar Tanggungan
  const thematicLeaveTemplates: Array<{
    monthOffset: -1 | 0 | 1; // -1: bulan lalu, 0: bulan ini, 1: bulan mendatang
    dayOfMonth: number;
    duration: number;
    employeeId: string;
    leaveType: LeaveCategory;
    reason: string;
  }> = [
    // --- 1 BULAN YANG LALU ---
    {
      monthOffset: -1,
      dayOfMonth: 4,
      duration: 3,
      employeeId: 'emp-003',
      leaveType: 'Tahunan',
      reason: 'Mudik dan acara syukuran keluarga besar di kampung halaman',
    },
    {
      monthOffset: -1,
      dayOfMonth: 10,
      duration: 2,
      employeeId: 'emp-005',
      leaveType: 'Khusus',
      reason: 'Izin cuti khusus: Pendampingan persalinan kelahiran anak kedua di RS Hermina Cikarang',
    },
    {
      monthOffset: -1,
      dayOfMonth: 15,
      duration: 3,
      employeeId: 'emp-012',
      leaveType: 'Menikah',
      reason: 'Izin cuti pernikahan resmi (Akad & Resepsi) di Solo',
    },
    {
      monthOffset: -1,
      dayOfMonth: 21,
      duration: 2,
      employeeId: 'emp-018',
      leaveType: 'Berduka',
      reason: 'Kemalangan atas berpulangnya ayah mertua di Kuningan, Jawa Barat',
    },
    {
      monthOffset: -1,
      dayOfMonth: 26,
      duration: 1,
      employeeId: 'emp-022',
      leaveType: 'Khusus',
      reason: 'Pengurusan dokumen akta tanah waris dan legalitas perbankan',
    },

    // --- BULAN SAAT INI ---
    {
      monthOffset: 0,
      dayOfMonth: 5,
      duration: 2,
      employeeId: 'emp-007',
      leaveType: 'Tahunan',
      reason: 'Acara keluarga mendampingi orang tua periksa kesehatan berkala',
    },
    {
      monthOffset: 0,
      dayOfMonth: 12,
      duration: 1,
      employeeId: 'emp-009',
      leaveType: 'Khusus',
      reason: 'Urusan perpanjangan paspor dinas dan legalisir dokumen kedutaan',
    },
    {
      monthOffset: 0,
      dayOfMonth: 18,
      duration: 2,
      employeeId: 'emp-028',
      leaveType: 'Khusus',
      reason: 'Izin cuti khusus: Tasyakuran khitanan putra pertama dan doa bersama keluarga',
    },
    {
      monthOffset: 0,
      dayOfMonth: 22,
      duration: 3,
      employeeId: 'emp-014',
      leaveType: 'Tahunan',
      reason: 'Renovasi mendesak bagian atap rumah tinggal akibat kebocoran',
    },
    {
      monthOffset: 0,
      dayOfMonth: 27,
      duration: 2,
      employeeId: 'emp-031',
      leaveType: 'Berduka',
      reason: 'Takziah keluarga besar atas wafatnya kakek kandung di Cirebon',
    },

    // --- 1 BULAN MENDATANG (PENGAJUAN TERJADWAL BULAN DEPAN) ---
    {
      monthOffset: 1,
      dayOfMonth: 3,
      duration: 3,
      employeeId: 'emp-002',
      leaveType: 'Tahunan',
      reason: 'Cuti tahunan yang telah direncanakan untuk liburan keluarga anak sekolah',
    },
    {
      monthOffset: 1,
      dayOfMonth: 8,
      duration: 4,
      employeeId: 'emp-010',
      leaveType: 'Tahunan',
      reason: 'Cuti tahunan pulang kampung mudik ke Surabaya, Jawa Timur',
    },
    {
      monthOffset: 1,
      dayOfMonth: 15,
      duration: 2,
      employeeId: 'emp-023',
      leaveType: 'Khusus',
      reason: 'Izin cuti khusus: Menghadiri prosesi akad dan resepsi pernikahan putri sulung di Yogyakarta',
    },
    {
      monthOffset: 1,
      dayOfMonth: 19,
      duration: 2,
      employeeId: 'emp-016',
      leaveType: 'Khusus',
      reason: 'Menghadiri wisuda kelulusan magister adik kandung di Bandung',
    },
    {
      monthOffset: 1,
      dayOfMonth: 24,
      duration: 5,
      employeeId: 'emp-035',
      leaveType: 'Diluar Tanggungan',
      reason: 'Cuti di luar tanggungan untuk penyelesaian sertifikasi profesi keahlian',
    },
  ];

  for (const tpl of thematicLeaveTemplates) {
    let targetYear = window.currMonthYear;
    let targetMonth = window.currMonth + tpl.monthOffset;

    if (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth -= 12;
      targetYear += 1;
    }

    // Pastikan dayOfMonth tidak melampaui jumlah hari di bulan tersebut
    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const validDay = Math.min(tpl.dayOfMonth, lastDayOfMonth);
    const startDt = new Date(targetYear, targetMonth, validDay, 12, 0, 0);
    const startDateStr = formatYMD(startDt);
    const endDateStr = addDaysToDateStr(startDateStr, tpl.duration - 1);

    // Cek apakah tanggal ini sudah terisi dari sinkronisasi presensi sebelumnya
    let isOverlap = false;
    for (let d = 0; d < tpl.duration; d++) {
      const curDateStr = addDaysToDateStr(startDateStr, d);
      if (processedLeaveDates.has(`${tpl.employeeId}_${curDateStr}`)) {
        isOverlap = true;
        break;
      }
    }

    if (!isOverlap) {
      for (let d = 0; d < tpl.duration; d++) {
        processedLeaveDates.add(`${tpl.employeeId}_${addDaysToDateStr(startDateStr, d)}`);
      }

      const isExecutive = tpl.employeeId === 'emp-001';
      leaves.push({
        id: `leave-demo-${leaveCounter++}`,
        employeeId: tpl.employeeId,
        leaveType: tpl.leaveType,
        startDate: startDateStr,
        endDate: endDateStr,
        duration: tpl.duration,
        reason: tpl.reason,
        status: 'Approved',
        approvedBy: isExecutive ? 'Dewan Komisaris' : 'Alvareza Hilka Pratama, S.Kom., M.M.',
        approvedAt: `${startDateStr}T08:00:00.000Z`,
        createdAt: `${addDaysToDateStr(startDateStr, -3)}T09:00:00.000Z`,
      });
    }
  }

  // Urutkan pengajuan cuti: tanggal terbaru lebih dahulu
  return leaves.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/**
 * GENERATOR SALDO CUTI KARYAWAN & PENYESUAIAN TANGGAL AWAL PERHITUNGAN
 */
export function generateDemoSaldoCuti(baseDate = new Date()): {
  list: EmployeeLeaveQuota[];
  map: Record<string, EmployeeLeaveQuota>;
} {
  const window = getDemoMonthWindow(baseDate);
  const activeYears = Array.from(
    new Set([window.prevMonthYear, window.currMonthYear, window.nextMonthYear])
  );

  const list: EmployeeLeaveQuota[] = [];

  for (const year of activeYears) {
    // Tanggal awal perhitungan saldo cuti tahunan (1 Januari pukul 08:00 WIB)
    const calculationStartDateISO = `${year}-01-01T08:00:00.000Z`;

    sampleEmployees.forEach((emp, index) => {
      const employeeId = emp.id;
      let carryForward = 0;
      let adjustedQuota = 0;
      let notes = `Tanggal awal perhitungan saldo: 1 Januari ${year}. Jatah cuti tahunan reguler: 12 hari.`;

      if (index === 0) {
        // Direktur Utama
        carryForward = 4;
        adjustedQuota = 2;
        notes = `Tanggal awal perhitungan: 1 Januari ${year}. Hak eksekutif: 12 hari + 4 hari carry forward (${year - 1}) + 2 hari cuti khusus direksi.`;
      } else if (index % 3 === 0) {
        carryForward = 3;
        notes = `Tanggal awal perhitungan: 1 Januari ${year}. Jatah 12 hari + 3 hari carry forward dari sisa cuti tahun ${year - 1} (berlaku s.d. 30 Juni ${year}).`;
      } else if (index % 5 === 0) {
        carryForward = 2;
        adjustedQuota = 1;
        notes = `Tanggal awal perhitungan: 1 Januari ${year}. Jatah 12 hari + 2 hari sisa ${year - 1} + 1 hari reward lembur akhir pekan.`;
      } else if (index % 7 === 0) {
        carryForward = 4;
        notes = `Tanggal awal perhitungan: 1 Januari ${year}. Jatah 12 hari + 4 hari carry forward disetujui HRD untuk periode ${year}.`;
      } else if (index % 2 === 0) {
        carryForward = 1;
        notes = `Tanggal awal perhitungan: 1 Januari ${year}. Jatah 12 hari + 1 hari sisa cuti tahun ${year - 1}.`;
      }

      list.push({
        id: `${employeeId}_${year}`,
        employeeId,
        year,
        annualQuota: 12,
        carryForward,
        adjustedQuota,
        notes,
        updatedAt: calculationStartDateISO,
      });
    });
  }

  const map = list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, EmployeeLeaveQuota>);

  return { list, map };
}
