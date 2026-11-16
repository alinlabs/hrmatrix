import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { ComboboxOption } from '../components/ui';
import { POSITION_INDEX_LITE, LitePositionEntry } from '../data/jobs/position-index-lite';

export interface PositionDetails {
  id: string;
  name: string;
  department: string;
  division?: string;
  category: string;
  level?: string;
  salary?: number;
  salaryRange?: {
    min?: number;
    standar?: number;
    max?: number;
  };
  fixedAllowances?: string[];
  variableAllowances?: string[];
  bpjs?: string[];
  taxRuleId?: string;
  dokumenAdministrasi?: {
    wajib?: string[];
    pendukung?: string[];
    khusus?: string[];
  };
  requiredDocuments?: string[];
}

const liteByIdMap = new Map<string, LitePositionEntry>();
const liteByNameMap = new Map<string, LitePositionEntry>();

POSITION_INDEX_LITE.forEach((entry) => {
  liteByIdMap.set(entry.id, entry);
  liteByNameMap.set(entry.nama.toLowerCase(), entry);
});

export function getPositionComboboxOptions(): ComboboxOption[] {
  return POSITION_INDEX_LITE.map((entry) => ({
    value: entry.id,
    label: entry.nama,
    sublabel: [entry.departemen, entry.level].filter(Boolean).join(' • '),
    data: {
      id: entry.id,
      name: entry.nama,
      department: entry.departemen,
      division: entry.divisi,
      category: entry.kategori,
      level: entry.level,
    },
  }));
}

const fullTemplatesCache = new Map<string, any>();
let fullTemplatesLoaded = false;
let preloadPromise: Promise<void> | null = null;

export function getDefaultSalaryForLevel(level?: string): number {
  const l = (level || '').toLowerCase();
  if (l.includes('c-level') || l.includes('executive') || l.includes('chief')) return 45000000;
  if (l.includes('director') || l.includes('direktur')) return 32000000;
  if (l.includes('gm') || l.includes('general manager') || l.includes('vp')) return 22000000;
  if (l.includes('senior manager')) return 17000000;
  if (l.includes('manager') || l.includes('head')) return 14000000;
  if (l.includes('supervisor') || l.includes('lead') || l.includes('coordinator')) return 9500000;
  if (l.includes('senior') || l.includes('specialist') || l.includes('analyst')) return 8000000;
  if (l.includes('intern') || l.includes('magang')) return 3000000;
  if (l.includes('operator') || l.includes('crew') || l.includes('driver')) return 5200000;
  return 6000000;
}

function mapTemplateToDetails(raw: any): PositionDetails {
  const level = raw.level || 'Staff / Officer';
  const range = raw.rentangGaji || raw.salaryRange;
  const standardSalary =
    Number(raw.gajiStandar || raw.salary || range?.standar || 0) ||
    getDefaultSalaryForLevel(level);

  const dokAdmin = raw.dokumenAdministrasi;
  const reqDocs: string[] = Array.isArray(raw.requiredDocuments)
    ? raw.requiredDocuments
    : dokAdmin
      ? [...(dokAdmin.wajib || []), ...(dokAdmin.pendukung || []), ...(dokAdmin.khusus || [])]
      : [];

  return {
    id: raw.id,
    name: raw.nama || raw.name || raw.id,
    department: raw.departemen || raw.department || 'Umum',
    division: raw.divisi || raw.division,
    category: raw.kategori || raw.category || 'Umum',
    level,
    salary: standardSalary,
    salaryRange: range
      ? {
          min: Number(range.min || Math.round(standardSalary * 0.8)),
          standar: Number(range.standar || standardSalary),
          max: Number(range.max || Math.round(standardSalary * 1.35)),
        }
      : {
          min: Math.round(standardSalary * 0.8),
          standar: standardSalary,
          max: Math.round(standardSalary * 1.35),
        },
    fixedAllowances: raw.tunjanganTetap || raw.fixedAllowances,
    variableAllowances: raw.tunjanganTidakTetap || raw.variableAllowances,
    bpjs: raw.bpjs,
    taxRuleId: raw.taxRuleId,
    dokumenAdministrasi: dokAdmin,
    requiredDocuments: reqDocs,
  };
}

function mapLiteToDetails(lite: LitePositionEntry): PositionDetails {
  const salary = getDefaultSalaryForLevel(lite.level);
  return {
    id: lite.id,
    name: lite.nama,
    department: lite.departemen || 'Umum',
    division: lite.divisi,
    category: lite.kategori || 'Umum',
    level: lite.level,
    salary,
    salaryRange: {
      min: Math.round(salary * 0.8),
      standar: salary,
      max: Math.round(salary * 1.35),
    },
  };
}

export async function preloadJobTemplates(): Promise<void> {
  if (fullTemplatesLoaded) return;
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    try {
      const mod = await import('../data/jobs');
      const list = (mod as any).ALL_JOB_TEMPLATES || (mod as any).default || [];
      if (Array.isArray(list)) {
        list.forEach((tpl: any) => {
          if (tpl?.id) fullTemplatesCache.set(tpl.id, tpl);
          if (tpl?.nama) fullTemplatesCache.set(String(tpl.nama).toLowerCase(), tpl);
        });
      }
      fullTemplatesLoaded = true;
    } catch {
      // Fail safely if lazy job bundle cannot be loaded
    } finally {
      preloadPromise = null;
    }
  })();

  return preloadPromise;
}

export function getPositionName(idOrName?: string, fallback?: string): string {
  if (!idOrName) return fallback ?? '';
  const trimmed = String(idOrName).trim();
  if (!trimmed) return fallback ?? '';

  const full = fullTemplatesCache.get(trimmed) || fullTemplatesCache.get(trimmed.toLowerCase());
  if (full?.nama) return full.nama;

  const lite = liteByIdMap.get(trimmed) || liteByNameMap.get(trimmed.toLowerCase());
  if (lite?.nama) return lite.nama;

  if (fallback !== undefined && trimmed.startsWith('TPL-')) {
    return fallback || trimmed;
  }
  return trimmed;
}

export function getDepartmentName(
  deptIdOrName?: string,
  positionId?: string,
  fallback?: string
): string {
  if (positionId) {
    const pos = getPositionDetails(positionId);
    if (pos?.department && (!deptIdOrName || deptIdOrName.startsWith('dept-'))) {
      return pos.department;
    }
  }
  if (!deptIdOrName) return fallback ?? '';
  const cleaned = String(deptIdOrName).trim();
  if (!cleaned) return fallback ?? '';
  return cleaned;
}

export function getPositionDetails(idOrName?: string): PositionDetails | null {
  if (!idOrName) return null;
  const trimmed = String(idOrName).trim();
  if (!trimmed) return null;

  const cached = fullTemplatesCache.get(trimmed) || fullTemplatesCache.get(trimmed.toLowerCase());
  if (cached) {
    return mapTemplateToDetails(cached);
  }

  const lite = liteByIdMap.get(trimmed) || liteByNameMap.get(trimmed.toLowerCase());
  if (lite) {
    return mapLiteToDetails(lite);
  }

  return null;
}

export async function getPositionDetailsAsync(idOrName?: string): Promise<PositionDetails | null> {
  if (!idOrName) return null;
  await preloadJobTemplates();
  return getPositionDetails(idOrName);
}

export async function exportAndSavePosition(
  positionId: string,
  overrides?: {
    category?: string;
    department?: string;
    division?: string;
    level?: string;
  }
): Promise<{
  id: string;
  department: string;
  category?: string;
  level?: string;
  division?: string;
}> {
  await preloadJobTemplates();
  const details = getPositionDetails(positionId);
  const posName = details?.name || getPositionName(positionId, positionId);
  const deptName = overrides?.department || details?.department || 'Operasional Umum';
  const level = overrides?.level || details?.level || 'Staff / Officer';
  const category = overrides?.category || details?.category || '';
  const division = overrides?.division || details?.division || '';

  // Ensure Department exists in IndexedDB
  const existingDepts = await db.departments.toArray();
  let dept = existingDepts.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
  if (!dept) {
    const createdDept = {
      id: `dept-${uuidv4().slice(0, 8)}`,
      name: deptName,
      description: division || category || '',
    };
    await db.departments.put(createdDept);
    dept = createdDept;
  }

  // Ensure Position exists in IndexedDB
  const resolvedPosId = positionId || `pos-${uuidv4().slice(0, 8)}`;
  const existingPos = await db.positions.get(resolvedPosId);
  if (!existingPos) {
    await db.positions.put({
      id: resolvedPosId,
      name: posName,
      departmentId: dept.id,
    });
  }

  return {
    id: resolvedPosId,
    department: dept.name,
    category: category || undefined,
    level: level || undefined,
    division: division || undefined,
  };
}
