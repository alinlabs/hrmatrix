import { sampleDepartments } from '../data/sampleDb/pengelola-data';
import { JobTemplate } from '../pages/job-desk/types';

export const STANDARD_DEPARTMENT_MAP: Record<string, string> = {
  'dept-direksi': 'Direksi & Eksekutif',
  'dept-manufaktur': 'Manufaktur',
  'dept-qualityassurance': 'Quality Assurance',
  'dept-qa': 'Quality Assurance',
  'dept-teknik': 'Teknik',
  'dept-logistik': 'Logistik',
  'dept-sdm': 'Sumber Daya Manusia',
  'dept-hrd': 'Sumber Daya Manusia',
  'dept-perkantoran': 'Umum & Administrasi',
  'dept-teknologi': 'Teknologi Informasi',
  'dept-it': 'Teknologi Informasi',
  'dept-keuangan': 'Keuangan & Akuntansi',
  'dept-pemasaran': 'Pemasaran & Komunikasi',
  'dept-penjualan': 'Penjualan & Bisnis',
  'dept-operasional': 'Operasional',
  'dept-legal': 'Legal & Kepatuhan',
  'dept-rantai-pasok': 'Rantai Pasok & Logistik',
  'dept-fnb': 'F&B & Hospitality',
  'dept-kreatif': 'Kreatif & Desain',
};

/**
 * Returns human-readable department name from ID or name, syncing with job templates if needed
 */
export function getDepartmentName(idOrName?: string, positionId?: string, fallback: string = 'Umum'): string {
  if (!idOrName && !positionId) return fallback;

  const raw = (idOrName || '').trim();

  // 1. Direct standard map match
  if (raw && STANDARD_DEPARTMENT_MAP[raw.toLowerCase()]) {
    return STANDARD_DEPARTMENT_MAP[raw.toLowerCase()];
  }

  // 2. Check in sampleDepartments
  if (raw && sampleDepartments && Array.isArray(sampleDepartments)) {
    const matchedDept = sampleDepartments.find(
      d => d.id.toLowerCase() === raw.toLowerCase() || d.name.toLowerCase() === raw.toLowerCase()
    );
    if (matchedDept && matchedDept.name) {
      return matchedDept.name;
    }
  }

  // 3. If raw starts with dept-, clean and format
  if (raw && raw.toLowerCase().startsWith('dept-')) {
    const slug = raw.substring(5).replace(/[-_]+/g, ' ').trim();
    if (slug) {
      return slug
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  // 4. If raw is already a valid human-readable string (does not look like an internal ID)
  if (raw && !raw.startsWith('dept-') && !raw.startsWith('TPL-') && !raw.startsWith('pos-')) {
    return raw;
  }

  return raw || fallback;
}

export default getDepartmentName;
