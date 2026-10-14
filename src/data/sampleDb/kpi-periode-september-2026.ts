import { KPIPeriod, KPIResult } from '../../types';

/**
 * SAMPLE DATABASE: PERIODE KPI BULAN BERJALAN & REKAP PENILAIAN LENGKAP (MODE DEMO)
 * 
 * Berisi konfigurasi periode KPI berjalan beserta rekap penilaian per karyawan:
 * - Karyawan berbagai tingkatan & divisi (Direksi, HRGA, Produksi, QC, Finance)
 * - Rincian skor per indikator kinerja (KPIItemResult)
 * - Skor terbobot, grade hasil evaluasi, serta catatan feedback atasan
 */
export const samplePeriodSeptember2026: KPIPeriod = {
  id: '2026-09',
  name: 'KPI September 2026',
  month: 'September',
  year: 2026,
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  status: 'In_Progress',
  notes: 'Evaluasi kinerja kuartal 3 menjelang audit standar ISO 9001 & pemenuhan target pesanan akhir tahun.',
  createdAt: '{{ISO_NOW}}',
  updatedAt: '{{ISO_NOW}}'
};

export const sampleResultsSeptember2026: KPIResult[] = [
  {
    id: 'kpi-res-2026-09-emp001',
    employeeId: 'emp-001',
    periodId: '2026-09',
    score: 96,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 98,
    departmentScore: 95,
    evaluatorId: 'BOD-COMMISSIONER',
    notes: 'Kepemimpinan strategis sangat luar biasa dalam ekspansi kapasitas pabrik MM2100 dan efisiensi operasional.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 100,
        score: 100,
        weightedScore: 25
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 95,
        score: 95,
        weightedScore: 23.75
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 96,
        score: 96,
        weightedScore: 19.2
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 95,
        score: 95,
        weightedScore: 14.25
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 92,
        score: 92,
        weightedScore: 13.8
      }
    ]
  },
  {
    id: 'kpi-res-2026-09-emp002',
    employeeId: 'emp-002',
    periodId: '2026-09',
    score: 88,
    grade: 'B',
    gradeLabel: 'Baik (Meets Expectations)',
    generalScore: 89,
    departmentScore: 87,
    evaluatorId: 'emp-001',
    notes: 'Manajemen rekrutmen dan keharmonisan hubungan industrial berjalan kondusif tanpa kendala berarti.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 95,
        score: 95,
        weightedScore: 23.75
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 88,
        score: 88,
        weightedScore: 22
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 90,
        score: 90,
        weightedScore: 18
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 85,
        score: 85,
        weightedScore: 12.75
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 80,
        score: 80,
        weightedScore: 12
      }
    ]
  },
  {
    id: 'kpi-res-2026-09-emp004',
    employeeId: 'emp-004',
    periodId: '2026-09',
    score: 92,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 94,
    departmentScore: 91,
    evaluatorId: 'emp-003',
    notes: 'Pengendalian lini produksi dan kepemimpinan regu shift berjalan sangat solid, target volume bulanan terlampaui.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 100,
        score: 100,
        weightedScore: 25
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 90,
        score: 90,
        weightedScore: 22.5
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 92,
        score: 92,
        weightedScore: 18.4
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 88,
        score: 88,
        weightedScore: 13.2
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 86,
        score: 86,
        weightedScore: 12.9
      }
    ]
  },
  {
    id: 'kpi-res-2026-09-emp005',
    employeeId: 'emp-005',
    periodId: '2026-09',
    score: 83,
    grade: 'B',
    gradeLabel: 'Baik (Meets Expectations)',
    generalScore: 84,
    departmentScore: 82,
    evaluatorId: 'emp-004',
    notes: 'Kinerja pengoperasian mesin produksi baik dan disiplin menjaga kebersihan area kerja 5S.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 90,
        score: 90,
        weightedScore: 22.5
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 82,
        score: 82,
        weightedScore: 20.5
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 85,
        score: 85,
        weightedScore: 17
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 80,
        score: 80,
        weightedScore: 12
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 75,
        score: 75,
        weightedScore: 11.25
      }
    ]
  },
  {
    id: 'kpi-res-2026-09-emp008',
    employeeId: 'emp-008',
    periodId: '2026-09',
    score: 95,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 96,
    departmentScore: 94,
    evaluatorId: 'emp-007',
    notes: 'Inspeksi mutu incoming material dan final goods sangat teliti, zero defect lolos ke pelanggan.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 100,
        score: 100,
        weightedScore: 25
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 94,
        score: 94,
        weightedScore: 23.5
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 95,
        score: 95,
        weightedScore: 19
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 90,
        score: 90,
        weightedScore: 13.5
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 92,
        score: 92,
        weightedScore: 13.8
      }
    ]
  },
  {
    id: 'kpi-res-2026-09-emp011',
    employeeId: 'emp-011',
    periodId: '2026-09',
    score: 91,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 92,
    departmentScore: 90,
    evaluatorId: 'emp-010',
    notes: 'Rekonsiliasi jurnal akuntansi dan laporan arus kas tepat waktu serta akurat.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 96,
        score: 96,
        weightedScore: 24
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 92,
        score: 92,
        weightedScore: 23
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: 90,
        score: 90,
        weightedScore: 18
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 85,
        score: 85,
        weightedScore: 12.75
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: 88,
        score: 88,
        weightedScore: 13.2
      }
    ]
  }
];

export default {
  period: samplePeriodSeptember2026,
  results: sampleResultsSeptember2026
};
