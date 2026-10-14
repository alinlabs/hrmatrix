import { KPIPeriod, KPIResult } from '../../types';

/**
 * SAMPLE DATABASE: PERIODE KPI BULAN LALU (STATUS: COMPLETED / FINAL) (MODE DEMO)
 * 
 * Konfigurasi periode KPI bulan lalu beserta hasil evaluasi akhir yang telah ditutup/disetujui.
 */
export const samplePeriodAgustus2026: KPIPeriod = {
  id: '2026-08',
  name: 'KPI Agustus 2026',
  month: 'Agustus',
  year: 2026,
  startDate: '2026-08-01',
  endDate: '2026-08-31',
  status: 'Completed',
  notes: 'Evaluasi kinerja rutin periode Agustus 2026 telah selesai 100% dan seluruh skor telah diverifikasi oleh Direksi.',
  createdAt: '{{ISO_NOW}}',
  updatedAt: '{{ISO_NOW}}'
};

export const sampleResultsAgustus2026: KPIResult[] = [
  {
    id: 'kpi-res-2026-08-emp001',
    employeeId: 'emp-001',
    periodId: '2026-08',
    score: 95,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 96,
    departmentScore: 94,
    evaluatorId: 'BOD-COMMISSIONER',
    notes: 'Performa kepemimpinan sangat baik, realisasi EBITDA perusahaan melebihi proyeksi 12%.',
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
    id: 'kpi-res-2026-08-emp002',
    employeeId: 'emp-002',
    periodId: '2026-08',
    score: 87,
    grade: 'B',
    gradeLabel: 'Baik (Meets Expectations)',
    generalScore: 88,
    departmentScore: 86,
    evaluatorId: 'emp-001',
    notes: 'Program pelatihan K3 dan perpanjangan sertifikasi kelayakan pabrik selesai tepat waktu.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 92,
        score: 92,
        weightedScore: 23
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 86,
        score: 86,
        weightedScore: 21.5
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
    id: 'kpi-res-2026-08-emp003',
    employeeId: 'emp-003',
    periodId: '2026-08',
    score: 93,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 94,
    departmentScore: 92,
    evaluatorId: 'emp-001',
    notes: 'Kapasitas output manufaktur mencapai target bulanan 105% dengan efisiensi konsumsi daya yang baik.',
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
        actual: 90,
        score: 90,
        weightedScore: 13.5
      }
    ]
  },
  {
    id: 'kpi-res-2026-08-emp004',
    employeeId: 'emp-004',
    periodId: '2026-08',
    score: 90,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 92,
    departmentScore: 89,
    evaluatorId: 'emp-003',
    notes: 'Supervisi shift malam sangat kondusif, tingkat kedisiplinan anggota tim mencapai 98%.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 98,
        score: 98,
        weightedScore: 24.5
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
        actual: 85,
        score: 85,
        weightedScore: 12.75
      }
    ]
  },
  {
    id: 'kpi-res-2026-08-emp007',
    employeeId: 'emp-007',
    periodId: '2026-08',
    score: 94,
    grade: 'A',
    gradeLabel: 'Sangat Baik (Outstanding)',
    generalScore: 95,
    departmentScore: 93,
    evaluatorId: 'emp-001',
    notes: 'Pengendalian kualitas produk akhir sangat ketat, audit kepatuhan mutu meraih skor 96/100.',
    evaluatedAt: '{{ISO_NOW}}',
    items: [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: 98,
        score: 98,
        weightedScore: 24.5
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
        actual: 92,
        score: 92,
        weightedScore: 13.8
      }
    ]
  }
];

export default {
  period: samplePeriodAgustus2026,
  results: sampleResultsAgustus2026
};
