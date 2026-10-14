import { db } from '../db/database';
import { JobTemplate, IndexJobTemplate } from '../pages/job-desk/types';
import { getStoredCustomTemplates, saveCustomTemplate } from '../pages/job-desk/storage-helper';
import baseIndexList, { allTemplates } from '../data/jobs/index';
import sampleJobDesks, { presidentDirectorTemplate } from '../data/sampleDb/jobdesk';
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
  rawTemplate?: any;
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

// Master map of all base template details by id
const allBaseTemplatesMap = new Map<string, JobTemplate>();

// 1. Register presidentDirectorTemplate first
if (presidentDirectorTemplate) {
  allBaseTemplatesMap.set(presidentDirectorTemplate.id, presidentDirectorTemplate);
}

// 2. Register sample job desks from demo dataset
if (sampleJobDesks && Array.isArray(sampleJobDesks)) {
  sampleJobDesks.forEach(tpl => {
    if (tpl && tpl.id) {
      allBaseTemplatesMap.set(tpl.id, tpl);
    }
  });
}

// 3. Register all standard catalog templates from src/data/jobs/*.ts
allTemplates.forEach(tpl => {
  allBaseTemplatesMap.set(tpl.id, tpl);
});

/**
 * Returns all available positions combining base templates, custom templates, and DB positions
 */
export function getAllPositions(): UnifiedPosition[] {
  const positionsMap = new Map<string, UnifiedPosition>();

  // 1. Custom Templates & Active Company Job Desks from localStorage
  const customTemplates = getStoredCustomTemplates();
  customTemplates.forEach(tpl => {
    positionsMap.set(tpl.id, {
      id: tpl.id,
      name: tpl.nama,
      category: tpl.kategori || tpl.departemen,
      department: tpl.departemen,
      division: tpl.divisi,
      level: tpl.level,
      isCustom: true,
      sourceFile: 'custom'
    });
  });

  // 2. Sample Job Desks (including President Director & CEO)
  if (sampleJobDesks && Array.isArray(sampleJobDesks)) {
    sampleJobDesks.forEach(tpl => {
      if (tpl && tpl.id && !positionsMap.has(tpl.id)) {
        positionsMap.set(tpl.id, {
          id: tpl.id,
          name: tpl.nama,
          category: tpl.kategori || tpl.departemen || 'General',
          department: tpl.departemen,
          division: tpl.divisi,
          level: tpl.level,
          isCustom: false,
          sourceFile: 'jobdesk.ts'
        });
      }
    });
  }

  // 3. Base Templates from JSON Catalog (fill in catalog positions)
  baseIndexList.forEach(tpl => {
    if (!positionsMap.has(tpl.id)) {
      positionsMap.set(tpl.id, {
        id: tpl.id,
        name: tpl.nama,
        category: tpl.kategori || tpl.departemen || 'General',
        department: tpl.departemen,
        division: tpl.divisi,
        level: tpl.level,
        isCustom: false,
        sourceFile: tpl.sourceFile
      });
    }
  });

  return Array.from(positionsMap.values());
}

/**
 * Retrieves a detailed JobTemplate (raw data) by ID.
 * It checks custom templates first, then falls back to base templates.
 */
export async function getJobTemplateDetails(id: string): Promise<JobTemplate | null> {
  const customTemplates = getStoredCustomTemplates();
  const customMatch = customTemplates.find(t => t.id === id);
  if (customMatch) return customMatch;

  const baseMatch = allBaseTemplatesMap.get(id);
  if (baseMatch) return baseMatch;

  return null;
}

/**
 * Prepares combobox options for department selection
 */
export function getPositionComboboxOptions(): ComboboxOption[] {
  const allPos = getAllPositions();
  
  // Group by category/department
  const groups: Record<string, UnifiedPosition[]> = {};
  allPos.forEach(p => {
    const groupName = p.category || p.department || 'Lainnya';
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(p);
  });

  const options: ComboboxOption[] = [];
  
  Object.keys(groups).sort().forEach(groupName => {
    const sortedPositions = groups[groupName].sort((a, b) => a.name.localeCompare(b.name));
    sortedPositions.forEach(p => {
      options.push({
        value: p.id,
        label: p.name
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
  const allPos = getAllPositions();
  const existing = allPos.find(p => p.id === identifier || p.name.toLowerCase() === identifier.toLowerCase());

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
      departmentId: department
    });
  } catch {
    // Ignore db put errors if offline
  }

  return { id, name, department, division, level, category };
}

/**
 * Returns the name of the position based on its ID
 */
export function getPositionName(id?: string, defaultName: string = ''): string {
  if (!id) return defaultName;
  
  const allPos = getAllPositions();
  const match = allPos.find(p => p.id === id || p.name.toLowerCase() === id.toLowerCase());
  return match ? match.name : id;
}

/**
 * Returns detailed position information including compensation, BPJS, allowances, and documents
 */
export function getPositionDetails(id: string): PositionDetails | null {
  if (!id) return null;

  const allPos = getAllPositions();
  const match = allPos.find(p => p.id === id || p.name.toLowerCase() === id.toLowerCase());
  
  const customTemplates = getStoredCustomTemplates();
  const tpl = customTemplates.find(t => t.id === id || t.nama.toLowerCase() === id.toLowerCase()) ||
    allBaseTemplatesMap.get(id);

  const baseLevel = match?.level || tpl?.level || 'Staff';
  const salaryRange = tpl?.kompensasi?.gajiPokok;
  const salary = salaryRange?.standar || getDefaultSalaryForLevel(baseLevel);

  const fixedAllowances = tpl?.kompensasi?.tunjanganTetap || 
    (tpl?.kompensasi?.tunjangan ? tpl.kompensasi.tunjangan.filter(t => t.includes('tetap') || t.includes('jabatan')) : []);
  
  const variableAllowances = tpl?.kompensasi?.tunjanganTidakTetap || 
    (tpl?.kompensasi?.tunjangan ? tpl.kompensasi.tunjangan.filter(t => !t.includes('tetap') && !t.includes('jabatan')) : []);

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
    rawTemplate: tpl
  };
}

export function getDefaultSalaryForLevel(level: string): number {
  switch(level) {
    case 'Director': return 150000000;
    case 'General Manager': return 70000000;
    case 'Senior Manager': return 45000000;
    case 'Manager': return 25000000;
    case 'Assistant Manager': return 18000000;
    case 'Supervisor': return 12000000;
    case 'Team Lead': return 9000000;
    case 'Senior Staff': return 7000000;
    case 'Staff': return 5000000;
    case 'Supporting / Pelaksana': return 4000000;
    case 'Magang / Internship': return 2000000;
    default: return 5000000;
  }
}

/**
 * Returns clean human-readable department name from ID or Name or Position ID
 */
export function getDepartmentName(idOrName?: string, positionId?: string, fallback: string = 'Umum'): string {
  if (positionId) {
    const details = getPositionDetails(positionId);
    if (details?.department && !details.department.startsWith('dept-') && details.department !== 'General') {
      return details.department;
    }
  }

  return resolveDeptName(idOrName, positionId, fallback);
}

