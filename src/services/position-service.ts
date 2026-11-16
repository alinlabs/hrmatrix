import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import type { ComboboxOption } from '../components/ui';
import { POSITION_INDEX_LITE, LitePositionEntry } from '../data/jobs/position-index-lite';
import type { JobTemplate } from '../pages/job-desk/types';
import { getStoredCustomTemplates, saveCustomTemplate } from '../pages/job-desk/storage-helper';
import { enrichJobTemplateWithStructuredFields } from '../pages/job-desk/qualification-options';

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
      const list = (mod as any).allTemplates || (mod as any).ALL_JOB_TEMPLATES || (mod as any).default || [];
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

function buildFallbackJobTemplate(
  id: string,
  name: string,
  department: string,
  division: string,
  category: string,
  level: string
): JobTemplate {
  const salary = getDefaultSalaryForLevel(level);
  const cleanDept = department || 'Operasional Umum';
  const cleanCat = category || 'Umum';
  return enrichJobTemplateWithStructuredFields({
    id,
    nama: name,
    kategori: cleanCat,
    departemen: cleanDept,
    divisi: division || 'Operational Division',
    level: level || 'Staff',
    atasanLangsung: level.toLowerCase().includes('manager') ? 'Director' : 'Manager / Head of Department',
    tujuanJabatan: `Bertanggung jawab atas pengelolaan, pelaksanaan operasional, dan pencapaian target kerja pada posisi ${name} di departemen ${cleanDept}.`,
    fungsiUtama: ['Perencanaan & Koordinasi', 'Eksekusi Operasional', 'Monitoring & Pelaporan', 'Perbaikan Berkelanjutan'],
    tanggungJawab: [
      `Melaksanakan tugas pokok dan alur kerja harian yang relevan dengan posisi ${name}.`,
      `Memastikan setiap target kinerja (KPI) tercapai sesuai standar mutu departemen ${cleanDept}.`,
      'Melakukan koordinasi lintas tim internal maupun pihak terkait secara efektif.',
      'Menyusun laporan kinerja berkala serta dokumentasi operasional sesuai SOP perusahaan.',
    ],
    wewenang: [
      'Mengambil keputusan operasional harian dalam ruang lingkup tugas dan wewenang posisinya.',
      'Memberikan rekomendasi perbaikan alur kerja kepada atasan langsung.',
    ],
    kpi: [
      {
        id: `KPI-${id}-1`,
        nama: 'Pencapaian Target Output & Produktivitas',
        deskripsi: `Tingkat penyelesaian deliverables kerja utama posisi ${name} sesuai target.`,
        minimumSkor: 80,
        bobot: 40,
        dasarUkur: 'Laporan Kinerja & Dashboard Operasional',
      },
      {
        id: `KPI-${id}-2`,
        nama: 'Ketepatan Waktu & Efisiensi SLA',
        deskripsi: 'Ketepatan waktu penyelesaian tugas harian sesuai Service Level Agreement (SLA).',
        minimumSkor: 75,
        bobot: 35,
        dasarUkur: 'Log Monitoring SLA & Evaluasi Proses',
      },
      {
        id: `KPI-${id}-3`,
        nama: 'Kualitas Hasil Kerja & Kepatuhan SOP',
        deskripsi: 'Akurasi pekerjaan, kepatuhan SOP perusahaan, serta evaluasi atasan langsung.',
        minimumSkor: 75,
        bobot: 25,
        dasarUkur: 'Evaluasi Supervisi & Quality Control',
      },
    ],
    kualifikasi: {
      pendidikan: `Minimal S1 atau setara di bidang yang relevan dengan departemen ${cleanDept}.`,
      pengalaman: `Minimal 2-3 tahun pengalaman relevan sebagai ${name}.`,
      sertifikasi: ['Sertifikasi profesi terkait (Diutamakan)'],
      syaratKhusus: [`Memahami standar operasional dan kepatuhan regulasi pada bidang ${cleanCat}.`],
    },
    kompetensi: {
      teknis: ['Penguasaan Sistem & Tools Kerja', 'Analisis Operasional', 'Problem Solving'],
      nonTeknis: ['Komunikasi Efektif', 'Kerjasama Tim', 'Kedisiplinan', 'Adaptabilitas'],
    },
    hubunganKerja: {
      internal: ['Atasan Langsung', 'Rekan Satu Departemen', 'Tim Lintas Departemen'],
      eksternal: ['Mitra Kerja', 'Vendor Terkait'],
    },
    outputDiharapkan: [
      'Operasional kerja berjalan tertib, akurat, dan tepat waktu.',
      'Laporan berkala tersaji lengkap sebagai bahan evaluasi manajemen.',
    ],
    kompensasi: {
      gajiPokok: {
        minimal: Math.round(salary * 0.8),
        standar: salary,
        maksimal: Math.round(salary * 1.35),
      },
      tunjangan: ['tunjangan_jabatan', 'tunjangan_transportasi', 'tunjangan_makan'],
      bpjs: ['rule_bpjs_kes_1', 'rule_jht_1', 'rule_jp_1', 'rule_jkk_1', 'rule_jkm_1'],
      pajak: ['rule_pph21_ter'],
      pajakRuleId: 'rule_pph21_ter',
      fasilitas: ['Asuransi Kesehatan Swasta', 'Perangkat Kerja', 'Program Pelatihan'],
    },
    dokumenAdministrasi: {
      wajib: ['KTP', 'NPWP', 'Ijazah', 'CV'],
      pendukung: ['Sertifikat Pelatihan', 'Referensi Kerja'],
      khusus: [],
    },
  });
}

function resolveFullTemplateForPosition(
  posId: string,
  posName: string,
  overrides?: {
    category?: string;
    department?: string;
    division?: string;
    level?: string;
  }
): JobTemplate {
  const cached = fullTemplatesCache.get(posId) || fullTemplatesCache.get(posName.toLowerCase());
  const rawDept = overrides?.department && overrides.department !== 'General' && !overrides.department.startsWith('dept-')
    ? overrides.department
    : undefined;
  const rawCat = overrides?.category && overrides.category !== 'General' ? overrides.category : undefined;
  const rawDiv = overrides?.division || undefined;
  const rawLevel = overrides?.level || undefined;

  if (cached && Array.isArray(cached.tanggungJawab)) {
    const cloned: JobTemplate = JSON.parse(JSON.stringify(cached));
    cloned.id = posId || cloned.id;
    if (rawDept) cloned.departemen = rawDept;
    if (rawCat) cloned.kategori = rawCat;
    if (rawDiv) cloned.divisi = rawDiv;
    if (rawLevel) cloned.level = rawLevel;
    return enrichJobTemplateWithStructuredFields(cloned);
  }

  const lite = liteByIdMap.get(posId) || liteByNameMap.get(posName.toLowerCase());
  return buildFallbackJobTemplate(
    posId,
    lite?.nama || posName || posId,
    rawDept || lite?.departemen || 'Operasional Umum',
    rawDiv || lite?.divisi || 'Operational Division',
    rawCat || lite?.kategori || 'Umum',
    rawLevel || lite?.level || 'Staff'
  );
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
  let dept = existingDepts.find(
    (d) => d.id === deptName || d.name.toLowerCase() === deptName.toLowerCase()
  );
  if (!dept) {
    const resolvedDeptName = deptName.startsWith('dept-') ? (details?.department || 'Operasional Umum') : deptName;
    const createdDept = {
      id: `dept-${uuidv4().slice(0, 8)}`,
      name: resolvedDeptName,
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

  // Ensure corresponding Job Desk template is exported into job_desk_custom_templates_v2
  const storedJobDesks = getStoredCustomTemplates();
  const alreadyExported = storedJobDesks.some(
    (t) => t.id === resolvedPosId || t.nama.toLowerCase() === posName.toLowerCase()
  );
  if (!alreadyExported) {
    const exportedTemplate = resolveFullTemplateForPosition(resolvedPosId, posName, {
      department: dept.name,
      category: category || undefined,
      division: division || undefined,
      level: level || undefined,
    });
    saveCustomTemplate(exportedTemplate);
  }

  return {
    id: resolvedPosId,
    department: dept.name,
    category: category || undefined,
    level: level || undefined,
    division: division || undefined,
  };
}

/**
 * Menjamin seluruh posisi pada db.positions dan db.employees memiliki Job Desk
 * yang sudah ter-export di storage Job Desk (job_desk_custom_templates_v2).
 */
export async function syncPositionsToJobDesks(): Promise<JobTemplate[]> {
  await preloadJobTemplates();

  const [positions, departments, employees] = await Promise.all([
    db.positions.toArray(),
    db.departments.toArray(),
    db.employees.toArray(),
  ]);

  const deptById = new Map(departments.map((d) => [d.id, d.name]));
  const stored = getStoredCustomTemplates();
  const storedById = new Set(stored.map((t) => t.id));
  const storedByName = new Set(stored.map((t) => t.nama.toLowerCase()));

  let changed = false;

  // 1. Pastikan posisi yang ada di db.positions memiliki Job Desk
  for (const pos of positions) {
    if (!pos?.id) continue;
    const posName = pos.name || getPositionName(pos.id, pos.id);
    if (storedById.has(pos.id) || storedByName.has(posName.toLowerCase())) continue;

    const deptName = deptById.get(pos.departmentId) || pos.departmentId;
    const tpl = resolveFullTemplateForPosition(pos.id, posName, { department: deptName });
    saveCustomTemplate(tpl);
    storedById.add(tpl.id);
    storedByName.add(tpl.nama.toLowerCase());
    changed = true;
  }

  // 2. Pastikan setiap positionId yang dimiliki karyawan memiliki Position + Job Desk
  for (const emp of employees) {
    const posId = emp.positionId;
    if (!posId) continue;
    const posName = getPositionName(posId, posId);
    const deptName = deptById.get(emp.departmentId) || emp.departmentId;

    if (!positions.some((p) => p.id === posId)) {
      await db.positions.put({
        id: posId,
        name: posName,
        departmentId: emp.departmentId || 'General',
      });
    }

    if (!storedById.has(posId) && !storedByName.has(posName.toLowerCase())) {
      const tpl = resolveFullTemplateForPosition(posId, posName, {
        department: deptName,
        category: emp.category,
        division: emp.division,
        level: emp.level,
      });
      saveCustomTemplate(tpl);
      storedById.add(tpl.id);
      storedByName.add(tpl.nama.toLowerCase());
      changed = true;
    }
  }

  return changed ? getStoredCustomTemplates() : stored;
}
