import { db } from '../db/database';
import { MASTER_KPI_UMUM, MasterKPIUmum } from '../data/master/kpi-umum';
import { KPIGradeRule, KPIPeriod, KPIRuleConfig, KPITemplate } from '../types';

export const INDO_MONTHS_FULL = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DEFAULT_KPI_RULES: KPIRuleConfig = {
  id: 'kpiConfig',
  evaluationCycle: 'Bulanan',
  generalWeightPercentage: 40,
  departmentWeightPercentage: 60,
  passingScore: 75,
  autoAttendanceKPI: true,
  grades: [
    {
      grade: 'A',
      label: 'Istimewa (Exceeds Expectations)',
      minScore: 90,
      maxScore: 100,
      color: 'emerald',
      description: 'Kinerja sangat luar biasa dan melampaui target strategis perusahaan.',
    },
    {
      grade: 'B',
      label: 'Baik (Meets Expectations)',
      minScore: 75,
      maxScore: 89.99,
      color: 'blue',
      description: 'Kinerja solid dan memenuhi seluruh target utama jabatan.',
    },
    {
      grade: 'C',
      label: 'Cukup (Needs Improvement)',
      minScore: 60,
      maxScore: 74.99,
      color: 'amber',
      description: 'Memenuhi sebagian target namun memerlukan pembinaan terarah.',
    },
    {
      grade: 'D',
      label: 'Kurang (Unsatisfactory)',
      minScore: 0,
      maxScore: 59.99,
      color: 'rose',
      description: 'Di bawah standar kelulusan dan memerlukan evaluasi kinerja khusus.',
    },
  ],
  notes: 'Standar penilaian KPI HRMatrix Indonesia (40% KPI Umum Perusahaan + 60% KPI Kompetensi Jabatan).',
  updatedAt: new Date().toISOString(),
};

export function calculateGrade(
  score: number,
  grades: KPIGradeRule[] = DEFAULT_KPI_RULES.grades
): { grade: 'A' | 'B' | 'C' | 'D'; label: string; color: string } {
  const s = Math.max(0, Math.min(100, Number(score || 0)));
  const ordered = [...(grades?.length ? grades : DEFAULT_KPI_RULES.grades)].sort(
    (a, b) => b.minScore - a.minScore
  );

  const matched =
    ordered.find((g) => s >= g.minScore) || ordered[ordered.length - 1];

  return {
    grade: (matched?.grade || 'C') as 'A' | 'B' | 'C' | 'D',
    label: matched?.label || 'Cukup',
    color: matched?.color || 'blue',
  };
}

export async function ensureKPIRulesAndTemplates(): Promise<{
  rules: KPIRuleConfig;
  templates: KPITemplate[];
}> {
  let rules: KPIRuleConfig = DEFAULT_KPI_RULES;
  try {
    const row = await db.settings.get('kpiConfig');
    const saved = ((row as any)?.data || row) as Partial<KPIRuleConfig> | undefined;
    if (saved && saved.id === 'kpiConfig') {
      rules = {
        ...DEFAULT_KPI_RULES,
        ...saved,
        grades: saved.grades?.length ? saved.grades : DEFAULT_KPI_RULES.grades,
      };
    } else {
      await db.settings.put({
        ...DEFAULT_KPI_RULES,
        id: 'kpiConfig',
        data: DEFAULT_KPI_RULES,
      });
    }
  } catch {
    // Fallback to default rules
  }

  let templates: KPITemplate[] = [];
  try {
    templates = await db.kpiTemplates.toArray();
    if (templates.length === 0) {
      const now = new Date().toISOString();
      const seeded: KPITemplate[] = MASTER_KPI_UMUM.map((t: MasterKPIUmum) => ({
        id: t.id,
        code: t.id,
        name: t.name,
        description: t.description,
        category: 'Umum',
        isGeneral: true,
        weight: t.weight,
        minimumScore: t.minimumScore,
        measurementBase: t.measurementBase,
        unit: '%',
        targetDefault: 100,
        createdAt: now,
        updatedAt: now,
      }));
      await db.kpiTemplates.bulkPut(seeded);
      templates = seeded;
    }
  } catch {
    // Ignore template seed failure
  }

  return { rules, templates };
}

export async function ensureKPIPeriods(): Promise<KPIPeriod[]> {
  try {
    const existing = await db.kpiPeriods.toArray();
    if (existing.length > 0) return existing;

    const now = new Date();
    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const monthStr = String(monthIdx + 1).padStart(2, '0');
    const monthName = INDO_MONTHS_FULL[monthIdx] || 'Januari';
    const lastDay = new Date(year, monthIdx + 1, 0).getDate();

    const defaultPeriod: KPIPeriod = {
      id: `${year}-${monthStr}`,
      name: `KPI ${monthName} ${year}`,
      month: monthName,
      year,
      startDate: `${year}-${monthStr}-01`,
      endDate: `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`,
      status: 'In_Progress',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await db.kpiPeriods.put(defaultPeriod);
    return [defaultPeriod];
  } catch {
    return [];
  }
}

export async function createKPIPeriod(
  name: string,
  startDate: string,
  endDate: string
): Promise<KPIPeriod> {
  const start = startDate ? new Date(startDate) : new Date();
  const monthIdx = isNaN(start.getMonth()) ? new Date().getMonth() : start.getMonth();
  const year = isNaN(start.getFullYear()) ? new Date().getFullYear() : start.getFullYear();
  const monthName = INDO_MONTHS_FULL[monthIdx] || 'Januari';

  const period: KPIPeriod = {
    id: `kpi-${Date.now()}`,
    name: name.trim() || `KPI ${monthName} ${year}`,
    month: monthName,
    year,
    startDate,
    endDate,
    status: 'In_Progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.kpiPeriods.put(period);
  return period;
}

export async function calculateEmployeeAttendanceScore(
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<{ score: number; presentDays: number; lateDays: number; totalDays: number }> {
  try {
    const records = await db.attendance
      .where('employeeId')
      .equals(employeeId)
      .toArray();
    const periodRecords = records.filter(
      (r) => r.date >= startDate && r.date <= endDate
    );

    if (periodRecords.length === 0) {
      return { score: 90, presentDays: 0, lateDays: 0, totalDays: 0 };
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
    const score = Math.max(0, Math.min(100, rawScore));

    return { score, presentDays, lateDays, totalDays };
  } catch {
    return { score: 85, presentDays: 0, lateDays: 0, totalDays: 0 };
  }
}
