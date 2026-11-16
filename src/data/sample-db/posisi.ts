import { POSITION_INDEX_LITE } from '../jobs/position-index-lite';
import rawDepartments from './departemen';

export interface SamplePosition {
  id: string;
  name: string;
  departmentId: string;
  departmentName?: string;
}

const sampleJobDesksLite = POSITION_INDEX_LITE.filter((j) => j.sourceFile === 'jobdesk.ts');

/**
 * SAMPLE DATABASE: POSISI / JABATAN RESMI
 * 
 * Terkonfigurasi 1-to-1 secara dinamis dengan Job Desk (src/data/sampleDb/jobdesk.ts)
 * melalui indeks ringan (position-index-lite.ts) tanpa menarik seluruh payload jobdesk.
 */
export const samplePositions: SamplePosition[] = sampleJobDesksLite.map((j) => {
  const deptMatch = rawDepartments.find(
    (d) => d.name.toLowerCase() === (j.departemen || '').toLowerCase()
  );

  const departmentId = deptMatch ? deptMatch.id : (j.departemen || 'dept-manufaktur');

  return {
    id: j.id,
    name: j.nama,
    departmentId,
    departmentName: j.departemen || deptMatch?.name || 'Umum',
  };
});

export default samplePositions;
