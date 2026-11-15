import { KPIPeriod, KPIResult, Employee, KPIItemResult } from '../../types';
import rawEmployees from './karyawan';
import { getDemoMonthWindow } from './generator-presensi-demo';

const sampleEmployees = rawEmployees as unknown as Employee[];

const INDO_MONTHS_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export interface DemoKPIBundle {
  period: KPIPeriod;
  results: KPIResult[];
  periods: KPIPeriod[];
}

// PRNG deterministik berbasis string seed
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * SISTEM AUTO-GENERASI DATA KPI MODE DEMO
 * 
 * Sesuai aturan:
 * - Menghitung periode 1 bulan yang lalu secara dinamis berdasarkan baseDate
 *   (misal klik Mode Demo pada 23 September 2026, maka yang dibuat adalah periode Agustus 2026)
 * - Rentang tanggal: dari tanggal 1 hingga akhir bulan sebelumnya
 * - Status periode: 'Completed' (karena sudah diverifikasi & disetujui pada akhir bulan lalu)
 * - HANYA membuat data 1 bulan lalu (bulan berjalan dan mendatang dibiarkan kosong agar
 *   pengguna dapat mencoba membuat periode baru dan melakukan evaluasi KPI sendiri
 *   sebagai user experience / uji coba).
 */
export function generateDemoKPI(baseDate = new Date()): DemoKPIBundle {
  const window = getDemoMonthWindow(baseDate);

  const prevYear = window.prevMonthYear;
  const prevMonthIdx = window.prevMonth; // 0 - 11
  const prevMonthStr = String(prevMonthIdx + 1).padStart(2, '0');
  const prevMonthName = INDO_MONTHS_NAMES[prevMonthIdx] || 'Agustus';

  const startDate = `${prevYear}-${prevMonthStr}-01`;
  const lastDay = new Date(prevYear, prevMonthIdx + 1, 0).getDate();
  const endDate = `${prevYear}-${prevMonthStr}-${String(lastDay).padStart(2, '0')}`;
  const periodId = `${prevYear}-${prevMonthStr}`;

  const period: KPIPeriod = {
    id: periodId,
    name: `KPI ${prevMonthName} ${prevYear}`,
    month: prevMonthName,
    year: prevYear,
    startDate,
    endDate,
    status: 'Completed',
    notes: `Evaluasi kinerja rutin periode ${prevMonthName} ${prevYear} telah selesai 100% dan seluruh skor telah diverifikasi oleh Direksi.`,
    createdAt: `${startDate}T08:00:00.000Z`,
    updatedAt: `${endDate}T17:00:00.000Z`
  };

  const results: KPIResult[] = sampleEmployees.map((emp, index) => {
    const hash = stringHash(`${emp.id}-${periodId}`);
    
    // CEO / Direktur Utama mendapatkan skor outstanding
    if (emp.id === 'emp-001') {
      const items: KPIItemResult[] = [
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
          actual: 92,
          score: 92,
          weightedScore: 13.8
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
      ];

      return {
        id: `kpi-res-${periodId}-${emp.id}`,
        employeeId: emp.id,
        periodId,
        score: 95.05,
        grade: 'A',
        gradeLabel: 'Sangat Baik (Outstanding)',
        generalScore: 96,
        departmentScore: 94,
        evaluatorId: 'BOD-COMMISSIONER',
        notes: `Performa kepemimpinan sangat baik, realisasi target perusahaan periode ${prevMonthName} ${prevYear} melampaui ekspektasi.`,
        evaluatedAt: `${endDate}T16:00:00.000Z`,
        items
      };
    }

    // Distribusi skor realistis antara 82 dan 96
    const baseScore = 82 + (hash % 14); // 82 .. 95
    const score1 = Math.min(100, baseScore + (hash % 5) - 2);
    const score2 = Math.min(100, baseScore + ((hash >> 2) % 5) - 2);
    const score3 = Math.min(100, baseScore + ((hash >> 4) % 5) - 1);
    const score4 = Math.min(100, baseScore + ((hash >> 6) % 5) - 1);
    const score5 = Math.min(100, baseScore + ((hash >> 8) % 5));

    const weightedScore = parseFloat((
      (score1 * 0.25) +
      (score2 * 0.25) +
      (score3 * 0.20) +
      (score4 * 0.15) +
      (score5 * 0.15)
    ).toFixed(2));

    const grade: 'A' | 'B' | 'C' = weightedScore >= 90 ? 'A' : weightedScore >= 75 ? 'B' : 'C';
    const gradeLabel = grade === 'A' 
      ? 'Sangat Baik (Outstanding)' 
      : grade === 'B' 
      ? 'Baik (Meets Expectations)' 
      : 'Cukup (Needs Improvement)';

    const items: KPIItemResult[] = [
      {
        templateId: 'kpi-master-01',
        kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: score1,
        score: score1,
        weightedScore: parseFloat((score1 * 0.25).toFixed(2))
      },
      {
        templateId: 'kpi-master-02',
        kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
        category: 'Umum',
        weight: 25,
        unit: 'Skor',
        target: 100,
        actual: score2,
        score: score2,
        weightedScore: parseFloat((score2 * 0.25).toFixed(2))
      },
      {
        templateId: 'kpi-master-03',
        kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
        category: 'Umum',
        weight: 20,
        unit: 'Skor',
        target: 100,
        actual: score3,
        score: score3,
        weightedScore: parseFloat((score3 * 0.20).toFixed(2))
      },
      {
        templateId: 'kpi-master-04',
        kpiName: 'Inisiatif & Kerjasama Tim',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: score4,
        score: score4,
        weightedScore: parseFloat((score4 * 0.15).toFixed(2))
      },
      {
        templateId: 'kpi-master-05',
        kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
        category: 'Umum',
        weight: 15,
        unit: 'Skor',
        target: 100,
        actual: score5,
        score: score5,
        weightedScore: parseFloat((score5 * 0.15).toFixed(2))
      }
    ];

    const generalScore = parseFloat(((score1 + score2 + score3) / 3).toFixed(1));
    const departmentScore = parseFloat(((score4 + score5) / 2).toFixed(1));

    return {
      id: `kpi-res-${periodId}-${emp.id}`,
      employeeId: emp.id,
      periodId,
      score: weightedScore,
      grade,
      gradeLabel,
      generalScore,
      departmentScore,
      evaluatorId: index < 5 ? 'emp-001' : (sampleEmployees[(index % 4) + 1]?.id || 'emp-001'),
      notes: `Target kerja pada periode ${prevMonthName} ${prevYear} tercapai dengan predikat ${gradeLabel}. Pertahankan disiplin dan kerjasama tim.`,
      evaluatedAt: `${endDate}T16:00:00.000Z`,
      items
    };
  });

  return {
    period,
    results,
    periods: [period]
  };
}

export default generateDemoKPI;
