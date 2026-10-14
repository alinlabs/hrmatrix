import { ExtraShift, ShiftSwap, ShiftSchedule, ShiftSwapType, ShiftSwapInitiator } from '../../types';
import { getDemoMonthWindow } from './generator-presensi-demo';

/**
 * SISTEM AUTO-GENERASI DATA JADWAL SHIFT MODE DEMO
 * (TAMBAH SHIFT / LEMBUR, TUKAR SHIFT, DAN MATRIKS OVERRIDE)
 * 
 * Mekanisme:
 * 1. Mendeteksi tanggal tombol ditekan (baseDate, default new Date())
 * 2. Menghitung rentang 3 bulan penuh:
 *    - 1 bulan yang lalu (mulai tanggal 1)
 *    - Bulan berjalan saat ini
 *    - 1 bulan mendatang (hingga akhir bulan)
 * 3. Menghasilkan:
 *    a. Data Tambah Shift (ExtraShift[]) yang cukup banyak dan variatif:
 *       - Lembur shift reguler (custom_hours / per jam)
 *       - Shift ekstra saat hari libur roster (full_shift & half_shift)
 *       - Lembur karyawan non-shift kantor setelah jam kerja
 *       - Kategori upah NORMAL vs OFFDAY akurat sesuai aturan sistem
 *    b. Data Tukar Shift (ShiftSwap[]) lengkap:
 *       - Ganti Shift mandiri (ganti_shift)
 *       - Tukar Shift antar rekan kerja (tukar_shift)
 *       - Tukar Hari Libur OFF dalam pekan yang sama (tukar_off)
 *       - Pengajuan Karyawan (Employee) vs Instruksi Perusahaan (Company)
 *    c. Override Jadwal Efektif (ShiftSchedule[]) yang tersinkronisasi 100%
 *       ke tabel db.shiftSchedules untuk menampilkan badge di Matriks Jadwal.
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

interface ShiftInfo {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

const SHIFTS: Record<string, ShiftInfo> = {
  pagi: { id: 'shift-1-pagi', name: 'Shift 1 (Pagi)', startTime: '07:00', endTime: '16:00' },
  siang: { id: 'shift-2-siang', name: 'Shift 2 (Siang / Sore)', startTime: '15:00', endTime: '00:00' },
  malam: { id: 'shift-3-malam', name: 'Shift 3 (Malam)', startTime: '23:00', endTime: '08:00' },
  middle: { id: 'shift-middle', name: 'Shift Middle', startTime: '10:00', endTime: '19:00' },
  reguler: { id: 'shift-reguler', name: 'NON SHIFT (Kantor)', startTime: '08:30', endTime: '17:30' },
  off: { id: 'shift-off', name: 'Off (Hari Libur)', startTime: '', endTime: '' },
};

/**
 * GENERATOR TAMBAH SHIFT / LEMBUR DINAMIS (EXTRA SHIFT)
 */
export function generateDemoExtraShifts(baseDate = new Date()): ExtraShift[] {
  const window = getDemoMonthWindow(baseDate);
  const extraShifts: ExtraShift[] = [];
  let counter = 1;

  const todayStr = formatYMD(baseDate);

  // Template Tambah Shift Terstruktur untuk 3 Bulan Penuh
  // Sebanyak 33 penugasan lembur realistis
  const templates: Array<{
    monthOffset: -1 | 0 | 1;
    dayOfMonth: number;
    employeeId: string;
    shiftKey: keyof typeof SHIFTS;
    extraType: 'full_shift' | 'half_shift' | 'custom_hours';
    durationHours: number;
    isOffday: boolean;
    isNonShift: boolean;
    customStartTime?: string;
    customEndTime?: string;
    reason: string;
    isPendingFuture?: boolean;
  }> = [
    // === BULAN SEBELUMNYA (1 BULAN LALU) - 11 Data ===
    {
      monthOffset: -1,
      dayOfMonth: 3,
      employeeId: 'emp-004',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '18:00',
      reason: 'Penyelesaian target batch produksi kemasan ekspor ISO 9001',
    },
    {
      monthOffset: -1,
      dayOfMonth: 6,
      employeeId: 'emp-005',
      shiftKey: 'siang',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '23:00',
      reason: 'Penggantian operator mesin blending yang berhalangan hadir',
    },
    {
      monthOffset: -1,
      dayOfMonth: 9,
      employeeId: 'emp-007',
      shiftKey: 'reguler',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: true,
      customStartTime: '17:30',
      customEndTime: '20:30',
      reason: 'Closing pembukuan perpajakan PPh 21 TER dan rekonsiliasi akhir pekan',
    },
    {
      monthOffset: -1,
      dayOfMonth: 12,
      employeeId: 'emp-008',
      shiftKey: 'pagi',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '15:00',
      reason: 'Pengawasan loading stuffing 4 kontainer pelabuhan Tanjung Priok',
    },
    {
      monthOffset: -1,
      dayOfMonth: 15,
      employeeId: 'emp-010',
      shiftKey: 'siang',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '19:00',
      reason: 'Backup regu operasional shift sore karena lonjakan pesanan ritel',
    },
    {
      monthOffset: -1,
      dayOfMonth: 18,
      employeeId: 'emp-011',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 2,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '17:00',
      reason: 'Pembersihan menyeluruh (clean in place) tangki formulasi',
    },
    {
      monthOffset: -1,
      dayOfMonth: 20,
      employeeId: 'emp-025',
      shiftKey: 'middle',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '18:00',
      customEndTime: '21:00',
      reason: 'Inspeksi quality control mikrobiologi kedatangan raw material supplier',
    },
    {
      monthOffset: -1,
      dayOfMonth: 23,
      employeeId: 'emp-027',
      shiftKey: 'pagi',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '15:00',
      reason: 'Pemeliharaan preventif overhaul mesin kompresor utama dan motor conveyor',
    },
    {
      monthOffset: -1,
      dayOfMonth: 25,
      employeeId: 'emp-020',
      shiftKey: 'siang',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '02:00',
      reason: 'Penerimaan armada truk tronton pengangkut karton kemasan sekunder',
    },
    {
      monthOffset: -1,
      dayOfMonth: 28,
      employeeId: 'emp-013',
      shiftKey: 'malam',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '03:00',
      reason: 'Menjaga kontinuitas jalur pembakaran boiler saat suhu tinggi',
    },
    {
      monthOffset: -1,
      dayOfMonth: 30,
      employeeId: 'emp-009',
      shiftKey: 'reguler',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: true,
      customStartTime: '17:30',
      customEndTime: '20:30',
      reason: 'Migrasi backup database server lokal dan konfigurasi switch jaringan',
    },

    // === BULAN SAAT INI (BULAN BERJALAN) - 13 Data ===
    {
      monthOffset: 0,
      dayOfMonth: 2,
      employeeId: 'emp-004',
      shiftKey: 'siang',
      extraType: 'custom_hours',
      durationHours: 2,
      isOffday: false,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '01:00',
      reason: 'Finishing pengemasan akhir batch rilis produk farmasi',
    },
    {
      monthOffset: 0,
      dayOfMonth: 4,
      employeeId: 'emp-005',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '18:00',
      reason: 'Penambahan waktu kalibrasi timbangan digital ruang formulasi',
    },
    {
      monthOffset: 0,
      dayOfMonth: 7,
      employeeId: 'emp-021',
      shiftKey: 'pagi',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '15:00',
      reason: 'Stock opname kuartalan pergudangan bahan baku dan produk jadi',
    },
    {
      monthOffset: 0,
      dayOfMonth: 9,
      employeeId: 'emp-028',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '18:00',
      reason: 'Perbaikan sensor pneumatik pada mesin capping botol lini 2',
    },
    {
      monthOffset: 0,
      dayOfMonth: 11,
      employeeId: 'emp-012',
      shiftKey: 'siang',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '19:00',
      reason: 'Backup shift operasional karena rekan kerja berhalangan sakit',
    },
    {
      monthOffset: 0,
      dayOfMonth: 14,
      employeeId: 'emp-015',
      shiftKey: 'malam',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '07:00',
      reason: 'Penggantian operator shift 3 yang sedang mengajukan cuti darurat',
    },
    {
      monthOffset: 0,
      dayOfMonth: 16,
      employeeId: 'emp-007',
      shiftKey: 'reguler',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: true,
      customStartTime: '17:30',
      customEndTime: '20:30',
      reason: 'Penyusunan data komparasi gaji dan laporan tunjangan BPJS',
    },
    {
      monthOffset: 0,
      dayOfMonth: 18,
      employeeId: 'emp-026',
      shiftKey: 'pagi',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '11:00',
      reason: 'Inspeksi kedatangan mesin pengemas otomatis baru dari principal',
    },
    {
      monthOffset: 0,
      dayOfMonth: 21,
      employeeId: 'emp-010',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 2,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '17:00',
      reason: 'Pembersihan area ruang bersih (clean room) sebelum audit internal',
    },
    {
      monthOffset: 0,
      dayOfMonth: 23,
      employeeId: 'emp-022',
      shiftKey: 'siang',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '23:00',
      reason: 'Penataan ulang rak palet gudang distribusi sentral Cikarang',
    },
    {
      monthOffset: 0,
      dayOfMonth: 25,
      employeeId: 'emp-003',
      shiftKey: 'reguler',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: true,
      customStartTime: '17:30',
      customEndTime: '20:30',
      reason: 'Evaluasi jadwal produksi bulanan dan efisiensi lini manufaktur',
    },
    {
      monthOffset: 0,
      dayOfMonth: 27,
      employeeId: 'emp-014',
      shiftKey: 'siang',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '02:00',
      reason: 'Penyelesaian order cetak label kemasan produk edisi khusus',
      isPendingFuture: true,
    },
    {
      monthOffset: 0,
      dayOfMonth: 29,
      employeeId: 'emp-024',
      shiftKey: 'malam',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '07:00',
      reason: 'Standby penjagaan kargo bahan baku pendingin (cold storage)',
      isPendingFuture: true,
    },

    // === BULAN MENDATANG (1 BULAN MENDATANG) - 10 Data ===
    {
      monthOffset: 1,
      dayOfMonth: 3,
      employeeId: 'emp-004',
      shiftKey: 'pagi',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '15:00',
      reason: 'Target peningkatan kapasitas produksi awal bulan 15.000 unit',
    },
    {
      monthOffset: 1,
      dayOfMonth: 6,
      employeeId: 'emp-005',
      shiftKey: 'siang',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '02:00',
      reason: 'Uji running batch formulasi baru di bawah supervisi R&D',
    },
    {
      monthOffset: 1,
      dayOfMonth: 10,
      employeeId: 'emp-027',
      shiftKey: 'pagi',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '07:00',
      customEndTime: '15:00',
      reason: 'Servis berkala sistem pendingin chiller dan filtrasi udara HEPA',
    },
    {
      monthOffset: 1,
      dayOfMonth: 13,
      employeeId: 'emp-008',
      shiftKey: 'middle',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: false,
      customStartTime: '18:00',
      customEndTime: '21:00',
      reason: 'Supervisi pengeluaran barang untuk pengiriman armada distributor Jawa Timur',
    },
    {
      monthOffset: 1,
      dayOfMonth: 16,
      employeeId: 'emp-011',
      shiftKey: 'siang',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '19:00',
      reason: 'Penambahan jam kerja untuk pencapaian kuota batch tengah bulan',
    },
    {
      monthOffset: 1,
      dayOfMonth: 19,
      employeeId: 'emp-013',
      shiftKey: 'malam',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '23:00',
      customEndTime: '07:00',
      reason: 'Penggantian giliran tugas jaga malam menjelang libur nasional',
    },
    {
      monthOffset: 1,
      dayOfMonth: 22,
      employeeId: 'emp-009',
      shiftKey: 'reguler',
      extraType: 'custom_hours',
      durationHours: 3,
      isOffday: false,
      isNonShift: true,
      customStartTime: '17:30',
      customEndTime: '20:30',
      reason: 'Maintenance server storage Cloud dan pembaruan patch keamanan',
    },
    {
      monthOffset: 1,
      dayOfMonth: 25,
      employeeId: 'emp-023',
      shiftKey: 'pagi',
      extraType: 'custom_hours',
      durationHours: 2,
      isOffday: false,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '17:00',
      reason: 'Penyusunan berkas surat jalan pengiriman akhir bulan',
      isPendingFuture: true,
    },
    {
      monthOffset: 1,
      dayOfMonth: 27,
      employeeId: 'emp-015',
      shiftKey: 'siang',
      extraType: 'full_shift',
      durationHours: 8,
      isOffday: true,
      isNonShift: false,
      customStartTime: '15:00',
      customEndTime: '23:00',
      reason: 'Shift lembur pengganti untuk target pengiriman kuartal berjalan',
      isPendingFuture: true,
    },
    {
      monthOffset: 1,
      dayOfMonth: 29,
      employeeId: 'emp-025',
      shiftKey: 'middle',
      extraType: 'half_shift',
      durationHours: 4,
      isOffday: true,
      isNonShift: false,
      customStartTime: '10:00',
      customEndTime: '14:00',
      reason: 'Pengambilan sampel akhir bulan untuk audit sertifikasi BPOM',
      isPendingFuture: true,
    },
  ];

  for (const tpl of templates) {
    let targetYear = window.currMonthYear;
    let targetMonth = window.currMonth + tpl.monthOffset;

    if (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth -= 12;
      targetYear += 1;
    }

    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const validDay = Math.min(tpl.dayOfMonth, lastDayOfMonth);
    const workDate = formatYMD(new Date(targetYear, targetMonth, validDay, 12, 0, 0));

    const shift = SHIFTS[tpl.shiftKey];
    const isPastOrToday = workDate <= todayStr;
    const status = isPastOrToday ? 'Approved' : tpl.isPendingFuture ? 'Pending' : 'Approved';

    const wageCategory = tpl.isOffday ? 'OFFDAY' : 'NORMAL';
    const mandatoryShiftId = tpl.isOffday ? 'shift-off' : shift.id;
    const mandatoryShiftName = tpl.isOffday ? 'Off (Hari Libur)' : shift.name;

    const createdAt = `${addDaysToDateStr(workDate, -2)}T08:00:00.000Z`;
    const approvedAt = status === 'Approved' ? `${addDaysToDateStr(workDate, -1)}T16:00:00.000Z` : undefined;
    const approvedBy = status === 'Approved' ? 'Budi Santoso (HR Manager)' : undefined;

    extraShifts.push({
      id: `extra-demo-${counter++}`,
      employeeId: tpl.employeeId,
      workDate,
      shiftId: shift.id,
      shiftName: shift.name,
      extraType: tpl.extraType,
      durationHours: tpl.durationHours,
      mandatoryShiftId,
      mandatoryShiftName,
      wageCategory,
      customStartTime: tpl.customStartTime || shift.startTime,
      customEndTime: tpl.customEndTime || shift.endTime,
      isNonShiftEmployee: tpl.isNonShift,
      reason: tpl.reason,
      status,
      createdAt,
      approvedBy,
      approvedAt,
    });
  }

  // Urutkan jadwal tambahan: tanggal terbaru lebih dahulu
  return extraShifts.sort((a, b) => b.workDate.localeCompare(a.workDate));
}

/**
 * GENERATOR TUKAR SHIFT & GANTI SHIFT DINAMIS (SHIFT SWAP)
 */
export function generateDemoShiftSwaps(baseDate = new Date()): ShiftSwap[] {
  const window = getDemoMonthWindow(baseDate);
  const shiftSwaps: ShiftSwap[] = [];
  let counter = 1;

  const todayStr = formatYMD(baseDate);

  // Template Pertukaran Shift Terstruktur untuk 3 Bulan Penuh
  // Sebanyak 30 pertukaran shift realistis
  const templates: Array<{
    monthOffset: -1 | 0 | 1;
    dayOfMonth: number;
    swapType: ShiftSwapType;
    initiator: ShiftSwapInitiator;
    emp1Id: string;
    emp2Id?: string;
    reqShiftKey: keyof typeof SHIFTS;
    targetShiftKey: keyof typeof SHIFTS;
    dayOffsetTarget?: number; // untuk tukar_off atau beda hari
    reason: string;
    isPendingFuture?: boolean;
  }> = [
    // === BULAN SEBELUMNYA (1 BULAN LALU) - 10 Data ===
    {
      monthOffset: -1,
      dayOfMonth: 2,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-004',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Ada urusan administrasi keluarga penting di pagi hari (mengantar orang tua kontrol medis)',
    },
    {
      monthOffset: -1,
      dayOfMonth: 5,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-010',
      emp2Id: 'emp-011',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Saling tukar shift regu produksi untuk menyesuaikan jadwal transportasi komuter',
    },
    {
      monthOffset: -1,
      dayOfMonth: 8,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-020',
      reqShiftKey: 'off',
      targetShiftKey: 'pagi',
      dayOffsetTarget: 2,
      reason: 'Tukar hari libur roster dalam minggu berjalan karena ada renovasi perbaikan pipa rumah',
    },
    {
      monthOffset: -1,
      dayOfMonth: 11,
      swapType: 'ganti_shift',
      initiator: 'Company',
      emp1Id: 'emp-005',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Instruksi supervisor untuk rekonfigurasi regu kerja lini blending ekspor',
    },
    {
      monthOffset: -1,
      dayOfMonth: 14,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-021',
      emp2Id: 'emp-022',
      reqShiftKey: 'siang',
      targetShiftKey: 'pagi',
      reason: 'Tukar giliran tugas piket gudang bahan baku agar bisa menghadiri acara keluarga',
    },
    {
      monthOffset: -1,
      dayOfMonth: 17,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-013',
      reqShiftKey: 'off',
      targetShiftKey: 'malam',
      dayOffsetTarget: 1,
      reason: 'Tukar hari libur akhir pekan untuk keperluan menghadiri pengajian keluarga',
    },
    {
      monthOffset: -1,
      dayOfMonth: 20,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-025',
      reqShiftKey: 'middle',
      targetShiftKey: 'pagi',
      reason: 'Menyesuaikan jadwal kedatangan auditor eksternal ISO di laboratorium pagi hari',
    },
    {
      monthOffset: -1,
      dayOfMonth: 23,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-014',
      emp2Id: 'emp-015',
      reqShiftKey: 'siang',
      targetShiftKey: 'malam',
      reason: 'Penyesuaian giliran shift malam dengan rekan satu tim produksi',
    },
    {
      monthOffset: -1,
      dayOfMonth: 26,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-027',
      reqShiftKey: 'off',
      targetShiftKey: 'pagi',
      dayOffsetTarget: 2,
      reason: 'Pekerjaan servis genset dijadwalkan pada hari libur sehingga hari libur digeser',
    },
    {
      monthOffset: -1,
      dayOfMonth: 29,
      swapType: 'ganti_shift',
      initiator: 'Company',
      emp1Id: 'emp-012',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Rotasi regu kerja akhir bulan untuk mengejar target output lini perakitan',
    },

    // === BULAN SAAT INI (BULAN BERJALAN) - 12 Data ===
    {
      monthOffset: 0,
      dayOfMonth: 2,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-010',
      reqShiftKey: 'siang',
      targetShiftKey: 'pagi',
      reason: 'Ada urusan perbankan dan pencairan kredit pemilikan rumah di siang hari',
    },
    {
      monthOffset: 0,
      dayOfMonth: 5,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-004',
      emp2Id: 'emp-005',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Saling tukar shift kerja untuk mendampingi anak imunisasi di puskesmas',
    },
    {
      monthOffset: 0,
      dayOfMonth: 8,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-023',
      reqShiftKey: 'off',
      targetShiftKey: 'siang',
      dayOffsetTarget: 2,
      reason: 'Tukar hari libur mingguan dengan rekan untuk menghadiri syukuran kerabat',
    },
    {
      monthOffset: 0,
      dayOfMonth: 11,
      swapType: 'ganti_shift',
      initiator: 'Company',
      emp1Id: 'emp-028',
      reqShiftKey: 'pagi',
      targetShiftKey: 'middle',
      reason: 'Instruksi manajemen teknik untuk mendampingi vendor instalasi boiler baru',
    },
    {
      monthOffset: 0,
      dayOfMonth: 13,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-011',
      emp2Id: 'emp-012',
      reqShiftKey: 'siang',
      targetShiftKey: 'pagi',
      reason: 'Saling tukar jadwal piket monitoring suhu ruang fermentasi',
    },
    {
      monthOffset: 0,
      dayOfMonth: 16,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-015',
      reqShiftKey: 'pagi',
      targetShiftKey: 'off',
      dayOffsetTarget: 3,
      reason: 'Tukar hari kerja dengan hari libur tengah pekan untuk keperluan dinas keluarga',
    },
    {
      monthOffset: 0,
      dayOfMonth: 19,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-026',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Menghadiri rapat komite sekolah anak di pagi hari sebelum masuk shift siang',
    },
    {
      monthOffset: 0,
      dayOfMonth: 21,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-020',
      emp2Id: 'emp-024',
      reqShiftKey: 'malam',
      targetShiftKey: 'siang',
      reason: 'Pertukaran giliran shift logistik untuk menjaga kebugaran fisik pekerja',
    },
    {
      monthOffset: 0,
      dayOfMonth: 24,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-014',
      reqShiftKey: 'off',
      targetShiftKey: 'pagi',
      dayOffsetTarget: 2,
      reason: 'Tukar jadwal libur berkala untuk mengurus perpanjangan SIM dan STNK',
    },
    {
      monthOffset: 0,
      dayOfMonth: 26,
      swapType: 'ganti_shift',
      initiator: 'Company',
      emp1Id: 'emp-022',
      reqShiftKey: 'siang',
      targetShiftKey: 'pagi',
      reason: 'Penugasan khusus pengawasan loading kontainer ekspor Singapura',
      isPendingFuture: true,
    },
    {
      monthOffset: 0,
      dayOfMonth: 28,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-005',
      emp2Id: 'emp-010',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Saling tukar shift operasi mesin blending untuk persiapan akhir bulan',
      isPendingFuture: true,
    },
    {
      monthOffset: 0,
      dayOfMonth: 30,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-027',
      reqShiftKey: 'off',
      targetShiftKey: 'middle',
      dayOffsetTarget: 1,
      reason: 'Pemeriksaan darurat panel listrik trafo gardu induk pabrik',
      isPendingFuture: true,
    },

    // === BULAN MENDATANG (1 BULAN MENDATANG) - 8 Data ===
    {
      monthOffset: 1,
      dayOfMonth: 4,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-004',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Jadwal kontrol kesehatan berkala di RS Mitra Keluarga Cikarang pagi hari',
    },
    {
      monthOffset: 1,
      dayOfMonth: 7,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-012',
      emp2Id: 'emp-013',
      reqShiftKey: 'siang',
      targetShiftKey: 'malam',
      reason: 'Saling tukar shift regu kerja untuk menyesuaikan giliran antar jemput',
    },
    {
      monthOffset: 1,
      dayOfMonth: 11,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-021',
      reqShiftKey: 'off',
      targetShiftKey: 'pagi',
      dayOffsetTarget: 2,
      reason: 'Tukar hari libur roster untuk menghadiri acara pernikahan rekan kerja',
    },
    {
      monthOffset: 1,
      dayOfMonth: 14,
      swapType: 'ganti_shift',
      initiator: 'Company',
      emp1Id: 'emp-025',
      reqShiftKey: 'middle',
      targetShiftKey: 'pagi',
      reason: 'Penyesuaian rotasi pengujian sampel produk steril di laboratorium pusat',
    },
    {
      monthOffset: 1,
      dayOfMonth: 18,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-014',
      emp2Id: 'emp-015',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Pertukaran jadwal tugas operator mesin kemas blister pack lini 1',
    },
    {
      monthOffset: 1,
      dayOfMonth: 21,
      swapType: 'tukar_off',
      initiator: 'Employee',
      emp1Id: 'emp-010',
      reqShiftKey: 'pagi',
      targetShiftKey: 'off',
      dayOffsetTarget: 2,
      reason: 'Tukar hari kerja dengan hari libur untuk melayat kerabat di luar kota',
      isPendingFuture: true,
    },
    {
      monthOffset: 1,
      dayOfMonth: 25,
      swapType: 'ganti_shift',
      initiator: 'Employee',
      emp1Id: 'emp-028',
      reqShiftKey: 'pagi',
      targetShiftKey: 'siang',
      reason: 'Urusan perpanjangan sertifikasi K3 Teknisi Listrik di Disnaker',
      isPendingFuture: true,
    },
    {
      monthOffset: 1,
      dayOfMonth: 28,
      swapType: 'tukar_shift',
      initiator: 'Employee',
      emp1Id: 'emp-022',
      emp2Id: 'emp-023',
      reqShiftKey: 'siang',
      targetShiftKey: 'pagi',
      reason: 'Penyesuaian jadwal tugas regu gudang transit muatan kargo',
      isPendingFuture: true,
    },
  ];

  for (const tpl of templates) {
    let targetYear = window.currMonthYear;
    let targetMonth = window.currMonth + tpl.monthOffset;

    if (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth -= 12;
      targetYear += 1;
    }

    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const validDay = Math.min(tpl.dayOfMonth, lastDayOfMonth);
    const requesterDate = formatYMD(new Date(targetYear, targetMonth, validDay, 12, 0, 0));

    let targetDate = requesterDate;
    if (tpl.dayOffsetTarget) {
      targetDate = addDaysToDateStr(requesterDate, tpl.dayOffsetTarget);
    }

    const reqShift = SHIFTS[tpl.reqShiftKey];
    const targetShift = SHIFTS[tpl.targetShiftKey];

    const isPastOrToday = requesterDate <= todayStr;
    const status = isPastOrToday ? 'Approved' : tpl.isPendingFuture ? 'Pending' : 'Approved';

    const requestDate = addDaysToDateStr(requesterDate, -2);
    const createdAt = `${requestDate}T08:30:00.000Z`;
    const approvedAt = status === 'Approved' ? `${addDaysToDateStr(requesterDate, -1)}T14:00:00.000Z` : undefined;
    const approvedBy = status === 'Approved' ? 'Budi Santoso (HR Manager)' : undefined;

    shiftSwaps.push({
      id: `swap-demo-${counter++}`,
      requestDate,
      swapType: tpl.swapType,
      initiator: tpl.initiator,
      requesterEmployeeId: tpl.emp1Id,
      targetEmployeeId: tpl.emp2Id,
      requesterDate,
      requesterShiftId: reqShift.id,
      targetDate,
      targetShiftId: targetShift.id,
      reason: tpl.reason,
      status,
      createdAt,
      updatedAt: approvedAt || createdAt,
      approvedBy,
      approvedAt,
    });
  }

  // Urutkan tukar shift: tanggal permohonan/requesterDate terbaru lebih dahulu
  return shiftSwaps.sort((a, b) => b.requesterDate.localeCompare(a.requesterDate));
}

/**
 * GENERATOR OVERRIDE JADWAL SHIFT EFEKTIF UNTUK MATRIKS JADWAL
 * 
 * Menggabungkan seluruh data ExtraShift Approved dan ShiftSwap Approved
 * menjadi baris override di tabel db.shiftSchedules sehingga tampilan
 * Matriks Jadwal di seluruh 3 bulan langsung menampilkan badge overshift & tukar shift.
 */
export function generateDemoShiftSchedules(
  extraShifts: ExtraShift[],
  shiftSwaps: ShiftSwap[],
  baseDate = new Date()
): ShiftSchedule[] {
  const schedules: ShiftSchedule[] = [];
  const scheduleMap = new Map<string, ShiftSchedule>(); // key: `${employeeId}_${date}`
  let scheduleCounter = 1;

  // 1. Masukkan ExtraShift Approved (Lembur / Shift Tambahan)
  const approvedExtras = extraShifts.filter(
    (e) => e.status === 'Approved' && !e.isNonShiftEmployee && e.shiftId && e.shiftId !== 'OFF' && e.shiftId !== 'HOURLY'
  );

  for (const extra of approvedExtras) {
    const key = `${extra.employeeId}_${extra.workDate}`;
    const noteText = `Shift Tambahan: ${extra.shiftName} (${
      extra.extraType === 'half_shift'
        ? '0.5 Shift (4 Jam)'
        : extra.extraType === 'custom_hours'
        ? `${extra.durationHours || 0} Jam`
        : '1 Shift (8 Jam)'
    })`;

    const item: ShiftSchedule = {
      id: `sch-extra-demo-${scheduleCounter++}`,
      employeeId: extra.employeeId,
      date: extra.workDate,
      shiftId: extra.shiftId,
      shiftName: extra.shiftName,
      startTime: extra.customStartTime,
      endTime: extra.customEndTime,
      isOvershift: true,
      isExtraShift: true,
      notes: noteText,
      updatedAt: extra.approvedAt || extra.createdAt,
    };
    scheduleMap.set(key, item);
  }

  // 2. Masukkan ShiftSwap Approved (Ganti Shift, Tukar Shift, Tukar OFF)
  const approvedSwaps = shiftSwaps.filter((s) => s.status === 'Approved');

  for (const swap of approvedSwaps) {
    const initiatorLabel = swap.initiator === 'Company' ? 'Instruksi Perusahaan' : 'Pengajuan Karyawan';

    if (swap.swapType === 'ganti_shift' || swap.swapType === 'direct_shift_change') {
      // 1. Ganti Shift: Karyawan pada requesterDate berganti ke targetShiftId
      const key = `${swap.requesterEmployeeId}_${swap.requesterDate}`;
      const shiftObj = Object.values(SHIFTS).find((s) => s.id === swap.targetShiftId) || SHIFTS.siang;

      scheduleMap.set(key, {
        id: `sch-swap-demo-${scheduleCounter++}`,
        employeeId: swap.requesterEmployeeId,
        date: swap.requesterDate,
        shiftId: shiftObj.id,
        shiftName: shiftObj.name,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        isSwapResult: true,
        notes: `Ganti Shift: ${shiftObj.name} (${initiatorLabel})`,
        updatedAt: swap.approvedAt || swap.createdAt,
      });
    } else if ((swap.swapType === 'tukar_shift' || swap.swapType === 'peer_to_peer') && swap.targetEmployeeId) {
      // 2. Tukar Shift Antar Rekan
      // Requester gets targetShiftId on requesterDate
      const key1 = `${swap.requesterEmployeeId}_${swap.requesterDate}`;
      const shiftObj1 = Object.values(SHIFTS).find((s) => s.id === swap.targetShiftId) || SHIFTS.siang;

      scheduleMap.set(key1, {
        id: `sch-swap-demo-${scheduleCounter++}`,
        employeeId: swap.requesterEmployeeId,
        date: swap.requesterDate,
        shiftId: shiftObj1.id,
        shiftName: shiftObj1.name,
        startTime: shiftObj1.startTime,
        endTime: shiftObj1.endTime,
        isSwapResult: true,
        notes: `Tukar Shift dengan Rekan (${initiatorLabel})`,
        updatedAt: swap.approvedAt || swap.createdAt,
      });

      // Target gets requesterShiftId on targetDate
      const targetDate = swap.targetDate || swap.requesterDate;
      const key2 = `${swap.targetEmployeeId}_${targetDate}`;
      const shiftObj2 = Object.values(SHIFTS).find((s) => s.id === swap.requesterShiftId) || SHIFTS.pagi;

      scheduleMap.set(key2, {
        id: `sch-swap-demo-${scheduleCounter++}`,
        employeeId: swap.targetEmployeeId,
        date: targetDate,
        shiftId: shiftObj2.id,
        shiftName: shiftObj2.name,
        startTime: shiftObj2.startTime,
        endTime: shiftObj2.endTime,
        isSwapResult: true,
        notes: `Tukar Shift dengan Rekan (${initiatorLabel})`,
        updatedAt: swap.approvedAt || swap.createdAt,
      });
    } else if (swap.swapType === 'tukar_off' || swap.swapType === 'self_date_swap') {
      // 3. Tukar OFF dalam pekan yang sama
      const isDate1Off = swap.requesterShiftId === 'shift-off' || swap.requesterShiftId === 'OFF';
      const targetDate = swap.targetDate || addDaysToDateStr(swap.requesterDate, 2);

      if (isDate1Off) {
        // requesterDate dulunya libur -> sekarang masuk shift kerja
        const workShift = Object.values(SHIFTS).find((s) => s.id === swap.targetShiftId) || SHIFTS.pagi;
        const key1 = `${swap.requesterEmployeeId}_${swap.requesterDate}`;
        scheduleMap.set(key1, {
          id: `sch-swap-demo-${scheduleCounter++}`,
          employeeId: swap.requesterEmployeeId,
          date: swap.requesterDate,
          shiftId: workShift.id,
          shiftName: workShift.name,
          startTime: workShift.startTime,
          endTime: workShift.endTime,
          isSwapResult: true,
          notes: `Tukar OFF: Jadwal Kerja dari ${targetDate} (${initiatorLabel})`,
          updatedAt: swap.approvedAt || swap.createdAt,
        });

        // targetDate dulunya hari kerja -> sekarang libur OFF
        const key2 = `${swap.requesterEmployeeId}_${targetDate}`;
        scheduleMap.set(key2, {
          id: `sch-swap-demo-${scheduleCounter++}`,
          employeeId: swap.requesterEmployeeId,
          date: targetDate,
          shiftId: 'shift-off',
          shiftName: 'Off (Hari Libur)',
          isSwapResult: true,
          notes: `Tukar OFF: Libur dipindah ke ${swap.requesterDate} (${initiatorLabel})`,
          updatedAt: swap.approvedAt || swap.createdAt,
        });
      } else {
        // requesterDate dulunya hari kerja -> sekarang libur OFF
        const key1 = `${swap.requesterEmployeeId}_${swap.requesterDate}`;
        scheduleMap.set(key1, {
          id: `sch-swap-demo-${scheduleCounter++}`,
          employeeId: swap.requesterEmployeeId,
          date: swap.requesterDate,
          shiftId: 'shift-off',
          shiftName: 'Off (Hari Libur)',
          isSwapResult: true,
          notes: `Tukar OFF: Libur dipindah ke ${targetDate} (${initiatorLabel})`,
          updatedAt: swap.approvedAt || swap.createdAt,
        });

        // targetDate dulunya libur -> sekarang masuk kerja
        const workShift = Object.values(SHIFTS).find((s) => s.id === swap.targetShiftId) || SHIFTS.pagi;
        const key2 = `${swap.requesterEmployeeId}_${targetDate}`;
        scheduleMap.set(key2, {
          id: `sch-swap-demo-${scheduleCounter++}`,
          employeeId: swap.requesterEmployeeId,
          date: targetDate,
          shiftId: workShift.id,
          shiftName: workShift.name,
          startTime: workShift.startTime,
          endTime: workShift.endTime,
          isSwapResult: true,
          notes: `Tukar OFF: Jadwal Kerja dari ${swap.requesterDate} (${initiatorLabel})`,
          updatedAt: swap.approvedAt || swap.createdAt,
        });
      }
    }
  }

  return Array.from(scheduleMap.values());
}
