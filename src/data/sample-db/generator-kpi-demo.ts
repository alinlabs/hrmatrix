import { KPIPeriod, KPIResult, Employee, KPIItemResult, Attendance } from '../../types';
import rawEmployees from './karyawan';
import { calculateGrade } from '../../services/kpi-service';

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
 * Menghitung skor KPI Kehadiran & Kedisiplinan (0-100) langsung dari log presensi periode berjalan
 * menggunakan rumus resmi yang sama dengan src/services/kpi-service.ts.
 */
function computeAttendanceKPIScore(
  empId: string,
  startDate: string,
  endDate: string,
  attendanceList: Attendance[],
  fallbackHash: number
): number {
  const periodRecords = attendanceList.filter(
    (r) => r.employeeId === empId && r.date >= startDate && r.date <= endDate
  );

  if (periodRecords.length === 0) {
    return empId === 'emp-001' ? 100 : Math.min(98, 86 + (fallbackHash % 10));
  }

  const totalDays = periodRecords.length;
  const presentDays = periodRecords.filter(
    (r) => r.status === 'Present' || r.status === 'WFH'
  ).length;
  const lateDays = periodRecords.filter((r) => r.status === 'Late').length;
  const absentDays = periodRecords.filter((r) => r.status === 'Absent').length;

  const attended = presentDays + lateDays;
  const attendanceRatio = totalDays > 0 ? attended / totalDays : 1;
  const latePenalty = Math.min(20, lateDays * 2);
  const absentPenalty = absentDays * 4;

  const rawScore = Math.round(attendanceRatio * 100 - latePenalty * 0.5 - absentPenalty);
  return Math.max(0, Math.min(100, rawScore));
}

/**
 * SISTEM AUTO-GENERASI DATA KPI MODE DEMO (6 BULAN KE BELAKANG)
 * 
 * Sesuai aturan:
 * - Menghasilkan 6 periode evaluasi KPI bulanan ke belakang (-1 s/d -6 bulan dari baseDate)
 * - Indikator Kehadiran & Kedisiplinan disinkronkan 100% dengan log presensi (Attendance[]) tiap bulan
 * - Status periode: 'Completed' (telah diverifikasi & disetujui tiap akhir bulan)
 * - Bulan berjalan dibiarkan terbuka agar pengguna dapat mencoba membuat & menilai KPI baru.
 */
export function generateDemoKPI(
  baseDate = new Date(),
  attendanceList: Attendance[] = []
): DemoKPIBundle {
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();

  const periods: KPIPeriod[] = [];
  const allResults: KPIResult[] = [];

  for (let offset = 1; offset <= 6; offset++) {
    const targetDate = new Date(baseYear, baseMonth - offset, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonthIdx = targetDate.getMonth(); // 0 - 11
    const targetMonthStr = String(targetMonthIdx + 1).padStart(2, '0');
    const targetMonthName = INDO_MONTHS_NAMES[targetMonthIdx] || 'Januari';

    const startDate = `${targetYear}-${targetMonthStr}-01`;
    const lastDay = new Date(targetYear, targetMonthIdx + 1, 0).getDate();
    const endDate = `${targetYear}-${targetMonthStr}-${String(lastDay).padStart(2, '0')}`;
    const periodId = `${targetYear}-${targetMonthStr}`;

    const period: KPIPeriod = {
      id: periodId,
      name: `KPI ${targetMonthName} ${targetYear}`,
      month: targetMonthName,
      year: targetYear,
      startDate,
      endDate,
      status: 'Completed',
      notes: `Evaluasi kinerja rutin periode ${targetMonthName} ${targetYear} telah selesai 100% dan tersinkronisasi dengan data presensi bulanan.`,
      createdAt: `${startDate}T08:00:00.000Z`,
      updatedAt: `${endDate}T17:00:00.000Z`
    };
    periods.push(period);

    const periodResults: KPIResult[] = sampleEmployees.map((emp, index) => {
      const hash = stringHash(`${emp.id}-${periodId}`);
      const attendanceScore = computeAttendanceKPIScore(
        emp.id,
        startDate,
        endDate,
        attendanceList,
        hash
      );

      // Akun utama demo (Alvareza Hilka Pratama, S.M., M.M. - HR Operations)
      if (emp.id === 'emp-001') {
        const s1 = attendanceScore;
        const s2 = 93 + (hash % 4); // 93 .. 96
        const s3 = 94 + ((hash >> 2) % 4); // 94 .. 97
        const s4 = 91 + ((hash >> 4) % 4); // 91 .. 94
        const s5 = 90 + ((hash >> 6) % 5); // 90 .. 94

        const weightedScore = parseFloat(
          (s1 * 0.25 + s2 * 0.25 + s3 * 0.20 + s4 * 0.15 + s5 * 0.15).toFixed(2)
        );
        const gradeInfo = calculateGrade(weightedScore);

        const items: KPIItemResult[] = [
          {
            templateId: 'kpi-master-01',
            kpiName: 'Kehadiran & Kedisiplinan Jam Kerja',
            category: 'Umum',
            weight: 25,
            unit: 'Skor',
            target: 100,
            actual: s1,
            score: s1,
            weightedScore: parseFloat((s1 * 0.25).toFixed(2))
          },
          {
            templateId: 'kpi-master-02',
            kpiName: 'Ketepatan Waktu Penyelesaian Tugas (SLA)',
            category: 'Umum',
            weight: 25,
            unit: 'Skor',
            target: 100,
            actual: s2,
            score: s2,
            weightedScore: parseFloat((s2 * 0.25).toFixed(2))
          },
          {
            templateId: 'kpi-master-03',
            kpiName: 'Kepatuhan SOP & Kebijakan Perusahaan',
            category: 'Umum',
            weight: 20,
            unit: 'Skor',
            target: 100,
            actual: s3,
            score: s3,
            weightedScore: parseFloat((s3 * 0.20).toFixed(2))
          },
          {
            templateId: 'kpi-master-04',
            kpiName: 'Inisiatif & Kerjasama Tim',
            category: 'Umum',
            weight: 15,
            unit: 'Skor',
            target: 100,
            actual: s4,
            score: s4,
            weightedScore: parseFloat((s4 * 0.15).toFixed(2))
          },
          {
            templateId: 'kpi-master-05',
            kpiName: 'Efisiensi Penggunaan Waktu & Fasilitas',
            category: 'Umum',
            weight: 15,
            unit: 'Skor',
            target: 100,
            actual: s5,
            score: s5,
            weightedScore: parseFloat((s5 * 0.15).toFixed(2))
          }
        ];

        return {
          id: `kpi-res-${periodId}-${emp.id}`,
          employeeId: emp.id,
          periodId,
          score: weightedScore,
          grade: gradeInfo.grade,
          gradeLabel: gradeInfo.label,
          generalScore: parseFloat(((s1 + s2 + s3) / 3).toFixed(1)),
          departmentScore: parseFloat(((s4 + s5) / 2).toFixed(1)),
          evaluatorId: 'emp-004',
          notes: `Performa HR Operations pada periode ${targetMonthName} ${targetYear} sangat baik; akurasi data presensi, cuti, dan kesiapan cut-off payroll mencapai target 100%.`,
          evaluatedAt: `${endDate}T16:00:00.000Z`,
          items
        };
      }

      // Karyawan lainnya: Kehadiran (score1) 100% dari log presensi aktual bulan tersebut
      const baseScore = 82 + (hash % 14); // 82 .. 95
      const score1 = attendanceScore;
      const score2 = Math.min(100, baseScore + ((hash >> 2) % 5) - 2);
      const score3 = Math.min(100, baseScore + ((hash >> 4) % 5) - 1);
      const score4 = Math.min(100, baseScore + ((hash >> 6) % 5) - 1);
      const score5 = Math.min(100, baseScore + ((hash >> 8) % 5));

      const weightedScore = parseFloat(
        (
          score1 * 0.25 +
          score2 * 0.25 +
          score3 * 0.20 +
          score4 * 0.15 +
          score5 * 0.15
        ).toFixed(2)
      );

      const gradeInfo = calculateGrade(weightedScore);

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
        grade: gradeInfo.grade,
        gradeLabel: gradeInfo.label,
        generalScore,
        departmentScore,
        evaluatorId: index < 5 ? 'emp-004' : 'emp-001',
        notes: `Target kerja periode ${targetMonthName} ${targetYear} tercapai dengan predikat ${gradeInfo.label}. Skor kehadiran (${score1}) tersinkronisasi dari presensi.`,
        evaluatedAt: `${endDate}T16:00:00.000Z`,
        items
      };
    });

    allResults.push(...periodResults);
  }

  return {
    period: periods[0],
    results: allResults,
    periods
  };
}

export default generateDemoKPI;
