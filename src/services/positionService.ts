import { db } from '../db/database';
import { JobTemplate } from '../pages/job-desk/types';
import { getStoredCustomTemplates } from '../pages/job-desk/storage-helper';
import { POSITION_INDEX_LITE, LitePositionEntry } from '../data/jobs/position-index-lite';
import { ComboboxOption } from '../components/ui';
import { getDepartmentName as resolveDeptName, STANDARD_DEPARTMENT_MAP } from './departmentService';

export { STANDARD_DEPARTMENT_MAP };

export interface UnifiedPosition {
  id: string;
  name: string;
  category?: string;
  department: string;
  division?: string;
  level?: string;
  isCustom?: boolean;
  isExported?: boolean;
  sourceFile?: string;
  rawTemplate?: JobTemplate;
}

export interface PositionDetails extends UnifiedPosition {
  salary?: number;
  salaryRange?: { minimal: number; standar: number; maksimal: number };
  fixedAllowances?: string[];
  variableAllowances?: string[];
  bpjs?: string[];
  documents?: {
    wajib?: string[];
    pendukung?: string[];
    khusus?: string[];
  };
  dokumenAdministrasi?: {
    wajib?: string[];
    pendukung?: string[];
    khusus?: string[];
  };
  requiredDocuments?: string[];
  pajakRuleId?: string;
  taxRuleId?: string;
  pajak?: string[];
}

// Fast O(1) lookup indexes built from the lightweight metadata array
const LITE_BY_ID = new Map<string, LitePositionEntry>();
const LITE_BY_NAME = new Map<string, LitePositionEntry>();

for (const item of POSITION_INDEX_LITE) {
  LITE_BY_ID.set(item.id, item);
  LITE_BY_NAME.set(item.nama.toLowerCase(), item);
}

// Lazy-loaded cache of full JobTemplate details (1.9 MB data/jobs/*.ts + sampleDb/jobdesk)
const allBaseTemplatesMap = new Map<string, JobTemplate>();
let preloadTemplatesPromise: Promise<Map<string, JobTemplate>> | null = null;

/**
 * Loads full JobTemplate payloads (allowances, KPIs, documents, qualifications) on demand.
 * Safe to call repeatedly — concurrent and subsequent calls share the same cached promise.
 */
export function preloadJobTemplates(): Promise<Map<string, JobTemplate>> {
  if (allBaseTemplatesMap.size > 0) {
    return Promise.resolve(allBaseTemplatesMap);
  }
  if (!preloadTemplatesPromise) {
    preloadTemplatesPromise = Promise.all([
      import('../data/jobs/index'),
      import('../data/sampleDb/jobdesk'),
    ])
      .then(([jobsModule, sampleModule]) => {
        const presidentDir = sampleModule.presidentDirectorTemplate;
        if (presidentDir?.id) {
          allBaseTemplatesMap.set(presidentDir.id, presidentDir);
        }

        const sampleList = sampleModule.default;
        if (Array.isArray(sampleList)) {
          for (const tpl of sampleList) {
            if (tpl?.id) {
              allBaseTemplatesMap.set(tpl.id, tpl);
            }
          }
        }

        const allCatalog = jobsModule.allTemplates;
        if (Array.isArray(allCatalog)) {
          for (const tpl of allCatalog) {
            if (tpl?.id) {
              allBaseTemplatesMap.set(tpl.id, tpl);
            }
          }
        }

        return allBaseTemplatesMap;
      })
      .catch((err) => {
        preloadTemplatesPromise = null;
        console.error('Failed to preload full job templates:', err);
        return allBaseTemplatesMap;
      });
  }
  return preloadTemplatesPromise;
}

function findLitePosition(idOrName?: string): UnifiedPosition | null {
  if (!idOrName) return null;

  const customTemplates = getStoredCustomTemplates();
  const lower = idOrName.toLowerCase();
  const customMatch = customTemplates.find(
    (t) => t.id === idOrName || t.nama.toLowerCase() === lower
  );
  if (customMatch) {
    return {
      id: customMatch.id,
      name: customMatch.nama,
      category: customMatch.kategori || customMatch.departemen,
      department: customMatch.departemen,
      division: customMatch.divisi,
      level: customMatch.level,
      isCustom: true,
      sourceFile: 'custom',
    };
  }

  const liteMatch = LITE_BY_ID.get(idOrName) || LITE_BY_NAME.get(lower);
  if (liteMatch) {
    return {
      id: liteMatch.id,
      name: liteMatch.nama,
      category: liteMatch.kategori || liteMatch.departemen || 'General',
      department: liteMatch.departemen,
      division: liteMatch.divisi,
      level: liteMatch.level,
      isCustom: false,
      sourceFile: liteMatch.sourceFile,
    };
  }

  return null;
}

/**
 * Returns all available positions combining custom templates and lightweight catalog metadata
 */
export function getAllPositions(): UnifiedPosition[] {
  const positionsMap = new Map<string, UnifiedPosition>();

  const customTemplates = getStoredCustomTemplates();
  customTemplates.forEach((tpl) => {
    positionsMap.set(tpl.id, {
      id: tpl.id,
      name: tpl.nama,
      category: tpl.kategori || tpl.departemen,
      department: tpl.departemen,
      division: tpl.divisi,
      level: tpl.level,
      isCustom: true,
      sourceFile: 'custom',
    });
  });

  POSITION_INDEX_LITE.forEach((tpl) => {
    if (!positionsMap.has(tpl.id)) {
      positionsMap.set(tpl.id, {
        id: tpl.id,
        name: tpl.nama,
        category: tpl.kategori || tpl.departemen || 'General',
        department: tpl.departemen,
        division: tpl.divisi,
        level: tpl.level,
        isCustom: false,
        sourceFile: tpl.sourceFile,
      });
    }
  });

  return Array.from(positionsMap.values());
}

/**
 * Retrieves a detailed JobTemplate (raw data) by ID on demand.
 * Checks custom templates first, then lazy-loads the base template catalog if not yet cached.
 */
export async function getJobTemplateDetails(id: string): Promise<JobTemplate | null> {
  const customTemplates = getStoredCustomTemplates();
  const customMatch = customTemplates.find((t) => t.id === id);
  if (customMatch) return customMatch;

  if (allBaseTemplatesMap.size === 0) {
    await preloadJobTemplates();
  }

  return allBaseTemplatesMap.get(id) || null;
}

/**
 * Prepares combobox options for position selection without loading 1.9 MB template bodies
 */
export function getPositionComboboxOptions(): ComboboxOption[] {
  const allPos = getAllPositions();

  const groups: Record<string, UnifiedPosition[]> = {};
  allPos.forEach((p) => {
    const groupName = p.category || p.department || 'Lainnya';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(p);
  });

  const options: ComboboxOption[] = [];

  Object.keys(groups)
    .sort()
    .forEach((groupName) => {
      const sortedPositions = groups[groupName].sort((a, b) => a.name.localeCompare(b.name));
      sortedPositions.forEach((p) => {
        options.push({
          value: p.id,
          label: p.name,
        });
      });
    });

  return options;
}

/**
 * Exports and saves a position into database / custom template storage
 */
export async function exportAndSavePosition(
  identifier: string,
  overrides?: {
    category?: string;
    department?: string;
    division?: string;
    level?: string;
  }
): Promise<{ id: string; name: string; department: string; division: string; level: string; category: string }> {
  const existing = findLitePosition(identifier);

  const id = existing?.id || identifier;
  const name = existing?.name || identifier;
  const department = overrides?.department || existing?.department || 'General';
  const division = overrides?.division || existing?.division || '';
  const level = overrides?.level || existing?.level || 'Staff';
  const category = overrides?.category || existing?.category || department || 'General';

  try {
    await db.positions.put({
      id,
      name,
      departmentId: department,
    });
  } catch {
    // Ignore db put errors if offline
  }

  return { id, name, department, division, level, category };
}

/**
 * Returns the name of the position based on its ID (O(1) lookup)
 */
export function getPositionName(id?: string, defaultName: string = ''): string {
  if (!id) return defaultName;
  const match = findLitePosition(id);
  return match ? match.name : id;
}

/**
 * Returns detailed position information. Uses custom templates & cached full templates synchronously,
 * and gracefully falls back to lightweight metadata + default salary scale if full templates haven't been loaded yet.
 */
export function getPositionDetails(id: string): PositionDetails | null {
  if (!id) return null;

  const match = findLitePosition(id);
  const customTemplates = getStoredCustomTemplates();
  const lower = id.toLowerCase();
  const tpl =
    customTemplates.find((t) => t.id === id || t.nama.toLowerCase() === lower) ||
    allBaseTemplatesMap.get(match?.id || id);

  const baseLevel = match?.level || tpl?.level || 'Staff';
  const salaryRange = tpl?.kompensasi?.gajiPokok;
  const salary = salaryRange?.standar || getDefaultSalaryForLevel(baseLevel);

  const fixedAllowances =
    tpl?.kompensasi?.tunjanganTetap ||
    (tpl?.kompensasi?.tunjangan
      ? tpl.kompensasi.tunjangan.filter((t) => t.includes('tetap') || t.includes('jabatan'))
      : []);

  const variableAllowances =
    tpl?.kompensasi?.tunjanganTidakTetap ||
    (tpl?.kompensasi?.tunjangan
      ? tpl.kompensasi.tunjangan.filter((t) => !t.includes('tetap') && !t.includes('jabatan'))
      : []);

  const bpjs = tpl?.kompensasi?.bpjs || [];
  const pajak = tpl?.kompensasi?.pajak || [];
  const pajakRuleId = tpl?.kompensasi?.pajakRuleId;
  const documents = tpl?.dokumenAdministrasi;
  const requiredDocuments = tpl?.dokumenAdministrasi?.wajib || [];

  return {
    id: match?.id || id,
    name: match?.name || tpl?.nama || id,
    category: match?.category || tpl?.kategori,
    department: match?.department || tpl?.departemen || 'General',
    division: match?.division || tpl?.divisi,
    level: baseLevel,
    isCustom: match?.isCustom ?? false,
    sourceFile: match?.sourceFile,
    salary,
    salaryRange,
    fixedAllowances,
    variableAllowances,
    bpjs,
    pajak,
    pajakRuleId,
    taxRuleId: pajakRuleId,
    documents,
    dokumenAdministrasi: documents,
    requiredDocuments,
    rawTemplate: tpl,
  };
}

/**
 * Ensures full JobTemplate payloads are loaded before resolving complete compensation,
 * allowances, BPJS, and document requirements for a position.
 */
export async function getPositionDetailsAsync(id: string): Promise<PositionDetails | null> {
  if (!id) return null;
  if (allBaseTemplatesMap.size === 0) {
    await preloadJobTemplates();
  }
  return getPositionDetails(id);
}

export function getDefaultSalaryForLevel(level: string): number {
  switch (level) {
    case 'Director':
      return 150000000;
    case 'General Manager':
      return 70000000;
    case 'Senior Manager':
      return 45000000;
    case 'Manager':
      return 25000000;
    case 'Assistant Manager':
      return 18000000;
    case 'Supervisor':
      return 12000000;
    case 'Team Lead':
      return 9000000;
    case 'Senior Staff':
      return 7000000;
    case 'Staff':
      return 5000000;
    case 'Supporting / Pelaksana':
      return 4000000;
    case 'Magang / Internship':
      return 2000000;
    default:
      return 5000000;
  }
}

/**
 * Returns clean human-readable department name from ID or Name or Position ID (O(1) lookup)
 */
export function getDepartmentName(idOrName?: string, positionId?: string, fallback: string = 'Umum'): string {
  if (positionId) {
    const pos = findLitePosition(positionId);
    if (pos?.department && !pos.department.startsWith('dept-') && pos.department !== 'General') {
      return pos.department;
    }
  }

  return resolveDeptName(idOrName, positionId, fallback);
}
