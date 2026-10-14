import { JobTemplate, IndexJobTemplate } from './types';
import sampleJobDesks from '../../data/sampleDb/jobdesk';

const STORAGE_KEY = 'job_desk_custom_templates_v2';

export function getStoredCustomTemplates(): JobTemplate[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    // Clean and deduplicate by ID
    const seen = new Set<string>();
    const cleaned: JobTemplate[] = [];
    for (const item of parsed) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        cleaned.push(item);
      }
    }
    return cleaned;
  } catch (error) {
    console.error('Failed to parse custom job templates from localStorage:', error);
    return [];
  }
}

export function saveCustomTemplate(template: JobTemplate): JobTemplate[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [template];
    const current = getStoredCustomTemplates();
    const existingIndex = current.findIndex(t => t.id === template.id);
    let updated: JobTemplate[];
    
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = template;
    } else {
      updated = [template, ...current];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save custom job template:', error);
    return [];
  }
}

export function deleteCustomTemplate(id: string): JobTemplate[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const current = getStoredCustomTemplates();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete custom job template:', error);
    return [];
  }
}

export function convertToJobIndex(template: JobTemplate): IndexJobTemplate {
  return {
    id: template.id,
    nama: template.nama,
    kategori: template.kategori || template.departemen,
    atasanLangsung: template.atasanLangsung,
    departemen: template.departemen,
    divisi: template.divisi,
    level: template.level,
    tujuanJabatan: template.tujuanJabatan,
    sourceFile: 'custom',
    jumlahTugas: template.tanggungJawab ? template.tanggungJawab.length : 0,
    jumlahKpi: template.kpi ? template.kpi.length : 0,
  };
}
