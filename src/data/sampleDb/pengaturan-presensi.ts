import { AttendanceConfig } from '../../types';

/**
 * PENGATURAN PRESENSI SAMPEL TERSTANDAR (GOLDEN STANDARD)
 * 
 * Pengaturan presensi ini disesuaikan dengan regulasi ketenagakerjaan Indonesia 
 * dan kebutuhan operasional manufaktur modern:
 * - Toleransi keterlambatan 15 menit dengan auto-detection
 * - Skema denda keterlambatan (statis & bertingkat)
 * - Formula lembur Depnaker (Faktor 1/173, multiplier 1.5x & 2.0x)
 * - Master 6 shift operasional (Non-Shift, Shift 1 Pagi, Shift 2 Siang, Shift 3 Malam, Middle, dan Off)
 * - Pola roster rotasi 4 Regu 3 Shift 24 jam & jam kerja kantor 5 hari
 * - Pemetaan departemen & regu kerja terintegrasi dengan struktur divisi perusahaan
 */
export const sampleAttendanceConfig: AttendanceConfig = {
  id: "attendanceConfig",
  systemType: "shift",
  normalWorkDays: 5,
  normalStartTime: "08:30",
  normalEndTime: "17:30",
  normalBreakStartTime: "12:00",
  normalBreakEndTime: "13:00",
  targetDailyHours: 8,
  lateToleranceMinutes: 15,
  earlyLeaveToleranceMinutes: 10,
  maxLateHours: 4,
  maxLateMinutes: 240,
  autoLateDetection: true,
  minimumOvertimeMinutes: 60,
  autoOvertime: true,
  absenceReasons: [
    {
      id: "libur-nasional",
      name: "Hari Libur Nasional",
      description: "Hari libur resmi penetapan pemerintah / hari besar nasional",
      deductionEnabled: false,
      deductionType: "full_day",
      deductionNominal: 0,
      deductionPercentage: 0
    },
    {
      id: "cuti",
      name: "Cuti",
      description: "Izin tidak masuk kerja berbayar resmi / memotong hak cuti tahunan",
      deductionEnabled: false,
      deductionType: "full_day",
      deductionNominal: 0,
      deductionPercentage: 0
    },
    {
      id: "sakit",
      name: "Sakit",
      description: "Tidak hadir karena alasan kesehatan dengan surat dokter resmi (SKD)",
      deductionEnabled: false,
      deductionType: "full_day",
      deductionNominal: 0,
      deductionPercentage: 0
    },
    {
      id: "izin",
      name: "Izin",
      description: "Izin tidak masuk kerja disetujui tanpa keterangan medis berbayar",
      deductionEnabled: true,
      deductionType: "daily_percentage",
      deductionNominal: 50000,
      deductionPercentage: 50
    },
    {
      id: "alpa",
      name: "Alpa",
      description: "Ketidakhadiran tanpa keterangan resmi atau mangkir melebihi toleransi maksimal",
      deductionEnabled: true,
      deductionType: "full_day",
      deductionNominal: 100000,
      deductionPercentage: 100
    }
  ],
  lateDeductionConfig: {
    enabled: true,
    scheme: "uniform",
    uniformAmount: 25000,
    hourlyMode: "tiered",
    ratePerHour: 20000,
    workingDaysPerMonth: 21,
    workingHoursPerDay: 8,
    dailyWageMode: "pro_rata_hours",
    dailyWagePercentage: 50,
    tieredSubMethod: "nominal",
    tieredRates: [
      {
        hour: 1,
        amount: 15000,
        percentage: 5
      },
      {
        hour: 2,
        amount: 30000,
        percentage: 10
      },
      {
        hour: 3,
        amount: 50000,
        percentage: 15
      },
      {
        hour: 4,
        amount: 75000,
        percentage: 20
      }
    ],
    staticSubMethod: "nominal",
    staticAmount: 25000,
    staticPercentage: 5
  },
  overtimeConfig: {
    minimumOvertimeMinutes: 60,
    autoOvertime: true,
    normalWorkday: {
      calculationType: "multiplier",
      ratePerHour: 25000,
      baseDivider: 173,
      multiplierFirstHour: 1.5,
      multiplierNextHours: 2.0,
      flatMultiplier: 1.5
    },
    offday: {
      calculationType: "multiplier",
      ratePerHour: 50000,
      baseDivider: 173,
      multiplierFirstHour: 2.0,
      multiplierNextHours: 2.0,
      flatMultiplier: 2.0
    },
    updatedAt: "{{ISO_NOW}}"
  },
  shifts: [
    {
      id: "shift-reguler",
      code: "NON SHIFT",
      name: "NON SHIFT (Kantor)",
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00",
      crossDay: false,
      color: "emerald",
      description: "Jam kerja reguler staf kantor & non-shift",
      isDefault: true
    },
    {
      id: "shift-1-pagi",
      code: "PAGI",
      name: "Shift 1 (Pagi)",
      startTime: "07:00",
      endTime: "16:00",
      breakStartTime: "12:00",
      breakEndTime: "13:00",
      crossDay: false,
      color: "blue",
      description: "Shift operasional pagi pabrik & fasilitas",
      isDefault: false
    },
    {
      id: "shift-2-siang",
      code: "SIANG",
      name: "Shift 2 (Siang / Sore)",
      startTime: "15:00",
      endTime: "00:00",
      breakStartTime: "18:00",
      breakEndTime: "19:00",
      crossDay: true,
      color: "amber",
      description: "Shift operasional sore ke malam pabrik & logistik",
      isDefault: false
    },
    {
      id: "shift-3-malam",
      code: "MALAM",
      name: "Shift 3 (Malam)",
      startTime: "23:00",
      endTime: "08:00",
      breakStartTime: "03:00",
      breakEndTime: "04:00",
      crossDay: true,
      color: "purple",
      description: "Shift operasional malam pabrik (lintas hari)",
      isDefault: false
    },
    {
      id: "shift-middle",
      code: "MIDDLE",
      name: "Shift Middle",
      startTime: "10:00",
      endTime: "19:00",
      breakStartTime: "13:00",
      breakEndTime: "14:00",
      crossDay: false,
      color: "indigo",
      description: "Shift penengah jam sibuk produksi & logistik",
      isDefault: false
    },
    {
      id: "shift-off",
      code: "OFF",
      name: "Off (Hari Libur)",
      startTime: "00:00",
      endTime: "00:00",
      breakStartTime: "00:00",
      breakEndTime: "00:00",
      crossDay: false,
      color: "rose",
      description: "Jadwal hari libur / istirahat roster",
      isDefault: false,
      isOff: true
    }
  ],
  shiftPatterns: [
    {
      id: "pat-3shift-4group",
      name: "Pola 4 Regu 3 Shift Pabrik (2P-2S-2M-2OFF)",
      description: "Siklus rotasi 8 hari standar industri 24 jam (2 Pagi, 2 Siang, 2 Malam, 2 Libur)",
      cycle: [
        "shift-1-pagi",
        "shift-1-pagi",
        "shift-2-siang",
        "shift-2-siang",
        "shift-3-malam",
        "shift-3-malam",
        "shift-off",
        "shift-off"
      ]
    },
    {
      id: "pat-2shift-1off",
      name: "Pola Rotasi 2 Shift 1 Off (2P-2S-1OFF)",
      description: "Siklus rotasi 5 hari untuk Produksi / Support Gudang & Logistik",
      cycle: [
        "shift-1-pagi",
        "shift-1-pagi",
        "shift-2-siang",
        "shift-2-siang",
        "shift-off"
      ]
    },
    {
      id: "pat-office-standard",
      name: "Pola Jam Kantor 5 Hari (Senin - Jumat)",
      description: "Jadwal kerja normal kantor 5 hari kerja (Sabtu-Minggu Libur, 08:30 - 17:30)",
      cycle: [
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-off",
        "shift-off"
      ]
    },
    {
      id: "pat-office-6days",
      name: "Pola Jam Kantor 6 Hari (Senin - Sabtu)",
      description: "Jadwal kerja kantor 6 hari kerja (Minggu Libur)",
      cycle: [
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-reguler",
        "shift-off"
      ]
    }
  ],
  departmentAssignments: [
    {
      departmentId: "dept-direksi",
      mode: "shift",
      shiftPatternId: "pat-office-standard",
      anchorDate: "{{MONDAY_ANCHOR}}"
    },
    {
      departmentId: "dept-manufaktur",
      mode: "shift",
      shiftPatternId: "pat-3shift-4group",
      anchorDate: "{{TODAY-20}}"
    },
    {
      departmentId: "dept-qualityassurance",
      mode: "shift",
      shiftPatternId: "pat-office-standard",
      anchorDate: "{{MONDAY_ANCHOR}}"
    },
    {
      departmentId: "dept-teknik",
      mode: "shift",
      shiftPatternId: "pat-3shift-4group",
      anchorDate: "{{TODAY-20}}"
    },
    {
      departmentId: "dept-logistik",
      mode: "shift",
      shiftPatternId: "pat-2shift-1off",
      anchorDate: "{{TODAY-20}}"
    },
    {
      departmentId: "dept-sdm",
      mode: "shift",
      shiftPatternId: "pat-office-standard",
      anchorDate: "{{MONDAY_ANCHOR}}"
    },
    {
      departmentId: "dept-perkantoran",
      mode: "shift",
      shiftPatternId: "pat-office-standard",
      anchorDate: "{{MONDAY_ANCHOR}}"
    },
    {
      departmentId: "dept-teknologi",
      mode: "shift",
      shiftPatternId: "pat-2shift-1off",
      anchorDate: "{{TODAY-20}}"
    }
  ],
  shiftGroups: [
    {
      id: "grp-mfg-regu-a",
      name: "Regu A - Manufaktur & Operasional Pabrik",
      description: "Tim Operator Mesin & Pengolahan Produksi Shift Pagi & Malam",
      color: "#2563EB",
      employeeIds: [
        "emp-004",
        "emp-005",
        "emp-010",
        "emp-020",
        "emp-023"
      ]
    },
    {
      id: "grp-mfg-regu-b",
      name: "Regu B - Manufaktur & Operasional Pabrik",
      description: "Tim Operator Mesin & Pengolahan Produksi Shift Siang & Sore",
      color: "#10B981",
      employeeIds: [
        "emp-025",
        "emp-031",
        "emp-043",
        "emp-044"
      ]
    },
    {
      id: "grp-logistik",
      name: "Tim Gudang, Dispatch & Rantai Pasok",
      description: "Rotasi Shift Operasional Gudang, Forklift & Distribusi Barang",
      color: "#F59E0B",
      employeeIds: [
        "emp-026",
        "emp-034",
        "emp-042",
        "emp-048"
      ]
    },
    {
      id: "grp-it-ops",
      name: "Tim IT Support & Infrastruktur Pabrik 24/7",
      description: "Rotasi Shift Standby On-Call Jaringan, Server & Sistem Pabrik",
      color: "#8B5CF6",
      employeeIds: [
        "emp-006",
        "emp-009",
        "emp-013",
        "emp-037"
      ]
    }
  ],
  groupAssignments: [
    {
      id: "grp-mfg-regu-a",
      name: "Regu A - Manufaktur & Operasional Pabrik",
      description: "Tim Operator Mesin & Pengolahan Produksi Shift Pagi & Malam",
      color: "#2563EB",
      employeeIds: [
        "emp-004",
        "emp-005",
        "emp-010",
        "emp-020",
        "emp-023"
      ],
      shiftPatternId: "pat-3shift-4group",
      anchorDate: "{{TODAY-20}}"
    },
    {
      id: "grp-mfg-regu-b",
      name: "Regu B - Manufaktur & Operasional Pabrik",
      description: "Tim Operator Mesin & Pengolahan Produksi Shift Siang & Sore",
      color: "#10B981",
      employeeIds: [
        "emp-025",
        "emp-031",
        "emp-043",
        "emp-044"
      ],
      shiftPatternId: "pat-3shift-4group",
      anchorDate: "{{TODAY-10}}"
    },
    {
      id: "grp-logistik",
      name: "Tim Gudang, Dispatch & Rantai Pasok",
      description: "Rotasi Shift Operasional Gudang, Forklift & Distribusi Barang",
      color: "#F59E0B",
      employeeIds: [
        "emp-026",
        "emp-034",
        "emp-042",
        "emp-048"
      ],
      shiftPatternId: "pat-2shift-1off",
      anchorDate: "{{TODAY-14}}"
    },
    {
      id: "grp-it-ops",
      name: "Tim IT Support & Infrastruktur Pabrik 24/7",
      description: "Rotasi Shift Standby On-Call Jaringan, Server & Sistem Pabrik",
      color: "#8B5CF6",
      employeeIds: [
        "emp-006",
        "emp-009",
        "emp-013",
        "emp-037"
      ],
      shiftPatternId: "pat-2shift-1off",
      anchorDate: "{{TODAY-20}}"
    }
  ],
  savedSchedulePatterns: [
    {
      id: "saved-pat-ops-24-7",
      name: "Pola Roster Operasional Pabrik 24/7 & IT Standby",
      description: "Konfigurasi aktif kombinasi 4 Regu 3 Shift untuk Manufaktur/Teknik, 2 Shift untuk Logistik & IT, serta Jam Kantor 5 Hari untuk divisi lainnya",
      departmentAssignments: [
        {
          departmentId: "dept-direksi",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-manufaktur",
          mode: "shift",
          shiftPatternId: "pat-3shift-4group",
          anchorDate: "{{TODAY-20}}"
        },
        {
          departmentId: "dept-qualityassurance",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-teknik",
          mode: "shift",
          shiftPatternId: "pat-3shift-4group",
          anchorDate: "{{TODAY-20}}"
        },
        {
          departmentId: "dept-logistik",
          mode: "shift",
          shiftPatternId: "pat-2shift-1off",
          anchorDate: "{{TODAY-20}}"
        },
        {
          departmentId: "dept-sdm",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-perkantoran",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-teknologi",
          mode: "shift",
          shiftPatternId: "pat-2shift-1off",
          anchorDate: "{{TODAY-20}}"
        }
      ],
      groupAssignments: [
        {
          id: "grp-mfg-regu-a",
          name: "Regu A - Manufaktur & Operasional Pabrik",
          description: "Tim Operator Mesin & Pengolahan Produksi Shift Pagi & Malam",
          employeeIds: [
            "emp-004",
            "emp-005",
            "emp-010",
            "emp-020",
            "emp-023"
          ],
          shiftPatternId: "pat-3shift-4group",
          anchorDate: "{{TODAY-20}}"
        },
        {
          id: "grp-mfg-regu-b",
          name: "Regu B - Manufaktur & Operasional Pabrik",
          description: "Tim Operator Mesin & Pengolahan Produksi Shift Siang & Sore",
          employeeIds: [
            "emp-025",
            "emp-031",
            "emp-043",
            "emp-044"
          ],
          shiftPatternId: "pat-3shift-4group",
          anchorDate: "{{TODAY-10}}"
        },
        {
          id: "grp-logistik",
          name: "Tim Gudang, Dispatch & Rantai Pasok",
          description: "Rotasi Shift Operasional Gudang, Forklift & Distribusi Barang",
          employeeIds: [
            "emp-026",
            "emp-034",
            "emp-042",
            "emp-048"
          ],
          shiftPatternId: "pat-2shift-1off",
          anchorDate: "{{TODAY-14}}"
        },
        {
          id: "grp-it-ops",
          name: "Tim IT Support & Infrastruktur Pabrik 24/7",
          description: "Rotasi Shift Standby On-Call Jaringan, Server & Sistem Pabrik",
          employeeIds: [
            "emp-006",
            "emp-009",
            "emp-013",
            "emp-037"
          ],
          shiftPatternId: "pat-2shift-1off",
          anchorDate: "{{TODAY-20}}"
        }
      ],
      createdAt: "{{ISO_NOW}}",
      updatedAt: "{{ISO_NOW}}",
      isActive: true
    },
    {
      id: "saved-pat-standard-office",
      name: "Pola Standar Seluruh Kantor Jam Kantor 5 Hari",
      description: "Semua departemen menggunakan pola kerja kantor 5 hari kerja (08:30 - 17:30)",
      departmentAssignments: [
        {
          departmentId: "dept-direksi",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-manufaktur",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-qualityassurance",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-teknik",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-logistik",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-sdm",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-perkantoran",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        },
        {
          departmentId: "dept-teknologi",
          mode: "shift",
          shiftPatternId: "pat-office-standard",
          anchorDate: "{{MONDAY_ANCHOR}}"
        }
      ],
      groupAssignments: [],
      createdAt: "{{ISO_NOW}}",
      updatedAt: "{{ISO_NOW}}",
      isActive: false
    }
  ]
};

export default sampleAttendanceConfig;
