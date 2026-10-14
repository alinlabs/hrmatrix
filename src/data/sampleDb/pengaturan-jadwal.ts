import { 
  WorkShift, 
  ShiftPattern, 
  ShiftGroup, 
  ShiftGroupAssignment, 
  DepartmentScheduleAssignment, 
  SavedSchedulePattern 
} from '../../types';

/**
 * Interface Konfigurasi Pengaturan Jadwal Adaptif (Dual-Mode):
 * Mendukung penyimpanan 2 metode sekaligus:
 * 1. Metode Jam Kerja Normal / Kantor (Non-Shift)
 * 2. Metode Sistem Shift & Roster Operasional (Pola Rotasi, Master Shift, Regu / Group, Pola Tersimpan)
 * 
 * Desain ini menjamin saat pengguna berganti model kerja antara "Non Shift" dan "Shift",
 * seluruh parameter dan konfigurasi masing-masing mode TIDAK TERHAPUS.
 */
export interface ScheduleConfig {
  id?: string;
  name?: string;
  version?: string;
  systemType: 'normal' | 'shift' | 'mixed';
  
  // === METODE 1: JAM KERJA NORMAL (NON-SHIFT / KANTOR) ===
  normalWorkDays: number;
  normalStartTime: string;
  normalEndTime: string;
  normalBreakStartTime: string;
  normalBreakEndTime: string;
  normalDailySchedules: Record<string, {
    active: boolean;
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
  }>;

  // === METODE 2: SISTEM SHIFT OPERASIONAL & ROSTER ===
  shifts: WorkShift[];
  shiftPatterns: ShiftPattern[];
  shiftGroups: ShiftGroup[];
  departmentAssignments: DepartmentScheduleAssignment[];
  groupAssignments: ShiftGroupAssignment[];
  savedSchedulePatterns: SavedSchedulePattern[];
}

export const sampleScheduleConfig: ScheduleConfig = {
  id: "cfg-jadwal-utama",
  name: "Pengaturan Jadwal Adaptif Perusahaan (Dual Mode)",
  version: "2.5.0",
  // Default mode aktif: 'shift' (mendukung fleksibilitas multi-divisi dan non-shift simultan)
  systemType: "shift",

  // =========================================================================
  // METODE 1: JAM KERJA NORMAL / NON SHIFT (KANTOR / BACK-OFFICE)
  // =========================================================================
  normalWorkDays: 5,
  normalStartTime: "08:30",
  normalEndTime: "17:30",
  normalBreakStartTime: "12:00",
  normalBreakEndTime: "13:00",
  normalDailySchedules: {
    senin: {
      active: true,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    },
    selasa: {
      active: true,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    },
    rabu: {
      active: true,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    },
    kamis: {
      active: true,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    },
    jumat: {
      active: true,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "11:30",
      breakEndTime: "13:00"
    },
    sabtu: {
      active: false,
      startTime: "08:30",
      endTime: "13:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    },
    minggu: {
      active: false,
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00"
    }
  },

  // =========================================================================
  // METODE 2: SISTEM SHIFT OPERASIONAL & ROSTER
  // =========================================================================
  // 1. Master Shift Operasional
  shifts: [
    {
      id: "shift-reguler",
      code: "REGULER",
      name: "NON SHIFT (Kantor)",
      startTime: "08:30",
      endTime: "17:30",
      breakStartTime: "12:00",
      breakEndTime: "13:00",
      crossDay: false,
      color: "blue",
      description: "Jam operasional kantor standar (Senin - Jumat 08:30 - 17:30)",
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

  // 2. Pola Rotasi Shift (Cycle Roster)
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
    },
    {
      id: "pat-3shift-continuous",
      name: "Pola Rotasi 3 Shift Kontinu (3P-3S-3M-3OFF)",
      description: "Siklus rotasi 12 hari untuk tim pemeliharaan mesin & utilitas pabrik",
      cycle: [
        "shift-1-pagi",
        "shift-1-pagi",
        "shift-1-pagi",
        "shift-2-siang",
        "shift-2-siang",
        "shift-2-siang",
        "shift-3-malam",
        "shift-3-malam",
        "shift-3-malam",
        "shift-off",
        "shift-off",
        "shift-off"
      ]
    }
  ],

  // 3. Master Group / Regu Shift
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
      id: "grp-mfg-regu-c",
      name: "Regu C - Manufaktur & Quality Control",
      description: "Tim Inspeksi Kualitas & Pemantauan Mutu Jalur Produksi",
      color: "#0EA5E9",
      employeeIds: [
        "emp-007",
        "emp-014",
        "emp-021",
        "emp-035"
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

  // 4. Penugasan Aktif Group / Regu (Group Assignments)
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
      id: "grp-mfg-regu-c",
      name: "Regu C - Manufaktur & Quality Control",
      description: "Tim Inspeksi Kualitas & Pemantauan Mutu Jalur Produksi",
      color: "#0EA5E9",
      employeeIds: [
        "emp-007",
        "emp-014",
        "emp-021",
        "emp-035"
      ],
      shiftPatternId: "pat-3shift-4group",
      anchorDate: "{{TODAY-15}}"
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

  // 5. Penugasan Aktif Departemen (Department Assignments)
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

  // 6. Template Pola Jadwal Tersimpan (Saved Schedule Patterns)
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
          id: "grp-mfg-regu-c",
          name: "Regu C - Manufaktur & Quality Control",
          description: "Tim Inspeksi Kualitas & Pemantauan Mutu Jalur Produksi",
          employeeIds: [
            "emp-007",
            "emp-014",
            "emp-021",
            "emp-035"
          ],
          shiftPatternId: "pat-3shift-4group",
          anchorDate: "{{TODAY-15}}"
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
      description: "Pola cadangan darurat / libur akhir tahun di mana seluruh departemen disamaratakan bekerja non-shift 5 hari kantor",
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

export default sampleScheduleConfig;
