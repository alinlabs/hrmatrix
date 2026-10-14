import { db } from '../db/database';
import { KPIRuleConfig, KPITemplate, KPIGradeRule, KPIPeriod, KPIResult } from '../types';
import { samplePengaturanKPI } from '../data/sampleDb/pengaturan-kpi';
import { sampleKatalogKPI } from '../data/sampleDb/katalog-kpi';

export const INDO_MONTHS_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DEFAULT_KPI_RULES: KPIRuleConfig = {
  ...samplePengaturanKPI,
  updatedAt: new Date().toISOString().split('T')[0]
};

export const DEFAULT_GENERAL_KPIS: Omit<KPITemplate, 'id'>[] = sampleKatalogKPI.map(m => ({
  name: m.name,
  description: m.description,
  minimumScore: m.minimumScore,
  weight: m.weight,
  measurementBase: m.measurementBase,
  category: m.category || 'Umum',
  isGeneral: m.isGeneral !== undefined ? m.isGeneral : true
}));

let ensureKPIPromise: Promise<{
  rules: KPIRuleConfig;
  templates: KPITemplate[];
}> | null = null;

export function ensureKPIRulesAndTemplates(): Promise<{
  rules: KPIRuleConfig;
  templates: KPITemplate[];
}> {
  if (!ensureKPIPromise) {
    ensureKPIPromise = (async () => {
      try {
        return await doEnsureKPIRulesAndTemplates();
      } finally {
        ensureKPIPromise = null;
      }
    })();
  }
  return ensureKPIPromise;
}

async function doEnsureKPIRulesAndTemplates(): Promise<{
  rules: KPIRuleConfig;
  templates: KPITemplate[];
}> {
  // 1. Get or create KPI rules config
  let configRecord = await db.settings.get('kpiConfig');
  let rules: KPIRuleConfig;

  if (!configRecord || !(configRecord as any).grades) {
    rules = DEFAULT_KPI_RULES;
    await db.settings.put({
      id: 'kpiConfig',
      ...rules
    } as any);
  } else {
    rules = configRecord as unknown as KPIRuleConfig;
  }

  // 2. Check general KPI templates (upsert using bulkPut to prevent ConstraintError)
  const existingTemplates = await db.kpiTemplates.toArray();
  const existingIds = new Set(existingTemplates.map(t => t.id));
  const existingNames = new Set(existingTemplates.map(t => t.name.toLowerCase()));

  const missingTemplates: KPITemplate[] = [];
  const today = new Date().toISOString().split('T')[0];

  for (const item of sampleKatalogKPI) {
    if (!existingIds.has(item.id) && !existingNames.has(item.name.toLowerCase())) {
      missingTemplates.push({
        id: item.id,
        name: item.name,
        description: item.description,
        minimumScore: item.minimumScore,
        weight: item.weight,
        measurementBase: item.measurementBase,
        category: item.category || 'Umum',
        isGeneral: item.isGeneral !== undefined ? item.isGeneral : true,
        createdAt: today,
        updatedAt: today
      });
    }
  }

  if (missingTemplates.length > 0) {
    await db.kpiTemplates.bulkPut(missingTemplates);
  }

  // Enrich existing templates if missing minimumScore or measurementBase
  for (const tpl of existingTemplates) {
    if (tpl.minimumScore === undefined || !tpl.measurementBase) {
      const masterMatch = sampleKatalogKPI.find(m => m.name.toLowerCase() === tpl.name.toLowerCase());
      const updateData: Partial<KPITemplate> = {};
      if (tpl.minimumScore === undefined && masterMatch) {
        updateData.minimumScore = masterMatch.minimumScore;
      }
      if (!tpl.measurementBase && masterMatch) {
        updateData.measurementBase = masterMatch.measurementBase;
      }
      if (Object.keys(updateData).length > 0) {
        await db.kpiTemplates.update(tpl.id, updateData);
      }
    }
  }

  const refreshedTemplates = await db.kpiTemplates.toArray();
  return { rules, templates: refreshedTemplates };
}

export function calculateGrade(score: number, grades: KPIGradeRule[]): KPIGradeRule {
  const found = grades.find(g => score >= g.minScore && score <= (g.maxScore + 0.009));
  if (found) return found;

  const rounded = Math.round(score);
  const foundRounded = grades.find(g => rounded >= g.minScore && rounded <= g.maxScore);
  if (foundRounded) return foundRounded;

  if (score >= 90) return grades[0] || DEFAULT_KPI_RULES.grades[0];
  if (score >= 75) return grades[1] || DEFAULT_KPI_RULES.grades[1];
  if (score >= 60) return grades[2] || DEFAULT_KPI_RULES.grades[2];
  return grades[3] || DEFAULT_KPI_RULES.grades[3];
}

/**
 * Returns existing KPI periods from the database.
 * No dummy/mock periods are seeded by default so that the initial state remains empty.
 */
let ensurePeriodsPromise: Promise<KPIPeriod[]> | null = null;

export function ensureKPIPeriods(): Promise<KPIPeriod[]> {
  if (!ensurePeriodsPromise) {
    ensurePeriodsPromise = (async () => {
      try {
        return await doEnsureKPIPeriods();
      } finally {
        ensurePeriodsPromise = null;
      }
    })();
  }
  return ensurePeriodsPromise;
}

async function doEnsureKPIPeriods(): Promise<KPIPeriod[]> {
  try {
    const existing = await db.kpiPeriods.toArray();
    return (existing || []).sort((a, b) => b.startDate.localeCompare(a.startDate));
  } catch (err) {
    console.error('Error getting KPI periods:', err);
    return [];
  }
}

/**
 * Creates a new KPI Monthly Period
 */
export async function createKPIPeriod(
  name: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<KPIPeriod> {
  const parts = startDate.split('-');
  const year = parseInt(parts[0], 10) || new Date().getFullYear();
  const monthIdx = (parseInt(parts[1], 10) || 1) - 1;
  const monthName = INDO_MONTHS_FULL[monthIdx] || 'Bulan';
  const monthStr = String(monthIdx + 1).padStart(2, '0');
  const id = `${year}-${monthStr}`;

  const newPeriod: KPIPeriod = {
    id,
    name: name.trim() || `KPI ${monthName} ${year}`,
    month: monthName,
    year,
    startDate,
    endDate,
    status: 'In_Progress',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  await db.kpiPeriods.put(newPeriod);
  return newPeriod;
}

/**
 * Calculates employee attendance percentage score from db.attendance in a given period
 */
export async function calculateEmployeeAttendanceScore(
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<{ score: number; details: string }> {
  try {
    const logs = await db.attendance
      .where('employeeId')
      .equals(employeeId)
      .toArray();
      
    const leaves = await db.leaves
      .where('employeeId')
      .equals(employeeId)
      .toArray();

    const periodLogs = logs.filter(l => l.date >= startDate && l.date <= endDate);
    const periodLeaves = leaves.filter(l => l.status === 'Approved' && l.startDate <= endDate && l.endDate >= startDate);

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const dayMap = new Map();
    
    // Fill from attendance
    for (const l of periodLogs) {
      dayMap.set(l.date, l.status);
    }
    
    // Fill from leaves if not present in attendance
    for (let d = new Date(sDate); d <= eDate; d.setDate(d.getDate() + 1)) {
      const dStr = d.toISOString().split('T')[0];
      if (!dayMap.has(dStr)) {
        const hasLeave = periodLeaves.find(l => dStr >= l.startDate && dStr <= l.endDate);
        if (hasLeave) {
           dayMap.set(dStr, 'Leave');
        }
      }
    }

    if (dayMap.size === 0) {
      return { score: 100, details: 'Tidak ada catatan pelanggaran absensi (100%)' };
    }

    let totalPoints = 0;
    let countedDays = 0;

    for (const status of dayMap.values()) {
      countedDays++;
      if (status === 'Present' || status === 'WFH') {
        totalPoints += 100;
      } else if (status === 'Late') {
        totalPoints += 80;
      } else if (status === 'Leave' || status === 'Sick') {
        totalPoints += 90; 
      } else if (status === 'Absent') {
        totalPoints += 0;
      } else {
        totalPoints += 100;
      }
    }

    const calculated = Math.min(100, Math.round(totalPoints / (countedDays || 1)));

    return {
      score: calculated,
      details: `${countedDays} catatan hari terdeteksi (Rerata capaian kedisiplinan: ${calculated}%)`
    };
  } catch (err) {
    console.error('Error calculating attendance score:', err);
    return { score: 100, details: 'Default nilai kedisiplinan (100%)' };
  }
}
